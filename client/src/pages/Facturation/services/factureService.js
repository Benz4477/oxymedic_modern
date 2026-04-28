// src/pages/Facturation/services/factureService.js
import api from "../../../api/index.js";

const API_URL = "/factures";

const factureService = {
  // Récupérer toutes les factures
  getAllFactures: async () => {
    try {
      const response = await api.get(API_URL);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des factures:", error);
      throw error;
    }
  },

  // Récupérer une facture par son ID
  getFactureById: async (id) => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la facture ${id}:`, error);
      throw error;
    }
  },

  // Créer une nouvelle facture
  createFacture: async (factureData) => {
    try {
      const response = await api.post(API_URL, factureData);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      throw error;
    }
  },

  // Mettre à jour une facture
  updateFacture: async (id, factureData) => {
    try {
      const response = await api.put(`${API_URL}/${id}`, factureData);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la facture ${id}:`, error);
      throw error;
    }
  },

  // Supprimer une facture
  deleteFacture: async (id) => {
    try {
      const response = await api.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la facture ${id}:`, error);
      throw error;
    }
  },

  // Récupérer les factures avec filtres
  getFactures: async (filters = {}) => {
    try {
      const response = await api.get(API_URL, { params: filters });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des factures:", error);
      throw error;
    }
  },

  // Générer le numéro de facture suivant
  getNextNumero: async (type = 'facture') => {
    try {
      const response = await api.get(`${API_URL}/next-number/${type}`);
      return response.data.data.numero;
    } catch (error) {
      console.error("Erreur lors de la génération du numéro de facture:", error);
      // En cas d'erreur, retourner un numéro par défaut
      const prefix = type === 'facture' ? 'FAC' : 'PRO';
      const year = new Date().getFullYear();
      return `${prefix}-${year}-0001`;
    }
  },

  // Marquer une facture comme payée
  markAsPaid: async (id, paymentData) => {
    try {
      const response = await api.post(`${API_URL}/${id}/pay`, paymentData);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors du marquage de la facture ${id} comme payée:`, error);
      throw error;
    }
  },

  // Archiver une facture
  archiveFacture: async (id) => {
    try {
      const response = await api.post(`${API_URL}/${id}/archive`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de l'archivage de la facture ${id}:`, error);
      throw error;
    }
  },

  // Obtenir les statistiques des factures
  getStats: async () => {
    try {
      const response = await api.get(`${API_URL}/stats`);
      return response.data.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      throw error;
    }
  }
};

export default factureService;
