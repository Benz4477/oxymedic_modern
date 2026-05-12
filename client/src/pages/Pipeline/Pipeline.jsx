import React, { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import pipelineService   from "../../services/pipelineService";
import clientService     from "../Clients/services/clientService";
import equipementService from "../../services/equipementService";
import PipelineStats from "./components/PipelineStats";
import PipelineBoard from "./components/PipelineBoard";
import OppModal      from "./components/OppModal";
import ViewOppModal  from "./components/ViewOppModal";

const Pipeline = () => {
  const [opps, setOpps]               = useState([]);
  const [stages, setStages]           = useState([]);
  const [stats, setStats]             = useState({});
  const [clients, setClients]         = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showAdd, setShowAdd]         = useState(false);
  const [showView, setShowView]       = useState(false);
  const [selected, setSelected]       = useState(null);
  const [preStageId, setPreStageId]   = useState(1);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [pipeRes, clientsData, equipData] = await Promise.all([
        pipelineService.getAll(),
        clientService.getAll(),
        equipementService.getAll(),
      ]);
      setOpps(pipeRes.data     || []);
      setStages(pipeRes.stages || []);
      setStats(pipeRes.stats   || {});
      setClients(clientsData);
      setEquipements(equipData);
    } catch {
      toast.error("Erreur chargement pipeline");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Handlers ──────────────────────────────────────────
  const handleCreate = async (data) => {
    try {
      await pipelineService.create(data);
      toast.success("Opportunité créée ✅");
      setShowAdd(false);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const handleMove = async (id, stageId) => {
    try {
      const res = await pipelineService.move(id, stageId);
      toast.success(res.message || "Déplacé ✅");
      await loadData();
    } catch {
      toast.error("Erreur");
    }
  };

  const handleAdvance = async (id) => {
    try {
      const res = await pipelineService.advance(id);
      toast.success(res.message || "Avancé ✅");
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette opportunité ?")) return;
    try {
      await pipelineService.delete(id);
      toast.success("Supprimée");
      await loadData();
    } catch {
      toast.error("Erreur");
    }
  };

  const handleView = (opp) => {
    setSelected(opp);
    setShowView(true);
  };

  const handleAddToStage = (stageId) => {
    setPreStageId(stageId);
    setShowAdd(true);
  };

  // ── Loading ───────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-slate-50/60 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Chargement du pipeline...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Pipeline commercial</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {stats.active || 0} opportunité{(stats.active || 0) !== 1 ? "s" : ""} active{(stats.active || 0) !== 1 ? "s" : ""} · Taux : {stats.rate || 0}%
          </p>
        </div>
        <button
          onClick={() => { setPreStageId(1); setShowAdd(true); }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all"
        >
          <Plus size={16} /> Opportunité
        </button>
      </div>

      {/* KPIs */}
      <PipelineStats stats={stats} />

      {/* Kanban Board */}
      <PipelineBoard
        opps={opps}
        stages={stages}
        onView={handleView}
        onAdvance={handleAdvance}
        onMove={handleMove}
        onAddToStage={handleAddToStage}
      />

      {/* Modals */}
      <OppModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        clients={clients}
        equipements={equipements}
        stages={stages}
        preStageId={preStageId}
        onSave={handleCreate}
      />

      <ViewOppModal
        isOpen={showView}
        onClose={() => setShowView(false)}
        opp={selected}
        stages={stages}
        onMove={handleMove}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Pipeline;