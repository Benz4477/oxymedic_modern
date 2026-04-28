import React from "react";
import { ChevronRight, ChevronDown, Edit, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

// Composant pour l'affichage des catégories en mode arbre
const CategoryTree = ({
  categories,
  searchTerm,
  expandedIds,
  onToggleExpand,
  onAddSubcategory,
  onEditSubcategory,
  onDeleteSubcategory,
}) => {
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.desc && cat.desc.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
      {filteredCategories.map((cat) => (
        <div
          key={cat.id}
          className="border border-slate-200 rounded-xl overflow-hidden"
        >
          <div
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50"
            onClick={() => onToggleExpand(cat.id)}
            style={{
              backgroundColor: `${cat.color}08`,
              borderLeft: `3px solid ${cat.color}`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                style={{
                  backgroundColor: `${cat.color}20`,
                  color: cat.color,
                }}
              >
                {cat.icon}
              </div>
              <div>
                <div className="font-bold text-slate-800">{cat.name}</div>
                <div className="text-xs text-slate-400">{cat.desc}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={cat.status} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddSubcategory(cat);
                }}
                className="text-xs bg-slate-100 px-2 py-1 rounded"
              >
                + Sous-cat
              </button>
              {expandedIds.includes(cat.id) ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>
          </div>
          {expandedIds.includes(cat.id) &&
            cat.subcats &&
            cat.subcats.length > 0 && (
              <div className="border-t border-slate-100 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cat.subcats.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex justify-between items-center p-2 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-slate-800">
                        {sub.name}
                      </div>
                      <div className="text-xs text-slate-400">{sub.desc}</div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => onEditSubcategory(cat, sub)}
                        className="p-1 rounded hover:bg-white"
                      >
                        <Edit size={12} />
                      </button>
                      <button
                        onClick={() => onDeleteSubcategory(cat.id, sub.id)}
                        className="p-1 rounded hover:bg-white text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      ))}
    </div>
  );
};

export default CategoryTree;
