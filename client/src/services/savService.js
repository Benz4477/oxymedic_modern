// client/src/services/savService.js
import api from "../api";

const savService = {
    getAll: async (params = {}) => {
        const res = await api.get("/sav", { params });
        return res.data.data;
    },
    getById: async (id) => {
        const res = await api.get(`/sav/${id}`);
        return res.data.data;
    },
    create: async (data) => {
        const res = await api.post("/sav", data);
        return res.data.data;
    },
    update: async (id, data) => {
        const res = await api.put(`/sav/${id}`, data);
        return res.data.data;
    },
    addNote: async (id, note) => {
        const res = await api.post(`/sav/${id}/notes`, { note });
        return res.data.data;
    },
    resolve: async (id) => {
        const res = await api.put(`/sav/${id}/resolve`);
        return res.data.data;
    },
    delete: async (id) => {
        const res = await api.delete(`/sav/${id}`);
        return res.data;
    },
    getStats: async () => {
        const res = await api.get("/sav/stats");
        return res.data.data;
    },
    convertToMaintenance: async (id) => {
        const res = await api.post(`/sav/${id}/to-maintenance`);
        return res.data.data;
    },
};

export default savService;