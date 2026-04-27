// src/pages/Facturation/components/FactureModal.jsx
import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, FileText, CreditCard } from "lucide-react";

const FactureModal = ({ isOpen, onClose, editMode, formData, setFormData, clients = [], commandes = [], onSave }) => {
  const [lignes, setLignes] = useState([]);
  const [tvaRate, setTvaRate] = useState(20);
  const [remiseGlobale, setRemiseGlobale] = useState(0);
  const [sousTotal, setSousTotal] = useState(0);
  const [totalHT, setTotalHT] = useState(0);
  const [totalTVA, setTotalTVA] = useState(0);
  const [totalTTC, setTotalTTC] = useState(0);
  const [typeDocument, setTypeDocument] = useState("facture");

  // Initialiser les lignes quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      if (editMode && formData.lignes) {
        setLignes(formData.lignes);
        recalculerTotaux(formData.lignes, formData.remiseGlobale || 0, formData.tvaRate || 20);
        setTvaRate(formData.tvaRate || 20);
        setRemiseGlobale(formData.remiseGlobale || 0);
      } else {
        // Ligne vide par défaut
        setLignes([{ id: Date.now(), description: "", quantite: 1, prixHT: 0, totalHT: 0 }]);
        recalculerTotaux([], 0, 20);
      }
    }
  }, [isOpen, editMode]);

  // Recalculer les totaux
  const recalculerTotaux = (lignesData, remise = remiseGlobale, tva = tvaRate) => {
    const ht = lignesData.reduce((sum, l) => sum + (l.totalHT || 0), 0);
    const htApresRemise = ht * (1 - remise / 100);
    const tvaAmount = htApresRemise * tva / 100;
    const ttc = htApresRemise + tvaAmount;
    setSousTotal(ht);
    setTotalHT(htApresRemise);
    setTotalTVA(tvaAmount);
    setTotalTTC(ttc);
  };

  // Ajouter une ligne
  const addLigne = () => {
    const newLigne = { id: Date.now(), description: "", quantite: 1, prixHT: 0, totalHT: 0 };
    const newLignes = [...lignes, newLigne];
    setLignes(newLignes);
    recalculerTotaux(newLignes);
  };

  // Supprimer une ligne
  const removeLigne = (id) => {
    if (lignes.length === 1) {
      alert("Au moins une ligne requise");
      return;
    }
    const newLignes = lignes.filter(l => l.id !== id);
    setLignes(newLignes);
    recalculerTotaux(newLignes);
  };

  // Mettre à jour une ligne
  const updateLigne = (id, field, value) => {
    const newLignes = lignes.map(l => {
      if (l.id === id) {
        const updated = { ...l, [field]: value };
        if (field === "quantite" || field === "prixHT") {
          updated.totalHT = (updated.quantite || 1) * (updated.prixHT || 0);
        }
        return updated;
      }
      return l;
    });
    setLignes(newLignes);
    recalculerTotaux(newLignes);
  };

  // Auto-remplissage depuis une commande
  const handleCommandeChange = (commandeId) => {
    const cmd = commandes.find(c => c.id === parseInt(commandeId));
    if (!cmd) return;

    // Créer une ligne à partir de la commande
    const description = `Location Commande (${cmd.start} → ${cmd.end}) - ${cmd.ref || ""}`;
    const prixHT = Math.round(cmd.amount / (1 + tvaRate / 100));
    const newLignes = [{
      id: Date.now(),
      description,
      quantite: 1,
      prixHT,
      totalHT: prixHT,
    }];
    setLignes(newLignes);
    recalculerTotaux(newLignes);
    setFormData(prev => ({ ...prev, clientId: cmd.clientId, cmdRef: cmd.ref }));
  };

  const handleSave = () => {
    if (lignes.length === 0 || !lignes[0].description) {
      alert("Ajoutez au moins une ligne de facturation");
      return;
    }
    if (!formData.clientId) {
      alert("Sélectionnez un client");
      return;
    }
    
    const dataToSend = {
      // Champs qui existent dans le formulaire
      type: typeDocument,
      status: formData.status || "draft",
      clientId: formData.clientId || 1,
      dateFacture: formData.dateFacture || new Date().toLocaleDateString('fr-FR'),
      dateEcheance: formData.dateEcheance || "",
      lignes: lignes.map(l => ({
        description: l.description,
        quantite: l.quantite,
        prixHT: l.prixHT,
        totalHT: l.totalHT,
        tvaRate: 20,
        remPct: 0
      })),
      cmdRef: formData.cmdRef || "",
      notes: formData.notes || ""
    };
    
    console.log("Données envoyées au backend:", JSON.stringify(dataToSend, null, 2));
    console.log("Lignes de facture:", JSON.stringify(dataToSend.lignes, null, 2));
    console.log("Validation des lignes:", dataToSend.lignes.map(l => ({
      description: l.description,
      quantite: l.quantite,
      prixHT: l.prixHT,
      totalHT: l.totalHT,
      hasDescription: !!l.description,
      hasQuantite: !isNaN(l.quantite) && l.quantite > 0,
      hasPrixHT: !isNaN(l.prixHT) && l.prixHT >= 0,
      hasTotalHT: !isNaN(l.totalHT) && l.totalHT >= 0
    })));
    onSave(dataToSend);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        
        {/* Header avec choix Facture/Proforma */}
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 px-5 py-3">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
              {editMode ? "Modifier la facture" : "Nouvelle facture"}
            </h3>
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
              <X size={14} />
            </button>
          </div>
          
          {/* Toggle Facture / Proforma */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTypeDocument("facture")}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition ${typeDocument === "facture" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500"}`}
            >
              <FileText size={16} /> Facture officielle
            </button>
            <button
              type="button"
              onClick={() => setTypeDocument("proforma")}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition ${typeDocument === "proforma" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500"}`}
            >
              <CreditCard size={16} /> Proforma
            </button>
          </div>
          {typeDocument === "proforma" && (
            <p className="text-[10px] text-slate-400 mt-2">Document proforma — non valable comme facture fiscale</p>
          )}
        </div>

        <div className="p-5 space-y-5">
          {/* Client + Commande */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Client *</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.clientId || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, clientId: parseInt(e.target.value) }))}
              >
                <option value="">Sélectionner un client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Commande liée</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.cmdRef || ""}
                onChange={(e) => handleCommandeChange(e.target.value)}
              >
                <option value="">— Optionnel —</option>
                {commandes.map(c => <option key={c.id} value={c.id}>[{c.ref}] {c.client} — {c.amount} MAD</option>)}
              </select>
            </div>
          </div>

          {/* Lignes de facturation */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Lignes de facturation</label>
              <button type="button" onClick={addLigne} className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1">
                <Plus size={12} /> Ajouter une ligne
              </button>
            </div>

            {/* En-tête du tableau */}
            <div className="grid grid-cols-12 gap-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              <div className="col-span-5">Description</div>
              <div className="col-span-2 text-center">Qté</div>
              <div className="col-span-2 text-right">Prix HT</div>
              <div className="col-span-2 text-right">Total HT</div>
              <div className="col-span-1"></div>
            </div>

            {/* Lignes */}
            <div className="space-y-2">
              {lignes.map((ligne) => (
                <div key={ligne.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                      value={ligne.description}
                      onChange={(e) => updateLigne(ligne.id, "description", e.target.value)}
                      placeholder="Description"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center focus:ring-2 focus:ring-emerald-400 outline-none"
                      value={ligne.quantite || 1}
                      onChange={(e) => updateLigne(ligne.id, "quantite", parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-right focus:ring-2 focus:ring-emerald-400 outline-none"
                      value={ligne.prixHT || 0}
                      onChange={(e) => updateLigne(ligne.id, "prixHT", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-2 text-right font-mono text-sm font-bold text-emerald-700">
                    {Math.round(ligne.totalHT || 0).toLocaleString()} MAD
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button type="button" onClick={() => removeLigne(ligne.id)} className="text-red-500 hover:text-red-700 text-xs w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TVA & Totaux */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Taux TVA (%)</label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none bg-white"
                  value={tvaRate}
                  onChange={(e) => { setTvaRate(parseFloat(e.target.value)); recalculerTotaux(lignes, remiseGlobale, parseFloat(e.target.value)); }}
                >
                  <option value="0">0%</option><option value="7">7%</option><option value="10">10%</option><option value="14">14%</option><option value="20">20%</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Remise (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none bg-white"
                  value={remiseGlobale}
                  onChange={(e) => { setRemiseGlobale(parseFloat(e.target.value)); recalculerTotaux(lignes, parseFloat(e.target.value), tvaRate); }}
                />
              </div>
            </div>

            {/* Totaux calculés */}
            <div className="bg-white rounded-xl p-3 border border-slate-200">
              <div className="flex justify-between text-sm py-1"><span className="text-slate-500">Sous-total HT</span><span className="font-mono">{Math.round(sousTotal || 0).toLocaleString()} MAD</span></div>
              {remiseGlobale > 0 && <div className="flex justify-between text-sm py-1 text-amber-600"><span>Remise ({remiseGlobale}%)</span><span>- {Math.round((sousTotal || 0) - (totalHT || 0)).toLocaleString()} MAD</span></div>}
              <div className="flex justify-between text-sm py-1"><span className="text-slate-500">Total HT</span><span className="font-mono font-semibold">{Math.round(totalHT || 0).toLocaleString()} MAD</span></div>
              <div className="flex justify-between text-sm py-1"><span className="text-slate-500">TVA ({tvaRate}%)</span><span className="font-mono text-purple-600">{Math.round(totalTVA || 0).toLocaleString()} MAD</span></div>
              <div className="flex justify-between text-base font-bold pt-2 mt-2 border-t border-slate-200"><span>TOTAL TTC</span><span className="text-emerald-700">{Math.round(totalTTC || 0).toLocaleString()} MAD</span></div>
            </div>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Statut</label>
            <select
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.status || "draft"}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="draft">Brouillon</option>
              <option value="sent">Envoyée</option>
              <option value="unpaid">Non payée</option>
              <option value="partial">Partielle</option>
              <option value="paid">Payée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Notes / Conditions</label>
            <textarea
              rows="2"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.notes || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Paiement sous 30 jours, TVA applicable…"
            />
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