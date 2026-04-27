import { useState, useEffect } from "react";
import StockService from "../../../services/pages/Stock/stockService.js";
import { DEFAULT_FORM_DATA } from "../../../pages/Stock/constants/stockConstants.js";

// ── Hook personnalisé pour la gestion du stock ─────────────────────
export const useStock = () => {
  const [equipements, setEquipements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Chargement initial ──
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [equipementsData, categoriesData] = await Promise.all([
        StockService.getAllEquipements(),
        StockService.getAllCategories(),
      ]);
      setEquipements(equipementsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
      console.error("Erreur lors du chargement des données:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Opérations CRUD ──
  const createEquipement = async (equipData) => {
    try {
      const newEquip = await StockService.createEquipement(equipData);
      setEquipements((prev) => [...prev, newEquip]);
      return newEquip;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateEquipement = async (id, equipData) => {
    try {
      const updatedEquip = await StockService.updateEquipement(id, equipData);
      setEquipements((prev) =>
        prev.map((e) => (e.id === id ? updatedEquip : e)),
      );
      return updatedEquip;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteEquipement = async (id) => {
    try {
      await StockService.deleteEquipement(id);
      setEquipements((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const toggleArchive = async (id) => {
    try {
      const updatedEquip = await StockService.toggleArchive(id);
      setEquipements((prev) =>
        prev.map((e) => (e.id === id ? updatedEquip : e)),
      );
      return updatedEquip;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updatePhoto = async (id, file) => {
    try {
      const equipement = equipements.find((e) => e._id === id || e.id === id);
      if (equipement) {
        // Utiliser _id pour l'URL MongoDB
        const mongoId = equipement._id || equipement.id;

        // Upload vers Cloudinary via l'endpoint existant
        const photoUrl = await StockService.uploadPhoto(file);

        // Mettre à jour l'équipement avec l'URL Cloudinary
        const updatedEquip = await StockService.updateEquipement(mongoId, {
          ...equipement,
          photo: photoUrl,
        });
        setEquipements((prev) =>
          prev.map((e) => (e._id === id || e.id === id ? updatedEquip : e)),
        );
        return updatedEquip;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // ── Utilitaires ──
  const getEquipementById = (id) => {
    return equipements.find((e) => e.id === id);
  };

  const getSubcatsForCat = (catName) => {
    return StockService.getSubcatsForCat(catName, categories);
  };

  const generateBarcode = async () => {
    return await StockService.generateBarcode();
  };

  // ── Filtrage ──
  const filterEquipements = (searchTerm, showArchived) => {
    return StockService.filterEquipements(
      equipements,
      searchTerm,
      showArchived,
    );
  };

  // ── KPIs ──
  const kpis = StockService.calculateKPIs(equipements);

  // ── Gestion du formulaire ──
  const resetFormData = () => {
    return {
      ...DEFAULT_FORM_DATA,
      cat: categories[0]?.name || "",
    };
  };

  // ── Validation ──
  const validateEquipement = (data) => {
    const errors = {};

    if (!data.name?.trim()) {
      errors.name = "Le nom est requis";
    }

    if (!data.cat?.trim()) {
      errors.cat = "La catégorie est requise";
    }

    if (data.total < 0) {
      errors.total = "Le stock total doit être positif";
    }

    if (data.dispo < 0 || data.dispo > data.total) {
      errors.dispo = "Le stock disponible doit être entre 0 et le stock total";
    }

    if (
      data.pDay < 0 ||
      data.pWeek < 0 ||
      data.pMonth < 0 ||
      data.pVente < 0 ||
      data.caution < 0
    ) {
      errors.prices = "Les prix doivent être positifs";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  return {
    // Données
    equipements,
    categories,
    loading,
    error,
    kpis,

    // Actions
    createEquipement,
    updateEquipement,
    deleteEquipement,
    toggleArchive,
    updatePhoto,
    loadData,

    // Utilitaires
    getEquipementById,
    getSubcatsForCat,
    generateBarcode,
    filterEquipements,
    resetFormData,
    validateEquipement,

    // Nettoyage
    clearError: () => setError(null),
  };
};
