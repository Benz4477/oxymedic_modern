import React, { useState, useEffect, useCallback } from "react";
import { Plus, CreditCard, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import paiementService from "../../services/paiementService";
import clientService   from "../../services/clientService";
import commandeService from "../../services/commandeService";
import factureService  from "../../services/factureService";
import api             from "../../api";
import PaiementStats   from "./components/PaiementStats";
import PaiementFilters from "./components/PaiementFilters";
import PaiementTable   from "./components/PaiementTable";
import PaiementModal   from "./components/PaiementModal";
import PaiementDetailModal  from "./components/PaiementDetailModal";
import PaiementReceiptModal from "./components/PaiementReceiptModal";

const EMPTY_FORM = {
  client: "", commande: "", facture: "", montant: 0,
  modePaiement: "espece", type: "solde",
  statut: "pending", datePaiement: "",
  banque: "", referenceBancaire: "", note: "",
};

const Paiements = () => {
  const [paiements, setPaiements] = useState([]);
  const [stats, setStats]         = useState({});
  const [clients, setClients]     = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [factures, setFactures]   = useState([]);
  const [societe, setSociete]     = useState({});
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modeFilter, setModeFilter]     = useState("");
  const [showModal, setShowModal]   = useState(false);
  const [editMode, setEditMode]     = useState(false);
  const [selected, setSelected]     = useState(null);
  const [formData, setFormData]     = useState(EMPTY_FORM);
  const [showDetail, setShowDetail] = useState(false);
  const [detailPaiement, setDetailPaiement]   = useState(null);
  const [showReceipt, setShowReceipt]         = useState(false);
  const [receiptPaiement, setReceiptPaiement] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [paiRes, clientsData, commandesData, facturesData, societeData] = await Promise.all([
        paiementService.getAll(),
        clientService.getAll(),
        commandeService.getAll(),
        factureService.getAll().catch(() => []),
        api.get("/societe").then(r => r.data?.data || r.data).catch(() => ({})),
      ]);
      setPaiements(paiRes.data || []);
      setStats(paiRes.stats || {});
      setClients(clientsData);
      setCommandes(commandesData);
      setFactures(Array.isArray(facturesData) ? facturesData : facturesData?.data || []);
      setSociete(societeData || {});
    } catch (error) {
      toast.error("Erreur de chargement des paiements");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = paiements.filter((p) => {
    const clientNom = p.client ? `${p.client.prenom || ""} ${p.client.nom || ""}` : "";
    const cmdRef    = p.commande?.reference || "";
    const matchSearch = !search ||
      p.reference?.toLowerCase().includes(search.toLowerCase()) ||
      clientNom.toLowerCase().includes(search.toLowerCase()) ||
      cmdRef.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || p.statut === statusFilter;
    const matchMode   = !modeFilter   || p.modePaiement === modeFilter;
    return matchSearch && matchStatus && matchMode;
  });

  const handleAdd = () => {
    setEditMode(false);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const handleEdit = (p) => {
    setEditMode(true);
    setSelected(p);
    setFormData({
      client:            p.client?._id    || p.client    || "",
      commande:          p.commande?._id  || p.commande  || "",
      facture:           p.facture?._id   || p.facture   || "",
      montant:           p.montant        || 0,
      modePaiement:      p.modePaiement   || "espece",
      type:              p.type           || "solde",
      statut:            p.statut         || "pending",
      datePaiement:      p.datePaiement   ? p.datePaiement.split("T")[0] : "",
      banque:            p.banque         || "",
      referenceBancaire: p.referenceBancaire || "",
      note:              p.note           || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.client)  return toast.error("Client requis");
      if (!formData.montant) return toast.error("Montant requis");
      if (editMode && selected) {
        await paiementService.update(selected._id, formData);
        toast.success("Paiement mis à jour");
      } else {
        await paiementService.create(formData);
        toast.success("Paiement enregistré ✅");
      }
      setShowModal(false);
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleConfirmer = async (id) => {
    try {
      await paiementService.confirmer(id);
      toast.success("Paiement confirmé ✅");
      await loadData();
    } catch {
      toast.error("Erreur lors de la confirmation");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce paiement ?")) return;
    try {
      await paiementService.delete(id);
      toast.success("Paiement supprimé");
      await loadData();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleExport = () => {
    const headers = ["Référence", "Client", "Commande", "Facture", "Montant", "Mode", "Type", "Statut", "Date"];
    const rows = filtered.map(p => [
      p.reference,
      p.client ? `${p.client.prenom} ${p.client.nom}` : "—",
      p.commande?.reference || "—",
      p.facture?.num || "—",
      p.montant,
      p.modePaiement,
      p.type,
      p.statut,
      p.datePaiement ? new Date(p.datePaiement).toLocaleDateString("fr-FR") : "—",
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `paiements_${new Date().toISOString().split("T")[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
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
            <CreditCard size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Paiements</h1>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {paiements.length} paiement{paiements.length !== 1 ? "s" : ""} • {stats.countPending || 0} en attente
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
            onClick={handleAdd}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-md shadow-emerald-100 font-bold text-xs whitespace-nowrap"
          >
            <Plus size={16} /> Nouveau paiement
          </button>
        </div>
      </div>

      <PaiementStats stats={stats} />

      <PaiementFilters
        search={search}             setSearch={setSearch}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        modeFilter={modeFilter}     setModeFilter={setModeFilter}
        onExport={handleExport}
      />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <PaiementTable
          paiements={filtered}
          onView={(p) => { setDetailPaiement(p); setShowDetail(true); }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onConfirmer={handleConfirmer}
          onRecu={(p) => { setReceiptPaiement(p); setShowReceipt(true); }}
        />
      </div>

      <PaiementModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editMode={editMode}
        formData={formData}
        setFormData={setFormData}
        clients={clients}
        commandes={commandes}
        factures={factures}
        onSave={handleSave}
      />

      <PaiementReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        paiement={receiptPaiement}
        societe={societe}
      />

      <PaiementDetailModal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        paiement={detailPaiement}
      />
    </div>
  );
};

export default Paiements;