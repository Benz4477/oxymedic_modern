import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Search,
  Calendar,
  User,
  Package,
  CreditCard,
  Truck,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

const Commandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    // Simulation de données commandes
    setCommandes([
      {
        id: 1,
        ref: "CMD-2024-001",
        client: "Mohammed Alaoui",
        clientId: 1,
        dateDebut: "15/03/2024",
        dateFin: "15/04/2024",
        equipements: [
          { nom: "Fauteuil roulant électrique", quantite: 1, prix: 2500 },
          { nom: "Lit médicalisé", quantite: 1, prix: 3500 },
        ],
        total: 6000,
        avance: 2000,
        reste: 4000,
        statut: "active",
        livraison: "en_cours",
        caution: 1000,
      },
      {
        id: 2,
        ref: "CMD-2024-002",
        client: "Fatima Zahra Benali",
        clientId: 2,
        dateDebut: "20/03/2024",
        dateFin: "20/04/2024",
        equipements: [{ nom: "Déambulateur", quantite: 2, prix: 800 }],
        total: 1600,
        avance: 1600,
        reste: 0,
        statut: "paid",
        livraison: "livré",
        caution: 500,
      },
      {
        id: 3,
        ref: "CMD-2024-003",
        client: "Youssef Amrani",
        clientId: 3,
        dateDebut: "10/03/2024",
        dateFin: "10/04/2024",
        equipements: [
          { nom: "Oxygène portable", quantite: 1, prix: 1200 },
          { nom: "Matelas anti-escarres", quantite: 1, prix: 600 },
        ],
        total: 1800,
        avance: 500,
        reste: 1300,
        statut: "pending",
        livraison: "attente",
        caution: 800,
      },
    ]);
  }, []);

  const filteredCommandes = commandes.filter((commande) => {
    const matchesSearch =
      commande.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commande.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || commande.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "active":
        return <span className="badge badge-success">Active</span>;
      case "paid":
        return <span className="badge badge-success">Payée</span>;
      case "pending":
        return <span className="badge badge-warning">En attente</span>;
      case "cancelled":
        return <span className="badge badge-danger">Annulée</span>;
      default:
        return <span className="badge badge-info">{statut}</span>;
    }
  };

  const getLivraisonBadge = (livraison) => {
    switch (livraison) {
      case "livré":
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} /> Livré
          </span>
        );
      case "en_cours":
        return (
          <span className="badge badge-warning">
            <Truck size={12} /> En cours
          </span>
        );
      case "attente":
        return (
          <span className="badge badge-info">
            <Clock size={12} /> Attente
          </span>
        );
      default:
        return <span className="badge badge-secondary">{livraison}</span>;
    }
  };

  const handleAddCommande = () => {
    // Logique pour ajouter une commande
  };

  const handleViewCommande = (commande) => {
    // Logique pour voir les détails
  };

  const handleEditCommande = (commande) => {
    // Logique pour modifier
  };

  const handleDeleteCommande = (commandeId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      setCommandes(commandes.filter((c) => c.id !== commandeId));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des Commandes
          </h1>
          <p className="text-gray-600 text-sm">
            {commandes.length} commande{commandes.length > 1 ? "s" : ""} en
            cours
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleAddCommande}
        >
          <Plus size={16} />
          Nouvelle commande
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <ShoppingCart size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {commandes.length}
              </div>
              <div className="text-xs text-gray-600">Total commandes</div>
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
                {commandes.filter((c) => c.statut === "active").length}
              </div>
              <div className="text-xs text-gray-600">Commandes actives</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {commandes.filter((c) => c.statut === "pending").length}
              </div>
              <div className="text-xs text-gray-600">En attente</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <CreditCard size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {commandes
                  .reduce((sum, c) => sum + (c.total || 0), 0)
                  .toLocaleString()}{" "}
                MAD
              </div>
              <div className="text-xs text-gray-600">Valeur totale</div>
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
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Rechercher par référence, client..."
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
            <option value="active">Active</option>
            <option value="paid">Payée</option>
            <option value="pending">En attente</option>
            <option value="cancelled">Annulée</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Filter size={16} />
            Filtrer
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Commandes Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Période</th>
              <th>Équipements</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Livraison</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommandes.map((commande) => (
              <tr key={commande.id}>
                <td className="font-semibold text-blue-600 font-mono">
                  {commande.reference}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                      {commande.client
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        ? commande.client
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "?"}
                    </div>
                    <span className="text-sm">{commande.client}</span>
                  </div>
                </td>
                <td className="text-xs text-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {commande.dateDebut}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {commande.duree} jours
                  </div>
                </td>
                <td className="text-xs">
                  {commande.equipements.map((eq, idx) => (
                    <div key={idx} className="mb-0.5">
                      {eq.quantite}x {eq.nom}
                    </div>
                  ))}
                </td>
                <td>
                  <div className="font-semibold text-gray-900">
                    {commande.total ? commande.total.toLocaleString() : "0"} MAD
                  </div>
                  <div className="text-xs text-gray-600">
                    Avance:{" "}
                    {commande.avance ? commande.avance.toLocaleString() : "0"}{" "}
                    MAD
                  </div>
                </td>
                <td>{getStatusBadge(commande.statut)}</td>
                <td>{getLivraisonBadge(commande.livraison)}</td>
                <td>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleViewCommande(commande)}
                      title="Voir les détails"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleEditCommande(commande)}
                      title="Modifier"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteCommande(commande.id)}
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

        {filteredCommandes.length === 0 && (
          <div className="text-center p-10 text-gray-600">
            <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
            <div>Aucune commande trouvée</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Commandes;
