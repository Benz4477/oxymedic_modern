// src/pages/Clients/Clients.jsx
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import ClientHeader from "./components/ClientHeader";
import ClientFilters from "./components/ClientFilters";
import ClientTable from "./components/ClientTable";
import ClientModal from "./components/ClientModal";
import ClientProfile from "./ClientProfile";
import clientService from "./services/clientService";
import commandeService from "../../services/commandeService";

const EMPTY_CLIENT = {
  prenom: "", nom: "", tel: "", email: "", dateNaiss: "",
  quartier: "Maarif", adresse: "", cinNum: "", cinExp: "", note: "",
  lat: null, lng: null,
};

const IncompleteClientToast = ({ clientId, onComplete }) => (
  <div className="flex items-center justify-between w-full gap-3">
    <span className="text-xs font-bold text-slate-800 tracking-tight">⚠️ Dossier client incomplet</span>
    <button
      onClick={() => {
        onComplete(clientId);
        toast.dismiss();
      }}
      className="px-3 py-1 text-[10px] font-bold text-white bg-amber-500 rounded-lg hover:bg-amber-600 uppercase tracking-wider shadow-sm transition-all"
    >
      Compléter →
    </button>
  </div>
);

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

  const isClientIncomplete = (client) => {
    const requiredDocs = ["cin_r", "cin_v"];
    const hasRequiredDocs = requiredDocs.every(
      (doc) => client.docs && client.docs[doc] && client.docs[doc].length > 0
    );
    const hasCinNum = client.cinNum && client.cinNum.trim().length > 0;
    return !hasRequiredDocs || !hasCinNum;
  };

  const handleAdd = async () => {
    try {
      const createdClient = await clientService.create(newClient);
      toast.success("Client créé");
      setShowAddModal(false);
      setNewClient(EMPTY_CLIENT);
      await loadClients();

      if (isClientIncomplete(createdClient)) {
        toast(
          <IncompleteClientToast
            clientId={createdClient._id}
            onComplete={(id) => setSelectedClientId(id)}
          />,
          { autoClose: false, closeOnClick: false, draggable: false }
        );
      }
    } catch (error) {
      toast.error("Erreur création");
    }
  };

  const handleUpdate = async () => {
    try {
      await clientService.update(editClient._id, editClient);
      toast.success("Client mis à jour");
      setShowEditModal(false);
      await loadClients();
    } catch (error) {
      toast.error("Erreur mise à jour");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce client ?")) return;
    try {
      await clientService.delete(id);
      toast.success("Client supprimé");
      await loadClients();
    } catch (error) {
      toast.error("Erreur suppression");
    }
  };

  const handleExport = () => {
    const headers = ["Prénom", "Nom", "Téléphone", "Email", "Adresse"];
    const rows = filteredClients.map((c) => [c.prenom, c.nom, c.tel, c.email, c.adresse || ""]);
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative">
        <div className="w-10 h-10 border-2 border-amber-600/20 rounded-full" />
        <div className="w-10 h-10 border-2 border-amber-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
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
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <ClientHeader 
        total={clientsEnriched.length} 
        onExport={handleExport} 
        onAdd={() => setShowAddModal(true)} 
      />
      
      <ClientFilters 
        search={search} 
        onSearchChange={setSearch} 
      />

      <div className="card-linear overflow-hidden">
        <ClientTable
          clients={filteredClients}
          onView={(client) => setSelectedClientId(client._id)}
          onEdit={(client) => { setEditClient(client); setShowEditModal(true); }}
          onDelete={handleDelete}
        />
      </div>

      <ClientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        client={newClient}
        setClient={setNewClient}
        onSave={handleAdd}
        title="Nouveau Client"
        isEditing={false}
      />
      <ClientModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        client={editClient}
        setClient={setEditClient}
        onSave={handleUpdate}
        title="Modifier le Client"
        isEditing={true}
      />
    </div>
  );
};

export default Clients;