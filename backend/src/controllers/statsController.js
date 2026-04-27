import Client from "../models/Client.js";
import Commande from "../models/Commande.js";
import Paiement from "../models/Paiement.js";
import Frais from "../models/Frais.js";

const fetchDashboardStats = async (req, res) => {
  try {
    // Simuler les données du dashboard
    const stats = {
      totalClients: 156,
      activeClients: 142,
      totalOrders: 89,
      pendingOrders: 12,
      totalRevenue: 45680,
      monthlyRevenue: 12450,
      totalEquipment: 234,
      availableEquipment: 189,
      totalDeliveries: 67,
      pendingDeliveries: 8,
      totalPayments: 234,
      pendingPayments: 15,
      newClientsThisMonth: 18,
      revenueGrowth: 12.5,
      orderGrowth: 8.3,
      clientRetention: 94.2,
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des statistiques' 
    });
  }
};

const fetchMonthlyDeliveryCosts = async (req, res) => {
  try {
    // Simuler les données de frais de livraison mensuels
    const monthlyCosts = [
      { month: 'Janvier', cost: 2500 },
      { month: 'Février', cost: 2800 },
      { month: 'Mars', cost: 3200 },
      { month: 'Avril', cost: 2900 },
      { month: 'Mai', cost: 3100 },
      { month: 'Juin', cost: 3400 },
    ];
    
    res.json({
      success: true,
      data: monthlyCosts
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des frais de livraison' 
    });
  }
};

export {
  fetchDashboardStats,
  fetchMonthlyDeliveryCosts,
};
