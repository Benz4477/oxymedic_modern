// Service pour la gestion des clients

class ClientService {
  static BASE_URL = import.meta.env.VITE_API_URL || "http://192.168.11.233:5000/api";
  
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
      throw error;
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
}

export default ClientService;
