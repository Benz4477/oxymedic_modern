import React, { useRef } from "react";
import { Award, Zap, ShieldCheck, Crown } from "lucide-react";

const FideliteIdentityCard = ({ card, client }) => {
    const printRef = useRef();
    if (!card || !client) return null;

    const tierStyles = {
        bronze: {
            bg: "from-amber-700 via-amber-800 to-amber-900",
            icon: <Award className="text-amber-200" size={40} />,
            label: "MEMBRE BRONZE",
            accent: "bg-amber-400/20",
            text: "text-amber-100"
        },
        silver: {
            bg: "from-slate-400 via-slate-500 to-slate-600",
            icon: <ShieldCheck className="text-slate-100" size={40} />,
            label: "MEMBRE ARGENT",
            accent: "bg-slate-200/20",
            text: "text-slate-100"
        },
        gold: {
            bg: "from-yellow-500 via-yellow-600 to-yellow-700",
            icon: <Crown className="text-yellow-100" size={40} />,
            label: "MEMBRE OR",
            accent: "bg-yellow-300/20",
            text: "text-yellow-50"
        },
        platinum: {
            bg: "from-indigo-900 via-purple-900 to-slate-900",
            icon: <Zap className="text-indigo-300" size={40} />,
            label: "MEMBRE PLATINUM",
            accent: "bg-indigo-400/20",
            text: "text-indigo-50"
        }
    };

    const style = tierStyles[card.tier] || tierStyles.bronze;

    const handlePrint = () => {
        const win = window.open("", "_blank", "width=600,height=800");
        const logoUrl = window.location.origin + "/Logo1.png";
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OXY-CLIENT-${client._id}`;

        win.document.write(`
            <html>
                <head>
                    <title>Carte Fidélité - ${client.nom}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        @media print {
                            body { 
                                margin: 0; 
                                padding: 20px; 
                                -webkit-print-color-adjust: exact !important;
                                print-color-adjust: exact !important;
                            }
                            .no-print { display: none; }
                        }
                        /* Forcer les couleurs même hors impression pour l'aperçu */
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    </style>
                </head>
                <body class="bg-white flex flex-col items-center gap-10 py-10">
                    <div class="relative w-[450px] h-[260px] rounded-[24px] bg-gradient-to-br ${style.bg} shadow-2xl p-8 overflow-hidden text-white flex flex-col justify-between">
                        <div class="relative flex justify-between items-start">
                            <div>
                                <div class="flex items-center gap-3">
                                    <img src="${logoUrl}" class="h-9 w-auto brightness-0 invert" />
                                </div>
                                <div class="mt-1.5 text-[9px] font-black tracking-[0.3em] uppercase opacity-60">Carte Privilège</div>
                            </div>
                            <div class="p-2 bg-white/10 rounded-2xl border border-white/20">
                                <div class="w-10 h-10 flex items-center justify-center text-white">
                                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15l-2 5l-2-5l-5-2l5-2l2-5l2 5l5 2z"/></svg>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="text-[9px] font-bold tracking-widest opacity-60 mb-1 uppercase">Titulaire</div>
                            <div class="text-xl font-black tracking-tight">${client.prenom} ${client.nom}</div>
                        </div>
                        <div class="flex justify-between items-end">
                            <div>
                                <div class="text-[9px] font-bold tracking-widest opacity-60 mb-1 uppercase">Numéro de carte</div>
                                <div class="text-base font-mono font-bold tracking-widest">${card.cardNumber}</div>
                            </div>
                            <div class="text-[13px] font-black tracking-widest uppercase">${style.label}</div>
                        </div>
                    </div>
                    <div class="relative w-[450px] h-[260px] rounded-[24px] bg-white border border-slate-200 shadow-xl p-8 overflow-hidden text-slate-800 flex flex-col justify-between">
                        <div class="h-10 bg-slate-900 -mx-8 -mt-8 mb-4"></div>
                        <div class="flex justify-between items-start h-full pt-4">
                            <div class="flex-1 pr-8">
                                <div class="text-[9px] text-slate-500 leading-relaxed italic">
                                    Cette carte est strictement personnelle et demeure la propriété d'Oxymedic. Elle permet à son titulaire de bénéficier d'avantages exclusifs et de remises sur les équipements médicaux selon son niveau de fidélité.
                                </div>
                                <div class="mt-6">
                                    <div class="text-[10px] text-slate-400 font-black mb-2 uppercase tracking-widest">Scanner pour accès rapide</div>
                                    <div class="w-24 h-24 bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
                                        <img src="${qrUrl}" class="w-full h-full" />
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col items-end justify-between h-full py-2">
                                <div class="text-right">
                                    <div class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Membre depuis</div>
                                    <div class="text-sm font-black text-slate-900">${card.createdAt}</div>
                                </div>
                                <div class="text-right">
                                    <img src="${logoUrl}" class="h-6 w-auto opacity-80 mb-1" />
                                    <div class="text-[8px] text-slate-300 font-bold tracking-widest uppercase">www.oxymedic.com</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-10 no-print">
                        <button onclick="window.print()" class="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest">Lancer l'impression</button>
                    </div>
                </body>
            </html>
        `);
        win.document.close();
    };

    return (
        <div className="flex flex-col items-center gap-8 p-4">
            <div className={`relative w-[450px] h-[260px] rounded-[24px] bg-gradient-to-br ${style.bg} shadow-2xl p-8 overflow-hidden text-white flex flex-col justify-between group cursor-default transition-transform hover:scale-105 duration-500`}>
                <div className={`absolute top-0 right-0 w-64 h-64 ${style.accent} rounded-full -mr-32 -mt-32 blur-3xl`} />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 blur-2xl" />
                <div className="relative flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3">
                            <img src="/Logo1.png" alt="Oxymedic Logo" className="h-9 w-auto brightness-0 invert" />
                        </div>
                        <div className={`mt-1.5 text-[9px] font-black tracking-[0.3em] uppercase opacity-60`}>Carte Privilège</div>
                    </div>
                    <div className="p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                        {style.icon}
                    </div>
                </div>
                <div className="relative">
                    <div className="text-[9px] font-bold tracking-widest opacity-60 mb-1">TITULAIRE</div>
                    <div className="text-xl font-black tracking-tight truncate">{client.prenom} {client.nom}</div>
                </div>
                <div className="relative flex justify-between items-end">
                    <div>
                        <div className="text-[9px] font-bold tracking-widest opacity-60 mb-1">NUMÉRO DE CARTE</div>
                        <div className="text-base font-mono font-bold tracking-widest">{card.cardNumber}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[13px] font-black tracking-widest">{style.label}</div>
                    </div>
                </div>
            </div>

            <div className="relative w-[450px] h-[260px] rounded-[24px] bg-white shadow-2xl p-8 overflow-hidden text-slate-800 flex flex-col justify-between transition-transform hover:scale-105 duration-500 border border-slate-100">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                <div className="h-10 bg-slate-900 -mx-8 -mt-2 mb-4" />
                <div className="flex justify-between items-start h-full relative">
                    <div className="flex-1 pr-8">
                        <div className="text-[9px] text-slate-500 leading-relaxed italic">
                            Cette carte est strictement personnelle et demeure la propriété d'Oxymedic. Elle permet à son titulaire de bénéficier d'avantages exclusifs et de remises sur les équipements médicaux selon son niveau de fidélité.
                        </div>
                        <div className="mt-8">
                            <div className="text-[10px] text-slate-400 font-black mb-2 uppercase tracking-widest">Scanner pour accès rapide</div>
                            <div className="w-24 h-24 bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OXY-CLIENT-${client._id}`} alt="QR Code" className="w-full h-full" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end justify-between h-full py-4">
                        <div className="text-right">
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Membre depuis</div>
                            <div className="text-sm font-black text-slate-900">{card.createdAt}</div>
                        </div>
                        <div className="text-right">
                            <img src="/Logo1.png" alt="Logo" className="h-6 w-auto opacity-80 mb-1" />
                            <div className="text-[8px] text-slate-300 font-bold tracking-widest uppercase">www.oxymedic.com</div>
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={handlePrint} className="mt-4 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center gap-3">
                🖨️ Imprimer la carte
            </button>
        </div>
    );
};

export default FideliteIdentityCard;
