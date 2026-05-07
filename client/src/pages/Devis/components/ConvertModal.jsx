import React, { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import unitService from "../../../services/unitService";

const today    = () => new Date().toISOString().split("T")[0];
const in30days = () => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split("T")[0]; };
const fmtMad   = (n) => `${(n || 0).toLocaleString("fr-FR")} MAD`;

const ConvertModal = ({ isOpen, onClose, devis, equipements, onConvert }) => {
  const [form, setForm] = useState({
    dateDebut: today(), dateFin: in30days(),
    modePaiement: "espece", equipement: "", unite: "",
  });
  const [units, setUnits]     = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les unités disponibles quand l'équipement change
  useEffect(() => {
    if (!form.equipement) { setUnits([]); setForm(f => ({ ...f, unite: "" })); return; }
    setLoading(true);
    unitService.getAll()
      .then(data => {
        const disponibles = data.filter(u =>
          String(u.equipement?._id || u.equipement) === String(form.equipement) &&
          u.statut === "disponible"
        );
        setUnits(disponibles);
        setForm(f => ({ ...f, unite: "" }));
      })
      .catch(() => setUnits([]))
      .finally(() => setLoading(false));
  }, [form.equipement]);

  if (!isOpen || !devis) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-sm font-extrabold tracking-tight text-slate-900">Convertir en commande</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Résumé devis */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <div className="text-xs font-bold text-emerald-700 mb-1">{devis.reference}</div>
            <div className="text-sm font-medium text-slate-700">{devis.clientNom}</div>
            <div className="text-sm font-bold text-emerald-700 mt-1">{fmtMad(devis.montantTTC)}</div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Date début *</label>
              <input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.dateDebut} onChange={e => setForm(f => ({ ...f, dateDebut: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Date fin *</label>
              <input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.dateFin} onChange={e => setForm(f => ({ ...f, dateFin: e.target.value }))} />
            </div>
          </div>

          {/* Équipement */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Équipement *</label>
            <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={form.equipement} onChange={e => setForm(f => ({ ...f, equipement: e.target.value }))}>
              <option value="">Sélectionner un équipement</option>
              {equipements.map(e => <option key={e._id} value={e._id}>{e.icon} {e.name}</option>)}
            </select>
          </div>

          {/* N° Série (unité disponible) */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widests text-slate-400 mb-1.5">
              N° Série
              <span className="text-slate-300 normal-case font-normal ml-1">(optionnel — unités disponibles)</span>
            </label>
            <select
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={form.unite}
              onChange={e => setForm(f => ({ ...f, unite: e.target.value }))}
              disabled={!form.equipement || loading}
            >
              <option value="">
                {!form.equipement ? "Sélectionnez d'abord un équipement" :
                 loading ? "Chargement..." :
                 units.length === 0 ? "Aucune unité disponible" :
                 "— Sans N° série —"}
              </option>
              {units.map(u => (
                <option key={u._id} value={u._id}>
                  {u.serial} {u.barcode ? `(${u.barcode})` : ""}
                </option>
              ))}
            </select>
            {form.equipement && !loading && units.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">
                ⚠️ Aucune unité disponible pour cet équipement — vous pourrez l'assigner plus tard dans Commandes.
              </p>
            )}
            {units.length > 0 && (
              <p className="text-xs text-emerald-600 mt-1">
                ✅ {units.length} unité{units.length > 1 ? "s" : ""} disponible{units.length > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Mode paiement */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Mode paiement</label>
            <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={form.modePaiement} onChange={e => setForm(f => ({ ...f, modePaiement: e.target.value }))}>
              <option value="espece">💵 Espèce</option>
              <option value="virement">🏦 Virement</option>
              <option value="cheque">📄 Chèque</option>
              <option value="carte">💳 Carte</option>
            </select>
          </div>

          <p className="text-xs text-slate-400">
            Une commande sera créée automatiquement avec les montants du devis. Le N° série peut être assigné maintenant ou plus tard.
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
            Annuler
          </button>
          <button onClick={() => onConvert(form)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition">
            <ArrowRight size={14} /> Créer la commande
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConvertModal;