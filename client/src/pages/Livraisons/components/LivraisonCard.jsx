import React from "react";
import { Clock, User, Package, MapPin, CheckCircle, Trash2, Edit, Printer, ExternalLink, Phone } from "lucide-react";

const LivraisonCard = ({ livraison, livreurs, onConfirm, onDelete, onPrint, onEdit }) => {
  const getLivreurName = (id) => {
    const livreur = livreurs.find((l) => l._id === id);
    return livreur ? `${livreur.prenom} ${livreur.nom}` : "Non assigné";
  };

  const statusColors = {
    pending: "text-amber-500",
    transit: "text-blue-600",
    done: "text-emerald-600",
  };

  return (
    <div className="p-4 hover:bg-slate-50 transition-colors group relative">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-1.5 h-1.5 rounded-full bg-current ${statusColors[livraison.status] || "text-slate-300"}`} />
            <h4 className="text-[13px] font-black text-slate-800 truncate leading-tight">
              {livraison.client?.prenom} {livraison.client?.nom}
            </h4>
          </div>
          <div className="flex flex-col gap-1.5 mb-2">
            <div className="flex items-center gap-1.5 text-slate-500">
              <MapPin size={10} className="text-slate-300 shrink-0" />
              <span className="text-[10px] font-bold truncate">
                {livraison.client?.adresse || "Adresse non spécifiée"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Phone size={10} className="text-emerald-500 shrink-0" />
              <span className="text-[10px] font-black text-slate-700">
                {livraison.client?.tel || "N/A"}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 text-[11px] font-black text-slate-900 justify-end">
            <Clock size={12} className="text-slate-300" />
            {livraison.heure || "ASAP"}
          </div>
          <div className="text-[9px] font-bold text-slate-400 mt-0.5">
            {getLivreurName(livraison.livreur)}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 bg-slate-50/80 px-2 py-1.5 rounded-lg border border-slate-100">
        <Package size={12} className="text-emerald-500" />
        <span className="text-[10px] font-black text-slate-700 truncate">
          {livraison.equipement?.name || "Équipement"}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onEdit()}
            className="p-1.5 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-100 transition-all"
            title="Modifier"
          >
            <Edit size={13} />
          </button>
          <button 
            onClick={() => onPrint(livraison._id)}
            className="p-1.5 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-100 transition-all"
            title="Imprimer"
          >
            <Printer size={13} />
          </button>
          {livraison.client?.lat && (
            <a 
              href={`https://waze.com/ul?ll=${livraison.client.lat},${livraison.client.lng}&navigate=yes`}
              target="_blank" rel="noreferrer"
              className="p-1.5 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-blue-500 hover:border-blue-100 transition-all"
              title="Waze"
            >
              <ExternalLink size={13} />
            </a>
          )}
        </div>

        <div className="flex items-center gap-1">
          {livraison.status !== "done" && (
            <button 
              onClick={() => onConfirm(livraison._id)}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-emerald-700 transition shadow-sm"
            >
              Valider
            </button>
          )}
          <button 
            onClick={() => onDelete(livraison._id)}
            className="p-1.5 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-100 transition-all"
            title="Annuler"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LivraisonCard;