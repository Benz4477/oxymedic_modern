import React, { useState } from "react";
import { X, Clock, User, Calendar, DollarSign, FileText, Plus } from "lucide-react";
import { toast } from "react-toastify";
import maintenanceService from "../../../services/maintenanceService";

const MaintenanceDetails = ({ isOpen, onClose, maintenance, onRefresh, onEdit, statusColors, priorityColors }) => {
    const [newNote, setNewNote] = useState("");
    const [isAddingNote, setIsAddingNote] = useState(false);

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        setIsAddingNote(true);
        try {
            await maintenanceService.addNote(maintenance._id, newNote);
            toast.success("Note ajoutée");
            setNewNote("");
            onRefresh();
        } catch (error) {
            toast.error("Erreur lors de l'ajout de la note");
        } finally {
            setIsAddingNote(false);
        }
    };

    if (!isOpen || !maintenance) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm">
                            {maintenance.equipement?.photo ? (
                                <img src={maintenance.equipement.photo} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl">{maintenance.equipement?.icon || "📦"}</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900">{maintenance.num || `Intervention #${maintenance.id}`}</h3>
                            <p className="text-sm text-slate-500 mt-0.5 font-bold uppercase tracking-tight">{maintenance.equipement?.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {/* Informations générales */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <Clock size={18} className="text-slate-400" />
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</div>
                                <div className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${statusColors[maintenance.status]}`}>
                                    {maintenance.status === "open" ? "Ouvert" : maintenance.status === "progress" ? "En cours" : maintenance.status === "scheduled" ? "Planifié" : "Clôturé"}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="w-5 h-5" />
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Priorité</div>
                                <div className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${priorityColors[maintenance.priority]?.bg} ${priorityColors[maintenance.priority]?.text} ${priorityColors[maintenance.priority]?.border}`}>
                                    {maintenance.priority === "haute" ? "Haute" : maintenance.priority === "moyenne" ? "Moyenne" : "Basse"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <Calendar size={18} className="text-slate-400" />
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dates</div>
                                <div className="text-sm font-bold text-slate-800">Ouvert: {maintenance.dateOuvert}</div>
                                {maintenance.datePrev && <div className="text-xs text-slate-500">Prévue: {maintenance.datePrev}</div>}
                                {maintenance.dateCloture && <div className="text-xs text-emerald-600">Clôturée: {maintenance.dateCloture}</div>}
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <User size={18} className="text-slate-400" />
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Technicien</div>
                                <div className="text-sm font-bold text-slate-800">{maintenance.technicien || "Non assigné"}</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <DollarSign size={18} className="text-slate-400" />
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Coût</div>
                            <div className="text-sm font-bold text-slate-800">{maintenance.cout.toLocaleString()} MAD</div>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Description</div>
                        <p className="text-sm text-slate-700">{maintenance.description}</p>
                    </div>

                    {maintenance.savSource && (
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm border border-emerald-50">
                                    🛠️
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Origine SAV</div>
                                    <div className="text-sm font-bold text-emerald-900">{maintenance.savSource.num} — {maintenance.savSource.title}</div>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity">LIÉ</span>
                        </div>
                    )}

                    {maintenance.notes && (
                        <div className="p-4 bg-amber-50 rounded-xl">
                            <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">Notes internes</div>
                            <p className="text-sm text-slate-700">{maintenance.notes}</p>
                        </div>
                    )}

                    {/* Historique */}
                    <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Historique des actions</div>
                        <div className="space-y-2">
                            {maintenance.historique?.map((h, idx) => (
                                <div key={idx} className="flex gap-3 text-sm border-b border-slate-100 pb-2">
                                    <span className="text-xs font-mono text-slate-400 w-24">{h.date}</span>
                                    <span className="font-semibold text-slate-700 w-24">{h.user}</span>
                                    <span className="text-slate-600 flex-1">{h.action}</span>
                                </div>
                            ))}
                            {(!maintenance.historique || maintenance.historique.length === 0) && (
                                <p className="text-sm text-slate-400 italic">Aucun historique</p>
                            )}
                        </div>

                        {/* Ajouter une note */}
                        <div className="mt-4 flex gap-2">
                            <input
                                type="text"
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Ajouter une note..."
                                className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-2 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
                            />
                            <button
                                onClick={handleAddNote}
                                disabled={isAddingNote || !newNote.trim()}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition disabled:opacity-50"
                            >
                                <Plus size={14} /> Ajouter
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex justify-end gap-3">
                    {maintenance.status !== "done" && (
                        <button onClick={() => onEdit()} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition shadow-lg shadow-blue-500/20">
                            Modifier
                        </button>
                    )}
                    <button onClick={onClose} className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-colors">Fermer</button>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceDetails;