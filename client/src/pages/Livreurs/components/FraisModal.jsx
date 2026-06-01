// client/src/pages/Livreurs/components/FraisModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import fraisService from "../../../services/fraisService";
import { toast } from "react-toastify";

const FraisModal = ({ isOpen, onClose, livreur, onSave }) => {
  const [formData, setFormData] = useState({
    livreurId: "",
    type: "gasoil",
    montant: "",
    date: new Date().toLocaleDateString("fr-CA"),
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (livreur) {
      setFormData((prev) => ({ ...prev, livreurId: livreur._id }));
    }
  }, [livreur]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.montant || formData.montant <= 0) {
      toast.error("Montant invalide");
      return;
    }
    setIsSubmitting(true);
    try {
      await fraisService.create(formData);
      toast.success("Frais ajouté");
      onSave();
      onClose();
    } catch (error) {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
      onClick={onClose}>
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}>

        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex justify-between items-center rounded-t-[2rem]">
          <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
            Ajouter des frais
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 hover:rotate-90 transition-all">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-5">
            {/* Livreur (lecture seule) */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Livreur</label>
              <input
                type="text"
                value={livreur?.nom || ""}
                disabled
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50"
              />
            </div>

            {/* Type de frais */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Type de frais</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="gasoil">⛽ Gasoil</option>
                <option value="autoroute">🛣️ Péage autoroute</option>
                <option value="parking">🅿️ Parking</option>
                <option value="autre">📋 Autre</option>
              </select>
            </div>

            {/* Montant */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Montant (MAD) *</label>
              <input
                type="number"
                step="1"
                min="0"
                required
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.montant}
                onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Date</label>
              <input
                type="date"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Description (optionnel)</label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                placeholder="ex: Plein station Shell, Péage A3..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-8 py-5 flex justify-end gap-3 rounded-b-[2rem]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              {isSubmitting ? "Enregistrement..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FraisModal;