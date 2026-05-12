import React from "react";
import { X, Trash2 } from "lucide-react";

const fmtMad = (n) => `${(n || 0).toLocaleString("fr-FR")} MAD`;

const ViewOppModal = ({ isOpen, onClose, opp, stages, onMove, onDelete }) => {
  if (!isOpen || !opp) return null;

  const stage     = stages.find(s => s.id === opp.stageId) || { name: "—", color: "#6B7280", icon: "?" };
  const clientNom = opp.client ? `${opp.client.prenom} ${opp.client.nom}` : "—";
  const equipNom  = opp.equipement ? `${opp.equipement.icon || ""} ${opp.equipement.name}` : "—";

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>

        <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-slate-900">📊 {clientNom}</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Stage banner */}
          <div className="rounded-xl p-3 flex items-center gap-3"
            style={{ background: stage.color + "18", border: `1.5px solid ${stage.color}44` }}>
            <span className="text-2xl">{stage.icon}</span>
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-900">{clientNom}</div>
              <div className="text-xs font-semibold" style={{ color: stage.color }}>
                {stage.name} · {opp.prob}% probabilité
              </div>
            </div>
            <div className="text-lg font-extrabold font-mono" style={{ color: stage.color }}>
              {fmtMad(opp.amount)}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400">Équipement</span>
              <span className="font-semibold">{equipNom}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400">Créée le</span>
              <span>{new Date(opp.createdAt).toLocaleDateString("fr-FR")}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-400">Mise à jour</span>
              <span>{new Date(opp.updatedAt).toLocaleDateString("fr-FR")}</span>
            </div>
            {opp.notes && (
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-400">Notes</span>
                <span className="text-right max-w-[60%]">{opp.notes}</span>
              </div>
            )}
          </div>

          {/* Move to stage */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Déplacer vers</div>
            <div className="flex flex-wrap gap-2">
              {stages.map(s => (
                <button key={s.id}
                  onClick={() => { onMove(opp._id, s.id); onClose(); }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition"
                  style={{
                    borderColor: s.color,
                    color: s.id === opp.stageId ? "#fff" : s.color,
                    background: s.id === opp.stageId ? s.color : "transparent",
                  }}>
                  {s.icon} {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-100 flex gap-2">
          <button onClick={() => { onDelete(opp._id); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-semibold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition">
            <Trash2 size={13} /> Supprimer
          </button>
          <button onClick={onClose}
            className="flex-1 px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewOppModal;
