// src/pages/Commandes/components/CommandeModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const CommandeModal = ({ isOpen, onClose, editMode, formData, setFormData, clients, equipements, units, onSave }) => {
  const [filteredUnits, setFilteredUnits] = useState([]);

  useEffect(() => {
    console.log("useEffect unités - formData.equipId:", formData.equipId);
    console.log("toutes les unités:", units);
    if (formData.equipId) {
      const available = units.filter(u => {
        console.log("vérification unité:", u);
        console.log("u.equipId:", u.equipId);
        console.log("u.status:", u.status);
        console.log("formData.equipId:", formData.equipId);
        // Gérer les deux cas: u.equipId objet vs formData.equipId string
        const equipIdMatch = (u.equipId && u.equipId._id === formData.equipId) || 
                               (u.equipId && u.equipId.id === formData.equipId) || 
                               (u.equipId && u.equipId._id === parseInt(formData.equipId)) || 
                               (u.equipId && u.equipId.id === parseInt(formData.equipId));
        console.log("comparaison:", equipIdMatch, u.status === "available" || u.status === "rented");
        return equipIdMatch && (u.status === "available" || u.status === "rented");
      });
      console.log("unités disponibles:", available);
      setFilteredUnits(available);
      
      // Sélectionner automatiquement le premier N° Série disponible si aucun n'est déjà sélectionné
      if (available.length > 0 && !formData.unitId) {
        const firstAvailable = available[0];
        console.log("première unité disponible:", firstAvailable);
        setFormData(prev => ({ ...prev, unitId: firstAvailable.id }));
      }
    } else {
      setFilteredUnits([]);
    }
  }, [formData.equipId, units]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-5 py-3 flex justify-between items-center">
          <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
            {editMode ? "Modifier la commande" : "Nouvelle commande"}
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Client */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Client *</label>
            <select
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.clientId || ""}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value || "" })}
            >
              <option value="">Sélectionner un client</option>
              {clients.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.prenom} {c.nom}</option>)}
            </select>
          </div>

          {/* Équipement */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Équipement *</label>
            <select
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.equipId || ""}
              onChange={(e) => setFormData({ ...formData, equipId: e.target.value || "", unitId: "" })}
            >
              <option value="">Sélectionner un équipement</option>
              {equipements && equipements.length > 0 ? 
                equipements.filter(e => !e.archived).map(e => <option key={e._id} value={e._id}>{e.icon} {e.name}</option>) : 
                <option disabled>Aucun équipement disponible</option>
              }
            </select>
          </div>

          {/* Unité (N° série) */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">N° de série (unité)</label>
            <select
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.unitId}
              onChange={(e) => setFormData({ ...formData, unitId: parseInt(e.target.value) || null })}
            >
              <option value="">— Optionnel —</option>
              {filteredUnits.map(u => <option key={u.id} value={u.id}>✅ {u.serial} (Libre)</option>)}
              {units.filter(u => u.equipId === formData.equipId && (u.status === "available" || u.status === "rented")).map(u => (
                <option key={u.id} value={u.id} disabled className="text-slate-400">🔴 {u.serial} ({u.status})</option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Date début *</label>
              <input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none" value={formData.start} onChange={e => setFormData({ ...formData, start: e.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Date fin *</label>
              <input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none" value={formData.end} onChange={e => setFormData({ ...formData, end: e.target.value })} />
            </div>
          </div>

          {/* Paiement et montant */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Mode paiement</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none" value={formData.pay} onChange={e => setFormData({ ...formData, pay: e.target.value })}>
                <option>Carte</option><option>Virement</option><option>Cash livr.</option><option>Cash mag.</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Montant TTC (MAD)</label>
              <input type="number" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none" value={formData.amountTTC} onChange={e => setFormData({ ...formData, amountTTC: parseInt(e.target.value) || 0 })} />
            </div>
          </div>

          {/* Caution */}
          <div className="border border-amber-200 rounded-xl p-3 bg-amber-50/30">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-amber-700 mb-1">Montant caution (MAD)</label>
                <input type="number" className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none" value={formData.caution} onChange={e => setFormData({ ...formData, caution: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-amber-700 mb-1">Mode caution</label>
                <select className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none" value={formData.cautionMode} onChange={e => setFormData({ ...formData, cautionMode: e.target.value })}>
                  <option>Cash</option><option>Chèque</option><option>Virement</option>
                </select>
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Note</label>
            <textarea rows="2" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-emerald-400 outline-none" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} placeholder="Informations complémentaires..." />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">Annuler</button>
          <button onClick={onSave} className="px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition">Enregistrer</button>
        </div>
      </div>
    </div>
  );
};

export default CommandeModal;