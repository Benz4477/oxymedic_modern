import Unit from "../models/Unit.js";

const getAllUnits = async (req, res) => {
  try {
    const units = await Unit.find({}).populate("equipId").sort({ id: 1 });
    res.json({ success: true, data: units });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findOne({ id: req.params.id }).populate("equipId");
    if (!unit) return res.status(404).json({ success: false, message: "Unité non trouvée" });
    res.json({ success: true, data: unit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUnitsByEquipement = async (req, res) => {
  try {
    const units = await Unit.find({ equipId: req.params.equipId }).populate("equipId").sort({ id: 1 });
    res.json({ success: true, data: units });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createUnit = async (req, res) => {
  try {
    const lastUnit = await Unit.findOne().sort({ id: -1 });
    const newId = lastUnit ? lastUnit.id + 1 : 1;
    const unit = new Unit({ ...req.body, id: newId });
    const newUnit = await unit.save();
    res.status(201).json({ success: true, data: newUnit });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Ce N° de série ou code-barres existe déjà" });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateUnit = async (req, res) => {
  try {
    const unit = await Unit.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!unit) return res.status(404).json({ success: false, message: "Unité non trouvée" });
    res.json({ success: true, data: unit });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Ce N° de série ou code-barres existe déjà" });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteUnit = async (req, res) => {
  try {
    const unit = await Unit.findOneAndDelete({ id: req.params.id });
    if (!unit) return res.status(404).json({ success: false, message: "Unité non trouvée" });
    res.json({ success: true, message: "Unité supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getAllUnits, getUnitById, getUnitsByEquipement, createUnit, updateUnit, deleteUnit };
