import React, { useState } from "react";
import { X, User, Calendar, Flag, FileText, Plus, CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import savService from "../../../services/savService";

const STATUS_ACTIONS = {
    open: "progress",
    progress: "resolved",
    resolved: "closed",
};

const STATUS_BUTTONS = {
    open: { label: "Démarrer", next: "progress", color: "bg-blue-600" },
    progress: { label: "Résoudre", next: "resolved", color: "bg-emerald-600" },
    resolved: { label: "Fermer", next: "closed", color: "bg-slate-600" },
};

const SavDetails = ({ isOpen, onClose, ticket, onRefresh, onEdit, statusLabels, statusColors, urgencyColors, typeIcons }) => {
    const [newNote, setNewNote] = useState("");
    const [isAddingNote, setIsAddingNote] = useState(false);
    const [isChangingStatus, setIsChangingStatus] = useState(false);
    const [isTransferring, setIsTransferring] = useState(false);

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        setIsAddingNote(true);
        try {
            await savService.addNote(ticket._id, newNote);
            toast.success("Note ajoutée");
            setNewNote("");
            onRefresh();
        } catch (error) {
            toast.error("Erreur lors de l'ajout");
        } finally {
            setIsAddingNote(false);
        }
    };

    const handleStatusChange = async () => {
        const next = STATUS_ACTIONS[ticket.status];
        if (!next) return;
        if (!confirm(`Passer ce ticket en "${statusLabels[next]}" ?`)) return;
        setIsChangingStatus(true);
        try {
            await savService.update(ticket._id, { status: next });
            toast.success(`Ticket passé en ${statusLabels[next]}`);
            onRefresh();
        } catch (error) {
            toast.error("Erreur lors du changement de statut");
        } finally {
            setIsChangingStatus(false);
        }
    };

    const handleTransfer = async () => {
        if (!confirm("Voulez-vous transférer ce ticket au service maintenance ?")) return;
        setIsTransferring(true);
        try {
            const result = await savService.convertToMaintenance(ticket._id);
            toast.success(`Transféré ! Nouvelle maintenance : ${result.maintenanceNum}`);
            onRefresh();
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur lors du transfert");
        } finally {
            setIsTransferring(false);
        }
    };

    if (!isOpen || !ticket) return null;

    const nextButton = STATUS_BUTTONS[ticket.status];

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl border border-slate-100">
                            {typeIcons[ticket.type]}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900">{ticket.num}</h3>
                            <p className="text-sm text-slate-500 mt-0.5">{ticket.title}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {/* Infos Client & Commande */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                            <User size={18} className="text-slate-400" />
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Client</div>
                                <div className="text-sm font-bold text-slate-800">{ticket.client?.prenom} {ticket.client?.nom}</div>
                                <div className="text-xs text-slate-500">{ticket.client?.tel}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                            <FileText size={18} className="text-slate-400" />
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Commande</div>
                                <div className="text-sm font-bold text-slate-800">{ticket.commande?.reference || "— Aucun lien —"}</div>
                            </div>
                        </div>
                    </div>

                    {/* Équipement & Unité */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                            <div className="w-5 h-5 flex items-center justify-center text-lg">{ticket.equipement?.icon || "📦"}</div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Équipement</div>
                                <div className="text-sm font-bold text-slate-800">{ticket.equipement?.name || "—"}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                            <RefreshCw size={18} className="text-slate-400" />
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">N° Série (Unité)</div>
                                <div className="text-sm font-bold text-slate-800">{ticket.unite?.serial || "—"}</div>
                                {ticket.unite?.statut && <div className="text-[10px] font-black uppercase text-emerald-600">{ticket.unite.statut}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Statuts & Urgence */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[120px] p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Statut</div>
                            <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${statusColors[ticket.status]}`}>
                                {statusLabels[ticket.status]}
                            </span>
                        </div>
                        <div className="flex-1 min-w-[120px] p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Urgence</div>
                            <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${urgencyColors[ticket.urgency]?.bg} ${urgencyColors[ticket.urgency]?.text} ${urgencyColors[ticket.urgency]?.border}`}>
                                {ticket.urgency}
                            </span>
                        </div>
                        <div className="flex-1 min-w-[120px] p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Responsable</div>
                            <div className="text-sm font-bold text-slate-700">{ticket.assignedTo || "Non assigné"}</div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Description du problème</div>
                        <p className="text-sm text-slate-700 leading-relaxed">{ticket.description || "—"}</p>
                    </div>

                    {/* Historique */}
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Historique des échanges</div>
                        <div className="space-y-3">
                            {ticket.notes?.map((n, idx) => (
                                <div key={idx} className="flex gap-4 p-3 bg-white border border-slate-50 rounded-2xl group hover:border-slate-100 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400">
                                        {n.by?.substring(0, 2).toUpperCase() || "SY"}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-black text-slate-800">{n.by}</span>
                                            <span className="text-[10px] font-mono text-slate-400">{n.date}</span>
                                        </div>
                                        <p className="text-sm text-slate-600">{n.note}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Ajouter une note */}
                        <div className="mt-6 flex gap-2">
                            <input
                                type="text"
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Taper une note..."
                                className="flex-1 bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            />
                            <button
                                onClick={handleAddNote}
                                disabled={isAddingNote || !newNote.trim()}
                                className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition shadow-lg disabled:opacity-50"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex flex-wrap justify-end gap-3">
                    {ticket.type === "panne" && ticket.status !== "closed" && (
                        <button
                            onClick={handleTransfer}
                            disabled={isTransferring}
                            className="px-6 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2"
                        >
                            <RefreshCw size={14} className={isTransferring ? "animate-spin" : ""} />
                            Transférer en Maintenance
                        </button>
                    )}
                    {nextButton && ticket.status !== "closed" && (
                        <button
                            onClick={handleStatusChange}
                            disabled={isChangingStatus}
                            className={`px-6 py-2.5 ${nextButton.color} text-white rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition shadow-lg disabled:opacity-50`}
                        >
                            {nextButton.label}
                        </button>
                    )}
                    <button onClick={onClose} className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-colors">
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SavDetails;