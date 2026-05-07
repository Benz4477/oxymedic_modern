import api from "../../../api";

class StockService {
  // GET /api/equipements
  static async getAllEquipements() {
    const response = await api.get("/equipements");
    return response.data.data;
  }

  static async getEquipementById(id) {
    const response = await api.get(`/equipements/${id}`);
    return response.data.data;
  }

  static async getAllCategories() {
    try {
      const response = await api.get("/categories");
      return response.data.data;
    } catch {
      return []; // catégories optionnelles
    }
  }

  // POST /api/equipements
  static async createEquipement(equipData) {
    const response = await api.post("/equipements", equipData);
    return response.data.data;
  }

  // PUT /api/equipements/:id
  static async updateEquipement(id, equipData) {
    const response = await api.put(`/equipements/${id}`, equipData);
    return response.data.data;
  }

  // DELETE /api/equipements/:id
  static async deleteEquipement(id) {
    await api.delete(`/equipements/${id}`);
    return true;
  }

  // PUT /api/equipements/:id/archive
  static async toggleArchive(id) {
    const response = await api.put(`/equipements/${id}/archive`);
    return response.data.data;
  }

  // POST /api/equipements/:id/photo
  static async uploadPhoto(equipId, file) {
    const formData = new FormData();
    formData.append("photo", file);
    const response = await api.post(`/equipements/${equipId}/photo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data.photoUrl;
  }

  // Utilitaires
  static generateBarcode() {
    return "370" + Math.floor(Math.random() * 1e10).toString().padStart(10, "0");
  }

  static getSubcatsForCat(catName, categories) {
    const cat = categories.find((c) => c.name === catName);
    return cat ? cat.subcats || [] : [];
  }

  static calculateKPIs(equipements) {
    return {
      totalActifs:  equipements.filter((e) => !e.archived).length,
      totalEpuises: equipements.filter((e) => !e.archived && e.stockDispo === 0).length,
      stockBas:     equipements.filter((e) => !e.archived && e.stockDispo === 1).length,
      totalArchives:equipements.filter((e) => e.archived).length,
    };
  }
}

export default StockService;