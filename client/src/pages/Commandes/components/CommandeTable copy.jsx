import React from "react";
import StatusBadge from "./StatusBadge";
import CommandeActions from "./CommandeActions";

const fmt = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
};

const CommandeTable = ({
  commandes, onReconduire,
  onEdit, onReceipt, onStatusChange, onDelete,
  onBonEnlevement, onBonRetour,
}) => {
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
            <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Bons</th>
            <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {commandes.map((cmd) => {
            const clientNom = cmd.client
              ? typeof cmd.client === "object"
                ? `${cmd.client.prenom} ${cmd.client.nom}`
                : cmd.client
              : "—";

            const equipNom = cmd.equipement
              ? typeof cmd.equipement === "object"
                ? `${cmd.equipement.icon || ""} ${cmd.equipement.name}`
                : cmd.equipement
              : "—";

            const unitSerial = cmd.unite
              ? typeof cmd.unite === "object"
                ? cmd.unite.serial
                : cmd.unite
              : "—";

            const canEnlevement = cmd.statut === "pending" || cmd.statut === "active";
            const canRetour     = cmd.statut === "active"  || cmd.statut === "ended";

            return (
              <tr
                key={cmd._id}
                className="hover:bg-slate-50/70 cursor-pointer transition-colors group"
                onClick={() => onEdit(cmd)}
              >
                <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">
                  {cmd.reference || "—"}
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">{clientNom}</td>
                <td className="px-4 py-3 text-slate-600">{equipNom}</td>
                <td className="px-4 py-3 font-mono text-xs text-purple-600">{unitSerial}</td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {fmt(cmd.dateDebut)} → {fmt(cmd.dateFin)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={cmd.statut} />
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700">
                  {(cmd.montantTTC || 0).toLocaleString()} MAD
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm text-amber-600">
                  {cmd.montantCaution ? `${cmd.montantCaution.toLocaleString()} MAD` : "—"}
                </td>

                {/* ── Bons d'enlèvement / retour ── */}
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => onBonEnlevement?.(cmd)}
                      disabled={!canEnlevement}
                      title={canEnlevement ? "Bon d'enlèvement" : "Non disponible pour ce statut"}
                      className={`px-2 py-1 rounded-md text-xs font-semibold border transition-all
                        ${canEnlevement
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                          : "border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed"
                        }`}
                    >
                      📦
                    </button>
                    <button
                      onClick={() => onBonRetour?.(cmd)}
                      disabled={!canRetour}
                      title={canRetour ? "Bon de retour" : "Non disponible pour ce statut"}
                      className={`px-2 py-1 rounded-md text-xs font-semibold border transition-all
                        ${canRetour
                          ? "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                          : "border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed"
                        }`}
                    >
                      🔄
                    </button>
                  </div>
                </td>

                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <CommandeActions
                    commande={cmd}
                    onReconduire={onReconduire}
                    onEdit={onEdit}
                    onReceipt={onReceipt}
                    onStatusChange={onStatusChange}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CommandeTable;