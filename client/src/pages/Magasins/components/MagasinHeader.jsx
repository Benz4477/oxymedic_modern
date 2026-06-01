import React from "react";
import { Plus, MapPin } from "lucide-react";

const MagasinHeader = ({ onAdd, count }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-100">
          <MapPin size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestion des Magasins</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
            {count} Agence{count > 1 ? "s" : ""} Active{count > 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 font-black text-xs uppercase tracking-widest"
      >
        <Plus size={18} /> Nouveau Magasin
      </button>
    </div>
  );
};

export default MagasinHeader;
