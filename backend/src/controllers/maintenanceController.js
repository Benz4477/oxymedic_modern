import Maintenance from "../models/Maintenance.js";

const getAllMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.find({}).sort({ id: 1 });
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await Maintenance.findOne({ id: req.params.id });
    if (!maintenance)
      return res.status(404).json({ message: "Maintenance non trouvée" });
    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMaintenance = async (req, res) => {
  try {
    const lastMaintenance = await Maintenance.findOne().sort({ id: -1 });
    const newId = lastMaintenance ? lastMaintenance.id + 1 : 1;
    const maintenance = new Maintenance({ ...req.body, id: newId });
    const newMaintenance = await maintenance.save();
    res.status(201).json(newMaintenance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true },
    );
    if (!maintenance)
      return res.status(404).json({ message: "Maintenance non trouvée" });
    res.json(maintenance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findOneAndDelete({
      id: req.params.id,
    });
    if (!maintenance)
      return res.status(404).json({ message: "Maintenance non trouvée" });
    res.json({ message: "Maintenance supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
};
