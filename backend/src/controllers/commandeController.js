import Commande from "../models/Commande.js";

const getAllCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find();
    res.json({
      success: true,
      data: commandes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des commandes",
      error: error.message,
    });
  }
};

const getCommandeById = async (req, res) => {
  try {
    const commande = await Commande.findOne({ id: req.params.id });
    if (!commande) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée",
      });
    }
    res.json({
      success: true,
      data: commande,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la commande",
      error: error.message,
    });
  }
};

const createCommande = async (req, res) => {
  try {
    const lastCommande = await Commande.findOne().sort({ id: -1 });
    const newId = lastCommande ? lastCommande.id + 1 : 1;

    // Générer une référence automatique si non fournie
    const ref = req.body.ref || `CMD-${new Date().getFullYear()}-${String(newId).padStart(3, '0')}`;

    // Calculer les montants si non fournis
    let amountHT = req.body.amountHT || 0;
    let tvaRate = req.body.tvaRate || 20;
    let amountTTC = req.body.amountTTC;

    if (!amountTTC && amountHT > 0) {
      amountTTC = amountHT * (1 + tvaRate / 100);
    }

    // Calculer le total des lignes si fourni
    if (req.body.lines && req.body.lines.length > 0) {
      amountHT = req.body.lines.reduce((sum, line) => sum + line.total, 0);
      amountTTC = amountHT * (1 + tvaRate / 100);
    }

    const commandeData = {
      ...req.body,
      id: newId,
      ref,
      amountHT,
      tvaRate,
      amountTTC,
      // Convertir les IDs en nombres si nécessaire
      clientId: parseInt(req.body.clientId) || req.body.clientId,
      equipId: parseInt(req.body.equipId) || req.body.equipId,
      unitId: req.body.unitId ? (parseInt(req.body.unitId) || req.body.unitId) : null,
      // Ajouter les champs manquants avec valeurs par défaut
      caution: req.body.caution || 0,
      cautionMode: req.body.cautionMode || "Cash",
      pay: req.body.pay || "Carte",
      lines: req.body.lines || [],
      note: req.body.note || "",
      // Ne pas inclure reconType si c'est une nouvelle commande (non reconduite)
      ...(req.body.reconType && req.body.reconType !== "" ? { reconType: req.body.reconType } : {}),
    };

    try {
      console.log("Données reçues:", req.body);
      console.log("Données traitées:", commandeData);
      
      const commande = new Commande(commandeData);
      await commande.save();

      res.status(201).json({
        success: true,
        data: commande,
        message: "Commande créée avec succès",
      });
    } catch (validationError) {
      console.error("Erreur de validation MongoDB:", validationError);
      
      // Extraire les messages d'erreur de validation
      if (validationError.name === 'ValidationError') {
        const validationErrors = Object.values(validationError.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: "Erreur de validation",
          errors: validationErrors,
        });
      }
      
      throw validationError; // Relancer pour le catch général
    }
  } catch (error) {
    console.error("Erreur createCommande:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la commande",
      error: error.message,
    });
  }
};

const updateCommande = async (req, res) => {
  try {
    console.log("Données reçues pour mise à jour:", req.body);
    
    // Préparer les données avec les mêmes conversions que createCommande
    const updateData = {
      ...req.body,
      // Convertir les IDs en nombres si nécessaire
      clientId: parseInt(req.body.clientId) || req.body.clientId,
      equipId: parseInt(req.body.equipId) || req.body.equipId,
      unitId: req.body.unitId ? (parseInt(req.body.unitId) || req.body.unitId) : null,
      // Ne pas inclure reconType si c'est une chaîne vide
      ...(req.body.reconType && req.body.reconType !== "" ? { reconType: req.body.reconType } : {}),
    };

    console.log("Données traitées pour mise à jour:", updateData);

    try {
      const commande = await Commande.findOneAndUpdate(
        { id: req.params.id },
        updateData,
        { new: true, runValidators: true },
      );

      if (!commande) {
        return res.status(404).json({
          success: false,
          message: "Commande non trouvée",
        });
      }

      res.json({
        success: true,
        data: commande,
        message: "Commande mise à jour avec succès",
      });
    } catch (validationError) {
      console.error("Erreur de validation MongoDB (update):", validationError);
      
      // Extraire les messages d'erreur de validation
      if (validationError.name === 'ValidationError') {
        const validationErrors = Object.values(validationError.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: "Erreur de validation",
          errors: validationErrors,
        });
      }
      
      throw validationError; // Relancer pour le catch général
    }
  } catch (error) {
    console.error("Erreur updateCommande:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de la commande",
      error: error.message,
    });
  }
};

const deleteCommande = async (req, res) => {
  try {
    const commande = await Commande.findOneAndDelete({ id: req.params.id });

    if (!commande) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée",
      });
    }

    res.json({
      success: true,
      message: "Commande supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la commande",
      error: error.message,
    });
  }
};

// Reconduire une commande
const reconduireCommande = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, newEnd, newAmount } = req.body;

    const commande = await Commande.findOne({ id });
    if (!commande) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée",
      });
    }

    // Créer une nouvelle commande reconduite
    const lastCommande = await Commande.findOne().sort({ id: -1 });
    const newId = lastCommande ? lastCommande.id + 1 : 1;
    const newRef = `CMD-${new Date().getFullYear()}-${String(newId).padStart(3, '0')}`;

    const newCommandeData = {
      id: newId,
      ref: newRef,
      clientId: commande.clientId,
      equipId: commande.equipId,
      unitId: commande.unitId,
      start: commande.end, // La nouvelle commande commence à la fin de l'ancienne
      end: newEnd,
      status: "pending",
      pay: commande.pay,
      amountHT: newAmount || commande.amountHT,
      tvaRate: commande.tvaRate,
      amountTTC: newAmount ? newAmount * (1 + commande.tvaRate / 100) : commande.amountTTC,
      lines: commande.lines,
      reconFrom: commande.id,
      reconType: type, // "prolongation", "renouvellement", "libre"
      note: req.body.note || `Reconduction de la commande ${commande.ref}`,
    };

    const newCommande = new Commande(newCommandeData);
    await newCommande.save();

    res.status(201).json({
      success: true,
      data: newCommande,
      message: "Commande reconduite avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la reconduction de la commande",
      error: error.message,
    });
  }
};

// Mettre à jour le checklist retour
const updateChecklistRetour = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, results, notes, photo } = req.body;

    const commande = await Commande.findOneAndUpdate(
      { id },
      {
        checklistRetour: {
          date: date || new Date().toLocaleDateString('fr-FR'),
          results: results || [],
          notes: notes || "",
          photo: photo || "",
        },
      },
      { new: true }
    );

    if (!commande) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée",
      });
    }

    res.json({
      success: true,
      data: commande,
      message: "Checklist retour mis à jour avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du checklist retour",
      error: error.message,
    });
  }
};

// Mettre à jour le statut
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "pending", "transit", "ended"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Statut invalide",
      });
    }

    const commande = await Commande.findOneAndUpdate(
      { id },
      { status },
      { new: true }
    );

    if (!commande) {
      return res.status(404).json({
        success: false,
        message: "Commande non trouvée",
      });
    }

    res.json({
      success: true,
      data: commande,
      message: "Statut mis à jour avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du statut",
      error: error.message,
    });
  }
};

export {
  getAllCommandes,
  getCommandeById,
  createCommande,
  updateCommande,
  deleteCommande,
  reconduireCommande,
  updateChecklistRetour,
  updateStatus,
};
