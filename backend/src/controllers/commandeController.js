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

    const commandeData = {
      ...req.body,
      id: newId,
    };

    const commande = new Commande(commandeData);
    await commande.save();

    res.status(201).json({
      success: true,
      data: commande,
      message: "Commande créée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la commande",
      error: error.message,
    });
  }
};

const updateCommande = async (req, res) => {
  try {
    const commande = await Commande.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true },
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
  } catch (error) {
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

export {
  getAllCommandes,
  getCommandeById,
  createCommande,
  updateCommande,
  deleteCommande,
};
