import React from "react";
import { FileText, Clock, CheckCircle, Archive } from "lucide-react";

const ContratsStats = ({ stats }) => {
  const items = [
    { icon: FileText, iconBg: "bg-blue-50", iconColor: "text-blue-600", label: "Total contrats", value: stats.total || 0, color: "border-l-blue-400" },
    { icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600", label: "En attente signature", value: stats.pending || 0, color: "border-l-amber-400" },
    { icon: CheckCircle, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", label: "Signés", value: stats.signed || 0, color: "border-l-emerald-400" },
    { icon: Archive, iconBg: "bg-slate-50", iconColor: "text-slate-600", label: "Brouillons", value: stats.draft || 0, color: "border-l-slate-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.label} className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 border-l-4 ${item.color}`}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${item.iconBg}`}>
            <item.icon size={17} className={item.iconColor} />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{item.value}</div>
          <div className="text-xs text-slate-400 mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default ContratsStats;
