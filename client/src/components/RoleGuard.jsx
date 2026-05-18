import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const RoleGuard = ({ requiredPermission, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Rediriger vers la page de sélection d'utilisateur si non connecté
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Le superadmin a tous les droits par défaut
  if (user?.role === "superadmin") {
    return <Outlet />;
  }

  // Vérifier si le rôle de l'utilisateur fait partie des rôles autorisés en secours
  if (allowedRoles && allowedRoles.includes(user?.role)) {
    return <Outlet />;
  }

  // Vérifier la permission fine de l'utilisateur
  if (requiredPermission && user?.permissions) {
    if (!user.permissions[requiredPermission]) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default RoleGuard;
