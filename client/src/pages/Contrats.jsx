import React, { useState, useEffect } from "react";
import {
  FileText,
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
  DollarSign,
  Users,
} from "lucide-react";

const Contrats = () => {
  const [contrats, setContrats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    // Simulation de données contrats
    setContrats([
      {
        id: 1,
        reference: "CTR-2024-001",
        client: "Clinique El Mansour",
        clientId: 1,
        type: "location",
        statut: "actif",
        dateDebut: "01/01/2024",
        dateFin: "31/12/2024",
        duree: "12 mois",
        montantMensuel: 15000,
        montantTotal: 180000,
        equipements: [
          { nom: "Fauteuil roulant électrique", quantite: 5 },
          { nom: "Lit médicalisé", quantite: 3 },
        ],
        conditions: "Maintenance incluse",
        renouvellementAuto: true,
        dateSignature: "28/12/2023",
        responsable: "Commercial 1",
        notes: "Contrat principal avec la clinique",
      },
      {
        id: 2,
        reference: "CTR-2024-002",
        client: "Centre de Réadaptation",
        clientId: 2,
        type: "maintenance",
        statut: "actif",
        dateDebut: "15/01/2024",
        dateFin: "14/01/2025",
        duree: "12 mois",
        montantMensuel: 3500,
        montantTotal: 42000,
        equipements: [{ nom: "Équipements divers", quantite: 15 }],
        conditions: "Maintenance préventive mensuelle",
        renouvellementAuto: false,
        dateSignature: "10/01/2024",
        responsable: "Commercial 2",
        notes: "Contrat de maintenance annuel",
      },
      {
        id: 3,
        reference: "CTR-2024-003",
        client: "Hôpital Ibn Sina",
        clientId: 3,
        type: "service",
        statut: "en_attente",
        dateDebut: "01/04/2024",
        dateFin: "30/06/2024",
        duree: "3 mois",
        montantMensuel: 8000,
        montantTotal: 24000,
        equipements: [{ nom: "Oxygène portable", quantite: 10 }],
        conditions: "Service complet avec remplacement",
        renouvellementAuto: false,
        dateSignature: null,
        responsable: "Commercial 1",
        notes: "En attente de signature",
      },
    ]);
  }, []);

  const filteredContrats = contrats.map((contrat) => {
    const matchesSearch =
      contrat.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrat.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || contrat.statut === statusFilter;
    const matchesType = !typeFilter || contrat.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "actif":
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} /> Actif
          </span>
        );
      case "en_attente":
        return (
          <span className="badge badge-warning">
            <Clock size={12} /> Attente
          </span>
        );
      case "termine":
        return <span className="badge badge-secondary">Terminé</span>;
      case "annule":
        return <span className="badge badge-danger">Annulé</span>;
      default:
        return <span className="badge badge-secondary">{statut}</span>;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "location":
        return <span className="badge badge-primary">Location</span>;
      case "maintenance":
        return <span className="badge badge-info">Maintenance</span>;
      case "service":
        return <span className="badge badge-warning">Service</span>;
      default:
        return <span className="badge badge-secondary">{type}</span>;
    }
  };

  const handleAddContrat = () => {
    // Logique pour ajouter un contrat
  };

  const handleViewContrat = (contrat) => {
    // Logique pour voir les détails
  };

  const handleEditContrat = (contrat) => {
    // Logique pour modifier
  };

  const handleDeleteContrat = (contratId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce contrat ?")) {
      setContrats(contrats.filter((c) => c.id !== contratId));
    }
  };

  const totalActifs = contrats.filter((c) => c.statut === "actif").length;
  const totalMensuel = contrats.reduce((sum, c) => sum + c.montantMensuel, 0);
  const totalAnnuel = contrats.reduce((sum, c) => sum + c.montantTotal, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Contrats Clients
          </h1>
          <p className="text-gray-600 text-sm">
            {contrats.length} contrats • {totalActifs} actifs •{" "}
            {totalMensuel.toLocaleString()} MAD/mois
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleAddContrat}
        >
          <Plus size={16} />
          Nouveau contrat
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {contrats.length}
              </div>
              <div className="text-xs text-gray-600">Total contrats</div>
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
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalMensuel.toLocaleString()} MAD
              </div>
              <div className="text-xs text-gray-600">Mensuel</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-red-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalAnnuel.toLocaleString()} MAD
              </div>
              <div className="text-xs text-gray-600">Annuel</div>
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
              placeholder="Rechercher par référence, client..."
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
            <option value="">Tous les types</option>
            <option value="location">Location</option>
            <option value="maintenance">Maintenance</option>
            <option value="service">Service</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="suspendu">Suspendu</option>
            <option value="termine">Terminé</option>
            <option value="resilie">Résilié</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Type</th>
              <th>Période</th>
              <th>Mensuel</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContrats.map((contrat) => (
              <tr key={contrat.id}>
                <td>
                  <div className="font-semibold text-blue-600 font-mono">
                    {contrat.reference}
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">{contrat.client}</div>
                </td>
                <td>{getTypeBadge(contrat.type)}</td>
                <td>
                  <div className="text-sm text-gray-700">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Calendar size={12} className="text-gray-500" />
                      {contrat.dateDebut}
                    </div>
                    {contrat.dateFin && (
                      <div className="text-xs text-gray-500">
                        Fin: {contrat.dateFin}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="text-sm font-semibold text-gray-900">
                    {contrat.montantMensuel.toLocaleString()} MAD
                  </div>
                </td>
                <td>
                  <div className="text-sm font-semibold text-gray-900">
                    {contrat.montantTotal.toLocaleString()} MAD
                  </div>
                </td>
                <td>{getStatusBadge(contrat.statut)}</td>
                <td>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleViewContrat(contrat)}
                      title="Voir les détails"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleEditContrat(contrat)}
                      title="Modifier"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleRenewContrat(contrat)}
                      title="Renouveler"
                    >
                      <RefreshCw size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-center p-10 text-gray-600">
          <FileText size={48} className="mx-auto mb-4 opacity-30" />
          <div>Aucun contrat trouvé</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText size={18} />
          Actions rapides
        </h3>
        <div className="flex gap-3 flex-wrap">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Créer un contrat
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Calendar size={16} />
            Renouvellements en attente
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter les contrats
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <DollarSign size={16} />
            Rapport de revenus
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contrats;
