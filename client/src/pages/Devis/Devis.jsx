// src/pages/Devis/Devis.jsx
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import DevisStats from "./components/DevisStats";
import DevisFilters from "./components/DevisFilters";
import DevisTable from "./components/DevisTable";
import DevisModal from "./components/DevisModal";
import DevisViewModal from "./components/DevisViewModal";
import devisService from "./services/devisService.js";
import clientService from "./services/clientService.js";
import commandeService from "./services/commandeService.js";

const Devis = () => {
  const [devis, setDevis] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDevis, setSelectedDevis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    loadDevis();
    loadClients();
    loadCommandes();
  }, []);

  const loadDevis = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      
      const data = await devisService.getAllDevis(filters);
      setDevis(data);
    } catch (error) {
      console.error("Erreur lors du chargement des devis:", error);
      setError("Erreur lors du chargement des devis");
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (error) {
      console.error("Erreur lors du chargement des clients:", error);
    }
  };

  const loadCommandes = async () => {
    try {
      console.log("Chargement des commandes...");
      const data = await commandeService.getAllCommandes();
      console.log("Commandes chargées:", data);
      setCommandes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
    }
  };

  // Recharger les devis quand les filtres changent
  useEffect(() => {
    loadDevis();
  }, [statusFilter]);

  const filtered = devis.filter(d => {
    const matchSearch = d.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (d.clientName && d.clientName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = !statusFilter || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total = devis.length;
  const envoye = devis.filter(d => d.status === "sent").length;
  const accepte = devis.filter(d => d.status === "accepted").length;
  const expired = devis.filter(d => d.status === "expired" || d.status === "rejected").length;

  const handleDelete = async (id) => {
    if (confirm("Supprimer ce devis ?")) {
      try {
        await devisService.deleteDevis(id);
        loadDevis(); // Recharger la liste
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression du devis");
      }
    }
  };

  const handleSend = async (devisItem) => {
    try {
      await devisService.sendDevis(devisItem.id);
      loadDevis(); // Recharger la liste
      alert("Devis envoyé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      alert("Erreur lors de l'envoi du devis");
    }
  };

  const handleConvert = async (devisItem) => {
    try {
      const result = await devisService.convertDevis(devisItem.id);
      loadDevis(); // Recharger la liste
      alert(`Devis converti en commande: ${result.cmdRef}`);
    } catch (error) {
      console.error("Erreur lors de la conversion:", error);
      alert("Erreur lors de la conversion du devis");
    }
  };

  const handlePrint = async (devisItem) => {
    try {
      await devisService.printDevis(devisItem.id);
      alert("Devis imprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'impression:", error);
      alert("Erreur lors de l'impression du devis");
    }
  };

  const handleDuplicate = async (devisItem) => {
    try {
      const result = await devisService.duplicateDevis(devisItem.id);
      loadDevis(); // Recharger la liste
      alert(`Devis dupliqué: ${result.reference}`);
    } catch (error) {
      console.error("Erreur lors de la duplication:", error);
      alert("Erreur lors de la duplication du devis");
    }
  };

  const handleSaveDevis = async (devisData) => {
    try {
      if (selectedDevis && selectedDevis.id) {
        await devisService.updateDevis(selectedDevis.id, devisData);
        alert("Devis mis à jour avec succès");
      } else {
        await devisService.createDevis(devisData);
        alert("Devis créé avec succès");
      }
      setShowAddModal(false);
      setSelectedDevis(null);
      loadDevis(); // Recharger la liste
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du devis:", error);
      alert("Erreur lors de la sauvegarde du devis");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Devis</h1>
          <p className="text-sm text-slate-400 mt-0.5">{total} devis • {envoye} en attente de réponse</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all">
          <Plus size={16} /> Nouveau devis
        </button>
      </div>

      {/* KPIs */}
      <DevisStats total={total} envoye={envoye} accepte={accepte} expired={expired} />

      {/* Filtres */}
      <DevisFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <DevisTable
          devis={filtered}
          onView={(d) => { setSelectedDevis(d); setShowViewModal(true); }}
          onEdit={(d) => { setSelectedDevis(d); setShowAddModal(true); }}
          onSend={handleSend}
          onConvert={handleConvert}
          onPrint={handlePrint}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal d'ajout/modification */}
      <DevisModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedDevis(null);
        }}
        editMode={!!selectedDevis?.id}
        devis={selectedDevis}
        onSave={handleSaveDevis}
        clients={clients}
        commandes={commandes}
      />

      {/* Modal de visualisation */}
      <DevisViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedDevis(null);
        }}
        devis={selectedDevis}
        onEdit={(d) => { setSelectedDevis(d); setShowAddModal(true); setShowViewModal(false); }}
        onDelete={handleDelete}
        onConvert={handleConvert}
        onSend={handleSend}
      />
    </div>
  );
};

export default Devis;