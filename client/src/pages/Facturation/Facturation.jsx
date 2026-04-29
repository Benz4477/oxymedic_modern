// src/pages/Facturation/Facturation.jsx
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import FactureStats from "./components/FactureStats";
import FactureFilters from "./components/FactureFilters";
import FactureTable from "./components/FactureTable";
import FactureModal from "./components/FactureModal";
import FactureViewModal from "./components/FactureViewModal";
import factureService from "./services/factureService";
import ClientService from "../../services/clientService";
import CommandeService from "../../services/commandeService";
import { toast } from "react-toastify";

const Facturation = () => {
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [modePaiement, setModePaiement] = useState(""); // Champ séparé pour le mode de paiement

  const [formData, setFormData] = useState({
    num: "",
    clientNom: "",
    clientEmail: "",
    clientAdresse: "",
    clientId: "",
    date: new Date().toISOString().split("T")[0],
    dateEcheance: "",
    type: "facture",
    status: "draft",
    lignes: [],
    remiseGlobale: 0,
    tvaGlobale: 20,
    montantHT: 0,
    montantTVA: 0,
    montantTTC: 0,
    montantPaye: 0,
    montantRestant: 0,
    notes: "",
    cmdRef: "",
  });

  useEffect(() => {
    loadClients();
    loadCommandes();
  }, []);

  const loadClients = async () => {
    try {
      const clientsData = await ClientService.getAllClients();
      setClients(Array.isArray(clientsData) ? clientsData : []);
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
      setClients([]);
    }
  };

  const loadCommandes = async () => {
    try {
      const commandesData = await CommandeService.getAllCommandes();
      setCommandes(Array.isArray(commandesData) ? commandesData : []);
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
      setCommandes([]);
    }
  };

  const loadFactures = async () => {
    try {
      const response = await factureService.getAllFactures();
      setFactures(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erreur lors du chargement des factures:", error);
      setFactures([]);
    }
  };

  const filteredFactures = factures.filter((facture) => {
    const matchesSearch =
      (facture.num &&
        facture.num.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (facture.clientNom &&
        facture.clientNom.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !statusFilter || facture.status === statusFilter;
    const matchesType = !typeFilter || facture.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleView = (facture) => {
    setSelectedFacture(facture);
    setShowViewModal(true);
  };

  const handleEdit = (facture) => {
    setSelectedFacture(facture);
    setFormData({
      num: facture.num,
      clientNom: facture.clientNom,
      clientEmail: facture.clientEmail || "",
      clientId: facture.clientId,
      date: facture.date,
      dateEcheance: facture.dateEcheance,
      type: facture.type,
      status: facture.status,
      lignes: facture.lignes || [],
      remiseGlobale: facture.remiseGlobale || 0,
      tvaGlobale: facture.tvaGlobale || 20,
      montantHT: facture.montantHT,
      montantTVA: facture.montantTVA,
      montantTTC: facture.montantTTC,
      montantPaye: facture.montantPaye || 0,
      montantRestant: facture.montantRestant || facture.montantTTC,
      notes: facture.notes || "",
      cmdRef: facture.cmdRef || "",
    });
    setModePaiement(facture.modePaiement || "");
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Supprimer définitivement cette facture ?")) {
      try {
        await factureService.deleteFacture(id);
        await loadFactures();
        toast.success("Facture supprimée avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast.error("Erreur lors de la suppression de la facture");
      }
    }
  };

  const handleDownload = (facture) => {
    toast.info(
      `Téléchargement de la facture ${facture.num} - Fonction à implémenter`,
    );
    console.log("Télécharger facture:", facture.num);
  };

  const handleSave = async () => {
    try {
      // Préparer le payload sans modePaiement s'il est vide
      const payload = { ...formData };

      // Ne pas envoyer modePaiement s'il est vide ou null
      if (!modePaiement || modePaiement === "") {
        delete payload.modePaiement;
      } else {
        payload.modePaiement = modePaiement;
      }

      // Supprimer les champs vides indésirables
      if (!payload.num) delete payload.num;
      if (!payload.cmdRef) delete payload.cmdRef;

      if (showEditModal && selectedFacture) {
        await factureService.updateFacture(selectedFacture.id, payload);
      } else {
        await factureService.createFacture(payload);
      }
      await loadFactures();
      setShowAddModal(false);
      setShowEditModal(false);
      resetFormData();
      toast.success(
        showEditModal
          ? "Facture mise à jour avec succès"
          : "Facture créée avec succès",
      );
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error(
        "Erreur lors de la sauvegarde: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const resetFormData = () => {
    setFormData({
      num: "",
      clientNom: "",
      clientEmail: "",
      clientAdresse: "",
      clientId: "",
      date: new Date().toISOString().split("T")[0],
      dateEcheance: "",
      type: "facture",
      status: "draft",
      lignes: [],
      remiseGlobale: 0,
      tvaGlobale: 20,
      montantHT: 0,
      montantTVA: 0,
      montantTTC: 0,
      montantPaye: 0,
      montantRestant: 0,
      notes: "",
      cmdRef: "",
    });
    setModePaiement("");
  };

  const totalFactures = factures.length;
  const enAttente = factures.filter((f) => f.status === "en_attente").length;
  const payees = factures.filter((f) => f.status === "payée").length;

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Facturation
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {totalFactures} factures • {enAttente} en attente
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all"
        >
          <Plus size={16} /> Nouvelle facture
        </button>
      </div>

      {/* KPIs */}
      <FactureStats
        total={totalFactures}
        enAttente={enAttente}
        payees={payees}
      />

      {/* Filtres */}
      <FactureFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {/* Tableau */}
      <FactureTable
        factures={filteredFactures}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDownload={handleDownload}
      />

      {/* Modal d'ajout/modification */}
      <FactureModal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          resetFormData();
        }}
        editMode={showEditModal}
        formData={formData}
        setFormData={setFormData}
        modePaiement={modePaiement}
        setModePaiement={setModePaiement}
        clients={clients}
        commandes={commandes}
        onSave={handleSave}
      />

      {/* Modal de visualisation */}
      <FactureViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        facture={selectedFacture}
      />
    </div>
  );
};

export default Facturation;
