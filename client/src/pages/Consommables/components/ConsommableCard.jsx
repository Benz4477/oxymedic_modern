import React, { useState } from "react";
import { Edit, Trash2, ShoppingCart, AlertCircle, Plus, Minus, Hash, Tag, Package } from "lucide-react";

const ConsommableCard = ({ consommable, onEdit, onDelete, onVendre, onAjusterStock }) => {
  const [ajustQty, setAjustQty] = useState(1);
  const isLowStock = consommable.stock <= consommable.seuilAlerte;
  
  return (
    <div className="group bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500 flex flex-col h-full">
      <div className="p-4 md:p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            {consommable.photo ? (
              <img src={consommable.photo} alt={consommable.name} className="w-10 h-10 object-cover rounded-xl border border-slate-100 group-hover:scale-110 transition-transform duration-500 bg-slate-50" />
            ) : (
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-lg group-hover:scale-110 transition-transform duration-500 flex items-center justify-center w-10 h-10">
                🧴
              </div>
            )}
            <div>
              <div className="flex items-center gap-1 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                <Hash size={10} /> {consommable.ref || consommable.reference || "NO-REF"}
              </div>
              <h3 className="text-sm font-black text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors">
                {consommable.nom || consommable.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] font-bold text-slate-400">
                  {consommable.marque || "Marque inconnue"}
                </span>
                <span className="text-[8px] text-slate-300">•</span>
                <span className="text-[9px] font-bold text-slate-400 italic">
                  {consommable.origine || "—"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={onEdit} className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all" title="Modifier">
              <Edit size={14} />
            </button>
            <button onClick={() => onDelete(consommable._id)} className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all" title="Supprimer">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-wider rounded border border-emerald-100">
            <Tag size={8} /> {consommable.categorie || "Consommable"}
          </span>
          {consommable.compatEquips?.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-purple-50 text-purple-600 text-[9px] font-black uppercase tracking-wider rounded border border-purple-100">
              <Package size={8} /> {consommable.compatEquips.length} compatibles
            </span>
          )}
        </div>

        {/* Pricing & Stock */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-50">
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Prix Vente / Achat</div>
            <div className="text-lg font-black text-slate-900 leading-none mb-1">
              {consommable.prixVente.toLocaleString()} <span className="text-[10px] text-slate-400">MAD</span>
            </div>
            <div className="text-[9px] font-bold text-slate-400 opacity-60">
              Achat: {consommable.prixAchatTTC?.toLocaleString() || "—"} MAD
            </div>
          </div>
          <div className={`p-2.5 rounded-xl border ${isLowStock ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-50"}`}>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Actuel</div>
            <div className={`text-lg font-black leading-none ${isLowStock ? "text-amber-600" : "text-emerald-600"}`}>
              {consommable.stock} <span className="text-[10px] opacity-60 font-bold uppercase">{consommable.unite}</span>
            </div>
          </div>
        </div>

        {/* Adjuster */}
        <div className="mt-auto space-y-2 p-2.5 bg-slate-50/50 rounded-xl border border-slate-50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ajuster Stock</span>
            <div className="flex items-center bg-white rounded-lg border border-slate-100 p-0.5">
              <button onClick={() => setAjustQty(prev => Math.max(1, prev - 1))} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors">
                <Minus size={12} />
              </button>
              <input type="number" min="1" value={ajustQty} onChange={(e) => setAjustQty(Math.max(1, parseInt(e.target.value) || 1))} className="w-10 text-center text-xs font-black text-slate-700 outline-none bg-transparent" />
              <button onClick={() => setAjustQty(prev => prev + 1)} className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors">
                <Plus size={12} />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onAjusterStock(consommable._id, ajustQty, "add")} className="flex-1 py-2 bg-white text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
              Entrée
            </button>
            <button onClick={() => onAjusterStock(consommable._id, ajustQty, "remove")} className="flex-1 py-2 bg-white text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100 hover:bg-amber-600 hover:text-white transition-all shadow-sm">
              Sortie
            </button>
          </div>
        </div>
      </div>

      {/* Main Action Button */}
      <div className="px-4 md:px-5 pb-4 md:pb-5">
        <button
          onClick={onVendre}
          className="w-full flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-white bg-emerald-600 py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
        >
          <ShoppingCart size={16} /> Vendre
        </button>
      </div>
    </div>
  );
};

export default ConsommableCard;