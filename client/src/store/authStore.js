import { create } from "zustand";

// Charger l'état initial depuis le sessionStorage (pour persistance au rafraîchissement)
const getInitialState = () => {
  try {
    const token = sessionStorage.getItem("token");
    const userStr = sessionStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    return {
      token,
      user,
      isAuthenticated: !!token,
    };
  } catch (error) {
    console.error("Erreur d'initialisation de la session d'authentification :", error);
    return {
      token: null,
      user: null,
      isAuthenticated: false,
    };
  }
};

export const useAuthStore = create((set) => ({
  ...getInitialState(),

  login: (user, token) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("user", JSON.stringify(user));
    
    // Gérer l'activeMagasinId pour le multi-magasins de manière rétrocompatible
    const magasinData = user.magasin;
    if (magasinData) {
      const id = typeof magasinData === "object" ? magasinData._id : magasinData;
      sessionStorage.setItem("activeMagasinId", id);
    } else {
      sessionStorage.removeItem("activeMagasinId");
    }

    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("activeMagasinId");
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (updatedUser) => {
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },
}));
