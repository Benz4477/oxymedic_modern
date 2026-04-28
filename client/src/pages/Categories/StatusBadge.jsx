import React from "react";
import { CheckCircle, Archive } from "lucide-react";

// Composant badge de statut (actif/inactif)
const StatusBadge = ({ status, onClick, clickable = false }) => {
  const badgeClasses = clickable 
    ? "cursor-pointer hover:opacity-80 transition-opacity"
    : "";

  if (status === "actif") {
    return (
      <span 
        onClick={clickable ? onClick : undefined}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 ${badgeClasses}`}
      >
        <CheckCircle size={10} /> Actif
      </span>
    );
  }
  return (
    <span 
      onClick={clickable ? onClick : undefined}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 ${badgeClasses}`}
    >
      <Archive size={10} /> Inactif
    </span>
  );
};

export default StatusBadge;
