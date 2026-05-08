import React from "react";

const TASK_TYPES = {
  call:     { icon: "📞", color: "#3B82F6", label: "Appel" },
  email:    { icon: "📧", color: "#8B5CF6", label: "Email" },
  delivery: { icon: "🚚", color: "#F59E0B", label: "Livraison" },
  contract: { icon: "📜", color: "#10B981", label: "Contrat" },
  other:    { icon: "⚙️", color: "#6B7280", label: "Autre" },
};

const PRIORITIES = {
  haute:   { label: "Haute",   color: "#EF4444" },
  moyenne: { label: "Moyenne", color: "#F59E0B" },
  basse:   { label: "Basse",   color: "#6B7280" },
};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "—";

const TachesList = ({ taches, onToggle, onDelete, onNewInteraction }) => {
  const now = new Date(); now.setHours(0, 0, 0, 0);

  const sorted = [...taches].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return (new Date(a.echeance) || now) - (new Date(b.echeance) || now);
  });

  if (!sorted.length) return (
    <div className="py-16 text-center">
      <div className="text-3xl mb-2">✅</div>
      <div className="text-slate-400 text-sm">Aucune tâche</div>
    </div>
  );

  return (
    <div className="divide-y divide-slate-50">
      {sorted.map(t => {
        const tt       = TASK_TYPES[t.type]  || TASK_TYPES.other;
        const prio     = PRIORITIES[t.priorite] || PRIORITIES.basse;
        const client   = t.client || {};
        const clientNom = client.prenom ? `${client.prenom} ${client.nom}` : "—";
        const echeance = t.echeance ? new Date(t.echeance) : null;
        const isOverdue = !t.done && echeance && echeance < now;
        const isToday   = !t.done && echeance && echeance.getTime() === now.getTime();
        const tel       = (client.tel || "").replace(/[\s\-\(\)\.]/g, "").replace(/^0/, "212");

        return (
          <div key={t._id} className={`flex items-start gap-3 px-5 py-4 hover:bg-slate-50/60 transition ${isOverdue ? "bg-red-50/40" : ""}`}>
            {/* Checkbox */}
            <button onClick={() => onToggle(t._id)}
              className={`w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                t.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 hover:border-emerald-400"
              }`}>
              {t.done && <span className="text-xs font-bold">✓</span>}
            </button>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-semibold ${t.done ? "line-through text-slate-400" : "text-slate-800"}`}>
                {t.titre}
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span style={{ color: tt.color }} className="text-xs font-semibold">{tt.icon} {tt.label}</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500 font-medium">{clientNom}</span>
                {echeance && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className={`text-xs font-semibold ${isOverdue ? "text-red-500" : isToday ? "text-amber-500" : "text-slate-400"}`}>
                      {isOverdue ? "⚠️ En retard — " : isToday ? "📅 Aujourd'hui — " : ""}{fmtDate(t.echeance)}
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ background: prio.color + "18", color: prio.color }}>
                  {prio.label}
                </span>
                {t.assignedTo && (
                  <span className="text-[10px] text-slate-400">→ {t.assignedTo}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* WhatsApp */}
              {client.tel && (
                <a href={`https://wa.me/${tel}`} target="_blank" rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs border transition"
                  style={{ background: "#25D36615", borderColor: "#25D36640" }}
                  title="WhatsApp">💬</a>
              )}
              {/* Nouvelle interaction */}
              {client._id && (
                <button onClick={() => onNewInteraction(client._id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs border border-slate-200 hover:bg-slate-100 transition"
                  title="Nouvelle interaction">📞</button>
              )}
              {/* Supprimer */}
              <button onClick={() => onDelete(t._id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs border border-red-100 text-red-400 hover:bg-red-50 transition">×</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TachesList;