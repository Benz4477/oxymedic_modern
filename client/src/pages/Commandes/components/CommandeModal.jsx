import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";

const MODE_PAIEMENT = [
  { value: "cash_magasin",   label: "Cash magasin" },
  { value: "cash_livraison", label: "Cash livraison" },
  { value: "carte",          label: "Carte bancaire" },
  { value: "virement",       label: "Virement" },
];

const CommandeModal = ({
  isOpen, onClose, editMode,
  formData, setFormData,
  clients, equipements, units,
  onSave,
}) => {
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [serialMode, setSerialMode]       = useState("select");
  const [newSerial, setNewSerial]         = useState("");
  const [newBarcode, setNewBarcode]       = useState("");

  // ── Filtrer unités + auto-générer si aucune dispo ─────────
  useEffect(() => {
    if (!formData.equipement) {
      setFilteredUnits([]);
      setSerialMode("select");
      return;
    }

    const disponibles = units.filter((u) => {
      const uid = u.equipement?._id || u.equipement;
      return String(uid) === String(formData.equipement) && u.statut === "disponible";
    });

    setFilteredUnits(disponibles);

    if (disponibles.length === 0) {
      // Aucune unité dispo → mode saisie automatique
      setSerialMode("new");
      const equip = equipements.find((e) => e._id === formData.equipement);
      if (equip) {
        const prefix = equip.name.split(" ")
          .filter((w) => w.length > 2)
          .map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "OX";
        const count = units.filter((u) => {
          const uid = u.equipement?._id || u.equipement;
          return String(uid) === String(formData.equipement);
        }).length;
        const serial  = `OXY-${prefix}-${String(count + 1).padStart(3, "0")}`;
        const barcode = "370" + Math.floor(Math.random() * 1e10).toString().padStart(10, "0");
        setNewSerial(serial);
        setNewBarcode(barcode);
        setFormData((prev) => ({ ...prev, unite: "", serialNumber: serial, barcode }));
      }
    } else {
      setSerialMode("select");
      setFormData((prev) => ({
        ...prev,
        unite: disponibles[0]._id,
        serialNumber: "",
        barcode: "",
      }));
    }
  }, [formData.equipement]);

  // ── Calcul automatique montant ────────────────────────────
  useEffect(() => {
    if (!formData.equipement || !formData.dateDebut || !formData.dateFin) return;
    const equip = equipements.find((e) => e._id === formData.equipement);
    if (!equip) return;

    const jours = Math.ceil(
      (new Date(formData.dateFin) - new Date(formData.dateDebut)) / 86400000
    );
    if (jours <= 0) return;

    let montantHT = 0;
    if (jours <= 1)       montantHT = equip.pDay   || 0;
    else if (jours <= 7)  montantHT = equip.pWeek  || (equip.pDay || 0) * jours;
    else if (jours <= 30) montantHT = equip.pMonth || 0;
    else                  montantHT = (equip.pMonth || 0) * Math.ceil(jours / 30);

    const tauxTVA    = formData.tauxTVA || 20;
    const montantTTC = Math.round(montantHT * (1 + tauxTVA / 100));
    setFormData((prev) => ({
      ...prev, montantHT, montantTTC,
      montantCaution: prev.montantCaution || equip.caution || 0,
    }));
  }, [formData.equipement, formData.dateDebut, formData.dateFin]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-5 py-3 flex justify-between items-center">
          <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
            {editMode ? "Modifier la commande" : "Nouvelle commande"}
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">

          {/* Client */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Client *</label>
            <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.client || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, client: e.target.value }))}>
              <option value="">Sélectionner un client</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>{c.prenom} {c.nom} — {c.tel}</option>
              ))}
            </select>
          </div>

          {/* Équipement */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Équipement *</label>
            <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.equipement || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, equipement: e.target.value, unite: "" }))}>
              <option value="">Sélectionner un équipement</option>
              {equipements.filter((e) => !e.archived).map((e) => (
                <option key={e._id} value={e._id}>
                  {e.icon} {e.name} {e.stockDispo !== undefined ? `(${e.stockDispo} dispo)` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* N° de série */}
          {formData.equipement && (
            <div className="border border-purple-200 rounded-xl p-3 bg-purple-50/30">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-purple-700">
                  N° de série (unité physique)
                </label>
                {filteredUnits.length > 0 && (
                  <div className="flex gap-1">
                    <button type="button"
                      onClick={() => { setSerialMode("select"); setFormData((p) => ({ ...p, serialNumber: "", barcode: "" })); }}
                      className={`text-[10px] px-2 py-1 rounded-lg font-bold transition ${serialMode === "select" ? "bg-purple-600 text-white" : "bg-white text-purple-600 border border-purple-200"}`}>
                      Existant
                    </button>
                    <button type="button"
                      onClick={() => { setSerialMode("new"); setFormData((p) => ({ ...p, unite: "", serialNumber: newSerial, barcode: newBarcode })); }}
                      className={`text-[10px] px-2 py-1 rounded-lg font-bold transition ${serialMode === "new" ? "bg-purple-600 text-white" : "bg-white text-purple-600 border border-purple-200"}`}>
                      <Plus size={10} className="inline mr-1" />Nouveau
                    </button>
                  </div>
                )}
              </div>

              {/* Unité existante */}
              {serialMode === "select" && filteredUnits.length > 0 && (
                <select className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-purple-400 outline-none bg-white"
                  value={formData.unite || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, unite: e.target.value, serialNumber: "", barcode: "" }))}>
                  <option value="">— Choisir une unité —</option>
                  {filteredUnits.map((u) => (
                    <option key={u._id} value={u._id}>✅ {u.serial} — {u.barcode}</option>
                  ))}
                </select>
              )}

              {/* Nouveau N° de série */}
              {serialMode === "new" && (
                <div className="space-y-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700">
                    💡 Une nouvelle unité sera créée automatiquement avec ce N° de série
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-purple-600 font-bold mb-1 block">N° Série</label>
                      <input type="text"
                        className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-purple-400 outline-none bg-white"
                        value={newSerial}
                        onChange={(e) => { setNewSerial(e.target.value); setFormData((p) => ({ ...p, serialNumber: e.target.value })); }}
                        placeholder="OXY-FR-001"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-purple-600 font-bold mb-1 block">Code-barres</label>
                      <input type="text"
                        className="w-full border border-purple-200 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-purple-400 outline-none bg-white"
                        value={newBarcode}
                        onChange={(e) => { setNewBarcode(e.target.value); setFormData((p) => ({ ...p, barcode: e.target.value })); }}
                        placeholder="3701234560001"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Date début *</label>
              <input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.dateDebut || ""}
                onChange={(e) => setFormData((p) => ({ ...p, dateDebut: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Date fin *</label>
              <input type="date" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.dateFin || ""}
                onChange={(e) => setFormData((p) => ({ ...p, dateFin: e.target.value }))} />
            </div>
          </div>

          {/* Montants */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-1">Montant HT</label>
                <input type="number" className="w-full border border-emerald-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={formData.montantHT || 0}
                  onChange={(e) => setFormData((p) => ({ ...p, montantHT: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-1">TVA (%)</label>
                <input type="number" className="w-full border border-emerald-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={formData.tauxTVA || 20}
                  onChange={(e) => setFormData((p) => ({ ...p, tauxTVA: parseFloat(e.target.value) || 20 }))} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-1">Montant TTC *</label>
                <input type="number" className="w-full border border-emerald-200 rounded-xl px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={formData.montantTTC || 0}
                  onChange={(e) => setFormData((p) => ({ ...p, montantTTC: parseFloat(e.target.value) || 0 }))} />
              </div>
            </div>
          </div>

          {/* Mode paiement */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Mode paiement *</label>
            <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.modePaiement || "cash_magasin"}
              onChange={(e) => setFormData((p) => ({ ...p, modePaiement: e.target.value }))}>
              {MODE_PAIEMENT.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>

          {/* Caution */}
          <div className="border border-amber-200 rounded-xl p-3 bg-amber-50/30">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-amber-700 mb-1">Caution (MAD)</label>
                <input type="number" className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                  value={formData.montantCaution || 0}
                  onChange={(e) => setFormData((p) => ({ ...p, montantCaution: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-amber-700 mb-1">Mode caution</label>
                <select className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                  value={formData.modeCaution || "cash"}
                  onChange={(e) => setFormData((p) => ({ ...p, modeCaution: e.target.value }))}>
                  <option value="cash">Cash</option>
                  <option value="cheque">Chèque</option>
                  <option value="virement">Virement</option>
                </select>
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Note</label>
            <textarea rows="2" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.note || ""}
              onChange={(e) => setFormData((p) => ({ ...p, note: e.target.value }))}
              placeholder="Informations complémentaires..." />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
            Annuler
          </button>
          <button onClick={onSave} className="px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandeModal;