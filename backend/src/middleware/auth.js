import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ── Protection des routes ─────────────────────────────────
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ success: false, message: "Accès non autorisé - Token manquant" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Cherche par _id (ObjectId) au lieu de id (Number)
    req.user = await User.findById(decoded.id).select("+permissions +role +status");
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Utilisateur non trouvé" });
    }
    if (req.user.status !== "active") {
      return res.status(401).json({ success: false, message: "Compte désactivé" });
    }

    // ── Logique Multi-Magasin (Isolation des données) ──
    const requestedMagasinId = req.headers["x-magasin-id"];

    if (req.user.role === "superadmin") {
      // Super-admin : accès à un magasin spécifique ou vue globale (null)
      req.magasinId = requestedMagasinId || null;
    } else if (req.user.role === "assistant") {
      // Assistant : accès restreint à ses magasins assignés
      const assigned = (req.user.assignedMagasins || []).map(id => id.toString());
      if (requestedMagasinId && assigned.includes(requestedMagasinId)) {
        req.magasinId = requestedMagasinId;
      } else {
        req.magasinId = assigned[0] || null;
      }
    } else {
      // Chef / Employé : strictement restreint à leur magasin
      req.magasinId = req.user.magasin || null;
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token invalide" });
  }
};

// ── Autorisation par rôle ─────────────────────────────────
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: "Accès non autorisé" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Accès refusé - Permissions insuffisantes" });
    }
    next();
  };
};

// ── Autorisation admin seulement ──────────────────────────
export const adminOnly = (req, res, next) => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "superadmin")) {
    return res.status(403).json({ success: false, message: "Accès réservé à l'administrateur" });
  }
  next();
};

// ── Autorisation super admin seulement ───────────────────────
export const superAdminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return res.status(403).json({ success: false, message: "Accès réservé au Super Administrateur" });
  }
  next();
};

// ── Génération de token ───────────────────────────────────
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};