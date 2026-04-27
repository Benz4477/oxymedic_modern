// src/pages/Facturation/components/FactureStats.jsx
import React from "react";
import { Receipt, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const FactureStats = ({ factures }) => {
  if (!factures || !Array.isArray(factures)) {
    return null;
  }
  
  const totalFactures = factures.length;
  const totalPayees = factures.filter(f => f.status === "payée").length;
  const totalEnAttente = factures.filter(f => f.status === "en_attente").length;
  const totalEnRetard = factures.filter(f => f.status === "en_retard").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
          <Receipt size={22} className="text-blue-600" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{totalFactures}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Total factures</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
          <CheckCircle size={22} className="text-emerald-600" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{totalPayees}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Payées</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
          <Clock size={22} className="text-amber-600" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{totalEnAttente}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">En attente</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
          <AlertTriangle size={22} className="text-red-600" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{totalEnRetard}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">En retard</div>
        </div>
      </div>
    </div>
  );
};

export default FactureStats;