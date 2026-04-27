// Service pour la gestion des clients

class ClientService {
  static BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  static async getAllClients() {
    try {
      const response = await fetch(`${this.BASE_URL}/clients`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Erreur lors de la récupération des clients");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur getAllClients:", error);
      // En cas d'erreur, retourner les données mockées pour le développement
      return this.getMockClients();
    }
  }

  static async getClientById(id) {
    try {
      const response = await fetch(`${this.BASE_URL}/clients/${id}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Client non trouvé");
      }

      return data.data;
    } catch (error) {
      console.error("Erreur getClientById:", error);
      throw error;
    }
  }

  // Données mock pour le développement (fallback)
  static getMockClients() {
    return [
      { id: 1, prenom: "Mohammed", nom: "Alaoui", telephone: "0612345678", email: "mohammed@email.com" },
      { id: 2, prenom: "Fatima", nom: "Zahra", telephone: "0623456789", email: "fatima@email.com" },
      { id: 3, prenom: "Youssef", nom: "Amrani", telephone: "0634567890", email: "youssef@email.com" },
      { id: 4, prenom: "Aicha", nom: "Bennani", telephone: "0645678901", email: "aicha@email.com" },
      { id: 5, prenom: "Omar", nom: "El Fassi", telephone: "0656789012", email: "omar@email.com" },
    ];
  }
}

export default ClientService;
