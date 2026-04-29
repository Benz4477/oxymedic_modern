// src/pages/Clients/components/ClientTable.jsx
import React from "react";
import ClientRow from "./ClientRow";

const ClientTable = ({ clients, onView, onEdit, onDelete }) => {
  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">👥</div>
        <p className="text-slate-400">Aucun client trouvé</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              {[
                { label: "Client", cls: "text-left" },
                { label: "Contact", cls: "text-left" },
                { label: "Localisation", cls: "text-left" },
                { label: "CIN", cls: "text-left" },
                { label: "Commandes", cls: "text-center" },
                { label: "Actions", cls: "text-center" },
              ].map((col) => (
                <th
                  key={col.label}
                  className={`px-4 py-3 ${col.cls} text-[10px] font-bold uppercase tracking-widest text-slate-400`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <ClientRow
                key={client._id}
                client={client}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientTable;