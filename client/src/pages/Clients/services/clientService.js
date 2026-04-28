import api from "../../../api";
const clientService = {
  // Obtenir tous les clients
  getAllClients: async () => {
    try {
      const response = await api.get("/clients");
      return response.data.data;
    } catch (error) {
      console.error("Erreur getAllClients:", error);
      throw error;
    }
  },

  // Obtenir un client par ID
  getClientById: async (id) => {
    try {
      const response = await api.get(`/clients/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Erreur getClientById:", error);
      throw error;
    }
  },

  // Créer un nouveau client
  createClient: async (clientData) => {
    try {
      const response = await api.post("/clients", clientData);
      return response.data.data;
    } catch (error) {
      console.error("Erreur createClient:", error);
      throw error;
    }
  },

  // Mettre à jour un client
  updateClient: async (id, clientData) => {
    try {
      const response = await api.put(`/clients/${id}`, clientData);
      return response.data.data;
    } catch (error) {
      console.error("Erreur updateClient:", error);
      throw error;
    }
  },

  // Supprimer un client
  deleteClient: async (id) => {
    try {
      const response = await api.delete(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur deleteClient:", error);
      throw error;
    }
  },

  // Obtenir les statistiques d'un client
  getClientStats: async (clientId) => {
    try {
      const response = await api.get(`/clients/${clientId}/stats`);
      return response.data.data;
    } catch (error) {
      console.error("Erreur getClientStats:", error);
      throw error;
    }
  },

  // Obtenir les documents d'un client
  getClientDocuments: async (clientId) => {
    try {
      const response = await api.get(`/clients/${clientId}/documents`);
      return response.data.data;
    } catch (error) {
      console.error("Erreur getClientDocuments:", error);
      throw error;
    }
  },

  // Obtenir l'historique d'un client
  getClientHistory: async (clientId) => {
    try {
      const response = await api.get(`/clients/${clientId}/history`);
      return response.data.data;
    } catch (error) {
      console.error("Erreur getClientHistory:", error);
      throw error;
    }
  },

  // Ajouter un document à un client
  addDocument: async (clientId, documentData) => {
    try {
      const formData = new FormData();
      formData.append("type", documentData.type);

      // Si c'est un fichier, l'ajouter
      if (documentData.file) {
        formData.append("document", documentData.file);
      }

      const response = await api.post(
        `/clients/${clientId}/documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data.data;
    } catch (error) {
      console.error("Erreur addDocument:", error);
      throw error;
    }
  },

  // Contacter un client (enregistrement de l'action)
  contactClient: async (clientId, contactData) => {
    try {
      const response = await api.post(
        `/clients/${clientId}/contact`,
        contactData,
      );
      return response.data.data;
    } catch (error) {
      console.error("Erreur contactClient:", error);
      throw error;
    }
  },

  // Obtenir les insights IA pour un client
  getClientAIInsights: async (clientId) => {
    try {
      const response = await api.get(`/clients/${clientId}/ai-insights`);
      return response.data.data;
    } catch (error) {
      console.error("Erreur getClientAIInsights:", error);
      throw error;
    }
  },

  // Créer un contrat pour un client
  createContract: async (clientId, contractData) => {
    try {
      const response = await api.post(
        `/clients/${clientId}/contracts`,
        contractData,
      );
      return response.data.data;
    } catch (error) {
      console.error("Erreur createContract:", error);
      throw error;
    }
  },

  // Enregistrer un paiement pour un client
  recordPayment: async (clientId, paymentData) => {
    try {
      const response = await api.post(
        `/clients/${clientId}/payments`,
        paymentData,
      );
      return response.data.data;
    } catch (error) {
      console.error("Erreur recordPayment:", error);
      throw error;
    }
  },

  // Planifier une visite pour un client
  scheduleVisit: async (clientId, visitData) => {
    try {
      const response = await api.post(`/clients/${clientId}/visits`, visitData);
      return response.data.data;
    } catch (error) {
      console.error("Erreur scheduleVisit:", error);
      throw error;
    }
  },

  // Demander un avis à un client
  requestReview: async (clientId, reviewData) => {
    try {
      const response = await api.post(
        `/clients/${clientId}/reviews`,
        reviewData,
      );
      return response.data.data;
    } catch (error) {
      console.error("Erreur requestReview:", error);
      throw error;
    }
  },

  // Rechercher des clients
  searchClients: async (query) => {
    try {
      const response = await api.get(
        `/clients/search?q=${encodeURIComponent(query)}`,
      );
      return response.data.data;
    } catch (error) {
      console.error("Erreur searchClients:", error);
      throw error;
    }
  },

  // Obtenir les clients actifs
  getActiveClients: async () => {
    try {
      const response = await api.get("/clients?status=active");
      return response.data.data;
    } catch (error) {
      console.error("Erreur getActiveClients:", error);
      throw error;
    }
  },

  // Obtenir les clients avec contrats expirant bientôt
  getClientsWithExpiringContracts: async () => {
    try {
      const response = await api.get("/clients?expiring=true");
      return response.data.data;
    } catch (error) {
      console.error("Erreur getClientsWithExpiringContracts:", error);
      throw error;
    }
  },

  // Obtenir les cautions d'un client
  getClientCautions: async (clientId) => {
    try {
      const response = await api.get(`/clients/${clientId}/cautions`);
      return response.data;
    } catch (error) {
      console.error("Erreur getClientCautions:", error);
      throw error;
    }
  },

  // Obtenir les paiements d'un client
  getClientPaiements: async (clientId) => {
    try {
      const response = await api.get(`/clients/${clientId}/paiements`);
      return response.data;
    } catch (error) {
      console.error("Erreur getClientPaiements:", error);
      throw error;
    }
  },

  // Obtenir les points de fidélité d'un client
  getClientFidelite: async (clientId) => {
    try {
      const response = await api.get(`/clients/${clientId}/fidelite`);
      return response.data;
    } catch (error) {
      console.error("Erreur getClientFidelite:", error);
      throw error;
    }
  },
};

export default clientService;
