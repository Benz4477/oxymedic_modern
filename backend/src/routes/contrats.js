import express from "express";
import Contrat from "../models/Contrat.js";
import Client from "../models/Client.js";
import Equipement from "../models/Equipement.js";

const router = express.Router();

// ── GET ALL CONTRATS ───────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const contrats = await Contrat.find()
      .populate("clientId", "nom prenom email telephone")
      .populate("equipements.equipementId", "nom reference categorie")
      .populate("reservations")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: contrats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET CONTRAT BY ID ───────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const contrat = await Contrat.findById(req.params.id)
      .populate("clientId")
      .populate("equipements.equipementId")
      .populate("reservations");
    
    if (!contrat) {
      return res.status(404).json({ success: false, message: "Contrat non trouvé" });
    }
    
    res.json({ success: true, data: contrat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── CREATE CONTRAT ──────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const {
      clientId,
      type,
      dateDebut,
      dateFin,
      duree,
      montantMensuel,
      montantTotal,
      equipements,
      conditions,
      renouvellementAuto,
      responsable,
      notes,
    } = req.body;

    // Générer une référence automatique
    const count = await Contrat.countDocuments();
    const reference = `CTR-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

    const contrat = new Contrat({
      reference,
      clientId,
      type,
      dateDebut,
      dateFin,
      duree,
      montantMensuel,
      montantTotal,
      equipements,
      conditions,
      renouvellementAuto,
      responsable,
      notes,
      historique: [{
        action: "Création du contrat",
        utilisateur: responsable,
        details: `Contrat ${reference} créé pour le client`,
      }],
    });

    await contrat.save();
    
    // Récupérer le contrat avec les peuplements
    const savedContrat = await Contrat.findById(contrat._id)
      .populate("clientId", "nom prenom email telephone")
      .populate("equipements.equipementId", "nom reference categorie");

    res.status(201).json({ success: true, data: savedContrat });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── UPDATE CONTRAT ──────────────────────────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const contrat = await Contrat.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        $push: {
          historique: {
            action: "Modification du contrat",
            utilisateur: req.body.responsable || "System",
            details: "Contrat mis à jour",
            date: new Date(),
          }
        }
      },
      { new: true, runValidators: true }
    ).populate("clientId equipements.equipementId reservations");

    if (!contrat) {
      return res.status(404).json({ success: false, message: "Contrat non trouvé" });
    }

    res.json({ success: true, data: contrat });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── SIGNER CONTRAT ─────────────────────────────────────────────
router.put("/:id/signer", async (req, res) => {
  try {
    const contrat = await Contrat.findByIdAndUpdate(
      req.params.id,
      { 
        statut: "actif",
        dateSignature: new Date(),
        $push: {
          historique: {
            action: "Signature du contrat",
            utilisateur: req.body.responsable || "System",
            details: "Contrat signé et activé",
            date: new Date(),
          }
        }
      },
      { new: true }
    ).populate("clientId equipements.equipementId");

    if (!contrat) {
      return res.status(404).json({ success: false, message: "Contrat non trouvé" });
    }

    res.json({ success: true, data: contrat });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── SUSPENDRE CONTRAT ───────────────────────────────────────────
router.put("/:id/suspendre", async (req, res) => {
  try {
    const contrat = await Contrat.findByIdAndUpdate(
      req.params.id,
      { 
        statut: "suspendu",
        $push: {
          historique: {
            action: "Suspension du contrat",
            utilisateur: req.body.responsable || "System",
            details: req.body.motif || "Contrat suspendu",
            date: new Date(),
          }
        }
      },
      { new: true }
    ).populate("clientId equipements.equipementId");

    if (!contrat) {
      return res.status(404).json({ success: false, message: "Contrat non trouvé" });
    }

    res.json({ success: true, data: contrat });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── RESILIER CONTRAT ────────────────────────────────────────────
router.put("/:id/resilier", async (req, res) => {
  try {
    const contrat = await Contrat.findByIdAndUpdate(
      req.params.id,
      { 
        statut: "resilie",
        $push: {
          historique: {
            action: "Résiliation du contrat",
            utilisateur: req.body.responsable || "System",
            details: req.body.motif || "Contrat résilié",
            date: new Date(),
          }
        }
      },
      { new: true }
    ).populate("clientId equipements.equipementId");

    if (!contrat) {
      return res.status(404).json({ success: false, message: "Contrat non trouvé" });
    }

    res.json({ success: true, data: contrat });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── TERMINER CONTRAT ────────────────────────────────────────────
router.put("/:id/terminer", async (req, res) => {
  try {
    const contrat = await Contrat.findByIdAndUpdate(
      req.params.id,
      { 
        statut: "termine",
        $push: {
          historique: {
            action: "Terminaison du contrat",
            utilisateur: req.body.responsable || "System",
            details: "Contrat terminé",
            date: new Date(),
          }
        }
      },
      { new: true }
    ).populate("clientId equipements.equipementId");

    if (!contrat) {
      return res.status(404).json({ success: false, message: "Contrat non trouvé" });
    }

    res.json({ success: true, data: contrat });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── DELETE CONTRAT ─────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const contrat = await Contrat.findByIdAndDelete(req.params.id);
    
    if (!contrat) {
      return res.status(404).json({ success: false, message: "Contrat non trouvé" });
    }

    res.json({ success: true, message: "Contrat supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET CONTRATS BY CLIENT ─────────────────────────────────────
router.get("/client/:clientId", async (req, res) => {
  try {
    const contrats = await Contrat.find({ clientId: req.params.clientId })
      .populate("equipements.equipementId", "nom reference categorie")
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: contrats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET STATISTICS ───────────────────────────────────────────────
router.get("/stats/overview", async (req, res) => {
  try {
    const total = await Contrat.countDocuments();
    const actifs = await Contrat.countDocuments({ statut: "actif" });
    const enAttente = await Contrat.countDocuments({ statut: "en_attente" });
    const suspendus = await Contrat.countDocuments({ statut: "suspendu" });
    const termines = await Contrat.countDocuments({ statut: "termine" });

    const revenuMensuelTotal = await Contrat.aggregate([
      { $match: { statut: "actif" } },
      { $group: { _id: null, total: { $sum: "$montantMensuel" } } }
    ]);

    const revenuAnnuelTotal = await Contrat.aggregate([
      { $match: { statut: "actif" } },
      { $group: { _id: null, total: { $sum: "$montantTotal" } } }
    ]);

    const contratsExpirantBientot = await Contrat.find({
      statut: "actif",
      dateFin: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
      }
    }).countDocuments();

    res.json({
      success: true,
      data: {
        total,
        actifs,
        enAttente,
        suspendus,
        termines,
        revenuMensuelTotal: revenuMensuelTotal[0]?.total || 0,
        revenuAnnuelTotal: revenuAnnuelTotal[0]?.total || 0,
        contratsExpirantBientot,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
