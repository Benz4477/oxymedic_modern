// src/pages/CRM/components/SegmentBadge.jsx
import React from "react";
import { Star } from "lucide-react";

const SegmentBadge = ({ segment }) => {
  const config = {
    premium: { label: "Premium", icon: <Star size={10} />, className: "bg-amber-100 text-amber-700" },
    standard: { label: "Standard", className: "bg-blue-100 text-blue-700" },
    occasionnel: { label: "Occasionnel", className: "bg-slate-100 text-slate-600" },
  };
  const { label, icon, className } = config[segment] || { label: segment, className: "bg-slate-100 text-slate-700" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${className}`}>
      {icon} {label}
    </span>
  );
};

export default SegmentBadge;