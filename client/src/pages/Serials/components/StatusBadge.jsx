// src/pages/Serials/components/StatusBadge.jsx
const StatusBadge = ({ status }) => {
  const config = {
    available: { label: "Disponible", className: "bg-emerald-100 text-emerald-700" },
    rented: { label: "En location", className: "bg-blue-100 text-blue-700" },
    maintenance: { label: "Maintenance", className: "bg-amber-100 text-amber-700" },
    retired: { label: "Retiré", className: "bg-slate-100 text-slate-700" },
  };
  const { label, className } = config[status] || { label: status, className: "bg-slate-100 text-slate-700" };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${className}`}>{label}</span>;
};

export default StatusBadge;