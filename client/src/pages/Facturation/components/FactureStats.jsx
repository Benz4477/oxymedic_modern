import React from "react";
import { Receipt, CheckCircle, Clock, TrendingUp } from "lucide-react";

const fmt = (n) => (n || 0).toLocaleString("fr-FR");

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
      <Icon size={22} className={color} />
    </div>
    <div>
      <div className="text-2xl font-extrabold tracking-tight text-slate-900 leading-none">{value}</div>
      <div className="text-xs text-slate-400 mt-1 font-medium">{label}</div>
    </div>
  </div>
);

const FactureStats = ({ stats = {} }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard icon={Receipt}     label="Total factures"  value={stats.total   || 0}              color="text-blue-600"    bg="bg-blue-50" />
    <StatCard icon={CheckCircle} label="Payées"          value={stats.paid    || 0}              color="text-emerald-600" bg="bg-emerald-50" />
    <StatCard icon={Clock}       label="Non payées"      value={stats.unpaid  || 0}              color="text-amber-600"   bg="bg-amber-50" />
    <StatCard icon={TrendingUp}  label="CA encaissé"     value={`${fmt(stats.totalCA)} MAD`}    color="text-purple-600"  bg="bg-purple-50" />
  </div>
);

export default FactureStats;