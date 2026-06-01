import React from "react";
import { Trash2, User, Package, Calendar, Tag, CreditCard } from "lucide-react";
import venteConsommableService from "../../../services/venteConsommableService";
import { toast } from "react-toastify";

const VentesTable = ({ ventes, onRefresh }) => {
  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette vente ?")) return;
    try {
      await venteConsommableService.delete(id);
      toast.success("Vente supprimée");
      onRefresh();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (ventes.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          📉
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Historique vide</h3>
        <p className="text-slate-400 text-xs font-medium">Aucune vente enregistrée pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  <Calendar size={10} /> Date
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  <User size={10} /> Client
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  <Package size={10} /> Produit
                </div>
              </th>
              <th className="px-4 py-3 text-center text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Qté
              </th>
              <th className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  <CreditCard size={10} /> Total
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  <Tag size={10} /> Commande
                </div>
              </th>
              <th className="px-4 py-3 text-center text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {ventes.map((v) => (
              <tr key={v._id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="text-xs font-semibold text-slate-600">{v.date}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-[10px]">
                      {v.client?.prenom?.[0]}{v.client?.nom?.[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-none">{v.client?.prenom} {v.client?.nom}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{v.client?.tel}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="text-xl">{v.consommable?.icon || "📦"}</div>
                    <div className="text-xs font-bold text-slate-900">{v.consommable?.name}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-0.5 bg-slate-100 rounded-full text-[10px] font-bold text-slate-700">
                    {v.qte}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="text-xs font-bold text-emerald-600">
                    {v.total.toLocaleString()} <span className="text-[9px] opacity-60">MAD</span>
                  </div>
                  <div className="text-[9px] text-slate-400 italic">
                    {v.prixUnit.toLocaleString()} / unit
                  </div>
                </td>
                <td className="px-4 py-3">
                  {v.commandeRef ? (
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                      #{v.commandeRef}
                    </span>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDelete(v._id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    title="Supprimer"
                  >
                    <Trash2 size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VentesTable;