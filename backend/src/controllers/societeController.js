import Societe from "../models/Societe.js";

// GET /api/societe
const getSociete = async (req, res) => {
  try {
    let societe = await Societe.findOne({});

    // Si aucune société en DB → créer avec les valeurs par défaut du schéma
    if (!societe) {
      societe = await Societe.create({});
    }

    res.json({ success: true, data: societe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/societe
const updateSociete = async (req, res) => {
  try {
    const societe = await Societe.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: societe, message: "Société mise à jour" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export { getSociete, updateSociete };