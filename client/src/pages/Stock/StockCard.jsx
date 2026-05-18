import React from "react";
import { Edit, Trash2, Archive, Printer, Camera, Box, AlertCircle } from "lucide-react";

const StockCard = ({ equip, onEdit, onToggleArchive, onDelete, onPrint, onPhotoUpload }) => {
  const isStockBas = equip.stock <= (equip.seuilAlerte || 2);
  const isEpuise = equip.stock === 0;

  return (
    <div className="group card-linear overflow-hidden flex flex-col">
      {/* Upper Section: Photo & Quick Info */}
      <div className="p-4 flex gap-4">
        {/* Photo Container */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 bg-slate-50 rounded-xl overflow-hidden border border-slate-100/60 flex items-center justify-center group/photo">
            {equip.photo ? (
              <img src={equip.photo} alt={equip.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/photo:scale-110" />
            ) : (
              <Box className="text-slate-200" size={24} />
            )}
            <button 
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (re) => onPhotoUpload(equip.id, re.target.result);
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}
              className="absolute inset-0 bg-amber-600/60 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center"
            >
              <Camera size={16} className="text-white" />
            </button>
          </div>
          {isEpuise && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center">
              <AlertCircle size={8} className="text-white" />
            </div>
          )}
        </div>

        {/* Info Container */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className="text-[9px] font-bold text-amber-700 bg-amber-50/70 border border-amber-100/50 px-2 py-0.5 rounded-md uppercase tracking-wider">
              {equip.cat?.name || equip.category?.name || (typeof equip.cat === 'string' ? equip.cat : "Matériel")}
            </span>
            <span className="font-mono text-[9px] font-black text-slate-300">
              #{equip.ref || "REF-NA"}
            </span>
          </div>
          <h3 className="text-[14px] font-bold text-slate-950 font-display truncate leading-tight mb-1.5 group-hover:text-amber-600 transition-colors">
            {equip.name}
          </h3>
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Stock (Dispo/Tot)</span>
              <span className={`text-xs font-black ${isEpuise ? "text-rose-500" : isStockBas ? "text-amber-500" : "text-slate-700"}`}>
                {equip.dispo || 0} <span className="text-slate-300">/ {equip.total || 0}</span>
              </span>
            </div>
            <div className="flex flex-col border-l border-slate-100 pl-3">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Prix / Caution</span>
              <div className="flex flex-col">
                <span className="text-xs font-black text-slate-900">
                  {equip.pDay || equip.prixJour || 0} <span className="text-[8px] opacity-40">MAD/j</span>
                </span>
                <span className="text-[9px] font-bold text-amber-600">
                  {equip.caution || 0} <span className="text-[7px] opacity-60">MAD</span>
                </span>
              </div>
            </div>
            {equip.emplacement && (
              <div className="flex flex-col border-l border-slate-100 pl-3">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Lieu</span>
                <span className="text-[10px] font-bold text-slate-500 truncate max-w-[80px]">
                  {equip.emplacement}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Actions */}
      <div className="mt-auto px-4 py-2.5 bg-slate-50/50 flex items-center justify-between border-t border-slate-100/60">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onEdit(equip)}
            className="p-2 rounded-lg bg-white text-slate-400 hover:bg-amber-50 hover:text-amber-600 border border-slate-100/50 transition-colors shadow-sm"
            title="Modifier"
          >
            <Edit size={13} />
          </button>
          <button 
            onClick={() => onPrint(equip)}
            className="p-2 rounded-lg bg-white text-slate-400 hover:bg-amber-50 hover:text-amber-600 border border-slate-100/50 transition-colors shadow-sm"
            title="Étiquette"
          >
            <Printer size={13} />
          </button>
          <button 
            onClick={() => onToggleArchive(equip.id)}
            className={`p-2 rounded-lg bg-white transition-colors border border-slate-100/50 shadow-sm ${equip.archived ? "text-amber-600 hover:bg-amber-50 border-amber-100/40" : "text-slate-400 hover:bg-slate-50"}`}
            title={equip.archived ? "Désarchiver" : "Archiver"}
          >
            <Archive size={13} />
          </button>
        </div>
        
        <button 
          onClick={() => onDelete(equip.id)}
          className="p-2 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-colors border border-rose-100/40"
          title="Supprimer"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};

export default StockCard;
