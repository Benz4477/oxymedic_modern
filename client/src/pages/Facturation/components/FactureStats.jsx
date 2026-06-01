import React from "react";
import { Receipt, CheckCircle, Clock, TrendingUp } from "lucide-react";

const fmt = (n) => (n || 0).toLocaleString("fr-FR");

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
    <div className="flex justify-between items-start">
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{label}</div>
        <div className="text-2xl font-black text-slate-800 tracking-tight">{value}</div>
      </div>
      <div className={`p-3 rounded-2xl ${bg} group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={20} className={color} />
      </div>
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