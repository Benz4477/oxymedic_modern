// src/pages/Serials/components/UnitStats.jsx
import { Package } from "lucide-react";

const UnitStats = ({ total, available, rented, maintenance }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center"><Package size={22} className="text-blue-600" /></div>
        <div><div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{total}</div><div className="text-xs text-slate-400 mt-1 font-medium">Total unités</div></div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center"><Package size={22} className="text-emerald-600" /></div>
        <div><div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{available}</div><div className="text-xs text-slate-400 mt-1 font-medium">Disponibles</div></div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center"><Package size={22} className="text-blue-600" /></div>
        <div><div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{rented}</div><div className="text-xs text-slate-400 mt-1 font-medium">En location</div></div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center"><Package size={22} className="text-amber-600" /></div>
        <div><div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{maintenance}</div><div className="text-xs text-slate-400 mt-1 font-medium">Maintenance</div></div>
      </div>
    </div>
  );
};

export default UnitStats;