import React, { useState, useEffect } from "react";
import {
  Settings,
  Plus,
  Search,
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  Wrench,
  Phone,
  Mail,
} from "lucide-react";

const SAV = () => {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  useEffect(() => {
    // Simulation de données SAV
    setTickets([
      {
        id: 1,
        reference: "SAV-2024-001",
        client: "Mohammed Alaoui",
        clientId: 1,
        commandeRef: "CMD-2024-001",
        equipement: "Fauteuil roulant électrique",
        dateCreation: "15/03/2024",
        dateIntervention: "18/03/2024",
        statut: "en_cours",
        priorite: "haute",
        type: "panne",
        description: "Le fauteuil ne charge plus correctement",
        technicien: "Karim Amrani",
        technicienId: 1,
        notes: "Diagnostic en cours",
        tempsEstime: "2 heures",
        pieces: ["Batterie", "Câble de charge"],
        cout: 850,
        garantie: true,
        satisfaction: null,
      },
      {
        id: 2,
        reference: "SAV-2024-002",
        client: "Fatima Zahra Benali",
        clientId: 2,
        commandeRef: "CMD-2024-002",
        equipement: "Lit médicalisé",
        dateCreation: "20/03/2024",
        dateIntervention: "22/03/2024",
        statut: "resolu",
        priorite: "moyenne",
        type: "maintenance",
        description: "Maintenance préventive du lit",
        technicien: "Ahmed Benali",
        technicienId: 2,
        notes: "Maintenance effectuée avec succès",
        tempsEstime: "1 heure",
        pieces: ["Huile", "Filtres"],
        cout: 250,
        garantie: false,
        satisfaction: 5,
      },
      {
        id: 3,
        reference: "SAV-2024-003",
        client: "Youssef Amrani",
        clientId: 3,
        commandeRef: "CMD-2024-003",
        equipement: "Oxygène portable",
        dateCreation: "25/03/2024",
        dateIntervention: null,
        statut: "attente",
        priorite: "basse",
        type: "question",
        description: "Client demande des informations sur l'utilisation",
        technicien: null,
        technicienId: null,
        notes: "En attente de technicien disponible",
        tempsEstime: "30 minutes",
        pieces: [],
        cout: 0,
        garantie: true,
        satisfaction: null,
      },
    ]);
  }, []);

  const filteredTickets = tickets.map((ticket) => {
    const matchesSearch =
      ticket.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.equipement.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || ticket.statut === statusFilter;
    const matchesPriority =
      !priorityFilter || ticket.priorite === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "attente":
        return (
          <span className="badge badge-secondary">
            <Clock size={12} /> Attente
          </span>
        );
      case "en_cours":
        return (
          <span className="badge badge-info">
            <Wrench size={12} /> En cours
          </span>
        );
      case "resolu":
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} /> Résolu
          </span>
        );
      case "annule":
        return <span className="badge badge-danger">Annulé</span>;
      default:
        return <span className="badge badge-secondary">{statut}</span>;
    }
  };

  const getPriorityBadge = (priorite) => {
    switch (priorite) {
      case "haute":
        return (
          <span className="badge badge-danger">
            <AlertTriangle size={12} /> Haute
          </span>
        );
      case "moyenne":
        return <span className="badge badge-warning">Moyenne</span>;
      case "basse":
        return <span className="badge badge-success">Basse</span>;
      default:
        return <span className="badge badge-secondary">{priorite}</span>;
    }
  };

  const handleAddTicket = () => {
    // Logique pour ajouter un ticket SAV
  };

  const handleViewTicket = (ticket) => {
    // Logique pour voir les détails
  };

  const handleEditTicket = (ticket) => {
    // Logique pour modifier
  };

  const handleDeleteTicket = (ticketId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce ticket SAV ?")) {
      setTickets(tickets.filter((t) => t.id !== ticketId));
    }
  };

  const handleAssignTechnician = (ticketId) => {
    // Logique pour assigner un technicien
  };

  const totalEnCours = tickets.filter((t) => t.statut === "en_cours").length;
  const totalResolus = tickets.filter((t) => t.statut === "resolu").length;
  const totalHautePriorite = tickets.filter(
    (t) => t.priorite === "haute",
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Service Après-Vente (SAV)
          </h1>
          <p className="text-gray-600 text-sm">
            {tickets.length} tickets • {totalEnCours} en cours • {totalResolus}{" "}
            résolus
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleAddTicket}
        >
          <Plus size={16} />
          Nouveau ticket
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Settings size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {tickets.length}
              </div>
              <div className="text-xs text-gray-600">Total tickets</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Wrench size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalEnCours}
              </div>
              <div className="text-xs text-gray-600">En cours</div>
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
                {totalResolus}
              </div>
              <div className="text-xs text-gray-600">Résolus</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalHautePriorite}
              </div>
              <div className="text-xs text-gray-600">Haute priorité</div>
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
              placeholder="Rechercher par référence, client, équipement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">Tous les statuts</option>
            <option value="attente">Attente</option>
            <option value="en_cours">En cours</option>
            <option value="resolu">Résolu</option>
            <option value="ferme">Fermé</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">Toutes les priorités</option>
            <option value="haute">Haute</option>
            <option value="moyenne">Moyenne</option>
            <option value="basse">Basse</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Équipement</th>
              <th>Type</th>
              <th>Priorité</th>
              <th>Statut</th>
              <th>Technicien</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>
                  <div
                    style={{
                      fontWeight: "600",
                      color: "var(--b600)",
                      fontFamily: "var(--mono)",
                    }}
                  >
                    {ticket.reference}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--tx4)" }}>
                    {ticket.commandeRef}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                      {ticket.client
                        ? ticket.client
                            .split(" ")
                            .map((n, index) => n[0])
                            .join("")
                        : "?"}
                    </div>
                    <span className="text-sm">{ticket.client}</span>
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">
                    {ticket.equipement}
                  </div>
                </td>
                <td>
                  <span className="badge badge-info">{ticket.type}</span>
                </td>
                <td>{getPriorityBadge(ticket.priorite)}</td>
                <td>{getStatusBadge(ticket.statut)}</td>
                <td>
                  <div className="text-sm text-gray-700">
                    {ticket.technicien || "-"}
                  </div>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleViewTicket(ticket)}
                      title="Voir les détails"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleEditTicket(ticket)}
                      title="Modifier"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleAssignTechnician(ticket)}
                      title="Assigner un technicien"
                    >
                      <UserCheck size={12} />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteTicket(ticket.id)}
                      title="Supprimer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredTickets.length === 0 && (
          <div className="text-center p-10 text-gray-600">
            <Settings size={48} className="mx-auto mb-4 opacity-30" />
            <div>Aucun ticket SAV trouvé</div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings size={18} />
          Actions rapides
        </h3>
        <div className="flex gap-3 flex-wrap">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Créer un ticket
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Users size={16} />
            Gérer les techniciens
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter les tickets
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <BarChart size={16} />
            Rapport SAV
          </button>
        </div>
      </div>
    </div>
  );
};

export default SAV;
