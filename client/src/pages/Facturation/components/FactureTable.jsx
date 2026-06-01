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
            <th className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-slate-400">Référence</th>
            <th className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-slate-400">Type</th>
            <th className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-slate-400">Client</th>
            <th className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-slate-400">Date</th>
            <th className="px-4 py-3 text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Montant</th>
            <th className="px-4 py-3 text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Payé/Restant</th>
            <th className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-widest text-slate-400">Statut</th>
            <th className="px-4 py-3 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {factures.map((f) => (
            <tr key={f.id} className="hover:bg-slate-50/80 cursor-pointer transition-colors group" onClick={() => onView(f)}>
              <td className="px-4 py-4 font-mono text-[11px] font-black text-blue-600 tracking-tight">{f.num}</td>
              <td className="px-4 py-4">
                <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${f.type === "facture" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                  {f.type === "facture" ? "Facture" : f.type === "proforma" ? "Proforma" : f.type}
                </span>
              </td>
              <td className="px-4 py-4 text-[13px] font-black text-slate-800">{f.clientNom}</td>
              <td className="px-4 py-4 text-[11px] font-bold text-slate-500">{f.date}</td>
              <td className="px-4 py-4 text-right">
                <div className="text-[14px] font-black text-slate-800 tracking-tight">
                  {f.montantTTC?.toLocaleString() || 0} <span className="text-[10px] opacity-60">MAD</span>
                </div>
              </td>
              <td className="px-4 py-4 text-right">
                <div className="text-[12px] font-black text-emerald-600">{f.montantPaye?.toLocaleString() || 0} <span className="text-[9px] opacity-60">MAD</span></div>
                {f.montantRestant > 0 && <div className="text-[11px] font-bold text-red-500">{f.montantRestant?.toLocaleString() || 0} MAD rest.</div>}
              </td>
              <td className="px-4 py-4"><StatusBadge status={f.status} /></td>
              <td className="px-4 py-4 align-middle" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-center gap-1.5">
                  <button onClick={() => onView(f)} className="p-1.5 rounded-lg bg-blue-50 text-blue-400 hover:bg-blue-100 hover:text-blue-600 transition-all" title="Voir">
                    <Eye size={13} />
                  </button>
                  <button onClick={() => onEdit(f)} className="p-1.5 rounded-lg bg-amber-50 text-amber-400 hover:bg-amber-100 hover:text-amber-600 transition-all" title="Modifier">
                    <Edit size={13} />
                  </button>
                  <button onClick={() => onDelete(f.id)} className="p-1.5 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 transition-all" title="Supprimer">
                    <Trash2 size={13} />
                  </button>
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