import React from "react";
import { Eye, Plus, Minus, Trash2, CreditCard } from "lucide-react";

const FideliteTable = ({ cards, clients, tierConfig, onView, onAddPoints, onUsePoints, onDelete, onPrintCard }) => {
    const enrichedCards = cards.map(card => {
        const client = clients.find(c => c._id === card.client?._id || c._id === card.client);
        return { ...card, client };
    });

    if (enrichedCards.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
                <div className="text-4xl mb-3 opacity-20 italic font-black">OXY</div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Aucune carte active</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-100 px-6 py-3">
                <div className="col-span-1 text-[10px] font-black uppercase text-slate-400 tracking-tighter">ID</div>
                <div className="col-span-3 text-[10px] font-black uppercase text-slate-400 tracking-tighter">Client</div>
                <div className="col-span-2 text-[10px] font-black uppercase text-slate-400 tracking-tighter">Statut</div>
                <div className="col-span-2 text-[10px] font-black uppercase text-slate-400 tracking-tighter">Points / CA</div>
                <div className="col-span-1 text-[10px] font-black uppercase text-slate-400 tracking-tighter text-center">Cmds</div>
                <div className="col-span-1 text-[10px] font-black uppercase text-slate-400 tracking-tighter">Depuis</div>
                <div className="col-span-2 text-[10px] font-black uppercase text-slate-400 tracking-tighter text-right">Actions</div>
            </div>

            {/* Body */}
            <div className="divide-y divide-slate-50">
                {enrichedCards.map((card) => (
                    <div key={card._id} className="grid grid-cols-12 items-center px-6 py-3 hover:bg-slate-50/50 transition-colors group">
                        <div className="col-span-1">
                            <span className="text-[10px] font-mono font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                {card.cardNumber?.split("-")[1] || "..."}
                            </span>
                        </div>
                        <div className="col-span-3">
                            <div className="text-[13px] font-bold text-slate-800 truncate">{card.client?.prenom} {card.client?.nom}</div>
                            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{card.client?.tel || "Sans tel"}</div>
                        </div>
                        <div className="col-span-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${tierConfig[card.tier]?.color}`}>
                                {card.tier === "platinum" ? "💎 PLAT" : card.tier === "gold" ? "🥇 GOLD" : card.tier === "silver" ? "🥈 SILV" : "🥉 BRON"}
                            </span>
                        </div>
                        <div className="col-span-2">
                            <div className="text-[12px] font-black text-emerald-600 leading-none">{card.points.toLocaleString()} pts</div>
                            <div className="text-[9px] font-bold text-slate-400 mt-0.5">{card.totalSpent.toLocaleString()} MAD</div>
                        </div>
                        <div className="col-span-1 text-center">
                            <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                {card.totalOrders}
                            </span>
                        </div>
                        <div className="col-span-1">
                            <div className="text-[9px] font-bold text-slate-400">{card.createdAt?.split("/")[0]}/{card.createdAt?.split("/")[1]}</div>
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-1">
                            <button onClick={() => onPrintCard(card)} className="w-7 h-7 rounded-lg text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center border border-indigo-100" title="Imprimer carte">
                                <CreditCard size={12} />
                            </button>
                            <button onClick={() => onAddPoints(card)} className="w-7 h-7 rounded-lg text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center border border-emerald-100" title="Ajouter points">
                                <Plus size={12} />
                            </button>
                            <button onClick={() => onUsePoints(card)} className="w-7 h-7 rounded-lg text-amber-500 hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center border border-amber-100" title="Utiliser points">
                                <Minus size={12} />
                            </button>
                            <button onClick={() => onDelete(card._id)} className="w-7 h-7 rounded-lg text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-rose-100" title="Supprimer">
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FideliteTable;