import React, { useState } from "react";
import {
  Folder,
  Plus,
  Search,
  Package,
  Tag,
  AlertTriangle,
  List,
  GitBranch,
} from "lucide-react";

// ── Imports des composants ───────────────────────────────────────
import { useCategories } from "./hooks/useCategories.js";
import CategoryList from "./CategoryList.jsx";
import CategoryTree from "./CategoryTree.jsx";
import RefTable from "./RefTable.jsx";
import CategoryModal from "./CategoryModal.jsx";
import SubcategoryModal from "./SubcategoryModal.jsx";

// ── Composant principal ─────────────────────────────────────────
const Categories = () => {
  // ── Hook personnalisé ──
  const {
    categories,
    equipements,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    getKPIs,
    filterCategories,
    resetCategoryForm,
    resetSubcategoryForm,
    validateCategory,
    validateSubcategory,
  } = useCategories();

  // ── États locaux ──
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "list" ou "tree"
  const [expandedIds, setExpandedIds] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcatModal, setShowSubcatModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentSubcat, setCurrentSubcat] = useState(null);
  const [categoryForm, setCategoryForm] = useState(resetCategoryForm());
  const [subcatForm, setSubcatForm] = useState(resetSubcategoryForm());
  const [selectedCatForSubcat, setSelectedCatForSubcat] = useState(null);

  // ── KPIs ──
  const kpis = getKPIs();

  // ── Gestion expansion arbre ──
  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // ── Handlers modals ──
  const openAddCategory = () => {
    setEditMode(false);
    setCurrentCategory(null);
    setCategoryForm(resetCategoryForm());
    setShowCategoryModal(true);
  };

  const openEditCategory = (cat) => {
    setEditMode(true);
    setCurrentCategory(cat);
    setCategoryForm({
      name: cat.name,
      icon: cat.icon,
      color: cat.color,
      desc: cat.desc,
    });
    setShowCategoryModal(true);
  };

  const openAddSubcat = (cat) => {
    setSelectedCatForSubcat(cat);
    setCurrentSubcat(null);
    setSubcatForm(resetSubcategoryForm());
    setShowSubcatModal(true);
  };

  const openEditSubcat = (cat, subcat) => {
    setSelectedCatForSubcat(cat);
    setCurrentSubcat(subcat);
    setSubcatForm({ name: subcat.name, desc: subcat.desc });
    setShowSubcatModal(true);
  };

  const handleSaveCategory = async () => {
    const validation = validateCategory(categoryForm);
    if (!validation.isValid) {
      alert(
        "Veuillez corriger les erreurs: " +
          Object.values(validation.errors).join(", "),
      );
      return;
    }

    try {
      if (editMode && currentCategory) {
        await updateCategory(currentCategory.id, categoryForm);
      } else {
        await createCategory(categoryForm);
      }
      setShowCategoryModal(false);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      alert("Erreur lors de la sauvegarde");
    }
  };

  const handleSaveSubcat = async () => {
    const validation = validateSubcategory(subcatForm);
    if (!validation.isValid) {
      alert(
        "Veuillez corriger les erreurs: " +
          Object.values(validation.errors).join(", "),
      );
      return;
    }

    try {
      if (currentSubcat) {
        await updateSubcategory(
          selectedCatForSubcat.id,
          currentSubcat.id,
          subcatForm,
        );
      } else {
        await addSubcategory(selectedCatForSubcat.id, subcatForm);
      }
      setShowSubcatModal(false);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      alert("Erreur lors de la sauvegarde");
    }
  };

  const handleDeleteSubcat = async (catId, subcatId) => {
    if (confirm("Supprimer cette sous-catégorie ?")) {
      try {
        await deleteSubcategory(catId, subcatId);
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    if (
      confirm(
        "Supprimer cette catégorie ? Toutes les sous-catégories seront perdues.",
      )
    ) {
      try {
        await deleteCategory(id);
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        alert("Erreur lors de la suppression");
      }
    }
  };

  // ── Filtrage ──
  const filteredCategories = filterCategories(searchTerm);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center">
        <div className="text-center">
          <Folder className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <div className="text-slate-400">Chargement des catégories...</div>
        </div>
      </div>
    );
  }

  // ── Gestion des erreurs ──
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Folder className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-red-600 font-semibold mb-2">
            Erreur de chargement
          </div>
          <div className="text-slate-500 text-sm mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // ── Rendu principal ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Catégories & Références
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {kpis.totalCats} catégories actives · {kpis.totalEquips} équipements
          </p>
        </div>
        <button
          onClick={openAddCategory}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all"
        >
          <Plus size={16} /> Nouvelle catégorie
        </button>
      </div>

      {/* ── KPIs ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <Folder size={22} className="text-blue-600" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">
              {kpis.totalCats}
            </div>
            <div className="text-xs text-slate-400">Catégories actives</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Package size={22} className="text-emerald-600" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">
              {kpis.totalEquips}
            </div>
            <div className="text-xs text-slate-400">Équipements catalogués</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
            <Tag size={22} className="text-purple-600" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">
              {kpis.withRef}
            </div>
            <div className="text-xs text-slate-400">Références produit</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
            <AlertTriangle size={22} className="text-amber-500" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900">
              {kpis.withoutRef}
            </div>
            <div className="text-xs text-slate-400">Sans référence</div>
          </div>
        </div>
      </div>

      {/* ── Barre de recherche + vue ─────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Rechercher une catégorie..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${viewMode === "list" ? "bg-emerald-50 text-emerald-600" : "text-slate-400 hover:bg-slate-100"}`}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setViewMode("tree")}
            className={`p-2 rounded-lg ${viewMode === "tree" ? "bg-emerald-50 text-emerald-600" : "text-slate-400 hover:bg-slate-100"}`}
          >
            <GitBranch size={18} />
          </button>
        </div>
      </div>

      {/* ── Contenu principal : liste ou arbre ──────────────────────── */}
      {viewMode === "list" && (
        <CategoryList
          categories={filteredCategories}
          searchTerm={searchTerm}
          onEditCategory={openEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onAddSubcategory={openAddSubcat}
        />
      )}

      {viewMode === "tree" && (
        <CategoryTree
          categories={filteredCategories}
          searchTerm={searchTerm}
          expandedIds={expandedIds}
          onToggleExpand={toggleExpand}
          onAddSubcategory={openAddSubcat}
          onEditSubcategory={openEditSubcat}
          onDeleteSubcategory={handleDeleteSubcat}
        />
      )}

      {/* ── Tableau des références ─────────────────────────────────── */}
      <RefTable equipements={equipements} />

      {/* ── MODALS ──────────────────────────────────────────────────── */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        editMode={editMode}
        categoryForm={categoryForm}
        setCategoryForm={setCategoryForm}
        onSave={handleSaveCategory}
      />

      <SubcategoryModal
        isOpen={showSubcatModal}
        onClose={() => setShowSubcatModal(false)}
        selectedCategory={selectedCatForSubcat}
        currentSubcat={currentSubcat}
        subcatForm={subcatForm}
        setSubcatForm={setSubcatForm}
        onSave={handleSaveSubcat}
      />
    </div>
  );
};

export default Categories;
