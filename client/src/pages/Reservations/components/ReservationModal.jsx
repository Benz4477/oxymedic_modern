import React, { useState, useEffect } from "react";
import { X, Calendar, User, Package, Box, DollarSign, FileText } from "lucide-react";
import { toast } from "react-toastify";
import reservationService from "../../../services/reservationService";

const ReservationModal = ({ isOpen, onClose, reservation, clients, equipements, unites, onSave }) => {
    const [formData, setFormData] = useState({
        client: "",
        equipement: "",
        unite: "",
        startDate: "",
        endDate: "",
        montant: 0,
        notes: "",
        status: "pending",
    });
    const [filteredUnites, setFilteredUnites] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (reservation) {
            setFormData({
                client: reservation.client?._id || "",
                equipement: reservation.equipement?._id || "",
                unite: reservation.unite?._id || "",
                startDate: reservation.startDate ? new Date(reservation.startDate.split('/').reverse().join('-')).toISOString().split('T')[0] : "",
                endDate: reservation.endDate ? new Date(reservation.endDate.split('/').reverse().join('-')).toISOString().split('T')[0] : "",
                montant: reservation.montant || 0,
                notes: reservation.notes || "",
                status: reservation.status || "pending",
            });
        } else {
            setFormData({
                client: "",
                equipement: "",
                unite: "",
                startDate: "",
                endDate: "",
                montant: 0,
                notes: "",
                status: "pending",
            });
        }
    }, [reservation, isOpen]);

    useEffect(() => {
        if (formData.equipement) {
            // Filtrage robuste : vérifie le nouveau schéma (equipement) et l'ancien (equipId)
            const filtered = unites.filter(u => {
                const eqId = u.equipement?._id || u.equipement || u.equipId?._id || u.equipId;
                return String(eqId) === String(formData.equipement);
            });
            setFilteredUnites(filtered);
        } else {
            setFilteredUnites([]);
        }
    }, [formData.equipement, unites]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.client || !formData.equipement || !formData.startDate || !formData.endDate) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }
        setIsSubmitting(true);
        try {
            // Vérifier le contexte magasin (requis pour le backend)
            const activeMagasinId = sessionStorage.getItem("activeMagasinId");
            const user = JSON.parse(sessionStorage.getItem("user") || "{}");
            
            if (!activeMagasinId && user.role === "superadmin") {
                toast.error("Veuillez sélectionner un magasin en haut de la page.");
                setIsSubmitting(false);
                return;
            }

            // Formater les dates en DD/MM/YYYY explicitement pour le backend
            const formatDate = (dateStr) => {
                if (!dateStr) return "";
                const [y, m, d] = dateStr.split("-");
                return `${d}/${m}/${y}`;
            };

            const payload = {
                ...formData,
                startDate: formatDate(formData.startDate),
                endDate: formatDate(formData.endDate),
            };

            if (reservation) {
                await reservationService.update(reservation._id, payload);
                toast.success("Réservation mise à jour");
            } else {
                await reservationService.create(payload);
                toast.success("Réservation créée");
            }
            onSave();
            onClose();
        } catch (error) {
            console.error("Save Error:", error);
            toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-600/20">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 leading-tight">
                                {reservation ? "Modifier la Réservation" : "Nouvelle Réservation"}
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Location Planifiée</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {/* Section Client & Equipement */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                <User size={12} /> Client *
                            </label>
                            <select
                                required
                                value={formData.client}
                                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            >
                                <option value="">Sélectionner un client</option>
                                {clients.map(c => (
                                    <option key={c._id} value={c._id}>{c.prenom} {c.nom}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                <Package size={12} /> Équipement *
                            </label>
                            <select
                                required
                                value={formData.equipement}
                                onChange={(e) => setFormData({ ...formData, equipement: e.target.value, unite: "" })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            >
                                <option value="">Sélectionner...</option>
                                {equipements.map(eq => (
                                    <option key={eq._id} value={eq._id}>{eq.icon} {eq.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Unité Spécifique */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                            <Box size={12} /> Unité (N° Série)
                        </label>
                        <select
                            value={formData.unite}
                            disabled={!formData.equipement}
                            onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none disabled:opacity-50"
                        >
                            <option value="">— Attribution automatique au départ —</option>
                            {filteredUnites.map(u => (
                                <option key={u._id} value={u._id}>
                                    {u.serial} ({u.statut === 'disponible' ? '✅ Libre' : `⚠️ ${u.statut}`})
                                </option>
                            ))}
                        </select>
                        <p className="text-[9px] font-bold text-slate-400 ml-1">Laissez vide pour choisir n'importe quelle unité disponible au moment du départ.</p>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date début *</label>
                            <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date fin *</label>
                            <input
                                type="date"
                                required
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Montant & Statut */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                <DollarSign size={12} /> Montant Estimé (MAD)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={formData.montant}
                                onChange={(e) => setFormData({ ...formData, montant: parseInt(e.target.value) || 0 })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Statut Initial</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            >
                                <option value="pending">⏳ En attente</option>
                                <option value="confirmed">✅ Confirmée</option>
                                <option value="cancelled">❌ Annulée</option>
                            </select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                            <FileText size={12} /> Notes & Observations
                        </label>
                        <textarea
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none placeholder:text-slate-300"
                            placeholder="Instructions de livraison, caution, etc..."
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex justify-end items-center gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-10 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 active:scale-95"
                    >
                        {isSubmitting ? "Enregistrement..." : (reservation ? "Mettre à jour" : "Confirmer la Réservation")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReservationModal;