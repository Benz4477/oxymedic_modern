import api from "../../frontend/src/api";

// Service pour récupérer les statistiques du dashboard
export const fetchDashboardStats = async () => {
  try {
    const response = await api.get("/stats/dashboard");
    return response.data.data;
  } catch (error) {
    console.error("Erreur fetchDashboardStats:", error);
    throw error;
  }
};

// Service pour récupérer les commandes récentes
export const fetchRecentOrders = async () => {
  try {
    const response = await api.get("/commandes?limit=5&sort=createdAt:desc");
    return response.data.data;
  } catch (error) {
    console.error("Erreur fetchRecentOrders:", error);
    throw error;
  }
};

// Service pour récupérer les livraisons du jour
export const fetchTodayDeliveries = async () => {
  try {
    const response = await api.get("/livraisons?date=today");
    return response.data.data;
  } catch (error) {
    console.error("Erreur fetchTodayDeliveries:", error);
    throw error;
  }
};

// Service pour récupérer les coûts de livraison mensuels
export const fetchMonthlyDeliveryCosts = async () => {
  try {
    const response = await api.get("/frais/monthly");
    return response.data.data;
  } catch (error) {
    console.error("Erreur fetchMonthlyDeliveryCosts:", error);
    throw error;
  }
};

// Service pour récupérer les paiements récents
export const fetchRecentPayments = async () => {
  try {
    const response = await api.get("/paiements?limit=5&sort=createdAt:desc");
    return response.data.data;
  } catch (error) {
    console.error("Erreur fetchRecentPayments:", error);
    throw error;
  }
};

// Service pour récupérer les alertes
export const fetchAlerts = async () => {
  try {
    // En attendant une vraie API d'alertes, on simule avec les commandes et paiements en retard
    const [overdueOrders, pendingPayments] = await Promise.all([
      api.get("/commandes?status=overdue"),
      api.get("/paiements?status=pending"),
    ]);

    const alerts = [];

    // Alertes pour commandes en retard
    overdueOrders.data.data.forEach((order) => {
      alerts.push({
        id: `order-${order._id}`,
        type: "contract",
        level: "urgent",
        icon: "🚨",
        title: "Fin de location expirée",
        message: `${order.client?.name || "Client"} — ${order.equipement?.name || "Équipement"} (expiré depuis ${calculateDaysOverdue(order.endDate)} jours)`,
        action: "/app/commandes",
      });
    });

    // Alertes pour paiements en retard
    pendingPayments.data.data.forEach((payment) => {
      alerts.push({
        id: `payment-${payment._id}`,
        type: "payment",
        level: "info",
        icon: "💵",
        title: "Paiement en retard",
        message: `${payment.client?.name || "Client"} — ${payment.amount} MAD impayé depuis ${calculateDaysOverdue(payment.dueDate)} jours`,
        action: "/app/paiements",
      });
    });

    return alerts;
  } catch (error) {
    console.error("Erreur fetchAlerts:", error);
    throw error;
  }
};

// Service pour récupérer les informations de la société
export const fetchSociete = async () => {
  try {
    const response = await api.get("/societe");
    return response.data.data;
  } catch (error) {
    console.error("Erreur fetchSociete:", error);
    // Retourner les données par défaut si l'API n'existe pas encore
    return {
      nom: "OXYMEDIC",
      slogan: "Le confort médical à domicile",
      logo: null,
      tel: "+212 5XX-XXX-XXX",
      ice: "123456789012345",
      rib: "1234 5678 9012 3456 78",
    };
  }
};

// Fonction utilitaire pour calculer les jours de retard
const calculateDaysOverdue = (dateString) => {
  const overdueDate = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - overdueDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};
