// src/pages/Clients/components/ClientProfile.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import clientService from "./services/clientService";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  CheckCircle,
  Eye,
  ShoppingBag,
  CreditCard,
  Star,
  Navigation,
  Wifi,
  ExternalLink,
  Package,
  Trash2,
  Upload,
  AlertCircle,
} from "lucide-react";

/* ── Helpers ─────────────────────────────────────────────────────── */
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const AVATAR_BG = [
  "bg-violet-600",
  "bg-blue-600",
  "bg-emerald-600",
  "bg-rose-600",
  "bg-amber-600",
];
const avatarBg = (name = "") =>
  AVATAR_BG[(name.charCodeAt(0) || 0) % AVATAR_BG.length];

/* ── Sub-components ──────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    held: ["En cours", "bg-amber-100 text-amber-700"],
    returned: ["Restituée", "bg-emerald-100 text-emerald-700"],
    deducted: ["Déduite", "bg-red-100 text-red-600"],
    paid: ["Payé", "bg-emerald-100 text-emerald-700"],
    pending: ["En attente", "bg-amber-100 text-amber-700"],
  };
  const [label, cls] = map[status] || [status, "bg-slate-100 text-slate-600"];
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${cls}`}>
      {label}
    </span>
  );
};

/* ── Main Component ──────────────────────────────────────────────── */
const ClientProfile = ({ clientId, onBack }) => {
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("docs");

  useEffect(() => {
    loadAll();
  }, [clientId]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const updatedClient = await clientService.getClientById(clientId);
      setClient(updatedClient);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const docTypes = [
    { id: "cin_r", label: "CIN Recto", icon: "🪪", required: true },
    { id: "cin_v", label: "CIN Verso", icon: "🪪", required: true },
    { id: "ordonnance", label: "Ordonnance", icon: "📋", required: false },
    { id: "assurance", label: "Assurance", icon: "🏥", required: false },
    { id: "justif", label: "Justif. domicile", icon: "🏠", required: false },
    { id: "autre", label: "Autre", icon: "📎", required: false },
  ];

  const uploadDoc = async (docType, fileInput) => {
    const file = fileInput.files[0];
    if (!file) return;

    try {
      toast.loading("Téléchargement du document...");

      // Appel au backend pour l'upload
      await clientService.addDocument(clientId, {
        type: docType,
        file: file,
      });

      // Recharger depuis le backend pour obtenir les données à jour
      setTimeout(async () => {
        await loadAll();
        toast.success("Document téléchargé avec succès !");
      }, 300);
    } catch (error) {
      console.error("Erreur uploadDoc:", error);
      toast.error("Erreur lors du téléchargement du document");
    }
  };

  const deleteDoc = async (docType) => {
    if (confirm("Supprimer ce document ?")) {
      try {
        toast.loading("Suppression du document...");

        // Mise à jour immédiate de l'état local pour un feedback visuel instantané
        setClient((prevClient) => {
          const updatedClient = { ...prevClient };
          if (updatedClient.docs) {
            delete updatedClient.docs[docType];
          }
          return updatedClient;
        });

        // Appel au backend pour la suppression permanente
        await clientService.addDocument(clientId, {
          type: docType,
          file: null, // Envoyer null pour supprimer
        });

        // Recharger depuis le backend pour s'assurer que les données sont synchronisées
        setTimeout(async () => {
          await loadAll();
          toast.success("Document supprimé avec succès !");
        }, 300);
      } catch (error) {
        console.error("Erreur deleteDoc:", error);
        toast.error("Erreur lors de la suppression du document");
        // En cas d'erreur, recharger les données originales
        await loadAll();
      }
    }
  };

  /* ── Loading ── */
  if (loading)
    return (
      <div className="flex items-center justify-center py-24 gap-3">
        <div className="w-6 h-6 rounded-full border-2 border-slate-200 border-t-slate-700 animate-spin" />
        <span className="text-sm text-slate-400">Chargement…</span>
      </div>
    );

  if (!client)
    return (
      <div className="text-center py-20 text-slate-400 text-sm">
        Client introuvable.{" "}
        <button onClick={onBack} className="text-blue-600 underline">
          Retour
        </button>
      </div>
    );

  const fullName = `${client.prenom} ${client.nom}`;
  const hasDocs = docTypes.filter((d) => client.docs?.[d.id]).length;
  const docComplete =
    docTypes.filter((d) => d.required && client.docs?.[d.id]).length ===
    docTypes.filter((d) => d.required).length;

  const quickActions = [
    {
      label: "Devis",
      emoji: "📝",
      cls: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-100",
      action: () => navigate("/app/devis", { state: { clientId } }),
    },
    {
      label: "Commande",
      emoji: "📋",
      cls: "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-100",
      action: () => navigate("/app/commandes/new", { state: { clientId } }),
    },
    {
      label: "Réservation",
      emoji: "🗓️",
      cls: "bg-violet-50 hover:bg-violet-100 text-violet-700 border-violet-100",
      action: () => navigate("/app/reservations/new", { state: { clientId } }),
    },
    {
      label: "Livraison",
      emoji: "🚚",
      cls: "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-100",
      action: () => navigate("/app/livraisons/new", { state: { clientId } }),
    },
    {
      label: "Facture",
      emoji: "🧾",
      cls: "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200",
      action: () => navigate("/app/facturation/new", { state: { clientId } }),
    },
    {
      label: "WhatsApp",
      emoji: "💬",
      cls: "bg-green-50 hover:bg-green-100 text-green-800 border-green-100",
      action: () =>
        window.open(`https://wa.me/${client.tel?.replace(/\s/g, "")}`),
    },
  ];

  return (
    <div className="space-y-4">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition shrink-0"
        >
          <ArrowLeft size={15} />
        </button>
        <h1 className="text-base font-extrabold tracking-tight text-slate-800">
          Fiche client
        </h1>
      </div>

      {/* ── 2-column layout ─────────────────────────────────────── */}
      <div className="flex gap-5 items-start">
        {/* ════════════════ LEFT PANEL ════════════════ */}
        <div className="w-72 shrink-0 space-y-4">
          {/* Avatar + identity */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* color banner */}
            <div className={`h-16 ${avatarBg(fullName)} opacity-90`} />
            <div className="px-5 pb-5 -mt-8">
              <div
                className={`w-16 h-16 rounded-2xl ${avatarBg(fullName)} flex items-center justify-center text-white text-xl font-extrabold ring-4 ring-white shadow`}
              >
                {getInitials(fullName)}
              </div>
              <div className="mt-3">
                <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                  {fullName}
                </h2>
                {client.totalDepense > 5000 && (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[11px] font-bold px-2 py-0.5 rounded-full mt-1.5">
                    <Star size={10} fill="currentColor" /> Client VIP
                  </span>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  Inscrit le{" "}
                  {new Date(client.createdAt).toLocaleDateString("fr-MA")}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Statistiques
            </p>
            {[
              {
                label: "Locations",
                value: client.commandes || 0,
                color: "text-slate-900",
              },
              {
                label: "Dépensé",
                value: `${(client.totalDepense || 0).toLocaleString("fr-MA")} MAD`,
                color: "text-emerald-600",
              },
              {
                label: "Documents",
                value: `${hasDocs} / ${docTypes.length}`,
                color: docComplete ? "text-emerald-600" : "text-amber-600",
              },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{label}</span>
                <span className={`text-sm font-bold tabular-nums ${color}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Contact
            </p>
            {[
              { icon: Phone, value: client.tel || "—" },
              { icon: Mail, value: client.email || "—" },
              {
                icon: MapPin,
                value:
                  [client.adresse, client.quartier && `(${client.quartier})`]
                    .filter(Boolean)
                    .join(" ") || "—",
              },
              {
                icon: Calendar,
                value: client.dateNaiss
                  ? new Date(client.dateNaiss).toLocaleDateString("fr-MA")
                  : "—",
                label: "Né le",
              },
            ].map(({ icon: Icon, value, label }) => (
              <div key={value} className="flex items-start gap-2.5">
                <Icon size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <span className="text-xs text-slate-700 break-all">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* CIN */}
          {(client.cinNum || client.cinExp) && (
            <div className="bg-amber-50 rounded-2xl border border-amber-200/60 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={14} className="text-amber-700" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  Carte Nationale
                </p>
              </div>
              <p className="font-mono font-bold text-amber-900 text-sm">
                {client.cinNum || "—"}
              </p>
              {client.cinExp && (
                <p className="text-[11px] text-amber-600 mt-1">
                  Expire : {client.cinExp}
                </p>
              )}
            </div>
          )}

          {/* GPS */}
          {client.lat && client.lng && (
            <div className="bg-blue-50 rounded-2xl border border-blue-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <Navigation size={14} className="text-blue-600" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                  GPS
                </p>
              </div>
              <p className="font-mono text-[11px] text-blue-800 mb-2">
                {client.lat.toFixed(5)}, {client.lng.toFixed(5)}
              </p>
              <a
                href={`https://waze.com/ul?ll=${client.lat},${client.lng}&navigate=yes`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition"
              >
                <Wifi size={11} /> Ouvrir dans Waze <ExternalLink size={10} />
              </a>
            </div>
          )}

          {/* Actions rapides */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              Actions rapides
            </p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map(({ label, emoji, cls, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition active:scale-95 ${cls}`}
                >
                  <span>{emoji}</span> {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════ RIGHT PANEL ════════════════ */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-slate-100 shadow-sm rounded-2xl p-1.5">
            {[
              { id: "docs", label: "Documents", icon: FileText },
              { id: "history", label: "Historique", icon: Package },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition ${
                  activeTab === id
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {/* ── DOCS ── */}
          {activeTab === "docs" && (
            <div className="space-y-3">
              {/* Doc status header */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  <span className="font-bold text-slate-900">{hasDocs}</span>{" "}
                  document{hasDocs !== 1 ? "s" : ""} ajouté
                  {hasDocs !== 1 ? "s" : ""}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${docComplete ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}
                >
                  {docComplete ? (
                    <CheckCircle size={11} />
                  ) : (
                    <AlertCircle size={11} />
                  )}
                  {docComplete ? "Dossier complet" : "Incomplet"}
                </span>
              </div>

              {/* Doc cards grid */}
              <div className="grid grid-cols-2 gap-3">
                {docTypes.map((doc) => {
                  const has = client.docs?.[doc.id];
                  return (
                    <div
                      key={doc.id}
                      className={`bg-white rounded-2xl border shadow-sm p-4 flex flex-col gap-3 transition ${
                        has ? "border-emerald-200" : "border-slate-100"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-2xl">{doc.icon}</span>
                          <p className="text-sm font-semibold text-slate-800 mt-1">
                            {doc.label}
                          </p>
                          {doc.required && (
                            <p className="text-[10px] font-bold uppercase tracking-wide text-red-500 mt-0.5">
                              Requis
                            </p>
                          )}
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${has ? "bg-emerald-100" : "bg-slate-100"}`}
                        >
                          {has ? (
                            <CheckCircle
                              size={13}
                              className="text-emerald-600"
                            />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                          )}
                        </div>
                      </div>

                      <div className="flex gap-1.5 flex-wrap">
                        {has && (
                          <>
                            <button
                              onClick={() => {
                                const docUrl = client.docs[doc.id];
                                // Corriger l'URL si c'est une URL locale
                                const correctedUrl = docUrl.startsWith(
                                  "file://",
                                )
                                  ? docUrl.replace(
                                      "file://",
                                      "http://localhost:5000/",
                                    )
                                  : docUrl;
                                window.open(correctedUrl, "_blank");
                              }}
                              className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition"
                            >
                              <Eye size={11} /> Voir
                            </button>
                            <button
                              onClick={() => deleteDoc(doc.id)}
                              className="flex items-center gap-1 text-[11px] font-semibold text-red-500 bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg hover:bg-red-100 transition"
                            >
                              <Trash2 size={11} />
                            </button>
                          </>
                        )}
                        <label className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-blue-100 transition">
                          <Upload size={11} />
                          {has ? "Remplacer" : "Ajouter"}
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={(e) => uploadDoc(doc.id, e.target)}
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── HISTORY ── */}
          {activeTab === "history" && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {client.commandesList?.length ? (
                <div className="divide-y divide-slate-50">
                  {client.commandesList.map((cmd) => (
                    <div
                      key={cmd.id}
                      className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                          <ShoppingBag size={15} className="text-slate-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-mono text-[11px] text-slate-400 font-bold">
                              {cmd.ref}
                            </span>
                            <StatusBadge status={cmd.status} />
                          </div>
                          <p className="text-sm font-semibold text-slate-800">
                            {cmd.equipement}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {cmd.start} → {cmd.end}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-emerald-700 tabular-nums shrink-0">
                        {cmd.amount.toLocaleString("fr-MA")} MAD
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Package size={22} className="text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-400">
                    Aucune commande pour ce client
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
