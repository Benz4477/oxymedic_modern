// src/pages/CRM/components/CRMHeader.jsx
import React from "react";
import { Plus } from "lucide-react";

const CRMHeader = ({ total, actifs, premium, onAddClient, onAddInteraction }) => {
  return (
    <div className="flex flex-wrap justify-between items-start gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">CRM - Relation Client</h1>
        <p className="text-sm text-slate-400 mt-0.5">Suivi des interactions, tâches et opportunités commerciales de vos clients</p>
        <p className="text-sm text-slate-400 mt-0.5">
          {total} clients • {actifs} actifs • {premium} premium
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onAddClient}
          className="flex items-center gap-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-100 hover:text-white active:scale-95 text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all"
        >
          <Plus size={16} /> Nouveau client
        </button>
        <button
          onClick={onAddInteraction}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all"
        >
          <Plus size={16} /> Interaction
        </button>
      </div>
    </div>
  );
};

export default CRMHeader;