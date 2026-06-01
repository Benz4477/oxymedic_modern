import Client   from "../models/Client.js";
import Commande  from "../models/Commande.js";
import Paiement  from "../models/Paiement.js";
import Frais     from "../models/Frais.js";
import Facture   from "../models/Facture.js";
import Livraison from "../models/Livraison.js";

const fetchDashboardStats = async (req, res) => {
  try {
    const f = req.magasinId ? { magasin: req.magasinId } : {};

    const [clients, commandes, paiements, factures, livraisons] = await Promise.all([
      Client.find(f),
      Commande.find(f),
      Paiement.find(f),
      Facture.find(f),
      Livraison.find(f),
    ]);

    // Calcul du CA : paiements payés + factures payées
    const totalRevenue = paiements
      .filter(p => p.statut === "paid")
      .reduce((s, p) => s + (p.montant || 0), 0);

    // Mois en cours
    const now       = new Date();
    const thisMonth = now.getMonth();
    const thisYear  = now.getFullYear();
    const isThisMonth = d => {
      const date = new Date(d);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    };

    const monthlyRevenue = paiements
      .filter(p => p.statut === "paid" && isThisMonth(p.datePaiement || p.createdAt))
      .reduce((s, p) => s + (p.montant || 0), 0);

    const newClientsThisMonth = clients.filter(c => isThisMonth(c.createdAt)).length;

    const stats = {
      totalClients:        clients.length,
      activeClients:       clients.length,
      totalOrders:         commandes.length,
      pendingOrders:       commandes.filter(c => c.statut === "pending").length,
      totalRevenue,
      monthlyRevenue,
      totalDeliveries:     livraisons.length,
      pendingDeliveries:   livraisons.filter(l => l.statut === "pending").length,
      totalPayments:       paiements.length,
      pendingPayments:     paiements.filter(p => p.statut === "pending").length,
      newClientsThisMonth,
      revenueGrowth:       0,
      orderGrowth:         0,
      clientRetention:     clients.length > 0 ? 100 : 0,
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des statistiques",
    });
  }
};

const fetchMonthlyDeliveryCosts = async (req, res) => {
  try {
    const f = req.magasinId ? { magasin: req.magasinId } : {};
    const fraisAll = await Frais.find(f);

    // Grouper par mois
    const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
    const grouped = {};
    fraisAll.forEach(fr => {
      const d = new Date(fr.createdAt || fr.date || Date.now());
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      grouped[key] = (grouped[key] || { month: MONTHS[d.getMonth()], cost: 0 });
      grouped[key].cost += fr.montant || 0;
    });

    const monthlyCosts = Object.values(grouped).length
      ? Object.values(grouped)
      : MONTHS.slice(0, 6).map(m => ({ month: m, cost: 0 }));

    res.json({ success: true, data: monthlyCosts });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des frais de livraison",
    });
  }
};

export { fetchDashboardStats, fetchMonthlyDeliveryCosts };

