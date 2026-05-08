import React, { useRef, useState, useEffect } from "react";
import { X, Printer, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../../api";

const fmtD = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "—";

const BonRetourModal = ({ isOpen, onClose, commande, societe = {}, onSaved }) => {
  const printRef = useRef();
  const [logoError, setLogoError] = useState(false);

  // Vérifier si un bon de retour existe déjà
  const existingBonRetour = commande?.bonRetour || {};
  const hasExistingBon = existingBonRetour && existingBonRetour.date;

  // Infos récupérateur
  const [recuperateur, setRecuperateur] = useState(existingBonRetour.recuperateur || "");
  const [vehicule, setVehicule]         = useState(existingBonRetour.vehicule || "");
  const [matricule, setMatricule]       = useState(existingBonRetour.matricule || "");
  const [etat, setEtat]                 = useState(existingBonRetour.etat || "");
  const [observation, setObservation]   = useState(existingBonRetour.observation || "");
  const [step, setStep]                 = useState(hasExistingBon ? 2 : 1);
  const [saving, setSaving]             = useState(false);

  // Pré-remplir si bon déjà enregistré
  useEffect(() => {
    if (!isOpen || !commande) return;
    const bon = commande.bonRetour;
    if (bon?.recuperateur) {
      setRecuperateur(bon.recuperateur);
      setVehicule(bon.vehicule || "");
      setMatricule(bon.matricule || "");
      setEtat(bon.etat || "");
      setObservation(bon.observation || "");
      setStep(2);
    } else {
      setRecuperateur(""); setVehicule(""); setMatricule(""); setEtat(""); setObservation("");
      setStep(1);
    }
  }, [isOpen, commande]);

  if (!isOpen || !commande) return null;

  const soc    = societe;
  const nomSoc = soc.nom  || "OXYMEDIC";
  const logo   = soc.logo || "/Logo1.png";

  const client    = commande.client || {};
  const clientNom = `${client.prenom || ""} ${client.nom || ""}`.trim() || "—";
  const clientAdr = client.adresse || "";
  const clientTel = client.tel || "";

  const equip    = commande.equipement || {};
  const equipNom = equip.name || "Équipement";
  const equipRef = equip.ref  || equip.reference || "—";

  const unite   = commande.unite || {};
  const serial  = typeof unite === "object" ? (unite.serial || "") : "";
  const ref     = commande.reference || "—";

  const dateEnl = fmtD(commande.dateDebut);
  const dateRet = fmtD(commande.dateFin);

  const piedLigne1 = [
    soc.adresse  && soc.tel     ? `Casablanca (SAV): ${soc.adresse} / Tél: ${soc.tel}` : null,
    soc.adresse2 && soc.tel_mag ? `${soc.ville2 || "Kénitra"} (MAG): ${soc.adresse2} / Tél: ${soc.tel_mag}` : null,
  ].filter(Boolean).join(" I ");

  const piedLigne2 = [
    soc.siege ? `Siège: ${soc.siege}` : null, soc.rc ? `RC: ${soc.rc}` : null,
    soc.ice ? `ICE: ${soc.ice}` : null, soc.if_fisc ? `IF: ${soc.if_fisc}` : null,
    soc.patente ? `Patente: ${soc.patente}` : null,
  ].filter(Boolean).join(" I ");

  const s = {
    th:   { padding: "14px 18px", textAlign: "left", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em", color: "#9CA3AF", background: "#F9FAFB", border: "1px solid #E5E7EB" },
    td:   { padding: "16px 18px", fontSize: 14, border: "1px solid #E5E7EB", verticalAlign: "middle" },
    mono: { fontFamily: "monospace" },
  };

  const handleSaveAndPreview = async () => {
    setSaving(true);
    try {
      await api.put(`/commandes/${commande._id}/bon-retour`, { recuperateur, vehicule, matricule, etat, observation });
      toast.success("Bon de retour enregistré ✅");
      if (onSaved) onSaved();
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally { setSaving(false); }
  };

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank", "width=850,height=900");
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Bon de retour ${ref}</title>
      <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',Arial,sans-serif;background:white;color:#111;padding:20px;}
      @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact;padding:10px;}}</style>
      </head><body>${content}</body></html>`);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); win.close(); }, 400);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <h3 className="text-sm font-extrabold text-slate-900">
            🔄 Bon de retour — {ref}
            {hasExistingBon && <span className="text-xs text-emerald-600 ml-2">(Enregistré)</span>}
          </h3>
          <div className="flex items-center gap-2">
            {step === 2 && (
              <>
                <button onClick={() => setStep(1)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200 transition">
                  <ArrowLeft size={12} /> Modifier
                </button>
                <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition">
                  <Printer size={12} /> Imprimer
                </button>
              </>
            )}
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"><X size={14} /></button>
          </div>
        </div>

        {/* Étape 1 — saisie récupérateur */}
        {step === 1 && (
          <div className="p-5 space-y-4">
            <p className="text-xs text-slate-500">Renseignez les informations du récupérateur et l'état du matériel. Les données seront enregistrées.</p>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Récupérateur *</label>
              <input type="text" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={recuperateur} onChange={e => setRecuperateur(e.target.value)} placeholder="Nom du récupérateur" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Véhicule</label>
                <input type="text" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={vehicule} onChange={e => setVehicule(e.target.value)} placeholder="ex: Fiat Ducato L3 H3" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Matricule</label>
                <input type="text" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={matricule} onChange={e => setMatricule(e.target.value)} placeholder="ex: 98238-E-6" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">État du matériel retourné</label>
              <div className="grid grid-cols-2 gap-2">
                {[["bonne", "Bonne"], ["normale", "Normale"], ["endommagee", "Endommagée"], ["incomplet", "Incomplet"]].map(([val, label]) => (
                  <button key={val} type="button" onClick={() => setEtat(etat === val ? "" : val)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition ${etat === val ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${etat === val ? "border-emerald-500 bg-emerald-500" : "border-slate-300"}`}>
                      {etat === val && <span className="text-white text-xs">✓</span>}
                    </div>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Observation</label>
              <textarea rows={3} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-emerald-400 outline-none"
                value={observation} onChange={e => setObservation(e.target.value)} placeholder="Observations sur l'état du matériel..." />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={onClose} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">Annuler</button>
              <button onClick={handleSaveAndPreview} disabled={saving || !recuperateur.trim()}
                className="px-4 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50">
                {saving ? "Enregistrement..." : "Enregistrer & Aperçu →"}
              </button>
            </div>
          </div>
        )}

        {/* Étape 2 — aperçu PDF */}
        {step === 2 && (
          <div className="overflow-y-auto flex-1 p-5">
            <div ref={printRef} style={{ fontFamily: "'Segoe UI',Arial,sans-serif", maxWidth: 680, margin: "0 auto", color: "#111" }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ width: 160, height: 80, display: "flex", alignItems: "center" }}>
                  {!logoError ? <img src={logo} alt="logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onError={() => setLogoError(true)} />
                    : <span style={{ fontSize: 22, fontWeight: 700, color: "#15803D" }}>{nomSoc}</span>}
                </div>
                {soc.website && <div style={{ fontSize: 10, color: "#9CA3AF" }}>{soc.website}</div>}
              </div>

              <div style={{ textAlign: "right", marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>{clientNom}</div>
                {clientAdr && <div style={{ fontSize: 13, color: "#6B7280" }}>{clientAdr}</div>}
                {clientTel && <div style={{ fontSize: 13, color: "#6B7280" }}>📞 {clientTel}</div>}
                <div style={{ fontSize: 13, color: "#6B7280" }}>Maroc</div>
              </div>

              <div style={{ marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#16A34A" }}>Bon de retour # {ref}</div>
                {soc.vendeur_defaut && <div style={{ fontSize: 14, color: "#374151", marginTop: 4 }}><strong>Vendeur : </strong>{soc.vendeur_defaut}</div>}
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
                <thead>
                  <tr>
                    <th style={s.th}>Réf</th>
                    <th style={s.th}>Description</th>
                    <th style={{ ...s.th, textAlign: "center" }}>Date d'enlèvement</th>
                    <th style={{ ...s.th, textAlign: "center" }}>Retour attendu</th>
                    <th style={{ ...s.th, textAlign: "center" }}>Enlevé</th>
                    <th style={{ ...s.th, textAlign: "center" }}>Retourné</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ ...s.td, ...s.mono, color: "#6B7280", fontSize: 12 }}>{equipRef}</td>
                    <td style={s.td}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{equipNom}</div>
                      {serial && <div style={{ fontSize: 11, ...s.mono, color: "#7C3AED", marginTop: 2 }}>{serial}</div>}
                    </td>
                    <td style={{ ...s.td, textAlign: "center", fontSize: 13 }}>{dateEnl}</td>
                    <td style={{ ...s.td, textAlign: "center", fontSize: 13 }}>{dateRet}</td>
                    <td style={{ ...s.td, textAlign: "center", fontSize: 13 }}>1,00</td>
                    <td style={{ ...s.td, textAlign: "center", fontSize: 13 }}>1,0</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: "12px 16px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "#9CA3AF", marginBottom: 8 }}>Coordonnées du récupérateur</div>
                  {[["Récupérateur", recuperateur], ["Véhicule", vehicule], ["Matricule", matricule]].map(([l, v]) => (
                    <div key={l} style={{ display: "flex", borderBottom: "1px solid #F3F4F6", padding: "5px 0" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#374151", width: 100, flexShrink: 0 }}>{l}</span>
                      <span style={{ fontSize: 11, color: "#111" }}>{v || "—"}</span>
                    </div>
                  ))}
                </div>
                <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: "12px 16px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "#9CA3AF", marginBottom: 8 }}>État du matériel retourné</div>
                  {[["bonne", "Bonne"], ["normale", "Normale"], ["endommagee", "Endommagée"], ["incomplet", "Incomplet"]].map(([val, label]) => (
                    <div key={val} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ width: 14, height: 14, border: `1.5px solid ${etat === val ? "#16A34A" : "#374151"}`, borderRadius: 3, marginRight: 8, background: etat === val ? "#16A34A" : "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {etat === val && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 12, color: "#374151" }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: "16px 20px", marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "#9CA3AF", marginBottom: 8 }}>Observation</div>
                {observation
                  ? <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.5 }}>{observation}</div>
                  : <div>{[1, 2, 3, 4].map((i) => <div key={i} style={{ borderBottom: "1px dashed #D1D5DB", height: 26 }} />)}</div>}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, marginBottom: 24 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Signature du récupérateur</div>
                  <div style={{ marginBottom: 48 }}>&nbsp;</div>
                  <div style={{ borderTop: "1px solid #9CA3AF", paddingTop: 4, fontSize: 11, color: "#9CA3AF" }}>Signature</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Signature du client</div>
                  <div style={{ marginBottom: 48 }}>&nbsp;</div>
                  <div style={{ borderTop: "1px solid #9CA3AF", paddingTop: 4, fontSize: 11, color: "#9CA3AF" }}>Signature</div>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 10 }}>
                {piedLigne1 && <div style={{ fontSize: 9.5, color: "#6B7280", textAlign: "center", marginBottom: 3 }}>{piedLigne1}</div>}
                {piedLigne2 && <div style={{ fontSize: 9.5, color: "#6B7280", textAlign: "center", marginBottom: 3 }}>{piedLigne2}</div>}
                {soc.email  && <div style={{ fontSize: 9.5, color: "#6B7280", textAlign: "center" }}>E-mail: {soc.email}</div>}
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BonRetourModal;