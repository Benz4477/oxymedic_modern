import React, { useState, useEffect } from "react";
import {
  Receipt,
  Plus,
  Search,
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
  Download,
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
} from "lucide-react";

const Facturation = () => {
  const [factures, setFactures] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    // Simulation de données factures
    setFactures([
      {
        id: 1,
        reference: "FAC-2024-001",
        client: "Mohammed Alaoui",
        clientId: 1,
        dateCreation: "15/03/2024",
        dateEcheance: "15/04/2024",
        montant: 8500,
        montantPaye: 6000,
        montantRestant: 2500,
        statut: "partiellement_payee",
        type: "facture",
        commandeRef: "CMD-2024-001",
        equipements: [
          { nom: "Fauteuil roulant électrique", quantite: 1, prix: 2500 },
          { nom: "Lit médicalisé électrique", quantite: 1, prix: 3500 },
          { nom: "Oxygène portable", quantite: 1, prix: 1500 },
        ],
        notes: "Facture pour location mensuelle",
        envoyeLe: "16/03/2024",
        modePaiement: "virement",
      },
      {
        id: 2,
        reference: "PRO-2024-002",
        client: "Fatima Zahra Benali",
        clientId: 2,
        dateCreation: "20/03/2024",
        dateEcheance: "20/04/2024",
        montant: 3200,
        montantPaye: 0,
        montantRestant: 3200,
        statut: "non_payee",
        type: "proforma",
        commandeRef: "CMD-2024-002",
        equipements: [
          { nom: "Déambulateur", quantite: 2, prix: 800 },
          { nom: "Matelas anti-escarres", quantite: 1, prix: 1600 },
        ],
        notes: "Proforma pour validation client",
        envoyeLe: "21/03/2024",
        modePaiement: null,
      },
      {
        id: 3,
        reference: "FAC-2024-003",
        client: "Youssef Amrani",
        clientId: 3,
        dateCreation: "10/03/2024",
        dateEcheance: "10/04/2024",
        montant: 5400,
        montantPaye: 5400,
        montantRestant: 0,
        statut: "payee",
        type: "facture",
        commandeRef: "CMD-2024-003",
        equipements: [
          { nom: "Lit médicalisé", quantite: 1, prix: 3000 },
          { nom: "Fauteuil de douche", quantite: 1, prix: 2400 },
        ],
        notes: "Facture réglée",
        envoyeLe: "11/03/2024",
        modePaiement: "espece",
        datePaiement: "12/03/2024",
      },
    ]);
  }, []);

  const filteredFactures = factures.map((facture) => {
    const matchesSearch =
      (facture.reference &&
        facture.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (facture.client &&
        facture.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (facture.commandeRef &&
        facture.commandeRef.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || facture.statut === statusFilter;
    const matchesType = !typeFilter || facture.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "brouillon":
        return <span className="badge badge-secondary">Brouillon</span>;
      case "envoyee":
        return (
          <span className="badge badge-warning">
            <FileText size={12} /> Envoyée
          </span>
        );
      case "non_payee":
        return (
          <span className="badge badge-danger">
            <AlertTriangle size={12} /> Non payée
          </span>
        );
      case "partiellement_payee":
        return (
          <span className="badge badge-warning">
            <Clock size={12} /> Partiellement payée
          </span>
        );
      case "payee":
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} /> Payée
          </span>
        );
      case "annulee":
        return <span className="badge badge-danger">Annulée</span>;
      default:
        return <span className="badge badge-info">{statut}</span>;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "facture":
        return <span className="badge badge-primary">Facture</span>;
      case "proforma":
        return <span className="badge badge-info">Proforma</span>;
      case "avoir":
        return <span className="badge badge-warning">Avoir</span>;
      default:
        return <span className="badge badge-secondary">{type}</span>;
    }
  };

  const handleAddFacture = () => {
    // Logique pour ajouter une facture
  };

  const handleViewFacture = (facture) => {
    // Logique pour voir les détails
  };

  const handleEditFacture = (facture) => {
    // Logique pour modifier
  };

  const handleDeleteFacture = (factureId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) {
      setFactures(factures.filter((f) => f.id !== factureId));
    }
  };

  const handleSendFacture = (facture) => {
    // Logique pour envoyer la facture
  };

  const handleMarkAsPaid = (factureId) => {
    // Logique pour marquer comme payée
    setFactures(
      factures.map((f) =>
        f.id === factureId
          ? {
              ...f,
              statut: "payee",
              montantPaye: f.montant,
              montantRestant: 0,
              datePaiement: new Date().toLocaleDateString(),
            }
          : f,
      ),
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion de la Facturation
          </h1>
          <p className="text-gray-600 text-sm">
            {factures.length} documents au total •{" "}
            {factures.filter((f) => f.statut === "non_payee").length} en attente
            de paiement
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleAddFacture}
        >
          <Plus size={16} />
          Nouvelle facture
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Receipt size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {factures.length}
              </div>
              <div className="text-xs text-gray-600">Total documents</div>
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
                {factures.filter((f) => f.statut === "payee").length}
              </div>
              <div className="text-xs text-gray-600">Payées</div>
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
                  factures.filter((f) => f.statut === "partiellement_payee")
                    .length
                }
              </div>
              <div className="text-xs text-gray-600">Partiellement payées</div>
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
                {factures.filter((f) => f.statut === "non_payee").length}
              </div>
              <div className="text-xs text-gray-600">Non payées</div>
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
              placeholder="Rechercher par référence, client, commande..."
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
            <option value="facture">Facture</option>
            <option value="devis">Devis</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">Tous les statuts</option>
            <option value="brouillon">Brouillon</option>
            <option value="envoyee">Envoyée</option>
            <option value="non_payee">Non payée</option>
            <option value="partiellement_payee">Partiellement payée</option>
            <option value="payee">Payée</option>
            <option value="annulee">Annulée</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Factures Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Date création</th>
              <th>Échéance</th>
              <th>Montant</th>
              <th>Payé/Restant</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFactures.map((facture) => (
              <tr key={facture.id}>
                <td>
                  <div className="font-semibold text-blue-600 font-mono">
                    {facture.reference}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                      {facture.client
                        ? facture.client
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "?"}
                    </div>
                    <span className="text-sm">{facture.client}</span>
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {facture.dateCreation}
                    </div>
                    {facture.commandeRef && (
                      <div className="text-xs text-gray-500">
                        {facture.commandeRef}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="font-semibold text-gray-900">
                    {facture.montant ? facture.montant.toLocaleString() : "0"}{" "}
                    MAD
                  </div>
                </td>
                <td>
                  <div className="text-sm">
                    <div className="text-green-600 font-medium">
                      {facture.montantPaye
                        ? facture.montantPaye.toLocaleString()
                        : "0"}{" "}
                      MAD
                    </div>
                    <div className="text-red-600">
                      {facture.montantRestant
                        ? facture.montantRestant.toLocaleString()
                        : "0"}{" "}
                      MAD
                    </div>
                  </div>
                </td>
                <td>{getStatusBadge(facture.statut)}</td>
                <td>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleViewFacture(facture)}
                      title="Voir les détails"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleEditFacture(facture)}
                      title="Modifier"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleSendFacture(facture)}
                      title="Envoyer"
                    >
                      <FileText size={12} />
                    </button>
                    {facture.statut !== "payee" &&
                      facture.montantRestant > 0 && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleMarkAsPaid(facture.id)}
                          title="Marquer comme payée"
                        >
                          <CreditCard size={12} />
                        </button>
                      )}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteFacture(facture.id)}
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

        {filteredFactures.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--tx3)",
            }}
          >
            <Receipt
              size={48}
              style={{ margin: "0 auto", marginBottom: "16px", opacity: "0.3" }}
            />
            <div>Aucune facture trouvée</div>
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
          <Receipt size={18} />
          Actions rapides
        </h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Créer une facture
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <FileText size={16} />
            Générer proformas
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter en PDF
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <CreditCard size={16} />
            Suivi des paiements
          </button>
        </div>
      </div>
    </div>
  );
};

export default Facturation;
