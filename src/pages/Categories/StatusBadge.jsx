import React from "react";
import { CheckCircle, Archive } from "lucide-react";

// Composant badge de statut (actif/inactif)
const StatusBadge = ({ status }) => {
  if (status === "actif") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
        <CheckCircle size={10} /> Actif
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
      <Archive size={10} /> Inactif
    </span>
  );
};

export default StatusBadge;
