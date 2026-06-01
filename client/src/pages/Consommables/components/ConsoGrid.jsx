import React from "react";
import ConsommableCard from "./ConsommableCard";
import { PackageSearch } from "lucide-react";

const ConsoGrid = ({ consommables, onEdit, onDelete, onVendre, onAjusterStock }) => {
  if (consommables.length === 0) {
    return (
      <div className="bg-white rounded-[3rem] border border-slate-100 p-16 md:p-24 text-center shadow-sm">
        <div className="w-20 h-20 md:w-28 md:h-28 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <PackageSearch size={48} className="text-slate-200" />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">Aucun produit trouvé</h3>
        <p className="text-slate-400 font-medium max-w-xs mx-auto">
          Ajustez votre recherche ou ajoutez un nouveau consommable au catalogue.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
      {consommables.map((c) => (
        <ConsommableCard
          key={c._id}
          consommable={c}
          onEdit={() => onEdit(c)}
          onDelete={() => onDelete(c._id)}
          onVendre={() => onVendre(c)}
          onAjusterStock={(qty, type) => onAjusterStock(c._id, qty, type)}
        />
      ))}
    </div>
  );
};

export default ConsoGrid;