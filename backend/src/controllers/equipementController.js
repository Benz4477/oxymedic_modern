import Equipement from "../models/Equipement.js";

// ── Récupérer tous les équipements ──
const getAllEquipements = async (req, res) => {
  try {
    const equipements = await Equipement.find();
    res.json({
      success: true,
      data: equipements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des équipements",
      error: error.message,
    });
  }
};

// ── Récupérer un équipement par ID ──
const getEquipementById = async (req, res) => {
  try {
    const equipement = await Equipement.findById(req.params.id);
    if (!equipement) {
      return res.status(404).json({
        success: false,
        message: "Équipement non trouvé",
      });
    }
    res.json({
      success: true,
      data: equipement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'équipement",
      error: error.message,
    });
  }
};

// ── Créer un équipement ──
const createEquipement = async (req, res) => {
  try {
    const equipement = new Equipement(req.body);
    await equipement.save();

    res.status(201).json({
      success: true,
      data: equipement,
      message: "Équipement créé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'équipement",
      error: error.message,
    });
  }
};

// ── Mettre à jour un équipement ──
const updateEquipement = async (req, res) => {
  try {
    const equipement = await Equipement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!equipement) {
      return res.status(404).json({
        success: false,
        message: "Équipement non trouvé",
      });
    }

    res.json({
      success: true,
      data: equipement,
      message: "Équipement mis à jour avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour de l'équipement",
      error: error.message,
    });
  }
};

// ── Supprimer un équipement ──
const deleteEquipement = async (req, res) => {
  try {
    const equipement = await Equipement.findByIdAndDelete(req.params.id);

    if (!equipement) {
      return res.status(404).json({
        success: false,
        message: "Équipement non trouvé",
      });
    }

    res.json({
      success: true,
      message: "Équipement supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'équipement",
      error: error.message,
    });
  }
};

// ── Archiver/Désarchiver un équipement ──
const toggleArchive = async (req, res) => {
  try {
    const equipement = await Equipement.findById(req.params.id);

    if (!equipement) {
      return res.status(404).json({
        success: false,
        message: "Équipement non trouvé",
      });
    }

    equipement.archived = !equipement.archived;
    await equipement.save();

    res.json({
      success: true,
      data: equipement,
      message: `Équipement ${equipement.archived ? "archivé" : "désarchivé"} avec succès`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'archivage de l'équipement",
      error: error.message,
    });
  }
};

// ── Upload de photo d'équipement ──
const uploadEquipementPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Aucun fichier fourni",
      });
    }

    // Récupérer l'URL de l'image (Cloudinary ou local)
    let photoUrl;
    if (req.file.secure_url) {
      // Cloudinary
      photoUrl = req.file.secure_url;
    } else if (req.file.path) {
      // Stockage local - créer une URL accessible
      const baseUrl = process.env.BASE_URL || "http://localhost:5000";
      photoUrl = `${baseUrl}/uploads/equipements/${req.file.filename}`;
    } else {
      throw new Error("URL de l'image non disponible");
    }

    res.json({
      success: true,
      data: {
        photoUrl: photoUrl,
        filename: req.file.filename || req.file.public_id,
      },
      message: "Photo uploadée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'upload de la photo",
      error: error.message,
    });
  }
};

export {
  getAllEquipements,
  getEquipementById,
  createEquipement,
  updateEquipement,
  deleteEquipement,
  toggleArchive,
  uploadEquipementPhoto,
};
