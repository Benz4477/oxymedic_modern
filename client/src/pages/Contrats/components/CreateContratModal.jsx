import React, { useState } from "react";
import { X, FileText } from "lucide-react";

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
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={handleClose}>
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md flex justify-between items-center px-8 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <FileText size={18} className="text-emerald-600" />
            </div>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Nouveau contrat</h2>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 hover:rotate-90 transition-all">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Commande */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Commande *
            </label>
            <select
              value={commandeId}
              onChange={(e) => setCommandeId(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all cursor-pointer"
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

          {/* Type */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
              Type de contrat *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {contractTypes.map((ct) => (
                <label
                  key={ct.value}
                  className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                    type === ct.value
                      ? "border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={ct.value}
                    checked={type === ct.value}
                    onChange={(e) => setType(e.target.value)}
                    className="w-4 h-4 accent-emerald-600"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-bold text-slate-900">{ct.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{ct.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Conditions spéciales */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Conditions spéciales <span className="normal-case font-medium text-slate-400">(optionnel)</span>
            </label>
            <textarea
              value={conditionsSpeciales}
              onChange={(e) => setConditionsSpeciales(e.target.value)}
              placeholder="Conditions particulières du contrat..."
              rows={4}
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95"
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
