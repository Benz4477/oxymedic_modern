import { useState, useEffect } from "react";
import CategoryService from "../services/categoryService.js";

// ── Hook personnalisé pour la gestion des catégories ─────────────────────
export const useCategories = () => {
  // ── États ──
  const [categories, setCategories] = useState([]);
  const [equipements, setEquipements] = useState([]);
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
      const [categoriesData, equipementsData] = await Promise.all([
        CategoryService.getAllCategories(),
        CategoryService.getEquipements(),
      ]);
      setCategories(categoriesData);
      setEquipements(equipementsData);
    } catch (err) {
      setError(err.message);
      console.error("Erreur lors du chargement des données:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Opérations CRUD ──
  const createCategory = async (categoryData) => {
    try {
      const newCategory = await CategoryService.createCategory(categoryData);
      setCategories([...categories, newCategory]);
      return newCategory;
    } catch (err) {
      console.error("Erreur lors de la création de la catégorie:", err);
      throw err;
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const updatedCategory = await CategoryService.updateCategory(
        id,
        categoryData,
      );
      setCategories(
        categories.map((cat) => (cat.id === id ? updatedCategory : cat)),
      );
      return updatedCategory;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la catégorie:", err);
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await CategoryService.deleteCategory(id);
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression de la catégorie:", err);
      throw err;
    }
  };

  // ── Gestion des sous-catégories ──
  const addSubcategory = async (categoryId, subcategoryData) => {
    try {
      const updatedCategory = await CategoryService.addSubcategory(
        categoryId,
        subcategoryData,
      );
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId ? updatedCategory : cat,
        ),
      );
      return updatedCategory;
    } catch (err) {
      console.error("Erreur lors de l'ajout de la sous-catégorie:", err);
      throw err;
    }
  };

  const updateSubcategory = async (
    categoryId,
    subcategoryId,
    subcategoryData,
  ) => {
    try {
      const updatedCategory = await CategoryService.updateSubcategory(
        categoryId,
        subcategoryId,
        subcategoryData,
      );
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId ? updatedCategory : cat,
        ),
      );
      return updatedCategory;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la sous-catégorie:", err);
      throw err;
    }
  };

  const deleteSubcategory = async (categoryId, subcategoryId) => {
    try {
      const updatedCategory = await CategoryService.deleteSubcategory(
        categoryId,
        subcategoryId,
      );
      setCategories(
        categories.map((cat) =>
          cat.id === categoryId ? updatedCategory : cat,
        ),
      );
      return updatedCategory;
    } catch (err) {
      console.error("Erreur lors de la suppression de la sous-catégorie:", err);
      throw err;
    }
  };

  // ── Utilitaires ──
  const getCategoryById = (id) => {
    return categories.find((cat) => cat.id === id);
  };

  const getKPIs = () => {
    return CategoryService.calculateKPIs(categories, equipements);
  };

  const filterCategories = (searchTerm) => {
    return CategoryService.filterCategories(categories, searchTerm);
  };

  // ── Gestion du formulaire ──
  const resetCategoryForm = () => {
    return {
      name: "",
      icon: "🏷️",
      color: "#16A34A",
      desc: "",
    };
  };

  const resetSubcategoryForm = () => {
    return { name: "", desc: "" };
  };

  // ── Validation ──
  const validateCategory = (categoryData) => {
    const errors = {};

    if (!categoryData.name || categoryData.name.trim() === "") {
      errors.name = "Le nom est requis";
    }

    if (!categoryData.icon || categoryData.icon.trim() === "") {
      errors.icon = "L'icône est requise";
    }

    if (!categoryData.color) {
      errors.color = "La couleur est requise";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const validateSubcategory = (subcategoryData) => {
    const errors = {};

    if (!subcategoryData.name || subcategoryData.name.trim() === "") {
      errors.name = "Le nom est requis";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  return {
    // Données
    categories,
    equipements,
    loading,
    error,

    // Opérations CRUD
    createCategory,
    updateCategory,
    deleteCategory,

    // Sous-catégories
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,

    // Utilitaires
    getCategoryById,
    getKPIs,
    filterCategories,
    loadData,

    // Formulaires
    resetCategoryForm,
    resetSubcategoryForm,

    // Validation
    validateCategory,
    validateSubcategory,
  };
};
