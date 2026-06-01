import React from "react";
import { Plus } from "lucide-react";

const MagasinModal = ({ isOpen, onClose, editMode, form, setForm, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-h-[calc(100vh-4rem)] overflow-y-auto max-w-3xl rounded-xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-slate-900">{editMode ? "Modifier le Magasin" : "Nouveau Magasin"}</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configuration de l'unité de vente</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <Plus size={24} className="rotate-45 text-slate-400" />
          </button>
        </div>

        <form onSubmit={onSave} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nom du magasin</label>
              <input
                required
                type="text"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-xs font-black focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                placeholder="ex: Casablanca"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Ville</label>
              <input
                required
                type="text"
                value={form.ville}
                onChange={(e) => setForm({ ...form, ville: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-xs font-black focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                placeholder="ex: Casablanca"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Adresse</label>
            <textarea
              value={form.adresse}
              onChange={(e) => setForm({ ...form, adresse: e.target.value })}
              className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-xs font-black focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none min-h-[100px]"
              placeholder="Adresse complète..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Téléphone</label>
              <input
                type="text"
                value={form.tel}
                onChange={(e) => setForm({ ...form, tel: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-xs font-black focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                placeholder="05..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">ICE (Optionnel)</label>
              <input
                type="text"
                value={form.ice}
                onChange={(e) => setForm({ ...form, ice: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-xs font-black focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                placeholder="Identifiant Commun..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Type d'Unité</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-xs font-black focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
              >
                <option value="magasin">🏪 Point de Vente / Magasin</option>
                <option value="depot">🏭 Dépôt de Stock / Logistique</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Statut Opérationnel</label>
               <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-xs font-black focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
              <input
                type="checkbox"
                id="isDefault"
                checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                className="w-5 h-5 rounded-lg border-slate-200 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="isDefault" className="text-[11px] font-black text-slate-700 cursor-pointer">Unité Principale / Référence</label>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-2 py-4 bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all px-12"
            >
              {editMode ? "Mettre à jour" : "Créer le magasin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MagasinModal;
