import { useRef, useState } from "react";

// ─── helpers ────────────────────────────────────────────────────────────────
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("fr-FR") : "—";

const printStyles = `
@media print {
  body * { visibility: hidden !important; }
  #bon-retour-print, #bon-retour-print * { visibility: visible !important; }
  #bon-retour-print { position: fixed; inset: 0; background: #fff; z-index: 99999; }
  @page { size: A4; margin: 10mm; }
}
`;

const ETATS = ["Bonne", "Normale", "Endommagée", "Incomplet"];

// ─── sub-components ─────────────────────────────────────────────────────────
function PageHeader({ societe }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {societe?.logo ? (
          <img src={societe.logo} alt="logo" style={{ height: 64, objectFit: "contain" }} />
        ) : (
          <div style={{
            width: 80, height: 64, background: "#16a34a", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: 1
          }}>OXYMEDIC</div>
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#166534" }}>{societe?.nom || "OXYMEDIC"}</div>
          <div style={{ fontSize: 10, color: "#555" }}>{societe?.adresse || ""}</div>
          <div style={{ fontSize: 10, color: "#555" }}>{societe?.tel || ""}</div>
        </div>
      </div>
      <div style={{ textAlign: "right", fontSize: 10, color: "#555" }}>
        <div style={{ fontWeight: 600, color: "#166534" }}>{societe?.email || ""}</div>
        <div>{societe?.site || ""}</div>
        <div>RC : {societe?.rc || "—"} | ICE : {societe?.ice || "—"}</div>
        <div>IF : {societe?.if_fiscal || "—"} | Patente : {societe?.patente || "—"}</div>
      </div>
    </div>
  );
}

function SectionDivider({ label }) {
  return (
    <div style={{
      background: "#16a34a", color: "#fff", fontWeight: 700,
      fontSize: 11, padding: "3px 10px", borderRadius: 4, marginBottom: 8, letterSpacing: 0.5
    }}>{label}</div>
  );
}

function PageFooter({ societe }) {
  return (
    <div style={{
      borderTop: "1px solid #d1d5db", marginTop: 18, paddingTop: 6,
      fontSize: 8.5, color: "#6b7280", textAlign: "center", lineHeight: 1.6
    }}>
      <div>
        Casablanca (SAV) : {societe?.tel || "—"} &nbsp;|&nbsp; Kénitra (MAG) : {societe?.tel_mag || "—"}
      </div>
      <div>
        Siège : {societe?.siege || societe?.adresse || "—"} &nbsp;|&nbsp;
        RC : {societe?.rc || "—"} &nbsp;|&nbsp; ICE : {societe?.ice || "—"} &nbsp;|&nbsp;
        IF : {societe?.if_fiscal || "—"} &nbsp;|&nbsp; Patente : {societe?.patente || "—"}
      </div>
      <div>{societe?.email || ""}</div>
    </div>
  );
}

// ─── Document bon de retour (1 page) ─────────────────────────────────────────
function BonRetourDoc({ commande, societe, recuperateur, etatSelected, observation }) {
  const c = commande?.client || {};
  const eq = commande?.equipement || {};
  const u = commande?.unite || {};
  const today = new Date().toLocaleDateString("fr-FR");

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#111", background: "#fff", padding: "16px 20px", minHeight: "270mm", boxSizing: "border-box" }}>
      <PageHeader societe={societe} />

      {/* Titre */}
      <div style={{ textAlign: "center", margin: "10px 0 14px" }}>
        <span style={{
          fontSize: 17, fontWeight: 700, color: "#16a34a",
          borderBottom: "2px solid #16a34a", paddingBottom: 2, letterSpacing: 1
        }}>BON DE RETOUR — {commande?.ref || ""}</span>
      </div>

      {/* Infos dates + client */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ fontSize: 10.5 }}>
          <div><span style={{ color: "#6b7280" }}>Date de retour :</span> <b>{today}</b></div>
          <div><span style={{ color: "#6b7280" }}>Date d'enlèvement :</span> <b>{fmt(commande?.dateDebut)}</b></div>
          <div><span style={{ color: "#6b7280" }}>Retour attendu :</span> <b>{fmt(commande?.dateFin)}</b></div>
        </div>
        <div style={{ border: "1px solid #d1d5db", borderRadius: 6, padding: "8px 14px", minWidth: 220, textAlign: "right" }}>
          <div style={{ fontWeight: 700, color: "#166534", marginBottom: 2 }}>Client</div>
          <div style={{ fontWeight: 600 }}>{c.prenom} {c.nom}</div>
          {c.adresse && <div style={{ color: "#555" }}>{c.adresse}</div>}
          {c.quartier && <div style={{ color: "#555" }}>{c.quartier}</div>}
          <div style={{ color: "#555" }}>Maroc</div>
          {c.tel && <div style={{ color: "#555" }}>Tél : {c.tel}</div>}
        </div>
      </div>

      {/* Tableau produits */}
      <SectionDivider label="Détail du matériel retourné" />
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5, marginBottom: 14 }}>
        <thead>
          <tr style={{ background: "#f0fdf4" }}>
            {["Réf.", "Description", "Date enlèvement", "Retour attendu", "Qté enlevée", "Qté retournée"].map(h => (
              <th key={h} style={{ border: "1px solid #d1d5db", padding: "5px 7px", textAlign: "center", color: "#166534", fontWeight: 700 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #d1d5db", padding: "6px 8px", textAlign: "center" }}>{eq.ref || "—"}</td>
            <td style={{ border: "1px solid #d1d5db", padding: "6px 8px" }}>{eq.name || "—"}</td>
            <td style={{ border: "1px solid #d1d5db", padding: "6px 8px", textAlign: "center" }}>{fmt(commande?.dateDebut)}</td>
            <td style={{ border: "1px solid #d1d5db", padding: "6px 8px", textAlign: "center" }}>{fmt(commande?.dateFin)}</td>
            <td style={{ border: "1px solid #d1d5db", padding: "6px 8px", textAlign: "center" }}>{commande?.qte || 1}</td>
            <td style={{ border: "1px solid #d1d5db", padding: "6px 8px", textAlign: "center" }}>{commande?.qte || 1}</td>
          </tr>
          <tr><td colSpan={6} style={{ border: "1px solid #d1d5db", height: 20 }}></td></tr>
        </tbody>
      </table>

      {/* Coordonnées récupérateur */}
      <SectionDivider label="Coordonnées du récupérateur" />
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginBottom: 14 }}>
        <tbody>
          {[
            ["Nom du récupérateur", recuperateur?.nom],
            ["Véhicule", recuperateur?.vehicule],
            ["Matricule", recuperateur?.matricule],
          ].map(([label, val]) => (
            <tr key={label}>
              <td style={{ border: "1px solid #d1d5db", padding: "7px 10px", width: "33%", color: "#555" }}>{label}</td>
              <td style={{ border: "1px solid #d1d5db", padding: "7px 10px", fontWeight: 600 }}>{val || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* État du matériel */}
      <SectionDivider label="État du matériel à la réception" />
      <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
        {ETATS.map(e => (
          <label key={e} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 11 }}>
            <span style={{
              display: "inline-block", width: 14, height: 14,
              border: "1.5px solid #16a34a", borderRadius: 3,
              background: etatSelected === e ? "#16a34a" : "#fff",
              flexShrink: 0
            }}>
              {etatSelected === e && (
                <span style={{ color: "#fff", fontSize: 10, lineHeight: "14px", display: "block", textAlign: "center" }}>✓</span>
              )}
            </span>
            {e}
          </label>
        ))}
      </div>

      {/* Observation */}
      <SectionDivider label="Observations" />
      <div style={{ marginBottom: 14 }}>
        {observation ? (
          <div style={{ fontSize: 11, color: "#374151", padding: "4px 0" }}>{observation}</div>
        ) : null}
        {[1, 2, 3].map(i => (
          <div key={i} style={{ borderBottom: "1px dotted #9ca3af", marginBottom: 14, height: 18 }}></div>
        ))}
      </div>

      {/* Signatures */}
      <div style={{ display: "flex", gap: 20, marginTop: 18 }}>
        <div style={{ flex: 1, border: "1px solid #d1d5db", borderRadius: 6, padding: "12px 14px", textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 10.5, color: "#166534", marginBottom: 24 }}>Propriétaire OXYMEDIC</div>
          <div style={{ borderTop: "1px dashed #9ca3af", paddingTop: 4, fontSize: 9, color: "#6b7280" }}>Signature & cachet</div>
        </div>
        <div style={{ flex: 1, border: "1px solid #d1d5db", borderRadius: 6, padding: "12px 14px", textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 10.5, color: "#166534", marginBottom: 24 }}>Le récupérateur</div>
          <div style={{ borderTop: "1px dashed #9ca3af", paddingTop: 4, fontSize: 9, color: "#6b7280" }}>Signature</div>
        </div>
        <div style={{ flex: 1, border: "1px solid #d1d5db", borderRadius: 6, padding: "12px 14px", textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 10.5, color: "#166534", marginBottom: 24 }}>Le locataire</div>
          <div style={{ borderTop: "1px dashed #9ca3af", paddingTop: 4, fontSize: 9, color: "#6b7280" }}>Signature</div>
        </div>
      </div>

      <PageFooter societe={societe} />
    </div>
  );
}

// ─── Modal principal ─────────────────────────────────────────────────────────
export default function BonRetourModal({ commande, societe, onClose }) {
  const printRef = useRef();
  const [recuperateur, setRecuperateur] = useState({ nom: "", vehicule: "", matricule: "" });
  const [etatSelected, setEtatSelected] = useState("");
  const [observation, setObservation] = useState("");
  const [step, setStep] = useState("form");

  const handlePrint = () => {
    const style = document.createElement("style");
    style.innerHTML = printStyles;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => document.head.removeChild(style), 2000);
  };

  if (!commande) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
      zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      {/* Formulaire récupérateur */}
      {step === "form" && (
        <div style={{
          background: "#fff", borderRadius: 12, padding: 28, width: 440,
          boxShadow: "0 8px 40px rgba(0,0,0,0.25)"
        }}>
          <h3 style={{ margin: "0 0 18px", color: "#166534", fontSize: 16 }}>🔄 Bon de retour — Informations récupérateur</h3>
          <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 16px" }}>
            Commande <b>{commande.ref}</b> — Client : <b>{commande.client?.prenom} {commande.client?.nom}</b>
          </p>

          {[
            { key: "nom", label: "Nom du récupérateur", placeholder: "Ex: Youssef Bennani" },
            { key: "vehicule", label: "Véhicule", placeholder: "Ex: Citroën Berlingo Gris" },
            { key: "matricule", label: "Matricule", placeholder: "Ex: 78901-B-5" },
          ].map(({ key, label, placeholder }) => (
            <div key={key} style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>{label}</label>
              <input
                value={recuperateur[key]}
                onChange={e => setRecuperateur(p => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                style={{
                  width: "100%", padding: "8px 10px", border: "1px solid #d1d5db",
                  borderRadius: 6, fontSize: 13, boxSizing: "border-box"
                }}
              />
            </div>
          ))}

          {/* État */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>État du matériel</label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {ETATS.map(e => (
                <button
                  key={e}
                  onClick={() => setEtatSelected(e)}
                  style={{
                    padding: "6px 12px", border: `1.5px solid ${etatSelected === e ? "#16a34a" : "#d1d5db"}`,
                    borderRadius: 6, background: etatSelected === e ? "#f0fdf4" : "#fff",
                    color: etatSelected === e ? "#166534" : "#374151",
                    cursor: "pointer", fontSize: 12, fontWeight: etatSelected === e ? 700 : 400
                  }}
                >{e}</button>
              ))}
            </div>
          </div>

          {/* Observation */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Observation (optionnel)</label>
            <textarea
              value={observation}
              onChange={e => setObservation(e.target.value)}
              placeholder="Ex: Légère rayure sur le côté droit..."
              rows={3}
              style={{
                width: "100%", padding: "8px 10px", border: "1px solid #d1d5db",
                borderRadius: 6, fontSize: 12, boxSizing: "border-box", resize: "vertical"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: "9px 0", border: "1px solid #d1d5db",
              borderRadius: 6, background: "#fff", color: "#374151", cursor: "pointer", fontSize: 13
            }}>Annuler</button>
            <button onClick={() => setStep("preview")} style={{
              flex: 2, padding: "9px 0", border: "none", borderRadius: 6,
              background: "#16a34a", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13
            }}>Prévisualiser →</button>
          </div>
        </div>
      )}

      {/* Prévisualisation */}
      {step === "preview" && (
        <div style={{
          background: "#f3f4f6", borderRadius: 12, width: "90vw", maxWidth: 820,
          maxHeight: "92vh", display: "flex", flexDirection: "column",
          boxShadow: "0 8px 40px rgba(0,0,0,0.3)"
        }}>
          {/* Toolbar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 18px", background: "#fff", borderRadius: "12px 12px 0 0",
            borderBottom: "1px solid #e5e7eb"
          }}>
            <div style={{ fontWeight: 700, color: "#166534", fontSize: 15 }}>🔄 Bon de retour — {commande.ref}</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setStep("form")} style={{
                padding: "7px 14px", border: "1px solid #d1d5db", borderRadius: 6,
                background: "#fff", cursor: "pointer", fontSize: 12
              }}>← Modifier</button>
              <button onClick={handlePrint} style={{
                padding: "7px 16px", border: "none", borderRadius: 6,
                background: "#16a34a", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 12
              }}>🖨️ Imprimer</button>
              <button onClick={onClose} style={{
                padding: "7px 12px", border: "1px solid #d1d5db", borderRadius: 6,
                background: "#fff", cursor: "pointer", fontSize: 12, color: "#ef4444"
              }}>✕</button>
            </div>
          </div>

          {/* Preview */}
          <div id="bon-retour-print" ref={printRef} style={{ overflowY: "auto", padding: 16, flex: 1 }}>
            <div style={{ background: "#fff", borderRadius: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <BonRetourDoc
                commande={commande}
                societe={societe}
                recuperateur={recuperateur}
                etatSelected={etatSelected}
                observation={observation}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}