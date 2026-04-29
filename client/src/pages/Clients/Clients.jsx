// src/pages/Clients/Clients.jsx
import React, { useState, useEffect, useCallback } from "react";
import ClientHeader from "./components/ClientHeader";
import ClientFilters from "./components/ClientFilters";
import ClientTable from "./components/ClientTable";
import ClientModal from "./components/ClientModal";
import ClientProfile from "./ClientProfile";
import clientService from "./services/clientService";
import commandeService from "../../services/commandeService";
import equipementService from "../../services/equipementService";
import { toast } from "react-toastify";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [clientsEnriched, setClientsEnriched] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [newClient, setNewClient] = useState({
    prenom: "", nom: "", tel: "", email: "", dateNaiss: "",
    quartier: "Maarif", adresse: "", cinNum: "", cinExp: "", note: "",
    lat: null, lng: null,
  });

  const loadAllData = useCallback(async () => {
    try {
      const [clientsData, commandesData, equipementsData] = await Promise.all([
        clientService.getAllClients(),
        commandeService.getAllCommandes(),
        equipementService.getAllEquipements(),
      ]);
      setClients(clientsData);
      setCommandes(commandesData);
      setEquipements(equipementsData);
    } catch (error) {
      console.error("Erreur chargement:", error);
      toast.error("Erreur de chargement des données");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Enrichir les clients avec leurs commandes
  useEffect(() => {
    if (clients.length > 0) {
      const enriched = clients.map((client) => {
        const clientCommandes = commandes.filter((cmd) => String(cmd.clientId) === String(client._id) || cmd.clientId === client.id);
        
        const commandesWithEquip = clientCommandes.map((cmd) => {
          const equip = equipements.find((e) => String(e._id) === String(cmd.equipId) || e.id === cmd.equipId);
          return {
            ...cmd,
            equipementNom: equip ? `${equip.icon} ${equip.name}` : `Équipement ${cmd.equipId}`,
          };
        });

        return {
          ...client,
          commandesList: commandesWithEquip,
          commandes: commandesWithEquip.length,
        };
      });
      setClientsEnriched(enriched);
    }
  }, [clients, commandes, equipements]);

  const filteredClients = clientsEnriched.filter((c) => {
    const searchMatch = `${c.prenom} ${c.nom} ${c.tel} ${c.cinNum}`.toLowerCase().includes(search.toLowerCase());
    return searchMatch;
  });

  const handleAddClient = async () => {
    try {
      await clientService.createClient(newClient);
      toast.success("Client créé avec succès");
      setShowAddModal(false);
      setNewClient({
        prenom: "", nom: "", tel: "", email: "", dateNaiss: "",
        quartier: "Maarif", adresse: "", cinNum: "", cinExp: "", note: "",
        lat: null, lng: null,
      });
      await loadAllData();
    } catch (error) {
      toast.error("Erreur lors de la création");
    }
  };

  const handleUpdateClient = async () => {
    try {
      await clientService.updateClient(editClient._id, editClient);
      toast.success("Client mis à jour");
      setShowEditModal(false);
      await loadAllData();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleDeleteClient = async (id) => {
    if (confirm("Supprimer ce client ?")) {
      await clientService.deleteClient(id);
      toast.success("Client supprimé");
      await loadAllData();
    }
  };

  const handleExport = () => {
    const headers = ["Prénom", "Nom", "Téléphone", "Email", "Quartier", "Adresse", "CIN"];
    const rows = filteredClients.map((c) => [
      c.prenom, c.nom, c.tel, c.email, c.quartier, c.adresse, c.cinNum,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clients_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des clients...</p>
        </div>
      </div>
    );
  }

  if (selectedClientId) {
    return <ClientProfile clientId={selectedClientId} onClose={() => setSelectedClientId(null)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">
      <ClientHeader total={clientsEnriched.length} onExport={handleExport} onAdd={() => setShowAddModal(true)} />
      <ClientFilters search={search} onSearchChange={setSearch} onFilterClick={() => setShowFiltersModal(true)} />
      <ClientTable
        clients={filteredClients}
        onView={(client) => setSelectedClientId(client._id)}
        onEdit={(client) => {
          setEditClient(client);
          setShowEditModal(true);
        }}
        onDelete={handleDeleteClient}
      />

      {/* Modal d'ajout */}
      <ClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        client={newClient}
        setClient={setNewClient}
        onSave={handleAddClient}
        title="Nouveau client"
        isEditing={false}
      />

      {/* Modal d'édition */}
      <ClientModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        client={editClient}
        setClient={setEditClient}
        onSave={handleUpdateClient}
        title="Modifier le client"
        isEditing={true}
      />
    </div>
  );
};

export default Clients;