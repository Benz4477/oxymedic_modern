import React from "react";

const fmtMad = (n) => `${(n || 0).toLocaleString("fr-FR")} MAD`;

const PipelineCard = ({ opp, stage, stages, onView, onAdvance, onMove }) => {
  const clientNom = opp.client ? `${opp.client.prenom} ${opp.client.nom}` : "—";
  const equipNom  = opp.equipement ? `${opp.equipement.icon || ""} ${opp.equipement.name}` : "";

  return (
    <div
      className="bg-slate-50 hover:bg-slate-100 rounded-xl p-3 cursor-pointer transition border border-slate-100 hover:border-slate-200"
      onClick={() => onView(opp)}
    >
      <div className="text-xs font-bold text-slate-800 mb-1">{clientNom}</div>
      {equipNom && <div className="text-[10px] text-slate-500 mb-1">{equipNom}</div>}
      <div className="text-sm font-extrabold text-slate-800 font-mono">{fmtMad(opp.amount)}</div>
      <div className="text-[10px] font-semibold mt-1" style={{ color: stage.color }}>
        {opp.prob}% probabilité
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-1 mt-2">
        {stage.id < 5 && stage.id !== 6 && (
          <button
            onClick={e => { e.stopPropagation(); onAdvance(opp._id); }}
            className="px-2 py-1 rounded-lg text-[10px] font-bold text-white transition"
            style={{ background: stage.color }}
            title="Avancer"
          >
            →
          </button>
        )}
        {stages
          .filter(s => s.id !== stage.id && s.id !== 6)
          .slice(0, 2)
          .map(s => (
            <button
              key={s.id}
              onClick={e => { e.stopPropagation(); onMove(opp._id, s.id); }}
              className="px-2 py-1 rounded-lg text-[10px] font-semibold border transition hover:opacity-80"
              style={{ borderColor: s.color + "44", color: s.color }}
              title={s.name}
            >
              {s.icon}
            </button>
          ))}
      </div>
    </div>
  );
};

export default PipelineCard;
