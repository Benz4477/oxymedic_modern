// Service pour la gestion des unités (numéros de série)

class UnitService {
  static BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  static async getAllUnits() {
    try {
      const response = await fetch(`${this.BASE_URL}/units`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la récupération des unités");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur getAllUnits:", error);
      throw error;
    }
  }

  static async getUnitById(id) {
    try {
      const response = await fetch(`${this.BASE_URL}/units/${id}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la récupération de l'unité");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur getUnitById:", error);
      throw error;
    }
  }

  static async getUnitsByEquipement(equipId) {
    try {
      const response = await fetch(`${this.BASE_URL}/units/equipement/${equipId}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la récupération des unités");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur getUnitsByEquipement:", error);
      throw error;
    }
  }

  static async createUnit(unitData) {
    try {
      const response = await fetch(`${this.BASE_URL}/units`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(unitData),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la création de l'unité");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur createUnit:", error);
      throw error;
    }
  }

  static async updateUnit(id, unitData) {
    try {
      const response = await fetch(`${this.BASE_URL}/units/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(unitData),
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la modification de l'unité");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur updateUnit:", error);
      throw error;
    }
  }

  static async deleteUnit(id) {
    try {
      const response = await fetch(`${this.BASE_URL}/units/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la suppression de l'unité");
      }

      return data;
    } catch (error) {
      console.error("Erreur deleteUnit:", error);
      throw error;
    }
  }
}

export default UnitService;
