// src/pages/Devis/services/commandeService.js
import api from "../../../api/index.js";

const API_URL = "/commandes";

const commandeService = {
  // Récupérer toutes les commandes
  getAllCommandes: async () => {
    try {
      const response = await api.get(API_URL);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      throw error;
    }
  },

  // Récupérer une commande par son ID
  getCommandeById: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la commande ${id}:`, error);
      throw error;
    }
  }
};

export default commandeService;
