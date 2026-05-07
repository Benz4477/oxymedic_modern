import api from "../api";

const unitService = {
  // GET /api/units
  getAll: async (params = {}) => {
    const response = await api.get("/units", { params });
    return response.data.data;
  },

  // GET /api/units/:id
  getById: async (id) => {
    const response = await api.get(`/units/${id}`);
    return response.data.data;
  },

  // GET /api/units/equipement/:equipementId
  getByEquipement: async (equipementId) => {
    const response = await api.get(`/units/equipement/${equipementId}`);
    return response.data.data;
  },

  // GET /api/units/search?q=
  search: async (q) => {
    const response = await api.get("/units/search", { params: { q } });
    return response.data.data;
  },

  // POST /api/units
  create: async (data) => {
    const response = await api.post("/units", data);
    return response.data.data;
  },

  // PUT /api/units/:id
  update: async (id, data) => {
    const response = await api.put(`/units/${id}`, data);
    return response.data.data;
  },

  // DELETE /api/units/:id
  delete: async (id) => {
    const response = await api.delete(`/units/${id}`);
    return response.data;
  },
};

export default unitService;