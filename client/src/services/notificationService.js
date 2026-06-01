import api from "../api";

const notificationService = {
    getAll: async () => {
        const res = await api.get("/notifications");
        return res.data.data;
    },
    markAsRead: async (id) => {
        const res = await api.put(`/notifications/${id}/read`);
        return res.data;
    }
};

export default notificationService;
