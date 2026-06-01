import api from "../api";

const transfertService = {
    // Récupérer tous les transferts
    getAll: async () => {
        const response = await api.get("/transferts");
        return response.data.data;
    },

    // Créer un transfert
    create: async (data) => {
        const response = await api.post("/transferts", data);
        return response.data.data;
    },

    // Mettre à jour le statut
    updateStatus: async (id, statut) => {
        const response = await api.put(`/transferts/${id}/status`, { statut });
        return response.data.data;
    }
};

export default transfertService;
