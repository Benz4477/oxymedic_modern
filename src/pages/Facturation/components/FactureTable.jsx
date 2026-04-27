// src/pages/Facturation/components/FactureTable.jsx
import React from "react";
import { Eye, Edit, FileText, CreditCard, Trash2, Calendar } from "lucide-react";
import StatusBadge from "./StatusBadge";

const FactureTable = ({ factures, onView, onEdit, onDelete, onDownload }) => {
  if (!factures || !Array.isArray(factures) || factures.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="text-3xl mb-2">🧾</div>
        <div className="text-slate-400 text-sm">Aucune facture trouvée</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/80">
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Référence</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Type</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Client</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</th>
            <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Montant</th>
            <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Payé/Restant</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Statut</th>
            <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {factures.map((f) => (
            <tr key={f.id} className="hover:bg-slate-50/70 cursor-pointer transition-colors group" onClick={() => onView(f)}>
              <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">{f.num}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${f.type === "facture" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                  {f.type === "facture" ? "Facture" : f.type === "proforma" ? "Proforma" : f.type}
                </span>
              </td>
              <td className="px-4 py-3 font-medium text-slate-800">{f.clientNom}</td>
              <td className="px-4 py-3 text-slate-500 text-xs">{f.date}</td>
              <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">{f.montantTTC?.toLocaleString() || 0} €</td>
              <td className="px-4 py-3 text-right">
                <div className="text-emerald-600 text-xs font-medium">{f.montantPaye?.toLocaleString() || 0} €</div>
                {f.montantRestant > 0 && <div className="text-red-500 text-xs">{f.montantRestant?.toLocaleString() || 0} € restant</div>}
              </td>
              <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-center gap-1.5">
                  <button onClick={() => onView(f)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100" title="Voir"><Eye size={14} /></button>
                  <button onClick={() => onEdit(f)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100" title="Modifier"><Edit size={14} /></button>
                  <button onClick={() => onDownload(f)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100" title="Télécharger"><FileText size={14} /></button>
                  <button onClick={() => onDelete(f.id)} className="p-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50" title="Supprimer"><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FactureTable;