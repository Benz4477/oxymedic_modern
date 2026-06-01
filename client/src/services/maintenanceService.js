import api from "../api";

const maintenanceService = {
    getAll: async (params = {}) => {
        const res = await api.get("/maintenances", { params });
        return res.data.data;
    },
    getById: async (id) => {
        const res = await api.get(`/maintenances/${id}`);
        return res.data.data;
    },
    create: async (data) => {
        const res = await api.post("/maintenances", data);
        return res.data.data;
    },
    update: async (id, data) => {
        const res = await api.put(`/maintenances/${id}`, data);
        return res.data.data;
    },
    addNote: async (id, note) => {
        const res = await api.post(`/maintenances/${id}/notes`, { note });
        return res.data.data;
    },
    close: async (id) => {
        const res = await api.put(`/maintenances/${id}/close`);
        return res.data.data;
    },
    delete: async (id) => {
        const res = await api.delete(`/maintenances/${id}`);
        return res.data;
    },
    getStats: async () => {
        const res = await api.get("/maintenances/stats");
        return res.data.data;
    },
};

export default maintenanceService;