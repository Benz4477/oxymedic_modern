import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const today = () => new Date().toISOString().split("T")[0];

const TacheModal = ({ isOpen, onClose, clients, preClientId, onSave }) => {
  const [form, setForm] = useState({
    titre: "", client: "", type: "other", priorite: "moyenne",
    echeance: "", assignedTo: "Admin",
  });

  useEffect(() => {
    if (!isOpen) return;
    setForm({ titre: "", client: preClientId || "", type: "other", priorite: "moyenne", echeance: "", assignedTo: "Admin" });
  }, [isOpen, preClientId]);

  const handleSave = () => {
    if (!form.titre.trim()) return toast.error("Titre requis");
    onSave({ ...form, client: form.client || null });
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-slate-900">✅ Nouvelle tâche</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Titre de la tâche *</label>
            <input type="text" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
              placeholder="ex: Rappeler le client, Envoyer devis…" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widests text-slate-400 mb-1.5">Client lié</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))}>
                <option value="">— Aucun —</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.prenom} {c.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widests text-slate-400 mb-1.5">Type</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="call">📞 Appel</option>
                <option value="email">📧 Email</option>
                <option value="delivery">🚚 Livraison</option>
                <option value="contract">📜 Contrat</option>
                <option value="other">⚙️ Autre</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widests text-slate-400 mb-1.5">Priorité</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.priorite} onChange={e => setForm(f => ({ ...f, priorite: e.target.value }))}>
                <option value="haute">🔴 Haute</option>
                <option value="moyenne">🟠 Moyenne</option>
                <option value="basse">⚪ Basse</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widests text-slate-400 mb-1.5">Échéance</label>
              <input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.echeance} onChange={e => setForm(f => ({ ...f, echeance: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widests text-slate-400 mb-1.5">Assigné à</label>
            <input type="text" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))} />
          </div>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">Annuler</button>
          <button onClick={handleSave} className="px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition">Créer la tâche</button>
        </div>
      </div>
    </div>
  );
};

export default TacheModal;