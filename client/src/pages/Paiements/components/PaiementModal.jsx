import React from "react";
import { X } from "lucide-react";

const PaiementModal = ({ isOpen, onClose, editMode, formData, setFormData, clients, commandes, factures = [], onSave }) => {
  if (!isOpen) return null;

  // Factures filtrées par client sélectionné
  const clientFactures = factures.filter(f => {
    if (!formData.client) return true;
    const fClientId = f.client?._id || f.client;
    return String(fClientId) === String(formData.client);
  });

  // Commandes filtrées par client sélectionné
  const clientCommandes = commandes.filter(c => {
    if (!formData.client) return true;
    const cClientId = c.client?._id || c.client;
    return String(cClientId) === String(formData.client);
  });

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 px-5 py-3 flex justify-between items-center">
          <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
            {editMode ? "Modifier le paiement" : "Nouveau paiement"}
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Client */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Client *</label>
            <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.client || ""}
              onChange={(e) => setFormData(p => ({ ...p, client: e.target.value, commande: "", facture: "" }))}>
              <option value="">Sélectionner un client</option>
              {clients.map(c => (
                <option key={c._id} value={c._id}>{c.prenom} {c.nom}</option>
              ))}
            </select>
          </div>

          {/* Facture liée */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Facture liée <span className="text-slate-300 normal-case font-normal">(recommandé pour sync automatique)</span>
            </label>
            <select className="w-full border border-emerald-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none bg-emerald-50/30"
              value={formData.facture || ""}
              onChange={(e) => setFormData(p => ({ ...p, facture: e.target.value }))}>
              <option value="">— Sans facture —</option>
              {clientFactures.map(f => (
                <option key={f._id} value={f._id}>
                  {f.num} — {(f.montantRestant || f.montantTTC || 0).toLocaleString()} MAD restant
                </option>
              ))}
            </select>
            <p className="text-[10px] text-emerald-600 mt-1">
              💡 Si vous liez une facture, le montant payé sera automatiquement mis à jour
            </p>
          </div>

          {/* Commande liée */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Commande liée <span className="text-slate-300 normal-case font-normal">(optionnel)</span>
            </label>
            <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.commande || ""}
              onChange={(e) => setFormData(p => ({ ...p, commande: e.target.value }))}>
              <option value="">— Sans commande —</option>
              {clientCommandes.map(c => (
                <option key={c._id} value={c._id}>
                  {c.reference} — {(c.montantTTC || 0).toLocaleString()} MAD
                </option>
              ))}
            </select>
          </div>

          {/* Montant */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Montant (MAD) *</label>
            <input type="number" min={0}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.montant || ""}
              onChange={(e) => setFormData(p => ({ ...p, montant: parseFloat(e.target.value) || 0 }))}
              placeholder="0" />
          </div>

          {/* Mode + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Mode *</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.modePaiement || "espece"}
                onChange={(e) => setFormData(p => ({ ...p, modePaiement: e.target.value }))}>
                <option value="espece">💵 Espèce</option>
                <option value="virement">🏦 Virement</option>
                <option value="cheque">📄 Chèque</option>
                <option value="carte">💳 Carte</option>
                <option value="mobile">📱 Mobile</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Type</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.type || "solde"}
                onChange={(e) => setFormData(p => ({ ...p, type: e.target.value }))}>
                <option value="avance">Avance</option>
                <option value="solde">Solde</option>
                <option value="caution">Caution</option>
                <option value="remboursement">Remboursement</option>
              </select>
            </div>
          </div>

          {/* Statut + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Statut</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.statut || "pending"}
                onChange={(e) => setFormData(p => ({ ...p, statut: e.target.value }))}>
                <option value="pending">En attente</option>
                <option value="paid">Payé</option>
                <option value="cancelled">Annulé</option>
                <option value="refunded">Remboursé</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Date paiement</label>
              <input type="date"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.datePaiement ? formData.datePaiement.split("T")[0] : ""}
                onChange={(e) => setFormData(p => ({ ...p, datePaiement: e.target.value }))} />
            </div>
          </div>

          {/* Infos bancaires */}
          {(formData.modePaiement === "virement" || formData.modePaiement === "cheque") && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Infos bancaires</div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Banque</label>
                  <input type="text"
                    className="w-full border border-blue-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                    value={formData.banque || ""}
                    onChange={(e) => setFormData(p => ({ ...p, banque: e.target.value }))}
                    placeholder="Attijariwafa, BMCE..." />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Référence</label>
                  <input type="text"
                    className="w-full border border-blue-200 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-400 outline-none"
                    value={formData.referenceBancaire || ""}
                    onChange={(e) => setFormData(p => ({ ...p, referenceBancaire: e.target.value }))}
                    placeholder="N° chèque / virement" />
                </div>
              </div>
            </div>
          )}

          {/* Note */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widests text-slate-400 mb-1">Note</label>
            <textarea rows={2}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.note || ""}
              onChange={(e) => setFormData(p => ({ ...p, note: e.target.value }))}
              placeholder="Informations complémentaires..." />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
            Annuler
          </button>
          <button onClick={onSave} className="px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition">
            {editMode ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaiementModal;