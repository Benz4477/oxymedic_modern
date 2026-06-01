// client/src/pages/Consommables/components/VenteRapideModal.jsx
import React, { useState } from "react";
import { X } from "lucide-react";
import consommableService from "../../../services/consommableService";
import { toast } from "react-toastify";

const VenteRapideModal = ({ isOpen, onClose, consommable, clients, commandes, onSave }) => {
  const [formData, setFormData] = useState({
    clientId: "",
    commandeId: "",
    quantite: 1,
    prixUnitaire: consommable?.prixVente || 0,
    date: new Date().toLocaleDateString("fr-CA"),
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (consommable) {
      setFormData(prev => ({ ...prev, prixUnitaire: consommable.prixVente }));
    }
  }, [consommable]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientId || formData.quantite <= 0) {
      toast.error("Client et quantité requis");
      return;
    }
    if (consommable && formData.quantite > consommable.stock) {
      toast.error(`Stock insuffisant (disponible: ${consommable.stock})`);
      return;
    }
    setIsSubmitting(true);
    try {
      await consommableService.vendre(consommable._id, formData);
      toast.success("Vente enregistrée");
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-5 py-3 flex justify-between items-center">
          <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
            Vente rapide - {consommable?.nom}
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">
            <X size={14} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Client *</label>
              <select value={formData.clientId} onChange={(e) => setFormData({ ...formData, clientId: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" required>
                <option value="">Sélectionner un client</option>
                {clients.map(c => <option key={c._id} value={c._id}>{c.prenom} {c.nom} - {c.tel}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Commande liée (optionnel)</label>
              <select value={formData.commandeId} onChange={(e) => setFormData({ ...formData, commandeId: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg">
                <option value="">Aucune</option>
                {commandes.map(cmd => <option key={cmd._id} value={cmd._id}>{cmd.ref} - {cmd.client?.prenom} {cmd.client?.nom}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Quantité *</label>
                <input type="number" min="1" value={formData.quantite} onChange={(e) => setFormData({ ...formData, quantite: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" required />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Prix unitaire (MAD)</label>
                <input type="number" step="1" min="0" value={formData.prixUnitaire} onChange={(e) => setFormData({ ...formData, prixUnitaire: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Date</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Note</label>
              <textarea rows={2} value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg" placeholder="Optionnel" />
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-center">
              <div className="text-sm text-slate-500">Total TTC</div>
              <div className="text-2xl font-bold text-emerald-600">
                {(formData.quantite * formData.prixUnitaire).toLocaleString()} MAD
              </div>
            </div>
          </div>
          <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Annuler</button>
            <button type="submit" disabled={isSubmitting} className="px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
              {isSubmitting ? "Enregistrement..." : "Vendre"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VenteRapideModal;