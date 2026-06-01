import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import loyaltyService from "../../../services/loyaltyService";

const PointsModal = ({ isOpen, onClose, client, action, onSave }) => {
    const [formData, setFormData] = useState({
        points: "",
        reason: "",
    });
    const [currentPoints, setCurrentPoints] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (client && isOpen) {
            const loadCard = async () => {
                try {
                    const card = await loyaltyService.getByClient(client._id);
                    setCurrentPoints(card.points);
                } catch (error) {
                    console.error(error);
                }
            };
            loadCard();
        }
    }, [client, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const points = parseInt(formData.points);
        if (!points || points <= 0) {
            toast.error("Veuillez saisir un nombre de points valide");
            return;
        }
        if (action === "use" && points > currentPoints) {
            toast.error(`Points insuffisants (max: ${currentPoints})`);
            return;
        }
        setIsSubmitting(true);
        try {
            if (action === "add") {
                await loyaltyService.addPoints(client._id, points, formData.reason);
                toast.success(`${points} points ajoutés`);
            } else {
                await loyaltyService.usePoints(client._id, points, formData.reason);
                toast.success(`${points} points utilisés`);
            }
            onSave();
            onClose();
        } catch (error) {
            toast.error("Erreur lors de l'opération");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !client) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-900">
                        {action === "add" ? "Ajouter des points" : "Utiliser des points"}
                    </h3>
                    <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="bg-slate-50 rounded-xl p-4 text-center">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Client</div>
                        <div className="text-base font-bold text-slate-800">{client.prenom} {client.nom}</div>
                        <div className="text-xs text-slate-500 mt-1">Points actuels : <span className="font-bold text-emerald-600">{currentPoints.toLocaleString()}</span></div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Points</label>
                        <input
                            type="number"
                            min="1"
                            required
                            value={formData.points}
                            onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            placeholder="Nombre de points"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Motif</label>
                        <input
                            type="text"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            placeholder="ex: Bonus fidélité, remise exceptionnelle..."
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-colors">Annuler</button>
                        <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50">
                            {isSubmitting ? "Traitement..." : (action === "add" ? "Ajouter" : "Utiliser")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PointsModal;