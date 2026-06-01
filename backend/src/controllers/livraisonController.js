import Livraison from '../models/Livraison.js';

export const getAllLivraisons = async (req, res) => {
  try {
    const livraisons = await Livraison.find({}).sort({ createdAt: -1 })
      .populate('commande', 'reference')
      .populate('client', 'prenom nom tel')
      .populate('livreur', 'nom tel');
    res.json({ success: true, data: livraisons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLivraisonById = async (req, res) => {
  try {
    const livraison = await Livraison.findById(req.params.id)
      .populate('commande', 'reference')
      .populate('client', 'prenom nom tel')
      .populate('livreur', 'nom tel');
    if (!livraison) return res.status(404).json({ success: false, message: 'Livraison non trouvée' });
    res.json({ success: true, data: livraison });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createLivraison = async (req, res) => {
  try {
    const livraison = new Livraison(req.body);
    const newLivraison = await livraison.save();
    res.status(201).json({ success: true, data: newLivraison });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateLivraison = async (req, res) => {
  try {
    const livraison = await Livraison.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!livraison) return res.status(404).json({ success: false, message: 'Livraison non trouvée' });
    res.json({ success: true, data: livraison });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteLivraison = async (req, res) => {
  try {
    const livraison = await Livraison.findByIdAndDelete(req.params.id);
    if (!livraison) return res.status(404).json({ success: false, message: 'Livraison non trouvée' });
    res.json({ success: true, message: 'Livraison supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
