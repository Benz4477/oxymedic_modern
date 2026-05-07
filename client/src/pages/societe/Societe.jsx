import React, { useState, useEffect } from "react";
import { Save, Building2 } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../api";

const EMPTY = {
  nom: "", slogan: "", logo: "",
  adresse: "", ville: "", tel: "", tel2: "", email: "", website: "",
  adresse2: "", ville2: "", tel_mag: "", siege: "",
  ice: "", rc: "", if_fisc: "", patente: "", cnss: "",
  tva_rate: 20, validite_devis: 30, validite_proforma: 15,
  vendeur_defaut: "",
  banque: "", agence: "", rib: "", iban: "", swift: "",
  conditions_location: "",
  note_facture: "", note_proforma: "", pied_page: "",
  couleur_principale: "#16A34A",
};

// ── Composant champ texte ────────────────────────────────
const Field = ({ label, name, value, onChange, type = "text", placeholder = "", hint = "" }) => (
  <div>
    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</label>
    <input type={type} value={value || ""} onChange={(e) => onChange(name, e.target.value)}
      placeholder={placeholder}
      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none" />
    {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
  </div>
);

// ── Composant textarea ───────────────────────────────────
const TextArea = ({ label, name, value, onChange, rows = 3, placeholder = "", hint = "" }) => (
  <div>
    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</label>
    <textarea rows={rows} value={value || ""} onChange={(e) => onChange(name, e.target.value)}
      placeholder={placeholder}
      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none resize-none" />
    {hint && <p className="text-[10px] text-slate-400 mt-1">{hint}</p>}
  </div>
);

// ── Section wrapper ──────────────────────────────────────
const Section = ({ icon, title, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
    <h2 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">{icon} {title}</h2>
    {children}
  </div>
);

const Societe = () => {
  const [data, setData]       = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    api.get("/societe")
      .then(r => setData(r.data?.data || r.data || EMPTY))
      .catch(() => toast.error("Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (name, value) => setData(prev => ({ ...prev, [name]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const r = await api.put("/societe", data);
      setData(r.data?.data || r.data);
      toast.success("Informations société mises à jour ✅");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl space-y-6">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <Building2 size={22} className="text-emerald-600" /> Paramètres Société
          </h1>
          <p className="text-sm text-slate-400 mt-1">Ces informations apparaissent sur les devis, factures, bons d'enlèvement et bons de retour</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition disabled:opacity-50">
          <Save size={15} /> {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      {/* ── Identité ── */}
      <Section icon="🏢" title="Identité de la société">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Raison sociale *" name="nom"    value={data.nom}    onChange={handleChange} />
          <Field label="Slogan"           name="slogan" value={data.slogan} onChange={handleChange} placeholder="Le confort médical à domicile" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Vendeur / Agence par défaut" name="vendeur_defaut" value={data.vendeur_defaut} onChange={handleChange}
            placeholder="Ex: SHOP Casablanca" hint="Affiché sur les bons d'enlèvement et de retour" />
          <Field label="Site web" name="website" value={data.website} onChange={handleChange} placeholder="www.oxymedic.ma" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email" name="email" value={data.email} onChange={handleChange} type="email" />
          <Field label="Téléphone urgence" name="tel2" value={data.tel2} onChange={handleChange} placeholder="Ex: 0631-801-801" />
        </div>
      </Section>

      {/* ── Adresse principale (SAV) ── */}
      <Section icon="📍" title="Adresse principale — SAV / Casablanca">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Adresse" name="adresse" value={data.adresse} onChange={handleChange} placeholder="7 Rue Al Kassar Maarif" />
          <Field label="Ville"   name="ville"   value={data.ville}   onChange={handleChange} placeholder="Casablanca" />
        </div>
        <Field label="Téléphone SAV" name="tel" value={data.tel} onChange={handleChange} placeholder="0520-882-443" />
      </Section>

      {/* ── 2ème adresse (Magasin) ── */}
      <Section icon="🏪" title="2ème adresse — Magasin / Kénitra">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Adresse magasin" name="adresse2" value={data.adresse2} onChange={handleChange} placeholder="2083 Résidence Hafsa, Magasin 2, Haddada" />
          <Field label="Ville magasin"   name="ville2"   value={data.ville2}   onChange={handleChange} placeholder="Kénitra" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Téléphone magasin" name="tel_mag" value={data.tel_mag} onChange={handleChange} placeholder="0530-537-797" />
          <Field label="Siège social (pied de page)" name="siege" value={data.siege} onChange={handleChange}
            placeholder="2083 Résidence Hafsa, Magasin 2, Haddada - Kénitra 14012"
            hint="Affiché dans le pied de page des documents" />
        </div>
      </Section>

      {/* ── Identifiants légaux ── */}
      <Section icon="📋" title="Identifiants légaux">
        <div className="grid grid-cols-3 gap-4">
          <Field label="ICE"              name="ice"     value={data.ice}     onChange={handleChange} placeholder="001582339000012" />
          <Field label="RC"               name="rc"      value={data.rc}      onChange={handleChange} placeholder="350225" />
          <Field label="IF (Identifiant Fiscal)" name="if_fisc" value={data.if_fisc} onChange={handleChange} placeholder="18779961" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Patente" name="patente" value={data.patente} onChange={handleChange} placeholder="23002952" />
          <Field label="CNSS"    name="cnss"    value={data.cnss}    onChange={handleChange} />
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widests text-slate-400 mb-1">Taux TVA (%)</label>
            <input type="number" min={0} max={100} value={data.tva_rate || 20}
              onChange={(e) => handleChange("tva_rate", parseFloat(e.target.value) || 20)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widests text-slate-400 mb-1">Validité devis (jours)</label>
            <input type="number" min={1} value={data.validite_devis || 30}
              onChange={(e) => handleChange("validite_devis", parseInt(e.target.value) || 30)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widests text-slate-400 mb-1">Validité proforma (jours)</label>
            <input type="number" min={1} value={data.validite_proforma || 15}
              onChange={(e) => handleChange("validite_proforma", parseInt(e.target.value) || 15)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none" />
          </div>
        </div>
      </Section>

      {/* ── Banque ── */}
      <Section icon="🏦" title="Informations bancaires">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Banque" name="banque" value={data.banque} onChange={handleChange} placeholder="Banque Populaire" />
          <Field label="Agence" name="agence" value={data.agence} onChange={handleChange} placeholder="Agence CITE PLATEAU" />
        </div>
        <Field label="RIB" name="rib" value={data.rib} onChange={handleChange} placeholder="190 780 2121145906690006 11" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="IBAN"  name="iban"  value={data.iban}  onChange={handleChange} />
          <Field label="SWIFT" name="swift" value={data.swift} onChange={handleChange} />
        </div>
      </Section>

      {/* ── Conditions générales de location ── */}
      <Section icon="📜" title="Conditions générales de location">
        <p className="text-xs text-slate-400">Ce texte apparaît en page 2 des devis imprimés.</p>
        <TextArea
          label="Conditions générales"
          name="conditions_location"
          value={data.conditions_location}
          onChange={handleChange}
          rows={15}
          placeholder="Les présentes conditions générales de location..."
        />
      </Section>

      {/* ── Documents ── */}
      <Section icon="📄" title="Textes des documents">
        <TextArea label="Note facture"   name="note_facture"   value={data.note_facture}   onChange={handleChange} rows={2} placeholder="Paiement sous 30 jours..." />
        <TextArea label="Note proforma"  name="note_proforma"  value={data.note_proforma}  onChange={handleChange} rows={2} placeholder="Cette proforma est valable 15 jours..." />
        <Field    label="Pied de page"   name="pied_page"      value={data.pied_page}      onChange={handleChange} placeholder="Merci de votre confiance — OXYMEDIC" />
      </Section>

      {/* ── Logo + Couleur ── */}
      <Section icon="🖼️" title="Logo & Apparence">
        <Field label="URL du logo" name="logo" value={data.logo} onChange={handleChange}
          placeholder="https://... ou /Logo1.png"
          hint="URL publique ou chemin local vers le logo" />
        {data.logo && (
          <div className="flex items-center gap-4">
            <img src={data.logo} alt="logo" className="h-16 object-contain border border-slate-200 rounded-xl p-2"
              onError={(e) => e.target.style.display = "none"} />
            <span className="text-xs text-slate-400">Aperçu du logo</span>
          </div>
        )}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widests text-slate-400 mb-1">Couleur principale</label>
          <div className="flex items-center gap-3">
            <input type="color" value={data.couleur_principale || "#16A34A"}
              onChange={(e) => handleChange("couleur_principale", e.target.value)}
              className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer" />
            <span className="text-sm font-mono text-slate-600">{data.couleur_principale}</span>
          </div>
        </div>
      </Section>

      {/* Save bottom */}
      <div className="flex justify-end pb-6">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 shadow-lg shadow-emerald-200">
          <Save size={15} /> {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </div>

    </div>
  );
};

export default Societe;