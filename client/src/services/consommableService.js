import api from "../api";

const consommableService = {
  getAll: async () => {
    const res = await api.get("/consommables");
    return res.data.data;
  },
  getById: async (id) => {
    const res = await api.get(`/consommables/${id}`);
    return res.data.data;
  },
  create: async (data) => {
    const res = await api.post("/consommables", data);
    return res.data.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/consommables/${id}`, data);
    return res.data.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/consommables/${id}`);
    return res.data;
  },
  getStats: async () => {
    const res = await api.get("/consommables/stats");
    return res.data.data;
  },
};

export default consommableService;