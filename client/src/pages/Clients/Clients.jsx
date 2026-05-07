import React, { useState, useEffect, useCallback } from "react";
import ClientHeader from "./components/ClientHeader";
import ClientFilters from "./components/ClientFilters";
import ClientTable from "./components/ClientTable";
import ClientModal from "./components/ClientModal";
import ClientProfile from "./ClientProfile";
import clientService from "./services/clientService";
import commandeService from "../../services/commandeService";
import { toast } from "react-toastify";

const EMPTY_CLIENT = {
  prenom: "", nom: "", tel: "", email: "", dateNaiss: "",
  quartier: "Maarif", adresse: "", cinNum: "", cinExp: "", note: "",
  lat: null, lng: null,
};

const Clients = () => {
  const [clients, setClients]                 = useState([]);
  const [commandes, setCommandes]             = useState([]);
  const [clientsEnriched, setClientsEnriched] = useState([]);
  const [isLoading, setIsLoading]             = useState(true);
  const [search, setSearch]                   = useState("");
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [showAddModal, setShowAddModal]       = useState(false);
  const [showEditModal, setShowEditModal]     = useState(false);
  const [newClient, setNewClient]             = useState(EMPTY_CLIENT);
  const [editClient, setEditClient]           = useState(null);

  const loadClients = useCallback(async () => {
    try {
      setIsLoading(true);
      const [clientsData, commandesData] = await Promise.all([
        clientService.getAll(),
        commandeService.getAll(),
      ]);
      setClients(clientsData);
      setCommandes(commandesData);
    } catch (error) {
      toast.error("Erreur de chargement des clients");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadClients(); }, [loadClients]);

  // Enrichir clients avec leurs commandes
  useEffect(() => {
    if (clients.length === 0) { setClientsEnriched([]); return; }
    const enriched = clients.map((client) => {
      const clientCommandes = commandes.filter((cmd) => {
        const cmdClientId = cmd.client?._id || cmd.client;
        return String(cmdClientId) === String(client._id);
      });
      return {
        ...client,
        commandesList: clientCommandes.map((cmd) => ({
          ...cmd,
          equipementNom: cmd.equipement
            ? `${cmd.equipement.icon || ""} ${cmd.equipement.name || ""}`.trim()
            : cmd.reference || "—",
        })),
        commandes: clientCommandes.length,
      };
    });
    setClientsEnriched(enriched);
  }, [clients, commandes]);

  const filteredClients = search
    ? clientsEnriched.filter((c) =>
        `${c.prenom} ${c.nom} ${c.tel} ${c.cinNum || ""}`.toLowerCase().includes(search.toLowerCase())
      )
    : clientsEnriched;

  const handleAdd = async () => {
    try {
      await clientService.create(newClient);
      toast.success("Client créé avec succès");
      setShowAddModal(false);
      setNewClient(EMPTY_CLIENT);
      await loadClients();
    } catch (error) {
      toast.error("Erreur lors de la création");
    }
  };

  const handleUpdate = async () => {
    try {
      await clientService.update(editClient._id, editClient);
      toast.success("Client mis à jour");
      setShowEditModal(false);
      await loadClients();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce client ?")) return;
    try {
      await clientService.delete(id);
      toast.success("Client supprimé");
      await loadClients();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleExport = () => {
    const headers = ["Prénom", "Nom", "Téléphone", "Email", "Quartier", "Adresse", "CIN"];
    const rows = filteredClients.map((c) => [c.prenom, c.nom, c.tel, c.email, c.quartier, c.adresse, c.cinNum]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clients_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50/60 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Chargement des clients...</p>
      </div>
    </div>
  );

  if (selectedClientId) return (
    <ClientProfile
      clientId={selectedClientId}
      onClose={() => setSelectedClientId(null)}
      onBack={() => setSelectedClientId(null)}
    />
  );

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">
      <ClientHeader total={clientsEnriched.length} onExport={handleExport} onAdd={() => setShowAddModal(true)} />
      <ClientFilters search={search} onSearchChange={setSearch} />
      <ClientTable
        clients={filteredClients}
        onView={(client) => setSelectedClientId(client._id)}
        onEdit={(client) => { setEditClient(client); setShowEditModal(true); }}
        onDelete={handleDelete}
      />
      <ClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        client={newClient}
        setClient={setNewClient}
        onSave={handleAdd}
        title="Nouveau client"
        isEditing={false}
      />
      <ClientModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        client={editClient}
        setClient={setEditClient}
        onSave={handleUpdate}
        title="Modifier le client"
        isEditing={true}
      />
    </div>
  );
};

export default Clients;