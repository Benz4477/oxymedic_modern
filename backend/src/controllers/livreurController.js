import Livreur from '../models/Livreur.js';

export const getAllLivreurs = async (req, res) => {
  try {
    const filter = req.magasinId ? { magasin: req.magasinId } : {};
    const livreurs = await Livreur.find(filter).sort({ nom: 1 });
    res.json({ success: true, data: livreurs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLivreurById = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const livreur = await Livreur.findOne(filter);
    if (!livreur) return res.status(404).json({ success: false, message: 'Livreur non trouvé' });
    res.json({ success: true, data: livreur });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLivreur = async (req, res) => {
  try {
    const livreurData = { ...req.body };
    if (req.magasinId) livreurData.magasin = req.magasinId;
    const livreur = new Livreur(livreurData);
    const newLivreur = await livreur.save();
    res.status(201).json({ success: true, data: newLivreur });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateLivreur = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const livreur = await Livreur.findOneAndUpdate(filter, req.body, { new: true });
    if (!livreur) return res.status(404).json({ success: false, message: 'Livreur non trouvé' });
    res.json({ success: true, data: livreur });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteLivreur = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const livreur = await Livreur.findOneAndDelete(filter);
    if (!livreur) return res.status(404).json({ success: false, message: 'Livreur non trouvé' });
    res.json({ success: true, message: 'Livreur supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
