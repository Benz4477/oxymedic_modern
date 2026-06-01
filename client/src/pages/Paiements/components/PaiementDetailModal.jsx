import React from "react";
import { X, CreditCard, User, FileText, Calendar, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react";

const fmt = (n) => (n || 0).toLocaleString("fr-FR");
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—";

const STATUT = {
  paid:      { label: "Payé",        icon: CheckCircle, cls: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  pending:   { label: "En attente",  icon: Clock,       cls: "text-amber-600 bg-amber-50 border-amber-200" },
  cancelled: { label: "Annulé",      icon: XCircle,     cls: "text-red-600 bg-red-50 border-red-200" },
  refunded:  { label: "Remboursé",   icon: RefreshCw,   cls: "text-blue-600 bg-blue-50 border-blue-200" },
};

const MODE_LABELS = {
  espece:   "💵 Espèce",
  virement: "🏦 Virement bancaire",
  cheque:   "📄 Chèque",
  carte:    "💳 Carte bancaire",
  mobile:   "📱 Paiement mobile",
};

const TYPE_LABELS = {
  avance:        "Avance",
  solde:         "Solde",
  caution:       "Caution",
  remboursement: "Remboursement",
};

const Row = ({ label, value, mono = false }) => (
  <div className="flex justify-between items-start py-2.5 border-b border-slate-50 last:border-0">
    <span className="text-xs text-slate-400 font-medium">{label}</span>
    <span className={`text-xs font-semibold text-slate-800 text-right max-w-[60%] ${mono ? "font-mono" : ""}`}>
      {value || "—"}
    </span>
  </div>
);

const PaiementDetailModal = ({ isOpen, onClose, paiement }) => {
  if (!isOpen || !paiement) return null;

  const clientNom = paiement.client
    ? typeof paiement.client === "object"
      ? `${paiement.client.prenom} ${paiement.client.nom}`
      : paiement.client
    : "—";

  const clientEmail = paiement.client?.email || "—";
  const clientTel = paiement.client?.tel || "—";

  const cmdRef = paiement.commande
    ? typeof paiement.commande === "object"
      ? paiement.commande.reference
      : paiement.commande
    : null;

  const cmdMontant = paiement.commande?.montantTTC;

  const statut = STATUT[paiement.statut] || { label: paiement.statut, icon: Clock, cls: "text-slate-600 bg-slate-50 border-slate-200" };
  const StatutIcon = statut.icon;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}>
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <CreditCard size={18} className="text-emerald-600" />
            </div>
            <h3 className="text-lg font-extrabold tracking-tight text-slate-900">Détail paiement</h3>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 hover:rotate-90 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">

          {/* Référence + Statut */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Référence</div>
              <div className="text-lg font-extrabold font-mono text-blue-600">{paiement.reference}</div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${statut.cls}`}>
              <StatutIcon size={12} />
              {statut.label}
            </div>
          </div>

          {/* Montant principal */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Montant</div>
            <div className="text-3xl font-extrabold font-mono text-emerald-700">{fmt(paiement.montant)} MAD</div>
            <div className="text-xs text-emerald-600 mt-1">{TYPE_LABELS[paiement.type] || paiement.type}</div>
          </div>

          {/* Infos client */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              <User size={11} /> Client
            </div>
            <Row label="Nom"       value={clientNom} />
            <Row label="Téléphone" value={clientTel} mono />
          </div>

          {/* Infos commande */}
          {cmdRef && (
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                <FileText size={11} /> Commande liée
              </div>
              <Row label="Référence" value={cmdRef} mono />
              {cmdMontant && <Row label="Montant commande" value={`${fmt(cmdMontant)} MAD`} />}
            </div>
          )}

          {/* Détails paiement */}
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
              <CreditCard size={11} /> Détails
            </div>
            <Row label="Mode"         value={MODE_LABELS[paiement.modePaiement] || paiement.modePaiement} />
            <Row label="Type"         value={TYPE_LABELS[paiement.type] || paiement.type} />
            <Row label="Date paiement" value={fmtDate(paiement.datePaiement)} />
            <Row label="Enregistré le" value={fmtDate(paiement.createdAt)} />
          </div>

          {/* Infos bancaires */}
          {(paiement.banque || paiement.referenceBancaire) && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-3">Infos bancaires</div>
              {paiement.banque             && <Row label="Banque"    value={paiement.banque} />}
              {paiement.referenceBancaire  && <Row label="Référence" value={paiement.referenceBancaire} mono />}
            </div>
          )}

          {/* Note */}
          {paiement.note && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2">Note</div>
              <p className="text-sm text-slate-700">{paiement.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaiementDetailModal;