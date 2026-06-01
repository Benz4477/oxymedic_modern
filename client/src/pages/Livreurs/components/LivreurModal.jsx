// client/src/pages/Livreurs/components/LivreurModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import livreurService from "../../../services/livreurService";
import { toast } from "react-toastify";

const LivreurModal = ({ isOpen, onClose, livreur, onSave }) => {
  const [formData, setFormData] = useState({
    nom: "",
    tel: "",
    vehicule: "",
    zone: "",
    status: "active",
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (livreur) {
      setFormData({
        nom: livreur.nom || "",
        tel: livreur.tel || "",
        vehicule: livreur.vehicule || "",
        zone: livreur.zone || "",
        status: livreur.status || "active",
        note: livreur.note || "",
      });
    } else {
      setFormData({
        nom: "",
        tel: "",
        vehicule: "",
        zone: "",
        status: "active",
        note: "",
      });
    }
  }, [livreur]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nom || !formData.tel) {
      toast.error("Le nom et le téléphone sont requis");
      return;
    }
    setIsSubmitting(true);
    try {
      if (livreur) {
        await livreurService.update(livreur._id, formData);
        toast.success("Livreur mis à jour");
      } else {
        await livreurService.create(formData);
        toast.success("Livreur créé");
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
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

        {/* Header sticky */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex justify-between items-center rounded-t-[2rem]">
          <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
            {livreur ? "Modifier le livreur" : "Nouveau livreur"}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 hover:rotate-90 transition-all">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-5">
            {/* Nom */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Nom complet *</label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Téléphone *</label>
              <input
                type="tel"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.tel}
                onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                required
              />
            </div>

            {/* Véhicule */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Véhicule</label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                placeholder="ex: Dacia Logan · WB-4521-A"
                value={formData.vehicule}
                onChange={(e) => setFormData({ ...formData, vehicule: e.target.value })}
              />
            </div>

            {/* Zone */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Zone de livraison</label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                placeholder="ex: Maarif · Anfa"
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
              />
            </div>

            {/* Statut */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Statut</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>

            {/* Note */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Note interne</label>
              <textarea
                rows={2}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Observations..."
              />
            </div>
          </div>

          {/* Footer sticky */}
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
              {isSubmitting ? "Enregistrement..." : (livreur ? "Mettre à jour" : "Créer")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LivreurModal;