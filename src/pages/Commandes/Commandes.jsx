// src/pages/Commandes/Commandes.jsx
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useCommandes } from "./hooks/useCommandes.js";
import ClientService from "../../services/clientService.js";
import EquipementService from "../../services/equipementService.js";
import UnitService from "../../services/unitService.js";
import CommandeStats from "./components/CommandeStats";
import CommandeFilters from "./components/CommandeFilters";
import CommandeTable from "./components/CommandeTable";
import CommandeModal from "./components/CommandeModal";

const Commandes = () => {
  // ── Hook personnalisé ──
  const {
    commandes: rawCommandes,
    loading,
    error,
    createCommande,
    updateCommande,
    deleteCommande,
    reconduireCommande,
    updateStatus,
    validateCommande,
    resetCommandeForm,
    calculateAmounts,
  } = useCommandes();

  // ── États locaux ──
  const [commandes, setCommandes] = useState([]);
  const [clients, setClients] = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [units, setUnits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState(null);
  const [formData, setFormData] = useState(resetCommandeForm());

  useEffect(() => {
    loadRelatedData();
  }, []);

  // Synchroniser les commandes formatées avec les données brutes
  useEffect(() => {
    if (rawCommandes.length > 0) {
      const formattedCommandes = rawCommandes.map(cmd => {
        // Trouver le client par ID
        const client = clients.find(c => c.id === cmd.clientId);
        const clientName = client ? `${client.prenom} ${client.nom}` : `Client ${cmd.clientId}`;
        
        // Trouver l'équipement par ID
        const equipement = equipements.find(e => {
          const equipIdStr = String(cmd.equipId);
          const equipIdNum = Number(cmd.equipId);
          const objectIdNumeric = e._id ? parseInt(e._id.substring(0, 8), 16) : null;
          
          const matchById = e._id === equipIdStr;
          const matchByLegacyId = e.id === equipIdNum || e.id === equipIdStr;
          const matchByNumericId = Number(e._id) === equipIdNum;
          const matchByObjectId = objectIdNumeric === equipIdNum;
          
          return matchById || matchByLegacyId || matchByNumericId || matchByObjectId;
        });
        const equipName = equipement ? `${equipement.icon} ${equipement.name}` : 
          equipements.length > 0 ? `${equipements[0].icon} ${equipements[0].name}` : 
          `Équipement ${cmd.equipId}`;
        
        // Trouver l'unité par ID
        const unit = units.find(u => u.id === cmd.unitId);
        const unitSerial = unit ? unit.serial : null;
        
        return {
          ...cmd,
          client: clientName,
          equipement: equipName,
          unitSerial: unitSerial,
          caution: cmd.caution !== 0 && cmd.caution !== undefined ? cmd.caution : null,
        };
      });
      setCommandes(formattedCommandes);
    }
  }, [rawCommandes, clients, equipements, units]);

  const loadRelatedData = async () => {
    const retryWithDelay = async (serviceCall, serviceName, maxRetries = 2, delay = 2000) => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await serviceCall();
        } catch (error) {
          if ((error.message.includes("Trop de requêtes") || error.message.includes("Too Many Requests")) && i < maxRetries - 1) {
            console.warn(`Erreur ${serviceName}, tentative ${i + 1}/${maxRetries}, retry dans ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Exponential backoff
          } else {
            throw error;
          }
        }
      }
    };

    try {
      // Charger les vraies données depuis l'API avec retry
      const [clientsData, equipementsData, unitsData] = await Promise.all([
        retryWithDelay(() => ClientService.getAllClients(), "Clients"),
        retryWithDelay(() => EquipementService.getAllEquipements(), "Équipements"),
        retryWithDelay(() => UnitService.getAllUnits(), "Unités"),
      ]);
      
      setClients(clientsData);
      setEquipements(equipementsData);
      setUnits(unitsData);
    } catch (error) {
      console.error("Erreur lors du chargement des données liées:", error);
      // Ne pas utiliser les données mockées - laisser l'erreur se propager
      throw error;
    }
  };

  const filtered = commandes.filter(c => {
    const matchSearch = c.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (c.client && c.client.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAdd = () => {
    setEditMode(false);
    setFormData(resetCommandeForm());
    setShowAddModal(true);
  };

  const handleEdit = (commande) => {
    setEditMode(true);
    setSelectedCommande(commande);
    setFormData({
      clientId: commande.clientId,
      equipId: commande.equipId,
      unitId: commande.unitId || "",
      start: commande.start.split("/").reverse().join("-"),
      end: commande.end.split("/").reverse().join("-"),
      pay: commande.pay,
      amountHT: commande.amountHT || 0,
      tvaRate: commande.tvaRate || 20,
      amountTTC: commande.amountTTC || 0,
      caution: commande.caution || 0,
      cautionMode: commande.cautionMode || "Cash",
      lines: commande.lines || [],
      note: commande.note || "",
    });
    setShowAddModal(true);
  };

  const handleSave = async () => {
    try {
      const validation = validateCommande(formData);
      if (!validation.isValid) {
        alert("Veuillez corriger les erreurs: " + Object.values(validation.errors).join(", "));
        return;
      }

      if (editMode && selectedCommande) {
        await updateCommande(selectedCommande.id, formData);
      } else {
        await createCommande(formData);
      }
      setShowAddModal(false);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      alert("Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Supprimer cette commande ?")) {
      try {
        await deleteCommande(id);
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleReconduire = async (commande) => {
    try {
      const newEnd = prompt("Nouvelle date de fin (DD/MM/YYYY):");
      if (newEnd) {
        await reconduireCommande(commande.id, "prolongation", newEnd);
      }
    } catch (err) {
      console.error("Erreur lors de la reconduction:", err);
      alert("Erreur lors de la reconduction");
    }
  };

  const handleStatusChange = async (commande, newStatus) => {
    try {
      await updateStatus(commande.id, newStatus);
    } catch (err) {
      console.error("Erreur lors du changement de statut:", err);
      alert("Erreur lors du changement de statut");
    }
  };

  const kpis = {
    total: commandes.length,
    actives: commandes.filter(c => c.status === "active").length,
    pending: commandes.filter(c => c.status === "pending").length,
    totalAmount: commandes.reduce((sum, c) => sum + (c.amountTTC || 0), 0),
  };

  // Gestion des états de chargement et d'erreur
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-slate-400">Chargement des commandes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="text-red-600 font-semibold mb-2">Erreur de chargement</div>
          <div className="text-slate-500 text-sm mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Commandes</h1>
          <p className="text-sm text-slate-400 mt-0.5">{commandes.length} commande{commandes.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all">
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
      <CommandeFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <CommandeTable
          commandes={filtered}
          onRowClick={handleEdit}
          onReconduire={handleReconduire}
          onDevis={(cmd) => console.log("Devis", cmd)}
          onEdit={handleEdit}
          onReceipt={(cmd) => console.log("Reçu", cmd)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      <CommandeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        editMode={editMode}
        formData={formData}
        setFormData={setFormData}
        clients={clients}
        equipements={equipements}
        units={units}
        onSave={handleSave}
      />
    </div>
  );
};

export default Commandes;