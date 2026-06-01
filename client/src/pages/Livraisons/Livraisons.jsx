// client/src/pages/Livraisons/Livraisons.jsx
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import livraisonService from "../../services/livraisonService";
import livreurService from "../../services/livreurService";
import LivraisonCard from "./components/LivraisonCard";
import LivraisonModal from "./components/LivraisonModal";
import { Plus, RefreshCw, MapPin, Calendar, CornerUpLeft } from "lucide-react";

const Livraisons = () => {
  const [livraisons, setLivraisons] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedLivraison, setSelectedLivraison] = useState(null);
  const [filterStatus, setFilterStatus] = useState(""); 

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [livraisonsData, livreursData] = await Promise.all([
        livraisonService.getAll(),
        livreurService.getAll(),
      ]);
      setLivraisons(livraisonsData);
      setLivreurs(livreursData);
    } catch (error) {
      toast.error("Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const getFilteredByStatus = () => {
    if (!filterStatus) return livraisons;
    return livraisons.filter((l) => l.status === filterStatus);
  };

  const getLivraisonsByType = (type) => {
    const filtered = getFilteredByStatus();
    if (type === "aujourdhui")
      return filtered.filter((l) => l.date === "Aujourd'hui" && l.type !== "reprise");
    if (type === "demain")
      return filtered.filter((l) => l.date === "Demain" && l.type !== "reprise");
    if (type === "reprises")
      return filtered.filter((l) => l.type === "reprise");
    return filtered;
  };

  const handleConfirmer = async (id) => {
    try {
      await livraisonService.confirmer(id);
      toast.success("Livraison confirmée");
      loadData();
    } catch (error) {
      toast.error("Erreur confirmation");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette livraison ?")) return;
    try {
      await livraisonService.delete(id);
      toast.success("Livraison supprimée");
      loadData();
    } catch (error) {
      toast.error("Erreur suppression");
    }
  };

  const printBonLivraison = async (id) => {
    try {
      const livraison = await livraisonService.getBonLivraison(id);
      const printWindow = window.open("", "_blank");
      printWindow.document.write(renderBonLivraisonHTML(livraison));
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      toast.error("Erreur impression");
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

  const aujourdhui = getLivraisonsByType("aujourdhui");
  const demain = getLivraisonsByType("demain");
  const reprises = getLivraisonsByType("reprises");

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="p-3 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-100">
            <MapPin size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Livraisons & Logistique</h1>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {livraisons.length} courses prévues
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
            onClick={() => { setSelectedLivraison(null); setShowModal(true); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-md shadow-emerald-100 font-bold text-xs whitespace-nowrap"
          >
            <Plus size={16} /> Programmer
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { id: "", label: "Toutes", cls: "bg-emerald-600 text-white border-emerald-600" },
          { id: "pending", label: "En attente", cls: "bg-amber-500 text-white border-amber-500" },
          { id: "transit", label: "En cours", cls: "bg-blue-600 text-white border-blue-600" },
          { id: "done", label: "Livrées", cls: "bg-emerald-600 text-white border-emerald-600" },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setFilterStatus(s.id)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
              filterStatus === s.id
                ? `${s.cls} shadow-md`
                : "bg-white text-slate-400 border-slate-100 hover:border-slate-200"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aujourd'hui */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-tight">
              <Calendar size={14} className="text-emerald-500" /> Aujourd'hui
            </div>
            <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-lg border border-slate-100 text-slate-400">
              {aujourdhui.length}
            </span>
          </div>
          <div className="flex-1 divide-y divide-slate-50 overflow-y-auto max-h-[600px] scrollbar-hide">
            {aujourdhui.length === 0 ? (
              <div className="p-12 text-center">
                <MapPin size={32} className="text-slate-100 mx-auto mb-3" />
                <p className="text-slate-400 font-bold text-[11px]">Rien de prévu</p>
              </div>
            ) : (
              aujourdhui.map((liv) => (
                <LivraisonCard key={liv._id} livraison={liv} livreurs={livreurs} onConfirm={handleConfirmer} onDelete={handleDelete} onPrint={printBonLivraison} onEdit={() => { setSelectedLivraison(liv); setShowModal(true); }} />
              ))
            )}
          </div>
        </div>

        {/* Demain */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-tight">
              <Calendar size={14} className="text-blue-500" /> Demain
            </div>
            <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-lg border border-slate-100 text-slate-400">
              {demain.length}
            </span>
          </div>
          <div className="flex-1 divide-y divide-slate-50 overflow-y-auto max-h-[600px] scrollbar-hide">
            {demain.length === 0 ? (
              <div className="p-12 text-center">
                <MapPin size={32} className="text-slate-100 mx-auto mb-3" />
                <p className="text-slate-400 font-bold text-[11px]">Rien de prévu</p>
              </div>
            ) : (
              demain.map((liv) => (
                <LivraisonCard key={liv._id} livraison={liv} livreurs={livreurs} onConfirm={handleConfirmer} onDelete={handleDelete} onPrint={printBonLivraison} onEdit={() => { setSelectedLivraison(liv); setShowModal(true); }} />
              ))
            )}
          </div>
        </div>

        {/* Reprises */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-tight">
              <CornerUpLeft size={14} className="text-rose-500" /> Reprises
            </div>
            <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-lg border border-slate-100 text-slate-400">
              {reprises.length}
            </span>
          </div>
          <div className="flex-1 divide-y divide-slate-50 overflow-y-auto max-h-[600px] scrollbar-hide">
            {reprises.length === 0 ? (
              <div className="p-12 text-center">
                <RefreshCw size={32} className="text-slate-100 mx-auto mb-3" />
                <p className="text-slate-400 font-bold text-[11px]">Aucune reprise</p>
              </div>
            ) : (
              reprises.map((liv) => (
                <LivraisonCard key={liv._id} livraison={liv} livreurs={livreurs} onConfirm={handleConfirmer} onDelete={handleDelete} onPrint={printBonLivraison} onEdit={() => { setSelectedLivraison(liv); setShowModal(true); }} />
              ))
            )}
          </div>
        </div>
      </div>

      <LivraisonModal isOpen={showModal} onClose={() => { setShowModal(false); setSelectedLivraison(null); }} livraison={selectedLivraison} livreurs={livreurs} onSave={loadData} />
    </div>
  );
};

const renderBonLivraisonHTML = (livraison) => {
  return `
    <!DOCTYPE html>
    <html>
    <head><title>Bon de livraison</title>
    <style>body{font-family:sans-serif;padding:20px;}</style>
    </head>
    <body>
      <h1>Bon de livraison</h1>
      <p>Client : ${livraison.client?.prenom} ${livraison.client?.nom}</p>
      <p>Adresse : ${livraison.client?.adresse}</p>
      <p>Équipement : ${livraison.equipement?.nom}</p>
      <p>Date : ${livraison.date} à ${livraison.heure}</p>
    </body>
    </html>
  `;
};

export default Livraisons;