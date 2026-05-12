import React from "react";

const fmtMad = (n) => `${(n || 0).toLocaleString("fr-FR")} MAD`;

const PipelineStats = ({ stats }) => {
  const items = [
    { label: "Pipeline total",        value: fmtMad(stats.total),  color: "border-l-emerald-400" },
    { label: "Opportunités actives",   value: stats.active || 0,    color: "border-l-blue-400" },
    { label: "Gagnées",                value: stats.won    || 0,    color: "border-l-green-400" },
    { label: "Taux de conversion",     value: `${stats.rate || 0}%`, color: "border-l-purple-400" },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {items.map(item => (
        <div key={item.label} className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-4 border-l-4 ${item.color} flex-1 min-w-[150px]`}>
          <div className="text-xl font-extrabold text-slate-900">{item.value}</div>
          <div className="text-xs text-slate-400 mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default PipelineStats;
