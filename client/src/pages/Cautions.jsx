import React, { useState, useEffect } from "react";
import {
  Lock,
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
  CreditCard,
} from "lucide-react";

const Cautions = () => {
  const [cautions, setCaution] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    // Simulation de données cautions
    setCaution([
      {
        id: 1,
        reference: "CAU-2024-001",
        client: "Mohammed Alaoui",
        clientId: 1,
        commandeRef: "CMD-2024-001",
        dateDepot: "15/03/2024",
        montant: 1000,
        methode: "espece",
        statut: "en_cours",
        notes: "Dépôt de garantie pour fauteuil roulant",
        recu: "REC-CAU-001",
        dateRetour: null,
        montantRetour: 0,
      },
      {
        id: 2,
        reference: "CAU-2024-002",
        client: "Fatima Zahra Benali",
        clientId: 2,
        commandeRef: "CMD-2024-002",
        dateDepot: "20/03/2024",
        montant: 500,
        methode: "virement",
        statut: "retourne",
        notes: "Dépôt pour déambulateur",
        recu: "REC-CAU-002",
        dateRetour: "22/04/2024",
        montantRetour: 500,
      },
    ]);
  }, []);

  const filteredCautions = cautions.map((caution) => {
    const matchesSearch =
      caution.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caution.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caution.commandeRef?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || caution.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "en_attente":
        return (
          <span className="badge badge-warning">
            <Clock size={12} /> En attente
          </span>
        );
      case "en_cours":
        return (
          <span className="badge badge-info">
            <Lock size={12} /> En cours...
          </span>
        );
      case "retourne":
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} /> Retourné
          </span>
        );
      case "deduite":
        return (
          <span className="badge badge-danger">
            <AlertTriangle size={12} /> Déduite
          </span>
        );
      default:
        return <span className="badge badge-secondary">{statut}</span>;
    }
  };

  const handleAddCaution = () => {
    // Logique pour ajouter une caution
  };

  const handleViewCaution = (caution) => {
    // Logique pour voir les détails
  };

  const handleEditCaution = (caution) => {
    // Logique pour modifier
  };

  const handleDeleteCaution = (cautionId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette caution ?")) {
      setCaution(cautions.filter((c) => c.id !== cautionId));
    }
  };

  const handleReturnCaution = (cautionId) => {
    // Logique pour retourner la caution
    setCaution(
      cautions.map((c) =>
        c.id === cautionId
          ? {
              ...c,
              statut: "retourne",
              dateRetour: new Date().toLocaleDateString(),
              montantRetour: c.montant,
            }
          : c,
      ),
    );
  };

  const totalEnCours = cautions
    .filter((c) => c.statut === "en_cours")
    .reduce((sum, c) => sum + c.montant, 0);
  const totalRetourne = cautions
    .filter((c) => c.statut === "retourne")
    .reduce((sum, c) => sum + c.montantRetour, 0);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "var(--tx1)",
              marginBottom: "8px",
            }}
          >
            Gestion des Cautions
          </h1>
          <p style={{ color: "var(--tx3)", fontSize: "14px" }}>
            {cautions.length} cautions au total •{" "}
            {cautions.filter((c) => c.statut === "en_cours").length} en cours
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleAddCaution}
        >
          <Plus size={16} />
          Nouvelle caution
        </button>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "var(--b50)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lock size={20} style={{ color: "var(--b600)" }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "var(--tx1)",
                }}
              >
                {cautions.length}
              </div>
              <div style={{ fontSize: "12px", color: "var(--tx3)" }}>
                Total cautions
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "var(--a50)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Lock size={20} style={{ color: "var(--a600)" }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "var(--tx1)",
                }}
              >
                {totalEnCours ? totalEnCours.toLocaleString() : "0"} MAD
              </div>
              <div style={{ fontSize: "12px", color: "var(--tx3)" }}>
                En cours
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "var(--g50)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircle size={20} style={{ color: "var(--g600)" }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "var(--tx1)",
                }}
              >
                {totalRetourne ? totalRetourne.toLocaleString() : "0"} MAD
              </div>
              <div style={{ fontSize: "12px", color: "var(--tx3)" }}>
                Retournées
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "var(--r50)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertTriangle size={20} style={{ color: "var(--r600)" }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "var(--tx1)",
                }}
              >
                {cautions.filter((c) => c.statut === "deduite").length}
              </div>
              <div style={{ fontSize: "12px", color: "var(--tx3)" }}>
                Déduites
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        style={{ marginBottom: "24px" }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--tx3)",
              }}
            />
            <input
              type="text"
              placeholder="Rechercher par référence, client, commande..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "40px", width: "100%" }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ minWidth: "150px" }}
          >
            <option value="">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="en_cours">En cours</option>
            <option value="retourne">Retourné</option>
            <option value="deduite">Déduite</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Cautions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Commande</th>
              <th>Date dépôt</th>
              <th>Montant</th>
              <th>Méthode</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCautions.map((caution) => (
              <tr key={caution.id}>
                <td>
                  <div
                    style={{
                      fontWeight: "600",
                      color: "var(--b600)",
                      fontFamily: "var(--mono)",
                    }}
                  >
                    {caution.reference}
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        background: "var(--b100)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--b600)",
                        fontSize: "10px",
                        fontWeight: "600",
                      }}
                    >
                      {caution.client
                        ? caution.client
                            .split(" ")
                            .map((n, index) => n[0])
                            .join("")
                        : "?"}
                    </div>
                    <span style={{ fontSize: "13px" }}>{caution.client}</span>
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--tx2)",
                      fontFamily: "var(--mono)",
                    }}
                  >
                    {caution.commandeRef || "-"}
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: "13px", color: "var(--tx2)" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Calendar size={12} />
                      {caution.dateDepot}
                    </div>
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "var(--tx1)",
                    }}
                  >
                    {caution.montant ? caution.montant.toLocaleString() : "0"}{" "}
                    MAD
                  </div>
                </td>
                <td>
                  <span className="badge badge-info">{caution.methode}</span>
                </td>
                <td>{getStatusBadge(caution.statut)}</td>
                <td>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      className="btn btn-sec btn-sm"
                      onClick={() => handleViewCaution(caution)}
                      title="Voir les détails"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      className="btn btn-sec btn-sm"
                      onClick={() => handleEditCaution(caution)}
                      title="Modifier"
                    >
                      <Edit size={12} />
                    </button>
                    {caution.statut === "en_cours" && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleReturnCaution(caution.id)}
                        title="Retourner la caution"
                      >
                        <CheckCircle size={12} />
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteCaution(caution.id)}
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

        {filteredCautions.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--tx3)",
            }}
          >
            <Lock
              size={48}
              style={{ margin: "0 auto", marginBottom: "16px", opacity: "0.3" }}
            />
            <div>Aucune caution trouvée</div>
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
          <Lock size={18} />
          Actions rapides
        </h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Enregistrer une caution
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <CheckCircle size={16} />
            Traiter les retours
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter les cautions
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <CreditCard size={16} />
            Rapport financier
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cautions;
