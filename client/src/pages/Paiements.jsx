import React, { useState, useEffect } from "react";
import {
  CreditCard,
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
  Receipt,
} from "lucide-react";

const Paiements = () => {
  const [paiements, setPaiements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  useEffect(() => {
    // Simulation de données paiements
    setPaiements([
      {
        id: 1,
        reference: "PAY-2024-001",
        client: "Mohammed Alaoui",
        clientId: 1,
        commandeRef: "CMD-2024-001",
        datePaiement: "15/03/2024",
        montant: 2000,
        methode: "virement",
        statut: "paye",
        type: "avance",
        notes: "Avance pour commande CMD-2024-001",
        recu: "REC-2024-001",
        banque: "Attijariwafa",
        referenceBancaire: "TRF20240315001",
      },
      {
        id: 2,
        reference: "PAY-2024-002",
        client: "Fatima Zahra Benali",
        clientId: 2,
        commandeRef: "CMD-2024-002",
        datePaiement: "20/03/2024",
        montant: 1600,
        methode: "espece",
        statut: "paye",
        type: "solde",
        notes: "Paiement complet de la commande",
        recu: "REC-2024-002",
        banque: null,
        referenceBancaire: null,
      },
      {
        id: 3,
        reference: "PAY-2024-003",
        client: "Youssef Amrani",
        clientId: 3,
        commandeRef: "CMD-2024-003",
        datePaiement: null,
        montant: 500,
        methode: "espece",
        statut: "en_attente",
        type: "avance",
        notes: "Avance en attente de validation",
        recu: null,
        banque: null,
        referenceBancaire: null,
      },
      {
        id: 4,
        reference: "PAY-2024-004",
        client: "Mohammed Alaoui",
        clientId: 1,
        commandeRef: "CMD-2024-001",
        datePaiement: "25/03/2024",
        montant: 4000,
        methode: "cheque",
        statut: "en_attente",
        type: "solde",
        notes: "Chèque pour solde de commande",
        recu: "REC-2024-003",
        banque: "BMCE",
        referenceBancaire: "CHQ20240325001",
      },
    ]);
  }, []);

  const filteredPaiements = paiements.map((paiement) => {
    const matchesSearch =
      paiement.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paiement.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paiement.commandeRef?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || paiement.statut === statusFilter;
    const matchesMethod = !methodFilter || paiement.methode === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "paye":
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} /> Payé
          </span>
        );
      case "en_attente":
        return (
          <span className="badge badge-warning">
            <Clock size={12} /> En attente
          </span>
        );
      case "annule":
        return <span className="badge badge-danger">Annulé</span>;
      case "rembourse":
        return <span className="badge badge-info">Remboursé</span>;
      default:
        return <span className="badge badge-secondary">{statut}</span>;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "avance":
        return <span className="badge badge-info">Avance</span>;
      case "solde":
        return <span className="badge badge-success">Solde</span>;
      case "caution":
        return <span className="badge badge-warning">Caution</span>;
      case "remboursement":
        return <span className="badge badge-danger">Remboursement</span>;
      default:
        return <span className="badge badge-secondary">{type}</span>;
    }
  };

  const getMethodBadge = (methode) => {
    switch (methode) {
      case "espece":
        return <span className="badge badge-success">Espèce</span>;
      case "virement":
        return <span className="badge badge-primary">Virement</span>;
      case "cheque":
        return <span className="badge badge-info">Chèque</span>;
      case "carte":
        return <span className="badge badge-warning">Carte</span>;
      case "mobile":
        return <span className="badge badge-secondary">Mobile</span>;
      default:
        return <span className="badge badge-secondary">{methode}</span>;
    }
  };

  const handleAddPaiement = () => {
    // Logique pour ajouter un paiement
  };

  const handleViewPaiement = (paiement) => {
    // Logique pour voir les détails
  };

  const handleEditPaiement = (paiement) => {
    // Logique pour modifier
  };

  const handleDeletePaiement = (paiementId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce paiement ?")) {
      setPaiements(paiements.filter((p) => p.id !== paiementId));
    }
  };

  const handleValidatePaiement = (paiementId) => {
    // Logique pour valider un paiement en attente
    setPaiements(
      paiements.map((p) =>
        p.id === paiementId
          ? {
              ...p,
              statut: "paye",
              datePaiement: new Date().toLocaleDateString(),
            }
          : p,
      ),
    );
  };

  const handleGenerateRecu = (paiement) => {
    // Logique pour générer un reçu
    console.log("Générer reçu pour:", paiement.reference);
  };

  const totalPaye = paiements
    .filter((p) => p.statut === "paye")
    .reduce((sum, p) => sum + p.montant, 0);
  const totalEnAttente = paiements
    .filter((p) => p.statut === "en_attente")
    .reduce((sum, p) => sum + p.montant, 0);

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
            Gestion des Paiements
          </h1>
          <p style={{ color: "var(--tx3)", fontSize: "14px" }}>
            {paiements.length} paiements au total •{" "}
            {paiements.filter((p) => p.statut === "en_attente").length} en
            attente
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleAddPaiement}
        >
          <Plus size={16} />
          Nouveau paiement
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
              <CreditCard size={20} style={{ color: "var(--b600)" }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "var(--tx1)",
                }}
              >
                {paiements.length}
              </div>
              <div style={{ fontSize: "12px", color: "var(--tx3)" }}>
                Total paiements
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
                {totalPaye ? totalPaye.toLocaleString() : "0"} MAD
              </div>
              <div style={{ fontSize: "12px", color: "var(--tx3)" }}>
                Total payé
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
              <Clock size={20} style={{ color: "var(--a600)" }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "var(--tx1)",
                }}
              >
                {totalEnAttente ? totalEnAttente.toLocaleString() : "0"} MAD
              </div>
              <div style={{ fontSize: "12px", color: "var(--tx3)" }}>
                En attente
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
                {paiements.filter((p) => p.statut === "en_attente").length}
              </div>
              <div style={{ fontSize: "12px", color: "var(--tx3)" }}>
                En attente
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
            <option value="paye">Payé</option>
            <option value="en_attente">En attente</option>
            <option value="annule">Annulé</option>
            <option value="rembourse">Remboursé</option>
          </select>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            style={{ minWidth: "150px" }}
          >
            <option value="">Toutes les méthodes</option>
            <option value="espece">Espèce</option>
            <option value="virement">Virement</option>
            <option value="cheque">Chèque</option>
            <option value="carte">Carte</option>
            <option value="mobile">Mobile</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Paiements Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Commande</th>
              <th>Date paiement</th>
              <th>Montant</th>
              <th>Méthode</th>
              <th>Type</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPaiements.map((paiement) => (
              <tr key={paiement.id}>
                <td>
                  <div
                    style={{
                      fontWeight: "600",
                      color: "var(--b600)",
                      fontFamily: "var(--mono)",
                    }}
                  >
                    {paiement.reference}
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
                      {paiement.client
                        ? paiement.client
                            .split(" ")
                            .map((n, index) => n[0])
                            .join("")
                        : "?"}
                    </div>
                    <span style={{ fontSize: "13px" }}>{paiement.client}</span>
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
                    {paiement.commandeRef || "-"}
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: "13px", color: "var(--tx2)" }}>
                    {paiement.datePaiement || "-"}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: "600", color: "var(--tx1)" }}>
                    {paiement.montant ? paiement.montant.toLocaleString() : "0"}{" "}
                    MAD
                  </div>
                </td>
                <td>{getMethodBadge(paiement.methode)}</td>
                <td>{getTypeBadge(paiement.type)}</td>
                <td>{getStatusBadge(paiement.statut)}</td>
                <td>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      className="btn btn-sec btn-sm"
                      onClick={() => handleViewPaiement(paiement)}
                      title="Voir les détails"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      className="btn btn-sec btn-sm"
                      onClick={() => handleEditPaiement(paiement)}
                      title="Modifier"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      className="btn btn-sec btn-sm"
                      onClick={() => handleGenerateRecu(paiement)}
                      title="Générer un reçu"
                    >
                      <Receipt size={12} />
                    </button>
                    {paiement.statut === "en_attente" && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleValidatePaiement(paiement.id)}
                        title="Valider le paiement"
                      >
                        <CheckCircle size={12} />
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeletePaiement(paiement.id)}
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

        {filteredPaiements.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--tx3)",
            }}
          >
            <CreditCard
              size={48}
              style={{ margin: "0 auto", marginBottom: "16px", opacity: "0.3" }}
            />
            <div>Aucun paiement trouvé</div>
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
          <CreditCard size={18} />
          Actions rapides
        </h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Enregistrer un paiement
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Receipt size={16} />
            Générer reçus en masse
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter les paiements
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <CheckCircle size={16} />
            Valider paiements en attente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Paiements;
