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

const Facturation = () => {
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    numero: "",
    clientNom: "",
    clientEmail: "",
    clientAdresse: "",
    dateFacture: new Date().toISOString().split('T')[0],
    dateEcheance: "",
    type: "",
    status: "en_attente",
    lignes: [],
    montantTotal: 0,
    notes: ""
  });

  useEffect(() => {
    loadClients();
    loadCommandes();
    // loadFactures(); // Désactivé pour éviter l'erreur 404 au démarrage
  }, []);

  // Supprimé - le chargement des factures n'est pas nécessaire au démarrage
  // const loadFactures = async () => {
  //   try {
  //     const response = await factureService.getAllFactures();
  //     setFactures(response.data || []);
  //   } catch (error) {
  //     console.error("Erreur lors du chargement des factures:", error);
  //     setFactures([]);
  //   }
  // };

  const loadClients = async () => {
    try {
      const clientsData = await ClientService.getAllClients();
      setClients(clientsData);
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
      setClients([]);
    }
  };

  const loadCommandes = async () => {
    try {
      const commandesData = await CommandeService.getAllCommandes();
      setCommandes(commandesData);
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
      setCommandes([]);
    }
  };

  const filteredFactures = factures.filter((facture) => {
    const matchesSearch =
      (facture.num && facture.num.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (facture.clientNom && facture.clientNom.toLowerCase().includes(searchTerm.toLowerCase()));
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
      date: facture.date,
      dateEcheance: facture.dateEcheance,
      type: facture.type,
      status: facture.status,
      lignes: facture.lignes || [],
      montantHT: facture.montantHT,
      montantTVA: facture.montantTVA,
      montantTTC: facture.montantTTC,
      notes: facture.notes
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Supprimer définitivement cette facture ?")) {
      try {
        await factureService.deleteFacture(id);
        await loadFactures();
        alert("Facture supprimée avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression de la facture");
      }
    }
  };

  const handleDownload = (facture) => {
    alert(`Téléchargement de la facture ${facture.num} - Fonction à implémenter`);
    console.log("Télécharger facture:", facture.num);
  };

  const handleSave = async () => {
    try {
      if (showEditModal && selectedFacture) {
        await factureService.updateFacture(selectedFacture.id, formData);
      } else {
        await factureService.createFacture(formData);
      }
      await loadFactures();
      setShowAddModal(false);
      setShowEditModal(false);
      resetFormData();
      alert(showEditModal ? "Facture mise à jour avec succès" : "Facture créée avec succès");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde: " + (error.response?.data?.message || error.message));
    }
  };

  const resetFormData = () => {
    setFormData({
      num: "",
      clientNom: "",
      date: new Date().toLocaleDateString('fr-FR'),
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
      notes: ""
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Facturation</h1>
          <p className="text-sm text-slate-400 mt-0.5">{factures.length} factures • {factures.filter(f => f.status === "en_attente").length} en attente</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all">
          <Plus size={16} /> Nouvelle facture
        </button>
      </div>

      {/* KPIs */}
      <FactureStats factures={factures} />

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
