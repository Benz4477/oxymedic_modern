import api from "../api";

const loyaltyService = {
    getAll: async (params = {}) => {
        const res = await api.get("/loyalty", { params });
        return res.data.data;
    },
    getByClient: async (clientId) => {
        const res = await api.get(`/loyalty/client/${clientId}`);
        return res.data.data;
    },
    create: async (data) => {
        const res = await api.post("/loyalty", data);
        return res.data.data;
    },
    addPoints: async (clientId, points, reason) => {
        const res = await api.post("/loyalty/points/add", { clientId, points, reason });
        return res.data.data;
    },
    usePoints: async (clientId, points, reason) => {
        const res = await api.post("/loyalty/points/use", { clientId, points, reason });
        return res.data.data;
    },
    delete: async (id) => {
        const res = await api.delete(`/loyalty/${id}`);
        return res.data;
    },
    getStats: async () => {
        const res = await api.get("/loyalty/stats");
        return res.data.data;
    },
};

export default loyaltyService;