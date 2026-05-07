import mongoose from "mongoose";
import Commande from "../models/Commande.js";
import Unit from "../models/Unit.js";

// ── Populate standard pour toutes les requêtes ─────────────
const POPULATE = [
  { path: "client",     select: "prenom nom tel quartier adresse" },
  { path: "equipement", select: "name icon cat cardColor caution ref photo" },
  { path: "unite",      select: "serial barcode statut etat" },
];

// GET /api/commandes?statut=&client=
const getAllCommandes = async (req, res) => {
  try {
    const filter = {};
    if (req.query.statut) filter.statut = req.query.statut;
    if (req.query.client) filter.client = req.query.client;

    const commandes = await Commande.find(filter)
      .populate(POPULATE)
      .sort({ createdAt: -1 });

    res.json({ success: true, data: commandes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/commandes/:id
const getCommandeById = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id).populate(POPULATE);
    if (!commande) {
      return res.status(404).json({ success: false, message: "Commande non trouvée" });
    }
    res.json({ success: true, data: commande });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/commandes
const createCommande = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      client, equipement, unite,
      serialNumber, barcode,
      dateDebut, dateFin,
      modePaiement, montantHT, tauxTVA, montantTTC,
      montantCaution, modeCaution, lignes, note,
    } = req.body;

    if (!client)       return res.status(400).json({ success: false, message: "Client requis" });
    if (!equipement)   return res.status(400).json({ success: false, message: "Équipement requis" });
    if (!dateDebut)    return res.status(400).json({ success: false, message: "Date de début requise" });
    if (!dateFin)      return res.status(400).json({ success: false, message: "Date de fin requise" });
    if (!montantTTC)   return res.status(400).json({ success: false, message: "Montant TTC requis" });
    if (!modePaiement) return res.status(400).json({ success: false, message: "Mode de paiement requis" });

    let uniteId = unite || null;

    // Cas 1 : unité existante sélectionnée
    if (unite) {
      const unit = await Unit.findById(unite).session(session);
      if (!unit) {
        await session.abortTransaction();
        return res.status(404).json({ success: false, message: "Unité non trouvée" });
      }
      if (unit.statut !== "disponible") {
        await session.abortTransaction();
        return res.status(400).json({ success: false, message: `Unité non disponible (${unit.statut})` });
      }
    }

    // Cas 2 : nouveau N° de série → créer l'unité automatiquement
    if (!unite && serialNumber) {
      if (!barcode) {
        await session.abortTransaction();
        return res.status(400).json({ success: false, message: "Code-barres requis" });
      }
      const [newUnit] = await Unit.create([{
        equipement,
        serial:  serialNumber.toUpperCase().trim(),
        barcode: barcode.trim(),
        statut:  "disponible",
        etat:    "bon",
      }], { session });
      uniteId = newUnit._id;
    }

    // Créer la commande
    const [commande] = await Commande.create([{
      client, equipement,
      unite:          uniteId,
      dateDebut:      new Date(dateDebut),
      dateFin:        new Date(dateFin),
      modePaiement,
      montantHT:      montantHT || 0,
      tauxTVA:        tauxTVA || 20,
      montantTVA:     Math.round((montantHT || 0) * ((tauxTVA || 20) / 100)),
      montantTTC,
      montantCaution: montantCaution || 0,
      modeCaution:    modeCaution || "cash",
      lignes:         lignes || [],
      note:           note || "",
      statut:         "pending",
      historique: [{ statut: "pending", note: "Commande créée", user: req.user._id }],
    }], { session });

    // Mettre à jour le statut de l'unité → "loue"
    if (uniteId) {
      await Unit.findByIdAndUpdate(uniteId, {
        statut:         "loue",
        commandeActive: commande._id,
        clientActuel:   client,
      }, { session });
    }

    await session.commitTransaction();

    const populated = await Commande.findById(commande._id).populate(POPULATE);
    res.status(201).json({ success: true, data: populated, message: "Commande créée avec succès" });
  } catch (error) {
    await session.abortTransaction();
    console.error("Erreur createCommande:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        errors: Object.values(error.errors).map((e) => e.message),
      });
    }
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// PUT /api/commandes/:id
const updateCommande = async (req, res) => {
  try {
    const updates = { ...req.body };
    // Convertir les dates en Date
    if (updates.dateDebut) updates.dateDebut = new Date(updates.dateDebut);
    if (updates.dateFin)   updates.dateFin   = new Date(updates.dateFin);
    // Ne pas modifier les relations unité via ce endpoint
    delete updates.unite;

    const commande = await Commande.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate(POPULATE);

    if (!commande) {
      return res.status(404).json({ success: false, message: "Commande non trouvée" });
    }
    res.json({ success: true, data: commande, message: "Commande mise à jour" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/commandes/:id
const deleteCommande = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const commande = await Commande.findById(req.params.id).session(session);
    if (!commande) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Commande non trouvée" });
    }

    // Libérer l'unité si elle était assignée
    if (commande.unite) {
      await Unit.findByIdAndUpdate(commande.unite, {
        statut:         "disponible",
        commandeActive: null,
        clientActuel:   null,
      }, { session });
    }

    await commande.deleteOne({ session });
    await session.commitTransaction();
    res.json({ success: true, message: "Commande supprimée" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// PUT /api/commandes/:id/statut
const updateStatut = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { statut } = req.body;
    const STATUTS_VALIDES = ["pending", "active", "transit", "ended", "cancelled"];

    if (!STATUTS_VALIDES.includes(statut)) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: "Statut invalide" });
    }

    const commande = await Commande.findById(req.params.id).session(session);
    if (!commande) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: "Commande non trouvée" });
    }

    // Synchroniser le statut de l'unité
    if (commande.unite) {
      let unitStatut = "disponible";
      if (statut === "active" || statut === "transit") unitStatut = "loue";
      if (statut === "ended" || statut === "cancelled") unitStatut = "disponible";

      await Unit.findByIdAndUpdate(commande.unite, {
        statut: unitStatut,
        ...(unitStatut === "disponible" ? { commandeActive: null, clientActuel: null } : {}),
      }, { session });
    }

    // Ajouter au historique
    commande.statut = statut;
    commande.historique.push({
      statut,
      note: `Statut changé vers ${statut}`,
      user: req.user._id,
    });
    await commande.save({ session });

    await session.commitTransaction();

    const populated = await Commande.findById(commande._id).populate(POPULATE);
    res.json({ success: true, data: populated, message: "Statut mis à jour" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// POST /api/commandes/:id/reconduire
const reconduireCommande = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id);
    if (!commande) {
      return res.status(404).json({ success: false, message: "Commande non trouvée" });
    }

    const { type, dateFin, montantTTC, note } = req.body;
    if (!dateFin) return res.status(400).json({ success: false, message: "Date de fin requise" });

    const nouvelle = await Commande.create({
      client:           commande.client,
      equipement:       commande.equipement,
      unite:            commande.unite,
      dateDebut:        commande.dateFin,
      dateFin:          new Date(dateFin),
      modePaiement:     commande.modePaiement,
      montantTTC:       montantTTC || commande.montantTTC,
      montantCaution:   commande.montantCaution,
      statut:           "pending",
      commandeParente:  commande._id,
      typeReconduction: type || "prolongation",
      note:             note || `Reconduction de ${commande.reference}`,
    });

    const populated = await Commande.findById(nouvelle._id).populate(POPULATE);
    res.status(201).json({ success: true, data: populated, message: "Commande reconduite" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getAllCommandes, getCommandeById, createCommande,
  updateCommande, deleteCommande, updateStatut, reconduireCommande,
};