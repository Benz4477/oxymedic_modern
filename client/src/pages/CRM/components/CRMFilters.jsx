// src/pages/CRM/components/CRMFilters.jsx
import React from "react";
import { Search, Filter, Download } from "lucide-react";

const CRMFilters = ({ search, onSearchChange, typeFilter, onTypeFilterChange, statusFilter, onStatusFilterChange, onExport }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-[220px]">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Rechercher par nom, email, téléphone..."
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <select
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target.value)}
        className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        <option value="">Tous les segments</option>
        <option value="premium">Premium</option>
        <option value="standard">Standard</option>
        <option value="occasionnel">Occasionnel</option>
      </select>
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      >
        <option value="">Tous les statuts</option>
        <option value="actif">Actif</option>
        <option value="inactif">Inactif</option>
        <option value="perdu">Perdu</option>
      </select>
      <button
        onClick={onExport}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 px-4 py-2.5 rounded-xl transition"
      >
        <Download size={14} /> Exporter
      </button>
    </div>
  );
};

export default CRMFilters;