import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const OppModal = ({ isOpen, onClose, clients, equipements, stages, preStageId, onSave }) => {
  const [form, setForm] = useState({
    client: "", equipement: "", stageId: 1, amount: 0, prob: 50, notes: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    const stage = stages.find(s => s.id === (preStageId || 1));
    setForm({
      client: "", equipement: "", stageId: preStageId || 1,
      amount: 0, prob: stage?.prob || 50, notes: "",
    });
  }, [isOpen, preStageId, stages]);

  const handleSave = () => {
    if (!form.client) return toast.error("Client requis");
    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>

        <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-slate-900">📊 Nouvelle opportunité</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Client *</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))}>
                <option value="">Sélectionner</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.prenom} {c.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Équipement</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.equipement} onChange={e => setForm(f => ({ ...f, equipement: e.target.value }))}>
                <option value="">— Aucun —</option>
                {equipements.map(e => <option key={e._id} value={e._id}>{e.icon} {e.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Étape</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.stageId}
                onChange={e => {
                  const sid = parseInt(e.target.value);
                  const s = stages.find(x => x.id === sid);
                  setForm(f => ({ ...f, stageId: sid, prob: s?.prob || f.prob }));
                }}>
                {stages.filter(s => s.id < 5).map(s => (
                  <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Probabilité (%)</label>
              <input type="number" min="0" max="100"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.prob} onChange={e => setForm(f => ({ ...f, prob: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Montant estimé (MAD)</label>
            <input type="number" min="0"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={form.amount} onChange={e => setForm(f => ({ ...f, amount: parseFloat(e.target.value) || 0 }))} placeholder="0" />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Notes</label>
            <textarea rows={2}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-emerald-400 outline-none"
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Contexte, besoins du client…" />
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">Annuler</button>
          <button onClick={handleSave} className="px-4 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition">
            Créer l'opportunité
          </button>
        </div>
      </div>
    </div>
  );
};

export default OppModal;
