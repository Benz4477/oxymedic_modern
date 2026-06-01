import React from "react";
import { Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";

const TYPE_LABELS = {
    panne: "Panne / Défaut",
    livraison: "Livraison",
    facturation: "Facture",
    autre: "Autre",
};

const SavTable = ({ tickets, onView, onEdit, onDelete, statusLabels, statusColors, urgencyColors, typeIcons }) => {
    if (tickets.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                <div className="text-4xl mb-3">🛠️</div>
                <p className="text-slate-400 text-sm font-semibold">Aucun ticket SAV</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-slate-50/50">
                        <tr className="border-b border-slate-100">
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">N° Ticket</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Client</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Type / Objet</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Urgence</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Date Création</th>
                            <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {tickets.map((t) => (
                            <tr key={t._id} className="group hover:bg-slate-50/60 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-[11px] font-mono font-black text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">{t.num}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase border border-slate-200">
                                            {t.client?.nom?.substring(0, 1)}{t.client?.prenom?.substring(0, 1)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-800">{t.client?.prenom} {t.client?.nom}</div>
                                            <div className="text-[10px] font-mono text-slate-400">{t.client?.tel}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-lg">{typeIcons[t.type] || "📋"}</span>
                                        <div>
                                            <div className="text-xs font-black uppercase text-slate-400 tracking-tight">{TYPE_LABELS[t.type]}</div>
                                            <div className="text-sm font-bold text-slate-700 truncate max-w-[180px]" title={t.title}>{t.title}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${urgencyColors[t.urgency]?.bg} ${urgencyColors[t.urgency]?.text} ${urgencyColors[t.urgency]?.border}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${t.urgency === 'haute' ? 'bg-rose-500 animate-pulse' : t.urgency === 'moyenne' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                        {t.urgency}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusColors[t.status]}`}>
                                        {statusLabels[t.status]}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-xs font-bold text-slate-500">{t.createdAt}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => onView(t)} className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition flex items-center justify-center border border-transparent hover:border-slate-200" title="Voir">
                                            <Eye size={14} />
                                        </button>
                                        <button onClick={() => onEdit(t)} className="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition flex items-center justify-center border border-transparent hover:border-slate-200" title="Modifier">
                                            <Edit size={14} />
                                        </button>
                                        <button onClick={() => onDelete(t._id)} className="w-8 h-8 rounded-lg text-rose-400 hover:bg-rose-50 transition flex items-center justify-center border border-transparent hover:border-rose-100" title="Supprimer">
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

export default SavTable;