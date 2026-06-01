import Facture  from "../models/Facture.js";
import Client   from "../models/Client.js";
import Commande from "../models/Commande.js";

const POPULATE = [
  { path: "client",   select: "prenom nom tel email adresse quartier cin" },
  { path: "commande", select: "reference montantTTC dateDebut dateFin statut" },
];

// GET /api/factures
export const getAllFactures = async (req, res) => {
  try {
    const filter = {};
    if (req.magasinId) filter.magasin = req.magasinId;
    if (req.query.status)   filter.status   = req.query.status;
    if (req.query.type)     filter.type     = req.query.type;
    if (req.query.client)   filter.client   = req.query.client;
    if (req.query.archived) filter.archived = req.query.archived === "true";
    else                    filter.archived = false;

    if (req.query.search) {
      filter.$or = [
        { num:       new RegExp(req.query.search, "i") },
        { clientNom: new RegExp(req.query.search, "i") },
      ];
    }

    const factures = await Facture.find(filter)
      .populate(POPULATE)
      .sort({ createdAt: -1 });

    // Stats inline
    const stats = {
      total:        factures.length,
      paid:         factures.filter(f => f.status === "paid").length,
      unpaid:       factures.filter(f => f.status === "unpaid").length,
      draft:        factures.filter(f => f.status === "draft").length,
      totalCA:      factures.filter(f => f.status === "paid").reduce((s, f) => s + f.montantTTC, 0),
      totalRestant: factures.filter(f => ["unpaid","partial","sent"].includes(f.status)).reduce((s, f) => s + f.montantRestant, 0),
    };

    res.json({ success: true, data: factures, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/factures/:id
export const getFactureById = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const facture = await Facture.findOne(filter).populate(POPULATE);
    if (!facture) return res.status(404).json({ success: false, message: "Facture non trouvée" });
    res.json({ success: true, data: facture });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/factures
export const createFacture = async (req, res) => {
  try {
    console.log("POST /api/factures body:", JSON.stringify(req.body, null, 2));
    const { type = "facture", client, commande } = req.body;

    // Auto-générer le numéro
    const num = await Facture.getNextNumero(type);

    // Dénormaliser le nom client
    let clientNom = req.body.clientNom || "";
    if (client && !clientNom) {
      const c = await Client.findById(client);
      if (c) clientNom = `${c.prenom} ${c.nom}`;
    }

    // Convertir les dates
    const date         = req.body.date         ? new Date(req.body.date)         : new Date();
    const dateEcheance = req.body.dateEcheance ? new Date(req.body.dateEcheance) : null;

    const facture = new Facture({
      ...req.body,
      num,
      client:        client   || null,
      commande:      commande || null,
      clientNom,
      date,
      dateEcheance,
      magasin:       req.magasinId || null,
      createdBy:     req.user?.name || "System",
    });

    const saved = await facture.save();
    const populated = await Facture.findById(saved._id).populate(POPULATE);

    res.status(201).json({ success: true, data: populated, message: "Facture créée avec succès" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Ce numéro de facture existe déjà" });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        errors: Object.values(error.errors).map(e => e.message),
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/factures/:id
export const updateFacture = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const facture = await Facture.findOne(filter);
    if (!facture) return res.status(404).json({ success: false, message: "Facture non trouvée" });
    if (facture.status === "paid") {
      return res.status(400).json({ success: false, message: "Impossible de modifier une facture payée" });
    }

    const updates = { ...req.body };
    if (updates.date)         updates.date         = new Date(updates.date);
    if (updates.dateEcheance) updates.dateEcheance = new Date(updates.dateEcheance);

    const updated = await Facture.findOneAndUpdate(
      filter, updates, { new: true, runValidators: true }
    ).populate(POPULATE);

    res.json({ success: true, data: updated, message: "Facture mise à jour" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/factures/:id
export const deleteFacture = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const facture = await Facture.findOne(filter);
    if (!facture) return res.status(404).json({ success: false, message: "Facture non trouvée" });
    if (facture.status === "paid") {
      return res.status(400).json({ success: false, message: "Impossible de supprimer une facture payée" });
    }
    await facture.deleteOne();
    res.json({ success: true, message: "Facture supprimée" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/factures/:id/pay
export const markAsPaid = async (req, res) => {
  try {
    const { montant, modePaiement } = req.body;
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const facture = await Facture.findOne(filter);
    if (!facture) return res.status(404).json({ success: false, message: "Facture non trouvée" });
    if (facture.status === "paid") return res.status(400).json({ success: false, message: "Facture déjà payée" });
    await facture.markAsPaid(montant, modePaiement);
    const populated = await Facture.findById(facture._id).populate(POPULATE);
    res.json({ success: true, data: populated, message: "Paiement enregistré" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/factures/:id/archive
export const archiveFacture = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const facture = await Facture.findOneAndUpdate(
      filter, { archived: true }, { new: true }
    ).populate(POPULATE);
    if (!facture) return res.status(404).json({ success: false, message: "Facture non trouvée" });
    res.json({ success: true, data: facture, message: "Facture archivée" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/factures/next-number/:type
export const getNextNumero = async (req, res) => {
  try {
    const numero = await Facture.getNextNumero(req.params.type || "facture");
    res.json({ success: true, data: { numero } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/factures/stats
export const getFactureStats = async (req, res) => {
  try {
    const matchQuery = { archived: false };
    if (req.magasinId) matchQuery.magasin = req.magasinId;
    const stats = await Facture.aggregate([
      { $match: matchQuery },
      { $group: {
        _id:        "$status",
        count:      { $sum: 1 },
        totalTTC:   { $sum: "$montantTTC" },
        totalPaye:  { $sum: "$montantPaye" },
      }}
    ]);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};