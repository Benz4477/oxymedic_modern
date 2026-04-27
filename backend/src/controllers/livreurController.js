const Livreur = require('../models/Livreur');

// GET tous les livreurs
const getAllLivreurs = async (req, res) => {
  try {
    const livreurs = await Livreur.find({}).sort({ id: 1 });
    res.json(livreurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET un livreur par ID
const getLivreurById = async (req, res) => {
  try {
    const livreur = await Livreur.findOne({ id: req.params.id });
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }
    res.json(livreur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST créer un livreur
const createLivreur = async (req, res) => {
  try {
    const lastLivreur = await Livreur.findOne().sort({ id: -1 });
    const newId = lastLivreur ? lastLivreur.id + 1 : 1;
    
    const livreur = new Livreur({
      ...req.body,
      id: newId
    });
    const newLivreur = await livreur.save();
    res.status(201).json(newLivreur);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT mettre à jour un livreur
const updateLivreur = async (req, res) => {
  try {
    const livreur = await Livreur.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }
    res.json(livreur);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE supprimer un livreur
const deleteLivreur = async (req, res) => {
  try {
    const livreur = await Livreur.findOneAndDelete({ id: req.params.id });
    if (!livreur) {
      return res.status(404).json({ message: 'Livreur non trouvé' });
    }
    res.json({ message: 'Livreur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllLivreurs,
  getLivreurById,
  createLivreur,
  updateLivreur,
  deleteLivreur
};
