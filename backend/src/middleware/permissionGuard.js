export const requirePermission = (permission) => {
  return (req, res, next) => {
    // 1. L'utilisateur doit être authentifié (le middleware 'protect' doit être appelé avant)
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Accès non autorisé" });
    }

    // 2. Les superadmins et admins ont tous les droits
    if (req.user.role === "superadmin" || req.user.role === "admin") {
      return next();
    }

    // 3. Vérifier les permissions fines
    if (req.user.permissions && req.user.permissions[permission]) {
      return next();
    }

    // 4. Si la permission est manquante
    return res.status(403).json({
      success: false,
      message: `Accès refusé - Permission requise : ${permission}`,
    });
  };
};
