import React, { useState, useEffect } from "react";
import equipementService from "../../../services/equipementService";
import { ShoppingCart, Info } from "lucide-react";

const CompatEquipList = ({ consommables, onVendre }) => {
  const [equipements, setEquipements] = useState([]);

  useEffect(() => {
    const loadEquip = async () => {
      try {
        const data = await equipementService.getAll();
        setEquipements(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadEquip();
  }, []);

  const getCompatibles = (equipId) => {
    return consommables.filter((c) => c.compatEquips?.some((e) => e._id === equipId));
  };

  if (equipements.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <Info size={18} className="text-slate-300" />
        </div>
        <p className="text-xs text-slate-400 font-bold">Chargement des équipements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {equipements.map((eq) => {
        const compatibles = getCompatibles(eq._id);
        if (compatibles.length === 0) return null;
        return (
          <div key={eq._id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="px-6 py-3.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="text-xl bg-white p-1.5 rounded-xl shadow-sm border border-slate-100">
                  {eq.icon || "🔧"}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">{eq.name}</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Équipement</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold uppercase tracking-wider border border-emerald-100">
                {compatibles.length} liés
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {compatibles.map((c) => (
                  <div key={c._id} className="group flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/20 transition-all duration-300 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl group-hover:scale-110 transition-transform">{c.icon || "📦"}</div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{c.name}</div>
                        <div className="text-[9px] font-bold text-emerald-600">
                          {c.prixVente.toLocaleString()} MAD <span className="text-slate-400 font-medium">/ {c.unite}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onVendre(c)}
                      className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                      title="Vendre"
                    >
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CompatEquipList;