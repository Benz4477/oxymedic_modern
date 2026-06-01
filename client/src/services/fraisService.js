import api from "../api";

const fraisService = {
  getAll: async (params = {}) => {
    const response = await api.get("/frais", { params });
    return response.data.data;
  },
  getById: async (id) => {
    const response = await api.get(`/frais/${id}`);
    return response.data.data;
  },
  create: async (data) => {
    const response = await api.post("/frais", data);
    return response.data.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/frais/${id}`, data);
    return response.data.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/frais/${id}`);
    return response.data;
  },
};

export default fraisService;