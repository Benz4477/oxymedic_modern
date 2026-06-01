// client/src/pages/Consommables/components/ConsommableModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import consommableService from "../../../services/consommableService";
import { toast } from "react-toastify";

const ConsommableModal = ({ isOpen, onClose, consommable, onSave }) => {
  const [formData, setFormData] = useState({
    nom: "",
    reference: "",
    categorie: "Divers",
    prixVente: 0,
    stock: 0,
    seuilAlerte: 5,
    unite: "pièce",
    codeBarres: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (consommable) {
      setFormData({
        nom: consommable.nom || "",
        reference: consommable.reference || "",
        categorie: consommable.categorie || "Divers",
        prixVente: consommable.prixVente || 0,
        stock: consommable.stock || 0,
        seuilAlerte: consommable.seuilAlerte || 5,
        unite: consommable.unite || "pièce",
        codeBarres: consommable.codeBarres || "",
        description: consommable.description || "",
      });
    } else {
      setFormData({
        nom: "",
        reference: "",
        categorie: "Divers",
        prixVente: 0,
        stock: 0,
        seuilAlerte: 5,
        unite: "pièce",
        codeBarres: "",
        description: "",
      });
    }
  }, [consommable]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nom || formData.prixVente <= 0) {
      toast.error("Nom et prix de vente requis");
      return;
    }
    setIsSubmitting(true);
    try {
      if (consommable) {
        await consommableService.update(consommable._id, formData);
        toast.success("Consommable mis à jour");
      } else {
        await consommableService.create(formData);
        toast.success("Consommable créé");
      }
      onSave();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-5 py-3 flex justify-between items-center">
          <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
            {consommable ? "Modifier" : "Nouveau"} consommable
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">
            <X size={14} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Nom *</label>
              <input type="text" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Référence</label>
              <input type="text" value={formData.reference} onChange={(e) => setFormData({ ...formData, reference: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="Auto-générée si vide" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Catégorie</label>
                <input type="text" value={formData.categorie} onChange={(e) => setFormData({ ...formData, categorie: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Unité</label>
                <select value={formData.unite} onChange={(e) => setFormData({ ...formData, unite: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                  <option value="pièce">pièce</option><option value="boîte">boîte</option><option value="paquet">paquet</option>
                  <option value="flacon">flacon</option><option value="rouleau">rouleau</option><option value="kit">kit</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Prix vente (MAD) *</label>
                <input type="number" step="1" min="0" value={formData.prixVente} onChange={(e) => setFormData({ ...formData, prixVente: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Stock initial</label>
                <input type="number" min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Seuil d'alerte</label>
                <input type="number" min="0" value={formData.seuilAlerte} onChange={(e) => setFormData({ ...formData, seuilAlerte: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Code-barres</label>
                <input type="text" value={formData.codeBarres} onChange={(e) => setFormData({ ...formData, codeBarres: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Description</label>
              <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
            </div>
          </div>
          <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Annuler</button>
            <button type="submit" disabled={isSubmitting} className="px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
              {isSubmitting ? "Enregistrement..." : (consommable ? "Mettre à jour" : "Créer")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsommableModal;