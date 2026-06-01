import React from "react";
import { ArrowRightLeft, Calendar, Building2, Truck, CheckCircle2, MoreHorizontal, Printer, Eye } from "lucide-react";

const TransfertTable = ({ transferts, onStatusUpdate, onPrint, statusLabels, statusColors }) => {
    if (transferts.length === 0) {
        return (
            <div className="p-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck size={24} className="text-slate-300" />
                </div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Aucun transfert</h3>
                <p className="text-xs text-slate-400">Les mouvements de stock apparaîtront ici.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Référence</th>
                            <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">De ➔ Vers</th>
                            <th className="px-6 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Matériel</th>
                            <th className="px-6 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Logistique</th>
                            <th className="px-6 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                            <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {transferts.map((trf) => (
                            <tr key={trf._id} className="group hover:bg-slate-50/50 transition-all">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-slate-800">{trf.reference}</span>
                                        <span className="text-[10px] font-bold text-slate-400">{new Date(trf.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col text-left">
                                            <span className="text-xs font-black text-slate-700">{trf.sourceMagasin?.nom}</span>
                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Origine</span>
                                        </div>
                                        <ArrowRightLeft size={14} className="text-emerald-400" />
                                        <div className="flex flex-col text-left">
                                            <span className="text-xs font-black text-emerald-600">{trf.targetMagasin?.nom}</span>
                                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Destination</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                                        {trf.items?.length || 0} unité(s)
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs font-bold text-slate-600">{trf.logistique?.chauffeur || "—"}</span>
                                        <span className="text-[10px] text-slate-400 font-mono">{trf.logistique?.matricule || ""}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${statusColors[trf.statut]}`}>
                                        {statusLabels[trf.statut]}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => onPrint(trf)}
                                            className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                                            title="Imprimer le bon"
                                        >
                                            <Printer size={14} />
                                        </button>
                                        
                                        {trf.statut === "pending" && (
                                            <button 
                                                onClick={() => onStatusUpdate(trf._id, "in_transit")}
                                                className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20"
                                            >
                                                Expédier
                                            </button>
                                        )}
                                        
                                        {trf.statut === "in_transit" && (
                                            <button 
                                                onClick={() => onStatusUpdate(trf._id, "completed")}
                                                className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20"
                                            >
                                                Réceptionner
                                            </button>
                                        )}
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

export default TransfertTable;
