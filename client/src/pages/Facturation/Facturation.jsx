import React, { useState, useEffect, useCallback } from "react";
import { Plus, Receipt, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import FactureStats     from "./components/FactureStats";
import FactureFilters   from "./components/FactureFilters";
import FactureTable     from "./components/FactureTable";
import FactureModal     from "./components/FactureModal";
import FactureViewModal from "./components/FactureViewModal";
import FacturePayerModal from "./components/FacturePayerModal";
import factureService  from "./services/factureService";
import clientService   from "../../services/clientService";
import commandeService from "../../services/commandeService";
import api             from "../../api";

const EMPTY_FORM = {
  client: "", clientNom: "", clientEmail: "", clientAdresse: "",
  commande: "", date: new Date().toISOString().split("T")[0],
  dateEcheance: "", type: "facture", status: "draft",
  lignes: [], remiseGlobale: 0, tvaGlobale: 20,
  montantHT: 0, montantTVA: 0, montantTTC: 0,
  montantPaye: 0, montantRestant: 0, notes: "",
};

const Facturation = () => {
  const [factures, setFactures]     = useState([]);
  const [stats, setStats]           = useState({});
  const [clients, setClients]       = useState([]);
  const [commandes, setCommandes]   = useState([]);
  const [societe, setSociete]       = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal]   = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPayerModal, setShowPayerModal] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [factureAPayer, setFactureAPayer]     = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading]   = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [facturesRes, clientsData, commandesData, societeData] = await Promise.all([
        factureService.getFactures(),
        clientService.getAll(),
        commandeService.getAll(),
        api.get("/societe").then(r => r.data?.data || r.data).catch(() => ({})),
      ]);
      setFactures(facturesRes.data || []);
      setStats(facturesRes.stats   || {});
      setClients(clientsData);
      setCommandes(commandesData);
      setSociete(societeData || {});
    } catch (error) {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filtered = factures.filter((f) => {
    const nom = f.client
      ? typeof f.client === "object" ? `${f.client.prenom} ${f.client.nom}` : f.clientNom
      : f.clientNom || "";
    const matchSearch = !searchTerm || f.num?.toLowerCase().includes(searchTerm.toLowerCase()) || nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = !statusFilter || f.status === statusFilter;
    const matchType   = !typeFilter   || f.type   === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const handleView = (facture) => { setSelectedFacture(facture); setShowViewModal(true); };

  const handleEdit = (facture) => {
    setSelectedFacture(facture);
    setFormData({
      client:        facture.client?._id   || facture.client   || "",
      clientNom:     facture.clientNom     || "",
      clientEmail:   facture.clientEmail   || "",
      clientAdresse: facture.clientAdresse || "",
      commande:      facture.commande?._id || facture.commande || "",
      date:          facture.date         ? new Date(facture.date).toISOString().split("T")[0]         : "",
      dateEcheance:  facture.dateEcheance ? new Date(facture.dateEcheance).toISOString().split("T")[0] : "",
      type:          facture.type          || "facture",
      status:        facture.status        || "draft",
      lignes:        facture.lignes        || [],
      remiseGlobale: facture.remiseGlobale || 0,
      tvaGlobale:    facture.tvaGlobale    || 20,
      montantHT:     facture.montantHT     || 0,
      montantTVA:    facture.montantTVA    || 0,
      montantTTC:    facture.montantTTC    || 0,
      montantPaye:   facture.montantPaye   || 0,
      montantRestant:facture.montantRestant|| 0,
      notes:         facture.notes         || "",
    });
    setShowEditModal(true);
  };

  const handlePayer = (facture) => { setFactureAPayer(facture); setShowPayerModal(true); };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer définitivement cette facture ?")) return;
    try {
      await factureService.deleteFacture(id);
      toast.success("Facture supprimée");
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const handleSave = async (dataToSend) => {
    try {
      if (showEditModal && selectedFacture) {
        await factureService.updateFacture(selectedFacture._id, dataToSend);
        toast.success("Facture mise à jour");
      } else {
        await factureService.createFacture(dataToSend);
        toast.success("Facture créée ✅");
      }
      setTimeout(() => loadData(), 500);
      setShowAddModal(false);
      setShowEditModal(false);
      setFormData(EMPTY_FORM);
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la sauvegarde");
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
            <Receipt size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Facturation</h1>
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {factures.length} factures • {stats.unpaid || 0} non payées
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
            onClick={() => { setFormData(EMPTY_FORM); setShowAddModal(true); }}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-md shadow-emerald-100 font-bold text-xs whitespace-nowrap"
          >
            <Plus size={16} /> Nouvelle facture
          </button>
        </div>
      </div>

      <FactureStats stats={stats} />

      <FactureFilters
        searchTerm={searchTerm}     setSearchTerm={setSearchTerm}
        typeFilter={typeFilter}     setTypeFilter={setTypeFilter}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
      />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <FactureTable
          factures={filtered}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPayer={handlePayer}
          onDownload={(f) => toast.info(`PDF pour ${f.num} — à venir`)}
        />
      </div>

      <FactureModal
        isOpen={showAddModal || showEditModal}
        onClose={() => { setShowAddModal(false); setShowEditModal(false); setFormData(EMPTY_FORM); }}
        editMode={showEditModal}
        formData={formData}
        setFormData={setFormData}
        clients={clients}
        commandes={commandes}
        onSave={handleSave}
      />

      <FactureViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        facture={selectedFacture}
        societe={societe}
      />

      <FacturePayerModal
        isOpen={showPayerModal}
        onClose={() => setShowPayerModal(false)}
        facture={factureAPayer}
        onSave={async (paiementData) => {
          try {
            await import("../../services/paiementService").then(m => m.default.create(paiementData));
            toast.success("Paiement enregistré ✅");
            setShowPayerModal(false);
            setTimeout(() => loadData(), 500);
          } catch (error) {
            toast.error("Erreur lors du paiement");
          }
        }}
      />
    </div>
  );
};

export default Facturation;