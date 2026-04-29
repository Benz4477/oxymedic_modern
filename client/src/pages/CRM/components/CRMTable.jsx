// src/pages/CRM/components/CRMTable.jsx
import React from "react";
import CRMClientRow from "./CRMClientRow";

const CRMTable = ({ clients, onView, onEdit, onAddInteraction }) => {
  if (clients.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="text-3xl mb-2">👥</div>
        <div className="text-slate-400 text-sm">Aucun client trouvé</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              {[
                "Client", "Contact", "Segment", "Score", "Commandes", "Dépense", "Dernier contact", "Statut", "Actions"
              ].map((label) => (
                <th key={label} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {clients.map((client) => (
              <CRMClientRow
                key={client.id}
                client={client}
                onView={onView}
                onEdit={onEdit}
                onAddInteraction={onAddInteraction}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CRMTable;