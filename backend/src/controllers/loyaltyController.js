const Loyalty = require('../models/Loyalty');

const getAllLoyalty = async (req, res) => {
  try {
    const loyalty = await Loyalty.find({}).sort({ clientId: 1 });
    res.json(loyalty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLoyaltyByClientId = async (req, res) => {
  try {
    const loyalty = await Loyalty.findOne({ clientId: req.params.id });
    if (!loyalty) return res.status(404).json({ message: 'Fidélité non trouvée' });
    res.json(loyalty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLoyalty = async (req, res) => {
  try {
    const loyalty = new Loyalty(req.body);
    const newLoyalty = await loyalty.save();
    res.status(201).json(newLoyalty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateLoyalty = async (req, res) => {
  try {
    const loyalty = await Loyalty.findOneAndUpdate({ clientId: req.params.id }, req.body, { new: true });
    if (!loyalty) return res.status(404).json({ message: 'Fidélité non trouvée' });
    res.json(loyalty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteLoyalty = async (req, res) => {
  try {
    const loyalty = await Loyalty.findOneAndDelete({ clientId: req.params.id });
    if (!loyalty) return res.status(404).json({ message: 'Fidélité non trouvée' });
    res.json({ message: 'Fidélité supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllLoyalty, getLoyaltyByClientId, createLoyalty, updateLoyalty, deleteLoyalty };
