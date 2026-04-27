// src/pages/Facturation/components/StatusBadge.jsx
import React from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "paid":
        return {
          color: "bg-emerald-100 text-emerald-700 border-emerald-200",
          icon: <CheckCircle size={12} />,
          label: "Payée"
        };
      case "draft":
        return {
          color: "bg-slate-100 text-slate-700 border-slate-200",
          icon: null,
          label: "Brouillon"
        };
      case "sent":
        return {
          color: "bg-blue-100 text-blue-700 border-blue-200",
          icon: null,
          label: "Envoyée"
        };
      case "unpaid":
        return {
          color: "bg-amber-100 text-amber-700 border-amber-200",
          icon: <Clock size={12} />,
          label: "Non payée"
        };
      case "partial":
        return {
          color: "bg-orange-100 text-orange-700 border-orange-200",
          icon: <Clock size={12} />,
          label: "Partielle"
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-700 border-red-200",
          icon: <XCircle size={12} />,
          label: "Annulée"
        };
      default:
        return {
          color: "bg-slate-100 text-slate-700 border-slate-200",
          icon: null,
          label: status
        };
    }
  };

  const { color, icon, label } = getStatusConfig(status);

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${color}`}>
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </span>
  );
};

export default StatusBadge;