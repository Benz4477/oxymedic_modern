import api from "../api";

const contratService = {
  // Get all contrats
  getAll: async (params = {}) => {
    const res = await api.get("/contrats", { params });
    return res.data;
  },

  // Get one contrat
  getById: async (id) => {
    const res = await api.get(`/contrats/${id}`);
    return res.data;
  },

  // Create contrat from commande
  create: async (data) => {
    const res = await api.post("/contrats", data);
    return res.data;
  },

  // Generate PDF
  generatePDF: async (id) => {
    const res = await api.get(`/contrats/${id}/generate-pdf`);
    return res.data;
  },

  // Sign contrat
  sign: async (id, signature) => {
    const res = await api.post(`/contrats/${id}/sign`, { signature });
    return res.data;
  },

  // Update contrat
  update: async (id, data) => {
    const res = await api.put(`/contrats/${id}`, data);
    return res.data;
  },

  // Delete contrat
  delete: async (id) => {
    const res = await api.delete(`/contrats/${id}`);
    return res.data;
  },

  // Archive contrat
  archive: async (id) => {
    const res = await api.patch(`/contrats/${id}/archive`);
    return res.data;
  },
};

export default contratService;
