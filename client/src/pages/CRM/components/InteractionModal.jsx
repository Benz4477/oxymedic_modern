import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const InteractionModal = ({ isOpen, onClose, clients, preClientId, onSave }) => {
  const [form, setForm] = useState({
    client: "", type: "note", titre: "", note: "", date: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    const today = new Date().toISOString().split("T")[0];
    setForm({ client: preClientId || "", type: "note", titre: "", note: "", date: today });
  }, [isOpen, preClientId]);

  const handleSave = () => {
    if (!form.client) return toast.error("Sélectionnez un client");
    if (!form.titre.trim()) return toast.error("Titre requis");
    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-slate-900">📋 Nouvelle interaction</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widests text-slate-400 mb-1.5">Client *</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))}>
                <option value="">Sélectionner</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.prenom} {c.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widests text-slate-400 mb-1.5">Type *</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="call">📞 Appel</option>
                <option value="email">📧 Email</option>
                <option value="visit">🏠 Visite</option>
                <option value="note">📝 Note</option>
                <option value="sms">💬 SMS</option>
                <option value="whatsapp">🟢 WhatsApp</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widests text-slate-400 mb-1.5">Titre *</label>
            <input type="text" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))}
              placeholder="Objet de l'interaction…" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widests text-slate-400 mb-1.5">Date</label>
            <input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widests text-slate-400 mb-1.5">Note / Résumé</label>
            <textarea rows={3} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-emerald-400 outline-none"
              value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              placeholder="Résumé de l'interaction, suite à donner…" />
          </div>
        </div>
        <div className="px-5 py-3 border-t border-slate-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">Annuler</button>
          <button onClick={handleSave} className="px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition">Enregistrer</button>
        </div>
      </div>
    </div>
  );
};

export default InteractionModal;