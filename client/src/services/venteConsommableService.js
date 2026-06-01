import api from "../api";

const venteConsommableService = {
  getAll: async () => {
    const res = await api.get("/ventes-consos");
    return res.data.data;
  },
  create: async (data) => {
    const res = await api.post("/ventes-consos", data);
    return res.data.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/ventes-consos/${id}`);
    return res.data;
  },
};

export default venteConsommableService;