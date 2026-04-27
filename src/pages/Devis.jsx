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
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";

const Devis = () => {
  const [devis, setDevis] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    // Simulation de données devis
    setDevis([
      {
        id: 1,
        reference: "DEV-2024-001",
        client: "Mohammed Alaoui",
        clientId: 1,
        dateCreation: "15/03/2024",
        dateValidite: "15/04/2024",
        montant: 8500,
        statut: "envoye",
        equipements: [
          { nom: "Fauteuil roulant électrique", quantite: 1, prix: 2500 },
          { nom: "Lit médicalisé électrique", quantite: 1, prix: 3500 },
          { nom: "Oxygène portable", quantite: 1, prix: 1500 },
        ],
        notes: "Devis pour location mensuelle",
        envoyeLe: "16/03/2024",
        accepteLe: null,
      },
      {
        id: 2,
        reference: "DEV-2024-002",
        client: "Fatima Zahra Benali",
        clientId: 2,
        dateCreation: "20/03/2024",
        dateValidite: "20/04/2024",
        montant: 3200,
        statut: "accepte",
        equipements: [
          { nom: "Déambulateur", quantite: 2, prix: 800 },
          { nom: "Matelas anti-escarres", quantite: 1, prix: 1600 },
        ],
        notes: "Location pour 2 mois",
        envoyeLe: "21/03/2024",
        accepteLe: "22/03/2024",
      },
      {
        id: 3,
        reference: "DEV-2024-003",
        client: "Youssef Amrani",
        clientId: 3,
        dateCreation: "10/03/2024",
        dateValidite: "10/04/2024",
        montant: 5400,
        statut: "expiré",
        equipements: [
          { nom: "Lit médicalisé", quantite: 1, prix: 3000 },
          { nom: "Fauteuil de douche", quantite: 1, prix: 2400 },
        ],
        notes: "Devis pour location courte durée",
        envoyeLe: "11/03/2024",
        accepteLe: null,
      },
    ]);
  }, []);

  const filteredDevis = devis.map((devi) => {
    const matchesSearch =
      (devi.reference &&
        devi.reference.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (devi.client &&
        devi.client.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || devi.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (statut, dateValidite) => {
    const isExpired = dateValidite
      ? new Date(
          dateValidite ? dateValidite.split("/").reverse().join("-") : "",
        ) < new Date()
      : false;

    if (isExpired && statut !== "accepte") {
      return (
        <span className="badge badge-danger">
          <AlertTriangle size={12} /> Expiré
        </span>
      );
    }

    switch (statut) {
      case "brouillon":
        return <span className="badge badge-secondary">Brouillon</span>;
      case "envoye":
        return (
          <span className="badge badge-warning">
            <Send size={12} /> Envoyé
          </span>
        );
      case "accepte":
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} /> Accepté
          </span>
        );
      case "refuse":
        return <span className="badge badge-danger">Refusé</span>;
      case "expiré":
        return (
          <span className="badge badge-danger">
            <Clock size={12} /> Expiré
          </span>
        );
      default:
        return <span className="badge badge-info">{statut}</span>;
    }
  };

  const handleAddDevis = () => {
    // Logique pour ajouter un devis
  };

  const handleViewDevis = (devis) => {
    // Logique pour voir les détails
  };

  const handleEditDevis = (devis) => {
    // Logique pour modifier
  };

  const handleDeleteDevis = (devisId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce devis ?")) {
      setDevis(devis.filter((d) => d.id !== devisId));
    }
  };

  const handleSendDevis = (devis) => {
    // Logique pour envoyer le devis
  };

  const handleConvertToCommande = (devis) => {
    // Logique pour convertir en commande
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Gestion des Devis
          </h1>
          <p className="text-gray-600 text-sm">
            {devis.length} devis au total •{" "}
            {devis.filter((d) => d.statut === "envoye").length} en attente
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleAddDevis}
        >
          <Plus size={16} />
          Nouveau devis
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
                {devis.length}
              </div>
              <div className="text-xs text-gray-600">Total devis</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Send size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {devis.filter((d) => d.statut === "envoye").length}
              </div>
              <div className="text-xs text-gray-600">En attente</div>
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
                {devis.filter((d) => d.statut === "accepte").length}
              </div>
              <div className="text-xs text-gray-600">Acceptés</div>
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
                {
                  devis.filter(
                    (d) =>
                      d.statut === "refuse" ||
                      new Date(d.dateValidite) < new Date(),
                  ).length
                }
              </div>
              <div className="text-xs text-gray-600">Expirés</div>
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
            <option value="brouillon">Brouillon</option>
            <option value="envoye">Envoyé</option>
            <option value="accepte">Accepté</option>
            <option value="refuse">Refusé</option>
            <option value="expiré">Expiré</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Devis Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Date création</th>
              <th>Validité</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevis.map((devis) => (
              <tr key={devis.id}>
                <td className="font-semibold text-blue-600 font-mono">
                  {devis.reference}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                      {devis.client
                        ? devis.client
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "?"}
                    </div>
                    <span className="text-sm">{devis.client}</span>
                  </div>
                </td>
                <td className="text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {devis.dateCreation}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    Validité: {devis.dateValidite}
                  </div>
                </td>
                <td className="text-sm text-gray-700">{devis.dateValidite}</td>
                <td>
                  <div className="font-semibold text-gray-900">
                    {devis.montant ? devis.montant.toLocaleString() : "0"} MAD
                  </div>
                </td>
                <td>{getStatusBadge(devis.statut, devis.dateValidite)}</td>
                <td>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleViewDevis(devis)}
                      title="Voir les détails"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleEditDevis(devis)}
                      title="Modifier"
                    >
                      <Edit size={12} />
                    </button>
                    {devis.statut === "envoye" && (
                      <button
                        className="btn btn-xs btn-primary"
                        onClick={() => handleConvertToCommande(devis)}
                        title="Convertir en commande"
                      >
                        <CheckCircle size={12} />
                      </button>
                    )}
                    {devis.statut === "brouillon" && (
                      <button
                        className="btn btn-sec btn-sm"
                        onClick={() => handleSendDevis(devis)}
                        title="Envoyer le devis"
                      >
                        <Send size={12} />
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteDevis(devis.id)}
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

        {filteredDevis.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--tx3)",
            }}
          >
            <FileText
              size={48}
              style={{ margin: "0 auto", marginBottom: "16px", opacity: "0.3" }}
            />
            <div>Aucun devis trouvé</div>
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
          <FileText size={18} />
          Actions rapides
        </h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Créer un devis
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Send size={16} />
            Envoyer les devis en attente
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter en PDF
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <CheckCircle size={16} />
            Suivi des devis
          </button>
        </div>
      </div>
    </div>
  );
};

export default Devis;
