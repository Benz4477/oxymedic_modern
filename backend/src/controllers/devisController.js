import Devis    from "../models/Devis.js";
import Commande from "../models/Commande.js";
import Client   from "../models/Client.js";

const POPULATE = [
  { path: "client",   select: "prenom nom tel email adresse quartier" },
  { path: "commande", select: "reference statut montantTTC" },
];

// ── Mapping modes de paiement ─────────────────────────────
const mapMode = (mode) => {
  const map = { 
    espece: "cash_magasin", 
    cheque: "virement", 
    mobile: "virement" 
  };
  return map[mode] || mode;
};

// GET /api/devis
const getAllDevis = async (req, res) => {
  try {
    const filter = { archived: false };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.client) filter.client = req.query.client;

    const devis = await Devis.find(filter).populate(POPULATE).sort({ createdAt: -1 });

    const stats = {
      total:     devis.length,
      draft:     devis.filter(d => d.status === "draft").length,
      sent:      devis.filter(d => d.status === "sent").length,
      accepted:  devis.filter(d => d.status === "accepted").length,
      rejected:  devis.filter(d => d.status === "rejected").length,
      expired:   devis.filter(d => d.status === "expired").length,
      converted: devis.filter(d => d.status === "converted").length,
      totalCA:   devis.filter(d => d.status === "converted").reduce((s, d) => s + d.montantTTC, 0),
    };

    res.json({ success: true, data: devis, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/devis/stats
const getDevisStats = async (req, res) => {
  try {
    const devis = await Devis.find({ archived: false });
    res.json({
      success: true,
      data: {
        total:          devis.length,
        draft:          devis.filter(d => d.status === "draft").length,
        sent:           devis.filter(d => d.status === "sent").length,
        accepted:       devis.filter(d => d.status === "accepted").length,
        rejected:       devis.filter(d => d.status === "rejected").length,
        expired:        devis.filter(d => d.status === "expired").length,
        converted:      devis.filter(d => d.status === "converted").length,
        conversionRate: devis.length > 0
          ? Math.round((devis.filter(d => d.status === "converted").length / devis.length) * 100)
          : 0,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/devis/:id
const getDevisById = async (req, res) => {
  try {
    const devis = await Devis.findById(req.params.id).populate(POPULATE);
    if (!devis) return res.status(404).json({ success: false, message: "Devis non trouvé" });
    res.json({ success: true, data: devis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/devis
const createDevis = async (req, res) => {
  try {
    const { client, clientNom, clientEmail, clientAdresse, dateValidite, lignes, ...rest } = req.body;

    if (!client)       return res.status(400).json({ success: false, message: "Client requis" });
    if (!dateValidite) return res.status(400).json({ success: false, message: "Date de validité requise" });
    if (!lignes?.length) return res.status(400).json({ success: false, message: "Au moins une ligne requise" });

    // Enrichir avec les infos client si pas fournies
    let nom = clientNom, email = clientEmail, adresse = clientAdresse;
    if (!nom) {
      const c = await Client.findById(client);
      if (c) {
        nom    = `${c.prenom} ${c.nom}`;
        email  = c.email  || "";
        adresse = `${c.adresse || ""} ${c.quartier || ""}`.trim();
      }
    }

    const devis = await Devis.create({
      ...rest, client, lignes,
      clientNom: nom || "", clientEmail: email || "", clientAdresse: adresse || "",
      dateValidite: new Date(dateValidite),
      createdBy: req.user?.name || "Admin",
    });

    const populated = await Devis.findById(devis._id).populate(POPULATE);
    res.status(201).json({ success: true, data: populated, message: "Devis créé avec succès" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Erreur de validation", errors: Object.values(error.errors).map(e => e.message) });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/devis/:id
const updateDevis = async (req, res) => {
  try {
    const devis = await Devis.findById(req.params.id);
    if (!devis) return res.status(404).json({ success: false, message: "Devis non trouvé" });
    if (["converted"].includes(devis.status)) {
      return res.status(400).json({ success: false, message: "Impossible de modifier un devis converti" });
    }

    const updates = { ...req.body };
    if (updates.dateValidite) updates.dateValidite = new Date(updates.dateValidite);

    const updated = await Devis.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true }).populate(POPULATE);
    res.json({ success: true, data: updated, message: "Devis mis à jour" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/devis/:id
const deleteDevis = async (req, res) => {
  try {
    const devis = await Devis.findById(req.params.id);
    if (!devis) return res.status(404).json({ success: false, message: "Devis non trouvé" });

    if (devis.status === "accepted") {
      return res.status(400).json({ success: false, message: "Impossible de supprimer un devis accepté" });
    }

    if (devis.status === "converted" && devis.commande) {
      const commande = await Commande.findById(devis.commande);
      if (commande) {
        return res.status(400).json({ success: false, message: "Impossible de supprimer — commande active liée" });
      }
      // Commande supprimée → on continue et on supprime le devis
    }

    await devis.deleteOne();
    res.json({ success: true, message: "Devis supprimé" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/devis/:id/send
const sendDevis = async (req, res) => {
  try {
    const devis = await Devis.findByIdAndUpdate(req.params.id,
      { status: "sent", dateEnvoi: new Date() },
      { new: true }
    ).populate(POPULATE);
    if (!devis) return res.status(404).json({ success: false, message: "Devis non trouvé" });
    res.json({ success: true, data: devis, message: "Devis envoyé" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/devis/:id/accept
const acceptDevis = async (req, res) => {
  try {
    const devis = await Devis.findByIdAndUpdate(req.params.id,
      { status: "accepted", dateAcceptation: new Date() },
      { new: true }
    ).populate(POPULATE);
    if (!devis) return res.status(404).json({ success: false, message: "Devis non trouvé" });
    res.json({ success: true, data: devis, message: "Devis accepté ✅" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/devis/:id/reject
const rejectDevis = async (req, res) => {
  try {
    const devis = await Devis.findByIdAndUpdate(req.params.id,
      { status: "rejected" },
      { new: true }
    ).populate(POPULATE);
    if (!devis) return res.status(404).json({ success: false, message: "Devis non trouvé" });
    res.json({ success: true, data: devis, message: "Devis refusé" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/devis/:id/convert — Convertit en vraie Commande MongoDB
const convertDevis = async (req, res) => {
  try {
    const devis = await Devis.findById(req.params.id).populate("client");
    if (!devis) return res.status(404).json({ success: false, message: "Devis non trouvé" });
    if (devis.status !== "accepted") {
      return res.status(400).json({ success: false, message: "Seuls les devis acceptés peuvent être convertis" });
    }

    const { dateDebut, dateFin, modePaiement, equipement, unite } = req.body;
    console.log("Conversion devis:", { 
      devisId: req.params.id, 
      devisRef: devis.reference, 
      client: devis.client._id, 
      equipement, 
      dateDebut, 
      dateFin, 
      modePaiement 
    });

    const commande = await Commande.create({
      client:       devis.client._id,
      equipement:   equipement || null,
      unite:        unite      || null,
      dateDebut:    dateDebut  ? new Date(dateDebut)  : new Date(),
      dateFin:      dateFin    ? new Date(dateFin)    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      modePaiement: mapMode(modePaiement || "espece"),
      montantHT:    devis.montantHT,
      montantTVA:   devis.montantTVA,
      montantTTC:   devis.montantTTC,
      statut:       "pending",
      note:         `Converti depuis devis ${devis.reference}`,
    });

    console.log("Commande créée:", { 
      commandeId: commande._id, 
      commandeRef: commande.reference, 
      clientId: commande.client,
      montant: commande.montantTTC 
    });

    const updatedDevis = await Devis.findByIdAndUpdate(req.params.id, {
      status:   "converted",
      commande: commande._id,
    }, { new: true }).populate(POPULATE);

    console.log("Devis mis à jour:", { 
      devisId: updatedDevis._id, 
      devisRef: updatedDevis.reference, 
      newStatus: updatedDevis.status,
      commandeId: updatedDevis.commande._id 
    });

    res.json({
      success: true,
      data:    updatedDevis,
      commande,
      message: `Devis converti → Commande ${commande.reference}`,
    });
  } catch (error) {
    console.error("ERREUR convertDevis:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getAllDevis, getDevisById, getDevisStats,
  createDevis, updateDevis, deleteDevis,
  sendDevis, acceptDevis, rejectDevis, convertDevis,
};