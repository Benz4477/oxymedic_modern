import Livreur from '../models/Livreur.js';

export const getAllLivreurs = async (req, res) => {
  try {
    const livreurs = await Livreur.find({}).sort({ nom: 1 });
    res.json({ success: true, data: livreurs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLivreurById = async (req, res) => {
  try {
    const livreur = await Livreur.findById(req.params.id);
    if (!livreur) return res.status(404).json({ success: false, message: 'Livreur non trouvé' });
    res.json({ success: true, data: livreur });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLivreur = async (req, res) => {
  try {
    const livreur = new Livreur(req.body);
    const newLivreur = await livreur.save();
    res.status(201).json({ success: true, data: newLivreur });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateLivreur = async (req, res) => {
  try {
    const livreur = await Livreur.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!livreur) return res.status(404).json({ success: false, message: 'Livreur non trouvé' });
    res.json({ success: true, data: livreur });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteLivreur = async (req, res) => {
  try {
    const livreur = await Livreur.findByIdAndDelete(req.params.id);
    if (!livreur) return res.status(404).json({ success: false, message: 'Livreur non trouvé' });
    res.json({ success: true, message: 'Livreur supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
