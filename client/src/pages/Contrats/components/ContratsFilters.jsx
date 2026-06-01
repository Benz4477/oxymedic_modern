import React from "react";
import { Search } from "lucide-react";

const ContratsFilters = ({ search, setSearch, statusFilter, setStatusFilter }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <div className="flex gap-3 items-center flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Rechercher par référence, client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer min-w-[160px]"
        >
          <option value="">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="pending_signature">En attente signature</option>
          <option value="signed">Signé</option>
          <option value="archived">Archivé</option>
        </select>
      </div>
    </div>
  );
};

export default ContratsFilters;
