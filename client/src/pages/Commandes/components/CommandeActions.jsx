import React from "react";
import { RotateCcw, Edit, Receipt, Trash2, MoreVertical } from "lucide-react";

const CommandeActions = ({ commande, onReconduire, onEdit, onReceipt, onStatusChange, onDelete }) => {
  const [showStatusMenu, setShowStatusMenu] = React.useState(false);

  const handleStatusChange = (newStatus) => {
    onStatusChange(commande, newStatus);
    setShowStatusMenu(false);
  };

  return (
    <div className="flex items-center justify-center gap-1.5 relative">
      <button onClick={() => onReconduire(commande)}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition" title="Reconduire">
        <RotateCcw size={14} />
      </button>
      <button onClick={() => onEdit(commande)}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition" title="Modifier">
        <Edit size={14} />
      </button>
      <button onClick={() => onReceipt(commande)}
        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition" title="Reçu">
        <Receipt size={14} />
      </button>

      {/* Menu statut */}
      <div className="relative">
        <button onClick={() => setShowStatusMenu(!showStatusMenu)}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition" title="Changer statut">
          <MoreVertical size={14} />
        </button>
        {showStatusMenu && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[140px]">
            <div className="p-1">
              {[
                { value: "pending",   label: "En attente" },
                { value: "active",    label: "Active" },
                { value: "transit",   label: "Livraison" },
                { value: "ended",     label: "Terminée" },
                { value: "cancelled", label: "Annulée" },
              ].map((s) => (
                <button key={s.value} onClick={() => handleStatusChange(s.value)}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-100 rounded transition">
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Supprimer — utilise _id */}
      <button onClick={() => onDelete(commande._id)}
        className="p-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 transition" title="Supprimer">
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default CommandeActions;