// client/src/pages/Livraisons/components/LivraisonModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import livraisonService from "../../../services/livraisonService";
import commandeService from "../../../services/commandeService";
import { toast } from "react-toastify";

const LivraisonModal = ({ isOpen, onClose, livraison, livreurs, onSave }) => {
  const [formData, setFormData] = useState({
    commandeId: "",
    clientId: "",
    equipementId: "",
    livreurId: "",
    type: "livraison",
    date: "Aujourd'hui",
    heure: "09:00",
    note: "",
  });
  const [commandes, setCommandes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (livraison) {
      setFormData({
        commandeId: livraison.commande?._id || "",
        clientId: livraison.client?._id || "",
        equipementId: livraison.equipement?._id || "",
        livreurId: livraison.livreur?._id || "",
        type: livraison.type,
        date: livraison.date,
        heure: livraison.heure,
        note: livraison.note || "",
      });
    } else {
      setFormData({
        commandeId: "",
        clientId: "",
        equipementId: "",
        livreurId: "",
        type: "livraison",
        date: "Aujourd'hui",
        heure: "09:00",
        note: "",
      });
    }
  }, [livraison]);

  useEffect(() => {
    const loadCommandes = async () => {
      try {
        const all = await commandeService.getAll();
        // Filtrer les commandes non terminées et non déjà livrées (optionnel)
        const disponibles = all.filter(c => c.status !== "ended" && c.status !== "active");
        setCommandes(disponibles);
      } catch (error) {
        console.error(error);
      }
    };
    if (isOpen) loadCommandes();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.commandeId) {
      toast.error("Veuillez sélectionner une commande");
      return;
    }
    setIsSubmitting(true);
    try {
      if (livraison) {
        await livraisonService.update(livraison._id, formData);
        toast.success("Livraison mise à jour");
      } else {
        await livraisonService.create(formData);
        toast.success("Livraison créée");
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
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>

        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-5 py-3 flex justify-between items-center">
          <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
            {livraison ? "Modifier la livraison" : "Nouvelle livraison"}
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4">
            {/* Commande */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Commande *</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.commandeId}
                onChange={(e) => setFormData({ ...formData, commandeId: e.target.value })}
                required
              >
                <option value="">Sélectionner une commande</option>
                {commandes.map((cmd) => (
                  <option key={cmd._id} value={cmd._id}>
                    {cmd.ref} - {cmd.client?.prenom} {cmd.client?.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Livreur */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Livreur</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.livreurId}
                onChange={(e) => setFormData({ ...formData, livreurId: e.target.value })}
              >
                <option value="">Non assigné</option>
                {livreurs.map((l) => (
                  <option key={l._id} value={l._id}>{l.nom}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Type</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="livraison">Livraison</option>
                <option value="reprise">Reprise</option>
              </select>
            </div>

            {/* Date et heure */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Date</label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                >
                  <option value="Aujourd'hui">Aujourd'hui</option>
                  <option value="Demain">Demain</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Heure</label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={formData.heure}
                  onChange={(e) => setFormData({ ...formData, heure: e.target.value })}
                >
                  <option>08:00</option><option>09:00</option><option>10:00</option>
                  <option>11:00</option><option>14:00</option><option>15:00</option>
                  <option>16:00</option><option>17:00</option>
                </select>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Note (instructions)</label>
              <textarea
                rows={2}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="Instructions pour le livreur..."
              />
            </div>
          </div>

          <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "Enregistrement..." : (livraison ? "Mettre à jour" : "Créer")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LivraisonModal;