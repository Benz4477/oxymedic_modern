import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Eye,
  Star,
  TrendingUp,
  CheckCircle,
  Settings,
  ShoppingCart,
  AlertTriangle,
} from "lucide-react";

const Produits = () => {
  const [produits, setProduits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    // Simulation de données produits
    setProduits([
      {
        id: 1,
        reference: "MED-001",
        nom: "Stéthoscope électronique",
        description:
          "Stéthoscope numérique haute précision avec réduction de bruit",
        categorie: "Diagnostic",
        stock: 15,
        stockMin: 5,
        prix: 3500,
        prixLocation: 450,
        statut: "disponible",
        popularite: 4,
        note: 4.5,
        fournisseur: "MedicalTech Pro",
        dateAjout: "2024-01-15",
        garantie: "24 mois",
      },
      {
        id: 2,
        reference: "MED-002",
        nom: "Tensiomètre automatique",
        description:
          "Tensiomètre électronique brassard avec validation clinique",
        categorie: "Monitoring",
        stock: 8,
        stockMin: 10,
        prix: 1200,
        prixLocation: 150,
        statut: "alerte",
        popularite: 3,
        note: 4.2,
        fournisseur: "HealthCare Plus",
        dateAjout: "2024-02-20",
        garantie: "12 mois",
      },
      {
        id: 3,
        reference: "MED-003",
        nom: "Thermomètre infrarouge",
        description: "Thermomètre sans contact haute précision",
        categorie: "Diagnostic",
        stock: 25,
        stockMin: 15,
        prix: 450,
        prixLocation: 60,
        statut: "disponible",
        popularite: 5,
        note: 4.8,
        fournisseur: "MediTech Solutions",
        dateAjout: "2024-03-10",
        garantie: "18 mois",
      },
      {
        id: 4,
        reference: "MED-004",
        nom: "Glucomètre portable",
        description: "Glucomètre de poche avec connectivité Bluetooth",
        categorie: "Laboratoire",
        stock: 30,
        stockMin: 20,
        prix: 280,
        prixLocation: 35,
        statut: "disponible",
        popularite: 3,
        note: 4.1,
        fournisseur: "LabTech International",
        dateAjout: "2024-01-25",
        garantie: "12 mois",
      },
      {
        id: 5,
        reference: "MED-005",
        nom: "Oxymètre de pouls",
        description: "Oxymètre multifonctionnel avec affichage LED",
        categorie: "Monitoring",
        stock: 3,
        stockMin: 8,
        prix: 650,
        prixLocation: 80,
        statut: "indisponible",
        popularite: 2,
        note: 3.9,
        fournisseur: "CardioTech",
        dateAjout: "2024-02-15",
        garantie: "24 mois",
      },
    ]);
  }, []);

  const filteredProduits = produits.filter((produit) => {
    const matchesSearch =
      produit.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produit.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !categoryFilter || produit.categorie === categoryFilter;
    const matchesStatus = !statusFilter || produit.statut === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(produits.map((p) => p.categorie))];
  const totalProduits = produits.length;
  const totalDisponibles = produits.filter(
    (p) => p.statut === "disponible",
  ).length;
  const valeurStock = produits.reduce((sum, p) => sum + p.stock * p.prix, 0);
  const noteMoyenne = (
    produits.reduce((sum, p) => sum + p.note, 0) / produits.length
  ).toFixed(1);

  const getPopulariteStars = (popularite) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        fill={i < popularite ? "currentColor" : "none"}
        className={i < popularite ? "text-amber-600" : "text-gray-400"}
      />
    ));
  };

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "disponible":
        return <span className="badge badge-success">Disponible</span>;
      case "alerte":
        return <span className="badge badge-warning">Stock faible</span>;
      case "indisponible":
        return <span className="badge badge-danger">Indisponible</span>;
      default:
        return <span className="badge">{statut}</span>;
    }
  };

  const handleAddProduct = () => {
    // Logique pour ajouter un produit
  };

  const handleViewProduct = (produit) => {
    // Logique pour afficher les détails du produit
  };

  const handleEditProduct = (produit) => {
    // Logique pour modifier le produit
  };

  const handleDeleteProduct = (produitId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      setProduits(produits.filter((p) => p.id !== produitId));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Liste des Produits
          </h1>
          <p className="text-gray-600 text-sm">
            {totalProduits} produits • {totalDisponibles} disponibles •{" "}
            {noteMoyenne} ⭐ moyenne
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleAddProduct}
        >
          <Plus size={16} />
          Nouveau produit
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
                {totalProduits}
              </div>
              <div className="text-xs text-gray-600">Total produits</div>
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
                {totalDisponibles}
              </div>
              <div className="text-xs text-gray-600">Disponibles</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {valeurStock.toLocaleString()} MAD
              </div>
              <div className="text-xs text-gray-600">Valeur stock</div>
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
                {noteMoyenne}
              </div>
              <div className="text-xs text-gray-600">Note moyenne</div>
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
              placeholder="Rechercher par référence, nom, description..."
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
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">Tous les statuts</option>
            <option value="disponible">Disponible</option>
            <option value="alerte">Stock faible</option>
            <option value="indisponible">Indisponible</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProduits.map((produit) => (
            <div
              key={produit.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              {/* Product Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    {produit.nom}
                  </h4>
                  <div className="text-xs text-gray-500 font-mono">
                    {produit.reference}
                  </div>
                </div>
                {getStatusBadge(produit.statut)}
              </div>

              {/* Product Description */}
              <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                {produit.description}
              </p>

              {/* Product Info */}
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Catégorie:</span>
                  <span className="font-medium">{produit.categorie}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Stock:</span>
                  <span
                    className={`font-medium ${produit.stock <= produit.stockMin ? "text-red-600" : "text-green-600"}`}
                  >
                    {produit.stock} unités
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Prix:</span>
                  <span className="font-semibold text-blue-600">
                    {produit.prix.toLocaleString()} MAD
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium text-amber-600">
                    {produit.prixLocation.toLocaleString()} MAD/mois
                  </span>
                </div>
              </div>

              {/* Rating and Popularity */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {getPopulariteStars(produit.popularite)}
                  </div>
                  <span className="text-xs text-gray-600">{produit.note}</span>
                </div>
                <div className="text-xs text-gray-600">
                  {produit.fournisseur}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-1">
                <button
                  className="btn btn-xs btn-sec flex-1"
                  onClick={() => handleViewProduct(produit)}
                  title="Voir les détails"
                >
                  <Eye size={12} />
                </button>
                <button
                  className="btn btn-xs btn-sec flex-1"
                  onClick={() => handleEditProduct(produit)}
                  title="Modifier"
                >
                  <Edit size={12} />
                </button>
                <button
                  className="btn btn-xs btn-danger"
                  onClick={() => handleDeleteProduct(produit.id)}
                  title="Supprimer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProduits.length === 0 && (
          <div className="text-center p-10 text-gray-600">
            <Package size={48} className="mx-auto mb-4 opacity-30" />
            <div>Aucun produit trouvé</div>
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
            Ajouter un produit
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <ShoppingCart size={16} />
            Gérer les commandes
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <AlertTriangle size={16} />
            Alertes de stock
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter l'inventaire
          </button>
        </div>
      </div>
    </div>
  );
};

export default Produits;
