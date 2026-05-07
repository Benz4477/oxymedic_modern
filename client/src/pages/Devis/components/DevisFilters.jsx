import React from "react";
import { Search } from "lucide-react";

const DevisFilters = ({ search, setSearch, statusFilter, setStatusFilter }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
    <div className="relative flex-1 min-w-[220px]">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input
        type="text"
        placeholder="Rechercher par référence, client..."
        className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
    <select
      className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="">Tous les statuts</option>
      <option value="draft">Brouillon</option>
      <option value="sent">Envoyé</option>
      <option value="accepted">Accepté</option>
      <option value="rejected">Refusé</option>
      <option value="expired">Expiré</option>
      <option value="converted">Converti</option>
    </select>
  </div>
);

export default DevisFilters;