import api from "../../../api";

const devisService = {
  getAll: async (params = {}) => {
    const response = await api.get("/devis", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/devis/${id}`);
    return response.data.data;
  },

  getStats: async () => {
    const response = await api.get("/devis/stats");
    return response.data.data;
  },

  create: async (data) => {
    const response = await api.post("/devis", data);
    return response.data.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/devis/${id}`, data);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/devis/${id}`);
    return response.data;
  },

  send: async (id) => {
    const response = await api.put(`/devis/${id}/send`);
    return response.data.data;
  },

  accept: async (id) => {
    const response = await api.put(`/devis/${id}/accept`);
    return response.data.data;
  },

  reject: async (id) => {
    const response = await api.put(`/devis/${id}/reject`);
    return response.data.data;
  },

  convert: async (id, data = {}) => {
    const response = await api.post(`/devis/${id}/convert`, data);
    return response.data;
  },
};

export default devisService;