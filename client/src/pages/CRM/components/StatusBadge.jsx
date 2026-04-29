// src/pages/CRM/components/StatusBadge.jsx
import React from "react";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";

const StatusBadge = ({ status }) => {
  const config = {
    actif: { label: "Actif", icon: <CheckCircle size={10} />, className: "bg-emerald-100 text-emerald-700" },
    inactif: { label: "Inactif", icon: <Clock size={10} />, className: "bg-amber-100 text-amber-700" },
    perdu: { label: "Perdu", icon: <AlertTriangle size={10} />, className: "bg-red-100 text-red-600" },
  };
  const { label, icon, className } = config[status] || { label: status, className: "bg-slate-100 text-slate-700" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${className}`}>
      {icon} {label}
    </span>
  );
};

export default StatusBadge;