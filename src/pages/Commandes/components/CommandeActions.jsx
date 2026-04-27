// src/pages/Commandes/components/CommandeActions.jsx
import React from "react";
import { RotateCcw, FileText, Edit, Receipt, Trash2, MoreVertical } from "lucide-react";

const CommandeActions = ({ commande, onReconduire, onDevis, onEdit, onReceipt, onStatusChange, onDelete }) => {
  const [showStatusMenu, setShowStatusMenu] = React.useState(false);

  const handleStatusChange = (newStatus) => {
    onStatusChange(commande, newStatus);
    setShowStatusMenu(false);
  };

  return (
    <div className="flex items-center justify-center gap-1.5 relative">
      <button onClick={() => onReconduire(commande)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition" title="Reconduire">
        <RotateCcw size={14} />
      </button>
      <button onClick={() => onDevis(commande)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition" title="Devis">
        <FileText size={14} />
      </button>
      <button onClick={() => onEdit(commande)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition" title="Modifier">
        <Edit size={14} />
      </button>
      <button onClick={() => onReceipt(commande)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition" title="Reçu">
        <Receipt size={14} />
      </button>
      <div className="relative">
        <button 
          onClick={() => setShowStatusMenu(!showStatusMenu)} 
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition" 
          title="Changer statut"
        >
          <MoreVertical size={14} />
        </button>
        {showStatusMenu && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[140px]">
            <div className="p-1">
              <button onClick={() => handleStatusChange("pending")} className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-100 rounded transition">En attente</button>
              <button onClick={() => handleStatusChange("active")} className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-100 rounded transition">Active</button>
              <button onClick={() => handleStatusChange("transit")} className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-100 rounded transition">Livraison</button>
              <button onClick={() => handleStatusChange("ended")} className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-100 rounded transition">Terminée</button>
            </div>
          </div>
        )}
      </div>
      <button onClick={() => onDelete(commande.id)} className="p-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 transition" title="Supprimer">
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default CommandeActions;