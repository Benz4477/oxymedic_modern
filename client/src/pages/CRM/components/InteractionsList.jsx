import React from "react";

const EVENT_TYPES = {
  call:      { icon: "📞", label: "Appel",     color: "#3B82F6" },
  email:     { icon: "📧", label: "Email",     color: "#8B5CF6" },
  visit:     { icon: "🏠", label: "Visite",    color: "#10B981" },
  note:      { icon: "📝", label: "Note",      color: "#F59E0B" },
  sms:       { icon: "💬", label: "SMS",       color: "#06B6D4" },
  whatsapp:  { icon: "🟢", label: "WhatsApp",  color: "#25D366" },
};

const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const InteractionsList = ({ interactions, onDelete }) => {
  if (!interactions.length) return (
    <div className="py-16 text-center">
      <div className="text-3xl mb-2">📋</div>
      <div className="text-slate-400 text-sm">Aucune interaction enregistrée</div>
    </div>
  );

  return (
    <div className="divide-y divide-slate-50">
      {interactions.map(ev => {
        const et = EVENT_TYPES[ev.type] || EVENT_TYPES.note;
        const client = ev.client || {};
        const clientNom = client.prenom ? `${client.prenom} ${client.nom}` : "—";
        const tel = (client.tel || "").replace(/[\s\-\(\)\.]/g, "").replace(/^0/, "212");

        return (
          <div key={ev._id} className="flex items-start gap-3 px-5 py-4 hover:bg-slate-50/60 transition">
            {/* Icône type */}
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
              style={{ background: et.color + "18" }}>
              {et.icon}
            </div>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-800">{ev.titre}</div>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <span className="text-xs font-bold" style={{ color: et.color }}>{et.label}</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs font-medium text-slate-600">{clientNom}</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-400">{fmtDate(ev.date)}</span>
                {ev.createdBy && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-400">{ev.createdBy}</span>
                  </>
                )}
              </div>
              {ev.note && (
                <div className="mt-1.5 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-1.5 italic">
                  {ev.note}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {ev.type === "whatsapp" && client.tel && (
                <a href={`https://wa.me/${tel}`} target="_blank" rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs border transition"
                  style={{ background: "#25D36615", borderColor: "#25D36640" }}>💬</a>
              )}
              <button onClick={() => onDelete(ev._id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs border border-red-100 text-red-400 hover:bg-red-50 transition">×</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InteractionsList;