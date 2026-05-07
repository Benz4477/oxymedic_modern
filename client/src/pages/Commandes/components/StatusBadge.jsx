import React from "react";

const CONFIG = {
  active:    { label: "Active",      className: "bg-emerald-100 text-emerald-700" },
  pending:   { label: "En attente",  className: "bg-amber-100 text-amber-700" },
  transit:   { label: "Livraison",   className: "bg-blue-100 text-blue-700" },
  ended:     { label: "Terminée",    className: "bg-slate-100 text-slate-500" },
  cancelled: { label: "Annulée",     className: "bg-red-100 text-red-600" },
};

const StatusBadge = ({ status }) => {
  const { label, className } =
    CONFIG[status] || { label: status || "—", className: "bg-slate-100 text-slate-500" };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${className}`}>
      {label}
    </span>
  );
};

export default StatusBadge;