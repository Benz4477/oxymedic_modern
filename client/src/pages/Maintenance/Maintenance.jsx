import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Plus, Search, Filter, AlertTriangle, Wrench, Clock, CheckCircle, Calendar } from "lucide-react";
import maintenanceService from "../../services/maintenanceService";
import equipementService from "../../services/equipementService";
import unitService from "../../services/unitService";
import userService from "../../services/userService";
import MaintenanceTable from "./components/MaintenanceTable";
import MaintenanceModal from "./components/MaintenanceModal";
import MaintenanceDetails from "./components/MaintenanceDetails";

const STATUS_LABELS = {
    open: "Ouvert",
    progress: "En cours",
    scheduled: "Planifié",
    done: "Clôturé",
};

const STATUS_COLORS = {
    open: "bg-rose-50 text-rose-600 border-rose-100",
    progress: "bg-amber-50 text-amber-600 border-amber-100",
    scheduled: "bg-blue-50 text-blue-600 border-blue-100",
    done: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

const PRIORITY_COLORS = {
    haute: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
    moyenne: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
    basse: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
};

const Maintenance = () => {
    const [maintenances, setMaintenances] = useState([]);
    const [equipements, setEquipements] = useState([]);
    const [unites, setUnites] = useState([]);
    const [techniciens, setTechniciens] = useState([]);
    const [stats, setStats] = useState({ open: 0, progress: 0, scheduled: 0, doneThisMonth: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedMaintenance, setSelectedMaintenance] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [filterStatus, setFilterStatus] = useState("");
    const [filterEquip, setFilterEquip] = useState("");

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [maintData, equipData, uniteData, statsData, usersData] = await Promise.all([
                maintenanceService.getAll(),
                equipementService.getAll(),
                unitService.getAll(),
                maintenanceService.getStats(),
                userService.getAll(),
            ]);
            const mappedMaintenances = maintData.map(m => ({
                ...m,
                equipement: equipData.find(e => e.id === m.equipId),
                unite: uniteData.find(u => u.id === m.unitId)
            }));
            setMaintenances(mappedMaintenances);
            setEquipements(equipData.filter(e => !e.archived));
            setUnites(uniteData);
            setStats(statsData);
            // Filtrer uniquement les utilisateurs avec le rôle "technicien"
            setTechniciens(usersData.filter(u => u.role === "technicien" && u.status === "active"));
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
        if (!confirm("Supprimer cette intervention ?")) return;
        try {
            await maintenanceService.delete(id);
            toast.success("Intervention supprimée");
            loadData();
        } catch (error) {
            toast.error("Erreur lors de la suppression");
        }
    };

    const handleClose = async (id) => {
        if (!confirm("Clôturer cette intervention ?")) return;
        try {
            await maintenanceService.close(id);
            toast.success("Intervention clôturée");
            loadData();
        } catch (error) {
            toast.error("Erreur lors de la clôture");
        }
    };

    const filteredMaintenances = maintenances.filter(m => {
        if (filterStatus && m.status !== filterStatus) return false;
        if (filterEquip && m.equipement?._id !== filterEquip) return false;
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
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Maintenance des équipements</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Suivi des interventions, pannes et entretiens préventifs</p>
                </div>
                <button
                    onClick={() => {
                        setSelectedMaintenance(null);
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                >
                    <Plus size={14} /> Nouvelle intervention
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-50 rounded-xl">
                            <AlertTriangle size={20} className="text-rose-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{stats.open}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ouvertes</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-xl">
                            <Wrench size={20} className="text-amber-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{stats.progress}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">En cours</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <Calendar size={20} className="text-blue-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{stats.scheduled}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Planifiées</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 rounded-xl">
                            <CheckCircle size={20} className="text-emerald-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{stats.doneThisMonth}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Clôturées ce mois</div>
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
                        Toutes
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
                    value={filterEquip}
                    onChange={(e) => setFilterEquip(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-600 focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                    <option value="">Tous équipements</option>
                    {equipements.map(eq => (
                        <option key={eq._id} value={eq._id}>{eq.icon} {eq.name}</option>
                    ))}
                </select>
            </div>

            {/* Tableau */}
            <MaintenanceTable
                maintenances={filteredMaintenances}
                onView={(m) => {
                    setSelectedMaintenance(m);
                    setShowDetails(true);
                }}
                onEdit={(m) => {
                    setSelectedMaintenance(m);
                    setShowModal(true);
                }}
                onDelete={handleDelete}
                onClose={handleClose}
                statusLabels={STATUS_LABELS}
                statusColors={STATUS_COLORS}
                priorityColors={PRIORITY_COLORS}
            />

            {/* Modal Ajout/Modification */}
            <MaintenanceModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedMaintenance(null);
                }}
                maintenance={selectedMaintenance}
                equipements={equipements}
                unites={unites}
                techniciens={techniciens}
                onSave={loadData}
            />

            {/* Modal Détails */}
            <MaintenanceDetails
                isOpen={showDetails}
                onClose={() => {
                    setShowDetails(false);
                    setSelectedMaintenance(null);
                }}
                maintenance={selectedMaintenance}
                onRefresh={loadData}
                onEdit={() => {
                    setShowDetails(false);
                    setShowModal(true);
                }}
                statusColors={STATUS_COLORS}
                priorityColors={PRIORITY_COLORS}
            />
        </div>
    );
};

export default Maintenance;