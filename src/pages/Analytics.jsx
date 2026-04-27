import React, { useState, useEffect } from "react";
import {
  BarChart,
  LineChart,
  PieChart,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

const Analytics = () => {
  const [period, setPeriod] = useState("month");
  const [chartType, setChartType] = useState("revenue");

  useEffect(() => {
    // Simulation de données analytics
  }, []);

  // Données simulées pour les graphiques
  const revenueData = [
    { month: "Jan", revenue: 45000, orders: 45, clients: 32 },
    { month: "Fev", revenue: 52000, orders: 52, clients: 38 },
    { month: "Mar", revenue: 48000, orders: 48, clients: 35 },
    { month: "Avr", revenue: 61000, orders: 61, clients: 42 },
    { month: "Mai", revenue: 58000, orders: 58, clients: 40 },
    { month: "Jun", revenue: 67000, orders: 67, clients: 45 },
  ];

  const categoryData = [
    { category: "Fauteuils roulants", value: 35, color: "var(--b600)" },
    { category: "Lits médicalisés", value: 28, color: "var(--g600)" },
    { category: "Oxygène portable", value: 18, color: "var(--a600)" },
    { category: "Déambulateurs", value: 12, color: "var(--p600)" },
    { category: "Autres", value: 7, color: "var(--r600)" },
  ];

  const performanceMetrics = [
    {
      title: "Chiffre d'affaires",
      value: "67 000 MAD",
      change: "+15.2%",
      trend: "up",
      icon: DollarSign,
      color: "var(--g600)",
    },
    {
      title: "Commandes",
      value: "67",
      change: "+8.1%",
      trend: "up",
      icon: ShoppingCart,
      color: "var(--b600)",
    },
    {
      title: "Clients actifs",
      value: "45",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "var(--a600)",
    },
    {
      title: "Taux de conversion",
      value: "68%",
      change: "-2.3%",
      trend: "down",
      icon: Activity,
      color: "var(--r600)",
    },
  ];

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <ArrowUp size={16} className="text-green-600" />;
      case "down":
        return <ArrowDown size={16} className="text-red-600" />;
      default:
        return <Minus size={16} className="text-gray-600" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case "up":
        return "var(--g600)";
      case "down":
        return "var(--r600)";
      default:
        return "var(--tx3)";
    }
  };

  const handleExport = () => {
    // Logique d'exportation
  };

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);
  const totalClients = revenueData.reduce((sum, item) => sum + item.clients, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Analytics & Rapports
          </h1>
          <p className="text-gray-600 text-sm">
            Vue d'ensemble des performances et tendances
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          <button
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={handleExport}
          >
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {performanceMetrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <metric.icon size={20} className={metric.color} />
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metric.trend)}
                <span
                  className="text-xs font-semibold"
                  style={{ color: getTrendColor(metric.trend) }}
                >
                  {metric.change}
                </span>
              </div>
            </div>
            <div className="text-xl font-bold text-gray-900 mb-1">
              {metric.value}
            </div>
            <div className="text-sm text-gray-600">{metric.title}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} />
            Évolution du chiffre d'affaires
          </h3>
          <div className="h-80 flex items-end gap-2 py-5">
            {revenueData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-600 rounded-t relative"
                  style={{
                    height: `${(item.revenue / Math.max(...revenueData.map((d) => d.revenue))) * 250}px`,
                  }}
                >
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs text-gray-700 whitespace-nowrap">
                    {item.revenue.toLocaleString()} MAD
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">{item.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart size={18} />
            Répartition par catégorie
          </h3>
          <div className="py-5">
            {categoryData.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-900 font-medium">
                    {item.category}
                  </span>
                  <span className="text-sm text-gray-700 font-semibold">
                    {item.value}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.value}%`,
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Stats Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart size={18} />
          Statistiques détaillées
        </h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>Période</th>
              <th>Chiffre d'affaires</th>
              <th>Commandes</th>
              <th>Clients</th>
              <th>Panier moyen</th>
              <th>Taux conversion</th>
            </tr>
          </thead>
          <tbody>
            {revenueData.map((item, index) => (
              <tr key={index}>
                <td className="font-semibold text-gray-900">{item.month}</td>
                <td>{item.revenue.toLocaleString()} MAD</td>
                <td>{item.orders}</td>
                <td>{item.clients}</td>
                <td>
                  {Math.round(item.revenue / item.orders).toLocaleString()} MAD
                </td>
                <td>
                  <span className="text-green-600 font-medium">
                    {Math.round((item.clients / item.orders) * 100)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-blue-50 font-semibold">
              <td>Total</td>
              <td>{totalRevenue.toLocaleString()} MAD</td>
              <td>{totalOrders}</td>
              <td>{totalClients}</td>
              <td>
                {Math.round(totalRevenue / totalOrders).toLocaleString()} MAD
              </td>
              <td>{Math.round((totalClients / totalOrders) * 100)}%</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Filter size={18} />
          Actions rapides
        </h3>
        <div className="flex gap-3 flex-wrap">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download size={16} />
            Générer rapport mensuel
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Calendar size={16} />
            Planifier rapport automatique
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <BarChart size={16} />
            Comparer périodes
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Users size={16} />
            Analyser clients
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
