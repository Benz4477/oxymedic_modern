import Notification from "../models/Notification.js";

export const getAllNotifications = async (req, res) => {
    try {
        const { user } = req;
        // On récupère les notifications qui ciblent le rôle de l'utilisateur ou toutes les notifications si pas de cible
        const notifications = await Notification.find({
            $or: [
                { targetRoles: { $size: 0 } },
                { targetRoles: user.role }
            ]
        }).sort({ createdAt: -1 }).limit(20);
        
        res.json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ success: true, message: "Marqué comme lu" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createNotification = async (data) => {
    try {
        const notification = new Notification(data);
        await notification.save();
        return notification;
    } catch (error) {
        console.error("Erreur création notification:", error);
    }
};
