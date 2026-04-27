import React, { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Search,
  Camera,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  QrCode,
} from "lucide-react";

const Serials = () => {
  const [serials, setSerials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [equipementFilter, setEquipementFilter] = useState("");

  useEffect(() => {
    // Simulation de données numéros de série
    setSerials([
      {
        id: 1,
        numeroSerie: "FR2024001",
        codeBarre: "1234567890123",
        equipement: "Fauteuil roulant électrique",
        equipementId: 1,
        marque: "Invacare",
        modele: "F5",
        statut: "disponible",
        dateAchat: "15/01/2024",
        dateDerniereMaintenance: "01/03/2024",
        clientActuel: null,
        commandeActuelle: null,
        notes: "Équipement en excellent état",
        qrCode: null,
      },
      {
        id: 2,
        numeroSerie: "LM2024002",
        codeBarre: "2345678901234",
        equipement: "Lit médicalisé électrique",
        equipementId: 2,
        marque: "Hill-Rom",
        modele: "Centra II",
        statut: "loue",
        dateAchat: "20/01/2024",
        dateDerniereMaintenance: "10/03/2024",
        clientActuel: "Mohammed Alaoui",
        commandeActuelle: "CMD-2024-001",
        notes: "En location depuis le 15/03/2024",
        qrCode: null,
      },
      {
        id: 3,
        numeroSerie: "OX2024003",
        codeBarre: "3456789012345",
        equipement: "Oxygène portable",
        equipementId: 3,
        marque: "AirSep",
        modele: "FreeStyle",
        statut: "maintenance",
        dateAchat: "10/02/2024",
        dateDerniereMaintenance: "25/03/2024",
        clientActuel: null,
        commandeActuelle: null,
        notes: "Maintenance préventive en cours",
        qrCode: null,
      },
    ]);
  }, []);

  const filteredSerials = serials.map((serial) => {
    const matchesSearch =
      serial.numeroSerie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serial.codeBarre.includes(searchTerm) ||
      serial.equipement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serial.marque.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || serial.statut === statusFilter;
    const matchesEquipement =
      !equipementFilter || serial.equipement === equipementFilter;
    return matchesSearch && matchesStatus && matchesEquipement;
  });

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "disponible":
        return (
          <span className="badge badge-success">
            <CheckCircle size={12} /> Disponible
          </span>
        );
      case "loue":
        return <span className="badge badge-info">Loué</span>;
      case "maintenance":
        return (
          <span className="badge badge-warning">
            <AlertTriangle size={12} /> Maintenance
          </span>
        );
      case "hors_service":
        return (
          <span className="badge badge-danger">
            <XCircle size={12} /> Hors service
          </span>
        );
      case "perdu":
        return <span className="badge badge-danger">Perdu</span>;
      default:
        return <span className="badge badge-secondary">{statut}</span>;
    }
  };

  const handleAddSerial = () => {
    // Logique pour ajouter un numéro de série
  };

  const handleViewSerial = (serial) => {
    // Logique pour voir les détails
  };

  const handleEditSerial = (serial) => {
    // Logique pour modifier
  };

  const handleDeleteSerial = (serialId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce numéro de série ?")) {
      setSerials(serials.filter((s) => s.id !== serialId));
    }
  };

  const handleScanCodeBarre = () => {
    // Logique pour scanner un code-barres
  };

  const handleGenerateQRCode = (serialId) => {
    // Logique pour générer un QR code
    setSerials(
      serials.map((s) =>
        s.id === serialId ? { ...s, qrCode: `QR_${s.numeroSerie}` } : s,
      ),
    );
  };

  const equipements = [...new Set(serials.map((s) => s.equipement))];

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
            N° Série & Codes-barres
          </h1>
          <p style={{ color: "var(--tx3)", fontSize: "14px" }}>
            {serials.length} numéros de série •{" "}
            {serials.filter((s) => s.statut === "disponible").length}{" "}
            disponibles
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            onClick={handleAddSerial}
          >
            <Plus size={16} />
            Ajouter un numéro
          </button>
          <button
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            onClick={handleScanCodeBarre}
          >
            <Camera size={16} />
            Scanner
          </button>
        </div>
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
              <Tag size={20} style={{ color: "var(--b600)" }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "var(--tx1)",
                }}
              >
                {serials.length}
              </div>
              <div style={{ fontSize: "12px", color: "var(--tx3)" }}>
                Total numéros
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
                {serials.filter((s) => s.statut === "disponible").length}
              </div>
              <div style={{ fontSize: "12px", color: "var(--tx3)" }}>
                Disponibles
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
              <AlertTriangle size={20} style={{ color: "var(--a600)" }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "var(--tx1)",
                }}
              >
                {serials.filter((s) => s.statut === "maintenance").length}
              </div>
              <div style={{ fontSize: "12px", color: "var(--tx3)" }}>
                En maintenance
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
              <XCircle size={20} style={{ color: "var(--r600)" }} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "var(--tx1)",
                }}
              >
                {serials.filter((s) => s.statut === "hors_service").length}
              </div>
              <div style={{ fontSize: "12px", color: "var(--tx3)" }}>
                Hors service
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
              placeholder="Rechercher par numéro série, code-barres, équipement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "40px", width: "100%" }}
            />
          </div>
          <select
            value={equipementFilter}
            onChange={(e) => setEquipementFilter(e.target.value)}
            style={{ minWidth: "150px" }}
          >
            <option value="">Tous les équipements</option>
            {equipements.map((eq) => (
              <option key={eq} value={eq}>
                {eq}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ minWidth: "150px" }}
          >
            <option value="">Tous les statuts</option>
            <option value="disponible">Disponible</option>
            <option value="loue">Loué</option>
            <option value="maintenance">Maintenance</option>
            <option value="hors_service">Hors service</option>
            <option value="perdu">Perdu</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Filter size={16} />
            Filtrer
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Serials Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>N° Série</th>
              <th>Code-barres</th>
              <th>Équipement</th>
              <th>Marque/Modèle</th>
              <th>Statut</th>
              <th>Client actuel</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSerials.map((serial) => (
              <tr key={serial.id}>
                <td>
                  <div
                    style={{
                      fontWeight: "600",
                      color: "var(--b600)",
                      fontFamily: "var(--mono)",
                    }}
                  >
                    {serial.numeroSerie}
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
                        fontFamily: "var(--mono)",
                        fontSize: "12px",
                        color: "var(--tx2)",
                      }}
                    >
                      {serial.codeBarre}
                    </div>
                    {serial.qrCode ? (
                      <QrCode size={16} style={{ color: "var(--g600)" }} />
                    ) : (
                      <button
                        className="btn btn-sec btn-sm"
                        onClick={() => handleGenerateQRCode(serial.id)}
                        title="Générer QR code"
                      >
                        <QrCode size={12} />
                      </button>
                    )}
                  </div>
                </td>
                <td>
                  <div>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "var(--tx1)",
                        fontSize: "13px",
                      }}
                    >
                      {serial.equipement}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--tx4)" }}>
                      Acheté: {serial.dateAchat}
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: "12px", color: "var(--tx2)" }}>
                    <div>{serial.marque}</div>
                    <div>{serial.modele}</div>
                  </div>
                </td>
                <td>{getStatusBadge(serial.statut)}</td>
                <td>
                  <div style={{ fontSize: "13px", color: "var(--tx2)" }}>
                    {serial.clientActuel || "-"}
                    {serial.commandeActuelle && (
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--tx4)",
                          fontFamily: "var(--mono)",
                        }}
                      >
                        {serial.commandeActuelle}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      className="btn btn-sec btn-sm"
                      onClick={() => handleViewSerial(serial)}
                      title="Voir les détails"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      className="btn btn-sec btn-sm"
                      onClick={() => handleEditSerial(serial)}
                      title="Modifier"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteSerial(serial.id)}
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

        {filteredSerials.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "var(--tx3)",
            }}
          >
            <Tag
              size={48}
              style={{ margin: "0 auto", marginBottom: "16px", opacity: "0.3" }}
            />
            <div>Aucun numéro de série trouvé</div>
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
          <Tag size={18} />
          Actions rapides
        </h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Ajouter des numéros
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Camera size={16} />
            Scanner codes-barres
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <QrCode size={16} />
            Générer QR codes
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter en CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default Serials;
