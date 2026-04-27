// src/components/StockModal.jsx
import React, { useState, useRef, useEffect } from "react";
import { X, Camera } from "lucide-react";
import JsBarcode from "jsbarcode";

// ── Palette de couleurs (identique à l'original) ──
const COLOR_PALETTE = [
  "#16A34A",
  "#2563EB",
  "#7C3AED",
  "#0891B2",
  "#D97706",
  "#DC2626",
  "#059669",
  "#9333EA",
  "#0F766E",
  "#B45309",
  "#BE185D",
  "#EA580C",
  "#374151",
  "#0369A1",
  "#15803D",
];

// ── Composant de prévisualisation du code‑barres ──
const BarcodePreview = ({ value }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && value && value.length >= 6) {
      try {
        JsBarcode(svgRef.current, value, {
          format: "CODE128",
          width: 1.2,
          height: 30,
          displayValue: false,
          margin: 3,
          background: "transparent",
          lineColor: "#000000",
        });
      } catch (err) {
        console.warn("Erreur génération code‑barres", err);
      }
    }
  }, [value]);

  if (!value || value.length < 6) {
    return (
      <div className="mt-3 p-3 bg-white border border-slate-200 rounded-xl text-center text-slate-400 text-sm">
        Saisissez un code‑barres pour l'aperçu
      </div>
    );
  }

  return (
    <div className="mt-3 p-3 bg-white border border-slate-200 rounded-xl text-center">
      <svg ref={svgRef} className="w-full h-auto max-h-8" />
      <div className="text-center text-xs text-slate-600 font-mono mt-1">
        {value}
      </div>
    </div>
  );
};

