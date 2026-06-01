import Consommable from "../models/Consommable.js";
import VenteConsommable from "../models/VenteConsommable.js";

const POPULATE = [{ path: "compatEquips", select: "name icon" }];

export const getAllConsommables = async (req, res) => {
  try {
    const filter = req.magasinId ? { magasin: req.magasinId } : {};
    const consommables = await Consommable.find(filter).populate(POPULATE).sort({ createdAt: -1 });
    res.json({ success: true, data: consommables });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getConsommableById = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const consommable = await Consommable.findOne(filter).populate(POPULATE);
    if (!consommable) return res.status(404).json({ success: false, message: "Consommable non trouvé" });
    res.json({ success: true, data: consommable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createConsommable = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.magasinId) data.magasin = req.magasinId;
    const consommable = new Consommable(data);
    await consommable.save();
    const populated = await Consommable.findById(consommable._id).populate(POPULATE);
    res.status(201).json({ success: true, data: populated, message: "Consommable créé" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateConsommable = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const consommable = await Consommable.findOneAndUpdate(filter, req.body, { new: true }).populate(POPULATE);
    if (!consommable) return res.status(404).json({ success: false, message: "Consommable non trouvé" });
    res.json({ success: true, data: consommable, message: "Consommable mis à jour" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteConsommable = async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.magasinId) filter.magasin = req.magasinId;
    const consommable = await Consommable.findOneAndDelete(filter);
    if (!consommable) return res.status(404).json({ success: false, message: "Consommable non trouvé" });
    res.json({ success: true, message: "Consommable supprimé" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const filter = req.magasinId ? { magasin: req.magasinId } : {};
    const venteFilter = req.magasinId ? { magasin: req.magasinId } : {};

    const total = await Consommable.countDocuments(filter);
    const lowStock = await Consommable.countDocuments({ ...filter, $expr: { $lte: ["$stock", "$stockMin"] } });
    const ventes = await VenteConsommable.aggregate([
      { $match: venteFilter },
      { $group: { _id: null, totalCA: { $sum: "$total" } } },
    ]);
    const ventesMois = await VenteConsommable.aggregate([
      { $match: { ...venteFilter, date: { $regex: new Date().toLocaleDateString("fr-CA").slice(0, 7) } } },
      { $count: "count" },
    ]);
    res.json({
      success: true,
      data: {
        total,
        lowStock,
        ca: ventes[0]?.totalCA || 0,
        ventesMois: ventesMois[0]?.count || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};