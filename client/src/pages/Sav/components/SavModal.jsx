import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import savService from "../../../services/savService";

const SavModal = ({ isOpen, onClose, ticket, clients, equipements, unites, commandes, onSave }) => {
    const [formData, setFormData] = useState({
        client: "",
        equipement: "",
        unite: "",
        commande: "",
        type: "autre",
        urgency: "moyenne",
        title: "",
        description: "",
        status: "open",
        assignedTo: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (ticket) {
            setFormData({
                client: ticket.client?._id || "",
                equipement: ticket.equipement?._id || "",
                unite: ticket.unite?._id || "",
                commande: ticket.commande?._id || "",
                type: ticket.type,
                urgency: ticket.urgency,
                title: ticket.title,
                description: ticket.description || "",
                status: ticket.status,
                assignedTo: ticket.assignedTo || "",
            });
        } else {
            setFormData({
                client: "",
                equipement: "",
                unite: "",
                commande: "",
                type: "autre",
                urgency: "moyenne",
                title: "",
                description: "",
                status: "open",
                assignedTo: "",
            });
        }
    }, [ticket]);

    // Filtres dynamiques
    const filteredUnites = unites.filter(u => !formData.equipement || (u.equipement?._id || u.equipement) === formData.equipement);
    const filteredCommandes = commandes.filter(c => !formData.client || (c.client?._id || c.client) === formData.client);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.client || !formData.title) {
            toast.error("Veuillez remplir les champs obligatoires");
            return;
        }
        setIsSubmitting(true);
        try {
            if (ticket) {
                await savService.update(ticket._id, formData);
                toast.success("Ticket mis à jour");
            } else {
                await savService.create(formData);
                toast.success("Ticket créé");
            }
            onSave();
            onClose();
        } catch (error) {
            toast.error("Erreur lors de l'enregistrement");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
                    <h3 className="text-xl font-black text-slate-900">{ticket ? "Modifier le ticket" : "Nouveau ticket SAV"}</h3>
                    <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Client */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Client *</label>
                            <select
                                required
                                value={formData.client}
                                onChange={(e) => setFormData({ ...formData, client: e.target.value, commande: "" })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            >
                                <option value="">Sélectionner un client</option>
                                {clients.map(c => (
                                    <option key={c._id} value={c._id}>{c.prenom} {c.nom} — {c.tel}</option>
                                ))}
                            </select>
                        </div>
                        {/* Commande */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Commande liée</label>
                            <select
                                value={formData.commande}
                                onChange={(e) => setFormData({ ...formData, commande: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            >
                                <option value="">— Aucune commande —</option>
                                {filteredCommandes.map(c => (
                                    <option key={c._id} value={c._id}>{c.reference}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Équipement */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Équipement</label>
                            <select
                                value={formData.equipement}
                                onChange={(e) => setFormData({ ...formData, equipement: e.target.value, unite: "" })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            >
                                <option value="">— Non concerné —</option>
                                {equipements.map(eq => (
                                    <option key={eq._id} value={eq._id}>{eq.icon} {eq.name}</option>
                                ))}
                            </select>
                        </div>
                        {/* Unité */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Unité (N° Série)</label>
                            <select
                                value={formData.unite}
                                onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            >
                                <option value="">— Sélectionner S/N —</option>
                                {filteredUnites.map(u => (
                                    <option key={u._id} value={u._id}>{u.serial} ({u.statut})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Type + Urgence */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            >
                                <option value="panne">🔧 Panne / Défaut</option>
                                <option value="livraison">🚚 Problème livraison</option>
                                <option value="facturation">🧾 Litige facture</option>
                                <option value="autre">📋 Autre</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Urgence</label>
                            <select
                                value={formData.urgency}
                                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            >
                                <option value="basse">🔵 Basse</option>
                                <option value="moyenne">🟠 Moyenne</option>
                                <option value="haute">🔴 Haute</option>
                            </select>
                        </div>
                    </div>

                    {/* Titre */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Titre *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            placeholder="Résumé de la réclamation"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description détaillée</label>
                        <textarea
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            placeholder="Décrivez le problème..."
                        />
                    </div>

                    {/* Statut + Assigné à */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Statut</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            >
                                <option value="open">Ouvert</option>
                                <option value="progress">En cours</option>
                                <option value="resolved">Résolu</option>
                                <option value="closed">Fermé</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assigné à</label>
                            <input
                                type="text"
                                value={formData.assignedTo}
                                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                                placeholder="Nom du responsable"
                            />
                        </div>
                    </div>
                </form>

                <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-colors">Annuler</button>
                    <button onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50">
                        {isSubmitting ? "Enregistrement..." : (ticket ? "Mettre à jour" : "Créer le ticket")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SavModal;