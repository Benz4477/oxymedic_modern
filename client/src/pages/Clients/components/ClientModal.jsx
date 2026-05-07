// src/pages/Clients/components/ClientModal.jsx
import React, { useState } from "react";
import { X, MapPin } from "lucide-react";

const ClientModal = ({ isOpen, onClose, client, setClient, onSave, title, isEditing = false }) => {
  const [coordInput, setCoordInput] = useState(
    client?.lat && client?.lng ? `${client.lat}, ${client.lng}` : ""
  );

  if (!isOpen) return null;

  // ── Gestion de la carte cliquable ──
  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const lat = 33.65 - (y / rect.height) * 0.3;
    const lng = -7.75 + (x / rect.width) * 0.3;
    setClient({ ...client, lat: parseFloat(lat.toFixed(5)), lng: parseFloat(lng.toFixed(5)) });
    setCoordInput(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
  };

  const updateCoords = (val) => {
    setCoordInput(val);
    const parts = val.split(",").map((p) => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      setClient({ ...client, lat: parts[0], lng: parts[1] });
    }
  };

  const getCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setClient({ ...client, lat, lng });
          setCoordInput(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        },
        () => alert("Impossible d'obtenir la position")
      );
    } else {
      alert("Géolocalisation non supportée");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Identité */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={client?.prenom || ""}
                  onChange={(e) => setClient({ ...client, prenom: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  value={client?.nom || ""}
                  onChange={(e) => setClient({ ...client, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={client?.tel || ""}
                  onChange={(e) => setClient({ ...client, tel: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={client?.email || ""}
                  onChange={(e) => setClient({ ...client, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Date de naissance
                </label>
                <input
                  type="date"
                  value={client?.dateNaiss || ""}
                  onChange={(e) => setClient({ ...client, dateNaiss: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Quartier
                </label>
                <select
                  value={client?.quartier || "Maarif"}
                  onChange={(e) => setClient({ ...client, quartier: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Maarif">Maarif</option>
                  <option value="Anfa">Anfa</option>
                  <option value="Hay Hassani">Hay Hassani</option>
                  <option value="Ain Chock">Ain Chock</option>
                  <option value="Californie">Californie</option>
                  <option value="Sidi Maarouf">Sidi Maarouf</option>
                  <option value="Ain Sebaa">Ain Sebaa</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Adresse complète
              </label>
              <textarea
                value={client?.adresse || ""}
                onChange={(e) => setClient({ ...client, adresse: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="N° rue, nom de la rue"
              />
            </div>

            {/* Section CIN (style original) */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-700 text-sm font-bold mb-3">
                <span>🪪</span> Carte Nationale d'Identité (CIN)
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-amber-700/70 mb-1.5">
                    Numéro CIN
                  </label>
                  <input
                    type="text"
                    value={client?.cinNum || ""}
                    onChange={(e) => setClient({ ...client, cinNum: e.target.value })}
                    className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="ex: BE123456"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-amber-700/70 mb-1.5">
                    Date d'expiration
                  </label>
                  <input
                    type="month"
                    value={client?.cinExp || ""}
                    onChange={(e) => setClient({ ...client, cinExp: e.target.value })}
                    className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Section GPS avec carte SVG cliquable (comme dans l'original) */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-700 text-sm font-bold mb-3">
                <MapPin size={14} /> Localisation GPS — Waze
              </div>

              {/* Carte SVG cliquable */}
              <div
                className="bg-white rounded-xl border border-blue-200 overflow-hidden cursor-crosshair"
                onClick={handleMapClick}
              >
                <svg width="100%" height="160" viewBox="0 0 500 160" preserveAspectRatio="none">
                  <rect width="500" height="160" fill="#E0F7FA" />
                  <line x1="0" y1="53" x2="500" y2="53" stroke="white" strokeWidth="5" />
                  <line x1="0" y1="107" x2="500" y2="107" stroke="white" strokeWidth="5" />
                  <line x1="125" y1="0" x2="125" y2="160" stroke="white" strokeWidth="5" />
                  <line x1="250" y1="0" x2="250" y2="160" stroke="white" strokeWidth="3" />
                  <line x1="375" y1="0" x2="375" y2="160" stroke="white" strokeWidth="5" />
                  {client?.lat && client?.lng && (
                    <g transform={`translate(${((client.lng + 7.75) / 0.3) * 500}, ${((33.65 - client.lat) / 0.3) * 160})`}>
                      <path d="M0 28 Q-14 8,-14 -2 A14 14 0 0 1 14 -2 Q14 8 0 28Z" fill="#EF4444" />
                      <circle cx="0" cy="-2" r="7" fill="white" opacity="0.95" />
                      <circle cx="0" cy="-2" r="4" fill="#EF4444" />
                    </g>
                  )}
                </svg>
              </div>

              {/* Champ coordonnées + bouton de géolocalisation */}
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Latitude, Longitude"
                  value={coordInput}
                  onChange={(e) => updateCoords(e.target.value)}
                />
                <button
                  type="button"
                  onClick={getCurrentPosition}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
                >
                  📍 Ma position
                </button>
              </div>
              <p className="text-xs text-blue-500 mt-2">Cliquez sur la carte pour définir la position exacte du client.</p>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Note
              </label>
              <textarea
                value={client?.note || ""}
                onChange={(e) => setClient({ ...client, note: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Informations complémentaires..."
              />
            </div>
          </div>

         <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
  <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition"
  >
    Annuler
  </button>
  <button
    type="button"
    onClick={(e) => { e.preventDefault(); onSave(); }}
    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
  >
    {isEditing ? "Mettre à jour" : "Créer le dossier client"}
  </button>
</div>
        </form>
      </div>
    </div>
  );
};

export default ClientModal;