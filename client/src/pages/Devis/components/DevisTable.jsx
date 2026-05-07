import React from "react";
import { Edit, Trash2, Send, Check, X, ArrowRight, Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";

const fmtMad  = (n) => `${(n || 0).toLocaleString("fr-FR")} MAD`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "—";

const DevisTable = ({ devis, onView, onEdit, onSend, onAccept, onReject, onDelete, onConvert }) => {
  if (!devis || devis.length === 0) {
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
            {["Référence", "Client", "Objet", "Date", "Validité", "Montant TTC", "Statut", "Actions"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {devis.map((d) => {
            const clientNom = d.clientNom || (d.client ? `${d.client.prenom} ${d.client.nom}` : "—");
            const isExpired = d.dateValidite && new Date(d.dateValidite) < new Date() && d.status !== "converted";
            return (
              <tr key={d._id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">{d.reference}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{clientNom}</td>
                <td className="px-4 py-3 text-slate-500 text-xs max-w-[140px] truncate">{d.description || "—"}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">{fmtDate(d.date)}</td>
                <td className={`px-4 py-3 text-xs font-medium ${isExpired ? "text-red-500" : "text-slate-500"}`}>
                  {fmtDate(d.dateValidite)} {isExpired && "⚠️"}
                </td>
                <td className="px-4 py-3 font-mono font-bold text-slate-800">{fmtMad(d.montantTTC)}</td>
                <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    {/* Voir */}
                    <button onClick={() => onView(d)} title="Voir"
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition">
                      <Eye size={13} />
                    </button>
                    {!["converted"].includes(d.status) && (
                      <button onClick={() => onEdit(d)} title="Modifier"
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition">
                        <Edit size={13} />
                      </button>
                    )}
                    {d.status === "draft" && (
                      <button onClick={() => onSend(d)} title="Envoyer"
                        className="p-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition">
                        <Send size={13} />
                      </button>
                    )}
                    {d.status === "sent" && (
                      <>
                        <button onClick={() => onAccept(d)} title="Accepter"
                          className="p-1.5 rounded-lg border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition">
                          <Check size={13} />
                        </button>
                        <button onClick={() => onReject(d)} title="Refuser"
                          className="p-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition">
                          <X size={13} />
                        </button>
                      </>
                    )}
                    {d.status === "accepted" && (
                      <button onClick={() => onConvert(d)} title="Convertir en commande"
                        className="p-1.5 rounded-lg border border-purple-200 text-purple-600 hover:bg-purple-50 transition">
                        <ArrowRight size={13} />
                      </button>
                    )}
                    {!["accepted"].includes(d.status) && (
                      <button onClick={() => onDelete(d)} title="Supprimer"
                        className="p-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition">
                        <Trash2 size={13} />
                      </button>
                    )}
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