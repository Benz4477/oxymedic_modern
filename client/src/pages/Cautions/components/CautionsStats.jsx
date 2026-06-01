// client/src/pages/Cautions/components/CautionStats.jsx
import React from 'react';
import { Lock, CheckCircle, AlertTriangle, Wallet } from 'lucide-react';

const fmt = (n) =>
  (n || 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 });

export default function CautionStats({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      label: 'Total Déposé',
      value: fmt(stats.total) + ' MAD',
      sub: `${stats.count || 0} cautions`,
      icon: Wallet,
      color: 'emerald',
    },
    {
      label: 'En Cours',
      value: fmt(stats.held) + ' MAD',
      sub: `${stats.countHeld || 0} actives`,
      icon: Lock,
      color: 'amber',
    },
    {
      label: 'Restituées',
      value: fmt(stats.returned) + ' MAD',
      sub: `${stats.countReturned || 0} traitées`,
      icon: CheckCircle,
      color: 'emerald',
    },
    {
      label: 'Déduites',
      value: fmt(stats.deducted) + ' MAD',
      sub: `${stats.countDeducted || 0} retenues`,
      icon: AlertTriangle,
      color: 'rose',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => (
        <div key={i} className="group bg-slate-200/30 rounded-2xl p-4 md:p-5 hover:bg-white hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 border border-transparent hover:border-emerald-50">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <c.icon size={18} className={`text-${c.color}-600`} />
            </div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-300">Stats</div>
          </div>
          <div className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight mb-0.5">{c.value}</div>
          <div className="text-[11px] font-bold text-slate-700 mb-0.5">{c.label}</div>
          <p className="text-[10px] text-slate-400 font-medium">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}