import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Eye,
  AlertTriangle,
  ShoppingCart,
  Clock,
  RefreshCw,
} from "lucide-react";

const Consommables = () => {
  const [consommables, setConsommables] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    // Simulation de données consommables
    setConsommables([
      {
        id: 1,
        nom: "Gants en nitrile",
        reference: "GN-001",
        description: "Gants en nitrile non stériles, taille M",
        categorie: "Gants",
        stockActuel: 250,
        stockMin: 100,
        stockMax: 500,
        unite: "pièces",
        prixUnitaire: 2.5,
        fournisseur: "MedicalSupply",
        datePeremption: "2024-12-31",
        statut: "disponible",
        alerte: false,
      },
      {
        id: 2,
        nom: "Masques chirurgicaux",
        reference: "MC-002",
        description: "Masques chirurgicaux type II",
        categorie: "Protection",
        stockActuel: 50,
        stockMin: 200,
        stockMax: 1000,
        unite: "pièces",
        prixUnitaire: 1.2,
        fournisseur: "HealthPro",
        datePeremption: "2024-08-15",
        statut: "alerte",
        alerte: true,
      },
      {
        id: 3,
        nom: "Alcool isopropylique 70%",
        reference: "AI-003",
        description: "Solution hydroalcoolique 70% 1L",
        categorie: "Hygiène",
        stockActuel: 15,
        stockMin: 20,
        stockMax: 50,
        unite: "L",
        prixUnitaire: 8.0,
        fournisseur: "CleanLab",
        datePeremption: "2025-03-20",
        statut: "alerte",
        alerte: true,
      },
      {
        id: 4,
        nom: "Pansements stériles",
        reference: "PS-004",
        description: "Pansements stériles 10x10cm",
        categorie: "Pansements",
        stockActuel: 120,
        stockMin: 50,
        stockMax: 200,
        unite: "pièces",
        prixUnitaire: 3.5,
        fournisseur: "WoundCare",
        datePeremption: "2024-10-30",
        statut: "disponible",
        alerte: false,
      },
    ]);
  }, []);

  const filteredConsommables = consommables.filter((consommable) => {
    const matchesSearch =
      consommable.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consommable.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consommable.fournisseur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !categoryFilter || consommable.categorie === categoryFilter;
    const matchesStatus = !statusFilter || consommable.statut === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStockColor = (stock, min) => {
    if (stock <= min * 0.5) return "rgb(220, 38, 38)"; // red-600
    if (stock <= min) return "rgb(245, 158, 11)"; // amber-500
    return "rgb(34, 197, 94)"; // green-500
  };

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "disponible":
        return <span className="badge badge-success">Disponible</span>;
      case "alerte":
        return <span className="badge badge-warning">Alerte stock</span>;
      case "perime":
        return <span className="badge badge-danger">Périmé</span>;
      default:
        return <span className="badge">{statut}</span>;
    }
  };

  const handleAddConsommable = () => {
    // Logique pour ajouter un consommable
  };

  const handleViewConsommable = (consommable) => {
    // Logique pour afficher les détails du consommable
  };

  const handleEditConsommable = (consommable) => {
    // Logique pour modifier le consommable
  };

  const handleDeleteConsommable = (consommableId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce consommable ?")) {
      setConsommables(consommables.filter((c) => c.id !== consommableId));
    }
  };

  const handleRestockConsommable = (consommable) => {
    // Logique pour reconstituer le stock
  };

  const totalAlertes = consommables.filter((c) => c.alerte).length;
  const totalValeur = consommables.reduce(
    (sum, c) => sum + c.stockActuel * c.prixUnitaire,
    0,
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Produits Consommables
          </h1>
          <p className="text-gray-600 text-sm">
            {consommables.length} produits • {totalAlertes} alertes •{" "}
            {totalValeur.toLocaleString()} MAD valeur stock
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleAddConsommable}
        >
          <Plus size={16} />
          Nouveau consommable
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
                {consommables.length}
              </div>
              <div className="text-xs text-gray-600">Total produits</div>
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
                {totalAlertes}
              </div>
              <div className="text-xs text-gray-600">Alertes stock</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <ShoppingCart size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalValeur.toLocaleString()} MAD
              </div>
              <div className="text-xs text-gray-600">Valeur stock</div>
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
                {
                  consommables.filter(
                    (c) =>
                      new Date(c.datePeremption) <=
                      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                  ).length
                }
              </div>
              <div className="text-xs text-gray-600">Prochaine péremption</div>
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
              placeholder="Rechercher par référence, nom, fournisseur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">Toutes les catégories</option>
            <option value="Protection">Protection</option>
            <option value="Hygiène">Hygiène</option>
            <option value="Pansements">Pansements</option>
            <option value="Gants">Gants</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">Tous les statuts</option>
            <option value="disponible">Disponible</option>
            <option value="alerte">Alerte stock</option>
            <option value="perime">Périmé</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Consommables Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Catégorie</th>
              <th>Stock actuel</th>
              <th>Stock min/max</th>
              <th>Prix unitaire</th>
              <th>Fournisseur</th>
              <th>Péremption</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredConsommables.map((consommable) => (
              <tr key={consommable.id}>
                <td>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {consommable.nom}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {consommable.reference}
                    </div>
                    <div className="text-xs text-gray-600">
                      {consommable.description}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="bg-blue-100 px-2 py-0.5 rounded text-xs">
                    {consommable.categorie}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div
                      className="text-base font-semibold"
                      style={{
                        color: getStockColor(
                          consommable.stockActuel,
                          consommable.stockMin,
                        ),
                      }}
                    >
                      {consommable.stockActuel} {consommable.unite}
                    </div>
                    {consommable.alerte && (
                      <AlertTriangle size={16} className="text-red-600" />
                    )}
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">
                    Min: {consommable.stockMin} {consommable.unite}
                  </div>
                  <div className="text-sm text-gray-700">
                    Max: {consommable.stockMax} {consommable.unite}
                  </div>
                </td>
                <td>
                  <div className="text-sm font-semibold text-gray-900">
                    {consommable.prixUnitaire} MAD
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">
                    {consommable.fournisseur}
                  </div>
                </td>
                <td>
                  <div
                    className="text-sm"
                    style={{
                      color:
                        new Date(consommable.datePeremption) <=
                        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                          ? "rgb(220, 38, 38)"
                          : "rgb(75, 85, 99)",
                    }}
                  >
                    {consommable.datePeremption}
                  </div>
                </td>
                <td>{getStatusBadge(consommable.statut)}</td>
                <td>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleViewConsommable(consommable)}
                      title="Voir les détails"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleEditConsommable(consommable)}
                      title="Modifier"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleRestockConsommable(consommable)}
                      title="Reconstituer le stock"
                    >
                      <RefreshCw size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredConsommables.length === 0 && (
          <div className="text-center p-10 text-gray-600">
            <Package size={48} className="mx-auto mb-4 opacity-30" />
            <div>Aucun consommable trouvé</div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Package size={18} />
          Actions rapides
        </h3>
        <div className="flex gap-3 flex-wrap">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Ajouter un consommable
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <AlertTriangle size={16} />
            Gérer les alertes
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter les stocks
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <ShoppingCart size={16} />
            Commander des fournitures
          </button>
        </div>
      </div>
    </div>
  );
};

export default Consommables;
