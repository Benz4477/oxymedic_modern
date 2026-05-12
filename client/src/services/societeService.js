import api from "../api";

const societeService = {
  // Récupérer les informations de la société
  getAll: async () => {
    const response = await api.get("/societe");
    return response.data.data;
  },

  getSociete: async () => {
    const response = await api.get("/societe");
    return response.data.data;
  },

  // Mettre à jour les informations de la société
  updateSociete: async (societeData) => {
    const response = await api.put("/societe", societeData);
    return response.data.data;
  },

  // Mettre à jour le logo de la société
  updateLogo: async (formData) => {
    const response = await api.post("/societe/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  },

  // Supprimer le logo de la société
  deleteLogo: async () => {
    const response = await api.delete("/societe/logo");
    return response.data;
  },
};

export default societeService;
