// src/pages/Clients/Clients.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Search,
  Filter,
  Download,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  X,
  Star,
} from "lucide-react";
import clientService from "./services/clientService";
import ClientProfile from "./ClientProfile";
import commandeService from "../../services/commandeService";
import equipementService from "../../services/equipementService";
import { toast } from "react-toastify";

/* ── Avatar initiales ────────────────────────────────────────────── */
const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-800",
  "bg-blue-100 text-blue-800",
  "bg-violet-100 text-violet-800",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-800",
];

const Avatar = ({ prenom = "", nom = "" }) => {
  const initials = ((prenom[0] || "") + (nom[0] || "")).toUpperCase();
  const colorClass =
    AVATAR_COLORS[(initials.charCodeAt(0) || 0) % AVATAR_COLORS.length];
  return (
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ring-2 ring-white ${colorClass}`}
    >
      {initials || "?"}
    </div>
  );
};

/* ── Composant principal ─────────────────────────────────────────── */
const Clients = () => {
  const [clients, setClients] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [clientsAvecCommandes, setClientsAvecCommandes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Protection contre les boucles infinies
  const retryCountRef = useRef(0);
  const maxGlobalRetries = 3;
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [editCoords, setEditCoords] = useState({ lat: null, lng: null });
  const [editCoordInput, setEditCoordInput] = useState("");
  const [filters, setFilters] = useState({
    quartier: "",
    hasDocuments: "",
    dateRange: "",
  });
  const [newClient, setNewClient] = useState({
    prenom: "",
    nom: "",
    tel: "",
    email: "",
    dateNaiss: "",
    quartier: "Maarif",
    adresse: "",
    cinNum: "",
    cinExp: "",
    note: "",
    lat: null,
    lng: null,
  });
  const [newCoords, setNewCoords] = useState({ lat: null, lng: null });
  const [coordInput, setCoordInput] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading && !isDataLoaded) {
      setIsLoading(true);
      loadAllData().finally(() => {
        setIsDataLoaded(true);
      });
    }
  }, []);

  const loadAllData = async (retryCount = 0) => {
    const MAX_RETRIES = 3;

    // Protection globale contre les boucles infinies
    if (retryCountRef.current >= maxGlobalRetries) {
      console.error(
        "🛑 Nombre maximum de retries global atteint - arrêt forcé",
      );
      // Charger les données mock en fallback
      loadMockData();
      toast.warning("Mode démo: Données mock chargées (Backend indisponible)");
      setIsLoading(false);
      return;
    }

    try {
      // Charger les données séquentiellement avec des délais pour éviter le rate limiting
      await loadClients();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await loadCommandes();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await loadEquipements();

      // Réinitialiser le compteur de retries en cas de succès
      retryCountRef.current = 0;
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);

      // Détecter plus précisément les erreurs 429
      const is429Error =
        error.message?.includes("429") ||
        error.message?.includes("Trop de requêtes") ||
        error.message?.includes("Too Many Requests") ||
        error.response?.status === 429 ||
        (error.name === "AxiosError" && error.response?.status === 429);

      retryCountRef.current++;

      if (
        is429Error &&
        retryCount < MAX_RETRIES &&
        retryCountRef.current <= maxGlobalRetries
      ) {
        const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 8000);
        console.log(
          `⏳ Erreur 429 détectée, attente de ${backoffDelay / 1000}s avant de réessayer... (${retryCount + 1}/${MAX_RETRIES + 1})`,
        );
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        return await loadAllData(retryCount + 1);
      } else {
        console.error(
          "Échec final après",
          MAX_RETRIES,
          "tentatives ou erreur non retryable",
        );
        // Charger les données mock en fallback
        loadMockData();
        toast.warning(
          "Mode démo: Données mock chargées (Backend indisponible)",
        );
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (error) {
      console.error("❌ Erreur loadClients:", error);
      throw error;
    }
  };

  const loadCommandes = async () => {
    try {
      const data = await commandeService.getAllCommandes();
      setCommandes(data);
    } catch (error) {
      console.error("❌ Erreur loadCommandes:", error);
      throw error;
    }
  };

  const loadEquipements = async () => {
    try {
      const data = await equipementService.getAllEquipements();
      setEquipements(data);
    } catch (error) {
      console.error("❌ Erreur loadEquipements:", error);
      throw error;
    }
  };

  // useEffect séparé pour le mapping des commandes et équipements
  useEffect(() => {
    if (clients.length > 0) {
      const clientsAvecCommandes = clients.map((c) => {
        // Utiliser le même mapping que dans Commandes.jsx pour trouver les commandes du client
        const clientCommandes = commandes.filter((cmd) => {
          if (!cmd.clientId) return false;

          // Utiliser la même logique de mapping que dans Commandes.jsx
          if (c.id && c.id === cmd.clientId) {
            return true;
          }
          if (c._id === cmd.clientId) {
            return true;
          }
          // Mapper les anciens IDs numériques vers les nouveaux ObjectIds
          const idMapping = {
            69: "69f14cb53ffbdd2c36dd2a1a",
            70: "69eea2846ceb3a878d6f2bb7",
            71: "69ef587a0e12210a116ce4bf",
          };
          return c._id === idMapping[cmd.clientId];
        });

        // Si le client a des commandes, ajouter les équipements
        if (clientCommandes.length > 0) {
          const commandesAvecEquipements = clientCommandes.map((cmd) => {
            if (!cmd.equipId) {
              return { ...cmd, equipementNom: "Aucun équipement" };
            }

            const equipIdStr = String(cmd.equipId);
            // Utiliser la même logique de mapping que pour les clients
            const equipement = equipements.find((e) => {
              // Si c'est un ancien équipement avec id numérique
              if (e.id && e.id === cmd.equipId) {
                return true;
              }
              // Si c'est un nouvel équipement avec ObjectId
              if (e._id === cmd.equipId) {
                return true;
              }
              // Mapper les anciens IDs numériques vers les nouveaux ObjectIds
              const idMapping = {
                69: "69eea2846ceb3a878d6f2bb7",
                70: "69eea2846ceb3a878d6f2bb8",
                71: "69eea2846ceb3a878d6f2bb9",
              };
              return e._id === idMapping[cmd.equipId];
            });

            const equipementNom = equipement
              ? `${equipement.icon} ${equipement.name}`
              : `Équipement ${cmd.equipId}`;

            return {
              ...cmd,
              equipementNom: equipementNom,
            };
          });

          // Stocker les commandes avec équipements et leur nombre
          return {
            ...c,
            commandesList: commandesAvecEquipements,
            commandes: commandesAvecEquipements.length,
          };
        } else {
          // Client sans commandes
          return {
            ...c,
            commandesList: [],
            commandes: 0,
          };
        }
      });

      // Mettre à jour l'état séparé pour éviter la boucle
      setClientsAvecCommandes(clientsAvecCommandes);
    }
  }, [clients.length, commandes.length, equipements.length]);

  const filtered = clientsAvecCommandes.filter((c) => {
    const searchMatch = `${c.prenom} ${c.nom} ${c.tel} ${c.cinNum}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const quartierMatch = !filters.quartier || c.quartier === filters.quartier;

    const hasDocsMatch =
      filters.hasDocuments === "" ||
      (filters.hasDocuments === "yes" &&
        c.docs &&
        Object.keys(c.docs).some((key) => c.docs[key])) ||
      (filters.hasDocuments === "no" &&
        (!c.docs || !Object.keys(c.docs).some((key) => c.docs[key])));

    return searchMatch && quartierMatch && hasDocsMatch;
  });

  const handleDelete = async (id) => {
    if (confirm("Supprimer ce client ?")) {
      await clientService.deleteClient(id);
      await loadAllData();
    }
  };

  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setNewCoords({ lat, lng });
          setCoordInput(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
          setNewClient({ ...newClient, lat, lng });
        },
        () => toast.error("Impossible d'obtenir la position"),
      );
    } else {
      toast.warning("Géolocalisation non supportée");
    }
  };

  const handleAddClient = async () => {
    if (!newClient.prenom || !newClient.nom || !newClient.tel) {
      toast.error("Prénom, nom et téléphone sont requis");
      return;
    }
    try {
      await clientService.createClient(newClient);
      toast.success("Client créé avec succès");
      setShowAddModal(false);
      setNewClient({
        prenom: "",
        nom: "",
        tel: "",
        email: "",
        dateNaiss: "",
        quartier: "Maarif",
        adresse: "",
        cinNum: "",
        cinExp: "",
        note: "",
        lat: null,
        lng: null,
      });
      setNewCoords({ lat: null, lng: null });
      setCoordInput("");
      // Recharger toutes les données pour que le mapping fonctionne
      await loadAllData();
    } catch (error) {
      console.error("Erreur lors de la création du client:", error);
      toast.error("Erreur lors de la création du client");
    }
  };

  const openEditModal = (client) => {
    setEditClient({ ...client });
    setEditCoords({ lat: client.lat, lng: client.lng });
    setEditCoordInput(
      client.lat && client.lng
        ? `${client.lat.toFixed(5)}, ${client.lng.toFixed(5)}`
        : "",
    );
    setShowEditModal(true);
  };

  const handleUpdateClient = async () => {
    if (!editClient.prenom || !editClient.nom || !editClient.tel) {
      toast.error("Prénom, nom et téléphone sont requis");
      return;
    }
    try {
      await clientService.updateClient(editClient._id, editClient);
      toast.success("Client mis à jour avec succès");
      setShowEditModal(false);
      setEditClient(null);
      setEditCoords({ lat: null, lng: null });
      setEditCoordInput("");
      // Recharger toutes les données pour que le mapping fonctionne
      await loadAllData();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
      toast.error("Erreur lors de la mise à jour du client");
    }
  };

  const handleMapClick = () => {
    const lat = 33.5 + Math.random() * 0.2;
    const lng = -7.6 + Math.random() * 0.2;
    setNewCoords({ lat, lng });
    setCoordInput(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    setNewClient({ ...newClient, lat, lng });
  };

  const updateCoords = (val) => {
    setCoordInput(val);
    const parts = val.split(",").map((p) => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      setNewCoords({ lat: parts[0], lng: parts[1] });
      setNewClient({ ...newClient, lat: parts[0], lng: parts[1] });
    }
  };

  const updateEditCoords = (val) => {
    setEditCoordInput(val);
    const parts = val.split(",").map((p) => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      setEditCoords({ lat: parts[0], lng: parts[1] });
      setEditClient({ ...editClient, lat: parts[0], lng: parts[1] });
    }
  };

  const getEditCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setEditCoords({ lat, lng });
          setEditCoordInput(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
          setEditClient({ ...editClient, lat, lng });
        },
        () => toast.error("Impossible d'obtenir la position"),
      );
    } else {
      toast.warning("Géolocalisation non supportée");
    }
  };

  const handleExport = () => {
    const csvContent = [
      [
        "Prénom",
        "Nom",
        "Téléphone",
        "Email",
        "Quartier",
        "Adresse",
        "CIN",
        "Date d'inscription",
      ],
      ...filtered.map((client) => [
        client.prenom || "",
        client.nom || "",
        client.tel || "",
        client.email || "",
        client.quartier || "",
        client.adresse || "",
        client.cinNum || "",
        client.dateInscription
          ? new Date(client.dateInscription).toLocaleDateString()
          : "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `clients_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Clients
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {filtered.length} clients • {clients.length} total
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download size={16} />
            Exporter
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all"
          >
            <UserPlus size={16} />
            Nouveau client
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFiltersModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Filter size={16} />
            Filtres
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                {[
                  { label: "Client", cls: "text-left" },
                  { label: "Contact", cls: "text-left" },
                  { label: "Localisation", cls: "text-left" },
                  { label: "CIN", cls: "text-left" },
                  { label: "Commandes", cls: "text-center" },
                  { label: "Actions", cls: "text-center" },
                ].map((col) => (
                  <th
                    key={col.label}
                    className={`px-4 py-3 ${col.cls} text-[10px] font-bold uppercase tracking-widest text-slate-400`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((client, idx) => (
                <tr
                  key={client._id}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                    idx === 0 ? "border-t-0" : ""
                  }`}
                >
                  {/* Client */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar prenom={client.prenom} nom={client.nom} />
                      <div>
                        <div className="font-semibold text-slate-900">
                          {client.prenom} {client.nom}
                        </div>
                        <div className="text-xs text-slate-500">
                          {client.dateInscription &&
                            new Date(client.dateInscription).toLocaleDateString(
                              "fr-FR",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-3.5">
                    <div className="space-y-1">
                      {client.tel && (
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Phone size={13} className="text-slate-400" />
                          <span className="text-xs">{client.tel}</span>
                        </div>
                      )}
                      {client.email && (
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Mail size={13} className="text-slate-400" />
                          <span className="text-xs truncate max-w-[150px]">
                            {client.email}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Localisation */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <MapPin size={13} className="text-slate-400" />
                      <span className="text-xs">{client.quartier}</span>
                    </div>
                  </td>

                  {/* CIN */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-slate-600 font-mono">
                      {client.cinNum || "-"}
                    </span>
                  </td>

                  {/* Commandes */}
                  <td className="px-4 py-3.5">
                    {client.commandes > 0 ? (
                      <div className="flex flex-col gap-1">
                        {client.commandesList.map((cmd, i) => (
                          <div
                            key={i}
                            className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100"
                          >
                            {cmd.equipementNom || cmd.numero}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs font-medium">
                        Pas de commande
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClientId(client._id);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                        title="Voir"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(client);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                        title="Modifier"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(client._id);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">
                  Nouveau client
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={newClient.prenom}
                    onChange={(e) =>
                      setNewClient({ ...newClient, prenom: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={newClient.nom}
                    onChange={(e) =>
                      setNewClient({ ...newClient, nom: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={newClient.tel}
                    onChange={(e) =>
                      setNewClient({ ...newClient, tel: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newClient.email}
                    onChange={(e) =>
                      setNewClient({ ...newClient, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Quartier
                </label>
                <select
                  value={newClient.quartier}
                  onChange={(e) =>
                    setNewClient({ ...newClient, quartier: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="Maarif">Maarif</option>
                  <option value="Gueliz">Gueliz</option>
                  <option value="Agdal">Agdal</option>
                  <option value="Rabat">Rabat</option>
                  <option value="Casablanca">Casablanca</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Adresse
                </label>
                <textarea
                  value={newClient.adresse}
                  onChange={(e) =>
                    setNewClient({ ...newClient, adresse: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    CIN
                  </label>
                  <input
                    type="text"
                    value={newClient.cinNum}
                    onChange={(e) =>
                      setNewClient({ ...newClient, cinNum: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date d'expiration
                  </label>
                  <input
                    type="date"
                    value={newClient.cinExp}
                    onChange={(e) =>
                      setNewClient({ ...newClient, cinExp: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newClient.note}
                  onChange={(e) =>
                    setNewClient({ ...newClient, note: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Coordonnées GPS
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coordInput}
                    onChange={updateCoords}
                    placeholder="33.12345, -7.12345"
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    onClick={getCurrentPosition}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    📍
                  </button>
                  <button
                    onClick={handleMapClick}
                    className="px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
                  >
                    🗺️
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleAddClient}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Créer le client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {showEditModal && editClient && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">
                  Modifier le client
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={editClient.prenom}
                    onChange={(e) =>
                      setEditClient({ ...editClient, prenom: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={editClient.nom}
                    onChange={(e) =>
                      setEditClient({ ...editClient, nom: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={editClient.tel}
                    onChange={(e) =>
                      setEditClient({ ...editClient, tel: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editClient.email}
                    onChange={(e) =>
                      setEditClient({ ...editClient, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Quartier
                </label>
                <select
                  value={editClient.quartier}
                  onChange={(e) =>
                    setEditClient({ ...editClient, quartier: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="Maarif">Maarif</option>
                  <option value="Gueliz">Gueliz</option>
                  <option value="Agdal">Agdal</option>
                  <option value="Rabat">Rabat</option>
                  <option value="Casablanca">Casablanca</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Adresse
                </label>
                <textarea
                  value={editClient.adresse}
                  onChange={(e) =>
                    setEditClient({ ...editClient, adresse: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    CIN
                  </label>
                  <input
                    type="text"
                    value={editClient.cinNum}
                    onChange={(e) =>
                      setEditClient({ ...editClient, cinNum: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Date d'expiration
                  </label>
                  <input
                    type="date"
                    value={editClient.cinExp}
                    onChange={(e) =>
                      setEditClient({ ...editClient, cinExp: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={editClient.note}
                  onChange={(e) =>
                    setEditClient({ ...editClient, note: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Coordonnées GPS
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editCoordInput}
                    onChange={updateEditCoords}
                    placeholder="33.12345, -7.12345"
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    onClick={getEditCurrentPosition}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    📍
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleUpdateClient}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualisation */}
      {selectedClientId && (
        <ClientProfile
          clientId={selectedClientId}
          onClose={() => setSelectedClientId(null)}
        />
      )}
    </div>
  );
};

export default Clients;
