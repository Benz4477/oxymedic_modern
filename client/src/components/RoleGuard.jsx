import React from "react";
import { Navigate, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const RoleGuard = ({ requiredPermission, allowedRoles }) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const context = useOutletContext();

  if (!isAuthenticated) {
    // Rediriger vers la page de sélection d'utilisateur si non connecté
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Le superadmin a tous les droits par défaut
  if (user?.role === "superadmin") {
    return <Outlet context={context} />;
  }

  // Vérifier si le rôle de l'utilisateur fait partie des rôles autorisés en secours
  if (allowedRoles && allowedRoles.includes(user?.role)) {
    return <Outlet context={context} />;
  }

  // Vérifier la permission fine de l'utilisateur
  if (requiredPermission && user?.permissions) {
    if (!user.permissions[requiredPermission]) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet context={context} />;
};

export default RoleGuard;
