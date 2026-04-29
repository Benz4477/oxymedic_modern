// src/pages/Facturation/components/FactureModal.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { X, Plus, Trash2, FileText, File } from "lucide-react";
import { toast } from "react-toastify";

const FactureModal = ({
  isOpen,
  onClose,
  editMode,
  formData,
  setFormData,
  clients = [],
  commandes = [],
  onSave,
}) => {
  const [lignes, setLignes] = useState([]);
  const [tvaRate, setTvaRate] = useState(20);
  const [remiseGlobale, setRemiseGlobale] = useState(0);
  const [typeDocument, setTypeDocument] = useState("facture");
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [clientCommandes, setClientCommandes] = useState([]);
  const clientSelectRef = useRef(null);

  // Récupérer les commandes du client sélectionné
  useEffect(() => {
    if (selectedClientId) {
      const filtered = commandes.filter((cmd) => {
        // Trouver le client correspondant pour comparer son id
        const selectedClient = clients.find(
          (c) => (c._id || c.id) === selectedClientId,
        );
        const selectedClientNumericId = selectedClient?.id;

        return cmd.clientId === selectedClientNumericId;
      });
      setClientCommandes(filtered);
    } else {
      setClientCommandes([]);
    }
  }, [selectedClientId, commandes, clients]);

  // Synchroniser selectedClientId avec formData.clientId
  useEffect(() => {
    if (formData.clientId && formData.clientId !== selectedClientId) {
      setSelectedClientId(formData.clientId);
    }
  }, [formData.clientId]);

  // Initialisation
  useEffect(() => {
    if (isOpen) {
      if (editMode && formData.lignes && formData.lignes.length > 0) {
        setLignes(
          formData.lignes.map((l) => ({
            ...l,
            totalHT: l.quantite * l.prixHT,
          })),
        );
        setTvaRate(formData.tvaGlobale || 20);
        setRemiseGlobale(formData.remiseGlobale || 0);
        setTypeDocument(formData.type || "facture");
        if (formData.clientId) {
          setSelectedClientId(formData.clientId);
        }
      } else {
        setLignes([
          {
            id: Date.now(),
            description: "",
            quantite: 1,
            prixHT: 0,
            totalHT: 0,
            tvaRate: 20,
            remPct: 0,
          },
        ]);
        setTvaRate(20);
        setRemiseGlobale(0);
        setTypeDocument("facture");
        setSelectedClientId(null);
      }
    }
  }, [isOpen, editMode, formData]);

  // Calcul des totaux
  const totals = useMemo(() => {
    let sousTotal = 0;
    let totalHT = 0;
    let totalTVA = 0;

    lignes.forEach((ligne) => {
      const ligneHT = ligne.quantite * ligne.prixHT;
      sousTotal += ligneHT;
      totalHT += ligneHT;
      totalTVA += ligneHT * (tvaRate / 100);
    });

    totalHT = totalHT * (1 - remiseGlobale / 100);
    totalTVA = totalTVA * (1 - remiseGlobale / 100);
    const totalTTC = totalHT + totalTVA;

    return { sousTotal, totalHT, totalTVA, totalTTC };
  }, [lignes, tvaRate, remiseGlobale]);

  // Mise à jour d'une ligne
  const updateLigne = (index, field, value) => {
    const newLignes = [...lignes];
    newLignes[index][field] = value;
    if (field === "quantite" || field === "prixHT") {
      newLignes[index].totalHT =
        newLignes[index].quantite * newLignes[index].prixHT;
    }
    setLignes(newLignes);
  };

  // Ajouter une ligne
  const addLigne = () => {
    setLignes([
      ...lignes,
      {
        id: Date.now(),
        description: "",
        quantite: 1,
        prixHT: 0,
        totalHT: 0,
        tvaRate,
        remPct: 0,
      },
    ]);
  };

  // Supprimer une ligne
  const removeLigne = (index) => {
    if (lignes.length === 1) {
      toast.error("Au moins une ligne est requise");
      return;
    }
    setLignes(lignes.filter((_, i) => i !== index));
  };

  // Remplir depuis une commande
  const handleCommandeSelect = (commandeId) => {
    const cmd = commandes.find((c) => (c._id || c.id) === commandeId);
    if (!cmd) return;

    // Créer une ligne à partir de la commande
    const description = `Commande ${cmd.numero}${cmd.equipement ? ` - ${cmd.equipement}` : ""}`;
    const prixHT = Math.round((cmd.montant || 0) / (1 + tvaRate / 100));

    setLignes([
      {
        id: Date.now(),
        description,
        quantite: 1,
        prixHT,
        totalHT: prixHT,
        tvaRate,
        remPct: 0,
      },
    ]);

    setFormData((prev) => ({
      ...prev,
      cmdRef: cmd._id || cmd.id,
      cmdNumero: cmd.numero,
    }));
  };

  // Sélectionner un client
  const handleClientChange = (clientId) => {
    const client = clients.find((c) => (c._id || c.id) === clientId);
    if (client) {
      const clientIdValue = client._id || client.id;
      setSelectedClientId(clientIdValue);
      setFormData((prev) => ({
        ...prev,
        clientId: clientIdValue,
        clientNom: `${client.prenom} ${client.nom}`,
        cmdRef: "", // Réinitialiser la commande liée
      }));
    }
  };

  // Sauvegarde
  const handleSave = () => {
    if (lignes.length === 0 || !lignes[0].description) {
      toast.error("Ajoutez au moins une ligne de facturation");
      return;
    }
    if (!selectedClientId && !formData.clientId) {
      toast.error("Sélectionnez un client");
      return;
    }

    const dataToSend = {
      type: typeDocument,
      status: formData.status || "draft",
      clientId: selectedClientId || formData.clientId,
      clientNom: formData.clientNom || "",
      date: formData.date
        ? new Date(formData.date).toLocaleDateString("fr-FR")
        : new Date().toLocaleDateString("fr-FR"),
      dateEcheance: formData.dateEcheance
        ? new Date(formData.dateEcheance).toLocaleDateString("fr-FR")
        : "",
      lignes: lignes.map((l) => ({
        description: l.description,
        quantite: l.quantite,
        prixHT: l.prixHT,
        totalHT: l.prixHT * l.quantite,
        tvaRate,
        remPct: 0,
      })),
      cmdRef: formData.cmdRef || "",
      notes: formData.notes || "",
      remiseGlobale,
      tvaGlobale: tvaRate,
      montantHT: Math.round(totals.totalHT),
      montantTVA: Math.round(totals.totalTVA),
      montantTTC: Math.round(totals.totalTTC),
      montantPaye: 0,
      montantRestant: Math.round(totals.totalTTC),
    };

    onSave(dataToSend);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-5 py-3">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
              {editMode ? "Modifier la facture" : "Nouvelle facture"}
            </h3>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"
            >
              <X size={14} />
            </button>
          </div>

          {/* Toggle Facture / Proforma */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTypeDocument("facture")}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition ${
                typeDocument === "facture"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              <FileText size={16} /> Facture officielle
              <span className="text-[10px] ml-1">
                Document fiscal définitif
              </span>
            </button>
            <button
              type="button"
              onClick={() => setTypeDocument("proforma")}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition ${
                typeDocument === "proforma"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              <File size={16} /> Devis proforma
              <span className="text-[10px] ml-1">
                Estimation non définitive
              </span>
            </button>
          </div>
          {typeDocument === "proforma" && (
            <p className="text-[10px] text-slate-400 mt-2">
              ⚠️ Ce document est une proforma — non valable comme facture
              fiscale définitive
            </p>
          )}
        </div>

        {/* Corps du modal */}
        <div className="p-5 space-y-5">
          {/* Client - Sélecteur avec clé unique */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              Client <span className="text-red-400">*</span>
            </label>
            <select
              ref={clientSelectRef}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              defaultValue={selectedClientId || ""}
              onChange={(e) => handleClientChange(e.target.value)}
            >
              <option value="">Sélectionner un client</option>
              {clients.map((client) => (
                <option
                  key={client._id || client.id}
                  value={client._id || client.id}
                >
                  {client.prenom} {client.nom}
                </option>
              ))}
            </select>
          </div>

          {/* Commande liée - TOUJOURS VISIBLE */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              Commande liée
            </label>
            <select
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.cmdRef || ""}
              onChange={(e) => handleCommandeSelect(e.target.value)}
            >
              <option value="">— Aucune commande —</option>
              {/* Filtrer les commandes par client sélectionné si disponible, sinon afficher toutes */}
              {(selectedClientId ? clientCommandes : commandes).map((cmd) => (
                <option key={cmd._id || cmd.id} value={cmd._id || cmd.id}>
                  {cmd.numero} —{" "}
                  {cmd.date
                    ? new Date(cmd.date).toLocaleDateString("fr-FR")
                    : "Date inconnue"}{" "}
                  — {cmd.montant?.toLocaleString() || 0} MAD
                </option>
              ))}
            </select>
            {selectedClientId && clientCommandes.length === 0 && (
              <p className="text-xs text-slate-400 mt-1">
                Aucune commande trouvée pour ce client
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Date facture
              </label>
              <input
                type="date"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.date || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Date échéance
              </label>
              <input
                type="date"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.dateEcheance || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dateEcheance: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Lignes de facturation */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Lignes de facturation
              </label>
              <button
                type="button"
                onClick={addLigne}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
              >
                <Plus size={12} /> Ajouter une ligne
              </button>
            </div>

            {/* En-tête du tableau */}
            <div className="grid grid-cols-12 gap-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              <div className="col-span-5">Description</div>
              <div className="col-span-2 text-center">Qté</div>
              <div className="col-span-2 text-right">Prix HT</div>
              <div className="col-span-2 text-right">Total HT</div>
              <div className="col-span-1"></div>
            </div>

            {/* Lignes */}
            <div className="space-y-2">
              {lignes.map((ligne, index) => (
                <div
                  key={ligne.id || index}
                  className="grid grid-cols-12 gap-2 items-center"
                >
                  <div className="col-span-5">
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                      value={ligne.description}
                      onChange={(e) =>
                        updateLigne(index, "description", e.target.value)
                      }
                      placeholder="Description du produit/service"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center focus:ring-2 focus:ring-emerald-400 outline-none"
                      value={ligne.quantite}
                      onChange={(e) =>
                        updateLigne(
                          index,
                          "quantite",
                          parseInt(e.target.value) || 1,
                        )
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-right focus:ring-2 focus:ring-emerald-400 outline-none"
                      value={ligne.prixHT}
                      onChange={(e) =>
                        updateLigne(
                          index,
                          "prixHT",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                    />
                  </div>
                  <div className="col-span-2 text-right font-mono text-sm font-bold text-emerald-700">
                    {(ligne.quantite * ligne.prixHT).toLocaleString()} MAD
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeLigne(index)}
                      className="text-red-500 hover:text-red-700 text-xs w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TVA & Remise */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Taux TVA (%)
                </label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none bg-white"
                  value={tvaRate}
                  onChange={(e) => setTvaRate(parseFloat(e.target.value))}
                >
                  <option value="0">0%</option>
                  <option value="7">7%</option>
                  <option value="10">10%</option>
                  <option value="14">14%</option>
                  <option value="20">20%</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Remise globale (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none bg-white"
                  value={remiseGlobale}
                  onChange={(e) =>
                    setRemiseGlobale(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
            </div>

            {/* Totaux */}
            <div className="bg-white rounded-xl p-3 border border-slate-200">
              <div className="flex justify-between text-sm py-1">
                <span className="text-slate-500">Sous-total HT</span>
                <span className="font-mono">
                  {Math.round(totals.sousTotal).toLocaleString()} MAD
                </span>
              </div>
              {remiseGlobale > 0 && (
                <div className="flex justify-between text-sm py-1 text-amber-600">
                  <span>Remise ({remiseGlobale}%)</span>
                  <span>
                    -{" "}
                    {Math.round(
                      totals.sousTotal - totals.totalHT,
                    ).toLocaleString()}{" "}
                    MAD
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm py-1">
                <span className="text-slate-500">Total HT</span>
                <span className="font-mono font-semibold">
                  {Math.round(totals.totalHT).toLocaleString()} MAD
                </span>
              </div>
              <div className="flex justify-between text-sm py-1">
                <span className="text-slate-500">TVA ({tvaRate}%)</span>
                <span className="font-mono text-purple-600">
                  {Math.round(totals.totalTVA).toLocaleString()} MAD
                </span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 mt-2 border-t border-slate-200">
                <span>TOTAL TTC</span>
                <span className="text-emerald-700">
                  {Math.round(totals.totalTTC).toLocaleString()} MAD
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              Notes / Conditions
            </label>
            <textarea
              rows="2"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Paiement sous 30 jours, conditions particulières..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 flex justify-end gap-2 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition"
          >
            {editMode ? "Mettre à jour" : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FactureModal;
