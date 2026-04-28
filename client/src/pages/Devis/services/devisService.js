// src/pages/Devis/services/devisService.js
import api from "../../../api/index.js";

const API_URL = "/devis";

const devisService = {
  // Récupérer tous les devis
  getAllDevis: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.clientId) params.append('clientId', filters.clientId);
      if (filters.archived !== undefined) params.append('archived', filters.archived);
      
      const url = params.toString() ? `${API_URL}?${params}` : API_URL;
      const response = await api.get(url);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des devis:", error);
      throw error;
    }
  },

  // Récupérer un devis par son ID
  getDevisById: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du devis ${id}:`, error);
      throw error;
    }
  },

  // Créer un nouveau devis
  createDevis: async (devisData) => {
    try {
      const response = await api.post(API_URL, devisData);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors de la création du devis:", error);
      throw error;
    }
  },

  // Mettre à jour un devis
  updateDevis: async (id, devisData) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, devisData);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du devis ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un devis
  deleteDevis: async (id) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression du devis ${id}:`, error);
      throw error;
    }
  },

  // Envoyer un devis
  sendDevis: async (id) => {
    try {
      const response = await api.put(`${API_URL}/${id}/send`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de l'envoi du devis ${id}:`, error);
      throw error;
    }
  },

  // Accepter un devis
  acceptDevis: async (id) => {
    try {
      const response = await api.put(`${API_URL}/${id}/accept`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de l'acceptation du devis ${id}:`, error);
      throw error;
    }
  },

  // Convertir un devis en commande
  convertDevis: async (id) => {
    try {
      const response = await api.post(`${API_URL}/${id}/convert`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la conversion du devis ${id}:`, error);
      throw error;
    }
  },

  // Imprimer un devis
  printDevis: async (id) => {
    try {
      // Pour l'instant, on simule l'impression
      console.log(`Impression du devis ${id}`);
      return { success: true, message: 'Devis imprimé avec succès' };
    } catch (error) {
      console.error(`Erreur lors de l'impression du devis ${id}:`, error);
      throw error;
    }
  },

  // Dupliquer un devis
  duplicateDevis: async (id) => {
    try {
      // Récupérer le devis original
      const originalDevis = await devisService.getDevisById(id);
      
      // Créer une copie avec nouvelle référence
      const duplicatedData = {
        ...originalDevis,
        reference: await devisService.getNextReference(originalDevis.type),
        status: 'draft',
        dateEnvoi: '',
        dateAcceptation: '',
        envoyePar: '',
        acceptePar: '',
        archived: false
      };
      
      // Supprimer l'ID pour en générer un nouveau
      delete duplicatedData.id;
      delete duplicatedData._id;
      delete duplicatedData.createdAt;
      delete duplicatedData.updatedAt;
      
      const response = await api.post(API_URL, duplicatedData);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la duplication du devis ${id}:`, error);
      throw error;
    }
  },

  // Obtenir les statistiques des devis
  getDevisStats: async () => {
    try {
      const response = await api.get(`${API_URL}/stats`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques des devis:", error);
      throw error;
    }
  }
};

export default devisService;
