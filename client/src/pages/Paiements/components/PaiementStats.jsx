import React from "react";
import { CreditCard, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const fmt = (n) => (n || 0).toLocaleString("fr-FR");

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>
      <Icon size={20} className={color} />
    </div>
    <div>
      <div className="text-xl font-extrabold text-slate-900">{value}</div>
      <div className="text-xs text-slate-400 mt-0.5">{label}</div>
    </div>
  </div>
);

const PaiementStats = ({ stats = {} }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard icon={CreditCard}    label="Total paiements"  value={stats.total || 0}                         color="text-blue-600"   bg="bg-blue-50" />
    <StatCard icon={CheckCircle}   label="Total encaissé"   value={`${fmt(stats.totalPaid)} MAD`}            color="text-emerald-600" bg="bg-emerald-50" />
    <StatCard icon={Clock}         label="En attente"       value={`${fmt(stats.totalPending)} MAD`}         color="text-amber-600"  bg="bg-amber-50" />
    <StatCard icon={AlertTriangle} label="Paiements en att." value={stats.countPending || 0}                 color="text-red-500"    bg="bg-red-50" />
  </div>
);

export default PaiementStats;