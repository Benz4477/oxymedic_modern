import { useState, useEffect } from "react";
import CommandeService from "../../../services/commandeService.js";

// ── Hook personnalisé pour la gestion des commandes ─────────────────────
export const useCommandes = (clientsList = [], equipementsList = [], unitsList = []) => {
  // ── États ──
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Chargement initial ──
  useEffect(() => {
    loadData();
  }, []);

  // Fonction pour formater les données des commandes
  const formatCommandeData = (commande, clientsList = [], equipementsList = [], unitsList = []) => {
    // Trouver le client par ID
    const client = clientsList.find(c => c.id === commande.clientId);
    const clientName = client ? `${client.prenom} ${client.nom}` : `Client ${commande.clientId}`;
    
    // Trouver l'équipement par ID
    const equipement = equipementsList.find(e => e._id === commande.equipId || e.id === commande.equipId);
    const equipName = equipement ? `${equipement.icon} ${equipement.name}` : `Équipement ${commande.equipId}`;
    
    // Trouver l'unité par ID
    const unit = unitsList.find(u => u.id === commande.unitId);
    const unitSerial = unit ? unit.serial : null;
    
    return {
      ...commande,
      client: clientName,
      equipement: equipName,
      unitSerial: unitSerial,
    };
  };

  const loadData = async () => {
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
      setLoading(true);
      setError(null);
      const commandesData = await retryWithDelay(() => CommandeService.getAllCommandes(), "Commandes");
      const formattedCommandes = commandesData.map(cmd => formatCommandeData(cmd, clientsList, equipementsList, unitsList));
      setCommandes(formattedCommandes);
    } catch (err) {
      setError(err.message);
      console.error("Erreur lors du chargement des commandes:", err);
      // Ne pas utiliser les données mockées - laisser l'erreur se propager
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ── Opérations CRUD ──
  const createCommande = async (commandeData) => {
    try {
      const newCommande = await CommandeService.createCommande(commandeData);
      const formattedCommande = formatCommandeData(newCommande, clientsList, equipementsList, unitsList);
      setCommandes([...commandes, formattedCommande]);
      return formattedCommande;
    } catch (err) {
      console.error("Erreur lors de la création de la commande:", err);
      throw err;
    }
  };

  const updateCommande = async (id, commandeData) => {
    try {
      const updatedCommande = await CommandeService.updateCommande(id, commandeData);
      const formattedCommande = formatCommandeData(updatedCommande, clientsList, equipementsList, unitsList);
      setCommandes(
        commandes.map((cmd) => (cmd.id === id ? formattedCommande : cmd))
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
      setCommandes(commandes.filter((cmd) => cmd.id !== id));
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
        note
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
        checklistData
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
    return commandes.find((cmd) => cmd.id === id);
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
