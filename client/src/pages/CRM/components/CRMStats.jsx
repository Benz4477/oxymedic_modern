// src/pages/CRM/components/CRMStats.jsx
import React from "react";
import { Users, CheckCircle, Star, Heart } from "lucide-react";

const CRMStats = ({ total, actifs, premium, scoreMoyen }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
          <Users size={22} className="text-blue-600" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{total}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Total clients</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
          <CheckCircle size={22} className="text-emerald-600" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{actifs}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Clients actifs</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
          <Star size={22} className="text-amber-600" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{premium}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Clients Premium</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
          <Heart size={22} className="text-purple-600" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{scoreMoyen}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Score moyen</div>
        </div>
      </div>
    </div>
  );
};

export default CRMStats;