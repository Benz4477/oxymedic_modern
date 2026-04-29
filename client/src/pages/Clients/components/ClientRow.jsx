// src/pages/Clients/components/ClientRow.jsx
import React from "react";
import { Phone, Mail, MapPin, Eye, Edit, Trash2 } from "lucide-react";
import Avatar from "./Avatar";

const ClientRow = ({ client, onView, onEdit, onDelete }) => {
  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      {/* Client */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <Avatar prenom={client.prenom} nom={client.nom} />
          <div>
            <div className="font-semibold text-slate-900">
              {client.prenom} {client.nom}
            </div>
            <div className="text-xs text-slate-500">
              {client.dateInscription &&
                new Date(client.dateInscription).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
            </div>
          </div>
        </div>
      </td>

      {/* Contact */}
      <td className="px-4 py-3.5">
        <div className="space-y-1">
          {client.tel && (
            <div className="flex items-center gap-1.5 text-slate-700">
              <Phone size={13} className="text-slate-400" />
              <span className="text-xs">{client.tel}</span>
            </div>
          )}
          {client.email && (
            <div className="flex items-center gap-1.5 text-slate-700">
              <Mail size={13} className="text-slate-400" />
              <span className="text-xs truncate max-w-[150px]">
                {client.email}
              </span>
            </div>
          )}
        </div>
      </td>

      {/* Localisation */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5 text-slate-700">
          <MapPin size={13} className="text-slate-400" />
          <span className="text-xs">{client.quartier || "-"}</span>
        </div>
      </td>

      {/* CIN */}
      <td className="px-4 py-3.5">
        <span className="text-xs text-slate-600 font-mono">
          {client.cinNum || "-"}
        </span>
      </td>

      {/* Commandes */}
      <td className="px-4 py-3.5">
        {client.commandes > 0 ? (
          <div className="flex flex-col gap-1">
            {client.commandesList?.slice(0, 2).map((cmd, i) => (
              <div
                key={i}
                className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100"
              >
                {cmd.equipementNom || cmd.numero}
              </div>
            ))}
            {client.commandes > 2 && (
              <div className="text-xs text-slate-400">
                +{client.commandes - 2} autres
              </div>
            )}
          </div>
        ) : (
          <span className="text-slate-400 text-xs font-medium">
            Pas de commande
          </span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center justify-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(client);
            }}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
            title="Voir"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(client);
            }}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
            title="Modifier"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(client._id);
            }}
            className="p-1.5 rounded-lg border border-slate-200 text-red-500 hover:bg-red-50 hover:text-red-700 transition"
            title="Supprimer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ClientRow;