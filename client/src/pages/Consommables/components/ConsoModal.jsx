// src/pages/Consommables/components/ConsoModal.jsx
import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Camera } from "lucide-react";
import { toast } from "react-toastify";
import consommableService from "../../../services/consommableService";
import equipementService from "../../../services/equipementService";

const UNITE_OPTIONS = ["pièce", "paquet", "flacon", "boîte", "rouleau", "kit"];
const TVA_OPTIONS = [0, 7, 10, 14, 20];
const MARGE_PRESETS = [15, 20, 30, 35, 40, 50];

const marqueList = [
  "Drive Medical", "Invacare", "Philips Respironics", "Sidhil", "Homecraft",
  "Lofstrand", "DeVilbiss", "Sunrise Medical", "B.Braun", "Medtronic",
  "GE Healthcare", "Omron", "ResMed", "Arjo", "Hillrom"
];

const origineList = [
  "France", "Allemagne", "Chine", "USA", "UK", "Italie",
  "Espagne", "Maroc", "Turquie", "Suisse", "Belgique", "Canada"
];

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
        📷 Photo
      </label>
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
          {photoPreview ? (
            <img src={photoPreview} className="w-full h-full object-cover" alt="preview" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <Camera size={20} />
            </div>
          )}
        </div>
        <label className="px-3 py-2 bg-slate-100 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition cursor-pointer">
          Choisir une image
          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
        </label>
      </div>
      <p className="text-[10px] text-slate-400 mt-1">Format recommandé : PNG, JPG (max 2 Mo)</p>
    </div>
  );
};

