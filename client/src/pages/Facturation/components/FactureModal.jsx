import React, { useState, useEffect, useMemo } from "react";
import { X, Plus, Trash2, FileText, File } from "lucide-react";
import { toast } from "react-toastify";

const FactureModal = ({
  isOpen, onClose, editMode,
  formData, setFormData,
  clients = [], commandes = [],
  onSave,
}) => {
  const [lignes, setLignes]               = useState([]);
  const [tvaRate, setTvaRate]             = useState(20);
  const [remiseGlobale, setRemiseGlobale] = useState(0);
  const [typeDocument, setTypeDocument]   = useState("facture");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [modePaiement, setModePaiement]   = useState("virement");

  const clientCommandes = useMemo(() => {
    if (!selectedClientId) return commandes;
    return commandes.filter((cmd) => {
      const cmdClientId = cmd.client?._id || cmd.client;
      return String(cmdClientId) === String(selectedClientId);
    });
  }, [selectedClientId, commandes]);

  useEffect(() => {
    if (!isOpen) return;
    if (editMode && formData.lignes?.length > 0) {
      setLignes(formData.lignes.map(l => ({ ...l, totalHT: l.quantite * l.prixHT })));
      setTvaRate(formData.tvaGlobale || 20);
      setRemiseGlobale(formData.remiseGlobale || 0);
      setTypeDocument(formData.type || "facture");
      setSelectedClientId(formData.client || "");
      setModePaiement(formData.modePaiement || "virement");
    } else {
      setLignes([{ id: Date.now(), description: "", quantite: 1, prixHT: 0, totalHT: 0, tvaRate: 20, remPct: 0 }]);
      setTvaRate(20);
      setRemiseGlobale(0);
      setTypeDocument("facture");
      setSelectedClientId("");
      setModePaiement("virement");
    }
  }, [isOpen, editMode]);

  const totals = useMemo(() => {
    let sousTotal = 0;
    lignes.forEach(l => { sousTotal += l.quantite * l.prixHT; });
    let totalHT  = sousTotal * (1 - remiseGlobale / 100);
    let totalTVA = totalHT * (tvaRate / 100);
    return { sousTotal, totalHT, totalTVA, totalTTC: totalHT + totalTVA };
  }, [lignes, tvaRate, remiseGlobale]);

  const updateLigne = (index, field, value) => {
    const newLignes = [...lignes];
    newLignes[index][field] = value;
    if (field === "quantite" || field === "prixHT") {
      newLignes[index].totalHT = newLignes[index].quantite * newLignes[index].prixHT;
    }
    setLignes(newLignes);
  };

  const addLigne = () => {
    setLignes([...lignes, { id: Date.now(), description: "", quantite: 1, prixHT: 0, totalHT: 0, tvaRate, remPct: 0 }]);
  };

  const removeLigne = (index) => {
    if (lignes.length === 1) return toast.error("Au moins une ligne est requise");
    setLignes(lignes.filter((_, i) => i !== index));
  };

  const handleCommandeSelect = (commandeId) => {
    const cmd = commandes.find(c => c._id === commandeId);
    if (!cmd) return;
    const equip = cmd.equipement;
    const description = `Location ${equip ? `${equip.icon || ""} ${equip.name}` : ""} — ${cmd.reference}`.trim();
    const montantTTC  = cmd.montantTTC || 0;
    const prixHT      = Math.round(montantTTC / (1 + tvaRate / 100));
    setLignes([{ id: Date.now(), description, quantite: 1, prixHT, totalHT: prixHT, tvaRate, remPct: 0 }]);
    setFormData(prev => ({ ...prev, commande: cmd._id }));
  };

  const handleClientChange = (clientId) => {
    const client = clients.find(c => c._id === clientId);
    setSelectedClientId(clientId);
    setFormData(prev => ({
      ...prev,
      client:        clientId,
      clientNom:     client ? `${client.prenom} ${client.nom}` : "",
      clientEmail:   client?.email   || "",
      clientAdresse: client ? `${client.adresse || ""} ${client.quartier || ""}`.trim() : "",
      commande:      "",
    }));
  };

  const handleSave = () => {
    if (!lignes[0]?.description) return toast.error("Ajoutez au moins une ligne");
    if (!selectedClientId && !formData.client) return toast.error("Sélectionnez un client");

    onSave({
      type:          typeDocument,
      status:        formData.status || "draft",
      client:        selectedClientId || formData.client,
      clientNom:     formData.clientNom || "",
      clientEmail:   formData.clientEmail || "",
      clientAdresse: formData.clientAdresse || "",
      commande:      formData.commande || null,
      date:          formData.date || new Date().toISOString().split("T")[0],
      dateEcheance:  formData.dateEcheance || null,
      modePaiement,
      lignes:        lignes.map(l => ({
        description: l.description,
        quantite:    l.quantite,
        prixHT:      l.prixHT,
        totalHT:     l.quantite * l.prixHT,
        tvaRate,
        remPct:      0,
      })),
      notes:          formData.notes || "",
      remiseGlobale,
      tvaGlobale:     tvaRate,
      montantHT:      Math.round(totals.totalHT),
      montantTVA:     Math.round(totals.totalTVA),
      montantTTC:     Math.round(totals.totalTTC),
      montantPaye:    0,
      montantRestant: Math.round(totals.totalTTC),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-5 py-3">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
              {editMode ? "Modifier la facture" : "Nouvelle facture"}
            </h3>
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
              <X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["facture", "proforma"].map((t) => (
              <button key={t} type="button" onClick={() => setTypeDocument(t)}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition ${typeDocument === t ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500"}`}>
                {t === "facture" ? <><FileText size={16} /> Facture officielle</> : <><File size={16} /> Devis proforma</>}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Client */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Client *</label>
            <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={selectedClientId || formData.client || ""}
              onChange={(e) => handleClientChange(e.target.value)}>
              <option value="">Sélectionner un client</option>
              {clients.map(c => (
                <option key={c._id} value={c._id}>{c.prenom} {c.nom} — {c.tel}</option>
              ))}
            </select>
          </div>

          {/* Commande liée */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Commande liée</label>
            <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.commande || ""}
              onChange={(e) => handleCommandeSelect(e.target.value)}>
              <option value="">— Aucune commande —</option>
              {clientCommandes.map(cmd => (
                <option key={cmd._id} value={cmd._id}>
                  {cmd.reference} — {(cmd.montantTTC || 0).toLocaleString()} MAD
                </option>
              ))}
            </select>
          </div>

          {/* Dates + Mode paiement */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Date facture</label>
              <input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.date || ""} onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Date échéance</label>
              <input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.dateEcheance || ""} onChange={(e) => setFormData(p => ({ ...p, dateEcheance: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Mode paiement</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={modePaiement} onChange={(e) => setModePaiement(e.target.value)}>
                <option value="espece">Espèce</option>
                <option value="virement">Virement</option>
                <option value="cheque">Chèque</option>
                <option value="carte">Carte bancaire</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>

          {/* Lignes */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Lignes de facturation</label>
              <button type="button" onClick={addLigne} className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1">
                <Plus size={12} /> Ajouter une ligne
              </button>
            </div>
            <div className="grid grid-cols-12 gap-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              <div className="col-span-5">Description</div>
              <div className="col-span-2 text-center">Qté</div>
              <div className="col-span-2 text-right">Prix HT</div>
              <div className="col-span-2 text-right">Total HT</div>
              <div className="col-span-1" />
            </div>
            <div className="space-y-2">
              {lignes.map((ligne, index) => (
                <div key={ligne.id || index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <input type="text" className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                      value={ligne.description} onChange={(e) => updateLigne(index, "description", e.target.value)} placeholder="Description" />
                  </div>
                  <div className="col-span-2">
                    <input type="number" min="1" className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center focus:ring-2 focus:ring-emerald-400 outline-none"
                      value={ligne.quantite} onChange={(e) => updateLigne(index, "quantite", parseInt(e.target.value) || 1)} />
                  </div>
                  <div className="col-span-2">
                    <input type="number" min="0" className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-right focus:ring-2 focus:ring-emerald-400 outline-none"
                      value={ligne.prixHT} onChange={(e) => updateLigne(index, "prixHT", parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="col-span-2 text-right font-mono text-sm font-bold text-emerald-700">
                    {(ligne.quantite * ligne.prixHT).toLocaleString()} MAD
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button type="button" onClick={() => removeLigne(index)} className="text-red-400 hover:text-red-600 w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TVA & Remise + Totaux */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Taux TVA (%)</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none bg-white"
                  value={tvaRate} onChange={(e) => setTvaRate(parseFloat(e.target.value))}>
                  {[0, 7, 10, 14, 20].map(v => <option key={v} value={v}>{v}%</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Remise globale (%)</label>
                <input type="number" min="0" max="100" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none bg-white"
                  value={remiseGlobale} onChange={(e) => setRemiseGlobale(parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-1">
              <div className="flex justify-between text-sm"><span className="text-slate-500">Sous-total HT</span><span className="font-mono">{Math.round(totals.sousTotal).toLocaleString()} MAD</span></div>
              {remiseGlobale > 0 && <div className="flex justify-between text-sm text-amber-600"><span>Remise ({remiseGlobale}%)</span><span>- {Math.round(totals.sousTotal - totals.totalHT).toLocaleString()} MAD</span></div>}
              <div className="flex justify-between text-sm"><span className="text-slate-500">Total HT</span><span className="font-mono font-semibold">{Math.round(totals.totalHT).toLocaleString()} MAD</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">TVA ({tvaRate}%)</span><span className="font-mono text-purple-600">{Math.round(totals.totalTVA).toLocaleString()} MAD</span></div>
              <div className="flex justify-between text-base font-bold pt-2 mt-2 border-t border-slate-200">
                <span>TOTAL TTC</span>
                <span className="text-emerald-700">{Math.round(totals.totalTTC).toLocaleString()} MAD</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Notes / Conditions</label>
            <textarea rows="2" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.notes || ""} onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
              placeholder="Paiement sous 30 jours..." />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">Annuler</button>
          <button onClick={handleSave} className="px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition">
            {editMode ? "Mettre à jour" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FactureModal;