import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Calendar,
  Phone,
  Mail,
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  Heart,
  Star,
} from "lucide-react";

const CRM = () => {
  const [clients, setClients] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    // Simulation de données CRM
    setClients([
      {
        id: 1,
        nom: "Alaoui",
        prenom: "Mohammed",
        tel: "0612345678",
        email: "mohammed.aloui@email.com",
        statut: "actif",
        dateDernierContact: "20/03/2024",
        score: 85,
        segment: "premium",
        totalCommandes: 5,
        totalDepense: 25000,
        notes: "Client fidèle, toujours ponctuel",
        preferences: ["livraison_rapide", "paiement_virement"],
        prochaineAction: "Appel de satisfaction",
        dateProchaineAction: "25/03/2024",
      },
      {
        id: 2,
        nom: "Benali",
        prenom: "Fatima Zahra",
        tel: "0623456789",
        email: "fatima.benali@email.com",
        statut: "actif",
        dateDernierContact: "18/03/2024",
        score: 72,
        segment: "standard",
        totalCommandes: 3,
        totalDepense: 8500,
        notes: "Intéressée par nos services de longue durée",
        preferences: ["location_mensuelle"],
        prochaineAction: "Envoyer catalogue",
        dateProchaineAction: "22/03/2024",
      },
      {
        id: 3,
        nom: "Amrani",
        prenom: "Youssef",
        tel: "0634567890",
        email: "youssef.amrani@email.com",
        statut: "inactif",
        dateDernierContact: "15/02/2024",
        score: 45,
        segment: "occasionnel",
        totalCommandes: 1,
        totalDepense: 1200,
        notes: "Client occasionnel, nécessite relance",
        preferences: ["paiement_espece"],
        prochaineAction: "Relance téléphonique",
        dateProchaineAction: "28/03/2024",
      },
    ]);

    setInteractions([
      {
        id: 1,
        clientId: 1,
        type: "appel",
        date: "20/03/2024",
        heure: "10:30",
        duree: "15 minutes",
        sujet: "Suivi commande CMD-2024-001",
        notes: "Client satisfait, demande réduction sur prochaine commande",
        resultat: "positif",
        auteur: "Commercial 1",
      },
      {
        id: 2,
        clientId: 2,
        type: "email",
        date: "18/03/2024",
        heure: "14:15",
        duree: "-",
        sujet: "Envoi catalogue produits",
        notes: "Email envoyé avec catalogue complet",
        resultat: "en_attente",
        auteur: "Commercial 2",
      },
      {
        id: 3,
        clientId: 1,
        type: "visite",
        date: "15/03/2024",
        heure: "16:00",
        duree: "45 minutes",
        sujet: "Démonstration fauteuil roulant",
        notes: "Client très intéressé par modèle premium",
        resultat: "positif",
        auteur: "Commercial 1",
      },
    ]);
  }, []);

  const filteredClients = clients.map((client) => {
    const matchesSearch =
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.tel.includes(searchTerm);
    const matchesType = !typeFilter || client.segment === typeFilter;
    const matchesStatus = !statusFilter || client.statut === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "actif":
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} /> Actif
          </span>
        );
      case "inactif":
        return (
          <span className="badge badge-warning">
            <Clock size={12} /> Inactif
          </span>
        );
      case "perdu":
        return (
          <span className="badge badge-danger">
            <AlertTriangle size={12} /> Perdu
          </span>
        );
      default:
        return <span className="badge badge-secondary">{statut}</span>;
    }
  };

  const getSegmentBadge = (segment) => {
    switch (segment) {
      case "premium":
        return (
          <span className="badge badge-danger">
            <Star size={12} /> Premium
          </span>
        );
      case "standard":
        return <span className="badge badge-primary">Standard</span>;
      case "occasionnel":
        return <span className="badge badge-secondary">Occasionnel</span>;
      default:
        return <span className="badge badge-secondary">{segment}</span>;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "var(--g600)";
    if (score >= 60) return "var(--a600)";
    if (score >= 40) return "var(--p600)";
    return "var(--r600)";
  };

  const handleAddClient = () => {
    // Logique pour ajouter un client CRM
  };

  const handleViewClient = (client) => {
    // Logique pour voir les détails
  };

  const handleEditClient = (client) => {
    // Logique pour modifier
  };

  const handleAddInteraction = (clientId) => {
    // Logique pour ajouter une interaction
  };

  const totalActifs = clients.filter((c) => c.statut === "actif").length;
  const totalPremium = clients.filter((c) => c.segment === "premium").length;
  const scoreMoyen = Math.round(
    clients.reduce((sum, c) => sum + c.score, 0) / clients.length,
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            CRM - Relation Client
          </h1>
          <p className="text-gray-600 text-sm">
            {clients.length} clients • {totalActifs} actifs • {totalPremium}{" "}
            premium
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleAddClient}
        >
          <Plus size={16} />
          Nouveau client
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
                {clients.length}
              </div>
              <div className="text-xs text-gray-600">Total clients</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalActifs}
              </div>
              <div className="text-xs text-gray-600">Actifs</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Star size={20} className="text-red-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalPremium}
              </div>
              <div className="text-xs text-gray-600">Premium</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Heart size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {scoreMoyen}
              </div>
              <div className="text-xs text-gray-600">Score moyen</div>
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
              placeholder="Rechercher par nom, email, téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">Tous les segments</option>
            <option value="premium">Premium</option>
            <option value="standard">Standard</option>
            <option value="basique">Basique</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
            <option value="perdu">Perdu</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>Client</th>
              <th>Contact</th>
              <th>Segment</th>
              <th>Score</th>
              <th>Commandes</th>
              <th>Dépense totale</th>
              <th>Dernier contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                      {client.prenom.charAt(0)}
                      {client.nom.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {client.prenom} {client.nom}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: CLI{client.id.toString().padStart(4, "0")}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-sm">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Phone size={12} className="text-gray-500" />
                      {client.tel}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail size={12} className="text-gray-500" />
                      {client.email}
                    </div>
                  </div>
                </td>
                <td>{getSegmentBadge(client.segment)}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div
                      className="text-base font-semibold"
                      style={{ color: getScoreColor(client.score) }}
                    >
                      {client.score}
                    </div>
                    <div className="w-15 h-1 bg-gray-200 rounded overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${client.score}%`,
                          background: getScoreColor(client.score),
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">
                    {client.totalCommandes}
                  </div>
                </td>
                <td>
                  <div className="text-sm font-semibold text-gray-900">
                    {client.totalDepense
                      ? client.totalDepense.toLocaleString()
                      : "0"}{" "}
                    MAD
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">
                    {client.dateDernierContact}
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
                      onClick={() => handleEditClient(client)}
                      title="Modifier"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleAddInteraction(client)}
                      title="Ajouter une interaction"
                    >
                      <MessageSquare size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredClients.length === 0 && (
          <div className="text-center p-10 text-gray-600">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <div>Aucun client trouvé</div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        style={{ marginTop: "24px" }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "var(--tx1)",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Users size={18} />
          Actions rapides
        </h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Ajouter un client
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <MessageSquare size={16} />
            Planifier relances
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter les clients
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Heart size={16} />
            Campagne de fidélisation
          </button>
        </div>
      </div>
    </div>
  );
};

export default CRM;
