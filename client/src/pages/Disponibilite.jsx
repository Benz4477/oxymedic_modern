import React, { useState, useEffect } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Package,
  Search,
  Filter,
  Eye,
  Edit,
  Plus,
} from "lucide-react";

const Disponibilite = () => {
  const [equipements, setEquipements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    // Simulation de données de disponibilité
    setEquipements([
      {
        id: 1,
        reference: "FR-001",
        nom: "Fauteuil roulant électrique",
        categorie: "Fauteuils roulants",
        stockTotal: 10,
        stockDisponible: 7,
        stockReserve: 2,
        stockLoue: 1,
        statut: "disponible",
        prochainRetour: "25/03/2024",
        prochainDepart: "28/03/2024",
        reservations: [
          { client: "Mohammed Alaoui", debut: "28/03/2024", fin: "28/04/2024" },
        ],
        maintenance: false,
        derniereMaintenance: "15/02/2024",
        prochaineMaintenance: "15/04/2024",
      },
      {
        id: 2,
        reference: "LM-001",
        nom: "Lit médicalisé électrique",
        categorie: "Lits médicalisés",
        stockTotal: 5,
        stockDisponible: 2,
        stockReserve: 2,
        stockLoue: 1,
        statut: "limite",
        prochainRetour: "30/03/2024",
        prochainDepart: "02/04/2024",
        reservations: [
          {
            client: "Fatima Zahra Benali",
            debut: "02/04/2024",
            fin: "02/06/2024",
          },
        ],
        maintenance: false,
        derniereMaintenance: "20/02/2024",
        prochaineMaintenance: "20/05/2024",
      },
      {
        id: 3,
        reference: "OX-001",
        nom: "Oxygène portable",
        categorie: "Oxygène",
        stockTotal: 15,
        stockDisponible: 0,
        stockReserve: 5,
        stockLoue: 10,
        statut: "indisponible",
        prochainRetour: "01/04/2024",
        prochainDepart: "05/04/2024",
        reservations: [
          { client: "Youssef Amrani", debut: "05/04/2024", fin: "05/05/2024" },
        ],
        maintenance: false,
        derniereMaintenance: "10/02/2024",
        prochaineMaintenance: "10/05/2024",
      },
    ]);
  }, []);

  const filteredEquipements = equipements.map((equipement) => {
    const matchesSearch =
      equipement.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipement.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipement.categorie.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || equipement.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "disponible":
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} /> Disponible
          </span>
        );
      case "limite":
        return (
          <span className="badge badge-warning">
            <AlertTriangle size={12} /> Limité
          </span>
        );
      case "indisponible":
        return <span className="badge badge-danger">Indisponible</span>;
      case "maintenance":
        return (
          <span className="badge badge-info">
            <Clock size={12} /> Maintenance
          </span>
        );
      default:
        return <span className="badge badge-secondary">{statut}</span>;
    }
  };

  const getStatutColor = (disponible, total) => {
    const ratio = disponible / total;
    if (ratio >= 0.5) return "var(--g600)";
    if (ratio >= 0.2) return "var(--a600)";
    return "var(--r600)";
  };

  const totalDisponible = equipements.reduce(
    (sum, e) => sum + e.stockDisponible,
    0,
  );
  const totalLoue = equipements.reduce((sum, e) => sum + e.stockLoue, 0);
  const totalReserve = equipements.reduce((sum, e) => sum + e.stockReserve, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Disponibilité des Équipements
          </h1>
          <p className="text-gray-600 text-sm">
            {equipements.length} équipements • {totalDisponible} disponibles •{" "}
            {totalLoue} en location
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus size={16} />
          Mettre à jour le stock
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Package size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {equipements.reduce((sum, e) => sum + e.stockTotal, 0)}
              </div>
              <div className="text-xs text-gray-600">Stock total</div>
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
                {totalDisponible}
              </div>
              <div className="text-xs text-gray-600">Disponibles</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalReserve}
              </div>
              <div className="text-xs text-gray-600">Réservés</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{totalLoue}</div>
              <div className="text-xs text-gray-600">En location</div>
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
              placeholder="Rechercher par référence, nom, catégorie..."
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
            <option value="disponible">Disponible</option>
            <option value="reserve">Réservé</option>
            <option value="loue">En location</option>
            <option value="indisponible">Indisponible</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Availability Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>Équipement</th>
              <th>Catégorie</th>
              <th>Stock total</th>
              <th>Disponible</th>
              <th>Réservé</th>
              <th>En location</th>
              <th>Statut</th>
              <th>Prochains mouvements</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipements.map((equipement) => (
              <tr key={equipement.id}>
                <td>
                  <div className="font-semibold text-gray-900">
                    {equipement.nom}
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    {equipement.reference}
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">
                    {equipement.categorie}
                  </div>
                </td>
                <td>
                  <div className="text-sm font-semibold text-gray-900">
                    {equipement.stockTotal}
                  </div>
                </td>
                <td>
                  <div
                    className="text-base font-semibold"
                    style={{
                      color: getStatutColor(
                        equipement.stockDisponible,
                        equipement.stockTotal,
                      ),
                    }}
                  >
                    {equipement.stockDisponible}
                  </div>
                  <div className="w-16 h-1 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${(equipement.stockDisponible / equipement.stockTotal) * 100}%`,
                        background: getStatutColor(
                          equipement.stockDisponible,
                          equipement.stockTotal,
                        ),
                      }}
                    />
                  </div>
                </td>
                <td>
                  <div className="text-sm font-semibold text-amber-600">
                    {equipement.stockReserve}
                  </div>
                </td>
                <td>
                  <div className="text-sm font-semibold text-red-600">
                    {equipement.stockLoue}
                  </div>
                </td>
                <td>{getStatusBadge(equipement.statut)}</td>
                <td>
                  <div className="text-sm text-gray-700">
                    {equipement.prochainRetour && (
                      <div className="flex items-center gap-1 mb-0.5">
                        <CheckCircle size={12} className="text-green-600" />
                        Retour: {equipement.prochainRetour}
                      </div>
                    )}
                    {equipement.prochainDepart && (
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-amber-600" />
                        Départ: {equipement.prochainDepart}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEquipements.length === 0 && (
          <div className="text-center p-10 text-gray-600">
            <Package size={48} className="mx-auto mb-4 opacity-30" />
            <div>Aucun équipement trouvé</div>
          </div>
        )}
      </div>

      {/* Calendar View */}
      <div className="card mt-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar size={18} />
          Vue calendrier
        </h3>
        <div className="text-center p-10 text-gray-600">
          <Calendar size={48} className="mx-auto mb-4 opacity-30" />
          <div>Vue calendrier en cours de développement</div>
        </div>
      </div>
    </div>
  );
};

export default Disponibilite;
