import React from "react";

const StatusBadge = ({ status }) => {
  const map = {
    draft:     { label: "Brouillon", cls: "bg-slate-100 text-slate-600" },
    sent:      { label: "Envoyé",    cls: "bg-blue-100 text-blue-700" },
    accepted:  { label: "Accepté",   cls: "bg-emerald-100 text-emerald-700" },
    rejected:  { label: "Refusé",    cls: "bg-red-100 text-red-700" },
    expired:   { label: "Expiré",    cls: "bg-orange-100 text-orange-700" },
    converted: { label: "Converti",  cls: "bg-purple-100 text-purple-700" },
  };
  const s = map[status] || { label: status, cls: "bg-slate-100 text-slate-600" };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${s.cls}`}>
      {s.label}
    </span>
  );
};

export default StatusBadge;