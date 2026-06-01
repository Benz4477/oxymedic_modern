import axios from "axios";

// Créer une instance axios avec la configuration de base
const api = axios.create({
baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ajouter également le magasin actif si présent
    const activeMagasinId = sessionStorage.getItem("activeMagasinId");
    if (activeMagasinId) {
      config.headers["X-Magasin-Id"] = activeMagasinId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("activeMagasinId");
      // Rediriger vers l'accueil (connexion)
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
