import React from "react";
import { X } from "lucide-react";

// Composant modal pour l'ajout/modification des sous-catégories
const SubcategoryModal = ({
  isOpen,
  onClose,
  selectedCategory,
  currentSubcat,
  subcatForm,
  setSubcatForm,
  onSave,
}) => {
  if (!isOpen || !selectedCategory) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold">
            {currentSubcat
              ? "Modifier sous-catégorie"
              : "Nouvelle sous-catégorie"}{" "}
            — {selectedCategory.name}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400">
              Nom *
            </label>
            <input
              type="text"
              className="w-full border rounded-xl p-2.5"
              value={subcatForm.name}
              onChange={(e) =>
                setSubcatForm({ ...subcatForm, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400">
              Description
            </label>
            <input
              type="text"
              className="w-full border rounded-xl p-2.5"
              value={subcatForm.desc}
              onChange={(e) =>
                setSubcatForm({
                  ...subcatForm,
                  desc: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="p-5 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 rounded-xl"
          >
            Annuler
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubcategoryModal;
