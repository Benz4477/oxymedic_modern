import React, { useState, useEffect } from "react";
import {
  Camera,
  Plus,
  Search,
  Edit,
  Trash2,
  Download,
  Eye,
  RefreshCw,
  Scan,
  QrCode,
  CheckCircle,
  Package,
  Settings,
} from "lucide-react";

const Scanner = () => {
  const [scanResults, setScanResults] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanType, setScanType] = useState("barcode");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    // Simulation de données de scan
    setScanResults([
      {
        id: 1,
        code: "MED-001-ABC",
        type: "barcode",
        equipement: "Stéthoscope électronique",
        categorie: "Diagnostic",
        statut: "disponible",
        emplacement: "Salle A-101",
        dateScan: "2024-03-20 14:30",
        utilisateur: "Dr. Benali",
      },
      {
        id: 2,
        code: "QR-2024-XYZ",
        type: "qrcode",
        equipement: "Tensiomètre automatique",
        categorie: "Monitoring",
        statut: "disponible",
        emplacement: "Salle B-205",
        dateScan: "2024-03-20 15:45",
        utilisateur: "Infirmière Alami",
      },
      {
        id: 3,
        code: "MED-003-DEF",
        type: "barcode",
        equipement: "Thermomètre infrarouge",
        categorie: "Diagnostic",
        statut: "indisponible",
        emplacement: "En maintenance",
        dateScan: "2024-03-19 11:20",
        utilisateur: "Technicien Mansouri",
      },
      {
        id: 4,
        code: "QR-2024-GHI",
        type: "qrcode",
        equipement: "Glucomètre",
        categorie: "Laboratoire",
        statut: "disponible",
        emplacement: "Labo-301",
        dateScan: "2024-03-20 16:15",
        utilisateur: "Dr. Karimi",
      },
    ]);
  }, []);

  const filteredResults = scanResults.filter((result) => {
    const matchesSearch =
      result.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.equipement.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.categorie.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || result.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleStartScan = () => {
    setIsScanning(true);
    // Simulation de scan
    setTimeout(() => {
      const newScan = {
        id: scanResults.length + 1,
        code:
          scanType === "barcode"
            ? `MED-${String(scanResults.length + 1).padStart(3, "0")}-NEW`
            : `QR-2024-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
        type: scanType,
        equipement: "Nouvel équipement scanné",
        categorie: "Non classifié",
        statut: "disponible",
        emplacement: "À déterminer",
        dateScan: new Date().toLocaleString("fr-FR"),
        utilisateur: "Utilisateur actuel",
      };
      setScanResults((prev) => [newScan, ...prev]);
      setIsScanning(false);
    }, 3000);
  };

  const handleStopScan = () => {
    setIsScanning(false);
  };

  const handleViewDetails = (result) => {
    // Logique pour afficher les détails du scan
    console.log("Détails du scan:", result);
  };

  const handleRescan = (result) => {
    // Logique pour rescanner un équipement
    console.log("Rescanner:", result);
  };

  const handleDeleteResult = (resultId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce résultat de scan ?")) {
      setScanResults((prev) => prev.filter((r) => r.id !== resultId));
    }
  };

  const totalScans = scanResults.length;
  const todayScans = scanResults.filter((r) =>
    r.dateScan.startsWith(new Date().toLocaleDateString()),
  ).length;
  const availableItems = scanResults.filter(
    (r) => r.statut === "disponible",
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Scanner Code-Barres
          </h1>
          <p className="text-gray-600 text-sm">
            {totalScans} scans • {todayScans} aujourd'hui • {availableItems}{" "}
            disponibles
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-6">
          <select
            value={scanType}
            onChange={(e) => setScanType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded bg-white"
          >
            <option value="barcode">Code-barres</option>
            <option value="qrcode">QR Code</option>
          </select>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            onClick={isScanning ? handleStopScan : handleStartScan}
          >
            {isScanning ? (
              <>
                <div className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Scan en cours...
              </>
            ) : (
              <>
                <Camera size={16} />
                Démarrer le scan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Camera size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {totalScans}
              </div>
              <div className="text-xs text-gray-600">Total scans</div>
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
                {todayScans}
              </div>
              <div className="text-xs text-gray-600">Scans aujourd'hui</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Package size={20} className="text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {availableItems}
              </div>
              <div className="text-xs text-gray-600">Disponibles</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <Barcode size={20} className="text-red-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {scanResults.filter((r) => r.type === "barcode").length}
              </div>
              <div className="text-xs text-gray-600">Code-barres</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex gap-3 items-center flex-wrap">
          <div className="flex-1 min-w-[200px] relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Rechercher par code, équipement, catégorie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">Tous les types</option>
            <option value="barcode">Code-barres</option>
            <option value="qrcode">QR Code</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Scanner Interface */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Camera size={18} />
          Interface de scan
        </h3>
        <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-lg">
          {isScanning ? (
            <div>
              <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <div className="text-base font-semibold text-gray-900 mb-2">
                Scan en cours...
              </div>
              <div className="text-sm text-gray-600">
                Veuillez scanner le{" "}
                {scanType === "barcode" ? "code-barres" : "QR code"}
              </div>
            </div>
          ) : (
            <div>
              <Camera size={64} className="mx-auto mb-4 opacity-30" />
              <div className="text-base font-semibold text-gray-900 mb-2">
                Prêt à scanner
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Positionnez le{" "}
                {scanType === "barcode" ? "code-barres" : "QR code"} dans la
                zone de scan
              </div>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                onClick={handleStartScan}
              >
                <Camera size={16} />
                Démarrer le scan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Scan Results Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Search size={18} />
          Résultats de scan
        </h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Équipement</th>
              <th>Catégorie</th>
              <th>Statut</th>
              <th>Emplacement</th>
              <th>Date/Heure</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((result) => (
              <tr key={result.id}>
                <td>
                  <div className="font-semibold text-blue-600 font-mono text-sm">
                    {result.code}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    {result.type === "barcode" ? (
                      <Barcode size={16} />
                    ) : (
                      <QrCode size={16} />
                    )}
                    <span className="text-sm text-gray-700">
                      {result.type === "barcode" ? "Code-barres" : "QR Code"}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">
                    {result.equipement}
                  </div>
                </td>
                <td>
                  <span className="bg-blue-100 px-2 py-0.5 rounded text-xs">
                    {result.categorie}
                  </span>
                </td>
                <td>
                  {result.statut === "disponible" ? (
                    <span className="badge badge-success">Disponible</span>
                  ) : (
                    <span className="badge badge-warning">Indisponible</span>
                  )}
                </td>
                <td>
                  <div className="text-sm text-gray-700">
                    {result.emplacement}
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">{result.dateScan}</div>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleViewDetails(result)}
                      title="Voir les détails"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleRescan(result)}
                      title="Scanner à nouveau"
                    >
                      <RefreshCw size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-danger"
                      onClick={() => handleDeleteResult(result.id)}
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

        {filteredResults.length === 0 && (
          <div className="text-center p-10 text-gray-600">
            <Camera size={48} className="mx-auto mb-4 opacity-30" />
            <div>Aucun résultat de scan trouvé</div>
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
            <Camera size={16} />
            Nouveau scan
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter les résultats
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <RefreshCw size={16} />
            Synchroniser les équipements
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Settings size={16} />
            Configurer le scanner
          </button>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
