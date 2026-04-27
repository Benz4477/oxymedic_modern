const Livraison = require('../models/Livraison');

const getAllLivraisons = async (req, res) => {
  try {
    const livraisons = await Livraison.find({}).sort({ id: 1 });
    res.json(livraisons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLivraisonById = async (req, res) => {
  try {
    const livraison = await Livraison.findOne({ id: req.params.id });
    if (!livraison) return res.status(404).json({ message: 'Livraison non trouvée' });
    res.json(livraison);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLivraison = async (req, res) => {
  try {
    const lastLivraison = await Livraison.findOne().sort({ id: -1 });
    const newId = lastLivraison ? lastLivraison.id + 1 : 1;
    const livraison = new Livraison({ ...req.body, id: newId });
    const newLivraison = await livraison.save();
    res.status(201).json(newLivraison);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateLivraison = async (req, res) => {
  try {
    const livraison = await Livraison.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!livraison) return res.status(404).json({ message: 'Livraison non trouvée' });
    res.json(livraison);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteLivraison = async (req, res) => {
  try {
    const livraison = await Livraison.findOneAndDelete({ id: req.params.id });
    if (!livraison) return res.status(404).json({ message: 'Livraison non trouvée' });
    res.json({ message: 'Livraison supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllLivraisons, getLivraisonById, createLivraison, updateLivraison, deleteLivraison };
