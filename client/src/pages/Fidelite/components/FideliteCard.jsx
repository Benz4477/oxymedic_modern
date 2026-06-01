import React from "react";

const FideliteCard = ({ card, client, tierConfig }) => {
    const tier = tierConfig[card.tier];
    const progressToNext = card.tier === "bronze" ? 500 : card.tier === "silver" ? 1500 : card.tier === "gold" ? 3000 : 0;
    const nextTierName = card.tier === "bronze" ? "Argent" : card.tier === "silver" ? "Or" : card.tier === "gold" ? "Platinum" : null;
    const progressPercent = nextTierName ? Math.min(100, Math.round((card.points / progressToNext) * 100)) : 100;

    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex justify-between items-start">
                <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">OXYMEDIC Fidélité</div>
                    <div className="text-2xl font-black mt-1">{tier.name}</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-400">{card.cardNumber}</div>
                </div>
            </div>
            <div className="mt-6">
                <div className="text-3xl font-black">{card.points.toLocaleString()} pts</div>
                <div className="text-xs text-slate-400 mt-1">points cumulés</div>
            </div>
            {nextTierName && (
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Prochain niveau : {nextTierName}</span>
                        <span>{card.points} / {progressToNext} pts</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>
            )}
            <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between text-xs text-slate-400">
                <span>{client?.prenom} {client?.nom}</span>
                <span>Depuis {card.createdAt}</span>
            </div>
        </div>
    );
};

export default FideliteCard;