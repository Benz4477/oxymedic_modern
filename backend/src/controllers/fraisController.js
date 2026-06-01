import Frais from "../models/Frais.js";
import Livreur from "../models/Livreur.js";

const getAllFrais = async (req, res) => {
  try {
    const filter = req.magasinId ? { magasin: req.magasinId } : {};
    const frais = await Frais.find(filter).sort({ createdAt: -1 }).lean();
    const livreurs = await Livreur.find({}).lean();
    
    // Jointure manuelle : attacher le livreur à chaque frais
    const enriched = frais.map(fObj => {
      fObj.livreur = livreurs.find(l => String(l._id) === String(fObj.livreurId) || l.id === fObj.livreurId) || null;
      // S'assurer qu'on gère aussi bien "desc" que "description"
      fObj.description = fObj.description || fObj.desc; 
      return fObj;
    });
    
    res.json({ success: true, data: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFraisById = async (req, res) => {
  try {
    const filter = { id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const frais = await Frais.findOne(filter);
    if (!frais) return res.status(404).json({ success: false, message: "Frais non trouvé" });
    res.json({ success: true, data: frais });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createFrais = async (req, res) => {
  try {
    const filter = req.magasinId ? { magasin: req.magasinId } : {};
    const lastFrais = await Frais.findOne(filter).sort({ id: -1 });
    const newId = lastFrais ? lastFrais.id + 1 : 1;
    const { description, ...rest } = req.body;
    // Le modèle stocke "desc" mais le frontend envoie "description"
    const fraisData = { ...rest, id: newId, desc: description || rest.desc || "" };
    if (req.magasinId) fraisData.magasin = req.magasinId;
    const frais = new Frais(fraisData);
    const newFrais = await frais.save();
    res.status(201).json({ success: true, data: newFrais });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateFrais = async (req, res) => {
  try {
    const filter = { id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const frais = await Frais.findOneAndUpdate(
      filter,
      req.body,
      { new: true },
    );
    if (!frais) return res.status(404).json({ success: false, message: "Frais non trouvé" });
    res.json({ success: true, data: frais });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteFrais = async (req, res) => {
  try {
    const filter = { id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const frais = await Frais.findOneAndDelete(filter);
    if (!frais) return res.status(404).json({ success: false, message: "Frais non trouvé" });
    res.json({ success: true, message: "Frais supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAllFrais, getFraisById, createFrais, updateFrais, deleteFrais };
