import React from "react";

const CONFIG = {
  active:    { label: "Active",      icon: "✅", className: "bg-emerald-100 text-emerald-700" },
  pending:   { label: "En attente",  icon: "⏳", className: "bg-amber-100 text-amber-700" },
  transit:   { label: "Livraison",   icon: "🚚", className: "bg-blue-100 text-blue-700" },
  ended:     { label: "Terminée",    icon: "✔️", className: "bg-slate-100 text-slate-500" },
  cancelled: { label: "Annulée",     icon: "❌", className: "bg-red-100 text-red-600" },
};

const StatusBadge = ({ status }) => {
  const { label, icon, className } =
    CONFIG[status] || { label: status || "—", icon: "", className: "bg-slate-100 text-slate-500" };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${className}`}>
      {icon && <span>{icon}</span>} <span>{label}</span>
    </span>
  );
};

export default StatusBadge;