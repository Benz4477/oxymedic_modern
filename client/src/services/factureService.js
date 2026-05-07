import api from "../api";

const factureService = {
  getAll: async () => {
    const response = await api.get("/factures");
    return response.data.data || response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/factures/${id}`);
    return response.data.data;
  },

  create: async (data) => {
    const response = await api.post("/factures", data);
    return response.data.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/factures/${id}`, data);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/factures/${id}`);
    return response.data;
  },

  createFacture: async (data) => {
    const response = await api.post("/factures", data);
    return response.data.data;
  },

  updateFacture: async (id, data) => {
    const response = await api.put(`/factures/${id}`, data);
    return response.data.data;
  },

  deleteFacture: async (id) => {
    const response = await api.delete(`/factures/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get("/factures/stats");
    return response.data.data;
  },

  archiver: async (id) => {
    const response = await api.patch(`/factures/${id}/archiver`);
    return response.data.data;
  },
};

export default factureService;