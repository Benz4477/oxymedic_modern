import React, { useState } from "react";
import { X, CreditCard } from "lucide-react";

const fmt = (n) => (n || 0).toLocaleString("fr-FR");

const FacturePayerModal = ({ isOpen, onClose, facture, onSave }) => {
  const [montant, setMontant]         = useState("");
  const [modePaiement, setMode]       = useState("espece");
  const [banque, setBanque]           = useState("");
  const [reference, setReference]     = useState("");
  const [note, setNote]               = useState("");

  if (!isOpen || !facture) return null;

  const restant = facture.montantRestant || facture.montantTTC || 0;

  const handleSave = () => {
    if (!montant || parseFloat(montant) <= 0) return;
    onSave({
      client:            facture.client?._id || facture.client,
      facture:           facture._id,
      commande:          facture.commande?._id || facture.commande || null,
      montant:           parseFloat(montant),
      modePaiement,
      type:              parseFloat(montant) >= restant ? "solde" : "avance",
      statut:            "paid",
      datePaiement:      new Date().toISOString().split("T")[0],
      banque,
      referenceBancaire: reference,
      note:              note || `Paiement facture ${facture.num}`,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}>
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex justify-between items-center px-8 py-5 border-b border-slate-100 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <CreditCard size={18} className="text-emerald-600" />
            </div>
            <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
              Enregistrer un paiement — {facture.num}
            </h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 hover:rotate-90 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Résumé facture */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-500">Client</span>
              <span className="font-medium">
                {facture.client ? `${facture.client.prenom} ${facture.client.nom}` : facture.clientNom}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-500">Total facture</span>
              <span className="font-mono font-bold">{fmt(facture.montantTTC)} MAD</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-500">Déjà payé</span>
              <span className="font-mono text-emerald-600">{fmt(facture.montantPaye)} MAD</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-slate-200 pt-2 mt-2">
              <span>Restant à payer</span>
              <span className="font-mono text-red-500">{fmt(restant)} MAD</span>
            </div>
          </div>

          {/* Montant */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Montant encaissé (MAD) *
            </label>
            <div className="flex gap-2">
              <input type="number" min={0} max={restant}
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-bold focus:ring-2 focus:ring-emerald-400 outline-none"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                placeholder="0" />
              <button onClick={() => setMontant(String(restant))}
                className="px-3 py-2 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition">
                Tout
              </button>
            </div>
          </div>

          {/* Mode paiement */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Mode *</label>
            <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={modePaiement} onChange={(e) => setMode(e.target.value)}>
              <option value="espece">💵 Espèce</option>
              <option value="virement">🏦 Virement</option>
              <option value="cheque">📄 Chèque</option>
              <option value="carte">💳 Carte</option>
              <option value="mobile">📱 Mobile</option>
            </select>
          </div>

          {/* Infos bancaires si virement/chèque */}
          {(modePaiement === "virement" || modePaiement === "cheque") && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Banque</label>
                <input type="text" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={banque} onChange={(e) => setBanque(e.target.value)} placeholder="Attijariwafa..." />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Référence</label>
                <input type="text" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={reference} onChange={(e) => setReference(e.target.value)} />
              </div>
            </div>
          )}

          {/* Note */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Note</label>
            <input type="text" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={note} onChange={(e) => setNote(e.target.value)}
              placeholder={`Paiement facture ${facture.num}`} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 flex justify-end gap-3 z-10 bg-white/95 backdrop-blur-md rounded-b-[2rem]">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all">
            Annuler
          </button>
          <button onClick={handleSave}
            className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center gap-2">
            <CreditCard size={14} /> Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacturePayerModal;