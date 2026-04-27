// src/pages/Clients/Clients.jsx
import React, { useState, useEffect } from "react";
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
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
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

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const data = await clientService.getAllClients();
    setClients(data);
  };

  const filtered = clients.filter((c) => {
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
      await loadClients();
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
        () => alert("Impossible d'obtenir la position"),
      );
    } else {
      alert("Géolocalisation non supportée");
    }
  };

  const handleAddClient = async () => {
    if (!newClient.prenom || !newClient.nom || !newClient.tel) {
      alert("Prénom, nom et téléphone sont requis");
      return;
    }
    await clientService.createClient(newClient);
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
    await loadClients();
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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      quartier: "",
      hasDocuments: "",
      dateRange: "",
    });
  };

  if (selectedClientId) {
    return (
      <div className="p-6">
        <ClientProfile
          clientId={selectedClientId}
          onBack={() => setSelectedClientId(null)}
        />
      </div>
    );
  }

  /* classes réutilisables */
  const fieldLabel =
    "block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5";
  const fieldInput =
    "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition placeholder:text-slate-300";

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Clients
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {clients.length} client{clients.length !== 1 ? "s" : ""} enregistré
            {clients.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all"
        >
          <UserPlus size={16} />
          Nouveau client
        </button>
      </div>

      {/* ── KPIs ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <Users size={22} className="text-blue-600" />
          </div>
          <div>
            <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
              {clients.length}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              Total clients
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
            <Calendar size={22} className="text-emerald-600" />
          </div>
          <div>
            <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
              {
                clients.filter(
                  (c) =>
                    new Date() - new Date(c.dateInscription) <
                    30 * 24 * 3600000,
                ).length
              }
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              Nouveaux ce mois
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <Star size={22} className="text-amber-500" />
          </div>
          <div>
            <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
              {clients.filter((c) => c.totalDepense > 5000).length}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-medium">
              Clients VIP
            </div>
          </div>
        </div>
      </div>

      {/* ── Barre de recherche ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, CIN…"
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFiltersModal(true)}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 px-4 py-2.5 rounded-xl transition"
        >
          <Filter size={14} /> Filtres
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 px-4 py-2.5 rounded-xl transition"
        >
          <Download size={14} /> Exporter
        </button>
      </div>

      {/* ── Tableau ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
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
                  { label: "Dépensé", cls: "text-right" },
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

            <tbody className="divide-y divide-slate-50">
              {filtered.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-slate-50/70 cursor-pointer transition-colors group"
                  onClick={() => setSelectedClientId(client.id)}
                >
                  {/* Client */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar prenom={client.prenom} nom={client.nom} />
                      <div>
                        <div className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                          {client.prenom} {client.nom}
                        </div>
                        {client.statut === "vip" && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full mt-0.5">
                            ⭐ VIP
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <Phone size={12} className="text-slate-400" />
                      {client.tel}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5">
                      <Mail size={11} />
                      {client.email || "—"}
                    </div>
                  </td>

                  {/* Localisation */}
                  <td className="px-4 py-3.5 text-slate-600">
                    <div className="flex items-center gap-1">
                      {client.quartier || client.adresse?.slice(0, 20) || "—"}
                      {client.lat && client.lng && (
                        <MapPin
                          size={12}
                          className="text-blue-500 ml-0.5"
                          title="GPS"
                        />
                      )}
                    </div>
                  </td>

                  {/* CIN */}
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-500">
                    {client.cinNum || "—"}
                  </td>

                  {/* Commandes */}
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                      {client.commandes || 0}
                    </span>
                  </td>

                  {/* Dépensé */}
                  <td className="px-4 py-3.5 text-right font-semibold text-emerald-700 tabular-nums">
                    {(client.totalDepense || 0).toLocaleString("fr-MA")} MAD
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClientId(client.id);
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                        title="Voir"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
                        title="Modifier"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(client.id);
                        }}
                        className="p-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <div className="text-3xl mb-2">🔍</div>
                    <div className="text-slate-400 text-sm">
                      Aucun client trouvé
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal d'ajout ───────────────────────────────────────── */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-6 py-4 flex justify-between items-center rounded-t-2xl">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
                  Nouveau client
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Remplissez les informations du dossier
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-6">
              {/* Section Identité */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 pb-2 border-b border-slate-100">
                  Identité
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={fieldLabel}>
                      Prénom <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      className={fieldInput}
                      value={newClient.prenom}
                      onChange={(e) =>
                        setNewClient({ ...newClient, prenom: e.target.value })
                      }
                      placeholder="Youssef"
                    />
                  </div>
                  <div>
                    <label className={fieldLabel}>
                      Nom <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      className={fieldInput}
                      value={newClient.nom}
                      onChange={(e) =>
                        setNewClient({ ...newClient, nom: e.target.value })
                      }
                      placeholder="Benali"
                    />
                  </div>
                </div>
              </div>

              {/* Section Contact */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 pb-2 border-b border-slate-100">
                  Contact
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={fieldLabel}>
                      Téléphone <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      className={fieldInput}
                      value={newClient.tel}
                      onChange={(e) =>
                        setNewClient({ ...newClient, tel: e.target.value })
                      }
                      placeholder="06 xx xx xx xx"
                    />
                  </div>
                  <div>
                    <label className={fieldLabel}>Email</label>
                    <input
                      type="email"
                      className={fieldInput}
                      value={newClient.email}
                      onChange={(e) =>
                        setNewClient({ ...newClient, email: e.target.value })
                      }
                      placeholder="exemple@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={fieldLabel}>Date de naissance</label>
                    <input
                      type="date"
                      className={fieldInput}
                      value={newClient.dateNaiss}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          dateNaiss: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className={fieldLabel}>Quartier</label>
                    <select
                      className={fieldInput}
                      value={newClient.quartier}
                      onChange={(e) =>
                        setNewClient({ ...newClient, quartier: e.target.value })
                      }
                    >
                      {[
                        "Maarif",
                        "Anfa",
                        "Hay Hassani",
                        "Ain Chock",
                        "Californie",
                        "Sidi Maarouf",
                        "Ain Sebaa",
                        "Autre",
                      ].map((q) => (
                        <option key={q}>{q}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={fieldLabel}>Adresse complète</label>
                  <input
                    type="text"
                    className={fieldInput}
                    value={newClient.adresse}
                    onChange={(e) =>
                      setNewClient({ ...newClient, adresse: e.target.value })
                    }
                    placeholder="N° rue, nom de la rue"
                  />
                </div>
              </div>

              {/* Section CIN */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 pb-2 border-b border-slate-100">
                  Carte Nationale d'Identité
                </p>
                <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-amber-700 text-sm font-bold mb-3">
                    🪪 CIN
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-amber-700/70 mb-1.5">
                        Numéro CIN
                      </label>
                      <input
                        type="text"
                        className="w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm font-mono bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition placeholder:text-slate-300"
                        value={newClient.cinNum}
                        onChange={(e) =>
                          setNewClient({ ...newClient, cinNum: e.target.value })
                        }
                        placeholder="ex: BE123456"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-amber-700/70 mb-1.5">
                        Date d'expiration
                      </label>
                      <input
                        type="month"
                        className="w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                        value={newClient.cinExp}
                        onChange={(e) =>
                          setNewClient({ ...newClient, cinExp: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section GPS */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 pb-2 border-b border-slate-100">
                  Localisation GPS
                </p>
                <div className="bg-blue-50 border border-blue-200/70 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-700 text-sm font-bold mb-3">
                    <MapPin size={14} /> Position Waze
                  </div>
                  <div className="bg-white rounded-xl border border-blue-100 overflow-hidden">
                    <div
                      className="h-40 cursor-crosshair"
                      onClick={handleMapClick}
                    >
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 500 160"
                        preserveAspectRatio="none"
                      >
                        <rect width="500" height="160" fill="#E0F7FA" />
                        <rect
                          x="0"
                          y="53"
                          width="500"
                          height="5"
                          fill="white"
                          opacity="0.8"
                        />
                        <rect
                          x="0"
                          y="107"
                          width="500"
                          height="5"
                          fill="white"
                          opacity="0.8"
                        />
                        <rect
                          x="125"
                          y="0"
                          width="5"
                          height="160"
                          fill="white"
                          opacity="0.8"
                        />
                        <rect
                          x="250"
                          y="0"
                          width="3"
                          height="160"
                          fill="white"
                          opacity="0.8"
                        />
                        <rect
                          x="375"
                          y="0"
                          width="5"
                          height="160"
                          fill="white"
                          opacity="0.8"
                        />
                        {newCoords.lat && newCoords.lng && (
                          <g
                            transform={`translate(${((newCoords.lng + 7.75) / 0.3) * 500}, ${((33.65 - newCoords.lat) / 0.3) * 160})`}
                          >
                            <path
                              d="M0 28 Q-14 8,-14 -2 A14 14 0 0 1 14 -2 Q14 8 0 28Z"
                              fill="#EF4444"
                            />
                            <circle
                              cx="0"
                              cy="-2"
                              r="7"
                              fill="white"
                              opacity="0.95"
                            />
                            <circle cx="0" cy="-2" r="4" fill="#EF4444" />
                          </g>
                        )}
                      </svg>
                    </div>
                    <div className="p-2 flex gap-2 border-t border-blue-50">
                      <input
                        type="text"
                        className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-mono bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder:text-slate-300"
                        placeholder="Latitude, Longitude"
                        value={coordInput}
                        onChange={(e) => updateCoords(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={getCurrentPosition}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                      >
                        <MapPin size={11} /> Ma position
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-blue-500 mt-2">
                    Cliquez sur la carte pour définir la position exacte du
                    client.
                  </p>
                </div>
              </div>

              {/* Note */}
              <div>
                <label className={fieldLabel}>Note</label>
                <textarea
                  rows="3"
                  className={`${fieldInput} resize-none`}
                  value={newClient.note}
                  onChange={(e) =>
                    setNewClient({ ...newClient, note: e.target.value })
                  }
                  placeholder="Informations complémentaires…"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-100 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Annuler
              </button>
              <button
                onClick={handleAddClient}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-md shadow-emerald-100 transition-all"
              >
                Créer le dossier client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modale des filtres ─────────────────────────────────────── */}
      {showFiltersModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Filtres</h3>
                <button
                  onClick={() => setShowFiltersModal(false)}
                  className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition"
                >
                  <X size={16} className="text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Quartier
                </label>
                <select
                  value={filters.quartier}
                  onChange={(e) =>
                    handleFilterChange("quartier", e.target.value)
                  }
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">Tous les quartiers</option>
                  <option value="Maarif">Maarif</option>
                  <option value="Gueliz">Gueliz</option>
                  <option value="Casablanca">Casablanca</option>
                  <option value="Rabat">Rabat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Documents
                </label>
                <select
                  value={filters.hasDocuments}
                  onChange={(e) =>
                    handleFilterChange("hasDocuments", e.target.value)
                  }
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">Tous les clients</option>
                  <option value="yes">Avec documents</option>
                  <option value="no">Sans documents</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setShowFiltersModal(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
