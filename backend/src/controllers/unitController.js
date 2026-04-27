import Unit from "../models/Unit.js";

const getAllUnits = async (req, res) => {
  try {
    const units = await Unit.find({}).sort({ id: 1 });
    res.json(units);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findOne({ id: req.params.id });
    if (!unit) return res.status(404).json({ message: "Unité non trouvée" });
    res.json(unit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUnit = async (req, res) => {
  try {
    const lastUnit = await Unit.findOne().sort({ id: -1 });
    const newId = lastUnit ? lastUnit.id + 1 : 1;
    const unit = new Unit({ ...req.body, id: newId });
    const newUnit = await unit.save();
    res.status(201).json(newUnit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUnit = async (req, res) => {
  try {
    const unit = await Unit.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
    });
    if (!unit) return res.status(404).json({ message: "Unité non trouvée" });
    res.json(unit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUnit = async (req, res) => {
  try {
    const unit = await Unit.findOneAndDelete({ id: req.params.id });
    if (!unit) return res.status(404).json({ message: "Unité non trouvée" });
    res.json({ message: "Unité supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllUnits, getUnitById, createUnit, updateUnit, deleteUnit };
