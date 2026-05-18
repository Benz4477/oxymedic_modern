import React from "react";
import { Tag, Hash, Package, AlertCircle } from "lucide-react";

const RefTable = ({ equipements }) => {
  return (
    <div className="overflow-x-auto">
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-50">
        <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-tight">
          <Tag size={14} className="text-purple-500" /> Références Produits
        </div>
      </div>
      <table className="w-full">
        <thead className="bg-slate-50/20">
          <tr>
            <th className="px-6 py-3 text-left">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <Package size={12} /> Équipement
              </div>
            </th>
            <th className="px-6 py-3 text-left">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <Hash size={12} /> Référence
              </div>
            </th>
            <th className="px-6 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Catégorie
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {equipements.map((eq) => (
            <tr key={eq.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="text-[13px] font-black text-slate-800 uppercase tracking-tight">
                  {eq.name}
                </div>
              </td>
              <td className="px-6 py-4">
                {eq.ref ? (
                  <div className="font-mono text-[11px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded w-fit">
                    {eq.ref}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <AlertCircle size={10} />
                    <span className="text-[10px] font-bold uppercase tracking-wider italic">Non référencé</span>
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {typeof eq.cat === "object" ? eq.cat?.name : (eq.cat || "Sans catégorie")}
                  {eq.subcat && (
                    <span className="lowercase normal-case text-slate-400 ml-1">
                      ({typeof eq.subcat === "object" ? eq.subcat?.name : eq.subcat})
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {equipements.length === 0 && (
            <tr>
              <td colSpan="3" className="py-12 text-center">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Aucun équipement catalogué</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RefTable;
