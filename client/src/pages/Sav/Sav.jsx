import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Plus, Search, AlertTriangle, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import savService from "../../services/savService";
import clientService from "../../services/clientService";
import equipementService from "../../services/equipementService";
import unitService from "../../services/unitService";
import commandeService from "../../services/commandeService";
import SavTable from "./components/SavTable";
import SavModal from "./components/SavModal";
import SavDetails from "./components/SavDetails";

const STATUS_LABELS = {
    open: "Ouvert",
    progress: "En cours",
    resolved: "Résolu",
    closed: "Fermé",
};

const STATUS_COLORS = {
    open: "bg-rose-50 text-rose-600 border-rose-100",
    progress: "bg-amber-50 text-amber-600 border-amber-100",
    resolved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    closed: "bg-slate-50 text-slate-500 border-slate-100",
};

const URGENCY_COLORS = {
    haute: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
    moyenne: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
    basse: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
};

const TYPE_ICONS = {
    panne: "🔧",
    livraison: "🚚",
    facturation: "🧾",
    autre: "📋",
};

const Sav = () => {
    const [tickets, setTickets] = useState([]);
    const [clients, setClients] = useState([]);
    const [equipements, setEquipements] = useState([]);
    const [unites, setUnites] = useState([]);
    const [commandes, setCommandes] = useState([]);
    const [stats, setStats] = useState({ open: 0, progress: 0, resolved: 0, urgent: 0, resolvedThisMonth: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [filterStatus, setFilterStatus] = useState("");
    const [filterUrgency, setFilterUrgency] = useState("");

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [ticketsData, clientsData, equipData, statsData, unitsData, cmdData] = await Promise.all([
                savService.getAll(),
                clientService.getAll(),
                equipementService.getAll(),
                savService.getStats(),
                unitService.getAll(),
                commandeService.getAll(),
            ]);
            setTickets(ticketsData);
            setClients(clientsData);
            setEquipements(equipData.filter(e => !e.archived));
            setStats(statsData);
            setUnites(unitsData);
            setCommandes(cmdData);
        } catch (error) {
            toast.error("Erreur de chargement");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDelete = async (id) => {
        if (!confirm("Supprimer ce ticket ?")) return;
        try {
            await savService.delete(id);
            toast.success("Ticket supprimé");
            loadData();
        } catch (error) {
            toast.error("Erreur lors de la suppression");
        }
    };

    const filteredTickets = tickets.filter(t => {
        if (filterStatus && t.status !== filterStatus) return false;
        if (filterUrgency && t.urgency !== filterUrgency) return false;
        return true;
    });

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">SAV – Service Après-Vente</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Gestion des réclamations clients et suivi des interventions</p>
                </div>
                <button
                    onClick={() => {
                        setSelectedTicket(null);
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                >
                    <Plus size={14} /> Nouveau ticket
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-50 rounded-xl">
                            <AlertTriangle size={20} className="text-rose-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{stats.open}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ouverts</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-xl">
                            <Clock size={20} className="text-amber-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{stats.progress}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">En cours</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-xl">
                            <CheckCircle size={20} className="text-emerald-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{stats.resolved}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Résolus</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 rounded-xl">
                            <XCircle size={20} className="text-red-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{stats.urgent}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Urgents</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 rounded-xl">
                            <TrendingUp size={20} className="text-purple-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{stats.resolvedThisMonth}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Résolus ce mois</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterStatus("")}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${filterStatus === "" ? "bg-slate-800 text-white" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                            }`}
                    >
                        Tous
                    </button>
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setFilterStatus(key)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${filterStatus === key ? "bg-slate-800 text-white" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <select
                    value={filterUrgency}
                    onChange={(e) => setFilterUrgency(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                    <option value="">Toutes urgences</option>
                    <option value="haute">🔴 Haute</option>
                    <option value="moyenne">🟠 Moyenne</option>
                    <option value="basse">🔵 Basse</option>
                </select>
            </div>

            {/* Tableau */}
            <SavTable
                tickets={filteredTickets}
                onView={(t) => {
                    setSelectedTicket(t);
                    setShowDetails(true);
                }}
                onEdit={(t) => {
                    setSelectedTicket(t);
                    setShowModal(true);
                }}
                onDelete={handleDelete}
                statusLabels={STATUS_LABELS}
                statusColors={STATUS_COLORS}
                urgencyColors={URGENCY_COLORS}
                typeIcons={TYPE_ICONS}
            />

            {/* Modal Ajout/Modification */}
            <SavModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedTicket(null);
                }}
                ticket={selectedTicket}
                clients={clients}
                equipements={equipements}
                unites={unites}
                commandes={commandes}
                onSave={loadData}
            />

            {/* Modal Détails */}
            <SavDetails
                isOpen={showDetails}
                onClose={() => {
                    setShowDetails(false);
                    setSelectedTicket(null);
                }}
                ticket={selectedTicket}
                onRefresh={loadData}
                onEdit={() => {
                    setShowDetails(false);
                    setShowModal(true);
                }}
                statusLabels={STATUS_LABELS}
                statusColors={STATUS_COLORS}
                urgencyColors={URGENCY_COLORS}
                typeIcons={TYPE_ICONS}
            />
        </div>
    );
};

export default Sav;