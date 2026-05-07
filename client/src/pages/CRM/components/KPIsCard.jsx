import React from "react";
import { Users, CheckCircle, AlertCircle, Calendar, Clock } from "lucide-react";

const KPIsCard = ({ kpis }) => {
  if (!kpis) return null;

  const kpiCards = [
    {
      title: "Tâches en retard",
      value: kpis.overdue || 0,
      icon: AlertCircle,
      color: "red",
      bg: "bg-red-50",
      text: "text-red-600",
    },
    {
      title: "Tâches en attente",
      value: kpis.pending || 0,
      icon: Clock,
      color: "amber",
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
    {
      title: "Événements ce mois",
      value: kpis.eventsMonth || 0,
      icon: Calendar,
      color: "blue",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Total clients",
      value: kpis.clients || 0,
      icon: Users,
      color: "emerald",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiCards.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div key={index} className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">{kpi.title}</p>
                <p className="text-3xl font-bold text-slate-800">{kpi.value}</p>
              </div>
              <div className={`p-3 ${kpi.bg} rounded-lg`}>
                <Icon size={24} className={kpi.text} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KPIsCard;
