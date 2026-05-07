import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import JsBarcode from "jsbarcode";

const UnitModal = ({ isOpen, onClose, editMode, formData, setFormData, equipements, units = [], onSave }) => {
  const [barcodePreview, setBarcodePreview] = useState("");

  // ── Aperçu code-barres ────────────────────────────────────
  useEffect(() => {
    if (formData.barcode && formData.barcode.length >= 6) {
      setBarcodePreview(formData.barcode);
      const timer = setTimeout(() => {
        const svg = document.getElementById("barcode-preview-unit");
        if (svg) {
          try {
            JsBarcode(svg, formData.barcode, {
              format: "CODE128", width: 1.5, height: 34,
              displayValue: false, margin: 4,
              background: "transparent", lineColor: "#16A34A",
            });
          } catch (err) {}
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setBarcodePreview("");
    }
  }, [formData.barcode]);

  // ── Auto-génération quand équipement sélectionné ─────────
  useEffect(() => {
    if (!formData.equipement || editMode) return;
    const equip = equipements.find(e => String(e._id) === String(formData.equipement));
    if (!equip) return;

    // N° série auto
    const count = units.filter(u =>
      String(u.equipement?._id || u.equipement) === String(equip._id)
    ).length;
    const prefix = (equip.name || "EQ")
      .split(" ").filter(w => w.length > 2).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "EQ";
    const serial = `OXY-${prefix}-${String(count + 1).padStart(3, "0")}`;

    // Code-barres auto
    let barcode;
    if (equip.productBarcode && equip.productBarcode.length >= 10) {
      const suffix = String(count + 1).padStart(3, "0");
      barcode = equip.productBarcode.slice(0, -3) + suffix;
    } else {
      barcode = "370" + Math.floor(Math.random() * 1e10).toString().padStart(10, "0");
    }

    setFormData(prev => ({ ...prev, serial, barcode }));
  }, [formData.equipement, editMode]);

  const selectedEquip = equipements.find(e => String(e._id) === String(formData.equipement));

  const autoGenerateSerial = () => {
    if (!selectedEquip) return;
    const count = units.filter(u => String(u.equipement?._id || u.equipement) === String(selectedEquip._id)).length;
    const prefix = (selectedEquip.name || "EQ")
      .split(" ").filter(w => w.length > 2).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "EQ";
    setFormData(prev => ({ ...prev, serial: `OXY-${prefix}-${String(count + 1).padStart(3, "0")}` }));
  };

  const generateBarcode = () => {
    setFormData(prev => ({
      ...prev,
      barcode: "370" + Math.floor(Math.random() * 1e10).toString().padStart(10, "0"),
    }));
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
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Équipement *</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.equipement || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, equipement: e.target.value }))}
              >
                <option value="">Sélectionner</option>
                {equipements.map(e => (
                  <option key={e._id} value={String(e._id)}>{e.icon} {e.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Statut</label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.statut || "disponible"}
                onChange={(e) => setFormData(prev => ({ ...prev, statut: e.target.value }))}
              >
                <option value="disponible">Disponible</option>
                <option value="loué">En location</option>
                <option value="maintenance">Maintenance</option>
                <option value="retiré">Retiré</option>
              </select>
            </div>
          </div>

          {/* N° série + Code-barres */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">N° de série *</label>
              <input type="text"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.serial || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, serial: e.target.value }))}
                placeholder="OXY-FR-001"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Code-barres *</label>
              <input type="text"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-emerald-400 outline-none"
                value={formData.barcode || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                placeholder="3701234560001"
              />
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
              <div className="text-xs text-slate-400 py-4">Sélectionnez un équipement pour générer automatiquement</div>
            )}
          </div>

          {/* Boutons auto */}
          <div className="flex gap-2">
            <button type="button" onClick={autoGenerateSerial}
              className="flex-1 px-3 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition">
              🔄 N° série auto
            </button>
            <button type="button" onClick={generateBarcode}
              className="flex-1 px-3 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition">
              ▦ Générer CB
            </button>
          </div>

          {/* Date d'entrée */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Date d'entrée</label>
            <input type="date"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.dateAchat || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, dateAchat: e.target.value }))}
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Note / État</label>
            <textarea rows="2"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-emerald-400 outline-none"
              value={formData.note || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              placeholder="Bon état, neuf, reconditionné..."
            />
          </div>
        </div>

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

export default UnitModal;