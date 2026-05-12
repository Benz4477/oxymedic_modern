import React, { useState, useEffect, useCallback } from "react";
import { Plus, FileText, Eye, Archive, Trash2, Download, CheckCircle, Clock } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50/60 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Chargement des contrats...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Contrats</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {stats.total || 0} contrats • {stats.signed || 0} signés • {stats.pending || 0} en attente
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all"
        >
          <Plus size={16} /> Nouveau contrat
        </button>
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
