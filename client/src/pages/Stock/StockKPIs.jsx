import React from "react";
import { Package, AlertTriangle, Archive } from "lucide-react";

const StockKPIs = ({ 
  totalActifs, 
  totalEpuises, 
  stockBas, 
  totalArchives 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
          <Package size={22} className="text-blue-600" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
            {totalActifs}
          </div>
          <div className="text-xs text-slate-400 mt-1 font-medium">
            Équipements actifs
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
          <AlertTriangle size={22} className="text-red-600" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
            {totalEpuises}
          </div>
          <div className="text-xs text-slate-400 mt-1 font-medium">
            Équipements épuisés
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
          <AlertTriangle size={22} className="text-amber-500" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
            {stockBas}
          </div>
          <div className="text-xs text-slate-400 mt-1 font-medium">
            Stock bas
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
          <Archive size={22} className="text-gray-500" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
            {totalArchives}
          </div>
          <div className="text-xs text-slate-400 mt-1 font-medium">
            Archivés
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockKPIs;
