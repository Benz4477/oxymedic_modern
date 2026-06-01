import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { ArrowRightLeft, Plus, RefreshCw } from "lucide-react";
import transfertService from "../../services/transfertService";
import magasinService from "../../services/magasinService";
import societeService from "../../services/societeService";
import unitService from "../../services/unitService";
import livreurService from "../../services/livreurService";
import consommableService from "../../services/consommableService";

import TransfertTable from "./components/TransfertTable";
import TransfertStats from "./components/TransfertStats";
import TransfertModal from "./components/TransfertModal";
import TransfertSlipModal from "./components/TransfertSlipModal";

const STATUS_LABELS = {
    pending: "En attente",
    in_transit: "En transit",
    completed: "Terminé",
    cancelled: "Annulé",
};

const STATUS_COLORS = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    in_transit: "bg-emerald-50 text-emerald-600 border-emerald-100",
    completed: "bg-emerald-600 text-white border-emerald-600",
    cancelled: "bg-rose-50 text-rose-600 border-rose-100",
};

const Transferts = () => {
    const [transferts, setTransferts] = useState([]);
    const [magasins, setMagasins] = useState([]);
    const [livreurs, setLivreurs] = useState([]);
    const [availableUnits, setAvailableUnits] = useState([]);
    const [availableConsos, setAvailableConsos] = useState([]);
    const [societe, setSociete] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [showModal, setShowModal] = useState(false);
    const [showSlipModal, setShowSlipModal] = useState(false);
    const [selectedTransfert, setSelectedTransfert] = useState(null);
    
    const currentMagasinId = sessionStorage.getItem("activeMagasinId");
    const activeMagasin = magasins.find(m => m._id === currentMagasinId);
    const canCreate = activeMagasin?.type === "depot" || activeMagasin?.isDefault;

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [trfData, magData, unitsData, socData, livData, consoData] = await Promise.all([
                transfertService.getAll(),
                magasinService.getAll(),
                unitService.getAll({ statut: "disponible" }),
                societeService.getSociete(),
                livreurService.getAll(),
                consommableService.getAll()
            ]);
            
            setTransferts(trfData);
            setMagasins(magData.data || magData || []); 
            setLivreurs(livData || []);
            setAvailableUnits(unitsData || []);
            setAvailableConsos(consoData || []);
            setSociete(socData);
        } catch (error) {
            toast.error("Erreur de chargement des données logistiques");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleCreateTransfert = async (data) => {
        try {
            await transfertService.create(data);
            toast.success("Mouvement de stock initialisé ✅");
            loadData();
            return true;
        } catch (error) {
            throw error;
        }
    };

    const handleUpdateStatus = async (id, status) => {
        const confirmMsg = status === "completed" 
            ? "Confirmer la réception du matériel ? Le stock sera mis à jour."
            : "Confirmer l'expédition du matériel ?";
            
        if (!confirm(confirmMsg)) return;

        try {
            await transfertService.updateStatus(id, status);
            toast.success(`Transfert ${status === "completed" ? "réceptionné" : "expédié"} avec succès`);
            loadData();
        } catch (error) {
            toast.error("Erreur lors de la mise à jour du statut");
        }
    };

    const stats = {
        total: transferts.length,
        pending: transferts.filter(t => t.statut === "pending").length,
        transit: transferts.filter(t => t.statut === "in_transit").length
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
                            <ArrowRightLeft size={24} />
                        </div>
                        Transferts Inter-Sites
                    </h1>
                    <p className="text-slate-400 font-bold text-xs mt-2 ml-14">
                        Gérez et suivez les mouvements de stock entre vos boutiques et entrepôts.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadData}
                        className="flex items-center gap-2 px-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-600 hover:bg-slate-50 transition uppercase tracking-widest shadow-sm"
                    >
                        <RefreshCw size={14} /> Rafraîchir
                    </button>
                    {canCreate && (
                        <button
                            onClick={() => {
                                if (!currentMagasinId) return toast.warning("Veuillez sélectionner un magasin d'origine en haut de page.");
                                setShowModal(true);
                            }}
                            className="flex items-center gap-2 px-6 py-3.5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 active:scale-95"
                        >
                            <Plus size={14} /> Initier un transfert
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <TransfertStats stats={stats} />

            {/* Tableau */}
            <TransfertTable 
                transferts={transferts}
                onStatusUpdate={handleUpdateStatus}
                onPrint={(trf) => {
                    setSelectedTransfert(trf);
                    setShowSlipModal(true);
                }}
                statusLabels={STATUS_LABELS}
                statusColors={STATUS_COLORS}
            />

            {/* Modale de création */}
            <TransfertModal 
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleCreateTransfert}
                magasins={magasins}
                livreurs={livreurs}
                units={availableUnits}
                consommables={availableConsos}
                currentMagasinId={currentMagasinId}
            />

            {/* Modale d'impression Bon de Transfert */}
            <TransfertSlipModal 
                isOpen={showSlipModal}
                onClose={() => {
                    setShowSlipModal(false);
                    setSelectedTransfert(null);
                }}
                transfert={selectedTransfert}
                societe={societe}
            />
        </div>
    );
};

export default Transferts;
