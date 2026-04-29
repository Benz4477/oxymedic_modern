// src/pages/Commandes/Commandes.jsx
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useCommandes } from "./hooks/useCommandes.js";
import ClientService from "../../services/clientService.js";
import EquipementService from "../../services/equipementService.js";
import UnitService from "../../services/unitService.js";
import { toast } from "react-toastify";
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
      const formattedCommandes = rawCommandes.map((cmd) => {
        // Trouver le client - mapper l'ID numérique vers l'ObjectId
        const client = clients.find((c) => {
          // Si c'est un ancien client avec id numérique
          if (c.id && c.id === cmd.clientId) {
            return true;
          }
          // Si c'est un nouveau client avec ObjectId
          if (c._id === cmd.clientId) {
            return true;
          }
          // Mapper les anciens IDs numériques vers les nouveaux ObjectIds
          // 69 -> 69f14cb53ffbdd2c36dd2a1a (client Michel)
          const idMapping = {
            69: "69f14cb53ffbdd2c36dd2a1a",
            70: "69eea2846ceb3a878d6f2bb7",
            71: "69ef587a0e12210a116ce4bf",
          };
          return c._id === idMapping[cmd.clientId];
        });
        const clientName = client
          ? `${client.prenom} ${client.nom}`
          : `Client ${cmd.clientId}`;

        // Trouver l'équipement - mapper l'ID numérique vers l'ObjectId
        const equipement = equipements.find((e) => {
          // Si c'est un ancien équipement avec id numérique
          if (e.id && e.id === cmd.equipId) {
            return true;
          }
          // Si c'est un nouvel équipement avec ObjectId
          if (e._id === cmd.equipId) {
            return true;
          }
          // Mapper les anciens IDs numériques vers les nouveaux ObjectIds
          const idMapping = {
            69: "69eea2846ceb3a878d6f2bb7",
            70: "69eea2846ceb3a878d6f2bb8",
            71: "69eea2846ceb3a878d6f2bb9",
          };
          return e._id === idMapping[cmd.equipId];
        });
        const equipName = equipement
          ? `${equipement.icon} ${equipement.name}`
          : `Équipement ${cmd.equipId}`;

        // Trouver l'unité - mapper l'ID numérique vers l'ObjectId
        const unit = units.find((u) => {
          // Si c'est une ancienne unité avec id numérique
          if (u.id && u.id === cmd.unitId) {
            return true;
          }
          // Si c'est une nouvelle unité avec ObjectId
          if (u._id === cmd.unitId) {
            return true;
          }
          // Mapper les anciens IDs numériques vers les nouveaux ObjectIds
          const idMapping = {
            69: "69ef587a0e12210a116ce4bf",
            70: "69ef587a0e12210a116ce4c0",
            71: "69ef587a0e12210a116ce4c1",
          };
          return u._id === idMapping[cmd.unitId];
        });
        const unitSerial = unit ? unit.serial : null;

        const formatted = {
          ...cmd,
          client: clientName,
          equipement: equipName,
          unitSerial: unitSerial,
          caution:
            cmd.caution !== 0 && cmd.caution !== undefined ? cmd.caution : null,
        };
        return formatted;
      });
      setCommandes(formattedCommandes);
    }
  }, [rawCommandes, clients, equipements, units]);

  const loadRelatedData = async () => {
    const retryWithDelay = async (
      serviceCall,
      serviceName,
      maxRetries = 2,
      delay = 2000,
    ) => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await serviceCall();
        } catch (error) {
          if (
            (error.message.includes("Trop de requêtes") ||
              error.message.includes("Too Many Requests")) &&
            i < maxRetries - 1
          ) {
            console.warn(
              `Erreur ${serviceName}, tentative ${i + 1}/${maxRetries}, retry dans ${delay}ms...`,
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
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
        retryWithDelay(
          () => EquipementService.getAllEquipements(),
          "Équipements",
        ),
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

  const filtered = commandes.filter((c) => {
    const matchSearch =
      c.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        toast.error(
          "Veuillez corriger les erreurs: " +
            Object.values(validation.errors).join(", "),
        );
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
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Supprimer cette commande ?")) {
      try {
        await deleteCommande(id);
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        toast.error("Erreur lors de la suppression");
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
      toast.error("Erreur lors de la reconduction");
    }
  };

  const handleStatusChange = async (commande, newStatus) => {
    try {
      await updateStatus(commande.id, newStatus);
    } catch (err) {
      console.error("Erreur lors du changement de statut:", err);
      toast.error("Erreur lors du changement de statut");
    }
  };

  const kpis = {
    total: commandes.length,
    actives: commandes.filter((c) => c.status === "active").length,
    pending: commandes.filter((c) => c.status === "pending").length,
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
          <div className="text-red-600 font-semibold mb-2">
            Erreur de chargement
          </div>
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
