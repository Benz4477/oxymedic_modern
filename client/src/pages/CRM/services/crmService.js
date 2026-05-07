import api from "../../../api";

const crmService = {
  // KPIs
  getKpis: async () => {
    const { data } = await api.get("/crm/kpis");
    return data.data;
  },

  // Events
  getEvents: async () => {
    const { data } = await api.get("/crm/events");
    return data.data;
  },
  createEvent: async (payload) => {
    const { data } = await api.post("/crm/events", payload);
    return data.data;
  },
  deleteEvent: async (id) => {
    await api.delete(`/crm/events/${id}`);
  },

  // Tasks
  getTasks: async () => {
    const { data } = await api.get("/crm/tasks");
    return data.data;
  },
  createTask: async (payload) => {
    const { data } = await api.post("/crm/tasks", payload);
    return data.data;
  },
  toggleTask: async (id) => {
    const { data } = await api.patch(`/crm/tasks/${id}/toggle`);
    return data.data;
  },
  deleteTask: async (id) => {
    await api.delete(`/crm/tasks/${id}`);
  },

  // Segments
  getSegments: async () => {
    const { data } = await api.get("/crm/segments");
    return data.data;
  },

  // Renouvellements
  getRenouvellements: async (days = 30) => {
    const { data } = await api.get(`/crm/renouvellements?days=${days}`);
    return data.data;
  },
};

export default crmService;