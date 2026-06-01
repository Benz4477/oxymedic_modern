import Paiement from "../models/Paiement.js";
import Commande from "../models/Commande.js";
import Facture  from "../models/Facture.js";

const POPULATE = [
  { path: "client",   select: "prenom nom tel" },
  { path: "commande", select: "reference montantTTC statut dateDebut dateFin" },
  { path: "facture",  select: "num montantTTC statut" },
];

// ── Helper : mettre à jour la facture liée ─────────────
const syncFacture = async (factureId) => {
  if (!factureId) return;
  try {
    const facture = await Facture.findById(factureId);
    if (!facture) return;

    const paiements = await Paiement.find({ facture: factureId, statut: "paid" });
    const totalPaye = paiements.reduce((s, p) => s + p.montant, 0);

    facture.montantPaye    = totalPaye;
    facture.montantRestant = Math.max(0, facture.montantTTC - totalPaye);
    facture.status         = totalPaye >= facture.montantTTC ? "paid"
                           : totalPaye > 0 ? "partial"
                           : "unpaid";
    if (facture.status === "paid") facture.datePaiement = new Date();
    else facture.datePaiement = null;

    await facture.save();
  } catch (err) {
    console.warn("syncFacture warning:", err.message);
  }
};

// GET /api/paiements?statut=&client=&commande=
const getAllPaiements = async (req, res) => {
  try {
    const filter = {};
    if (req.magasinId) filter.magasin = req.magasinId;
    if (req.query.statut)   filter.statut   = req.query.statut;
    if (req.query.client)   filter.client   = req.query.client;
    if (req.query.commande) filter.commande = req.query.commande;
    if (req.query.search) {
      filter.$or = [
        { reference: new RegExp(req.query.search, "i") },
      ];
    }

    const paiements = await Paiement.find(filter)
      .populate(POPULATE)
      .sort({ createdAt: -1 });

    // Calcul stats
    const totalPaid    = paiements.filter(p => p.statut === "paid").reduce((s, p) => s + p.montant, 0);
    const totalPending = paiements.filter(p => p.statut === "pending").reduce((s, p) => s + p.montant, 0);

    res.json({
      success: true,
      data: paiements,
      stats: {
        total:        paiements.length,
        totalPaid,
        totalPending,
        countPending: paiements.filter(p => p.statut === "pending").length,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/paiements/:id
const getPaiementById = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const paiement = await Paiement.findOne(filter).populate(POPULATE);
    if (!paiement) return res.status(404).json({ success: false, message: "Paiement non trouvé" });
    res.json({ success: true, data: paiement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/paiements
const createPaiement = async (req, res) => {
  try {
    const { client, commande, facture, montant, modePaiement, type, statut, datePaiement, banque, referenceBancaire, note } = req.body;

    if (!client)       return res.status(400).json({ success: false, message: "Client requis" });
    if (!montant)      return res.status(400).json({ success: false, message: "Montant requis" });
    if (!modePaiement) return res.status(400).json({ success: false, message: "Mode de paiement requis" });

    const isPaid = statut === "paid";

    const paiement = await Paiement.create({
      client,
      commande:          commande || null,
      facture:           facture  || null,
      montant,
      modePaiement,
      type:              type     || "solde",
      statut:            statut   || "pending",
      datePaiement:      isPaid ? (datePaiement ? new Date(datePaiement) : new Date()) : null,
      banque:            banque || "",
      referenceBancaire: referenceBancaire || "",
      note:              note   || "",
      magasin:           req.magasinId || null,
    });

    // ── Sync facture si paiement direct ────────────────
    if (isPaid && facture) await syncFacture(facture);

    const populated = await Paiement.findById(paiement._id).populate(POPULATE);
    res.status(201).json({ success: true, data: populated, message: "Paiement enregistré" });
  } catch (error) {
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

// PUT /api/paiements/:id
const updatePaiement = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const updates = { ...req.body };
    if (updates.datePaiement) updates.datePaiement = new Date(updates.datePaiement);

    const paiement = await Paiement.findOneAndUpdate(
      filter, updates, { new: true, runValidators: true }
    ).populate(POPULATE);

    if (!paiement) return res.status(404).json({ success: false, message: "Paiement non trouvé" });

    // Sync facture si statut paid
    if (paiement.statut === "paid" && paiement.facture) {
      await syncFacture(paiement.facture._id || paiement.facture);
    }

    res.json({ success: true, data: paiement, message: "Paiement mis à jour" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/paiements/:id/confirmer
const confirmerPaiement = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const paiement = await Paiement.findOne(filter);
    if (!paiement) return res.status(404).json({ success: false, message: "Paiement non trouvé" });

    paiement.statut       = "paid";
    paiement.datePaiement = new Date();
    await paiement.save();

    // ── Sync facture liée ──────────────────────────────
    if (paiement.facture) {
      await syncFacture(paiement.facture);
    }

    const populated = await Paiement.findById(paiement._id).populate(POPULATE);
    res.json({ success: true, data: populated, message: "Paiement confirmé ✅" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/paiements/:id
const deletePaiement = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const paiement = await Paiement.findOneAndDelete(filter);
    if (!paiement) return res.status(404).json({ success: false, message: "Paiement non trouvé" });
    res.json({ success: true, message: "Paiement supprimé" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAllPaiements, getPaiementById, createPaiement, updatePaiement, confirmerPaiement, deletePaiement };