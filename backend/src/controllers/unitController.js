import Unit from "../models/Unit.js";
import Equipement from "../models/Equipement.js";

// GET /api/units?statut=&equipement=
const getAllUnits = async (req, res) => {
  try {
    const filter = {};
    if (req.query.statut)     filter.statut     = req.query.statut;
    if (req.query.equipement) filter.equipement = req.query.equipement;

    const units = await Unit.find(filter)
      .populate("equipement", "name icon cat cardColor photo")
      .populate("clientActuel", "prenom nom tel")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: units });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/units/:id
const getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findById(req.params.id)
      .populate("equipement", "name icon cat cardColor photo")
      .populate("equipId", "name icon cat cardColor photo") // Compatibilité ancien schéma
      .populate("clientActuel", "prenom nom tel")
      .populate("commandeActive");

    if (!unit) return res.status(404).json({ success: false, message: "Unité non trouvée" });
    
    // Fusionner les données pour compatibilité
    const processedUnit = {
      ...unit.toObject(),
      equipement: unit.equipement || unit.equipId // Utiliser equipId si equipement est null
    };
    
    res.json({ success: true, data: processedUnit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/units/equipement/:equipementId
const getUnitsByEquipement = async (req, res) => {
  try {
    const units = await Unit.find({ equipement: req.params.equipementId })
      .populate("clientActuel", "prenom nom tel")
      .sort({ serial: 1 });

    res.json({ success: true, data: units });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/units/search?q=
const searchUnit = async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ success: false, message: "Paramètre q requis" });

    const regex = new RegExp(q, "i");
    const units = await Unit.find({
      $or: [{ serial: regex }, { barcode: regex }],
    }).populate("equipement", "name icon cat");

    res.json({ success: true, data: units });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/units
const createUnit = async (req, res) => {
  try {
    const { serial, barcode, equipement } = req.body;
    if (!serial)     return res.status(400).json({ success: false, message: "Le numéro de série est requis" });
    if (!barcode)    return res.status(400).json({ success: false, message: "Le code-barres est requis" });
    if (!equipement) return res.status(400).json({ success: false, message: "L'équipement est requis" });

    // Vérifier que l'équipement existe
    const equip = await Equipement.findById(equipement);
    if (!equip) return res.status(404).json({ success: false, message: "Équipement non trouvé" });

    const unit = await Unit.create(req.body);
    const populated = await unit.populate("equipement", "name icon cat");

    res.status(201).json({ success: true, data: populated, message: "Unité créée avec succès" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Ce N° de série ou code-barres existe déjà" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/units/:id
const updateUnit = async (req, res) => {
  try {
    // Ne pas permettre la modification directe de commandeActive et clientActuel
    // (gérés automatiquement par le CommandeService)
    const updates = { ...req.body };
    delete updates.commandeActive;
    delete updates.clientActuel;

    const unit = await Unit.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate("equipement", "name icon cat");

    if (!unit) return res.status(404).json({ success: false, message: "Unité non trouvée" });
    res.json({ success: true, data: unit, message: "Unité mise à jour" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Ce N° de série ou code-barres existe déjà" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/units/:id
const deleteUnit = async (req, res) => {
  try {
    // Vérifier que l'unité n'est pas en cours de location
    const unit = await Unit.findById(req.params.id);
    if (!unit) return res.status(404).json({ success: false, message: "Unité non trouvée" });

    if (unit.statut === "loue") {
      return res.status(400).json({
        success: false,
        message: "Impossible de supprimer une unité en cours de location",
      });
    }

    await unit.deleteOne();
    res.json({ success: true, message: "Unité supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  getAllUnits, getUnitById, getUnitsByEquipement,
  searchUnit, createUnit, updateUnit, deleteUnit,
};