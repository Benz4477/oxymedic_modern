// src/pages/CRM/components/CRMInteractionModal.jsx
import React from "react";
import { X } from "lucide-react";

const CRMInteractionModal = ({ isOpen, onClose, interaction, setInteraction, clientName, onSave }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-5 py-3 flex justify-between items-center rounded-t-2xl">
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900">Nouvelle interaction</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">{clientName}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4">
            {/* Type d'interaction */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Type *
              </label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={interaction?.type || "appel"}
                onChange={(e) => setInteraction({ ...interaction, type: e.target.value })}
              >
                <option value="appel">📞 Appel téléphonique</option>
                <option value="email">✉️ Email</option>
                <option value="visite">🏠 Visite sur site</option>
                <option value="whatsapp">💬 WhatsApp</option>
                <option value="reunion">🤝 Réunion</option>
              </select>
            </div>

            {/* Date et heure */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Date *
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={interaction?.date || ""}
                  onChange={(e) => setInteraction({ ...interaction, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Heure
                </label>
                <input
                  type="time"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={interaction?.heure || ""}
                  onChange={(e) => setInteraction({ ...interaction, heure: e.target.value })}
                />
              </div>
            </div>

            {/* Durée */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Durée
              </label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={interaction?.duree || ""}
                onChange={(e) => setInteraction({ ...interaction, duree: e.target.value })}
                placeholder="15 minutes"
              />
            </div>

            {/* Sujet */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Sujet *
              </label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={interaction?.sujet || ""}
                onChange={(e) => setInteraction({ ...interaction, sujet: e.target.value })}
                required
                placeholder="Objet de l'interaction"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Notes / Résumé
              </label>
              <textarea
                rows="3"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-emerald-400 outline-none"
                value={interaction?.notes || ""}
                onChange={(e) => setInteraction({ ...interaction, notes: e.target.value })}
                placeholder="Détails de l'échange, informations importantes..."
              />
            </div>

            {/* Résultat */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Résultat
              </label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={interaction?.resultat || "neutre"}
                onChange={(e) => setInteraction({ ...interaction, resultat: e.target.value })}
              >
                <option value="positif">✅ Positif</option>
                <option value="neutre">➡️ Neutre</option>
                <option value="negatif">❌ Négatif</option>
                <option value="en_attente">⏳ En attente</option>
              </select>
            </div>
          </div>

          <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 flex justify-end gap-2 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
              Annuler
            </button>
            <button type="submit" className="px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition">
              Enregistrer l'interaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CRMInteractionModal;