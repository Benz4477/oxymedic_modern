import api from "../api";

const equipementService = {
  // GET /api/equipements
  getAll: async (params = {}) => {
    const response = await api.get("/equipements", { params });
    return response.data.data;
  },

  // GET /api/equipements/:id
  getById: async (id) => {
    const response = await api.get(`/equipements/${id}`);
    return response.data.data;
  },

  // POST /api/equipements
  create: async (data) => {
    const response = await api.post("/equipements", data);
    return response.data.data;
  },

  // PUT /api/equipements/:id
  update: async (id, data) => {
    const response = await api.put(`/equipements/${id}`, data);
    return response.data.data;
  },

  // DELETE /api/equipements/:id
  delete: async (id) => {
    const response = await api.delete(`/equipements/${id}`);
    return response.data;
  },

  // PUT /api/equipements/:id/archive
  toggleArchive: async (id) => {
    const response = await api.put(`/equipements/${id}/archive`);
    return response.data.data;
  },

  // GET /api/units?equipement=:id
  getUnits: async (equipementId) => {
    const response = await api.get("/units", { params: { equipement: equipementId } });
    return response.data.data;
  },
};

export default equipementService;