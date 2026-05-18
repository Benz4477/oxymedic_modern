import React, { useState, useEffect, useCallback } from "react";
import { Plus, ShoppingBag, ShieldAlert } from "lucide-react";
import { useNavigate, useOutletContext } from "react-router-dom";
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
  client:         "",   
  equipement:     "",   
  unite:          "",   
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
  const { isDepot } = useOutletContext();
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

  const kpis = {
    total:       commandes.length,
    actives:     commandes.filter((c) => c.statut === "active").length,
    pending:     commandes.filter((c) => c.statut === "pending").length,
    totalAmount: commandes.reduce((sum, c) => sum + (c.montantTTC || 0), 0),
  };

  const handleAdd = () => {
    if (isDepot) return toast.warning("Les ventes sont interdites depuis un dépôt.");
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
        window.dispatchEvent(new CustomEvent('commandeUpdated', { 
          detail: { id: selectedCommande._id, montantCaution: formData.montantCaution } 
        }));
      } else {
        await commandeService.create(formData);
        toast.success("Commande créée");
      }
      setShowModal(false);
      await loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur sauvegarde");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette commande ?")) return;
    try {
      await commandeService.delete(id);
      toast.success("Commande supprimée");
      await loadData();
    } catch (error) {
      toast.error("Erreur suppression");
    }
  };

  const handleStatusChange = async (commande, newStatut) => {
    try {
      await commandeService.updateStatut(commande._id, newStatut);
      toast.success("Statut mis à jour");
      await loadData();
    } catch (error) {
      toast.error("Erreur changement statut");
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
      toast.error("Erreur reconduction");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative">
        <div className="w-10 h-10 border-2 border-amber-600/20 rounded-full" />
        <div className="w-10 h-10 border-2 border-amber-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1">
        <div className="flex items-center gap-3 md:gap-4 font-display">
          <div className={`p-3 rounded-xl shadow-xl ${isDepot ? 'bg-slate-400' : 'bg-amber-500 shadow-amber-500/10'} text-white`}>
            <ShoppingBag size={22} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-slate-950 tracking-tight">Commandes</h1>
              {isDepot && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[8px] font-bold uppercase rounded-md">
                  <ShieldAlert size={10} /> Mode Lecture Seule
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold mt-1.5">
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDepot ? 'bg-slate-400' : 'bg-amber-500'}`} />
              {commandes.length} commandes enregistrées
            </div>
          </div>
        </div>
        <button
          onClick={handleAdd}
          disabled={isDepot}
          title={isDepot ? "Interdit en mode Dépôt" : ""}
          className={`flex items-center gap-2 px-5 py-2 text-white rounded-xl transition shadow-md font-bold text-xs ${isDepot ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/10'}`}
        >
          <Plus size={14} /> Nouvelle Commande
        </button>
      </div>

      <CommandeStats {...kpis} />

      <CommandeFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="card-linear overflow-hidden">
        <CommandeTable
          commandes={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onReconduire={handleReconduire}
          onDevis={(cmd) => {
            if (cmd.devis) navigate(`/devis?view=${cmd.devis}`);
            else { toast.info("Aucun devis associé"); navigate("/devis"); }
          }}
          onReceipt={(cmd) => { setReceiptCmd(cmd); setShowReceipt(true); }}
          onBonEnl={(cmd) => { setSelected(cmd); setShowBonEnl(true); }}
          onBonRet={(cmd) => { setSelected(cmd); setShowBonRet(true); }}
        />
      </div>

      <CommandeModal isOpen={showModal} onClose={() => setShowModal(false)} editMode={editMode} formData={formData} setFormData={setFormData} clients={clients} equipements={equipements} units={units} onSave={handleSave} />
      <ReceiptModal isOpen={showReceipt} onClose={() => setShowReceipt(false)} commande={receiptCmd} societe={societe} />
      <BonEnlevementModal isOpen={showBonEnl} onClose={() => setShowBonEnl(false)} commande={selected} societe={societe} />
      <BonRetourModal isOpen={showBonRet} onClose={() => setShowBonRet(false)} commande={selected} societe={societe} />
    </div>
  );
};

export default Commandes;