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
        <div key={item.label} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{item.label}</div>
              <div className="text-2xl font-black text-slate-800 tracking-tight">{item.value}</div>
            </div>
            <div className={`p-3 rounded-2xl ${item.iconBg} group-hover:scale-110 transition-transform duration-300`}>
              <item.icon size={20} className={item.iconColor} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContratsStats;
