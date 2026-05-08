import React, { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api";
import commandeService from "../../services/commandeService";
import clientService   from "../../services/clientService";
import equipementService from "../../services/equipementService";
import unitService     from "../../services/unitService";
import CommandeStats   from "./components/CommandeStats";
import CommandeFilters from "./components/CommandeFilters";
import CommandeTable   from "./components/CommandeTable";
import CommandeModal   from "./components/CommandeModal";
import ReceiptModal    from "./components/ReceiptModal";
import BonEnlevementModal from "./components/BonEnlevementModal";
import BonRetourModal     from "./components/BonRetourModal";

const EMPTY_FORM = {
  client:         "",   // ObjectId
  equipement:     "",   // ObjectId
  unite:          "",   // ObjectId
  dateDebut:      "",
  dateFin:        "",
  modePaiement:   "cash_magasin",
  montantHT:      0,
  tauxTVA:        20,
  montantTTC:     0,
  montantCaution: 0,
  modeCaution:    "cash",
  note:           "",
};

const Commandes = () => {
  const navigate = useNavigate();
  const [commandes, setCommandes]     = useState([]);
  const [clients, setClients]         = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [units, setUnits]             = useState([]);
  const [societe, setSociete]         = useState({});
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal]     = useState(false);
  const [editMode, setEditMode]       = useState(false);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [formData, setFormData]       = useState(EMPTY_FORM);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptCmd, setReceiptCmd]   = useState(null);
  const [showBonEnl, setShowBonEnl] = useState(false);
  const [showBonRet, setShowBonRet] = useState(false);
  const [selected, setSelected]       = useState(null);

  // ── Chargement ────────────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [commandesData, clientsData, equipementsData, unitsData, societeData] =
        await Promise.all([
          commandeService.getAll(),
          clientService.getAll(),
          equipementService.getAll(),
          unitService.getAll(),
          api.get("/societe").then(r => r.data?.data || r.data).catch(() => ({})),
        ]);
      setCommandes(commandesData);
      setClients(clientsData);
      setEquipements(equipementsData);
      setUnits(unitsData);
      setSociete(societeData || {});
    } catch (error) {
      console.error("Erreur chargement commandes:", error);
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Filtrage ──────────────────────────────────────────────
  const filtered = commandes.filter((c) => {
    const clientNom = c.client
      ? `${c.client.prenom || ""} ${c.client.nom || ""}`.toLowerCase()
      : "";
    const matchSearch =
      c.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientNom.includes(searchTerm.toLowerCase());
    const matchStatus = !statusFilter || c.statut === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── KPIs ──────────────────────────────────────────────────
  const kpis = {
    total:       commandes.length,
    actives:     commandes.filter((c) => c.statut === "active").length,
    pending:     commandes.filter((c) => c.statut === "pending").length,
    totalAmount: commandes.reduce((sum, c) => sum + (c.montantTTC || 0), 0),
  };

  // ── CRUD ──────────────────────────────────────────────────
  const handleAdd = () => {
    setEditMode(false);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const handleEdit = (commande) => {
    setEditMode(true);
    setSelectedCommande(commande);
    setFormData({
      client:         commande.client?._id || commande.client,
      equipement:     commande.equipement?._id || commande.equipement,
      unite:          commande.unite?._id || commande.unite || "",
      dateDebut:      commande.dateDebut?.split("T")[0] || "",
      dateFin:        commande.dateFin?.split("T")[0] || "",
      modePaiement:   commande.modePaiement || "cash_magasin",
      montantHT:      commande.montantHT || 0,
      tauxTVA:        commande.tauxTVA || 20,
      montantTTC:     commande.montantTTC || 0,
      montantCaution: commande.montantCaution || 0,
      modeCaution:    commande.modeCaution || "cash",
      note:           commande.note || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.client)     return toast.error("Client requis");
      if (!formData.equipement) return toast.error("Équipement requis");
      if (!formData.dateDebut)  return toast.error("Date de début requise");
      if (!formData.dateFin)    return toast.error("Date de fin requise");
      if (!formData.montantTTC) return toast.error("Montant TTC requis");

      if (editMode && selectedCommande) {
        await commandeService.update(selectedCommande._id, formData);
        toast.success("Commande mise à jour");
      } else {
        await commandeService.create(formData);
        toast.success("Commande créée");
      }
      setShowModal(false);
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette commande ?")) return;
    try {
      await commandeService.delete(id);
      toast.success("Commande supprimée");
      await loadData();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleStatusChange = async (commande, newStatut) => {
    try {
      await commandeService.updateStatut(commande._id, newStatut);
      toast.success("Statut mis à jour");
      await loadData();
    } catch (error) {
      toast.error("Erreur lors du changement de statut");
    }
  };

  const handleReconduire = async (commande) => {
    const newEnd = prompt("Nouvelle date de fin (YYYY-MM-DD) :");
    if (!newEnd) return;
    try {
      await commandeService.reconduire(commande._id, {
        type: "prolongation",
        dateFin: newEnd,
      });
      toast.success("Commande reconduite");
      await loadData();
    } catch (error) {
      toast.error("Erreur lors de la reconduction");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-slate-400">Chargement des commandes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Commandes
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {commandes.length} commande{commandes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all"
        >
          <Plus size={16} /> Nouvelle commande
        </button>
      </div>

      {/* KPIs */}
      <CommandeStats
        total={kpis.total}
        actives={kpis.actives}
        pending={kpis.pending}
        totalAmount={kpis.totalAmount}
      />

      {/* Filtres */}
      <CommandeFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <CommandeTable
          commandes={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onReconduire={handleReconduire}
          onDevis={(cmd) => {
            // Rediriger vers la page des devis avec l'ID du devis associé à cette commande
            if (cmd.devis) {
              navigate(`/devis?view=${cmd.devis}`);
            } else {
              toast.info("Aucun devis associé à cette commande");
              navigate("/devis");
            }
          }}
          onReceipt={(cmd) => { setReceiptCmd(cmd); setShowReceipt(true); }}
          onBonEnl={(cmd) => { setSelected(cmd); setShowBonEnl(true); }}
          onBonRet={(cmd) => { setSelected(cmd); setShowBonRet(true); }}
        />
      </div>

      {/* Modal commande */}
      <CommandeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editMode={editMode}
        formData={formData}
        setFormData={setFormData}
        clients={clients}
        equipements={equipements}
        units={units}
        onSave={handleSave}
      />

      {/* Modal reçu */}
      <ReceiptModal
        isOpen={showReceipt}
        onClose={() => setShowReceipt(false)}
        commande={receiptCmd}
        societe={societe}
      />

      {/* Modal bon d'enlèvement */}
      <BonEnlevementModal
        isOpen={showBonEnl}
        onClose={() => setShowBonEnl(false)}
        commande={selected}
        societe={societe}
      />

      {/* Modal bon de retour */}
      <BonRetourModal
        isOpen={showBonRet}
        onClose={() => setShowBonRet(false)}
        commande={selected}
        societe={societe}
      />
    </div>
  );
};

export default Commandes;