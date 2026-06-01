import React from "react";
import { MapPin, Store, Edit, Trash2, Phone, Mail, Map, Factory } from "lucide-react";

const MagasinCard = ({ magasin, onEdit, onDelete }) => {
  const isDepot = magasin.type === 'depot';

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 group relative overflow-hidden">
      {magasin.isDefault && (
        <div className={`absolute top-0 right-0 px-4 py-1.5 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-2xl ${isDepot ? 'bg-amber-600' : 'bg-emerald-600'}`}>
          {isDepot ? 'Dépôt Central' : 'Siège Social'}
        </div>
      )}
      
      <div className="flex items-start justify-between mb-6">
        <div className={`p-4 rounded-2xl transition-colors ${isDepot ? 'bg-amber-50 group-hover:bg-amber-100' : 'bg-slate-50 group-hover:bg-emerald-50'}`}>
          {isDepot ? (
            <Factory size={28} className="text-amber-600" />
          ) : (
            <Store size={28} className="text-slate-400 group-hover:text-emerald-600" />
          )}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(magasin)} 
            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={() => onDelete(magasin._id)} 
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 leading-tight">{magasin.nom}</h3>
          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs mt-1">
            <MapPin size={12} />
            {magasin.ville}
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-slate-500">
            <Map size={14} className="shrink-0" />
            <span className="text-xs font-bold truncate">{magasin.adresse || "Aucune adresse"}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <Phone size={14} className="shrink-0" />
            <span className="text-xs font-bold">{magasin.tel || "N/A"}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <Mail size={14} className="shrink-0" />
            <span className="text-xs font-bold truncate">{magasin.email || "N/A"}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${magasin.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {magasin.status === 'active' ? 'En activité' : 'Inactif'}
          </div>
          {magasin.ice && (
            <div className="text-[10px] font-mono text-slate-400">ICE: {magasin.ice}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MagasinCard;
