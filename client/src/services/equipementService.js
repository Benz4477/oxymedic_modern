// Service pour la gestion des équipements

class EquipementService {
  static BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  static async getAllEquipements() {
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
      console.error("Erreur getAllEquipements:", error);
      // En cas d'erreur, retourner les données mockées pour le développement
      return this.getMockEquipements();
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

  // Données mock pour le développement (fallback)
  static getMockEquipements() {
    return [
      {
        _id: "1",
        name: "Fauteuil roulant standard",
        icon: "🦽",
        archived: false,
      },
      { _id: "2", name: "Lit médicalisé", icon: "🛏️", archived: false },
      { _id: "3", name: "Déambulateur", icon: "🚶", archived: false },
      { _id: "4", name: "Oxygène portable", icon: "🫧", archived: false },
      { _id: "5", name: "Matelas anti-escarres", icon: "🛏️", archived: false },
      { _id: "6", name: "Béquilles", icon: "🦯", archived: false },
      { _id: "7", name: "Rollator", icon: "🚶", archived: false },
      { _id: "8", name: "Lit électrique", icon: "⚡", archived: false },
    ];
  }
}

export default EquipementService;
