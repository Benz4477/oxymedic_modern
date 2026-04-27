import { validationResult } from "express-validator";

// Middleware de validation des données d'entrée
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Erreur de validation des données",
      errors: errors.array(),
    });
  }
  next();
};

// Sanitization basique des chaînes de caractères
export const sanitizeString = (value) => {
  if (typeof value !== "string") return value;
  return value.trim().replace(/[<>]/g, "");
};

// Validation basique des IDs (pour éviter l'injection)
export const isValidId = (id) => {
  // Vérifier que l'ID est un nombre entier positif ou un ObjectId MongoDB valide
  if (typeof id === "number" && id > 0) return true;
  if (typeof id === "string") {
    // Pattern ObjectId MongoDB: 24 caractères hexadécimaux
    return /^[0-9a-fA-F]{24}$/.test(id) || /^\d+$/.test(id);
  }
  return false;
};
