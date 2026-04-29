// src/pages/CRM/components/ClientScore.jsx
import React from "react";

const getScoreColor = (score) => {
  if (score >= 80) return "#16A34A";
  if (score >= 60) return "#D97706";
  if (score >= 40) return "#7C3AED";
  return "#DC2626";
};

const ClientScore = ({ score }) => {
  const color = getScoreColor(score);
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm font-bold" style={{ color }}>
        {score}
      </div>
      <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  );
};

export default ClientScore;