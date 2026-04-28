// src/pages/Devis/components/DevisTable.jsx
import React from "react";
import { Eye, Edit, Send, CheckCircle, Printer, Copy, Trash2, Calendar } from "lucide-react";
import StatusBadge from "./StatusBadge";

const DevisTable = ({ devis, onView, onEdit, onSend, onConvert, onPrint, onDuplicate, onDelete }) => {
  const getDaysLeft = (dateValidite) => {
    if (!dateValidite) return null;
    const parts = dateValidite.split("/");
    const validite = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    const today = new Date();
    const diff = Math.ceil((validite - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (devis.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="text-3xl mb-2">📄</div>
        <div className="text-slate-400 text-sm">Aucun devis trouvé</div>
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
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Date création</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Validité</th>
            <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Montant</th>
            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Statut</th>
            <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {devis.map((d) => {
            const daysLeft = getDaysLeft(d.dateValidite);
            const isExpired = daysLeft !== null && daysLeft < 0;
            return (
              <tr key={d.id} className="hover:bg-slate-50/70 cursor-pointer transition-colors group" onClick={() => onView(d)}>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">{d.reference}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{d.client}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{d.dateCreation}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} className="text-slate-400" />
                    <span className="text-xs text-slate-600">{d.dateValidite}</span>
                    {!isExpired && daysLeft !== null && daysLeft <= 7 && daysLeft > 0 && (
                      <span className="text-[9px] text-amber-600 font-bold ml-1">({daysLeft}j)</span>
                    )}
                    {isExpired && <span className="text-[9px] text-red-500 font-bold ml-1">Expiré</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700">{d.montant.toLocaleString()} MAD</td>
                <td className="px-4 py-3"><StatusBadge status={d.statut} expired={isExpired} /></td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-1.5">
                    <button onClick={() => onView(d)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100" title="Voir"><Eye size={14} /></button>
                    <button onClick={() => onEdit(d)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100" title="Modifier"><Edit size={14} /></button>
                    <button onClick={() => onPrint(d)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100" title="Imprimer"><Printer size={14} /></button>
                    <button onClick={() => onDuplicate(d)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100" title="Dupliquer"><Copy size={14} /></button>
                    {d.statut === "draft" && (
                      <button onClick={() => onSend(d)} className="p-1.5 rounded-lg border border-amber-200 text-amber-600 hover:bg-amber-50" title="Envoyer"><Send size={14} /></button>
                    )}
                    {(d.statut === "sent" || d.statut === "accepted") && (
                      <button onClick={() => onConvert(d)} className="p-1.5 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50" title="Convertir en commande"><CheckCircle size={14} /></button>
                    )}
                    <button onClick={() => onDelete(d.id)} className="p-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50" title="Supprimer"><Trash2 size={14} /></button>
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

export default DevisTable;