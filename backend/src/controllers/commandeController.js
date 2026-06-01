import mongoose from "mongoose";
import Commande from "../models/Commande.js";
import Unit from "../models/Unit.js";

const POPULATE = [
  { path: "client",     select: "prenom nom tel quartier adresse cinNum" },
  { path: "equipement", select: "name icon cat cardColor caution ref photo" },
  { path: "unite",      select: "serial barcode statut etat" },
];

// GET /api/commandes
const getAllCommandes = async (req, res) => {
  try {
    const filter = {};
    if (req.magasinId) filter.magasin = req.magasinId;
    if (req.query.statut) filter.statut = req.query.statut;
    if (req.query.client) filter.client = req.query.client;
    const commandes = await Commande.find(filter).populate(POPULATE).sort({ createdAt: -1 });
    res.json({ success: true, data: commandes });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// GET /api/commandes/:id
const getCommandeById = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const commande = await Commande.findOne(filter).populate(POPULATE);
    if (!commande) return res.status(404).json({ success: false, message: "Commande non trouvée" });
    res.json({ success: true, data: commande });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// POST /api/commandes
const createCommande = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { client, equipement, unite, serialNumber, barcode, dateDebut, dateFin, modePaiement, montantHT, tauxTVA, montantTTC, montantCaution, modeCaution, lignes, note } = req.body;

    if (!client)       return res.status(400).json({ success: false, message: "Client requis" });
    if (!equipement)   return res.status(400).json({ success: false, message: "Équipement requis" });
    if (!dateDebut)    return res.status(400).json({ success: false, message: "Date de début requise" });
    if (!dateFin)      return res.status(400).json({ success: false, message: "Date de fin requise" });
    if (!montantTTC)   return res.status(400).json({ success: false, message: "Montant TTC requis" });
    if (!modePaiement) return res.status(400).json({ success: false, message: "Mode de paiement requis" });

    let uniteId = unite || null;

    if (unite) {
      const unit = await Unit.findById(unite).session(session);
      if (!unit) { await session.abortTransaction(); return res.status(404).json({ success: false, message: "Unité non trouvée" }); }
      if (unit.statut !== "disponible") { await session.abortTransaction(); return res.status(400).json({ success: false, message: `Unité non disponible (${unit.statut})` }); }
    }

    if (!unite && serialNumber) {
      if (!barcode) { await session.abortTransaction(); return res.status(400).json({ success: false, message: "Code-barres requis" }); }
      const [newUnit] = await Unit.create([{ equipement, serial: serialNumber.toUpperCase().trim(), barcode: barcode.trim(), statut: "disponible", etat: "bon" }], { session });
      uniteId = newUnit._id;
    }

    const [commande] = await Commande.create([{
      magasin: req.magasinId || null,
      client, equipement, unite: uniteId,
      dateDebut: new Date(dateDebut), dateFin: new Date(dateFin),
      modePaiement, montantHT: montantHT || 0, tauxTVA: tauxTVA || 20,
      montantTVA: Math.round((montantHT || 0) * ((tauxTVA || 20) / 100)),
      montantTTC, montantCaution: montantCaution || 0, modeCaution: modeCaution || "cash",
      lignes: lignes || [], note: note || "", statut: "pending",
      historique: [{ statut: "pending", note: "Commande créée", user: req.user._id }],
    }], { session });

    if (uniteId) {
      await Unit.findByIdAndUpdate(uniteId, { statut: "loue", commandeActive: commande._id, clientActuel: client }, { session });
    }

    await session.commitTransaction();
    const populated = await Commande.findById(commande._id).populate(POPULATE);
    res.status(201).json({ success: true, data: populated, message: "Commande créée avec succès" });
  } catch (error) {
    await session.abortTransaction();
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Erreur de validation", errors: Object.values(error.errors).map(e => e.message) });
    }
    res.status(500).json({ success: false, message: error.message });
  } finally { session.endSession(); }
};

// PUT /api/commandes/:id
const updateCommande = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.dateDebut) updates.dateDebut = new Date(updates.dateDebut);
    if (updates.dateFin)   updates.dateFin   = new Date(updates.dateFin);
    delete updates.unite;
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const commande = await Commande.findOneAndUpdate(filter, updates, { new: true, runValidators: true }).populate(POPULATE);
    if (!commande) return res.status(404).json({ success: false, message: "Commande non trouvée" });
    res.json({ success: true, data: commande, message: "Commande mise à jour" });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// DELETE /api/commandes/:id
