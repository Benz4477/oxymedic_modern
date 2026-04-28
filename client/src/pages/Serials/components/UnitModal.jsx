// src/pages/Serials/components/UnitModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import JsBarcode from "jsbarcode";

const UnitModal = ({ isOpen, onClose, editMode, formData, setFormData, equipements, units = [], onSave }) => {
  const [barcodePreview, setBarcodePreview] = useState("");
  const barcodeSvgRef = useRef(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // Met à jour l'aperçu du code-barres à chaque changement
  useEffect(() => {
    if (formData.barcode && formData.barcode.length >= 6) {
      setBarcodePreview(formData.barcode);
      const timer = setTimeout(() => {
        const svg = document.getElementById('barcode-preview-unit');
        if (svg) {
          try {
            JsBarcode(svg, formData.barcode, {
              format: "CODE128",
              width: 1.5,
              height: 34,
              displayValue: false,
              margin: 4,
              background: "transparent",
              lineColor: "#16A34A",
            });
          } catch (err) {
            console.error("Erreur génération code-barres:", err);
          }
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setBarcodePreview("");
    }
  }, [formData.barcode]);

  // Auto-générer le code-barres à partir du produit
  const autoGenerateBarcode = (equipment) => {
    if (!equipment) return;

    // Compter le nombre d'unités existantes pour cet équipement
    const unitCount = units.filter(u => String(u.equipId?._id || u.equipId) === String(equipment._id)).length;
    const nextIndex = unitCount + 1;

    let newBarcode;
    if (equipment.productBarcode && equipment.productBarcode.length >= 10) {
      // Utiliser le productBarcode de l'équipement comme base
      const suffix = String(nextIndex).padStart(3, "0");
      newBarcode = equipment.productBarcode.slice(0, -3) + suffix;
    } else {
      // Sinon, générer un code aléatoire
      newBarcode = "370" + Math.floor(Math.random() * 1e10).toString().padStart(10, "0");
    }

    setFormData(prev => ({ ...prev, barcode: newBarcode }));
  };

  // Auto-générer le N° de série
  const autoGenerateSerial = (equipment) => {
    if (!equipment) return;

    const unitCount = units.filter(u => String(u.equipId?._id || u.equipId) === String(equipment._id)).length;
    const nextIndex = unitCount + 1;

    const prefix = equipment.name
      .split(" ")
      .filter(w => w.length > 2)
      .map(w => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    const newSerial = `OXY-${prefix}-${String(nextIndex).padStart(3, "0")}`;

    setFormData(prev => ({ ...prev, serial: newSerial }));
  };

  // Génération automatique quand un équipement est sélectionné (mode création uniquement)
  useEffect(() => {
    if (formData.equipId) {
      const selectedEquip = equipements.find(e => String(e._id) === String(formData.equipId));
      setSelectedEquipment(selectedEquip);
      
      if (selectedEquip && !editMode) {
        autoGenerateSerial(selectedEquip);
        autoGenerateBarcode(selectedEquip);
      }
    } else {
      setSelectedEquipment(null);
    }
  }, [formData.equipId, editMode, equipements, units]);

  // N° série auto (bouton)
  const autoSerial = () => {
    const selectedEquip = equipements.find(e => String(e._id) === String(formData.equipId));
    if (selectedEquip) {
      autoGenerateSerial(selectedEquip);
    }
  };

  // Générer code-barres (bouton)
  const generateBarcode = () => {
    const newBarcode = "370" + Math.floor(Math.random() * 1e10).toString().padStart(10, "0");
    setFormData(prev => ({ ...prev, barcode: newBarcode }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 px-5 py-3 flex justify-between items-center">
          <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
            {editMode ? "Modifier l'unité" : "Enregistrer une unité"}
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Équipement + Statut */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Équipement</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.equipId || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, equipId: e.target.value }))}
              >
                <option value="">Sélectionner</option>
                {equipements.map(e => <option key={e._id || e.name} value={String(e._id)}>{e.icon} {e.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Statut</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="available">Disponible</option>
                <option value="rented">En location</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retiré</option>
              </select>
            </div>
          </div>

          {/* N° de série + Code-barres */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">N° de série *</label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.serial}
                onChange={(e) => setFormData(prev => ({ ...prev, serial: e.target.value }))}
                placeholder="OXY-FR-001"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Code-barres *</label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.barcode}
                onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                placeholder="3701234560001"
              />
              {selectedEquipment && selectedEquipment.productBarcode && !editMode && (
                <p className="text-[10px] text-emerald-600 mt-1">
                  💡 Basé sur le code-barres produit : {selectedEquipment.productBarcode}
                </p>
              )}
            </div>
          </div>

          {/* Aperçu code-barres */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Aperçu code-barres</div>
            {barcodePreview ? (
              <>
                <svg id="barcode-preview-unit" className="w-full h-10" />
                <div className="text-[10px] font-mono text-slate-500 mt-2">{barcodePreview}</div>
              </>
            ) : (
              <div className="text-xs text-slate-400 py-4">Saisissez un code-barres pour l'aperçu</div>
            )}
          </div>

          {/* Boutons N° série auto + Générer CB */}
          <div className="flex gap-2">
            <button type="button" onClick={autoSerial} className="flex-1 px-3 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition">
              🔄 N° série auto
            </button>
            <button type="button" onClick={generateBarcode} className="flex-1 px-3 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition">
              ▦ Générer CB
            </button>
          </div>

          {/* Date d'entrée */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Date d'entrée</label>
            <input
              type="date"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.dateIn}
              onChange={(e) => setFormData(prev => ({ ...prev, dateIn: e.target.value }))}
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Note</label>
            <textarea
              rows="2"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              placeholder="État..."
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">Annuler</button>
          <button onClick={onSave} className="px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition">Enregistrer</button>
        </div>
      </div>
    </div>
  );
};

export default UnitModal;