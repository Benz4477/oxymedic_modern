import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protection des routes - vérification du token
export const protect = async (req, res, next) => {
  let token;

  // Vérifier si le token est dans le header Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Accès non autorisé - Token manquant",
    });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter l'utilisateur à la requête - chercher par id personnalisé
    req.user = await User.findOne({ id: decoded.id });

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    if (req.user.status !== "active") {
      return res.status(401).json({
        success: false,
        message: "Compte désactivé",
      });
    }

    next();
  } catch (error) {
    console.error("Token error:", error);
    return res.status(401).json({
      success: false,
      message: "Accès non autorisé - Token invalide",
    });
  }
};

// Autorisation par rôle
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé - Permissions insuffisantes",
      });
    }

    next();
  };
};

// Autorisation par module
export const authorizeModule = (module) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Accès non autorisé",
      });
    }

    // Admin a accès à tout
    if (req.user.role === "admin") {
      return next();
    }

    // Vérifier la permission pour le module spécifique
    if (!req.user.permissions || !req.user.permissions[module]) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé - Vous n'avez pas les permissions pour le module ${module}`,
      });
    }

    next();
  };
};

// Vérification optionnelle (ne bloque pas si pas de token)
export const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findOne({ id: decoded.id });
    } catch (error) {
      // Ignorer les erreurs de token pour l'auth optionnelle
      console.error("Optional auth error:", error);
    }
  }

  next();
};

// Génération de token
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Middleware pour vérifier si l'utilisateur est propriétaire de la ressource
export const checkOwnership = (resourceModel, resourceIdParam = "id") => {
  return async (req, res, next) => {
    try {
      const resource = await resourceModel.findById(
        req.params[resourceIdParam],
      );

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Ressource non trouvée",
        });
      }

      // Admin a accès à tout
      if (req.user.role === "admin") {
        req.resource = resource;
        return next();
      }

      // Vérifier si l'utilisateur est le créateur de la ressource
      if (resource.createdBy && resource.createdBy.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message:
            "Accès refusé - Vous n'êtes pas le propriétaire de cette ressource",
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      console.error("Ownership check error:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la vérification des permissions",
      });
    }
  };
};

// Middleware pour limiter l'accès aux ressources de l'utilisateur connecté
export const restrictToOwner = (req, res, next) => {
  // Ajouter un filtre pour ne retourner que les ressources de l'utilisateur
  if (req.user.role !== "admin") {
    req.filter = { createdBy: req.user.id };
  }
  next();
};
