import React from "react";
import { Eye, Edit, Trash2, CheckCircle } from "lucide-react";

const MaintenanceTable = ({ maintenances, onView, onEdit, onDelete, onClose, statusLabels, statusColors, priorityColors }) => {
    if (maintenances.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <div className="text-4xl mb-3">🔧</div>
                <p className="text-slate-400 text-sm font-semibold">Aucune intervention</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-slate-50/50">
                        <tr className="border-b border-slate-100">
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">N°</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Équipement</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Unité / SN</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Type</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Priorité</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Technicien</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</th>
                            <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {maintenances.map((m) => (
                            <tr key={m._id} className="group hover:bg-slate-50/60 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[11px] font-mono font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{m.num || `#${m.id}`}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                            {m.equipement?.photo ? (
                                                <img src={m.equipement.photo} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xl">{m.equipement?.icon || "📦"}</span>
                                            )}
                                        </div>
                                        <span className="text-sm font-bold text-slate-800">{m.equipement?.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-mono font-bold text-slate-700">{m.unite?.serial || "—"}</span>
                                        {m.unite?.statut && (
                                            <span className="text-[9px] font-black uppercase text-slate-400">{m.unite.statut}</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${m.type === "preventive" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                        }`}>
                                        <span className="w-1 h-1 rounded-full bg-current" />
                                        {m.type === "preventive" ? "Préventive" : "Curative"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 max-w-xs">
                                    <p className="text-sm text-slate-500 font-medium truncate" title={m.description}>{m.description}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${priorityColors[m.priority]?.bg} ${priorityColors[m.priority]?.text} ${priorityColors[m.priority]?.border}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${m.priority === 'haute' ? 'bg-rose-500 animate-pulse' : m.priority === 'moyenne' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                        {m.priority}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                                            {m.technicien?.substring(0, 2) || "?"}
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{m.technicien || "—"}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusColors[m.status]}`}>
                                        {statusLabels[m.status]}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => onView(m)} className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition flex items-center justify-center border border-transparent hover:border-slate-200" title="Voir">
                                            <Eye size={14} />
                                        </button>
                                        <button onClick={() => onEdit(m)} className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition flex items-center justify-center border border-transparent hover:border-slate-200" title="Modifier">
                                            <Edit size={14} />
                                        </button>
                                        {m.status !== "done" && (
                                            <button onClick={() => onClose(m._id)} className="w-8 h-8 rounded-lg text-emerald-500 hover:bg-emerald-50 transition flex items-center justify-center border border-transparent hover:border-emerald-100" title="Clôturer">
                                                <CheckCircle size={14} />
                                            </button>
                                        )}
                                        <button onClick={() => onDelete(m._id)} className="w-8 h-8 rounded-lg text-rose-400 hover:bg-rose-50 transition flex items-center justify-center border border-transparent hover:border-rose-100" title="Supprimer">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MaintenanceTable;