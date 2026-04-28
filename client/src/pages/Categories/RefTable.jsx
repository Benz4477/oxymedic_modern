import React from "react";

// Composant pour le tableau des références
const RefTable = ({ equipements }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">
          Toutes les références
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Référence
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Équipement
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Catégorie
              </th>
              <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Stock
              </th>
              <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Prix/mois
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {equipements.map((eq, index) => (
              <tr key={eq.id || `eq-${index}`} className="hover:bg-slate-50/70 cursor-pointer">
                <td className="px-4 py-3 font-mono text-xs text-purple-600">
                  {eq.ref || "—"}
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">
                  {eq.name}
                </td>
                <td className="px-4 py-3 text-slate-600">{eq.cat}</td>
                <td className="px-4 py-3 text-center font-semibold text-slate-700">
                  {eq.stock}
                </td>
                <td className="px-4 py-3 text-right font-mono text-emerald-700">
                  {eq.price ? eq.price.toLocaleString() : "0"} MAD
                </td>
              </tr>
            ))}
            {equipements.length === 0 && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-400">
                  Aucun équipement
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RefTable;
