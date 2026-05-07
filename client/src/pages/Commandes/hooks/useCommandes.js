import { useState, useEffect } from "react";
import CommandeService from "../../../services/commandeService.js";

// ── Hook personnalisé pour la gestion des commandes ─────────────────────
export const useCommandes = (
  clientsList = [],
  equipementsList = [],
  unitsList = [],
) => {
  // ── États ──
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Chargement initial ──
  useEffect(() => {
    loadData();
  }, []);

  // Fonction pour formater les données des commandes
  const formatCommandeData = (
    commande,
    clientsList = [],
    equipementsList = [],
    unitsList = [],
  ) => {
    // Trouver le client - mapper l'ID numérique vers l'ObjectId
    const client = clientsList.find((c) => {
      // Si c'est un ancien client avec id numérique
      if (c.id && c.id === commande.clientId) {
        return true;
      }
      // Si c'est un nouveau client avec ObjectId
      if (c._id === commande.clientId) {
        return true;
      }
      // Mapper les anciens IDs numériques vers les nouveaux ObjectIds
      const idMapping = {
        69: "69f14cb53ffbdd2c36dd2a1a",
        70: "69eea2846ceb3a878d6f2bb7",
        71: "69ef587a0e12210a116ce4bf",
      };
      return c._id === idMapping[commande.clientId];
    });
    const clientName = client
      ? `${client.prenom} ${client.nom}`
      : `Client ${commande.clientId}`;

    // Trouver l'équipement - mapper l'ID numérique vers l'ObjectId
    const equipement = equipementsList.find((e) => {
      // Si c'est un ancien équipement avec id numérique
      if (e.id && e.id === commande.equipId) {
        return true;
      }
      // Si c'est un nouvel équipement avec ObjectId
      if (e._id === commande.equipId) {
        return true;
      }
      // Mapper les anciens IDs numériques vers les nouveaux ObjectIds
      const idMapping = {
        69: "69eea2846ceb3a878d6f2bb7",
        70: "69eea2846ceb3a878d6f2bb8",
        71: "69eea2846ceb3a878d6f2bb9",
      };
      return e._id === idMapping[commande.equipId];
    });
    const equipName = equipement
      ? `${equipement.icon} ${equipement.name}`
      : `Équipement ${commande.equipId}`;

    // Trouver l'unité - mapper l'ID numérique vers l'ObjectId
    const unit = unitsList.find((u) => {
      // Si c'est une ancienne unité avec id numérique
      if (u.id && u.id === commande.unitId) {
        return true;
      }
      // Si c'est une nouvelle unité avec ObjectId
      if (u._id === commande.unitId) {
        return true;
      }
      // Mapper les anciens IDs numériques vers les nouveaux ObjectIds
      const idMapping = {
        69: "69ef587a0e12210a116ce4bf",
        70: "69ef587a0e12210a116ce4c0",
        71: "69ef587a0e12210a116ce4c1",
      };
      return u._id === idMapping[commande.unitId];
    });
    const unitSerial = unit ? unit.serial : null;

    return {
      ...commande,
      client: clientName,
      equipement: equipName,
      unitSerial: unitSerial,
    };
  };

  const loadData = async () => {
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
      setLoading(true);
      setError(null);
      const commandesData = await retryWithDelay(
        () => CommandeService.getAll(),
        "Commandes",
      );
      const formattedCommandes = commandesData.map((cmd) =>
        formatCommandeData(cmd, clientsList, equipementsList, unitsList),
      );
      setCommandes(formattedCommandes);
    } catch (err) {
      setError(err.message);
      console.error("Erreur lors du chargement des commandes:", err);
      if (err.message.includes("429")) {
        loadMockCommandes();
        toast.warning(
          "Mode démo: Données mock chargées (Backend indisponible)",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMockCommandes = () => {
    const mockCommandes = [
      {
        _id: "mock-1",
        id: 1,
        ref: "CMD-2026-001",
        clientId: 69,
        equipId: 69,
        unitId: 69,
        start: "01/04/2026",
        end: "15/04/2026",
        pay: "Carte",
        amountHT: 1200,
        tvaRate: 20,
        amountTTC: 1440,
        caution: 300,
        cautionMode: "Chèque",
        status: "active",
        lines: [],
        note: "Commande de démonstration",
      },
      {
        _id: "mock-2",
        id: 2,
        ref: "CMD-2026-002",
        clientId: 69,
        equipId: 69,
        unitId: 69,
        start: "10/04/2026",
        end: "20/04/2026",
        pay: "Virement",
        amountHT: 800,
        tvaRate: 20,
        amountTTC: 960,
        caution: 200,
        cautionMode: "Cash",
        status: "pending",
        lines: [],
        note: "En attente de validation",
      },
    ];
    const formattedMockCommandes = mockCommandes.map((cmd) =>
      formatCommandeData(cmd, clientsList, equipementsList, unitsList),
    );
    setCommandes(formattedMockCommandes);
  };

  // ── Opérations CRUD ──
  const createCommande = async (commandeData) => {
    try {
      const newCommande = await CommandeService.createCommande(commandeData);
      const formattedCommande = formatCommandeData(
        newCommande,
        clientsList,
        equipementsList,
        unitsList,
      );
      setCommandes([...commandes, formattedCommande]);
      return formattedCommande;
    } catch (err) {
      console.error("Erreur lors de la création de la commande:", err);
      throw err;
    }
  };

  const updateCommande = async (id, commandeData) => {
    try {
      const updatedCommande = await CommandeService.updateCommande(
        id,
        commandeData,
      );
      const formattedCommande = formatCommandeData(
        updatedCommande,
        clientsList,
        equipementsList,
        unitsList,
      );
      setCommandes(
        commandes.map((cmd) => (cmd._id === id ? formattedCommande : cmd)),
      );
      return formattedCommande;
    } catch (err) {
      console.error("Erreur updateCommande:", err);
      throw err;
    }
  };

  const deleteCommande = async (id) => {
    try {
      await CommandeService.deleteCommande(id);
      setCommandes(commandes.filter((cmd) => cmd._id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression de la commande:", err);
      throw err;
    }
  };

  // ── Fonctionnalités avancées ──
  const reconduireCommande = async (id, type, newEnd, newAmount, note) => {
    try {
      const newCommande = await CommandeService.reconduireCommande(
        id,
        type,
        newEnd,
        newAmount,
        note,
      );
      setCommandes([...commandes, newCommande]);
      return newCommande;
    } catch (err) {
      console.error("Erreur lors de la reconduction de la commande:", err);
      throw err;
    }
  };

  const updateChecklistRetour = async (id, checklistData) => {
    try {
      const updatedCommande = await CommandeService.updateChecklistRetour(
        id,
        checklistData,
      );
      setCommandes(
        commandes.map((cmd) => (cmd.id === id ? updatedCommande : cmd)),
      );
      return updatedCommande;
    } catch (err) {
      console.error("Erreur lors de la mise à jour du checklist retour:", err);
      throw err;
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const updatedCommande = await CommandeService.updateStatus(id, status);
      setCommandes(
        commandes.map((cmd) => (cmd.id === id ? updatedCommande : cmd)),
      );
      return updatedCommande;
    } catch (err) {
      console.error("Erreur lors du changement de statut:", err);
      throw err;
    }
  };

  // ── Utilitaires ──
  const getCommandeById = (id) => {
    return commandes.find((cmd) => cmd._id === id);
  };

  const getKPIs = () => {
    return CommandeService.calculateKPIs(commandes);
  };

  const filterCommandes = (searchTerm, statusFilter) => {
    return CommandeService.filterCommandes(commandes, searchTerm, statusFilter);
  };

  // ── Gestion du formulaire ──
  const resetCommandeForm = () => {
    return {
      clientId: "",
      equipId: "",
      unitId: "",
      start: "",
      end: "",
      pay: "Carte",
      amountHT: 0,
      tvaRate: 20,
      amountTTC: 0,
      caution: 0,
      cautionMode: "Cash",
      lines: [],
      note: "",
    };
  };

  // ── Validation ──
  const validateCommande = (commandeData) => {
    return CommandeService.validateCommande(commandeData);
  };

  // ── Calcul des montants ──
  const calculateAmounts = (lines, tvaRate = 20) => {
    const amountHT = lines.reduce((sum, line) => sum + line.total, 0);
    const amountTTC = amountHT * (1 + tvaRate / 100);
    return { amountHT, amountTTC };
  };

  return {
    // Données
    commandes,
    loading,
    error,

    // Opérations CRUD
    createCommande,
    updateCommande,
    deleteCommande,

    // Fonctionnalités avancées
    reconduireCommande,
    updateChecklistRetour,
    updateStatus,

    // Utilitaires
    getCommandeById,
    getKPIs,
    filterCommandes,
    loadData,

    // Formulaires
    resetCommandeForm,

    // Validation
    validateCommande,

    // Calculs
    calculateAmounts,
  };
};
