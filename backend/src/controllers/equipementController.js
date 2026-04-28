import Equipement from "../models/Equipement.js";

// ── Helper : générer le prochain ID ──
const getNextId = async () => {
  const lastEquip = await Equipement.findOne().sort({ id: -1 });
  return lastEquip ? lastEquip.id + 1 : 1;
};

// ── Récupérer tous les équipements ──
const getAllEquipements = async (req, res) => {
  try {
    const equipements = await Equipement.find();
    res.json({
      success: true,
      data: equipements,
    });
  } catch (error) {
    console.error("Erreur getAllEquipements:", error);
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
    console.error("Erreur getEquipementById:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'équipement",
      error: error.message,
    });
  }
};

// ── Créer un équipement (CORRIGÉ) ──
const createEquipement = async (req, res) => {
  console.log("=== CRÉATION ÉQUIPEMENT ===");
  console.log("Body reçu:", JSON.stringify(req.body, null, 2));

  try {
    // Nettoyer et valider les données
    const {
      // Identifiants
      id: existingId,
      // Informations générales
      icon,
      name,
      cardColor,
      // Catégorisation
      cat,
      subcat,
      // Identification
      ref,
      marque,
      origine,
      emplacement,
      // Codes-barres
      productBarcode,
      // Tarifs
      pDay,
      pWeek,
      pMonth,
      pVente,
      caution,
      // Stock
      total,
      dispo,
      // Statuts
      visible,
      archived,
      // Description
      photo,
      desc,
    } = req.body;

    // Validation des champs obligatoires
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Le nom de l'équipement est requis",
      });
    }
    if (!cat || !cat.trim()) {
      return res.status(400).json({
        success: false,
        message: "La catégorie est requise",
      });
    }

    // Nettoyer les valeurs numériques
    const cleanPday = parseInt(pDay) || 0;
    const cleanPweek = parseInt(pWeek) || 0;
    const cleanPmonth = parseInt(pMonth) || 0;
    const cleanPvente = parseInt(pVente) || 0;
    const cleanCaution = parseInt(caution) || 0;
    const cleanTotal = parseInt(total) || 1;
    const cleanDispo = parseInt(dispo) || 1;

    // Générer l'ID auto-incrémenté
    const newId = await getNextId();

    const equipement = new Equipement({
      id: newId,
      icon: icon || "🏥",
      name: name.trim(),
      cardColor: cardColor || "#16A34A",
      cat: cat.trim(),
      subcat: subcat || "",
      ref: ref || "",
      marque: marque || "",
      origine: origine || "",
      emplacement: emplacement || "",
      productBarcode: productBarcode || "",
      pDay: cleanPday,
      pWeek: cleanPweek,
      pMonth: cleanPmonth,
      pVente: cleanPvente,
      caution: cleanCaution,
      total: cleanTotal,
      dispo: cleanDispo,
      visible: visible !== false,
      archived: archived === true,
      photo: photo || "",
      desc: desc || "",
    });

    const savedEquipement = await equipement.save();
    console.log("✅ Équipement créé avec succès, ID:", newId);

    res.status(201).json({
      success: true,
      data: savedEquipement,
      message: "Équipement créé avec succès",
    });
  } catch (error) {
    console.error("=== ERREUR CRÉATION ÉQUIPEMENT ===");
    console.error("Message:", error.message);
    console.error("Détails:", error.errors);

    // Gérer les erreurs de doublon
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Cette référence existe déjà",
      });
    }

    // Erreur de validation Mongoose
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        details: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'équipement",
      error: error.message,
    });
  }
};

// ── Mettre à jour un équipement (CORRIGÉ) ──
const updateEquipement = async (req, res) => {
  console.log("=== MISE À JOUR ÉQUIPEMENT ===");
  console.log("ID:", req.params.id);
  console.log("Body:", JSON.stringify(req.body, null, 2));

  try {
    // Trouver l'équipement par son ID numérique (pas par _id)
    const equipement = await Equipement.findOne({ id: parseInt(req.params.id) });

    if (!equipement) {
      return res.status(404).json({
        success: false,
        message: "Équipement non trouvé",
      });
    }

    // Mettre à jour les champs
    const {
      icon, name, cardColor, cat, subcat, ref, marque, origine,
      emplacement, productBarcode, pDay, pWeek, pMonth, pVente,
      caution, total, dispo, visible, archived, photo, desc,
    } = req.body;

    if (icon !== undefined) equipement.icon = icon || "🏥";
    if (name !== undefined) equipement.name = name.trim();
    if (cardColor !== undefined) equipement.cardColor = cardColor;
    if (cat !== undefined) equipement.cat = cat.trim();
    if (subcat !== undefined) equipement.subcat = subcat;
    if (ref !== undefined) equipement.ref = ref;
    if (marque !== undefined) equipement.marque = marque;
    if (origine !== undefined) equipement.origine = origine;
    if (emplacement !== undefined) equipement.emplacement = emplacement;
    if (productBarcode !== undefined) equipement.productBarcode = productBarcode;
    if (pDay !== undefined) equipement.pDay = parseInt(pDay) || 0;
    if (pWeek !== undefined) equipement.pWeek = parseInt(pWeek) || 0;
    if (pMonth !== undefined) equipement.pMonth = parseInt(pMonth) || 0;
    if (pVente !== undefined) equipement.pVente = parseInt(pVente) || 0;
    if (caution !== undefined) equipement.caution = parseInt(caution) || 0;
    if (total !== undefined) equipement.total = parseInt(total) || 1;
    if (dispo !== undefined) equipement.dispo = parseInt(dispo) || 1;
    if (visible !== undefined) equipement.visible = visible;
    if (archived !== undefined) equipement.archived = archived;
    if (photo !== undefined) equipement.photo = photo;
    if (desc !== undefined) equipement.desc = desc;

    // S'assurer que dispo ne dépasse pas total
    if (equipement.dispo > equipement.total) {
      equipement.dispo = equipement.total;
    }

    await equipement.save();

    res.json({
      success: true,
      data: equipement,
      message: "Équipement mis à jour avec succès",
    });
  } catch (error) {
    console.error("Erreur updateEquipement:", error);
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
    const equipement = await Equipement.findOneAndDelete({ id: parseInt(req.params.id) });

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
    console.error("Erreur deleteEquipement:", error);
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
    const equipement = await Equipement.findOne({ id: parseInt(req.params.id) });

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
    console.error("Erreur toggleArchive:", error);
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

    let photoUrl;
    if (req.file.secure_url) {
      photoUrl = req.file.secure_url;
    } else if (req.file.path) {
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
    console.error("Erreur uploadEquipementPhoto:", error);
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