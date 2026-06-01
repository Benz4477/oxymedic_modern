import React, { useState, useEffect, useCallback } from "react";
import { Plus, FileText, Eye, Archive, Trash2, Download, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import contratService from "../../services/contratService";
import commandeService from "../../services/commandeService";
import clientService from "../Clients/services/clientService";
import societeService from "../../services/societeService";
import ContratsTable from "./components/ContratsTable";
import ContratsStats from "./components/ContratsStats";
import ContratsFilters from "./components/ContratsFilters";
import CreateContratModal from "./components/CreateContratModal";
import ViewContratModal from "./components/ViewContratModal";
import SignContratModal from "./components/SignContratModal";

const Contrats = () => {
  const [contrats, setContrats] = useState([]);
  const [stats, setStats] = useState({});
  const [commandes, setCommandes] = useState([]);
  const [clients, setClients] = useState([]);
  const [societe, setSociete] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [contratsRes, commandesData, clientsData, societeData] = await Promise.all([
        contratService.getAll(),
        commandeService.getAll(),
        clientService.getAll(),
        societeService.getAll(),
      ]);
      setContrats(contratsRes.data || []);
      setStats(calculateStats(contratsRes.data || []));
      setCommandes(commandesData || []);
      setClients(clientsData);
      setSociete((societeData?.data && societeData.data[0]) || {});
    } catch (err) {
      toast.error("Erreur de chargement des contrats");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const calculateStats = (contrats) => {
    return {
      total: contrats.length,
      draft: contrats.filter(c => c.statut === "draft").length,
      pending: contrats.filter(c => c.statut === "pending_signature").length,
      signed: contrats.filter(c => c.statut === "signed").length,
    };
  };

  const filtered = contrats.filter(c => {
    const nom = c.clientNom || "";
    const matchSearch = !search ||
      c.reference?.toLowerCase().includes(search.toLowerCase()) ||
      nom.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || c.statut === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = async (data) => {
    try {
      await contratService.create(data);
      toast.success("Contrat créé ✅");
      setShowCreateModal(false);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la création");
    }
  };

  const handleSign = async (signature) => {
    try {
      await contratService.sign(selected._id, signature);
      toast.success("Contrat signé ✅");
      setShowSignModal(false);
      setSelected(null);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la signature");
    }
  };

  const handleArchive = async (id) => {
    try {
      await contratService.archive(id);
      toast.success("Contrat archivé");
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce contrat ?")) return;
    try {
      await contratService.delete(id);
      toast.success("Contrat supprimé");
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  if (loading) return (
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
            <FileText size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Contrats</h1>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {stats.total || 0} contrats • {stats.signed || 0} signés • {stats.pending || 0} en attente
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
            onClick={() => setShowCreateModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-md shadow-emerald-100 font-bold text-xs whitespace-nowrap"
          >
            <Plus size={16} /> Nouveau contrat
          </button>
        </div>
      </div>

      {/* Stats */}
      <ContratsStats stats={stats} />

      {/* Filters */}
      <ContratsFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <ContratsTable
          contrats={filtered}
          onView={(c) => { setSelected(c); setShowViewModal(true); }}
          onSign={(c) => { setSelected(c); setShowSignModal(true); }}
          onArchive={handleArchive}
          onDelete={handleDelete}
        />
      </div>

      {/* Modals */}
      <CreateContratModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        commandes={commandes}
        onSave={handleCreate}
      />

      <ViewContratModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        contrat={selected}
        societe={societe}
        onSign={(c) => { setShowViewModal(false); setSelected(c); setShowSignModal(true); }}
      />

      <SignContratModal
        isOpen={showSignModal}
        onClose={() => setShowSignModal(false)}
        contrat={selected}
        onSign={handleSign}
      />
    </div>
  );
};

export default Contrats;
