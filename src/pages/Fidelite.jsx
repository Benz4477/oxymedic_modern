import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Eye,
  Star,
  TrendingUp,
  Gift,
  Heart,
  CheckCircle,
  Award,
  Crown,
  Zap,
} from "lucide-react";

const Fidelite = () => {
  const [clients, setClients] = useState([]);
  const [recompenses, setRecompenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  useEffect(() => {
    // Simulation de données clients fidélité
    setClients([
      {
        id: 1,
        nom: "Mohamed Ben Ali",
        email: "mohamed.benali@email.com",
        niveau: "OR",
        points: 2500,
        pointsDisponibles: 1200,
        totalAchats: 15000,
        tauxConversion: 85,
        dernierAchat: "2024-03-15",
        dateInscription: "2023-01-10",
      },
      {
        id: 2,
        nom: "Fatima Alami",
        email: "fatima.alami@email.com",
        niveau: "PLATINE",
        points: 5000,
        pointsDisponibles: 2800,
        totalAchats: 35000,
        tauxConversion: 92,
        dernierAchat: "2024-03-20",
        dateInscription: "2022-06-15",
      },
      {
        id: 3,
        nom: "Karim Mansouri",
        email: "karim.mansouri@email.com",
        niveau: "ARGENT",
        points: 800,
        pointsDisponibles: 350,
        totalAchats: 5000,
        tauxConversion: 65,
        dernierAchat: "2024-02-28",
        dateInscription: "2023-09-20",
      },
      {
        id: 4,
        nom: "Amina Belhaj",
        email: "amina.belhaj@email.com",
        niveau: "BRONZE",
        points: 200,
        pointsDisponibles: 80,
        totalAchats: 1500,
        tauxConversion: 45,
        dernierAchat: "2024-01-10",
        dateInscription: "2024-01-05",
      },
    ]);

    // Simulation de données récompenses
    setRecompenses([
      {
        id: 1,
        nom: "Réduction 10%",
        description: "10% de réduction sur prochaine commande",
        points: 500,
        niveau: "BRONZE",
        valide: true,
        image: null,
      },
      {
        id: 2,
        nom: "Produit gratuit",
        description: "Produit offert pour 1000 points",
        points: 1000,
        niveau: "ARGENT",
        valide: true,
        image: null,
      },
      {
        id: 3,
        nom: "Livraison premium",
        description: "Livraison express gratuite pendant 1 mois",
        points: 1500,
        niveau: "OR",
        valide: true,
        image: null,
      },
      {
        id: 4,
        nom: "Service VIP",
        description: "Accès VIP et priorité pendant 3 mois",
        points: 3000,
        niveau: "PLATINE",
        valide: false,
        image: null,
      },
    ]);
  }, []);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !levelFilter || client.niveau === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const getNiveauBadge = (niveau) => {
    switch (niveau) {
      case "BRONZE":
        return (
          <span
            className="badge"
            style={{ background: "#CD7F32", color: "white" }}
          >
            <Award size={12} style={{ marginRight: "4px" }} />
            Bronze
          </span>
        );
      case "ARGENT":
        return (
          <span
            className="badge"
            style={{ background: "#C0C0C0", color: "white" }}
          >
            <Award size={12} style={{ marginRight: "4px" }} />
            Argent
          </span>
        );
      case "OR":
        return (
          <span
            className="badge"
            style={{ background: "#FFD700", color: "#333" }}
          >
            <Crown size={12} style={{ marginRight: "4px" }} />
            Or
          </span>
        );
      case "PLATINE":
        return (
          <span
            className="badge"
            style={{ background: "#E5E4E2", color: "#333" }}
          >
            <Zap size={12} style={{ marginRight: "4px" }} />
            Platine
          </span>
        );
      default:
        return <span className="badge">{niveau}</span>;
    }
  };

  const getNiveauColor = (niveau) => {
    switch (niveau) {
      case "BRONZE":
        return "#CD7F32";
      case "ARGENT":
        return "#C0C0C0";
      case "OR":
        return "#FFD700";
      case "PLATINE":
        return "#6c757d";
      default:
        return "#6c757d";
    }
  };

  const handleAddClient = () => {
    // Logique pour ajouter un client au programme
  };

  const handleViewClient = (client) => {
    // Logique pour afficher les détails du client
  };

  const handleAdjustPoints = (client) => {
    // Logique pour ajuster les points du client
  };

  const handleSendReward = (client) => {
    // Logique pour envoyer une récompense
  };

  const handleAddReward = () => {
    // Logique pour ajouter une récompense
  };

  const totalPoints = clients.reduce((sum, c) => sum + c.pointsDisponibles, 0);
  const totalParticipants = clients.length;
  const moyennePoints = Math.round(totalPoints / totalParticipants);
  const tauxConversionGlobal = Math.round(
    clients.reduce((sum, c) => sum + c.tauxConversion, 0) / clients.length,
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Programme de Fidélité
          </h1>
          <p className="text-gray-600 text-sm">
            {totalParticipants} participants • {totalPoints.toLocaleString()}{" "}
            points disponibles
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleAddClient}
        >
          <Plus size={16} />
          Ajouter un client
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalParticipants}
              </div>
              <div className="text-xs text-gray-600">Participants</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Star size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalPoints.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Points totaux</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {tauxConversionGlobal}%
              </div>
              <div className="text-xs text-gray-600">Taux conversion</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Gift size={20} className="text-red-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {recompenses.length}
              </div>
              <div className="text-xs text-gray-600">Récompenses</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="flex gap-3 items-center flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Rechercher par nom, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">Tous les niveaux</option>
            <option value="BRONZE">Bronze</option>
            <option value="ARGENT">Argent</option>
            <option value="OR">Or</option>
            <option value="PLATINE">Platine</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Clients Fidelity Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>Client</th>
              <th>Niveau</th>
              <th>Points disponibles</th>
              <th>Total achats</th>
              <th>Taux conversion</th>
              <th>Dernier achat</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      {client.nom
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {client.nom}
                      </div>
                      <div className="text-xs text-gray-500">
                        {client.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{getNiveauBadge(client.niveau)}</td>
                <td>
                  <div
                    className="text-base font-semibold"
                    style={{ color: getNiveauColor(client.niveau) }}
                  >
                    {client.pointsDisponibles.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Total: {client.points.toLocaleString()}
                  </div>
                </td>
                <td>
                  <div className="text-sm font-semibold text-gray-900">
                    {client.totalAchats.toLocaleString()} MAD
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">
                    {client.tauxConversion}%
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">
                    {client.dernierAchat}
                  </div>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleViewClient(client)}
                      title="Voir les détails"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleAdjustPoints(client)}
                      title="Ajuster les points"
                    >
                      <Star size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleSendReward(client)}
                      title="Envoyer une récompense"
                    >
                      <Gift size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredClients.length === 0 && (
          <div className="text-center p-10 text-gray-600">
            <Heart size={48} className="mx-auto mb-4 opacity-30" />
            <div>Aucun client trouvé</div>
          </div>
        )}
      </div>

      {/* Récompenses Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Gift size={18} />
          Récompenses disponibles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {recompenses.map((recompense) => (
            <div
              key={recompense.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-semibold text-gray-900 mb-0">
                  {recompense.nom}
                </h4>
                {recompense.valide && (
                  <CheckCircle size={16} className="text-green-600" />
                )}
              </div>
              <p className="text-xs text-gray-600 mb-3">
                {recompense.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-amber-600">
                  {recompense.points} pts
                </span>
                <span className="text-xs text-gray-500">
                  {recompense.niveau}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            onClick={handleAddReward}
          >
            <Plus size={16} />
            Ajouter une récompense
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Star size={18} />
          Actions rapides
        </h3>
        <div className="flex gap-3 flex-wrap">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Ajouter un client
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Gift size={16} />
            Gérer les récompenses
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter les points
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Award size={16} />
            Calculer les niveaux
          </button>
        </div>
      </div>
    </div>
  );
};

export default Fidelite;
