import api from "../../../api";

const clientService = {
  // ── Méthodes standard (utilisées par Clients.jsx) ──
  getAll: async () => {
    const response = await api.get("/clients");
    return response.data.data;
  },
  create: async (clientData) => {
    const response = await api.post("/clients", clientData);
    return response.data.data;
  },
  update: async (id, clientData) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },

  // ── Aliases anciens noms ──
  getAllClients: async () => {
    const response = await api.get("/clients");
    return response.data.data;
  },
  getClientById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data.data;
  },
  createClient: async (clientData) => {
    const response = await api.post("/clients", clientData);
    return response.data.data;
  },
  updateClient: async (id, clientData) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data.data;
  },
  deleteClient: async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },

  // ── Méthodes complémentaires ──
  getClientStats: async (clientId) => {
    const response = await api.get(`/clients/${clientId}/stats`);
    return response.data.data;
  },
  getClientDocuments: async (clientId) => {
    const response = await api.get(`/clients/${clientId}/documents`);
    return response.data.data;
  },
  getClientHistory: async (clientId) => {
    const response = await api.get(`/clients/${clientId}/history`);
    return response.data.data;
  },
  addDocument: async (clientId, documentData) => {
    const formData = new FormData();
    formData.append("type", documentData.type);
    if (documentData.file) formData.append("document", documentData.file);
    const response = await api.post(`/clients/${clientId}/documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  },
  contactClient: async (clientId, contactData) => {
    const response = await api.post(`/clients/${clientId}/contact`, contactData);
    return response.data.data;
  },
  searchClients: async (query) => {
    const response = await api.get(`/clients/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  },
  getActiveClients: async () => {
    const response = await api.get("/clients?status=active");
    return response.data.data;
  },
  getClientCautions: async (clientId) => {
    const response = await api.get(`/clients/${clientId}/cautions`);
    return response.data;
  },
  getClientPaiements: async (clientId) => {
    const response = await api.get(`/clients/${clientId}/paiements`);
    return response.data;
  },
  getClientFidelite: async (clientId) => {
    const response = await api.get(`/clients/${clientId}/fidelite`);
    return response.data;
  },
};

export default clientService;