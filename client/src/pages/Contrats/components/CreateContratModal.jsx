import React, { useState } from "react";
import { X } from "lucide-react";

const CreateContratModal = ({ isOpen, onClose, commandes, onSave }) => {
  const [commandeId, setCommandeId] = useState("");
  const [type, setType] = useState("location");
  const [conditionsSpeciales, setConditionsSpeciales] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!commandeId) {
      alert("Veuillez sélectionner une commande");
      return;
    }
    onSave({ commandeId, type, conditionsSpeciales });
  };

  const handleClose = () => {
    setCommandeId("");
    setType("location");
    setConditionsSpeciales("");
    onClose();
  };

  const contractTypes = [
    { value: "location", label: "📋 Location", description: "Contrat de location" },
    { value: "renouvellement", label: "🔄 Renouvellement", description: "Renouvellement de contrat" },
    { value: "essai", label: "🔬 Essai", description: "Période d'essai" },
    { value: "vente", label: "🏷️ Vente", description: "Contrat de vente" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Nouveau contrat</h2>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Commande *
            </label>
            <select
              value={commandeId}
              onChange={(e) => setCommandeId(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            >
              <option value="">Sélectionner une commande</option>
              {commandes.map((cmd) => (
                <option key={cmd._id} value={cmd._id}>
                  {cmd.reference} - {cmd.client?.prenom} {cmd.client?.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Type de contrat *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {contractTypes.map((ct) => (
                <label
                  key={ct.value}
                  className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    type === ct.value
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={ct.value}
                    checked={type === ct.value}
                    onChange={(e) => setType(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div className="ml-3">
                    <div className="font-semibold text-slate-900">{ct.label}</div>
                    <div className="text-xs text-slate-500">{ct.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Conditions spéciales (optionnel)
            </label>
            <textarea
              value={conditionsSpeciales}
              onChange={(e) => setConditionsSpeciales(e.target.value)}
              placeholder="Conditions particulières du contrat..."
              rows={4}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              Créer le contrat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContratModal;
