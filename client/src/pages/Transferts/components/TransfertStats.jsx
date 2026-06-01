import React from "react";
import { ArrowRightLeft, Clock, Truck, CheckCircle2 } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, shadowClass }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group">
        <div className="flex items-center gap-5">
            <div className={`p-4 ${bgClass} ${colorClass} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg ${shadowClass}`}>
                <Icon size={24} />
            </div>
            <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{title}</div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
            </div>
        </div>
    </div>
);

const TransfertStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
                title="Total Mouvements" 
                value={stats.total} 
                icon={ArrowRightLeft}
                colorClass="text-slate-600"
                bgClass="bg-slate-50"
                shadowClass="shadow-slate-200/20"
            />
            <StatCard 
                title="En Attente" 
                value={stats.pending} 
                icon={Clock}
                colorClass="text-amber-600"
                bgClass="bg-amber-50"
                shadowClass="shadow-amber-200/20"
            />
            <StatCard 
                title="En Transit" 
                value={stats.transit} 
                icon={Truck}
                colorClass="text-emerald-600"
                bgClass="bg-emerald-50"
                shadowClass="shadow-emerald-200/20"
            />
        </div>
    );
};

export default TransfertStats;