const ConsoModal = ({ isOpen, onClose, consommable, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    ref: "",
    marque: "",
    origine: "",
    prixAchatHT: 0,
    tva: 20,
    prixVente: 0,
    unite: "pièce",
    conditionnement: "",
    barcode: "",
    stock: 0,
    stockMin: 10,
    compatEquips: [],
    desc: "",
    photo: "",
    fournisseurPrincipal: { nom: "", tel: "", email: "" },
    autresFournisseurs: [],
  });
  const [equipements, setEquipements] = useState([]);
  const [prixAchatTTC, setPrixAchatTTC] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    const loadEquipements = async () => {
      try {
        const data = await equipementService.getAll();
        setEquipements(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadEquipements();
  }, []);

  useEffect(() => {
    if (consommable) {
      setFormData({
        name: consommable.name || "",
        ref: consommable.ref || "",
        marque: consommable.marque || "",
        origine: consommable.origine || "",
        prixAchatHT: consommable.prixAchatHT || 0,
        tva: consommable.tva || 20,
        prixVente: consommable.prixVente || 0,
        unite: consommable.unite || "pièce",
        conditionnement: consommable.conditionnement || "",
        barcode: consommable.barcode || "",
        stock: consommable.stock || 0,
        stockMin: consommable.stockMin || 10,
        compatEquips: consommable.compatEquips?.map((e) => e._id || e) || [],
        desc: consommable.desc || "",
        photo: consommable.photo || "",
        fournisseurPrincipal: consommable.fournisseurPrincipal || { nom: "", tel: "", email: "" },
        autresFournisseurs: consommable.autresFournisseurs || [],
      });
      const ttc = Math.round((consommable.prixAchatHT || 0) * (1 + (consommable.tva || 20) / 100));
      setPrixAchatTTC(ttc);
      setPhotoPreview(consommable.photo || "");
    } else {
      setFormData({
        name: "",
        ref: "",
        marque: "",
        origine: "",
        prixAchatHT: 0,
        tva: 20,
        prixVente: 0,
        unite: "pièce",
        conditionnement: "",
        barcode: "",
        stock: 0,
        stockMin: 10,
        compatEquips: [],
        desc: "",
        photo: "",
        fournisseurPrincipal: { nom: "", tel: "", email: "" },
        autresFournisseurs: [],
      });
      setPrixAchatTTC(0);
      setPhotoPreview("");
    }
  }, [consommable]);

  const handlePrixAchatChange = (ht) => {
    const htVal = parseFloat(ht) || 0;
    const ttc = Math.round(htVal * (1 + formData.tva / 100));
    setPrixAchatTTC(ttc);
    setFormData({ ...formData, prixAchatHT: htVal });
  };

  const handleTvaChange = (tva) => {
    const tvaVal = parseFloat(tva) || 20;
    const ttc = Math.round(formData.prixAchatHT * (1 + tvaVal / 100));
    setPrixAchatTTC(ttc);
    setFormData({ ...formData, tva: tvaVal });
  };

  const applyMarge = (margePercent) => {
    const pv = Math.round(prixAchatTTC * (1 + margePercent / 100));
    setFormData({ ...formData, prixVente: pv });
  };

  const addAutreFournisseur = () => {
    setFormData({
      ...formData,
      autresFournisseurs: [...formData.autresFournisseurs, { nom: "", tel: "", email: "" }],
    });
  };

  const updateAutreFournisseur = (idx, field, value) => {
    const updated = [...formData.autresFournisseurs];
    updated[idx][field] = value;
    setFormData({ ...formData, autresFournisseurs: updated });
  };

  const removeAutreFournisseur = (idx) => {
    const updated = [...formData.autresFournisseurs];
    updated.splice(idx, 1);
    setFormData({ ...formData, autresFournisseurs: updated });
  };

  const toggleCompatEquip = (equipId) => {
    const current = formData.compatEquips;
    if (current.includes(equipId)) {
      setFormData({ ...formData, compatEquips: current.filter((id) => id !== equipId) });
    } else {
      setFormData({ ...formData, compatEquips: [...current, equipId] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Le nom est requis");
      return;
    }
    setIsSubmitting(true);
    try {
      if (consommable) {
        await consommableService.update(consommable._id, formData);
        toast.success("Consommable mis à jour");
      } else {
        await consommableService.create(formData);
        toast.success("Consommable créé");
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
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-5 py-3 flex justify-between items-center">
          <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
            {consommable ? "Modifier le consommable" : "Nouveau consommable"}
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-5">
            {/* Identité */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Nom *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Référence</label>
                <input type="text" value={formData.ref} onChange={(e) => setFormData({ ...formData, ref: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Code-barres</label>
                <div className="flex gap-2">
                  <input type="text" value={formData.barcode} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} className="flex-1 border border-slate-200 rounded-lg px-3 py-2 font-mono" placeholder="Ex: 3700000000000" />
                  <button
                    type="button"
                    className="px-3 py-2 text-xs font-bold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        barcode: "370" + Math.floor(Math.random() * 1e10).toString().padStart(10, "0"),
                      })
                    }
                  >
                    ⚡ Générer
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Marque</label>
                <input type="text" list="conso-marque-list" value={formData.marque} onChange={(e) => setFormData({ ...formData, marque: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="Ex: Philips, B.Braun..." />
                <datalist id="conso-marque-list">
                  {marqueList.map(m => <option key={m} value={m} />)}
                </datalist>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Origine / Pays</label>
                <input type="text" list="conso-origine-list" value={formData.origine} onChange={(e) => setFormData({ ...formData, origine: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="Ex: France, Maroc..." />
                <datalist id="conso-origine-list">
                  {origineList.map(o => <option key={o} value={o} />)}
                </datalist>
              </div>
            </div>

            {/* Tarification */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-2">💰 Tarification & TVA</div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-emerald-700">Prix achat HT (MAD)</label>
                  <input type="number" step="0.01" value={formData.prixAchatHT} onChange={(e) => handlePrixAchatChange(e.target.value)} className="w-full border border-emerald-200 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-emerald-700">TVA (%)</label>
                  <select value={formData.tva} onChange={(e) => handleTvaChange(e.target.value)} className="w-full border border-emerald-200 rounded-lg px-3 py-2">
                    {TVA_OPTIONS.map((t) => <option key={t} value={t}>{t}%</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-emerald-700">Prix achat TTC (MAD)</label>
                  <input type="number" readOnly value={prixAchatTTC} className="w-full border border-emerald-200 rounded-lg px-3 py-2 bg-emerald-100" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-emerald-700 mb-1">Marge suggérée → prix vente</label>
                <div className="flex flex-wrap gap-2">
                  {MARGE_PRESETS.map((m) => (
                    <button key={m} type="button" onClick={() => applyMarge(m)} className="px-2 py-1 text-xs font-semibold bg-white border border-emerald-300 rounded-lg hover:bg-emerald-100">{m}%</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-emerald-700">Prix de vente TTC (MAD) *</label>
                <input type="number" required value={formData.prixVente} onChange={(e) => setFormData({ ...formData, prixVente: parseFloat(e.target.value) || 0 })} className="w-full border border-emerald-200 rounded-lg px-3 py-2 font-bold" />
              </div>
            </div>

            {/* Stock */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-amber-700">📦 Stock</div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-amber-700">Unité</label>
                  <select value={formData.unite} onChange={(e) => setFormData({ ...formData, unite: e.target.value })} className="w-full border border-amber-200 rounded-lg px-3 py-2">
                    {UNITE_OPTIONS.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-amber-700">Conditionnement</label>
                  <input type="text" value={formData.conditionnement} onChange={(e) => setFormData({ ...formData, conditionnement: e.target.value })} className="w-full border border-amber-200 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-amber-700">Stock actuel</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} className="w-full border border-amber-200 rounded-lg px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-amber-700">Seuil d'alerte</label>
                <input type="number" value={formData.stockMin} onChange={(e) => setFormData({ ...formData, stockMin: parseInt(e.target.value) || 0 })} className="w-full border border-amber-200 rounded-lg px-3 py-2" />
              </div>
            </div>

            {/* Fournisseurs */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-blue-700">🏭 Fournisseurs</div>
              <div className="grid grid-cols-3 gap-3">
                <input type="text" placeholder="Fournisseur principal" value={formData.fournisseurPrincipal.nom} onChange={(e) => setFormData({ ...formData, fournisseurPrincipal: { ...formData.fournisseurPrincipal, nom: e.target.value } })} className="border border-blue-200 rounded-lg px-3 py-2" />
                <input type="text" placeholder="Téléphone" value={formData.fournisseurPrincipal.tel} onChange={(e) => setFormData({ ...formData, fournisseurPrincipal: { ...formData.fournisseurPrincipal, tel: e.target.value } })} className="border border-blue-200 rounded-lg px-3 py-2" />
                <input type="email" placeholder="Email" value={formData.fournisseurPrincipal.email} onChange={(e) => setFormData({ ...formData, fournisseurPrincipal: { ...formData.fournisseurPrincipal, email: e.target.value } })} className="border border-blue-200 rounded-lg px-3 py-2" />
              </div>
              {formData.autresFournisseurs.map((f, idx) => (
                <div key={idx} className="grid grid-cols-3 gap-3 items-center">
                  <input type="text" placeholder="Nom" value={f.nom} onChange={(e) => updateAutreFournisseur(idx, "nom", e.target.value)} className="border border-blue-200 rounded-lg px-3 py-2" />
                  <input type="text" placeholder="Téléphone" value={f.tel} onChange={(e) => updateAutreFournisseur(idx, "tel", e.target.value)} className="border border-blue-200 rounded-lg px-3 py-2" />
                  <div className="flex gap-1">
                    <input type="email" placeholder="Email" value={f.email} onChange={(e) => updateAutreFournisseur(idx, "email", e.target.value)} className="flex-1 border border-blue-200 rounded-lg px-3 py-2" />
                    <button type="button" onClick={() => removeAutreFournisseur(idx)} className="p-2 text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addAutreFournisseur} className="flex items-center gap-1 text-xs text-blue-600"><Plus size={12} /> Ajouter un fournisseur</button>
            </div>

            {/* Compatibilité avec équipements */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-purple-700 mb-2">🔗 Compatible avec</div>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {equipements.filter(e => !e.archived).map((eq) => (
                  <button key={eq._id} type="button" onClick={() => toggleCompatEquip(eq._id)} className={`text-xs px-2 py-1 rounded-full border transition ${formData.compatEquips.includes(eq._id) ? "bg-purple-600 text-white border-purple-600" : "bg-white text-purple-700 border-purple-200 hover:bg-purple-100"}`}>
                    {eq.icon} {eq.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <PhotoUpload
              photoPreview={photoPreview}
              onPhotoChange={(newPhoto) => {
                setPhotoPreview(newPhoto);
                setFormData({ ...formData, photo: newPhoto });
              }}
            />

            {/* Description */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Description</label>
              <textarea rows={3} value={formData.desc} onChange={(e) => setFormData({ ...formData, desc: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2" placeholder="Détails, usage, précautions..." />
            </div>
          </div>

          <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200">Annuler</button>
            <button type="submit" disabled={isSubmitting} className="px-3 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50">
              {isSubmitting ? "Enregistrement..." : (consommable ? "Mettre à jour" : "Créer")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsoModal;