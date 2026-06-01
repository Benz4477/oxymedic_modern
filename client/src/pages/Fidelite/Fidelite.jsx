import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Plus, Award, TrendingUp, Users, Gift, Star } from "lucide-react";
import loyaltyService from "../../services/loyaltyService";
import clientService from "../../services/clientService";
import FideliteTable from "./components/FideliteTable";
import FideliteModal from "./components/FideliteModal";
import PointsModal from "./components/PointsModal";
import FideliteCard from "./components/FideliteCard";
import FideliteIdentityCard from "./components/FideliteIdentityCard";

const TIER_CONFIG = {
    bronze: { name: "Bronze", color: "bg-amber-100 text-amber-700 border-amber-200", minPoints: 0, discount: 0 },
    silver: { name: "Argent", color: "bg-slate-100 text-slate-700 border-slate-200", minPoints: 500, discount: 5 },
    gold: { name: "Or", color: "bg-yellow-100 text-yellow-700 border-yellow-200", minPoints: 1500, discount: 10 },
    platinum: { name: "Platinum", color: "bg-purple-100 text-purple-700 border-purple-200", minPoints: 3000, discount: 15 },
};

const Fidelite = () => {
    const [cards, setCards] = useState([]);
    const [clients, setClients] = useState([]);
    const [stats, setStats] = useState({ totalCards: 0, totalPoints: 0, totalSpent: 0, byTier: {} });
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showPointsModal, setShowPointsModal] = useState(false);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [pointsAction, setPointsAction] = useState("add"); // "add" ou "use"

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [cardsData, clientsData, statsData] = await Promise.all([
                loyaltyService.getAll(),
                clientService.getAll(),
                loyaltyService.getStats(),
            ]);
            setCards(cardsData);
            setClients(clientsData);
            setStats(statsData);
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
        if (!confirm("Supprimer cette carte de fidélité ?")) return;
        try {
            await loyaltyService.delete(id);
            toast.success("Carte supprimée");
            loadData();
        } catch (error) {
            toast.error("Erreur lors de la suppression");
        }
    };

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
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Cartes de fidélité</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Gérez les points et niveaux de fidélité de vos clients</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                >
                    <Plus size={14} /> Créer une carte
                </button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
                            <Users size={20} />
                        </div>
                        <div className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Total</div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black text-slate-900 leading-none">{stats.totalCards}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Cartes Actives</div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100 group-hover:scale-110 transition-transform">
                            <Star size={20} />
                        </div>
                        <div className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Engagement</div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black text-slate-900 leading-none">{stats.totalPoints.toLocaleString()}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Points Distribués</div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                            <TrendingUp size={20} />
                        </div>
                        <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Chiffre</div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black text-slate-900 leading-none">{stats.totalSpent.toLocaleString()} <span className="text-xs font-bold text-slate-400 ml-1">MAD</span></div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">CA Clients Fidèles</div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100 group-hover:scale-110 transition-transform">
                            <Award size={20} />
                        </div>
                        <div className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Vips</div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-black text-slate-900 leading-none">{stats.byTier?.gold || 0}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Membres Or & Platinum</div>
                    </div>
                </div>
            </div>

            {/* Niveaux légende */}
            <div className="flex flex-wrap gap-2">
                {Object.entries(TIER_CONFIG).map(([key, cfg]) => (
                    <div key={key} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${cfg.color}`}>
                        {key === "bronze" && "🥉 Bronze"}
                        {key === "silver" && "🥈 Argent"}
                        {key === "gold" && "🥇 Or"}
                        {key === "platinum" && "💎 Platinum"}
                    </div>
                ))}
            </div>

            {/* Tableau des cartes */}
            <FideliteTable
                cards={cards}
                clients={clients}
                tierConfig={TIER_CONFIG}
                onView={(card) => {
                    setSelectedClient(card.client);
                    setShowPointsModal(true);
                    setPointsAction("add");
                }}
                onAddPoints={(card) => {
                    setSelectedClient(card.client);
                    setPointsAction("add");
                    setShowPointsModal(true);
                }}
                onUsePoints={(card) => {
                    setSelectedClient(card.client);
                    setPointsAction("use");
                    setShowPointsModal(true);
                }}
                onDelete={handleDelete}
                onPrintCard={(card) => {
                    const client = clients.find(c => c._id === card.client?._id || c._id === card.client);
                    setSelectedCard(card);
                    setSelectedClient(client);
                    setShowPrintModal(true);
                }}
            />

            {/* Modal création carte */}
            <FideliteModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                clients={clients}
                onSave={loadData}
            />

            {/* Modal ajout/utilisation points */}
            <PointsModal
                isOpen={showPointsModal}
                onClose={() => {
                    setShowPointsModal(false);
                    setSelectedClient(null);
                }}
                client={selectedClient}
                action={pointsAction}
                onSave={loadData}
            />

            {/* Modal Impression Carte */}
            {showPrintModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300 no-print">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Prévisualisation de la Carte</h2>
                            <button onClick={() => setShowPrintModal(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-all">✕</button>
                        </div>
                        <div className="p-8 print-container">
                            <FideliteIdentityCard card={selectedCard} client={selectedClient} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Fidelite;