import api from "../api";

const commandeService = {
  // GET /api/commandes
  getAll: async (params = {}) => {
    const response = await api.get("/commandes", { params });
    return response.data.data;
  },

  // GET /api/commandes/:id
  getById: async (id) => {
    const response = await api.get(`/commandes/${id}`);
    return response.data.data;
  },

  // POST /api/commandes
  create: async (data) => {
    const response = await api.post("/commandes", data);
    return response.data.data;
  },

  // PUT /api/commandes/:id
  update: async (id, data) => {
    const response = await api.put(`/commandes/${id}`, data);
    return response.data.data;
  },

  // DELETE /api/commandes/:id
  delete: async (id) => {
    const response = await api.delete(`/commandes/${id}`);
    return response.data;
  },

  // PUT /api/commandes/:id/statut
  updateStatut: async (id, statut) => {
    const response = await api.put(`/commandes/${id}/statut`, { statut });
    return response.data.data;
  },

  // POST /api/commandes/:id/reconduire
  reconduire: async (id, data) => {
    const response = await api.post(`/commandes/${id}/reconduire`, data);
    return response.data.data;
  },
};

export default commandeService;