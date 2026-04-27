// src/pages/Devis/components/StatusBadge.jsx
import { Send, CheckCircle, AlertTriangle, Clock, FileText } from "lucide-react";

const StatusBadge = ({ status, expired }) => {
  if (expired && status !== "accepted") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600">
        <AlertTriangle size={10} /> Expiré
      </span>
    );
  }

  const config = {
    draft: { label: "Brouillon", icon: <FileText size={10} />, className: "bg-slate-100 text-slate-600" },
    sent: { label: "Envoyé", icon: <Send size={10} />, className: "bg-amber-100 text-amber-700" },
    accepted: { label: "Accepté", icon: <CheckCircle size={10} />, className: "bg-emerald-100 text-emerald-700" },
    refused: { label: "Refusé", icon: <AlertTriangle size={10} />, className: "bg-red-100 text-red-600" },
    expired: { label: "Expiré", icon: <Clock size={10} />, className: "bg-red-100 text-red-600" },
  };
  const { label, icon, className } = config[status] || config.draft;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${className}`}>
      {icon} {label}
    </span>
  );
};

export default StatusBadge;