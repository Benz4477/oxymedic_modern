import Frais from "../models/Frais.js";

const getAllFrais = async (req, res) => {
  try {
    const frais = await Frais.find({}).sort({ id: 1 });
    res.json(frais);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFraisById = async (req, res) => {
  try {
    const frais = await Frais.findOne({ id: req.params.id });
    if (!frais) return res.status(404).json({ message: "Frais non trouvé" });
    res.json(frais);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createFrais = async (req, res) => {
  try {
    const lastFrais = await Frais.findOne().sort({ id: -1 });
    const newId = lastFrais ? lastFrais.id + 1 : 1;
    const frais = new Frais({ ...req.body, id: newId });
    const newFrais = await frais.save();
    res.status(201).json(newFrais);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateFrais = async (req, res) => {
  try {
    const frais = await Frais.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true },
    );
    if (!frais) return res.status(404).json({ message: "Frais non trouvé" });
    res.json(frais);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteFrais = async (req, res) => {
  try {
    const frais = await Frais.findOneAndDelete({ id: req.params.id });
    if (!frais) return res.status(404).json({ message: "Frais non trouvé" });
    res.json({ message: "Frais supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllFrais, getFraisById, createFrais, updateFrais, deleteFrais };
