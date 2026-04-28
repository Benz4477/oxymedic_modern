// src/pages/Devis/components/DevisModal.jsx
import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Calendar, User, Euro, FileText } from "lucide-react";

const DevisModal = ({ 
  isOpen, 
  onClose, 
  editMode = false, 
  devis = null, 
  onSave,
  clients = [],
  commandes = []
}) => {
  const [formData, setFormData] = useState({
    reference: "",
    clientId: "",
    clientName: "",
    date: new Date().toISOString().split('T')[0],
    validity: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: "",
    totalAmount: 0,
    notes: "",
    status: "draft"
  });

  const [lignes, setLignes] = useState([]);
  const [tvaRate, setTvaRate] = useState(20);
  const [remiseGlobale, setRemiseGlobale] = useState(0);

  useEffect(() => {
    if (editMode && devis) {
      setFormData({
        reference: devis.reference || "",
        clientId: devis.clientId || "",
        clientName: devis.clientName || "",
        date: devis.date || new Date().toISOString().split('T')[0],
        validity: devis.validity || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: devis.description || "",
        totalAmount: devis.totalAmount || 0,
        notes: devis.notes || "",
        status: devis.status || "draft"
      });
      setLignes(devis.lignes || []);
      setTvaRate(devis.tvaRate || 20);
      setRemiseGlobale(devis.remiseGlobale || 0);
    }
  }, [editMode, devis]);

  // Recalculer les totaux
  const recalculerTotaux = (lignesData, remise = remiseGlobale, tva = tvaRate) => {
    const ht = lignesData.reduce((sum, l) => sum + (l.totalHT || 0), 0);
    const htApresRemise = ht * (1 - remise / 100);
    const tvaAmount = htApresRemise * tva / 100;
    const ttc = htApresRemise + tvaAmount;
    setFormData(prev => ({ ...prev, totalAmount: ttc }));
  };

  // Ajouter une ligne
  const addLigne = () => {
    const newLigne = { 
      id: Date.now(), 
      description: "", 
      quantite: 1, 
      prixHT: 0, 
      totalHT: 0 
    };
    const newLignes = [...lignes, newLigne];
    setLignes(newLignes);
    recalculerTotaux(newLignes);
  };

  // Supprimer une ligne
  const removeLigne = (id) => {
    if (lignes.length === 1) {
      alert("Au moins une ligne requise");
      return;
    }
    const newLignes = lignes.filter(l => l.id !== id);
    setLignes(newLignes);
    recalculerTotaux(newLignes);
  };

  // Mettre à jour une ligne
  const updateLigne = (id, field, value) => {
    const newLignes = lignes.map(l => {
      if (l.id === id) {
        const updated = { ...l, [field]: value };
        if (field === "quantite" || field === "prixHT") {
          updated.totalHT = (updated.quantite || 1) * (updated.prixHT || 0);
        }
        return updated;
      }
      return l;
    });
    setLignes(newLignes);
    recalculerTotaux(newLignes);
  };

  // Auto-remplissage depuis une commande
  const handleCommandeChange = (commandeRef) => {
    const cmd = commandes.find(c => 
      (c.reference === commandeRef) || 
      (c.cmdRef === commandeRef) || 
      (c.ref === commandeRef)
    );
    if (!cmd) return;

    const description = `Devis Commande - ${cmd.reference || cmd.cmdRef || cmd.ref || ''}`;
    const prixHT = Math.round((cmd.amount || cmd.montantTTC || 0) / (1 + tvaRate / 100));
    const newLignes = [{
      id: Date.now(),
      description,
      quantite: 1,
      prixHT,
      totalHT: prixHT,
    }];
    setLignes(newLignes);
    recalculerTotaux(newLignes);
    setFormData(prev => ({ 
      ...prev, 
      clientId: cmd.clientId, 
      clientName: cmd.clientName,
      cmdRef: commandeRef // <--- updated here
    }));
  };

  const handleSave = () => {
    if (lignes.length === 0 || !lignes[0].description) {
      alert("Ajoutez au moins une ligne de devis");
      return;
    }
    if (!formData.clientId) {
      alert("Sélectionnez un client");
      return;
    }

    const dataToSend = {
      reference: formData.reference,
      clientId: formData.clientId,
      clientName: formData.clientName,
      date: formData.date,
      validity: formData.validity,
      description: formData.description,
      lignes: lignes.map(l => ({
        description: l.description,
        quantite: l.quantite,
        prixHT: l.prixHT,
        totalHT: l.totalHT,
        tvaRate: tvaRate,
        remPct: 0
      })),
      totalAmount: formData.totalAmount,
      notes: formData.notes,
      status: formData.status,
      tvaRate: tvaRate,
      remiseGlobale: remiseGlobale
    };

    onSave(dataToSend);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {editMode ? "Modifier le devis" : "Nouveau devis"}
              </h2>
              <p className="text-sm text-slate-500">
                {editMode ? "Modifiez les informations du devis" : "Créez un nouveau devis"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations générales */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Informations générales</h3>
              
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Client
                  <span className="text-xs text-red-500 font-normal ml-1">*</span>
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => {
                    const client = clients.find(c => c.id === parseInt(e.target.value));
                    setFormData(prev => ({ 
                      ...prev, 
                      clientId: e.target.value, 
                      clientName: client?.name || "" 
                    }));
                  }}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map(client => {
                    const displayName = client.prenom && client.nom 
                      ? `${client.prenom} ${client.nom}`
                      : client.name || client.nom || 'Client ' + client.id;
                    return (
                      <option key={client.id} value={client.id}>
                        {displayName}
                      </option>
                    );
                  })}
                </select>
                <p className="text-xs text-slate-500 mt-1">Sélectionnez le client concerné par ce devis</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Commande liée
                  <span className="text-xs text-slate-500 font-normal ml-1">(Optionnel)</span>
                </label>
                <select
                  value={formData.cmdRef || ""}
                  onChange={(e) => handleCommandeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none"
                >
                  <option value="">Sélectionner une commande</option>
                  {commandes && commandes.length > 0 ? commandes.map(commande => {
                    const displayRef = commande.reference || commande.cmdRef || 'CMD-' + commande.id;
                    const clientName = commande.clientName || commande.client?.name || commande.client?.prenom && commande.client?.nom 
                      ? `${commande.client.prenom} ${commande.client.nom}` 
                      : '';
                    const displayText = clientName ? `${displayRef} - ${clientName}` : displayRef;
                    return (
                      <option key={commande.id} value={displayRef}>
                        {displayText}
                      </option>
                    );
                  }) : (
                    <option value="" disabled>Aucune commande disponible</option>
                  )}
                </select>
                <p className="text-xs text-slate-500 mt-1">Associer ce devis à une commande existante</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Date de création
                  <span className="text-xs text-red-500 font-normal ml-1">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Date de création du devis</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Date de validité
                  <span className="text-xs text-red-500 font-normal ml-1">*</span>
                </label>
                <input
                  type="date"
                  value={formData.validity}
                  onChange={(e) => setFormData(prev => ({ ...prev, validity: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Date limite de validité du devis</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Description
                  <span className="text-xs text-slate-500 font-normal ml-1">(Optionnel)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none resize-none"
                  placeholder="Description du devis..."
                />
                <p className="text-xs text-slate-500 mt-1">Description détaillée des services ou produits concernés</p>
              </div>
            </div>

            {/* Lignes de devis */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900">Lignes du devis</h3>
                <button
                  onClick={addLigne}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter une ligne
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-slate-700">Description</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-slate-700">Quantité</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-slate-700">Prix HT</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-slate-700">Total HT</th>
                      <th className="text-center px-3 py-2 text-xs font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {lignes.map((ligne) => (
                      <tr key={ligne.id}>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={ligne.description}
                            onChange={(e) => updateLigne(ligne.id, "description", e.target.value)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none"
                            placeholder="Description..."
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={ligne.quantite}
                            onChange={(e) => updateLigne(ligne.id, "quantite", parseFloat(e.target.value) || 1)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none"
                            min="1"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={ligne.prixHT}
                            onChange={(e) => updateLigne(ligne.id, "prixHT", parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="px-3 py-2 text-sm font-medium text-slate-900">
                          {ligne.totalHT.toFixed(2)} €
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => removeLigne(ligne.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* TVA & Totaux */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Taux TVA (%)</label>
                <select
                  value={tvaRate}
                  onChange={(e) => {
                    setTvaRate(parseFloat(e.target.value));
                    recalculerTotaux(lignes, remiseGlobale, parseFloat(e.target.value));
                  }}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none bg-white"
                >
                  <option value="0">0%</option>
                  <option value="7">7%</option>
                  <option value="10">10%</option>
                  <option value="14">14%</option>
                  <option value="20">20%</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Remise (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={remiseGlobale}
                  onChange={(e) => {
                    setRemiseGlobale(parseFloat(e.target.value) || 0);
                    recalculerTotaux(lignes, parseFloat(e.target.value) || 0, tvaRate);
                  }}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-sm text-slate-600">Total HT:</span>
                <span className="text-lg font-bold text-slate-900">
                  {formData.totalAmount ? (formData.totalAmount * 0.8).toFixed(2) : "0.00"} €
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-sm text-slate-600">TVA ({tvaRate}%):</span>
                <span className="text-lg font-bold text-slate-900">
                  {formData.totalAmount ? (formData.totalAmount * 0.2).toFixed(2) : "0.00"} €
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-semibold text-slate-900">Total TTC:</span>
                <span className="text-xl font-bold text-emerald-600">
                  {formData.totalAmount ? formData.totalAmount.toFixed(2) : "0.00"} €
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none resize-none"
              placeholder="Notes internes..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            {editMode ? "Mettre à jour" : "Créer le devis"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DevisModal;
