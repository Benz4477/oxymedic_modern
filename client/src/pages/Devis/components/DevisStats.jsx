import React from "react";

const DevisStats = ({ stats }) => {
  const items = [
    { label: "Total",     value: stats.total     || 0, color: "border-l-slate-400" },
    { label: "Brouillon", value: stats.draft     || 0, color: "border-l-slate-400" },
    { label: "Envoyés",   value: stats.sent      || 0, color: "border-l-blue-400" },
    { label: "Acceptés",  value: stats.accepted  || 0, color: "border-l-emerald-400" },
    { label: "Convertis", value: stats.converted || 0, color: "border-l-purple-400" },
    { label: "Expirés",   value: stats.expired   || 0, color: "border-l-orange-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
      {items.map((item) => (
        <div key={item.label} className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-4 border-l-4 ${item.color}`}>
          <div className="text-2xl font-extrabold text-slate-900">{item.value}</div>
          <div className="text-xs text-slate-400 mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default DevisStats;