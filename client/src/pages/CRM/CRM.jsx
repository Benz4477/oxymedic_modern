// src/pages/CRM/CRM.jsx
import React, { useState, useEffect } from "react";
import CRMHeader from "./components/CRMHeader";
import CRMStats from "./components/CRMStats";
import CRMFilters from "./components/CRMFilters";
import CRMTable from "./components/CRMTable";
import CRMClientModal from "./components/CRMClientModal";
import CRMInteractionModal from "./components/CRMInteractionModal";

const CRM = () => {
  const [clients, setClients] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // États pour les modales
  const [showClientModal, setShowClientModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [currentInteraction, setCurrentInteraction] = useState({
    type: "appel",
    date: "",
    heure: "",
    duree: "",
    sujet: "",
    notes: "",
    resultat: "neutre"
  });

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Données clients
    setClients([
      {
        id: 1,
        nom: "Alaoui",
        prenom: "Mohammed",
        tel: "0612345678",
        email: "mohammed.alaoui@email.com",
        statut: "actif",
        dateDernierContact: "20/03/2024",
        score: 85,
        segment: "premium",
        totalCommandes: 5,
        totalDepense: 25000,
        notes: "Client fidèle, toujours ponctuel",
        preferences: ["livraison_rapide", "paiement_virement"],
        prochaineAction: "Appel de satisfaction",
        dateProchaineAction: "25/03/2024",
      },
      {
        id: 2,
        nom: "Benali",
        prenom: "Fatima Zahra",
        tel: "0623456789",
        email: "fatima.benali@email.com",
        statut: "actif",
        dateDernierContact: "18/03/2024",
        score: 72,
        segment: "standard",
        totalCommandes: 3,
        totalDepense: 8500,
        notes: "Intéressée par nos services de longue durée",
        preferences: ["location_mensuelle"],
        prochaineAction: "Envoyer catalogue",
        dateProchaineAction: "22/03/2024",
      },
      {
        id: 3,
        nom: "Amrani",
        prenom: "Youssef",
        tel: "0634567890",
        email: "youssef.amrani@email.com",
        statut: "inactif",
        dateDernierContact: "15/02/2024",
        score: 45,
        segment: "occasionnel",
        totalCommandes: 1,
        totalDepense: 1200,
        notes: "Client occasionnel, nécessite relance",
        preferences: ["paiement_espece"],
        prochaineAction: "Relance téléphonique",
        dateProchaineAction: "28/03/2024",
      },
    ]);

    // Données interactions
    setInteractions([
      {
        id: 1,
        clientId: 1,
        type: "appel",
        date: "20/03/2024",
        heure: "10:30",
        duree: "15 minutes",
        sujet: "Suivi commande CMD-2024-001",
        notes: "Client satisfait, demande réduction sur prochaine commande",
        resultat: "positif",
        auteur: "Commercial 1",
      },
      {
        id: 2,
        clientId: 2,
        type: "email",
        date: "18/03/2024",
        heure: "14:15",
        duree: "-",
        sujet: "Envoi catalogue produits",
        notes: "Email envoyé avec catalogue complet",
        resultat: "en_attente",
        auteur: "Commercial 2",
      },
      {
        id: 3,
        clientId: 1,
        type: "visite",
        date: "15/03/2024",
        heure: "16:00",
        duree: "45 minutes",
        sujet: "Démonstration fauteuil roulant",
        notes: "Client très intéressé par modèle premium",
        resultat: "positif",
        auteur: "Commercial 1",
      },
    ]);

    setIsLoading(false);
  };

  const filteredClients = clients.filter((client) => {
    const matchSearch =
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.tel.includes(searchTerm);
    const matchSegment = !typeFilter || client.segment === typeFilter;
    const matchStatus = !statusFilter || client.statut === statusFilter;
    return matchSearch && matchSegment && matchStatus;
  });

  const totalActifs = clients.filter((c) => c.statut === "actif").length;
  const totalPremium = clients.filter((c) => c.segment === "premium").length;
  const scoreMoyen = Math.round(
    clients.reduce((sum, c) => sum + c.score, 0) / clients.length
  );

  // ─── Gestion des modales ───
  const handleAddClient = () => {
    setEditMode(false);
    setCurrentClient({
      prenom: "",
      nom: "",
      tel: "",
      email: "",
      segment: "standard",
      statut: "actif",
      score: 50,
      totalCommandes: 0,
      totalDepense: 0,
      notes: "",
      prochaineAction: "",
      dateProchaineAction: "",
    });
    setShowClientModal(true);
  };

  const handleEditClient = (client) => {
    setEditMode(true);
    setCurrentClient(client);
    setShowClientModal(true);
  };

  const handleSaveClient = async () => {
    console.log("Sauvegarder client:", currentClient);
    // Ici, appel API pour créer/modifier le client
    setShowClientModal(false);
    // Recharger les données
    loadMockData();
  };

  const handleAddInteractionFromHeader = () => {
    setCurrentClient({
      prenom: "",
      nom: "",
      tel: "",
      email: "",
    });
    setCurrentInteraction({
      type: "appel",
      date: new Date().toISOString().split("T")[0],
      heure: "",
      duree: "",
      sujet: "",
      notes: "",
      resultat: "neutre",
    });
    setShowInteractionModal(true);
  };

  const handleAddInteraction = (client) => {
    setCurrentClient(client);
    setCurrentInteraction({
      type: "appel",
      date: new Date().toISOString().split("T")[0],
      heure: "",
      duree: "",
      sujet: "",
      notes: "",
      resultat: "neutre",
    });
    setShowInteractionModal(true);
  };

  const handleSaveInteraction = async () => {
    console.log("Sauvegarder interaction:", currentInteraction, "pour client:", currentClient);
    // Ici, appel API pour créer l'interaction
    setShowInteractionModal(false);
    // Recharger les données
    loadMockData();
  };

  const handleExport = () => {
    const headers = [
      "ID",
      "Nom",
      "Prénom",
      "Téléphone",
      "Email",
      "Segment",
      "Score",
      "Statut",
      "Commandes",
      "Dépense totale",
      "Dernier contact",
      "Prochaine action",
    ];
    const rows = filteredClients.map((c) => [
      c.id,
      c.nom,
      c.prenom,
      c.tel,
      c.email,
      c.segment,
      c.score,
      c.statut,
      c.totalCommandes,
      c.totalDepense,
      c.dateDernierContact,
      c.prochaineAction,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crm_clients_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des données CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">
      {/* Header */}
      <CRMHeader
        total={clients.length}
        actifs={totalActifs}
        premium={totalPremium}
        onAddClient={handleAddClient}
        onAddInteraction={handleAddInteractionFromHeader}
      />

      {/* KPIs */}
      <CRMStats
        total={clients.length}
        actifs={totalActifs}
        premium={totalPremium}
        scoreMoyen={scoreMoyen}
      />

      {/* Filtres */}
      <CRMFilters
        search={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onExport={handleExport}
      />

      {/* Tableau des clients */}
      <CRMTable
        clients={filteredClients}
        onView={(client) => console.log("Voir client", client)}
        onEdit={handleEditClient}
        onAddInteraction={handleAddInteraction}
      />

      {/* Modal d'ajout/modification client */}
      <CRMClientModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        client={currentClient}
        setClient={setCurrentClient}
        onSave={handleSaveClient}
        title={editMode ? "Modifier le client" : "Nouveau client"}
        isEditing={editMode}
      />

      {/* Modal d'ajout d'interaction */}
      <CRMInteractionModal
        isOpen={showInteractionModal}
        onClose={() => setShowInteractionModal(false)}
        interaction={currentInteraction}
        setInteraction={setCurrentInteraction}
        clientName={currentClient ? `${currentClient.prenom} ${currentClient.nom}` : ""}
        onSave={handleSaveInteraction}
      />
    </div>
  );
};

export default CRM;