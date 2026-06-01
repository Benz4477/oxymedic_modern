// client/src/pages/Cautions/components/CautionFilters.jsx
import React from 'react';
import { Search, Filter } from 'lucide-react';

export default function CautionFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}) {
  const filters = [
    { value: '', label: 'Toutes' },
    { value: 'held', label: 'En cours' },
    { value: 'returned', label: 'Restituées' },
    { value: 'deducted', label: 'Déduites' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search Input - Flat Style */}
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={14} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un dépôt..."
            className="w-full pl-9 pr-4 py-2 bg-slate-200/40 border-none rounded-xl text-xs focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
          />
        </div>

        {/* Tabs - Flat Style */}
        <div className="overflow-x-auto pb-1 scrollbar-hide w-full md:w-auto">
          <div className="flex items-center gap-1 p-1 bg-slate-200/40 rounded-xl w-fit">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                  statusFilter === f.value
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {statusFilter === f.value && <Filter size={10} />}
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}