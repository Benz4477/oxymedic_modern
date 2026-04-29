import React from "react";

const ClientHeader = ({ total, onExport, onAdd }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
        <p className="text-slate-600 mt-1">{total} client(s) au total</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onExport}
          className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Exporter
        </button>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Ajouter un client
        </button>
      </div>
    </div>
  );
};

export default ClientHeader;