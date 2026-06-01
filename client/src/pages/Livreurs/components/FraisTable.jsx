import React from "react";
import { toast } from "react-toastify";
import fraisService from "../../../services/fraisService";
import { Trash2, User, Calendar, Banknote, Tag, Hash } from "lucide-react";

const FraisTable = ({ frais, onRefresh }) => {
  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce frais ?")) return;
    try {
      await fraisService.delete(id);
      toast.success("Frais supprimé");
      onRefresh();
    } catch (error) {
      toast.error("Erreur suppression");
    }
  };

  if (frais.length === 0) {
    return (
      <div className="p-16 text-center">
        <Banknote size={40} className="text-slate-100 mx-auto mb-4" />
        <p className="text-slate-400 font-bold text-xs">Aucun frais enregistré récemment</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-6 py-4 text-left">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <Calendar size={12} /> Date
              </div>
            </th>
            <th className="px-6 py-4 text-left">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <User size={12} /> Livreur
              </div>
            </th>
            <th className="px-6 py-4 text-left">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <Tag size={12} /> Type
              </div>
            </th>
            <th className="px-6 py-4 text-left">
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Détails
              </div>
            </th>
            <th className="px-6 py-4 text-right">
              <div className="flex items-center justify-end gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <Banknote size={12} /> Montant
              </div>
            </th>
            <th className="px-6 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {frais.map((f) => (
            <tr key={f._id} className="group hover:bg-slate-50/80 transition-colors">
              <td className="px-6 py-4">
                <div className="text-[11px] font-bold text-slate-500">
                  {new Date(f.date).toLocaleDateString("fr-FR")}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-[13px] font-black text-slate-800">
                  {f.livreur?.nom}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {f.type === "gasoil" ? "⛽" : f.type === "autoroute" ? "🛣️" : f.type === "parking" ? "🅿️" : "📋"}
                  </span>
                  <span className="text-[10px] font-black uppercase text-slate-600 tracking-tight">
                    {f.type}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-[11px] font-medium text-slate-500 max-w-[200px] truncate">
                  {f.desc || f.description || "—"}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="text-[14px] font-black text-rose-500 tracking-tight">
                  {f.montant?.toLocaleString()} <span className="text-[10px] opacity-60">MAD</span>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <button 
                  onClick={() => handleDelete(f._id)}
                  className="p-1.5 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 transition-all"
                  title="Supprimer"
                >
                  <Trash2 size={13} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FraisTable;