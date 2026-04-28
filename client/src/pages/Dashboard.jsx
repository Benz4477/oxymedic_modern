// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ShoppingCart,
  Package,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  DollarSign,
  Activity,
  Calendar,
  Truck,
  Wrench,
  Lock,
  RefreshCw,
  Eye,
  MapPin,
  Bell,
  FileText,
} from "lucide-react";
import {
  fetchDashboardStats,
  fetchRecentOrders,
  fetchTodayDeliveries,
  fetchMonthlyDeliveryCosts,
  fetchRecentPayments,
  fetchAlerts,
  fetchSociete,
} from "../services/dashboardService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeLocations: 0,
    totalClients: 0,
    todayDeliveries: 0,
    activeCautions: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [deliveryCosts, setDeliveryCosts] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [societe, setSociete] = useState({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [
        statsData,
        ordersData,
        deliveriesData,
        costsData,
        paymentsData,
        alertsData,
        societeData,
      ] = await Promise.all([
        fetchDashboardStats(),
        fetchRecentOrders(),
        fetchTodayDeliveries(),
        fetchMonthlyDeliveryCosts(),
        fetchRecentPayments(),
        fetchAlerts(),
        fetchSociete(),
      ]);
      setStats(statsData);
      setRecentOrders(ordersData);
      setTodayDeliveries(deliveriesData);
      setDeliveryCosts(costsData);
      setRecentPayments(paymentsData);
      setAlerts(alertsData);
      setSociete(societeData);
    } catch (error) {
      console.error("Erreur chargement dashboard:", error);
      // En attendant l'API, on peut mettre des données mockées
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  // Données mockées pour le développement (à retirer quand l'API est prête)
  const setMockData = () => {
    setStats({
      activeLocations: 42,
      totalClients: 1247,
      todayDeliveries: 8,
      activeCautions: 12800,
    });
    setRecentOrders([
      {
        id: 1,
        ref: "OXY-001",
        client: "Mohammed Alaoui",
        status: "active",
        amount: 1800,
      },
      {
        id: 2,
        ref: "OXY-002",
        client: "Fatima Zahra",
        status: "pending",
        amount: 1400,
      },
      {
        id: 3,
        ref: "OXY-003",
        client: "Youssef Amrani",
        status: "transit",
        amount: 300,
      },
      {
        id: 4,
        ref: "OXY-004",
        client: "Aicha Benali",
        status: "active",
        amount: 1800,
      },
      {
        id: 5,
        ref: "OXY-005",
        client: "Karim Mansouri",
        status: "ended",
        amount: 2500,
      },
    ]);
    setTodayDeliveries([
      {
        id: 1,
        clientId: 1,
        clientName: "Mohammed Alaoui",
        clientInitials: "MA",
        equipIcon: "♿",
        equipName: "Fauteuil roulant",
        time: "09:00",
        status: "transit",
        hasLocation: true,
        lat: 33.5872,
        lng: -7.6243,
        address: "45 Rue Ibn Battouta",
      },
      {
        id: 2,
        clientId: 2,
        clientName: "Fatima Zahra",
        clientInitials: "FZ",
        equipIcon: "🛏️",
        equipName: "Lit médicalisé",
        time: "11:30",
        status: "pending",
        hasLocation: true,
        lat: 33.5942,
        lng: -7.6648,
        address: "12 Bd de la Corniche",
      },
      {
        id: 3,
        clientId: 3,
        clientName: "Youssef Amrani",
        clientInitials: "YA",
        equipIcon: "♿",
        equipName: "Fauteuil roulant",
        time: "14:00",
        status: "pending",
        hasLocation: false,
        lat: null,
        lng: null,
        address: "",
      },
    ]);
    setDeliveryCosts([
      {
        id: 1,
        name: "Karim Mansouri",
        livraisons: 12,
        gasoil: 550,
        autoroute: 85,
        total: 635,
      },
      {
        id: 2,
        name: "Yassine Oukili",
        livraisons: 9,
        gasoil: 320,
        autoroute: 40,
        total: 360,
      },
      {
        id: 3,
        name: "Hamid El Alami",
        livraisons: 5,
        gasoil: 180,
        autoroute: 15,
        total: 195,
      },
    ]);
    setRecentPayments([
      { id: 1, client: "Mohammed Alaoui", amount: 1800, status: "paid" },
      { id: 2, client: "Fatima Zahra", amount: 1400, status: "pending" },
      { id: 3, client: "Youssef Amrani", amount: 300, status: "pending" },
      { id: 4, client: "Aicha Benali", amount: 1800, status: "paid" },
      { id: 5, client: "Karim Mansouri", amount: 2500, status: "paid" },
    ]);
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("fr-MA").format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { label: "Active", className: "bg-green-100 text-green-700" },
      pending: {
        label: "En attente",
        className: "bg-amber-100 text-amber-700",
      },
      transit: { label: "Livraison", className: "bg-blue-100 text-blue-700" },
      ended: { label: "Terminée", className: "bg-gray-100 text-gray-700" },
      paid: { label: "Payé", className: "bg-green-100 text-green-700" },
    };
    const s = statusMap[status] || {
      label: status,
      className: "bg-gray-100 text-gray-700",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-bold ${s.className}`}
      >
        {s.label}
      </span>
    );
  };

  const wazeUrl = (lat, lng, address) => {
    return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes&zoom=17&q=${encodeURIComponent(address || "")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ─── HEADER ─── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bonjour, Admin 👋
        </h1>
        <p className="text-gray-600">
          Voici un aperçu de votre activité aujourd'hui
        </p>
      </div>
      {/* ─── 4 KPI CARDS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Locations actives */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <RefreshCw size={20} className="text-green-600" />
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
              ↑ Ce mois
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.activeLocations}
          </div>
          <div className="text-sm text-gray-500 mt-1">Locations actives</div>
        </div>

        {/* Clients enregistrés */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              Total
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalClients}
          </div>
          <div className="text-sm text-gray-500 mt-1">Clients enregistrés</div>
        </div>

        {/* Livraisons aujourd'hui */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-lg bg-waze-50 flex items-center justify-center">
              <Truck size={20} className="text-waze-600" />
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              Aujourd'hui
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.todayDeliveries}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Livraisons programmées
          </div>
        </div>

        {/* Cautions actives */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Lock size={20} className="text-amber-600" />
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              En cours
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatMoney(stats.activeCautions)} MAD
          </div>
          <div className="text-sm text-gray-500 mt-1">Cautions actives</div>
        </div>
      </div>

      {/* ─── SECTION 2 colonnes : Commandes récentes + Livraisons du jour ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commandes récentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              📋 Commandes récentes
            </h3>
            <button
              onClick={() => navigate("/app/commandes")}
              className="text-xs text-green-600 font-bold hover:underline"
            >
              Voir tout →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-2 text-left">Réf.</th>
                  <th className="px-4 py-2 text-left">Client</th>
                  <th className="px-4 py-2 text-left">Statut</th>
                  <th className="px-4 py-2 text-right">Montant</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/app/commandes/${order.id}`)}
                  >
                    <td className="px-4 py-2 font-mono text-gray-800">
                      {order.ref}
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-800">
                      {order.client}
                    </td>
                    <td className="px-4 py-2">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-4 py-2 text-right font-mono font-bold text-gray-800">
                      {formatMoney(order.amount)} MAD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Livraisons du jour */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              🚚 Livraisons du jour
            </h3>
            <button
              onClick={() => navigate("/app/livraisons")}
              className="text-xs text-green-600 font-bold hover:underline"
            >
              Planning →
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {todayDeliveries.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                Aucune livraison aujourd'hui
              </div>
            ) : (
              todayDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/app/livraisons/${delivery.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                      {delivery.clientInitials}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {delivery.clientName}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <span>{delivery.equipIcon}</span> {delivery.equipName}
                        {delivery.hasLocation && (
                          <a
                            href={wazeUrl(
                              delivery.lat,
                              delivery.lng,
                              delivery.address,
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-waze-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            🗺️ Waze
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700">
                        {delivery.time}
                      </div>
                      {getStatusBadge(delivery.status)}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 justify-end">
                    {delivery.status !== "done" && (
                      <button
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        onClick={(e) => {
                          e.stopPropagation(); /* marquer livrée */
                        }}
                      >
                        ✅ Livrée
                      </button>
                    )}
                    <button
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation(); /* imprimer bon */
                      }}
                    >
                      🖨 Bon
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ─── SECTION 2 colonnes : Frais livreurs + Derniers paiements ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Frais livreurs du mois */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              🚚 Frais livreurs du mois
            </h3>
            <button
              onClick={() => navigate("/app/livreurs")}
              className="text-xs text-green-600 font-bold hover:underline"
            >
              Voir →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-2 text-left">Livreur</th>
                  <th className="px-4 py-2 text-center">Livraisons</th>
                  <th className="px-4 py-2 text-right">Gasoil</th>
                  <th className="px-4 py-2 text-right">Autoroute</th>
                  <th className="px-4 py-2 text-right">Total frais</th>
                </tr>
              </thead>
              <tbody>
                {deliveryCosts.map((cost) => (
                  <tr key={cost.id} className="border-t border-gray-100">
                    <td className="px-4 py-2 font-medium text-gray-800">
                      {cost.name}
                    </td>
                    <td className="px-4 py-2 text-center">{cost.livraisons}</td>
                    <td className="px-4 py-2 text-right font-mono text-amber-600">
                      {formatMoney(cost.gasoil)}
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-purple-600">
                      {formatMoney(cost.autoroute)}
                    </td>
                    <td className="px-4 py-2 text-right font-mono font-bold text-red-600">
                      {formatMoney(cost.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Derniers paiements */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              💰 Derniers paiements
            </h3>
            <button
              onClick={() => navigate("/app/paiements")}
              className="text-xs text-green-600 font-bold hover:underline"
            >
              Voir →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-2 text-left">Client</th>
                  <th className="px-4 py-2 text-right">Montant</th>
                  <th className="px-4 py-2 text-center">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-t border-gray-100 cursor-pointer hover:bg-gray-50"
                    onClick={() => navigate(`/app/paiements/${payment.id}`)}
                  >
                    <td className="px-4 py-2 font-medium text-gray-800">
                      {payment.client}
                    </td>
                    <td className="px-4 py-2 text-right font-mono font-bold text-gray-800">
                      {formatMoney(payment.amount)} MAD
                    </td>
                    <td className="px-4 py-2 text-center">
                      {getStatusBadge(payment.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
