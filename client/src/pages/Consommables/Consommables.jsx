import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Package, AlertTriangle, TrendingUp, Calendar, Plus, ShoppingCart, Search, Filter } from "lucide-react";
import consommableService from "../../services/consommableService";
import venteConsommableService from "../../services/venteConsommableService";
import ConsoGrid from "./components/ConsoGrid";
import VentesTable from "./components/VentesTable";
import CompatEquipList from "./components/CompatEquipList";
import ConsoModal from "./components/ConsoModal";
import VenteModal from "./components/VenteModal";

const Consommables = () => {
  const [consommables, setConsommables] = useState([]);
  const [ventes, setVentes] = useState([]);
  const [stats, setStats] = useState({ total: 0, lowStock: 0, ca: 0, ventesMois: 0 });
  const [activeTab, setActiveTab] = useState("catalogue");
  const [isLoading, setIsLoading] = useState(true);
  const [showConsoModal, setShowConsoModal] = useState(false);
  const [selectedConso, setSelectedConso] = useState(null);
  const [showVenteModal, setShowVenteModal] = useState(false);
  const [selectedConsoForVente, setSelectedConsoForVente] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [consos, ventesData, statsData] = await Promise.all([
        consommableService.getAll(),
        venteConsommableService.getAll(),
        consommableService.getStats(),
      ]);
      setConsommables(consos);
      setVentes(ventesData);
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

  const handleDeleteConso = async (id) => {
    if (!confirm("Supprimer ce consommable ?")) return;
    try {
      await consommableService.delete(id);
      toast.success("Consommable supprimé");
      loadData();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleAjustStock = async (id, qty, type) => {
    try {
      const conso = consommables.find(c => c._id === id);
      const newStock = type === "add" ? conso.stock + qty : conso.stock - qty;
      await consommableService.update(id, { stock: Math.max(0, newStock) });
      toast.success("Stock mis à jour");
      loadData();
    } catch (error) {
      toast.error("Erreur mise à jour stock");
    }
  };

  const filteredConsos = consommables.filter(c => {
    const searchLow = searchTerm.toLowerCase();
    const nameMatch = c.name?.toLowerCase().includes(searchLow) || c.nom?.toLowerCase().includes(searchLow);
    const refMatch = c.ref?.toLowerCase().includes(searchLow) || c.reference?.toLowerCase().includes(searchLow);
    const marqueMatch = c.marque?.toLowerCase().includes(searchLow);
    return nameMatch || refMatch || marqueMatch;
  });

  if (isLoading) 
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="w-8 h-8 border-2 border-emerald-600/20 rounded-full animate-spin border-t-emerald-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-3 md:p-6 space-y-5 md:space-y-6">
      {/* Reduced Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 px-1">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-100">
            <Package size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Consommables</h1>
            <div className="flex items-center gap-2 text-slate-500 text-[11px] md:text-xs font-medium">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              {stats.total} produits au catalogue
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2 w-full xl:w-auto">
          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={14} />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-200/40 border-none rounded-xl text-xs focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => {
                setSelectedConsoForVente(null);
                setShowVenteModal(true);
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-sm font-bold text-xs whitespace-nowrap"
            >
              <ShoppingCart size={14} /> Vente
            </button>
            <button
              onClick={() => {
                setSelectedConso(null);
                setShowConsoModal(true);
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition shadow-sm font-bold text-xs whitespace-nowrap"
            >
              <Plus size={14} /> Nouveau
            </button>
          </div>
        </div>
      </div>

      {/* Smaller KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Références", val: stats.total, icon: Package, color: "emerald", desc: "Produits catalogue" },
          { label: "Stock Bas", val: stats.lowStock, icon: AlertTriangle, color: "amber", desc: "À surveiller" },
          { label: "Chiffre Aff.", val: `${stats.ca.toLocaleString()} MAD`, icon: TrendingUp, color: "emerald", desc: "Total ventes" },
          { label: "Ventes Mois", val: stats.ventesMois, icon: Calendar, color: "purple", desc: "Ce mois" },
        ].map((kpi, i) => (
          <div key={i} className="group bg-slate-200/30 rounded-2xl p-4 md:p-5 hover:bg-white hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 border border-transparent hover:border-emerald-50">
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 bg-white rounded-xl shadow-sm`}>
                <kpi.icon size={18} className={`text-${kpi.color}-600`} />
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-slate-300">Stats</div>
            </div>
            <div className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight mb-0.5">{kpi.val}</div>
            <div className="text-[11px] font-bold text-slate-700 mb-0.5">{kpi.label}</div>
            <p className="text-[10px] text-slate-400 font-medium">{kpi.desc}</p>
          </div>
        ))}
      </div>

      {/* Reduced Tabs */}
      <div className="space-y-4">
        <div className="overflow-x-auto pb-1 scrollbar-hide">
          <div className="flex items-center gap-1 p-1 bg-slate-200/40 rounded-xl w-fit">
            {[
              { id: "catalogue", label: "Catalogue", icon: Package },
              { id: "ventes", label: "Ventes", icon: ShoppingCart },
              { id: "compat", label: "Compatibilité", icon: Filter },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-100"
                    : "text-slate-500 hover:bg-slate-50"
                  }`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
          {activeTab === "catalogue" && (
            <ConsoGrid
              consommables={filteredConsos}
              onEdit={(conso) => {
                setSelectedConso(conso);
                setShowConsoModal(true);
              }}
              onDelete={handleDeleteConso}
              onVendre={(conso) => {
                setSelectedConsoForVente(conso);
                setShowVenteModal(true);
              }}
              onAjusterStock={handleAjustStock}
            />
          )}
          {activeTab === "ventes" && (
            <VentesTable ventes={ventes} onRefresh={loadData} />
          )}
          {activeTab === "compat" && (
            <CompatEquipList
              consommables={consommables}
              onVendre={(conso) => {
                setSelectedConsoForVente(conso);
                setShowVenteModal(true);
              }}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <ConsoModal
        isOpen={showConsoModal}
        onClose={() => {
          setShowConsoModal(false);
          setSelectedConso(null);
        }}
        consommable={selectedConso}
        onSave={loadData}
      />
      <VenteModal
        isOpen={showVenteModal}
        onClose={() => {
          setShowVenteModal(false);
          setSelectedConsoForVente(null);
        }}
        consommable={selectedConsoForVente}
        onSave={loadData}
      />
    </div>
  );
};

export default Consommables;