// src/pages/Commandes/components/CommandeStats.jsx
import React from "react";
import { ShoppingCart, CheckCircle, Clock, CreditCard } from "lucide-react";

const CommandeStats = ({ total, actives, pending, totalAmount }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
          <ShoppingCart size={22} className="text-blue-600" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{total}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Total commandes</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
          <CheckCircle size={22} className="text-emerald-600" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{actives}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Commandes actives</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
          <Clock size={22} className="text-amber-600" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{pending}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">En attente</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
          <CreditCard size={22} className="text-purple-600" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{totalAmount.toLocaleString()} MAD</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Valeur totale</div>
        </div>
      </div>
    </div>
  );
};

export default CommandeStats;