// Service connecté à l'API backend pour la gestion des commandes

class CommandeService {
  // ── Configuration API ──
static BASE_URL = import.meta.env.VITE_API_URL || "http://192.168.11.233:5000/api";
  // ── Récupération des données ──
  static async getAllCommandes() {
    try {
      const response = await fetch(`${this.BASE_URL}/commandes`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la récupération des commandes");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur getAllCommandes:", error);
      throw error;
    }
  }

  static async getCommandeById(id) {
    try {
      const response = await fetch(`${this.BASE_URL}/commandes/${id}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Commande non trouvée");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur getCommandeById:", error);
      throw error;
    }
  }

  // ── Opérations CRUD ──
  static async createCommande(commandeData) {
    try {
      const response = await fetch(`${this.BASE_URL}/commandes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commandeData),
      });

      const data = await response.json();

      if (!data.success) {
        const errorMessage = data.errors && data.errors.length > 0 
          ? data.errors.join(", ")
          : data.message || "Erreur lors de la création de la commande";
        throw new Error(errorMessage);
      }

      return data.data;
    } catch (error) {
      console.error("Erreur createCommande:", error);
      throw error;
    }
  }

  static async updateCommande(id, commandeData) {
    try {
      const response = await fetch(`${this.BASE_URL}/commandes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commandeData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la mise à jour de la commande");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur updateCommande:", error);
      throw error;
    }
  }

  static async deleteCommande(id) {
    try {
      const response = await fetch(`${this.BASE_URL}/commandes/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la suppression de la commande");
      }

      return true;
    } catch (error) {
      console.error("Erreur deleteCommande:", error);
      throw error;
    }
  }

  // ── Fonctionnalités avancées ──
  static async reconduireCommande(id, type, newEnd, newAmount, note) {
    try {
      const response = await fetch(`${this.BASE_URL}/commandes/${id}/reconduire`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          newEnd,
          newAmount,
          note,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la reconduction de la commande");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur reconduireCommande:", error);
      throw error;
    }
  }

  static async updateChecklistRetour(id, checklistData) {
    try {
      const response = await fetch(`${this.BASE_URL}/commandes/${id}/checklist-retour`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checklistData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la mise à jour du checklist retour");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur updateChecklistRetour:", error);
      throw error;
    }
  }

  static async updateStatus(id, status) {
    try {
      const response = await fetch(`${this.BASE_URL}/commandes/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la mise à jour du statut");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur updateStatus:", error);
      throw error;
    }
  }

  // ── Utilitaires ──
  static filterCommandes(commandes, searchTerm, statusFilter) {
    return commandes.filter((cmd) => {
      const matchSearch =
        cmd.ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.client?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = !statusFilter || cmd.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }

  static calculateKPIs(commandes) {
    const total = commandes.length;
    const actives = commandes.filter((c) => c.status === "active").length;
    const pending = commandes.filter((c) => c.status === "pending").length;
    const totalAmount = commandes.reduce((sum, c) => sum + (c.amountTTC || 0), 0);

    return {
      total,
      actives,
      pending,
      totalAmount,
    };
  }

  // ── Données mock pour le développement (fallback) ──
  static getMockCommandes() {
    return [
      {
        id: 1,
        ref: "CMD-2024-001",
        clientId: 1,
        equipId: "1",
        unitId: 1,
        start: "15/04/2024",
        end: "20/04/2024",
        status: "active",
        pay: "Carte",
        amountHT: 1000,
        tvaRate: 20,
        amountTTC: 1200,
        caution: 500,
        cautionMode: "Cash",
        lines: [],
        note: "Commande test",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        ref: "CMD-2024-002",
        clientId: 2,
        equipId: "2",
        unitId: 2,
        start: "18/04/2024",
        end: "25/04/2024",
        status: "pending",
        pay: "Virement",
        amountHT: 1500,
        tvaRate: 20,
        amountTTC: 1800,
        caution: 750,
        cautionMode: "Chèque",
        lines: [],
        note: "Commande en attente",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // ── Génération de références ──
  static generateReference() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000);
    return `CMD-${year}-${String(random).padStart(3, "0")}`;
  }

  // ── Validation ──
  static validateCommande(commandeData) {
    const errors = {};

    if (!commandeData.clientId) {
      errors.clientId = "Le client est requis";
    }

    if (!commandeData.equipId) {
      errors.equipId = "L'équipement est requis";
    }

    if (!commandeData.start) {
      errors.start = "La date de début est requise";
    }

    if (!commandeData.end) {
      errors.end = "La date de fin est requise";
    }

    if (!commandeData.pay) {
      errors.pay = "Le mode de paiement est requis";
    }

    if (!commandeData.amountTTC || commandeData.amountTTC <= 0) {
      errors.amountTTC = "Le montant TTC est requis et doit être positif";
    }

    // Validation des dates
    if (commandeData.start && commandeData.end) {
      const startDate = new Date(commandeData.start.split("/").reverse().join("-"));
      const endDate = new Date(commandeData.end.split("/").reverse().join("-"));
      
      if (startDate >= endDate) {
        errors.dates = "La date de fin doit être postérieure à la date de début";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export default CommandeService;
