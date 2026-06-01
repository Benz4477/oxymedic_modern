import React, { useState } from "react";
import { Calendar, Search, CheckCircle, XCircle, Info } from "lucide-react";
import { toast } from "react-toastify";
import reservationService from "../../../services/reservationService";

const AvailabilityChecker = ({ equipements }) => {
    const [equipementId, setEquipementId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [results, setResults] = useState([]);
    const [isChecking, setIsChecking] = useState(false);

    const handleCheck = async () => {
        if (!equipementId || !startDate || !endDate) {
            toast.error("Veuillez remplir tous les champs");
            return;
        }
        setIsChecking(true);
        try {
            const data = await reservationService.checkAvailability(equipementId, startDate, endDate);
            setResults(data);
            if (data.length === 0) {
                toast.info("Aucune unité trouvée pour cet équipement.");
            }
        } catch (error) {
            console.error("Check Error:", error);
            toast.error("Erreur lors de la vérification");
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                    <Calendar size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Vérifier la disponibilité</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">Planifiez vos locations en évitant les doublons.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Équipement</label>
                    <select
                        value={equipementId}
                        onChange={(e) => setEquipementId(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                    >
                        <option value="">Sélectionner...</option>
                        {equipements.map(eq => (
                            <option key={eq._id} value={eq._id}>{eq.icon} {eq.name}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date début</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date fin</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                    />
                </div>
            </div>

            <button
                onClick={handleCheck}
                disabled={isChecking}
                className="mt-8 flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all duration-300 shadow-xl shadow-slate-900/10 disabled:opacity-50 active:scale-95"
            >
                <Search size={16} /> {isChecking ? "Vérification..." : "Lancer la vérification"}
            </button>

            {results.length > 0 && (
                <div className="mt-10 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-2 mb-6">
                        <Info size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">État des unités détectées</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.map(r => (
                            <div key={r.uniteId} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-emerald-100 transition-all">
                                <span className="font-mono text-xs font-black text-slate-600">{r.serial}</span>
                                {r.available ? (
                                    <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-tighter">
                                        <CheckCircle size={14} /> Disponible
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-rose-500 text-[10px] font-black uppercase tracking-tighter">
                                        <XCircle size={14} /> Réservé
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvailabilityChecker;