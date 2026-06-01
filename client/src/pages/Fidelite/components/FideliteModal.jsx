import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import loyaltyService from "../../../services/loyaltyService";

const FideliteModal = ({ isOpen, onClose, clients, onSave }) => {
    const [formData, setFormData] = useState({
        clientId: "",
        initialPoints: 0,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.clientId) {
            toast.error("Veuillez sélectionner un client");
            return;
        }
        setIsSubmitting(true);
        try {
            await loyaltyService.create({
                clientId: formData.clientId,
                initialPoints: formData.initialPoints,
            });
            toast.success("Carte créée avec succès");
            onSave();
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur lors de la création");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-900">Nouvelle carte de fidélité</h3>
                    <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Client *</label>
                        <select
                            required
                            value={formData.clientId}
                            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                        >
                            <option value="">Sélectionner un client</option>
                            {clients.map(c => (
                                <option key={c._id} value={c._id}>{c.prenom} {c.nom} — {c.tel}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Points de départ (optionnel)</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.initialPoints}
                            onChange={(e) => setFormData({ ...formData, initialPoints: parseInt(e.target.value) || 0 })}
                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            placeholder="0"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-colors">Annuler</button>
                        <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50">
                            {isSubmitting ? "Création..." : "Créer la carte"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FideliteModal;