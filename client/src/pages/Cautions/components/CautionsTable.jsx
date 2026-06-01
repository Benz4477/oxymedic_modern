import React from "react";
import { Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";

const statusLabels = {
  deposee: { label: "Déposée", color: "bg-blue-100 text-blue-700" },
  remboursee: { label: "Remboursée", color: "bg-green-100 text-green-700" },
  deduite: { label: "Déduite", color: "bg-red-100 text-red-700" },
};

const CautionsTable = ({
  cautions,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onRembourser,
  onDeduire,
}) => {
  if (isLoading) return <div className="text-center py-10">Chargement...</div>;

  if (cautions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 text-center py-10">
        <p className="text-slate-500">Aucune caution trouvée</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Référence</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Client</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Équipement</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Note</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Montant</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Mode</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Statut</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {cautions.map((caution) => (
            <tr key={caution._id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm text-slate-900 font-mono">
                {caution.reference || caution._id.slice(-6)}
              </td>
              <td className="px-6 py-4 text-sm text-slate-900">
                {caution.client?.prenom} {caution.client?.nom}
              </td>
              <td className="px-6 py-4 text-sm text-slate-900">
                {caution.equipement?.name}
              </td>
              <td className="px-6 py-4 text-sm text-slate-900 break-words max-w-xs">
                {caution.note || '—'}
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                {(caution.amount ?? 0).toLocaleString()} MAD
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {caution.mode === 'Cash'
                  ? 'Espèces'
                  : caution.mode === 'Chèque'
                  ? 'Chèque'
                  : caution.mode === 'Virement'
                  ? 'Virement'
                  : caution.mode}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusLabels[caution.statut]?.color}`}>
                  {statusLabels[caution.statut]?.label}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onView(caution)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
                    title="Voir"
                  >
                    <Eye size={13} />
                  </button>
                  <button
                    onClick={() => onEdit(caution)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
                    title="Modifier"
                  >
                    <Edit size={13} />
                  </button>
                  {caution.statut === "deposee" && (
                    <>
                      <button
                        onClick={() => onRembourser(caution._id)}
                        className="p-1.5 rounded-lg border border-green-100 text-green-500 hover:bg-green-50 transition"
                        title="Rembourser"
                      >
                        <CheckCircle size={13} />
                      </button>
                      <button
                        onClick={() => onDeduire(caution._id)}
                        className="p-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition"
                        title="Déduire"
                      >
                        <XCircle size={13} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => onDelete(caution._id)}
                    className="p-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition"
                    title="Supprimer"
                  >
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

export default CautionsTable;