import React from "react";
import { Eye, CheckCircle, Archive, Trash2, FileText } from "lucide-react";

const ContratsTable = ({ contrats, onView, onSign, onArchive, onDelete }) => {
  const getStatusBadge = (statut) => {
    switch (statut) {
      case "draft":
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Brouillon</span>;
      case "pending_signature":
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-[9px] font-black uppercase tracking-widest">En attente</span>;
      case "signed":
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[9px] font-black uppercase tracking-widest">Signé</span>;
      case "archived":
        return <span className="px-2.5 py-1 bg-slate-200 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">Archivé</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest">{statut}</span>;
    }
  };

  if (contrats.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText size={28} className="text-slate-300" />
        </div>
        <p className="text-slate-400 font-medium">Aucun contrat trouvé</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/80">
            <th className="text-left px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Référence</th>
            <th className="text-left px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Client</th>
            <th className="text-left px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Type</th>
            <th className="text-left px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Commande</th>
            <th className="text-left px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
            <th className="text-left px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Créé le</th>
            <th className="text-left px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Signé le</th>
            <th className="text-center px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {contrats.map((contrat) => (
            <tr key={contrat._id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => onView(contrat)}>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-slate-300" />
                  <span className="font-mono text-[11px] font-black text-blue-600 tracking-tight">{contrat.reference}</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="text-[13px] font-black text-slate-800">{contrat.clientNom}</div>
                <div className="text-[11px] font-medium text-slate-400">{contrat.clientTel}</div>
              </td>
              <td className="px-4 py-4">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest capitalize">{contrat.type}</span>
              </td>
              <td className="px-4 py-4">
                <div className="text-[11px] font-bold text-slate-600 font-mono">{contrat.commande?.reference || "—"}</div>
              </td>
              <td className="px-4 py-4">{getStatusBadge(contrat.statut)}</td>
              <td className="px-4 py-4 text-[11px] font-bold text-slate-500">
                {new Date(contrat.createdAt).toLocaleDateString("fr-FR")}
              </td>
              <td className="px-4 py-4 text-[11px] font-bold text-slate-500">
                {contrat.dateSignature ? new Date(contrat.dateSignature).toLocaleDateString("fr-FR") : "—"}
              </td>
              <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => onView(contrat)}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-400 hover:bg-blue-100 hover:text-blue-600 transition-all"
                    title="Voir le contrat"
                  >
                    <Eye size={13} />
                  </button>
                  {contrat.statut !== "signed" && (
                    <button
                      onClick={() => onSign(contrat)}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-700 transition-all"
                      title="Signer"
                    >
                      <CheckCircle size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => onArchive(contrat._id)}
                    className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                    title="Archiver"
                  >
                    <Archive size={13} />
                  </button>
                  {contrat.statut !== "signed" && (
                    <button
                      onClick={() => onDelete(contrat._id)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 transition-all"
                      title="Supprimer"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContratsTable;
