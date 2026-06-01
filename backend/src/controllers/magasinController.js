import Magasin from "../models/Magasin.js";

// GET /api/magasins — liste de tous les magasins (pour sélecteur Admin)
export const getAll = async (req, res) => {
  try {
    const filter = { status: "active" };
    
    // Si assistant, on restreint à sa liste
    if (req.user && req.user.role === "assistant") {
      filter._id = { $in: req.user.assignedMagasins };
    }

    const magasins = await Magasin.find(filter).sort({ nom: 1 });
    res.json(magasins);
  } catch (err) {
    console.error("[magasinController.getAll]", err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/magasins/:id
export const getById = async (req, res) => {
  try {
    const magasin = await Magasin.findById(req.params.id);
    if (!magasin) return res.status(404).json({ message: "Magasin introuvable" });
    res.json(magasin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/magasins — création par Super Admin
export const create = async (req, res) => {
  try {
    const magasin = await Magasin.create(req.body);
    res.status(201).json(magasin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/magasins/:id
export const update = async (req, res) => {
  try {
    const magasin = await Magasin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!magasin) return res.status(404).json({ message: "Magasin introuvable" });
    res.json(magasin);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/magasins/:id
export const remove = async (req, res) => {
  try {
    const magasin = await Magasin.findByIdAndDelete(req.params.id);
    if (!magasin) return res.status(404).json({ message: "Magasin introuvable" });
    res.json({ message: "Magasin supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
