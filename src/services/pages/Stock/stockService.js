// Service connecté aux vraies API backend

// ── Service pour la gestion des équipements ────────────────────────
class StockService {
  // ── Configuration API ──
  static BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // ── Récupération des données ──
  static async getAllEquipements() {
    try {
      const response = await fetch(`${this.BASE_URL}/stock`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la récupération");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur getAllEquipements:", error);
      throw error;
    }
  }

  static async getEquipementById(id) {
    try {
      const response = await fetch(`${this.BASE_URL}/stock/${id}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Équipement non trouvé");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur getEquipementById:", error);
      throw error;
    }
  }

  static async getAllCategories() {
    try {
      const response = await fetch(`${this.BASE_URL}/categories`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Erreur lors de la récupération des catégories",
        );
      }

      return data.data;
    } catch (error) {
      console.error("Erreur getAllCategories:", error);
      throw error;
    }
  }

  // ── Opérations CRUD ──
  static async createEquipement(equipData) {
    try {
      const response = await fetch(`${this.BASE_URL}/stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(equipData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la création");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur createEquipement:", error);
      throw error;
    }
  }

  static async updateEquipement(id, equipData) {
    try {
      const response = await fetch(`${this.BASE_URL}/stock/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(equipData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la mise à jour");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur updateEquipement:", error);
      throw error;
    }
  }

  static async deleteEquipement(id) {
    try {
      const response = await fetch(`${this.BASE_URL}/stock/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la suppression");
      }

      return true;
    } catch (error) {
      console.error("Erreur deleteEquipement:", error);
      throw error;
    }
  }

  static async toggleArchive(id) {
    try {
      const response = await fetch(
        `${this.BASE_URL}/stock/${id}/toggle-archive`,
        {
          method: "PATCH",
        },
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de l'archivage");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur toggleArchive:", error);
      throw error;
    }
  }

  // ── Upload photo vers Cloudinary ──
  static async uploadPhoto(file) {
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch(`${this.BASE_URL}/stock/upload-photo`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de l'upload de la photo");
      }

      return data.data.photoUrl; // URL retournée par Cloudinary
    } catch (error) {
      console.error("Erreur uploadPhoto:", error);
      throw error;
    }
  }

  // ── Utilitaires ──
  static async generateBarcode() {
    return (
      "370" +
      Math.floor(Math.random() * 1e10)
        .toString()
        .padStart(10, "0")
    );
  }

  static getSubcatsForCat(catName, categories) {
    const cat = categories.find((c) => c.name === catName);
    return cat ? cat.subcats : [];
  }

  // ── Filtrage ──
  static filterEquipements(equipements, searchTerm, showArchived) {
    return equipements.filter((e) => {
      const matchSearch =
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.ref && e.ref.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchArchived = showArchived ? true : !e.archived;
      return matchSearch && matchArchived;
    });
  }

  // ── Calculs KPIs ──
  static calculateKPIs(equipements) {
    const totalActifs = equipements.filter((e) => !e.archived).length;
    const totalEpuises = equipements.filter(
      (e) => !e.archived && e.dispo === 0,
    ).length;
    const stockBas = equipements.filter(
      (e) => !e.archived && e.dispo <= 1 && e.dispo > 0,
    ).length;
    const totalArchives = equipements.filter((e) => e.archived).length;

    return {
      totalActifs,
      totalEpuises,
      stockBas,
      totalArchives,
    };
  }
}

export default StockService;
