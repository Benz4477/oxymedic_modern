import React from "react";
import PipelineCard from "./PipelineCard";

const fmtMad = (n) => `${(n || 0).toLocaleString("fr-FR")} MAD`;

const PipelineBoard = ({ opps, stages, onView, onAdvance, onMove, onAddToStage }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 400 }}>
      {stages.map(stage => {
        const cards = opps.filter(o => o.stageId === stage.id);
        const stageTotal = cards.reduce((s, o) => s + o.amount, 0);

        return (
          <div key={stage.id} className="flex-shrink-0 w-[260px] bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col">

            {/* Column header */}
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: stage.color }} />
                <span className="text-xs font-bold text-slate-700">{stage.icon} {stage.name}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                {cards.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 p-3 space-y-2 overflow-y-auto" style={{ maxHeight: 400 }}>
              {cards.map(opp => (
                <PipelineCard
                  key={opp._id}
                  opp={opp}
                  stage={stage}
                  stages={stages}
                  onView={onView}
                  onAdvance={onAdvance}
                  onMove={onMove}
                />
              ))}

              {/* Add button */}
              <button
                onClick={() => onAddToStage(stage.id)}
                className="w-full py-2 rounded-xl border-2 border-dashed border-slate-200 text-xs font-semibold text-slate-400 hover:border-emerald-300 hover:text-emerald-500 transition"
              >
                + Ajouter
              </button>
            </div>

            {/* Column total */}
            {stageTotal > 0 && (
              <div className="px-4 py-2 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[10px] font-semibold text-slate-400">Total</span>
                <span className="text-xs font-extrabold font-mono" style={{ color: stage.color }}>
                  {fmtMad(stageTotal)}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PipelineBoard;
