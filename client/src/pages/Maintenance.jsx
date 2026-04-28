import React, { useState, useEffect } from "react";
import {
  Wrench,
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
  Settings,
  CalendarCheck,
} from "lucide-react";

const Maintenance = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    // Simulation de données maintenance
    setMaintenances([
      {
        id: 1,
        reference: "MNT-2024-001",
        equipement: "Fauteuil roulant électrique",
        equipementId: 1,
        type: "preventive",
        statut: "planifiee",
        datePlanifiee: "25/03/2024",
        dateExecution: null,
        technicien: "Karim Amrani",
        technicienId: 1,
        dureeEstimee: "2 heures",
        cout: 350,
        description: "Maintenance préventive mensuelle",
        pieces: ["Huile", "Filtres"],
        frequence: "mensuelle",
        derniereExecution: "25/02/2024",
        prochaineExecution: "25/03/2024",
        notes: "Vérifier batterie et freins",
      },
      {
        id: 2,
        reference: "MNT-2024-002",
        equipement: "Lit médicalisé électrique",
        equipementId: 2,
        type: "corrective",
        statut: "en_cours",
        datePlanifiee: "20/03/2024",
        dateExecution: "20/03/2024",
        technicien: "Ahmed Benali",
        technicienId: 2,
        dureeEstimee: "3 heures",
        cout: 650,
        description: "Réparation moteur de réglage",
        pieces: ["Moteur", "Câbles"],
        frequence: "ponctuelle",
        derniereExecution: null,
        prochaineExecution: null,
        notes: "Client signale bruit anormal",
      },
      {
        id: 3,
        reference: "MNT-2024-003",
        equipement: "Oxygène portable",
        equipementId: 3,
        type: "preventive",
        statut: "terminee",
        datePlanifiee: "15/03/2024",
        dateExecution: "15/03/2024",
        technicien: "Karim Amrani",
        technicienId: 1,
        dureeEstimee: "1 heure",
        cout: 200,
        description: "Maintenance préventive",
        pieces: ["Filtres"],
        frequence: "trimestrielle",
        derniereExecution: "15/03/2024",
        prochaineExecution: "15/06/2024",
        notes: "Équipement en bon état",
      },
    ]);
  }, []);

  const filteredMaintenances = maintenances.map((maintenance) => {
    const matchesSearch =
      maintenance.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.equipement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maintenance.technicien.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || maintenance.type === typeFilter;
    const matchesStatus = !statusFilter || maintenance.statut === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "planifiee":
        return (
          <span className="badge badge-secondary">
            <Calendar size={12} /> Planifiée
          </span>
        );
      case "en_cours":
        return (
          <span className="badge badge-info">
            <Wrench size={12} /> En cours
          </span>
        );
      case "terminee":
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} /> Terminée
          </span>
        );
      case "annulee":
        return <span className="badge badge-danger">Annulée</span>;
      default:
        return <span className="badge badge-secondary">{statut}</span>;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "preventive":
        return <span className="badge badge-info">Préventive</span>;
      case "corrective":
        return <span className="badge badge-warning">Corrective</span>;
      case "urgence":
        return <span className="badge badge-danger">Urgence</span>;
      default:
        return <span className="badge badge-secondary">{type}</span>;
    }
  };

  const handleAddMaintenance = () => {
    // Logique pour ajouter une maintenance
  };

  const handleViewMaintenance = (maintenance) => {
    // Logique pour voir les détails
  };

  const handleEditMaintenance = (maintenance) => {
    // Logique pour modifier
  };

  const handleStartMaintenance = (maintenanceId) => {
    setMaintenances(
      maintenances.map((m) =>
        m.id === maintenanceId
          ? {
              ...m,
              statut: "en_cours",
              dateExecution: new Date().toLocaleDateString(),
            }
          : m,
      ),
    );
  };

  const handleCompleteMaintenance = (maintenanceId) => {
    setMaintenances(
      maintenances.map((m) =>
        m.id === maintenanceId
          ? {
              ...m,
              statut: "terminee",
              dateExecution: new Date().toLocaleDateString(),
            }
          : m,
      ),
    );
  };

  const totalPlanifiees = maintenances.filter(
    (m) => m.statut === "planifiee",
  ).length;
  const totalEnCours = maintenances.filter(
    (m) => m.statut === "en_cours",
  ).length;
  const totalTerminees = maintenances.filter(
    (m) => m.statut === "terminee",
  ).length;
  const totalCout = maintenances.reduce((sum, m) => sum + m.cout, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Maintenance des Équipements
          </h1>
          <p className="text-gray-600 text-sm">
            {maintenances.length} maintenances • {totalPlanifiees} planifiées •{" "}
            {totalEnCours} en cours
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleAddMaintenance}
        >
          <Plus size={16} />
          Nouvelle maintenance
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
                {maintenances.length}
              </div>
              <div className="text-xs text-gray-600">Total maintenances</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalPlanifiees}
              </div>
              <div className="text-xs text-gray-600">Planifiées</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Wrench size={20} className="text-green-600" />
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
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Tool size={20} className="text-red-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalCout.toLocaleString()} MAD
              </div>
              <div className="text-xs text-gray-600">Coût total</div>
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
              placeholder="Rechercher par référence, équipement, technicien..."
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
            <option value="preventive">Préventive</option>
            <option value="corrective">Corrective</option>
            <option value="urgence">Urgence</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">Tous les statuts</option>
            <option value="planifiee">Planifiée</option>
            <option value="en_cours">En cours</option>
            <option value="terminee">Terminée</option>
            <option value="annulee">Annulée</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Maintenances Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Équipement</th>
              <th>Type</th>
              <th>Statut</th>
              <th>Date planifiée</th>
              <th>Technicien</th>
              <th>Coût</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaintenances.map((maintenance) => (
              <tr key={maintenance.id}>
                <td>
                  <div className="font-semibold text-blue-600 font-mono">
                    {maintenance.reference}
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">
                    {maintenance.equipement}
                  </div>
                </td>
                <td>{getTypeBadge(maintenance.type)}</td>
                <td>{getStatusBadge(maintenance.statut)}</td>
                <td>
                  <div className="text-sm text-gray-700">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Calendar size={12} className="text-gray-500" />
                      {maintenance.datePlanifiee}
                    </div>
                    {maintenance.dateExecution && (
                      <div className="text-xs text-green-600">
                        Exécutée: {maintenance.dateExecution}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">
                    {maintenance.technicien}
                  </div>
                </td>
                <td>
                  <div className="text-sm font-semibold text-gray-900">
                    {maintenance.cout.toLocaleString()} MAD
                  </div>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleViewMaintenance(maintenance)}
                      title="Voir les détails"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleEditMaintenance(maintenance)}
                      title="Modifier"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleExecuteMaintenance(maintenance)}
                      title="Exécuter la maintenance"
                    >
                      <CheckCircle size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMaintenances.length === 0 && (
          <div className="text-center p-10 text-gray-600">
            <Wrench size={48} className="mx-auto mb-4 opacity-30" />
            <div>Aucune maintenance trouvée</div>
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
            Planifier une maintenance
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Users size={16} />
            Gérer les techniciens
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter les maintenances
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <BarChart size={16} />
            Rapport de maintenance
          </button>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
