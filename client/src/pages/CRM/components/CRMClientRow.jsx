// src/pages/CRM/components/CRMClientRow.jsx
import React from "react";
import { Phone, Mail, Eye, Edit, MessageSquare } from "lucide-react";
import StatusBadge from "./StatusBadge";
import SegmentBadge from "./SegmentBadge";
import ClientScore from "./ClientScore";

const CRMClientRow = ({ client, onView, onEdit, onAddInteraction }) => {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/70 cursor-pointer transition-colors group" onClick={() => onView(client)}>
      {/* Client */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
            {client.prenom?.charAt(0)}{client.nom?.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-slate-800">{client.prenom} {client.nom}</div>
            <div className="text-xs text-slate-400">ID: {client.id}</div>
          </div>
        </div>
      </td>

      {/* Contact */}
      <td className="px-4 py-3.5">
        <div className="space-y-1">
          {client.tel && (
            <div className="flex items-center gap-1.5 text-slate-600">
              <Phone size={12} className="text-slate-400" />
              <span className="text-xs">{client.tel}</span>
            </div>
          )}
          {client.email && (
            <div className="flex items-center gap-1.5 text-slate-600">
              <Mail size={12} className="text-slate-400" />
              <span className="text-xs truncate max-w-[150px]">{client.email}</span>
            </div>
          )}
        </div>
      </td>

      {/* Segment */}
      <td className="px-4 py-3.5"><SegmentBadge segment={client.segment} /></td>

      {/* Score */}
      <td className="px-4 py-3.5"><ClientScore score={client.score} /></td>

      {/* Commandes */}
      <td className="px-4 py-3.5 text-slate-700">{client.totalCommandes}</td>

      {/* Dépense */}
      <td className="px-4 py-3.5 font-semibold text-emerald-700">{client.totalDepense?.toLocaleString()} MAD</td>

      {/* Dernier contact */}
      <td className="px-4 py-3.5 text-slate-500 text-xs">{client.dateDernierContact}</td>

      {/* Statut */}
      <td className="px-4 py-3.5"><StatusBadge status={client.statut} /></td>

      {/* Actions */}
      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1.5">
          <button onClick={() => onView(client)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100" title="Voir">
            <Eye size={14} />
          </button>
          <button onClick={() => onEdit(client)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100" title="Modifier">
            <Edit size={14} />
          </button>
          <button onClick={() => onAddInteraction(client)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100" title="Interaction">
            <MessageSquare size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CRMClientRow;