const deleteCommande = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const commande = await Commande.findOne(filter).session(session);
    if (!commande) { await session.abortTransaction(); return res.status(404).json({ success: false, message: "Commande non trouvée" }); }
    if (commande.unite) {
      await Unit.findByIdAndUpdate(commande.unite, { statut: "disponible", commandeActive: null, clientActuel: null }, { session });
    }
    await commande.deleteOne({ session });
    await session.commitTransaction();
    res.json({ success: true, message: "Commande supprimée" });
  } catch (error) { await session.abortTransaction(); res.status(500).json({ success: false, message: error.message }); }
  finally { session.endSession(); }
};

// PUT /api/commandes/:id/statut
const updateStatut = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { statut } = req.body;
    const STATUTS_VALIDES = ["pending", "active", "transit", "ended", "cancelled"];
    if (!STATUTS_VALIDES.includes(statut)) { await session.abortTransaction(); return res.status(400).json({ success: false, message: "Statut invalide" }); }

    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const commande = await Commande.findOne(filter).session(session);
    if (!commande) { await session.abortTransaction(); return res.status(404).json({ success: false, message: "Commande non trouvée" }); }

    if (commande.unite) {
      let unitStatut = "disponible";
      if (statut === "active" || statut === "transit") unitStatut = "loue";
      await Unit.findByIdAndUpdate(commande.unite, {
        statut: unitStatut,
        ...(unitStatut === "disponible" ? { commandeActive: null, clientActuel: null } : {}),
      }, { session });
    }

    commande.statut = statut;
    commande.historique.push({ statut, note: `Statut changé vers ${statut}`, user: req.user._id });
    await commande.save({ session });
    await session.commitTransaction();

    const populated = await Commande.findById(commande._id).populate(POPULATE);
    res.json({ success: true, data: populated, message: "Statut mis à jour" });
  } catch (error) { await session.abortTransaction(); res.status(500).json({ success: false, message: error.message }); }
  finally { session.endSession(); }
};

// POST /api/commandes/:id/reconduire
const reconduireCommande = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const commande = await Commande.findOne(filter);
    if (!commande) return res.status(404).json({ success: false, message: "Commande non trouvée" });
    const { type, dateFin, montantTTC, note } = req.body;
    if (!dateFin) return res.status(400).json({ success: false, message: "Date de fin requise" });

    const nouvelle = await Commande.create({
      magasin: commande.magasin,
      client: commande.client, equipement: commande.equipement, unite: commande.unite,
      dateDebut: commande.dateFin, dateFin: new Date(dateFin),
      modePaiement: commande.modePaiement, montantTTC: montantTTC || commande.montantTTC,
      montantCaution: commande.montantCaution, statut: "pending",
      commandeParente: commande._id, typeReconduction: type || "prolongation",
      note: note || `Reconduction de ${commande.reference}`,
    });

    const populated = await Commande.findById(nouvelle._id).populate(POPULATE);
    res.status(201).json({ success: true, data: populated, message: "Commande reconduite" });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ══════════════════════════════════════════════════════════
//  BON D'ENLÈVEMENT & BON DE RETOUR
// ══════════════════════════════════════════════════════════

// PUT /api/commandes/:id/bon-enlevement
const saveBonEnlevement = async (req, res) => {
  try {
    const { livreur, vehicule, matricule } = req.body;
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const commande = await Commande.findOneAndUpdate(filter, {
      bonEnlevement: { livreur: livreur || "", vehicule: vehicule || "", matricule: matricule || "", date: new Date() }
    }, { new: true }).populate(POPULATE);
    if (!commande) return res.status(404).json({ success: false, message: "Commande non trouvée" });
    res.json({ success: true, data: commande, message: "Bon d'enlèvement enregistré ✅" });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// PUT /api/commandes/:id/bon-retour
const saveBonRetour = async (req, res) => {
  try {
    const { recuperateur, vehicule, matricule, etat, observation } = req.body;
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const commande = await Commande.findOneAndUpdate(filter, {
      bonRetour: { recuperateur: recuperateur || "", vehicule: vehicule || "", matricule: matricule || "", etat: etat || "", observation: observation || "", date: new Date() }
    }, { new: true }).populate(POPULATE);
    if (!commande) return res.status(404).json({ success: false, message: "Commande non trouvée" });
    res.json({ success: true, data: commande, message: "Bon de retour enregistré ✅" });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export {
  getAllCommandes, getCommandeById, createCommande,
  updateCommande, deleteCommande, updateStatut, reconduireCommande,
  saveBonEnlevement, saveBonRetour,
};