// src/pages/Commandes/components/CommandeTable.jsx
import React from "react";
import StatusBadge from "./StatusBadge";
import CommandeActions from "./CommandeActions";

const CommandeTable = ({ commandes, onRowClick, onReconduire, onDevis, onEdit, onReceipt, onStatusChange, onDelete }) => {
  if (commandes.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="text-3xl mb-2">📋</div>
        <div className="text-slate-400 text-sm">Aucune commande trouvée</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/80">
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Référence</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Client</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Équipement</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">N° Série</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Dates</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Statut</th>
            <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Montant</th>
            <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Caution</th>
            <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {commandes.map((cmd) => (
            <tr key={cmd.id} className="hover:bg-slate-50/70 cursor-pointer transition-colors group" onClick={() => onRowClick(cmd)}>
              <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">{cmd.ref}</td>
              <td className="px-4 py-3 font-medium text-slate-800">{cmd.client}</td>
              <td className="px-4 py-3 text-slate-600">{cmd.equipement}</td>
              <td className="px-4 py-3 font-mono text-xs text-purple-600">{cmd.unitSerial || "—"}</td>
              <td className="px-4 py-3 text-xs text-slate-500">{cmd.start} → {cmd.end}</td>
              <td className="px-4 py-3"><StatusBadge status={cmd.status} /></td>
              <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700">{(cmd.amountTTC || 0).toLocaleString()} MAD</td>
              <td className="px-4 py-3 text-right font-mono text-sm text-amber-600">{cmd.caution && cmd.caution !== 0 ? cmd.caution.toLocaleString() + " MAD" : "—"}</td>
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <CommandeActions
                  commande={cmd}
                  onReconduire={onReconduire}
                  onDevis={onDevis}
                  onEdit={onEdit}
                  onReceipt={onReceipt}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommandeTable;