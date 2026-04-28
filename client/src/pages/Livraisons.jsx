import React, { useState, useEffect } from "react";
import {
  Truck,
  Plus,
  Search,
  MapPin,
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  Navigation,
  Phone,
} from "lucide-react";

const Livraisons = () => {
  const [livraisons, setLivraisons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [livreurFilter, setLivreurFilter] = useState("");

  useEffect(() => {
    // Simulation de données livraisons
    setLivraisons([
      {
        id: 1,
        reference: "LIV-2024-001",
        commandeRef: "CMD-2024-001",
        client: "Mohammed Alaoui",
        clientId: 1,
        livreur: "Ahmed Benali",
        livreurId: 1,
        dateLivraison: "15/03/2024",
        heureLivraison: "10:00",
        statut: "en_cours",
        adresse: "123 Rue Hassan II, Casablanca",
        coordonnees: {
          lat: 33.5731,
          lng: -7.5898,
        },
        equipements: [
          { nom: "Fauteuil roulant électrique", quantite: 1 },
          { nom: "Lit médicalisé électrique", quantite: 1 },
        ],
        notes: "Client demande livraison avant 11h",
        instructionsSpeciales: "Appeler 30min avant arrivée",
        wazeLink: "https://waze.com/ul/hd123456",
        telLivreur: "0612345678",
        dateRetrait: null,
        statutRetrait: "attente",
      },
      {
        id: 2,
        reference: "LIV-2024-002",
        commandeRef: "CMD-2024-002",
        client: "Fatima Zahra Benali",
        clientId: 2,
        livreur: "Karim Amrani",
        livreurId: 2,
        dateLivraison: "20/03/2024",
        heureLivraison: "14:00",
        statut: "livre",
        adresse: "456 Avenue Mohammed V, Casablanca",
        coordonnees: {
          lat: 33.5931,
          lng: -7.6198,
        },
        equipements: [{ nom: "Déambulateur", quantite: 2 }],
        notes: "Livraison au 2ème étage",
        instructionsSpeciales: "",
        wazeLink: "https://waze.com/ul/hd654321",
        telLivreur: "0623456789",
        dateRetrait: "22/04/2024",
        statutRetrait: "programme",
      },
      {
        id: 3,
        reference: "LIV-2024-003",
        commandeRef: "CMD-2024-003",
        client: "Youssef Amrani",
        clientId: 3,
        livreur: "Ahmed Benali",
        livreurId: 1,
        dateLivraison: "25/03/2024",
        heureLivraison: "16:00",
        statut: "attente",
        adresse: "789 Boulevard Zerktouni, Casablanca",
        coordonnees: {
          lat: 33.5531,
          lng: -7.5698,
        },
        equipements: [{ nom: "Oxygène portable", quantite: 1 }],
        notes: "",
        instructionsSpeciales: "Livraison à la réception",
        wazeLink: "https://waze.com/ul/hd987654",
        telLivreur: "0612345678",
        dateRetrait: null,
        statutRetrait: "attente",
      },
    ]);
  }, []);

  const filteredLivraisons = livraisons.map((livraison) => {
    const matchesSearch =
      livraison.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livraison.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livraison.commandeRef?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || livraison.statut === statusFilter;
    const matchesLivreur =
      !livreurFilter || livraison.livreur === livreurFilter;
    return matchesSearch && matchesStatus && matchesLivreur;
  });

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "attente":
        return (
          <span className="badge badge-secondary">
            <Clock size={12} /> Attente
          </span>
        );
      case "en_preparation":
        return <span className="badge badge-warning">En préparation</span>;
      case "en_cours":
        return (
          <span className="badge badge-info">
            <Truck size={12} /> En cours
          </span>
        );
      case "livre":
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} /> Livré
          </span>
        );
      case "retour_en_cours":
        return <span className="badge badge-warning">Retour en cours</span>;
      case "retourne":
        return <span className="badge badge-success">Retourné</span>;
      case "annule":
        return <span className="badge badge-danger">Annulé</span>;
      default:
        return <span className="badge badge-secondary">{statut}</span>;
    }
  };

  const handleAddLivraison = () => {
    // Logique pour ajouter une livraison
  };

  const handleViewLivraison = (livraison) => {
    // Logique pour voir les détails
  };

  const handleEditLivraison = (livraison) => {
    // Logique pour modifier
  };

  const handleDeleteLivraison = (livraisonId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette livraison ?")) {
      setLivraisons(livraisons.filter((l) => l.id !== livraisonId));
    }
  };

  const handleOpenWaze = (wazeLink) => {
    window.open(wazeLink, "_blank");
  };

  const handleCallLivreur = (tel) => {
    window.open(`tel:${tel}`, "_self");
  };

  const handleUpdateStatus = (livraisonId, newStatus) => {
    setLivraisons(
      livraisons.map((l) =>
        l.id === livraisonId ? { ...l, statut: newStatus } : l,
      ),
    );
  };

  const livreurs = [...new Set(livraisons.map((l) => l.livreur))];

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
            Livraisons & Navigation Waze
          </h1>
          <p style={{ color: "var(--tx3)", fontSize: "14px" }}>
            {livraisons.length} livraisons •{" "}
            {livraisons.filter((l) => l.statut === "en_cours").length} en cours
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleAddLivraison}
        >
          <Plus size={16} />
          Nouvelle livraison
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
              <Truck size={20} style={{ color: "var(--b600)" }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "var(--tx1)",
                }}
              >
                {livraisons.length}
              </div>
              <div style={{ fontSize: "12px", color: "var(--tx3)" }}>
                Total livraisons
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
              <Truck size={20} style={{ color: "var(--a600)" }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "var(--tx1)",
                }}
              >
                {livraisons.filter((l) => l.statut === "en_cours").length}
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
                {livraisons.filter((l) => l.statut === "livre").length}
              </div>
              <div style={{ fontSize: "12px", color: "var(--tx3)" }}>
                Livrées
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
                {livraisons.filter((l) => l.statut === "attente").length}
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
            value={livreurFilter}
            onChange={(e) => setLivreurFilter(e.target.value)}
            style={{ minWidth: "150px" }}
          >
            <option value="">Tous les livreurs</option>
            {livreurs.map((livreur) => (
              <option key={livreur} value={livreur}>
                {livreur}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ minWidth: "150px" }}
          >
            <option value="">Tous les statuts</option>
            <option value="attente">Attente</option>
            <option value="en_preparation">En préparation</option>
            <option value="en_cours">En cours</option>
            <option value="livre">Livré</option>
            <option value="retour_en_cours">Retour en cours</option>
            <option value="retourne">Retourné</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Livraisons Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Livreur</th>
              <th>Date/Heure</th>
              <th>Adresse</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLivraisons.map((livraison) => (
              <tr key={livraison.id}>
                <td>
                  <div
                    style={{
                      fontWeight: "600",
                      color: "var(--b600)",
                      fontFamily: "var(--mono)",
                    }}
                  >
                    {livraison.reference}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--tx4)" }}>
                    {livraison.commandeRef}
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
                      {livraison.client
                        ? livraison.client
                            .split(" ")
                            .map((n, index) => n[0])
                            .join("")
                        : "?"}
                    </div>
                    <span style={{ fontSize: "13px" }}>{livraison.client}</span>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: "13px" }}>
                    <div style={{ fontWeight: "500", color: "var(--tx1)" }}>
                      {livraison.livreur}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        color: "var(--tx3)",
                      }}
                    >
                      <Phone size={12} />
                      {livraison.telLivreur}
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: "13px", color: "var(--tx2)" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        marginBottom: "2px",
                      }}
                    >
                      <Calendar size={12} />
                      {livraison.dateLivraison}
                    </div>
                    <div>{livraison.heureLivraison}</div>
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--tx2)",
                      maxWidth: "200px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        marginBottom: "2px",
                      }}
                    >
                      <MapPin size={12} />
                      {livraison.adresse}
                    </div>
                  </div>
                </td>
                <td>{getStatusBadge(livraison.statut)}</td>
                <td>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      className="btn btn-sec btn-sm"
                      onClick={() => handleViewLivraison(livraison)}
                      title="Voir les détails"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      className="btn btn-sec btn-sm"
                      onClick={() => handleOpenWaze(livraison.wazeLink)}
                      title="Ouvrir Waze"
                    >
                      <Navigation size={12} />
                    </button>
                    <button
                      className="btn btn-sec btn-sm"
                      onClick={() => handleCallLivreur(livraison.telLivreur)}
                      title="Appeler le livreur"
                    >
                      <Phone size={12} />
                    </button>
                    {livraison.statut === "attente" && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          handleUpdateStatus(livraison.id, "en_preparation")
                        }
                        title="Démarrer la préparation"
                      >
                        <Truck size={12} />
                      </button>
                    )}
                    {livraison.statut === "en_preparation" && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          handleUpdateStatus(livraison.id, "en_cours")
                        }
                        title="Démarrer la livraison"
                      >
                        <Truck size={12} />
                      </button>
                    )}
                    {livraison.statut === "en_cours" && (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() =>
                          handleUpdateStatus(livraison.id, "livre")
                        }
                        title="Marquer comme livré"
                      >
                        <CheckCircle size={12} />
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteLivraison(livraison.id)}
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

        {filteredLivraisons.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--tx3)",
            }}
          >
            <Truck
              size={48}
              style={{ margin: "0 auto", marginBottom: "16px", opacity: "0.3" }}
            />
            <div>Aucune livraison trouvée</div>
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
          <Truck size={18} />
          Actions rapides
        </h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Planifier une livraison
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Navigation size={16} />
            Optimiser les tournées
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Phone size={16} />
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter les livraisons
          </button>
        </div>
      </div>
    </div>
  );
};

export default Livraisons;
