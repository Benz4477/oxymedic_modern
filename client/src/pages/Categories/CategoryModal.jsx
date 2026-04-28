// src/pages/Categories/components/CategoryModal.jsx
import React from "react";
import { X } from "lucide-react";

const COLOR_PALETTE = [
  "#16A34A",
  "#2563EB",
  "#7C3AED",
  "#0891B2",
  "#D97706",
  "#DC2626",
  "#059669",
  "#9333EA",
  "#0F766E",
  "#B45309",
  "#BE185D",
  "#EA580C",
  "#374151",
  "#0369A1",
  "#15803D",
];

const CategoryModal = ({
  isOpen,
  onClose,
  editMode,
  categoryForm,
  setCategoryForm,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
            {editMode ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Corps (plus compact) ── */}
        <div className="p-5 space-y-4">
          {/* Couleur */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Couleur
            </label>
            <div className="flex flex-wrap gap-1.5 items-center">
              {COLOR_PALETTE.map((col) => (
                <button
                  key={col}
                  type="button"
                  className={`w-5 h-5 rounded-full ${categoryForm.color === col ? "ring-1 ring-offset-1 ring-slate-800" : ""}`}
                  style={{ background: col }}
                  onClick={() =>
                    setCategoryForm({ ...categoryForm, color: col })
                  }
                />
              ))}
              <input
                type="color"
                value={categoryForm.color}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, color: e.target.value })
                }
                className="w-5 h-5 rounded-full border border-slate-200 cursor-pointer"
              />
            </div>
          </div>

          {/* Nom */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Nom <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, name: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Description
            </label>
            <textarea
              rows="2"
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm resize-none focus:ring-2 focus:ring-emerald-400 outline-none"
              value={categoryForm.desc}
              onChange={(e) =>
                setCategoryForm({
                  ...categoryForm,
                  desc: e.target.value,
                })
              }
            />
          </div>

          {/* Statut */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Statut
            </label>
            <select
              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={categoryForm.status}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, status: e.target.value })
              }
            >
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-3 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition"
          >
            {editMode ? "Enregistrer" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
