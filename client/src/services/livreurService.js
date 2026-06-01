import api from "../api";

const livreurService = {
  getAll: async () => {
    const response = await api.get("/livreurs");
    return response.data.data;
  },
  getById: async (id) => {
    const response = await api.get(`/livreurs/${id}`);
    return response.data.data;
  },
  create: async (data) => {
    const response = await api.post("/livreurs", data);
    return response.data.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/livreurs/${id}`, data);
    return response.data.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/livreurs/${id}`);
    return response.data;
  },
};

export default livreurService;