import React from "react";
import { Eye, Edit, Trash2, CheckCircle, Receipt } from "lucide-react";

const fmt = (n) => (n || 0).toLocaleString("fr-FR");

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "—";

const STATUT_CONFIG = {
  paid:      { label: "Payé",        cls: "bg-emerald-100 text-emerald-700" },
  pending:   { label: "En attente",  cls: "bg-amber-100 text-amber-700" },
  cancelled: { label: "Annulé",      cls: "bg-red-100 text-red-600" },
  refunded:  { label: "Remboursé",   cls: "bg-blue-100 text-blue-700" },
};

const MODE_CONFIG = {
  espece:   { label: "💵 Espèce",    cls: "bg-emerald-50 text-emerald-700" },
  virement: { label: "🏦 Virement",  cls: "bg-blue-50 text-blue-700" },
  cheque:   { label: "📄 Chèque",    cls: "bg-purple-50 text-purple-700" },
  carte:    { label: "💳 Carte",     cls: "bg-slate-100 text-slate-700" },
  mobile:   { label: "📱 Mobile",    cls: "bg-orange-50 text-orange-700" },
};

const TYPE_CONFIG = {
  avance:        { label: "Avance",        cls: "bg-blue-50 text-blue-600" },
  solde:         { label: "Solde",         cls: "bg-emerald-50 text-emerald-600" },
  caution:       { label: "Caution",       cls: "bg-amber-50 text-amber-600" },
  remboursement: { label: "Remboursement", cls: "bg-red-50 text-red-600" },
};

const Badge = ({ config, value }) => {
  const c = config[value] || { label: value, cls: "bg-slate-100 text-slate-500" };
  return <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${c.cls}`}>{c.label}</span>;
};

const PaiementTable = ({ paiements, onView, onEdit, onDelete, onConfirmer, onRecu }) => {
  if (paiements.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="text-3xl mb-2">💳</div>
        <div className="text-slate-400 text-sm">Aucun paiement trouvé</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/80">
            {["Référence", "Client", "Commande", "Date", "Montant", "Mode", "Type", "Statut", "Actions"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {paiements.map((p) => {
            const clientNom = p.client
              ? typeof p.client === "object" ? `${p.client.prenom} ${p.client.nom}` : p.client
              : "—";
            const cmdRef = p.commande
              ? typeof p.commande === "object" ? p.commande.reference : p.commande
              : "—";

            return (
              <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">{p.reference}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">
                      {clientNom.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-slate-800 font-medium text-xs">{clientNom}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{cmdRef}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{fmtDate(p.datePaiement)}</td>
                <td className="px-4 py-3 font-mono font-bold text-emerald-700">{fmt(p.montant)} MAD</td>
                <td className="px-4 py-3"><Badge config={MODE_CONFIG} value={p.modePaiement} /></td>
                <td className="px-4 py-3"><Badge config={TYPE_CONFIG} value={p.type} /></td>
                <td className="px-4 py-3"><Badge config={STATUT_CONFIG} value={p.statut} /></td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => onView(p)} title="Voir détails"
                      className="p-1.5 rounded-lg bg-blue-50 text-blue-400 hover:bg-blue-100 hover:text-blue-600 transition-all">
                      <Eye size={13} />
                    </button>
                    <button onClick={() => onEdit(p)} title="Modifier"
                      className="p-1.5 rounded-lg bg-amber-50 text-amber-400 hover:bg-amber-100 hover:text-amber-600 transition-all">
                      <Edit size={13} />
                    </button>
                    <button onClick={() => onRecu(p)} title="Reçu"
                      className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all">
                      <Receipt size={13} />
                    </button>
                    {p.statut === "pending" && (
                      <button onClick={() => onConfirmer(p._id)} title="Confirmer"
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-400 hover:bg-emerald-100 hover:text-emerald-600 transition-all">
                        <CheckCircle size={13} />
                      </button>
                    )}
                    <button onClick={() => onDelete(p._id)} title="Supprimer"
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 transition-all">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PaiementTable;