import React from "react";
import { User, Phone, Banknote, Edit, Trash2, PlusCircle, CreditCard, Truck, MapPin } from "lucide-react";

const LivreurCard = ({ livreur, frais, onEdit, onDelete, onAddFrais }) => {
  const totalFrais = frais.reduce((sum, f) => sum + (f.montant || 0), 0);

  return (
    <div className="group bg-white rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 overflow-hidden flex flex-col">
      <div className="p-5 flex gap-4">
        {/* Avatar/Icon */}
        <div className="shrink-0">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
            <User className="text-emerald-600" size={24} />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-black text-slate-900 truncate leading-tight mb-1">
            {livreur.nom}
          </h3>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Phone size={12} className="text-slate-300" />
              <span className="text-[11px] font-bold">{livreur.tel || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <div className="w-4 h-4 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Truck size={10} className="text-slate-400" />
              </div>
              <span className="text-[10px] font-bold text-slate-500">{livreur.vehicule || "Véhicule non spécifié"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <div className="w-4 h-4 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center">
                <MapPin size={10} className="text-slate-400" />
              </div>
              <span className="text-[10px] font-bold text-slate-500">{livreur.zone || "Zone non définie"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 mt-1">
              <Banknote size={12} className="text-emerald-400" />
              <span className="text-[11px] font-black">
                {totalFrais.toLocaleString()} <span className="text-[8px] opacity-60 uppercase tracking-tighter">MAD Frais</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto px-4 py-3 bg-slate-50/50 flex items-center justify-between border-t border-slate-50">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onEdit()}
            className="p-2 rounded-xl bg-white text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors shadow-sm"
            title="Modifier"
          >
            <Edit size={14} />
          </button>
          <button 
            onClick={() => onAddFrais()}
            className="p-2 rounded-xl bg-white text-emerald-600 hover:bg-emerald-100 transition-colors shadow-sm border border-emerald-100"
            title="Ajouter Frais"
          >
            <PlusCircle size={14} />
          </button>
        </div>
        
        <button 
          onClick={() => onDelete(livreur._id)}
          className="p-2 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-100 transition-colors"
          title="Supprimer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default LivreurCard;