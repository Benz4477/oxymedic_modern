import React, { useState } from "react";
import { Plus, Search, Package } from "lucide-react";

// ── Imports des composants ───────────────────────────────────────
import { useStock } from "../../hooks/pages/Stock/useStock.js";
import StockCard from "./StockCard.jsx";
import StockKPIs from "./StockKPIs.jsx";
import StockModal from "./StockModal.jsx";

// ── Composant principal ─────────────────────────────────────────
const Stock = () => {
  // ── Hook personnalisé ──
  const {
    equipements,
    categories,
    loading,
    error,
    kpis,
    createEquipement,
    updateEquipement,
    deleteEquipement,
    toggleArchive,
    updatePhoto,
    resetFormData,
    validateEquipement,
  } = useStock();

  // ── États locaux ──
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEquip, setSelectedEquip] = useState(null);
  const [formData, setFormData] = useState(resetFormData());
  const [selectedColor, setSelectedColor] = useState("#16A34A");
  const [photoPreview, setPhotoPreview] = useState("");

  // ── Filtrage ──
  const filtered = equipements.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.ref && e.ref.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchArchived = showArchived ? true : !e.archived;
    return matchSearch && matchArchived;
  });

  // ── Gestionnaires d'événements ──
  const handleAddEquip = () => {
    const newFormData = resetFormData();
    setFormData(newFormData);
    setSelectedColor("#16A34A");
    setPhotoPreview("");
    setShowAddModal(true);
  };

  const handleEditEquip = (equip) => {
    setSelectedEquip(equip);
    setFormData(equip);
    setSelectedColor(equip.cardColor || "#16A34A");
    setPhotoPreview(equip.photo || "");
    setShowEditModal(true);
  };

  const handleDeleteEquip = async (id) => {
    if (window.confirm("Supprimer définitivement cet équipement ?")) {
      try {
        await deleteEquipement(id);
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
      }
    }
  };

  const handleToggleArchive = async (id) => {
    try {
      await toggleArchive(id);
    } catch (err) {
      console.error("Erreur lors de l'archivage:", err);
    }
  };

  const handlePhotoUpload = async (id, photoData) => {
    try {
      await updatePhoto(id, photoData);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la photo:", err);
    }
  };

  const handlePrint = (equip) => {
    alert(`Impression étiquette pour ${equip.name} (à implémenter)`);
  };

const handleSubmitAdd = async () => {
  try {
    const validation = validateEquipement(formData);
    if (!validation.isValid) {
      alert("Veuillez corriger les erreurs: " + Object.values(validation.errors).join(", "));
      return;
    }
    // ← Retirer id, _id, icon avant envoi
    const { id, _id, icon, ...dataToSend } = formData;
    await createEquipement(dataToSend);
    setShowAddModal(false);
  } catch (err) {
    console.error("Erreur lors de l'ajout:", err);
  }
};

const handleSubmitEdit = async () => {
  try {
    const validation = validateEquipement(formData);
    if (!validation.isValid) {
      alert("Veuillez corriger les erreurs: " + Object.values(validation.errors).join(", "));
      return;
    }
    // Utiliser id numérique pour le update
    const { _id, icon, ...dataToSend } = formData;
    await updateEquipement(formData.id, dataToSend); // ← formData.id numérique
    setShowEditModal(false);
  } catch (err) {
    console.error("Erreur lors de la modification:", err);
  }
};

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/60 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <div className="text-slate-400">Chargement du stock...</div>
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
            <Package className="w-8 h-8 text-red-600" />
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
            Stock & Photos
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {kpis.totalActifs} équipements actifs • {kpis.totalEpuises} épuisés
            • {kpis.stockBas} stock bas
          </p>
        </div>
        <button
          onClick={handleAddEquip}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all"
        >
          <Plus size={16} />
          Ajouter un équipement
        </button>
      </div>

      {/* ── KPIs ────────────────────────────────────────────────── */}
      <StockKPIs
        totalActifs={kpis.totalActifs}
        totalEpuises={kpis.totalEpuises}
        stockBas={kpis.stockBas}
        totalArchives={kpis.totalArchives}
      />

      {/* ── Barre de recherche + filtre ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Rechercher par nom, référence..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl cursor-pointer">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
          />
          Afficher les archivés
        </label>
      </div>

      {/* ── Grille des équipements ──────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((equip) => (
          <StockCard
            key={equip._id || equip.id || Math.random()}
            equip={equip}
            onEdit={handleEditEquip}
            onToggleArchive={handleToggleArchive}
            onDelete={handleDeleteEquip}
            onPrint={handlePrint}
            onPhotoUpload={handlePhotoUpload}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16">
            <div className="text-3xl mb-2">📦</div>
            <div className="text-slate-400 text-sm">
              Aucun équipement trouvé
            </div>
          </div>
        )}
      </div>

      {/* ── MODAL AJOUT / MODIFICATION ─────────────────────────────── */}
      <StockModal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
        }}
        isEdit={showEditModal}
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        photoPreview={photoPreview}
        setPhotoPreview={setPhotoPreview}
        onSubmit={showAddModal ? handleSubmitAdd : handleSubmitEdit}
      />
    </div>
  );
};

export default Stock;
