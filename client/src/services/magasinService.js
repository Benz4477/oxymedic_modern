import api from "../api";

const magasinService = {
  getAll: async () => {
    const response = await api.get("/magasins");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/magasins/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/magasins", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/magasins/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/magasins/${id}`);
    return response.data;
  },
};

export default magasinService;
