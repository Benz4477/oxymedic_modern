import React from "react";
import { Users, FileDown, Plus } from "lucide-react";

const ClientHeader = ({ total, onExport, onAdd }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1">
      <div className="flex items-center gap-3 md:gap-4 font-display">
        <div className="p-3 bg-amber-500 rounded-xl shadow-xl shadow-amber-500/10 text-white">
          <Users size={22} />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-950 tracking-tight">Clients</h1>
          <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {total} dossiers clients actifs
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <button
          onClick={onExport}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-slate-600 border border-slate-200/60 rounded-xl hover:bg-slate-50 transition shadow-sm font-bold text-[9px] uppercase tracking-widest"
        >
          <FileDown size={12} /> Exporter
        </button>
        <button
          onClick={onAdd}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition shadow-md shadow-amber-500/10 font-bold text-[9px] uppercase tracking-widest whitespace-nowrap"
        >
          <Plus size={12} /> Nouveau Client
        </button>
      </div>
    </div>
  );
};

export default ClientHeader;