import React, { useState, useEffect, useMemo } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const today    = () => new Date().toISOString().split("T")[0];
const in30days = () => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split("T")[0]; };

const EMPTY_LIGNE = { description: "", quantite: 1, prixHT: 0, totalHT: 0, tvaRate: 20, remPct: 0, equipement: "" };

const DevisModal = ({ isOpen, onClose, editMode, initialData, clients, equipements, onSave }) => {
  const [form, setForm] = useState({
    client: "", type: "devis", date: today(), dateValidite: in30days(),
    lignes: [{ ...EMPTY_LIGNE }], remiseGlobale: 0, tvaGlobale: 20,
    notes: "", description: "",
  });

  useEffect(() => {
    if (!isOpen) return;
    if (editMode && initialData) {
      setForm({
        client:        initialData.client?._id || initialData.client || "",
        type:          initialData.type         || "devis",
        date:          initialData.date ? new Date(initialData.date).toISOString().split("T")[0] : today(),
        dateValidite:  initialData.dateValidite ? new Date(initialData.dateValidite).toISOString().split("T")[0] : in30days(),
        lignes:        initialData.lignes?.length ? initialData.lignes.map(l => ({ ...l, equipement: l.equipement?._id || l.equipement || "" })) : [{ ...EMPTY_LIGNE }],
        remiseGlobale: initialData.remiseGlobale || 0,
        tvaGlobale:    initialData.tvaGlobale    || 20,
        notes:         initialData.notes         || "",
        description:   initialData.description   || "",
      });
    } else {
      setForm({ client: "", type: "devis", date: today(), dateValidite: in30days(), lignes: [{ ...EMPTY_LIGNE }], remiseGlobale: 0, tvaGlobale: 20, notes: "", description: "" });
    }
  }, [isOpen, editMode, initialData]);

  const totals = useMemo(() => {
    const sousTotal = form.lignes.reduce((s, l) => s + (l.quantite * l.prixHT), 0);
    const ht  = sousTotal * (1 - form.remiseGlobale / 100);
    const tva = ht * (form.tvaGlobale / 100);
    return { sousTotal, ht: Math.round(ht), tva: Math.round(tva), ttc: Math.round(ht + tva) };
  }, [form.lignes, form.remiseGlobale, form.tvaGlobale]);

  const updateLigne = (i, field, val) => {
    const ls = [...form.lignes];
    ls[i] = { ...ls[i], [field]: val };
    if (field === "quantite" || field === "prixHT") ls[i].totalHT = ls[i].quantite * ls[i].prixHT;
    setForm(f => ({ ...f, lignes: ls }));
  };

  const fillFromEquipement = (equipId, i) => {
    const equip = equipements.find(e => e._id === equipId);
    if (!equip) return;
    const ls = [...form.lignes];
    ls[i] = { ...ls[i], description: equip.name, prixHT: equip.pMonth || 0, totalHT: ls[i].quantite * (equip.pMonth || 0), equipement: equipId };
    setForm(f => ({ ...f, lignes: ls }));
  };

  const addLigne    = () => setForm(f => ({ ...f, lignes: [...f.lignes, { ...EMPTY_LIGNE }] }));
  const removeLigne = (i) => { if (form.lignes.length === 1) return; setForm(f => ({ ...f, lignes: f.lignes.filter((_, idx) => idx !== i) })); };

  const handleSave = () => {
    if (!form.client)                  return toast.error("Sélectionnez un client");
    if (!form.lignes[0]?.description)  return toast.error("Ajoutez au moins une ligne");
    onSave({ ...form, lignes: form.lignes.map(l => ({ ...l, totalHT: l.quantite * l.prixHT })) });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 px-5 py-3 flex justify-between items-center">
          <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
            {editMode ? "Modifier le devis" : "Nouveau devis"}
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Type */}
          <div className="grid grid-cols-2 gap-3">
            {["devis", "proforma"].map(t => (
              <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                className={`p-3 rounded-xl border-2 text-sm font-semibold transition ${form.type === t ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-500"}`}>
                {t === "devis" ? "📄 Devis" : "📋 Proforma"}
              </button>
            ))}
          </div>

          {/* Client */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Client *</label>
            <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))}>
              <option value="">Sélectionner un client</option>
              {clients.map(c => <option key={c._id} value={c._id}>{c.prenom} {c.nom} — {c.tel}</option>)}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Date du devis</label>
              <input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Valide jusqu'au *</label>
              <input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.dateValidite} onChange={e => setForm(f => ({ ...f, dateValidite: e.target.value }))} />
            </div>
          </div>

          {/* Objet */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widests text-slate-400 mb-1.5">Objet / Description</label>
            <input type="text" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Ex: Location fauteuil roulant — 1 mois" />
          </div>

          {/* Lignes */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Lignes de devis</label>
              <button type="button" onClick={addLigne} className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1">
                <Plus size={12} /> Ajouter une ligne
              </button>
            </div>
            <div className="grid grid-cols-12 gap-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              <div className="col-span-2">Équipement</div>
              <div className="col-span-3">Description</div>
              <div className="col-span-2 text-center">Qté</div>
              <div className="col-span-2 text-right">PU HT</div>
              <div className="col-span-2 text-right">Total HT</div>
              <div className="col-span-1" />
            </div>
            <div className="space-y-2">
              {form.lignes.map((ligne, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-2">
                    <select className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-emerald-400 outline-none"
                      value={ligne.equipement || ""}
                      onChange={e => fillFromEquipement(e.target.value, i)}>
                      <option value="">—</option>
                      {equipements.map(e => <option key={e._id} value={e._id}>{e.icon} {e.name}</option>)}
                    </select>
                  </div>
                  <div className="col-span-3">
                    <input type="text" className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                      value={ligne.description} onChange={e => updateLigne(i, "description", e.target.value)} placeholder="Description" />
                  </div>
                  <div className="col-span-2">
                    <input type="number" min="1" className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center focus:ring-2 focus:ring-emerald-400 outline-none"
                      value={ligne.quantite} onChange={e => updateLigne(i, "quantite", parseInt(e.target.value) || 1)} />
                  </div>
                  <div className="col-span-2">
                    <input type="number" min="0" className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-right focus:ring-2 focus:ring-emerald-400 outline-none"
                      value={ligne.prixHT} onChange={e => updateLigne(i, "prixHT", parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="col-span-2 text-right font-mono text-sm font-bold text-emerald-700">
                    {(ligne.quantite * ligne.prixHT).toLocaleString()} MAD
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button type="button" onClick={() => removeLigne(i)} className="text-red-400 hover:text-red-600 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TVA + Remise + Totaux */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Taux TVA (%)</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={form.tvaGlobale} onChange={e => setForm(f => ({ ...f, tvaGlobale: parseFloat(e.target.value) }))}>
                  {[0, 7, 10, 14, 20].map(v => <option key={v} value={v}>{v}%</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Remise globale (%)</label>
                <input type="number" min="0" max="100" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={form.remiseGlobale} onChange={e => setForm(f => ({ ...f, remiseGlobale: parseFloat(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-1.5">
              <div className="flex justify-between text-sm text-slate-500"><span>Sous-total HT</span><span className="font-mono">{totals.sousTotal.toLocaleString()} MAD</span></div>
              {form.remiseGlobale > 0 && (
                <div className="flex justify-between text-sm text-amber-600">
                  <span>Remise ({form.remiseGlobale}%)</span>
                  <span className="font-mono">- {Math.round(totals.sousTotal - totals.ht).toLocaleString()} MAD</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-slate-500"><span>Total HT</span><span className="font-mono font-semibold">{totals.ht.toLocaleString()} MAD</span></div>
              <div className="flex justify-between text-sm text-purple-600"><span>TVA ({form.tvaGlobale}%)</span><span className="font-mono">{totals.tva.toLocaleString()} MAD</span></div>
              <div className="flex justify-between text-base font-bold border-t border-slate-200 pt-2 mt-2">
                <span>TOTAL TTC</span>
                <span className="text-emerald-700 font-mono">{totals.ttc.toLocaleString()} MAD</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Notes / Conditions</label>
            <textarea rows={2} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-emerald-400 outline-none"
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Valable 30 jours à compter de la date du devis..." />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">Annuler</button>
          <button onClick={handleSave} className="px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition">
            {editMode ? "Mettre à jour" : "Créer le devis"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevisModal;