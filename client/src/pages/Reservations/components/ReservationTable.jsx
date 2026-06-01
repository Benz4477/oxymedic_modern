import React from "react";
import { Edit2, Trash2, ArrowRightLeft, Calendar, User, Package, Box, Clock, Printer } from "lucide-react";

const ReservationTable = ({ reservations, onEdit, onDelete, onConvert, onPrint, statusLabels, statusColors }) => {
    // ... no changes until table body ...
    {
        reservations.map((res) => (
            <tr key={res._id} className="group hover:bg-slate-50/50 transition-all">
                {/* ... client cell ... */}
                <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                            <span className="text-base">{res.equipement?.icon || "📦"}</span>
                            <span>{res.equipement?.name || "Équipement inconnu"}</span>
                        </div>
                        {res.unite ? (
                            <div className="flex items-center gap-1 text-[10px] font-mono font-black text-emerald-600 uppercase mt-0.5">
                                <Box size={10} /> {res.unite.serial}
                            </div>
                        ) : (
                            <span className="text-[9px] font-black text-slate-300 uppercase mt-0.5">Auto-sélection au départ</span>
                        )}
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-0.5">
                        <div className="text-[11px] font-black text-slate-600">Du {res.startDate}</div>
                        <div className="text-[11px] font-black text-slate-400">Au {res.endDate}</div>
                    </div>
                </td>
                <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${statusColors[res.status] || 'bg-slate-100 text-slate-400'}`}>
                        {statusLabels[res.status] || res.status}
                    </span>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => onPrint(res)}
                            className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                            title="Imprimer le bon"
                        >
                            <Printer size={14} />
                        </button>
                        {res.status === "confirmed" && (
                            <button
                                onClick={() => onConvert(res)}
                                className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                title="Convertir en commande"
                            >
                                <ArrowRightLeft size={14} />
                            </button>
                        )}
                        <button
                            onClick={() => onEdit(res)}
                            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                            title="Modifier"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={() => onDelete(res._id)}
                            className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Supprimer"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </td>
            </tr>
        ))
    }
}
export default ReservationTable;
