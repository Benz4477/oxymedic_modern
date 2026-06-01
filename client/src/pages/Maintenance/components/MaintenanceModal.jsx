import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import maintenanceService from "../../../services/maintenanceService";

const MaintenanceModal = ({ isOpen, onClose, maintenance, equipements, unites, techniciens, onSave }) => {
    const [formData, setFormData] = useState({
        equipement: "",
        unite: "",
        type: "curative",
        description: "",
        priority: "moyenne",
        status: "open",
        technicien: "",
        datePrev: "",
        cout: 0,
        notes: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filteredUnites, setFilteredUnites] = useState([]);

    useEffect(() => {
        if (maintenance) {
            setFormData({
                equipement: maintenance.equipement?._id || "",
                unite: maintenance.unite?._id || "",
                type: maintenance.type,
                description: maintenance.description,
                priority: maintenance.priority,
                status: maintenance.status,
                technicien: maintenance.technicien || "",
                datePrev: maintenance.datePrev?.split("/").reverse().join("-") || "",
                cout: maintenance.cout || 0,
                notes: maintenance.notes || "",
            });
        } else {
            setFormData({
                equipement: "",
                unite: "",
                type: "curative",
                description: "",
                priority: "moyenne",
                status: "open",
                technicien: "",
                datePrev: "",
                cout: 0,
                notes: "",
            });
        }
    }, [maintenance]);

    useEffect(() => {
        if (formData.equipement) {
            const filtered = unites.filter(u => {
                // Comparer les IDs en string (l'ObjectId populé peut être un objet)
                const equipId = typeof u.equipement === "object" ? u.equipement._id?.toString() : u.equipement?.toString();
                return equipId === formData.equipement;
            });
            setFilteredUnites(filtered);
        } else {
            setFilteredUnites([]);
        }
    }, [formData.equipement, unites]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.equipement || !formData.description) {
            toast.error("Veuillez remplir les champs obligatoires");
            return;
        }
        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                datePrev: formData.datePrev ? new Date(formData.datePrev).toLocaleDateString("fr-FR") : "",
            };
            if (maintenance) {
                await maintenanceService.update(maintenance._id, payload);
                toast.success("Intervention mise à jour");
            } else {
                // Ajouter la date d'ouverture pour la création
                const finalPayload = {
                    ...payload,
                    dateOuvert: new Date().toLocaleDateString("fr-FR")
                };
                await maintenanceService.create(finalPayload);
                toast.success("Intervention créée");
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
                    <h3 className="text-xl font-black text-slate-900">{maintenance ? "Modifier l'intervention" : "Nouvelle intervention"}</h3>
                    <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                    {/* Équipement */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Équipement *</label>
                        <select
                            required
                            value={formData.equipement}
                            onChange={(e) => setFormData({ ...formData, equipement: e.target.value, unite: "" })}
                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                        >
                            <option value="">Sélectionner un équipement</option>
                            {equipements.map(eq => (
                                <option key={eq._id} value={eq._id}>{eq.icon} {eq.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Unité (N° série) */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Unité (N° série) – optionnel</label>
                        <select
                            value={formData.unite}
                            onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-mono font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                        >
                            <option value="">— Non assigné —</option>
                            {filteredUnites.map(u => (
                                <option key={u._id} value={u._id}>{u.serial} ({u.statut})</option>
                            ))}
                        </select>
                    </div>

                    {/* Type + Priorité */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            >
                                <option value="preventive">🛡️ Préventive</option>
                                <option value="curative">🔧 Curative</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Priorité</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            >
                                <option value="basse">🔵 Basse</option>
                                <option value="moyenne">🟠 Moyenne</option>
                                <option value="haute">🔴 Haute</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description *</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            placeholder="Décrivez la panne ou l'entretien..."
                        />
                    </div>

                    {/* Technicien + Date prévue */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Technicien</label>
                            <select
                                value={formData.technicien}
                                onChange={(e) => setFormData({ ...formData, technicien: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            >
                                <option value="">— Non assigné —</option>
                                {techniciens.map(t => (
                                    <option key={t._id} value={t.name}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date prévue</label>
                            <input
                                type="date"
                                value={formData.datePrev}
                                onChange={(e) => setFormData({ ...formData, datePrev: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Coût + Statut */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Coût (MAD)</label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={formData.cout}
                                onChange={(e) => setFormData({ ...formData, cout: parseInt(e.target.value) || 0 })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Statut initial</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            >
                                <option value="open">Ouvert</option>
                                <option value="scheduled">Planifié</option>
                                <option value="progress">En cours</option>
                            </select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Notes internes</label>
                        <textarea
                            rows={2}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            placeholder="Observations, pièces à commander..."
                        />
                    </div>
                </form>

                <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-colors">Annuler</button>
                    <button onClick={handleSubmit} disabled={isSubmitting} className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50">
                        {isSubmitting ? "Enregistrement..." : (maintenance ? "Mettre à jour" : "Créer l'intervention")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceModal;