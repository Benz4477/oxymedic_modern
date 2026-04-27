import React from "react";
import { Edit, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

// Composant pour l'affichage des catégories en mode liste
const CategoryList = ({
  categories,
  searchTerm,
  onEditCategory,
  onDeleteCategory,
  onAddSubcategory,
}) => {
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.desc && cat.desc.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Catégorie
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Sous-catégories
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Description
              </th>
              <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Statut
              </th>
              <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredCategories.map((cat) => (
              <tr
                key={cat.id}
                className="hover:bg-slate-50/70 cursor-pointer"
                onClick={() => onEditCategory(cat)}
              >
                <td className="px-4 py-3">
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
                      <div className="font-semibold text-slate-800">
                        {cat.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ID {cat.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {cat.subcats &&
                      cat.subcats.map((sub) => (
                        <span
                          key={sub.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600"
                        >
                          {sub.name}
                        </span>
                      ))}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddSubcategory(cat);
                      }}
                      className="text-[10px] text-emerald-600 hover:underline"
                    >
                      + Ajouter
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate">
                  {cat.desc}
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={cat.status} />
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCategory(cat);
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-100"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCategory(cat.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan="5" className="py-10 text-center text-slate-400">
                  Aucune catégorie trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList;
