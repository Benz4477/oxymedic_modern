import Maintenance from "../models/Maintenance.js";

const getAllMaintenance = async (req, res) => {
  try {
    const filter = req.magasinId ? { magasin: req.magasinId } : {};
    const maintenance = await Maintenance.find(filter).sort({ id: 1 });
    res.json({ success: true, data: maintenance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const filter = req.magasinId ? { magasin: req.magasinId } : {};
    const maintenances = await Maintenance.find(filter);
    
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const stats = {
      open: 0,
      progress: 0,
      scheduled: 0,
      doneThisMonth: 0,
    };

    maintenances.forEach(m => {
      if (m.status === "open") stats.open++;
      if (m.status === "progress") stats.progress++;
      if (m.status === "scheduled") stats.scheduled++;
      
      if (m.status === "done" && m.dateCloture) {
        const d = new Date(m.dateCloture);
        if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
          stats.doneThisMonth++;
        }
      }
    });

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMaintenanceById = async (req, res) => {
  try {
    const filter = { id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const maintenance = await Maintenance.findOne(filter);
    if (!maintenance)
      return res.status(404).json({ success: false, message: "Maintenance non trouvée" });
    res.json({ success: true, data: maintenance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createMaintenance = async (req, res) => {
  try {
    const filter = req.magasinId ? { magasin: req.magasinId } : {};
    const lastMaintenance = await Maintenance.findOne(filter).sort({ id: -1 });
    const newId = lastMaintenance ? lastMaintenance.id + 1 : 1;
    const maintenanceData = { ...req.body, id: newId };
    if (req.magasinId) maintenanceData.magasin = req.magasinId;
    const maintenance = new Maintenance(maintenanceData);
    const newMaintenance = await maintenance.save();
    res.status(201).json({ success: true, data: newMaintenance });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateMaintenance = async (req, res) => {
  try {
    const filter = { id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const maintenance = await Maintenance.findOneAndUpdate(
      filter,
      req.body,
      { new: true },
    );
    if (!maintenance)
      return res.status(404).json({ success: false, message: "Maintenance non trouvée" });
    res.json({ success: true, data: maintenance });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteMaintenance = async (req, res) => {
  try {
    const filter = { id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const maintenance = await Maintenance.findOneAndDelete(filter);
    if (!maintenance)
      return res.status(404).json({ success: false, message: "Maintenance non trouvée" });
    res.json({ success: true, message: "Maintenance supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addNote = async (req, res) => {
  try {
    const filter = { id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    
    const { note } = req.body;
    if (!note) return res.status(400).json({ success: false, message: "Note vide" });

    const maintenance = await Maintenance.findOneAndUpdate(
      filter,
      { $push: { history: { date: new Date().toISOString(), action: "Note ajoutée", user: req.user?.nom || "Admin" } }, notes: note },
      { new: true }
    );
    
    if (!maintenance)
      return res.status(404).json({ success: false, message: "Maintenance non trouvée" });
    res.json({ success: true, data: maintenance });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const closeMaintenance = async (req, res) => {
  try {
    const filter = { id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    
    const maintenance = await Maintenance.findOneAndUpdate(
      filter,
      { 
        status: "done", 
        dateCloture: new Date().toISOString(),
        $push: { history: { date: new Date().toISOString(), action: "Clôturée", user: req.user?.nom || "Admin" } }
      },
      { new: true }
    );
    
    if (!maintenance)
      return res.status(404).json({ success: false, message: "Maintenance non trouvée" });
    res.json({ success: true, data: maintenance });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export {
  getAllMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getStats,
  addNote,
  closeMaintenance,
};
