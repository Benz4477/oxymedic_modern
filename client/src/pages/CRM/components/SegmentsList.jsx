import React from "react";

const SEGMENTS = [
  { grade: "A", label: "👑 VIP",      color: "#059669", bg: "#ECFDF5", border: "#6EE7B7" },
  { grade: "B", label: "⭐ Fidèle",   color: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE" },
  { grade: "C", label: "👤 Actif",    color: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A" },
  { grade: "D", label: "🌱 Prospect", color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB" },
];

const fmtMad = (n) => `${(n || 0).toLocaleString("fr-FR")} MAD`;

const SegmentsList = ({ segments, onNewTache, onNewInteraction }) => {
  const total = Object.values(segments).flat().length;

  if (!total) return (
    <div className="py-16 text-center">
      <div className="text-3xl mb-2">🏷️</div>
      <div className="text-slate-400 text-sm">Aucun client à segmenter</div>
    </div>
  );

  return (
    <div className="p-5 space-y-6">
      {SEGMENTS.map(seg => {
        const clients = segments[seg.grade] || [];
        if (!clients.length) return null;

        return (
          <div key={seg.grade}>
            {/* Header segment */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                style={{ background: seg.bg, color: seg.color, border: `1px solid ${seg.border}` }}>
                {seg.grade}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: seg.color }}>
                {seg.label} — {clients.length} client{clients.length > 1 ? "s" : ""}
              </span>
            </div>

            {/* Liste clients */}
            <div className="space-y-2">
              {clients.map(c => {
                const tel = (c.tel || "").replace(/[\s\-\(\)\.]/g, "").replace(/^0/, "212");
                return (
                  <div key={c._id} className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                    {/* Score badge */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{ background: seg.bg, color: seg.color, border: `1.5px solid ${seg.border}` }}>
                      {seg.grade}
                    </div>

                    {/* Infos client */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-800">{c.prenom} {c.nom}</div>
                      <div className="text-xs text-slate-400">
                        {c.nbCmds} location{c.nbCmds !== 1 ? "s" : ""} · {fmtMad(c.totalCA)} CA
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {c.tel && (
                        <a href={`https://wa.me/${tel}`} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition"
                          style={{ background: "#25D36615", borderColor: "#25D36640", color: "#128C7E" }}>
                          💬 WA
                        </a>
                      )}
                      <button onClick={() => onNewTache(c._id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-white transition">
                        + Tâche
                      </button>
                      <button onClick={() => onNewInteraction(c._id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-white transition">
                        + Interaction
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SegmentsList;