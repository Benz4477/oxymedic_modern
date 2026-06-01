import api from "../api";

const reservationService = {
    getAll: async (params = {}) => {
        const res = await api.get("/reservations", { params });
        return res.data.data;
    },
    getById: async (id) => {
        const res = await api.get(`/reservations/${id}`);
        return res.data.data;
    },
    create: async (data) => {
        const res = await api.post("/reservations", data);
        return res.data.data;
    },
    update: async (id, data) => {
        const res = await api.put(`/reservations/${id}`, data);
        return res.data.data;
    },
    changeStatus: async (id, status) => {
        const res = await api.put(`/reservations/${id}/status`, { status });
        return res.data.data;
    },
    convertToCommande: async (id) => {
        const res = await api.post(`/reservations/${id}/convert`);
        return res.data.data;
    },
    delete: async (id) => {
        const res = await api.delete(`/reservations/${id}`);
        return res.data;
    },
    checkAvailability: async (equipementId, startDate, endDate) => {
        const res = await api.get(`/reservations/check-availability`, {
            params: { equipementId, startDate, endDate },
        });
        return res.data.data;
    },
};

export default reservationService;