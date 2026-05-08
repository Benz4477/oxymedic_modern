import React from "react";
import { AlertTriangle, CheckCircle, MessageSquare, Users } from "lucide-react";

const CrmStats = ({ stats }) => {
  const items = [
    { icon: AlertTriangle, iconBg: "bg-red-50", iconColor: "text-red-500", label: "Tâches en retard",    value: stats.overdue       || 0, color: "border-l-red-400" },
    { icon: CheckCircle,   iconBg: "bg-amber-50", iconColor: "text-amber-500", label: "Tâches en attente", value: stats.pending       || 0, color: "border-l-amber-400" },
    { icon: MessageSquare, iconBg: "bg-blue-50", iconColor: "text-blue-600",  label: "Interactions ce mois", value: stats.eventsMonth  || 0, color: "border-l-blue-400" },
    { icon: Users,         iconBg: "bg-emerald-50", iconColor: "text-emerald-600", label: "Total clients",  value: stats.totalClients || 0, color: "border-l-emerald-400" },
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

export default CrmStats;