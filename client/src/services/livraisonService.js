import api from "../api";

const livraisonService = {
  getAll: async (params = {}) => {
    const response = await api.get("/livraisons", { params });
    return response.data.data;
  },
  getById: async (id) => {
    const response = await api.get(`/livraisons/${id}`);
    return response.data.data;
  },
  create: async (data) => {
    const response = await api.post("/livraisons", data);
    return response.data.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/livraisons/${id}`, data);
    return response.data.data;
  },
  confirmer: async (id) => {
    const response = await api.put(`/livraisons/${id}/confirmer`);
    return response.data.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/livraisons/${id}`);
    return response.data;
  },
  getBonLivraison: async (id) => {
    const response = await api.get(`/livraisons/${id}/bon`);
    return response.data.data;
  },
};

export default livraisonService;