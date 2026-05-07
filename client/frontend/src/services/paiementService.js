import api from "../api";

const paiementService = {
  getAll: async (params = {}) => {
    const response = await api.get("/paiements", { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/paiements/${id}`);
    return response.data.data;
  },
  create: async (data) => {
    const response = await api.post("/paiements", data);
    return response.data.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/paiements/${id}`, data);
    return response.data.data;
  },
  confirmer: async (id) => {
    const response = await api.put(`/paiements/${id}/confirmer`);
    return response.data.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/paiements/${id}`);
    return response.data;
  },
};

export default paiementService;
