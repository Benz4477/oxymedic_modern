import React, { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import devisService      from "./services/devisService";
import clientService     from "../Clients/services/clientService";
import equipementService from "../../services/equipementService";
import DevisStats   from "./components/DevisStats";
import DevisFilters from "./components/DevisFilters";
import DevisTable   from "./components/DevisTable";
import DevisModal   from "./components/DevisModal";
import ConvertModal from "./components/ConvertModal";
import DevisViewModal from "./components/DevisViewModal";

const Devis = () => {
  const [devis, setDevis]           = useState([]);
  const [stats, setStats]           = useState({});
  const [clients, setClients]       = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [societe, setSociete]       = useState({});
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal]       = useState(false);
  const [showConvert, setShowConvert]   = useState(false);
  const [showView, setShowView]         = useState(false);
  const [editMode, setEditMode]         = useState(false);
  const [selected, setSelected]         = useState(null);

  // ── Chargement ────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [devisRes, clientsData, equipData, societeData] = await Promise.all([
        devisService.getAll(),
        clientService.getAll(),
        equipementService.getAll(),
        fetch("/api/societe").then(r => r.json()).then(r => r.data || {}),
      ]);
      setDevis(devisRes.data || []);
      setStats(devisRes.stats || {});
      setClients(clientsData);
      setEquipements(equipData);
      setSociete(societeData);
    } catch (err) {
      toast.error("Erreur de chargement des devis");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Filtrage ──────────────────────────────────────────
  const filtered = devis.filter(d => {
    const nom = d.clientNom || (d.client ? `${d.client.prenom} ${d.client.nom}` : "");
    const matchSearch = !search ||
      d.reference?.toLowerCase().includes(search.toLowerCase()) ||
      nom.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── CRUD ─────────────────────────────────────────────
  const handleSave = async (data) => {
    try {
      if (editMode && selected) {
        await devisService.update(selected._id, data);
        toast.success("Devis mis à jour ✅");
      } else {
        await devisService.create(data);
        toast.success("Devis créé ✅");
      }
      setShowModal(false);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleSend = async (d) => {
    try {
      await devisService.send(d._id);
      toast.success("Devis envoyé 📤");
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const handleAccept = async (d) => {
    try {
      await devisService.accept(d._id);
      toast.success("Devis accepté ✅");
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const handleReject = async (d) => {
    try {
      await devisService.reject(d._id);
      toast.success("Devis refusé");
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const handleDelete = async (d) => {
    if (!confirm("Supprimer ce devis ?")) return;
    try {
      await devisService.delete(d._id);
      toast.success("Devis supprimé");
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const handleConvert = async (formData) => {
    try {
      const res = await devisService.convert(selected._id, formData);
      toast.success(res.message || "Converti en commande ✅");
      setShowConvert(false);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la conversion");
    }
  };

  // ── Loading ───────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-slate-50/60 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Chargement des devis...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Devis</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {stats.total || 0} devis • {stats.converted || 0} convertis • Taux : {stats.conversionRate || 0}%
          </p>
        </div>
        <button
          onClick={() => { setEditMode(false); setSelected(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all">
          <Plus size={16} /> Nouveau devis
        </button>
      </div>

      {/* ── KPIs ── */}
      <DevisStats stats={stats} />

      {/* ── Filtres ── */}
      <DevisFilters
        search={search}             setSearch={setSearch}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
      />

      {/* ── Tableau ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <DevisTable
          devis={filtered}
          onView={(d) => { setSelected(d); setShowView(true); }}
          onEdit={(d) => { setSelected(d); setEditMode(true); setShowModal(true); }}
          onSend={handleSend}
          onAccept={handleAccept}
          onReject={handleReject}
          onDelete={handleDelete}
          onConvert={(d) => { setSelected(d); setShowConvert(true); }}
        />
      </div>

      {/* ── Modals ── */}
      <DevisModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editMode={editMode}
        initialData={selected}
        clients={clients}
        equipements={equipements}
        onSave={handleSave}
      />

      <ConvertModal
        isOpen={showConvert}
        onClose={() => setShowConvert(false)}
        devis={selected}
        equipements={equipements}
        onConvert={handleConvert}
      />

      <DevisViewModal
        isOpen={showView}
        onClose={() => setShowView(false)}
        devis={selected}
        societe={societe}
        onSend={handleSend}
        onAccept={handleAccept}
        onConvert={(d) => { setShowView(false); setSelected(d); setShowConvert(true); }}
      />
    </div>
  );
};

export default Devis;