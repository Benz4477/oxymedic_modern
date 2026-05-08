import api from "../../../api";

const crmService = {
  // Stats
  getStats: async () => {
    const res = await api.get("/crm/stats");
    return res.data.data;
  },

  // Interactions
  getInteractions: async (params = {}) => {
    const res = await api.get("/crm/interactions", { params });
    return res.data.data;
  },
  createInteraction: async (data) => {
    const res = await api.post("/crm/interactions", data);
    return res.data.data;
  },
  deleteInteraction: async (id) => {
    const res = await api.delete(`/crm/interactions/${id}`);
    return res.data;
  },

  // Tâches
  getTaches: async (params = {}) => {
    const res = await api.get("/crm/taches", { params });
    return res.data.data;
  },
  createTache: async (data) => {
    const res = await api.post("/crm/taches", data);
    return res.data.data;
  },
  toggleTache: async (id) => {
    const res = await api.put(`/crm/taches/${id}/toggle`);
    return res.data.data;
  },
  deleteTache: async (id) => {
    const res = await api.delete(`/crm/taches/${id}`);
    return res.data;
  },

  // Segments
  getSegments: async () => {
    const res = await api.get("/crm/segments");
    return res.data;
  },
};

export default crmService;