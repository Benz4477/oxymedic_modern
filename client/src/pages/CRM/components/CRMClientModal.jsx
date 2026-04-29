// src/pages/CRM/components/CRMClientModal.jsx
import React from "react";
import { X } from "lucide-react";

const CRMClientModal = ({ isOpen, onClose, client, setClient, onSave, title, isEditing = false }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-5 py-3 flex justify-between items-center rounded-t-2xl">
          <h3 className="text-sm font-extrabold tracking-tight text-slate-900">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4">
            {/* Identité */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Prénom *
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={client?.prenom || ""}
                  onChange={(e) => setClient({ ...client, prenom: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Nom *
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={client?.nom || ""}
                  onChange={(e) => setClient({ ...client, nom: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={client?.tel || ""}
                  onChange={(e) => setClient({ ...client, tel: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={client?.email || ""}
                  onChange={(e) => setClient({ ...client, email: e.target.value })}
                />
              </div>
            </div>

            {/* Segment et Statut */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Segment
                </label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={client?.segment || "standard"}
                  onChange={(e) => setClient({ ...client, segment: e.target.value })}
                >
                  <option value="premium">Premium</option>
                  <option value="standard">Standard</option>
                  <option value="occasionnel">Occasionnel</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Statut
                </label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={client?.statut || "actif"}
                  onChange={(e) => setClient({ ...client, statut: e.target.value })}
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="perdu">Perdu</option>
                </select>
              </div>
            </div>

            {/* Score */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Score client (0-100)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={client?.score || 0}
                onChange={(e) => setClient({ ...client, score: parseInt(e.target.value) })}
              />
            </div>

            {/* Total commandes et dépense */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Nombre de commandes
                </label>
                <input
                  type="number"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={client?.totalCommandes || 0}
                  onChange={(e) => setClient({ ...client, totalCommandes: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Dépense totale (MAD)
                </label>
                <input
                  type="number"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={client?.totalDepense || 0}
                  onChange={(e) => setClient({ ...client, totalDepense: parseInt(e.target.value) })}
                />
              </div>
            </div>

            {/* Prochaine action */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Prochaine action
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={client?.prochaineAction || ""}
                  onChange={(e) => setClient({ ...client, prochaineAction: e.target.value })}
                  placeholder="Appeler client, Envoyer devis..."
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Date prochaine action
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={client?.dateProchaineAction || ""}
                  onChange={(e) => setClient({ ...client, dateProchaineAction: e.target.value })}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Notes
              </label>
              <textarea
                rows="2"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-emerald-400 outline-none"
                value={client?.notes || ""}
                onChange={(e) => setClient({ ...client, notes: e.target.value })}
                placeholder="Informations complémentaires..."
              />
            </div>
          </div>

          <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 flex justify-end gap-2 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
              Annuler
            </button>
            <button type="submit" className="px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition">
              {isEditing ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CRMClientModal;