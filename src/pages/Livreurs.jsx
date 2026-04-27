import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Car,
  Edit,
  Trash2,
  Eye,
  Download,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

const Livreurs = () => {
  const [livreurs, setLivreurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    // Simulation de données livreurs
    setLivreurs([
      {
        id: 1,
        nom: "Benali",
        prenom: "Ahmed",
        tel: "0612345678",
        email: "ahmed.benali@oxymedic.com",
        adresse: "45 Rue Anfa, Casablanca",
        permis: "B",
        dateEmbauche: "15/01/2024",
        statut: "actif",
        vehicule: {
          marque: "Dacia",
          modele: "Dokker",
          immatriculation: "12345-A-45",
          couleur: "Blanc",
        },
        fraisLivraison: {
          zone1: 50, // Casablanca centre
          zone2: 80, // Casablanca périphérie
          zone3: 120, // Autres villes
        },
        totalLivraisons: 45,
        totalFrais: 3600,
        disponibilite: "disponible",
        notes: "Livreur fiable et ponctuel",
      },
      {
        id: 2,
        nom: "Alaoui",
        prenom: "Fatima",
        tel: "0623456789",
        email: "fatima.alaoui@oxymedic.com",
        adresse: "12 Rue Moulay Youssef, Rabat",
        permis: "B",
        dateEmbauche: "20/02/2024",
        statut: "actif",
        vehicule: {
          marque: "Renault",
          modele: "Kangoo",
          immatriculation: "67890-B-12",
          couleur: "Gris",
        },
        fraisLivraison: {
          zone1: 60,
          zone2: 90,
          zone3: 130,
        },
        totalLivraisons: 38,
        totalFrais: 3420,
        disponibilite: "en_livraison",
        notes: "Excellente connaissance de la région",
      },
      {
        id: 3,
        nom: "Mansouri",
        prenom: "Karim",
        tel: "0634567890",
        email: "karim.mansouri@oxymedic.com",
        adresse: "8 Avenue Hassan II, Marrakech",
        permis: "B",
        dateEmbauche: "10/03/2024",
        statut: "conge",
        vehicule: {
          marque: "Peugeot",
          modele: "Partner",
          immatriculation: "98765-C-78",
          couleur: "Bleu",
        },
        fraisLivraison: {
          zone1: 55,
          zone2: 85,
          zone3: 125,
        },
        totalLivraisons: 32,
        totalFrais: 2800,
        disponibilite: "indisponible",
        notes: "En congé jusqu'au 15/06/2024",
      },
    ]);
  }, []);

  const filteredLivreurs = livreurs.filter((livreur) => {
    const matchesSearch =
      livreur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livreur.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livreur.tel.includes(searchTerm) ||
      livreur.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || livreur.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalActifs = livreurs.filter((l) => l.statut === "actif").length;
  const totalDisponibles = livreurs.filter(
    (l) => l.disponibilite === "disponible",
  ).length;

  const getStatusBadge = (statut) => {
    switch (statut) {
      case "actif":
        return <span className="badge badge-success">Actif</span>;
      case "en_livraison":
        return <span className="badge badge-warning">En livraison</span>;
      case "conge":
        return <span className="badge badge-sec">Congé</span>;
      case "inactif":
        return <span className="badge badge-danger">Inactif</span>;
      default:
        return <span className="badge">{statut}</span>;
    }
  };

  const getDisponibiliteBadge = (disponibilite) => {
    switch (disponibilite) {
      case "disponible":
        return <span className="badge badge-success">Disponible</span>;
      case "en_livraison":
        return <span className="badge badge-warning">En livraison</span>;
      case "indisponible":
        return <span className="badge badge-danger">Indisponible</span>;
      default:
        return <span className="badge">{disponibilite}</span>;
    }
  };

  const handleAddLivreur = () => {
    // Logique pour ajouter un livreur
  };

  const handleViewLivreur = (livreur) => {
    // Logique pour afficher les détails du livreur
  };

  const handleEditLivreur = (livreur) => {
    // Logique pour modifier le livreur
  };

  const handleDeleteLivreur = (livreurId) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce livreur ?")) {
      setLivreurs(livreurs.filter((l) => l.id !== livreurId));
    }
  };

  const handleCallLivreur = (tel) => {
    window.open(`tel:${tel}`, "_self");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Livreurs & Frais</h1>
          <p className="text-gray-600 text-sm">
            {livreurs.length} livreurs • {totalActifs} actifs •{" "}
            {totalDisponibles} disponibles
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          onClick={handleAddLivreur}
        >
          <Plus size={16} />
          Nouveau livreur
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {livreurs.length}
              </div>
              <div className="text-xs text-gray-600">Total livreurs</div>
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
                {totalActifs}
              </div>
              <div className="text-xs text-gray-600">Actifs</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Car size={20} className="text-amber-600" />
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
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <AlertTriangle size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">
                {livreurs.filter((l) => l.statut === "en_livraison").length}
              </div>
              <div className="text-xs text-gray-600">En livraison</div>
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
              placeholder="Rechercher par nom, téléphone, email..."
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
            <option value="actif">Actif</option>
            <option value="en_livraison">En livraison</option>
            <option value="conge">Congé</option>
            <option value="inactif">Inactif</option>
          </select>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Download size={16} />
            Exporter
          </button>
        </div>
      </div>

      {/* Livreurs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <table className="w-full">
          <thead>
            <tr>
              <th>Livreur</th>
              <th>Contact</th>
              <th>Véhicule</th>
              <th>Frais livraison</th>
              <th>Statut</th>
              <th>Disponibilité</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLivreurs.map((livreur) => (
              <tr key={livreur.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-base">
                      {livreur.prenom ? livreur.prenom.charAt(0) : ""}
                      {livreur.nom ? livreur.nom.charAt(0) : ""}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {livreur.prenom} {livreur.nom}
                      </div>
                      <div className="text-xs text-gray-500">
                        Permis: {livreur.permis}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-sm">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Phone size={12} className="text-gray-500" />
                      {livreur.tel}
                    </div>
                    <div className="flex items-center gap-1 mb-0.5">
                      <Mail size={12} className="text-gray-500" />
                      {livreur.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-gray-500" />
                      {livreur.adresse}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {livreur.vehicule
                        ? `${livreur.vehicule.marque || ""} ${livreur.vehicule.modele || ""}`.trim()
                        : "-"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {livreur.vehicule
                        ? `${livreur.vehicule.immatriculation || ""} • ${livreur.vehicule.couleur || ""}`.trim()
                        : "-"}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-sm text-gray-700">
                    <div>
                      Zone 1:{" "}
                      {livreur.fraisLivraison
                        ? livreur.fraisLivraison.zone1 || 0
                        : 0}{" "}
                      MAD
                    </div>
                    <div>
                      Zone 2:{" "}
                      {livreur.fraisLivraison
                        ? livreur.fraisLivraison.zone2 || 0
                        : 0}{" "}
                      MAD
                    </div>
                    <div>
                      Zone 3:{" "}
                      {livreur.fraisLivraison
                        ? livreur.fraisLivraison.zone3 || 0
                        : 0}{" "}
                      MAD
                    </div>
                  </div>
                </td>
                <td>{getStatusBadge(livreur.statut)}</td>
                <td>{getDisponibiliteBadge(livreur.disponibilite)}</td>
                <td>
                  <div className="flex gap-1">
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleViewLivreur(livreur)}
                      title="Voir les détails"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleEditLivreur(livreur)}
                      title="Modifier"
                    >
                      <Edit size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-sec"
                      onClick={() => handleCallLivreur(livreur.tel)}
                      title="Appeler"
                    >
                      <Phone size={12} />
                    </button>
                    <button
                      className="btn btn-xs btn-danger"
                      onClick={() => handleDeleteLivreur(livreur.id)}
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

        {filteredLivreurs.length === 0 && (
          <div className="text-center p-10 text-gray-600">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <div>Aucun livreur trouvé</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Livreurs;
