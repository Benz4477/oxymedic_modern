import Societe from "../models/Societe.js";

const getSociete = async (req, res) => {
  try {
    const societe = await Societe.findOne({});
    if (!societe) {
      // Simuler les données de la société si aucune n'existe
      const defaultSociete = {
        nom: "OxyMedic Maroc",
        adresse: "123 Rue Al Irfane, Casablanca",
        tel: "+212 522 123 456",
        email: "contact@oxymedic.ma",
        rc: "123456789",
        ice: "0001234567890",
        if: "MA123456789",
        logo: "",
        description: "Spécialiste en matériel médical et équipements de santé",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      res.json(defaultSociete);
    } else {
      res.json(societe);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSociete = async (req, res) => {
  try {
    const societe = await Societe.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.json(societe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getSociete, updateSociete };
