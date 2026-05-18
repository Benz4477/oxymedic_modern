import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Plus, Calendar, RefreshCw, Filter } from "lucide-react";
import reservationService from "../../services/reservationService";
import clientService from "../../services/clientService";
import equipementService from "../../services/equipementService";
import unitService from "../../services/unitService";
import societeService from "../../services/societeService";
import ReservationTable from "./components/ReservationTable";
import ReservationModal from "./components/ReservationModal";
import AvailabilityChecker from "./components/AvailabilityChecker";
import ReservationSlipModal from "./components/ReservationSlipModal";

const STATUS_LABELS = {
// ... existing status labels ...
    completed: "Terminée",
};

const STATUS_COLORS = {
// ... existing status colors ...
    completed: "bg-slate-50 text-slate-500 border-slate-100",
};

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [clients, setClients] = useState([]);
    const [equipements, setEquipements] = useState([]);
    const [unites, setUnites] = useState([]);
    const [societe, setSociete] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showSlipModal, setShowSlipModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [selectedSlip, setSelectedSlip] = useState(null);
    const [filterStatus, setFilterStatus] = useState("");

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [resData, clientsData, equipData, unitesData, socData] = await Promise.all([
                reservationService.getAll(),
                clientService.getAll(),
                equipementService.getAll(),
                unitService.getAll(),
                societeService.getSociete(),
            ]);
            setReservations(resData);
            setClients(clientsData);
            setEquipements(equipData);
            setUnites(unitesData);
            setSociete(socData);
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
        if (!confirm("Supprimer cette réservation ?")) return;
        try {
            await reservationService.delete(id);
            toast.success("Réservation supprimée");
            loadData();
        } catch (error) {
            toast.error("Erreur lors de la suppression");
        }
    };

    const handleConvert = async (id) => {
        if (!confirm("Convertir cette réservation en commande ?")) return;
        try {
            await reservationService.convertToCommande(id);
            toast.success("Commande créée avec succès");
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur lors de la conversion");
        }
    };

    const filteredReservations = filterStatus
        ? reservations.filter(r => r.status === filterStatus)
        : reservations;

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-amber-600/20 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 font-display">
                        <div className="p-3 bg-amber-500 rounded-xl text-white shadow-xl shadow-amber-500/10">
                            <Calendar size={22} />
                        </div>
                        Réservations & Locations
                    </h1>
                    <p className="text-slate-400 font-bold text-xs mt-2 ml-14 md:ml-16">
                        Gérez vos équipements en attente et les locations planifiées.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadData}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-[9px] font-bold text-slate-600 hover:bg-slate-50 transition uppercase tracking-widest shadow-sm"
                    >
                        <RefreshCw size={12} /> Rafraîchir
                    </button>
                    <button
                        onClick={() => {
                            setSelectedReservation(null);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-amber-600 transition shadow-lg shadow-amber-500/10 active:scale-95"
                    >
                        <Plus size={12} /> Nouvelle réservation
                    </button>
                </div>
            </div>

            {/* Vérificateur de disponibilité */}
            <AvailabilityChecker equipements={equipements} />

            {/* Filtres */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setFilterStatus("")}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${filterStatus === "" ? "bg-slate-900 text-white border border-slate-900" : "bg-white text-slate-500 border border-slate-200/60 hover:bg-slate-50"
                        }`}
                >
                    Toutes
                </button>
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setFilterStatus(key)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition ${filterStatus === key ? "bg-slate-900 text-white border border-slate-900" : "bg-white text-slate-500 border border-slate-200/60 hover:bg-slate-50"
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Tableau */}
            <ReservationTable
                reservations={filteredReservations}
                onEdit={(r) => {
                    setSelectedReservation(r);
                    setShowModal(true);
                }}
                onDelete={handleDelete}
                onConvert={handleConvert}
                onPrint={(r) => {
                    setSelectedSlip(r);
                    setShowSlipModal(true);
                }}
                statusLabels={STATUS_LABELS}
                statusColors={STATUS_COLORS}
            />

            {/* Modal création/édition */}
            <ReservationModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedReservation(null);
                }}
                reservation={selectedReservation}
                clients={clients}
                equipements={equipements}
                unites={unites}
                onSave={loadData}
            />

            {/* Modal Impression Bon de Réservation */}
            <ReservationSlipModal
                isOpen={showSlipModal}
                onClose={() => {
                    setShowSlipModal(false);
                    setSelectedSlip(null);
                }}
                reservation={selectedSlip}
                societe={societe}
            />
        </div>
    );
};

export default Reservations;