// ── Composant Aperçu en direct (carte produit) ──
const LivePreview = ({ data, color }) => {
  const bgColor = color || data.cardColor || "#16A34A";
  return (
    <div className="border rounded-xl overflow-hidden shadow-sm mb-4">
      <div className="h-2" style={{ background: bgColor }} />
      <div className="p-4" style={{ background: `${bgColor}08` }}>
        <div className="flex gap-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
            style={{ background: `${bgColor}22` }}
          >
            {data.icon || "🏥"}
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-800">
              {data.name || "Nom du produit"}
            </div>
            <div className="text-xs text-gray-500">
              {data.cat || "Catégorie"}
              {data.subcat ? ` › ${data.subcat}` : ""}
            </div>
            <div className="flex gap-2 mt-1">
              {data.marque && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{ background: `${bgColor}15`, color: bgColor }}
                >
                  🏷️ {data.marque}
                </span>
              )}
              {data.origine && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  🌍 {data.origine}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg" style={{ color: bgColor }}>
              {data.pMonth || 0} MAD
            </div>
            <div className="text-[10px] text-gray-400">/ mois</div>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Caution</span>
            <span className="font-semibold">{data.caution || 0} MAD</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, (data.dispo / data.total) * 100)}%`,
                background: bgColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Sélecteur de couleur ──
const ColorSelector = ({ selectedColor, onColorChange }) => {
  return (
    <div
      className="border rounded-xl p-4"
      style={{
        borderColor: `${selectedColor}33`,
        background: `${selectedColor}08`,
      }}
    >
      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
        🎨 Couleur de la fiche
      </label>
      <div className="flex flex-wrap gap-2">
        {COLOR_PALETTE.map((color) => (
          <button
            type="button"
            key={color}
            onClick={() => onColorChange(color)}
            className={`w-7 h-7 rounded-full transition-all ${selectedColor === color ? "ring-2 ring-offset-2 ring-slate-800" : ""}`}
            style={{ background: color }}
          />
        ))}
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-7 h-7 rounded-full border border-slate-200 cursor-pointer"
        />
      </div>
    </div>
  );
};

// ── Upload de photo ──
const PhotoUpload = ({ photoPreview, onPhotoChange }) => {
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onPhotoChange(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
        Photo
      </label>
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
          {photoPreview ? (
            <img
              src={photoPreview}
              className="w-full h-full object-cover"
              alt="preview"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <Camera size={20} />
            </div>
          )}
        </div>
        <label className="px-3 py-2 bg-slate-100 rounded-xl text-sm cursor-pointer">
          Choisir une image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </label>
      </div>
    </div>
  );
};

// ── Composant principal du modal ──
const StockModal = ({
  isOpen,
  onClose,
  isEdit,
  formData,
  setFormData,
  categories,
  selectedColor,
  setSelectedColor,
  photoPreview,
  setPhotoPreview,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const getSubcatsForCat = (catName) => {
    const cat = categories.find((c) => c.name === catName);
    return cat ? cat.subcats : [];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
              {isEdit ? "Modifier l'équipement" : "Nouvel équipement"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Remplissez toutes les informations
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Aperçu en direct */}
          <LivePreview data={formData} color={selectedColor} />

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Couleur */}
            <ColorSelector
              selectedColor={selectedColor}
              onColorChange={(color) => {
                setSelectedColor(color);
                setFormData({ ...formData, cardColor: color });
              }}
            />

            {/* Deux colonnes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Icône
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  maxLength={4}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Nom *
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Catégorie + Sous‑catégorie */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Catégorie
                </label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
                  value={formData.cat}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cat: e.target.value,
                      subcat: "",
                    })
                  }
                >
                  <option value="">Sélectionner</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Sous-catégorie
                </label>
                <select
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
                  value={formData.subcat}
                  onChange={(e) =>
                    setFormData({ ...formData, subcat: e.target.value })
                  }
                >
                  <option value="">Aucune</option>
                  {getSubcatsForCat(formData.cat).map((sub) => (
                    <option key={sub.id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Référence + Marque */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Référence
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
                  value={formData.ref}
                  onChange={(e) =>
                    setFormData({ ...formData, ref: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Marque
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
                  value={formData.marque}
                  onChange={(e) =>
                    setFormData({ ...formData, marque: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Origine + Emplacement */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Origine
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
                  value={formData.origine}
                  onChange={(e) =>
                    setFormData({ ...formData, origine: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Emplacement
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
                  placeholder="Entrepôt A — Rayon 1"
                  value={formData.emplacement}
                  onChange={(e) =>
                    setFormData({ ...formData, emplacement: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Tarifs (jour, semaine, mois) */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Tarifs (MAD)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] text-slate-500">
                    Jour
                  </label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                    value={formData.pDay}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pDay: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-500">
                    Semaine
                  </label>
                  <input
                    type="number"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                    value={formData.pWeek}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pWeek: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-emerald-600 font-bold">
                    Mois ★
                  </label>
                  <input
                    type="number"
                    className="w-full border border-emerald-200 rounded-xl px-3 py-2 text-sm bg-emerald-50"
                    value={formData.pMonth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pMonth: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Prix vente + Caution */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Prix vente (MAD)
                </label>
                <input
                  type="number"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
                  value={formData.pVente}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pVente: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Caution (MAD)
                </label>
                <input
                  type="number"
                  className="w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm"
                  value={formData.caution}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      caution: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            {/* Stock total + stock dispo */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Stock total
                </label>
                <input
                  type="number"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
                  value={formData.total}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      total: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                  Stock disponible
                </label>
                <input
                  type="number"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm"
                  value={formData.dispo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dispo: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            {/* ── CODE-BARRES PRODUIT (avec JsBarcode) ── */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Code‑barres produit
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono"
                  value={formData.productBarcode}
                  onChange={(e) =>
                    setFormData({ ...formData, productBarcode: e.target.value })
                  }
                  placeholder="3700000000000"
                />
                <button
                  type="button"
                  className="px-3 py-2 text-sm bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      productBarcode:
                        "370" +
                        Math.floor(Math.random() * 1e10)
                          .toString()
                          .padStart(10, "0"),
                    })
                  }
                >
                  ⚡ Générer
                </button>
              </div>
              {/* Aperçu du code‑barres avec JsBarcode */}
              <BarcodePreview value={formData.productBarcode} />
            </div>

            {/* Upload photo */}
            <PhotoUpload
              photoPreview={photoPreview}
              onPhotoChange={(newPhoto) => {
                setPhotoPreview(newPhoto);
                setFormData({ ...formData, photo: newPhoto });
              }}
            />

            {/* Description */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                Description
              </label>
              <textarea
                rows="3"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm resize-none"
                value={formData.desc}
                onChange={(e) =>
                  setFormData({ ...formData, desc: e.target.value })
                }
              />
            </div>

            {/* Boutons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-md shadow-emerald-100 transition-all"
              >
                {isEdit ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StockModal;
