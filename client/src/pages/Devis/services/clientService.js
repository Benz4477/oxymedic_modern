// src/pages/Devis/services/clientService.js
import api from "../../../api/index.js";

const API_URL = "/clients";

const clientService = {
  // Récupérer tous les clients
  getAllClients: async () => {
    try {
      const response = await api.get(API_URL);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      throw error;
    }
  },

  // Récupérer un client par son ID
  getClientById: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du client ${id}:`, error);
      throw error;
    }
  }
};

export default clientService;
