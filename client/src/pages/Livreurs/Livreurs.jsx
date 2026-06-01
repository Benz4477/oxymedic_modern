import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import livreurService from "../../services/livreurService";
import fraisService from "../../services/fraisService";
import LivreurCard from "./components/LivreurCard";
import LivreurModal from "./components/LivreurModal";
import FraisTable from "./components/FraisTable";
import FraisModal from "./components/FraisModal";
import { Plus, RefreshCw, Truck } from "lucide-react";

const Livreurs = () => {
  const [livreurs, setLivreurs] = useState([]);
  const [frais, setFrais] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLivreurModal, setShowLivreurModal] = useState(false);
  const [selectedLivreur, setSelectedLivreur] = useState(null);
  const [showFraisModal, setShowFraisModal] = useState(false);
  const [selectedLivreurForFrais, setSelectedLivreurForFrais] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [livreursData, fraisData] = await Promise.all([
        livreurService.getAll(),
        fraisService.getAll(),
      ]);
      setLivreurs(livreursData);
      setFrais(fraisData);
    } catch (error) {
      toast.error("Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDeleteLivreur = async (id) => {
    if (!confirm("Supprimer ce livreur ?")) return;
    try {
      await livreurService.delete(id);
      toast.success("Livreur supprimé");
      loadData();
    } catch (error) {
      toast.error("Erreur suppression");
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="relative">
        <div className="w-10 h-10 border-2 border-emerald-600/20 rounded-full" />
        <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="p-3 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-100">
            <Truck size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Livreurs & Frais</h1>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {livreurs.length} collaborateurs actifs
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button 
            onClick={loadData}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-slate-600 border border-slate-100 rounded-xl hover:bg-slate-50 transition shadow-sm font-bold text-xs"
          >
            <RefreshCw size={14} /> Rafraîchir
          </button>
          <button 
            onClick={() => { setSelectedLivreur(null); setShowLivreurModal(true); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-md shadow-emerald-100 font-bold text-xs whitespace-nowrap"
          >
            <Plus size={16} /> Nouveau Livreur
          </button>
        </div>
      </div>

      {/* Grid of Livreurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {livreurs.map((l) => (
          <LivreurCard
            key={l._id}
            livreur={l}
            frais={frais.filter((f) => f.livreur?._id === l._id)}
            onEdit={() => { setSelectedLivreur(l); setShowLivreurModal(true); }}
            onDelete={handleDeleteLivreur}
            onAddFrais={() => { setSelectedLivreurForFrais(l); setShowFraisModal(true); }}
          />
        ))}
      </div>

      {/* Recent Frais Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
        <FraisTable frais={frais} onRefresh={loadData} />
      </div>

      <LivreurModal isOpen={showLivreurModal} onClose={() => { setShowLivreurModal(false); setSelectedLivreur(null); }} livreur={selectedLivreur} onSave={loadData} />
      <FraisModal isOpen={showFraisModal} onClose={() => { setShowFraisModal(false); setSelectedLivreurForFrais(null); }} livreur={selectedLivreurForFrais} onSave={loadData} />
    </div>
  );
};

export default Livreurs;