// Service connecté aux vraies API backend pour la gestion des catégories

class CategoryService {
  // ── Configuration API ──
static BASE_URL = import.meta.env.VITE_API_URL || "http://192.168.11.233:5000/api";
  // ── Récupération des données ──
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

  static async getCategoryById(id) {
    try {
      const response = await fetch(`${this.BASE_URL}/categories/${id}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Catégorie non trouvée");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur getCategoryById:", error);
      throw error;
    }
  }

  // ── Opérations CRUD ──
  static async createCategory(categoryData) {
    try {
      const response = await fetch(`${this.BASE_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Erreur lors de la création de la catégorie",
        );
      }

      return data.data;
    } catch (error) {
      console.error("Erreur createCategory:", error);
      throw error;
    }
  }

  static async updateCategory(id, categoryData) {
    try {
      const response = await fetch(`${this.BASE_URL}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Erreur lors de la mise à jour de la catégorie",
        );
      }

      return data.data;
    } catch (error) {
      console.error("Erreur updateCategory:", error);
      throw error;
    }
  }

  static async deleteCategory(id) {
    try {
      const response = await fetch(`${this.BASE_URL}/categories/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Erreur lors de la suppression de la catégorie",
        );
      }

      return true;
    } catch (error) {
      console.error("Erreur deleteCategory:", error);
      throw error;
    }
  }

  // ── Sous-catégories ──
  static async addSubcategory(categoryId, subcategoryData) {
    try {
      // Récupérer la catégorie existante
      const category = await this.getCategoryById(categoryId);
      if (!category) throw new Error("Catégorie non trouvée");

      // Générer un ID pour la nouvelle sous-catégorie
      const subcats = category.subcats || [];
      const newId =
        subcats.length > 0 ? Math.max(...subcats.map((s) => s.id)) + 1 : 1;

      // Ajouter la nouvelle sous-catégorie
      const updatedSubcats = [...subcats, { id: newId, ...subcategoryData }];

      // Mettre à jour la catégorie
      return await this.updateCategory(categoryId, { subcats: updatedSubcats });
    } catch (error) {
      console.error("Erreur addSubcategory:", error);
      throw error;
    }
  }

  static async updateSubcategory(categoryId, subcategoryId, subcategoryData) {
    try {
      // Récupérer la catégorie existante
      const category = await this.getCategoryById(categoryId);
      if (!category) throw new Error("Catégorie non trouvée");

      // Mettre à jour la sous-catégorie spécifique
      const updatedSubcats = category.subcats.map((sub) =>
        sub.id === subcategoryId ? { ...sub, ...subcategoryData } : sub,
      );

      // Mettre à jour la catégorie
      return await this.updateCategory(categoryId, { subcats: updatedSubcats });
    } catch (error) {
      console.error("Erreur updateSubcategory:", error);
      throw error;
    }
  }

  static async deleteSubcategory(categoryId, subcategoryId) {
    try {
      // Récupérer la catégorie existante
      const category = await this.getCategoryById(categoryId);
      if (!category) throw new Error("Catégorie non trouvée");

      // Supprimer la sous-catégorie
      const updatedSubcats = category.subcats.filter(
        (sub) => sub.id !== subcategoryId,
      );

      // Mettre à jour la catégorie
      return await this.updateCategory(categoryId, { subcats: updatedSubcats });
    } catch (error) {
      console.error("Erreur deleteSubcategory:", error);
      throw error;
    }
  }

  // ── Équipements pour les références ──
  static async getEquipements() {
    try {
      const response = await fetch(`${this.BASE_URL}/stock`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Erreur lors de la récupération des équipements",
        );
      }

      return data.data;
    } catch (error) {
      console.error("Erreur getEquipements:", error);
      throw error;
    }
  }

  // ── Utilitaires ──
  static filterCategories(categories, searchTerm) {
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.desc && cat.desc.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }

  static calculateKPIs(categories, equipements) {
    const totalCats = categories.filter(cat => cat.status === "actif").length;
    const totalEquips = equipements.length;
    const withRef = equipements.filter((e) => e.ref && e.ref.trim()).length;
    const withoutRef = totalEquips - withRef;

    return {
      totalCats,
      totalEquips,
      withRef,
      withoutRef,
    };
  }
}

export default CategoryService;
