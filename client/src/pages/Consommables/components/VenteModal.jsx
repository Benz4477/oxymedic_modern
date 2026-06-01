// src/pages/Consommables/components/VenteModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import venteConsommableService from "../../../services/venteConsommableService";
import clientService from "../../../services/clientService";
import commandeService from "../../../services/commandeService";
import consommableService from "../../../services/consommableService";
import equipementService from "../../../services/equipementService";

const VenteModal = ({ isOpen, onClose, consommable, onSave }) => {
  const [formData, setFormData] = useState({
    clientId: "",
    consommableId: consommable?._id || "",
    qte: 1,
    prixUnit: consommable?.prixVente || 0,
    commandeRef: "",
    note: "",
    date: new Date().toLocaleDateString("fr-CA"),
  });
  const [clients, setClients] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [consommables, setConsommables] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedConso, setSelectedConso] = useState(consommable || null);

  // Chargement des données
  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, commandesData, consosData] = await Promise.all([
          clientService.getAll(),
          commandeService.getAll(),
          consommableService.getAll(),
        ]);
        setClients(clientsData);
        setCommandes(commandesData);
        setConsommables(consosData);
        console.log("Consommables chargés :", consosData); // Vérification
      } catch (error) {
        console.error("Erreur chargement :", error);
        toast.error("Erreur de chargement des données");
      }
    };
    if (isOpen) loadData();
  }, [isOpen]);

  // Réinitialisation quand un consommable est passé
  useEffect(() => {
    if (consommable) {
      setSelectedConso(consommable);
      setFormData(prev => ({
        ...prev,
        consommableId: consommable._id,
        prixUnit: consommable.prixVente,
      }));
    } else {
      setSelectedConso(null);
      setFormData(prev => ({ ...prev, consommableId: "", prixUnit: 0 }));
    }
  }, [consommable]);

  const handleConsoChange = (consoId) => {
    const conso = consommables.find(c => c._id === consoId);
    setSelectedConso(conso);
    setFormData(prev => ({
      ...prev,
      consommableId: consoId,
      prixUnit: conso?.prixVente || 0,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientId || !formData.consommableId || formData.qte <= 0) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setIsSubmitting(true);
    try {
      await venteConsommableService.create(formData);
      toast.success("Vente enregistrée");
      onSave();
      onClose();
    } catch (error) {
      if (error.response?.data?.message?.includes("Stock insuffisant")) {
        toast.error(`Stock insuffisant. Stock disponible: ${error.response.data.stock}`);
      } else {
        toast.error("Erreur lors de l'enregistrement");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-5 py-3 flex justify-between items-center">
          <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
            Vente rapide {selectedConso ? `: ${selectedConso.name}` : ""}
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4">
            {/* Client */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Client *</label>
              <select
                required
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2"
              >
                <option value="">Sélectionner un client</option>
                {clients.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.prenom} {c.nom} — {c.tel}
                  </option>
                ))}
              </select>
            </div>

            {/* Produit */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Produit *</label>
              {selectedConso ? (
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-2xl">{selectedConso.icon}</span>
                  <div>
                    <div className="font-semibold">{selectedConso.name}</div>
                    <div className="text-xs text-slate-500">
                      {selectedConso.prixVente} MAD / {selectedConso.unite} — Stock: {selectedConso.stock}
                    </div>
                  </div>
                </div>
              ) : (
                <select
                  required
                  value={formData.consommableId}
                  onChange={(e) => handleConsoChange(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2"
                >
                  <option value="">-- Sélectionner un produit --</option>
                  {consommables.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.icon} {c.name} — Stock: {c.stock} {c.unite}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Quantité + Prix */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Quantité *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.qte}
                  onChange={(e) => setFormData({ ...formData, qte: parseInt(e.target.value) || 1 })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Prix unitaire (MAD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.prixUnit}
                  onChange={(e) => setFormData({ ...formData, prixUnit: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            {/* Commande liée – affiche la référence + l'équipement */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Commande liée (optionnel)</label>
              <select
                value={formData.commandeRef}
                onChange={(e) => setFormData({ ...formData, commandeRef: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2"
              >
                <option value="">Aucune</option>
                {commandes.map(cmd => (
                  <option key={cmd._id} value={cmd.reference}>
                    {cmd.reference}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Note</label>
              <textarea
                rows={2}
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2"
                placeholder="Motif, remise, etc."
              />
            </div>
          </div>

          <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">
              Annuler
            </button>
            <button type="submit" disabled={isSubmitting} className="px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
              {isSubmitting ? "Enregistrement..." : "Enregistrer la vente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VenteModal;