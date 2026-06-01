// client/src/pages/Cautions/Cautions.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Lock, Search } from 'lucide-react';
import cautionService from '../../services/cautionService';
import clientService from '../../services/clientService';
import commandeService from '../../services/commandeService';
import equipementService from '../../services/equipementService';
import unitService from '../../services/unitService';
import societeService from '../../services/societeService';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';

import CautionStats from './components/CautionsStats';
import CautionFilters from './components/CautionsFilters';
import CautionCard from './components/CautionCard';
import CautionModal from './components/CautionModal';
import CautionActionModal from './components/CautionActionModal';
import CautionViewModal from './components/CautionViewModal';

export default function Cautions() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const [cautions, setCautions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [clients, setClients] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [unites, setUnites] = useState([]);
  const [societe, setSociete] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCaution, setEditingCaution] = useState(null);
  const [actionCaution, setActionCaution] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [viewCaution, setViewCaution] = useState(null);

  const loadCautions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const [list, st] = await Promise.all([
        cautionService.getAll(params),
        cautionService.getStats(),
      ]);
      setCautions(Array.isArray(list) ? list : []);
      setStats(st || {});
    } catch (err) {
      console.error(err);
      toast.error('Erreur de chargement des cautions');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  const loadReferences = useCallback(async () => {
    try {
      const [cl, cmd, eq, un, soc] = await Promise.all([
        clientService.getAll(),
        commandeService.getAll(),
        equipementService.getAll(),
        unitService.getAll(),
        societeService.getSociete(),
      ]);
      setClients(cl);
      setCommandes(cmd);
      setEquipements(eq);
      setUnites(un);
      setSociete(soc);
    } catch (err) {
      console.error('[loadReferences]', err);
    }
  }, []);

  useEffect(() => {
    loadReferences();
  }, [loadReferences]);

  useEffect(() => {
    const timer = setTimeout(loadCautions, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [loadCautions, search]);

  useEffect(() => {
    const handleCommandeUpdate = () => {
      loadCautions();
    };
    window.addEventListener('commandeUpdated', handleCommandeUpdate);
    return () => window.removeEventListener('commandeUpdated', handleCommandeUpdate);
  }, [loadCautions]);

  const handleCreate = async (data) => {
    await cautionService.create(data);
    toast.success('Caution enregistrée');
    loadCautions();
  };

  const handleUpdate = async (data) => {
    await cautionService.update(editingCaution._id, data);
    toast.success('Caution mise à jour');
    setEditingCaution(null);
    loadCautions();
  };

  const handleReturn = async (data) => {
    await cautionService.return(actionCaution._id, data);
    toast.success('Caution restituée');
    loadCautions();
  };

  const handleDeduct = async (data) => {
    await cautionService.deduct(actionCaution._id, data);
    toast.success('Caution déduite');
    loadCautions();
  };

  const handleCancel = async (caution) => {
    if (!window.confirm(`Remettre cette caution en cours ?`)) return;
    try {
      await cautionService.cancel(caution._id);
      toast.success('Caution remise en cours');
      loadCautions();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async (caution) => {
    if (!window.confirm(`Supprimer définitivement la caution ${caution.ref} ?`)) return;
    try {
      await cautionService.remove(caution._id);
      toast.success('Caution supprimée');
      loadCautions();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur');
    }
  };

  if (loading && !stats)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="w-8 h-8 border-2 border-emerald-600/20 rounded-full animate-spin border-t-emerald-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Flat Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="p-3 bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-100">
            <Lock size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Cautions Clients</h1>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Garanties et dépôts de location
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-sm font-bold text-xs"
          >
            <Plus size={16} /> Nouveau Dépôt
          </button>
        </div>
      </div>

      {/* Stats - Redesigned */}
      <CautionStats stats={stats} />

      {/* Filters - Redesigned */}
      <CautionFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* List - Redesigned Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-emerald-600/20 rounded-full animate-spin border-t-emerald-600" />
        </div>
      ) : (cautions?.length || 0) === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-16 md:p-24 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={40} className="text-slate-200" />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Aucune caution trouvée</h3>
          <p className="text-slate-400 font-medium max-w-xs mx-auto text-sm">
            Ajustez vos filtres ou enregistrez un nouveau dépôt de garantie.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cautions.map((c) => (
            <CautionCard
              key={c._id}
              caution={c}
              onReturn={(c) => {
                setActionCaution(c);
                setActionType('return');
              }}
              onDeduct={(c) => {
                setActionCaution(c);
                setActionType('deduct');
              }}
              onCancel={handleCancel}
              onView={(c) => setViewCaution(c)}
              onEdit={(c) => setEditingCaution(c)}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      {/* Modals remain mostly same but could use style updates later if needed */}
      <CautionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreate}
        clients={clients}
        commandes={commandes}
        equipements={equipements}
        unites={unites}
      />

      <CautionModal
        isOpen={!!editingCaution}
        onClose={() => setEditingCaution(null)}
        onSubmit={handleUpdate}
        caution={editingCaution}
        clients={clients}
        commandes={commandes}
        equipements={equipements}
        unites={unites}
      />

      <CautionActionModal
        isOpen={!!actionCaution}
        onClose={() => {
          setActionCaution(null);
          setActionType(null);
        }}
        onConfirm={actionType === 'return' ? handleReturn : handleDeduct}
        caution={actionCaution}
        action={actionType}
      />

      <CautionViewModal
        isOpen={!!viewCaution}
        onClose={() => setViewCaution(null)}
        caution={viewCaution}
        societe={societe}
      />
    </div>
  );
}