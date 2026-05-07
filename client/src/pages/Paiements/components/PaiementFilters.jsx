import React from "react";
import { Search, Download } from "lucide-react";

const PaiementFilters = ({ search, setSearch, statusFilter, setStatusFilter, modeFilter, setModeFilter, onExport }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
    <div className="relative flex-1 min-w-[200px]">
      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <input type="text" placeholder="Référence, client, commande..."
        className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        value={search} onChange={(e) => setSearch(e.target.value)} />
    </div>
    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
      className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-slate-50">
      <option value="">Tous les statuts</option>
      <option value="paid">Payé</option>
      <option value="pending">En attente</option>
      <option value="cancelled">Annulé</option>
      <option value="refunded">Remboursé</option>
    </select>
    <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)}
      className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-slate-50">
      <option value="">Tous les modes</option>
      <option value="espece">Espèce</option>
      <option value="virement">Virement</option>
      <option value="cheque">Chèque</option>
      <option value="carte">Carte</option>
      <option value="mobile">Mobile</option>
    </select>
    <button onClick={onExport}
      className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition">
      <Download size={14} /> Exporter
    </button>
  </div>
);

export default PaiementFilters;