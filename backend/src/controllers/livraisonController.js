import Livraison from '../models/Livraison.js';

export const getAllLivraisons = async (req, res) => {
  try {
    const filter = req.magasinId ? { magasin: req.magasinId } : {};
    const livraisons = await Livraison.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: livraisons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLivraisonById = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const livraison = await Livraison.findOne(filter);
    if (!livraison) return res.status(404).json({ success: false, message: 'Livraison non trouvée' });
    res.json({ success: true, data: livraison });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLivraison = async (req, res) => {
  try {
    const livraisonData = { ...req.body };
    if (req.magasinId) livraisonData.magasin = req.magasinId;
    const livraison = new Livraison(livraisonData);
    const newLivraison = await livraison.save();
    res.status(201).json({ success: true, data: newLivraison });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateLivraison = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const livraison = await Livraison.findOneAndUpdate(filter, req.body, { new: true });
    if (!livraison) return res.status(404).json({ success: false, message: 'Livraison non trouvée' });
    res.json({ success: true, data: livraison });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteLivraison = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const livraison = await Livraison.findOneAndDelete(filter);
    if (!livraison) return res.status(404).json({ success: false, message: 'Livraison non trouvée' });
    res.json({ success: true, message: 'Livraison supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
