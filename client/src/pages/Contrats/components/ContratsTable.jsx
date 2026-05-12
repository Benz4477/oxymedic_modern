import React from "react";
import { Eye, CheckCircle, Archive, Trash2, FileText } from "lucide-react";

const ContratsTable = ({ contrats, onView, onSign, onArchive, onDelete }) => {
  const getStatusBadge = (statut) => {
    switch (statut) {
      case "draft":
        return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">Brouillon</span>;
      case "pending_signature":
        return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">En attente signature</span>;
      case "signed":
        return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">Signé</span>;
      case "archived":
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">Archivé</span>;
      default:
        return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">{statut}</span>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Référence</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Client</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Commande</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Statut</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date création</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date signature</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {contrats.map((contrat) => (
            <tr key={contrat._id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-slate-400" />
                  <span className="font-mono font-semibold text-slate-900">{contrat.reference}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-slate-900">{contrat.clientNom}</div>
                <div className="text-xs text-slate-500">{contrat.clientTel}</div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium capitalize">{contrat.type}</span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-slate-900">{contrat.commande?.reference || "—"}</div>
              </td>
              <td className="px-6 py-4">{getStatusBadge(contrat.statut)}</td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {new Date(contrat.createdAt).toLocaleDateString("fr-FR")}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {contrat.dateSignature ? new Date(contrat.dateSignature).toLocaleDateString("fr-FR") : "—"}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onView(contrat)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Voir le contrat"
                  >
                    <Eye size={16} className="text-slate-600" />
                  </button>
                  {contrat.statut !== "signed" && (
                    <button
                      onClick={() => onSign(contrat)}
                      className="p-2 hover:bg-emerald-100 rounded-lg transition-colors"
                      title="Signer le contrat"
                    >
                      <CheckCircle size={16} className="text-emerald-600" />
                    </button>
                  )}
                  <button
                    onClick={() => onArchive(contrat._id)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Archiver"
                  >
                    <Archive size={16} className="text-slate-600" />
                  </button>
                  {contrat.statut !== "signed" && (
                    <button
                      onClick={() => onDelete(contrat._id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {contrats.length === 0 && (
        <div className="text-center py-12">
          <FileText size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Aucun contrat trouvé</p>
        </div>
      )}
    </div>
  );
};

export default ContratsTable;
