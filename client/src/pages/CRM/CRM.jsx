import React, { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import crmService    from "./services/crmService";
import clientService from "../Clients/services/clientService";
import CrmStats      from "./components/CrmStats";
import CrmTabs       from "./components/CrmTabs";
import TachesList    from "./components/TachesList";
import InteractionsList from "./components/InteractionsList";
import SegmentsList  from "./components/SegmentsList";
import TacheModal    from "./components/TacheModal";
import InteractionModal from "./components/InteractionModal";

const CRM = () => {
  const [activeTab, setActiveTab]     = useState("taches");
  const [stats, setStats]             = useState({});
  const [taches, setTaches]           = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [segments, setSegments]       = useState({});
  const [clients, setClients]         = useState([]);
  const [loading, setLoading]         = useState(true);

  const [showTacheModal, setShowTacheModal]           = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [preClientId, setPreClientId]                 = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, tachesData, interData, segData, clientsData] = await Promise.all([
        crmService.getStats(),
        crmService.getTaches(),
        crmService.getInteractions(),
        crmService.getSegments(),
        clientService.getAll(),
      ]);
      setStats(statsData       || {});
      setTaches(tachesData     || []);
      setInteractions(interData || []);
      setSegments(segData.data  || {});
      setClients(clientsData   || []);
    } catch (err) {
      toast.error("Erreur de chargement CRM");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Tâches ──────────────────────────────────────────────
  const handleToggleTache = async (id) => {
    try {
      await crmService.toggleTache(id);
      await loadData();
    } catch { toast.error("Erreur"); }
  };

  const handleDeleteTache = async (id) => {
    if (!confirm("Supprimer cette tâche ?")) return;
    try {
      await crmService.deleteTache(id);
      toast.success("Tâche supprimée");
      await loadData();
    } catch { toast.error("Erreur"); }
  };

  const handleSaveTache = async (data) => {
    try {
      await crmService.createTache(data);
      toast.success("Tâche créée ✅");
      setShowTacheModal(false);
      setPreClientId(null);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  // ── Interactions ─────────────────────────────────────────
  const handleDeleteInteraction = async (id) => {
    if (!confirm("Supprimer cette interaction ?")) return;
    try {
      await crmService.deleteInteraction(id);
      toast.success("Interaction supprimée");
      await loadData();
    } catch { toast.error("Erreur"); }
  };

  const handleSaveInteraction = async (data) => {
    try {
      await crmService.createInteraction(data);
      toast.success("Interaction enregistrée ✅");
      setShowInteractionModal(false);
      setPreClientId(null);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const openTacheModal = (clientId = null) => { setPreClientId(clientId); setShowTacheModal(true); };
  const openInteractionModal = (clientId = null) => { setPreClientId(clientId); setShowInteractionModal(true); };

  const actionLabel = activeTab === "taches" ? "+ Tâche" : activeTab === "interactions" ? "+ Interaction" : null;
  const handleAction = () => {
    if (activeTab === "taches")        openTacheModal();
    if (activeTab === "interactions")  openInteractionModal();
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50/60 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Chargement CRM...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">CRM — Relation Client</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Suivi des interactions, tâches et opportunités commerciales
          </p>
        </div>
        {actionLabel && (
          <button onClick={handleAction}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all">
            {actionLabel}
          </button>
        )}
      </div>

      {/* KPIs */}
      <CrmStats stats={stats} />

      {/* Tabs */}
      <CrmTabs activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} />

      {/* Contenu */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {activeTab === "taches" && (
          <TachesList
            taches={taches}
            onToggle={handleToggleTache}
            onDelete={handleDeleteTache}
            onNewInteraction={openInteractionModal}
          />
        )}
        {activeTab === "interactions" && (
          <InteractionsList
            interactions={interactions}
            onDelete={handleDeleteInteraction}
          />
        )}
        {activeTab === "segments" && (
          <SegmentsList
            segments={segments}
            onNewTache={openTacheModal}
            onNewInteraction={openInteractionModal}
          />
        )}
      </div>

      {/* Modals */}
      <TacheModal
        isOpen={showTacheModal}
        onClose={() => { setShowTacheModal(false); setPreClientId(null); }}
        clients={clients}
        preClientId={preClientId}
        onSave={handleSaveTache}
      />
      <InteractionModal
        isOpen={showInteractionModal}
        onClose={() => { setShowInteractionModal(false); setPreClientId(null); }}
        clients={clients}
        preClientId={preClientId}
        onSave={handleSaveInteraction}
      />
    </div>
  );
};

export default CRM;