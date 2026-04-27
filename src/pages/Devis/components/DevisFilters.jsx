// src/pages/Devis/components/DevisFilters.jsx
import { Search, Filter, Download } from "lucide-react";

const DevisFilters = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-[220px]">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Rechercher par référence, client..."
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        <option value="">Tous les statuts</option>
        <option value="draft">Brouillon</option>
        <option value="sent">Envoyé</option>
        <option value="accepted">Accepté</option>
        <option value="refused">Refusé</option>
        <option value="expired">Expiré</option>
      </select>
      <button className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 px-4 py-2.5 rounded-xl transition">
        <Filter size={14} /> Filtres
      </button>
      <button className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 px-4 py-2.5 rounded-xl transition">
        <Download size={14} /> Exporter
      </button>
    </div>
  );
};

export default DevisFilters;