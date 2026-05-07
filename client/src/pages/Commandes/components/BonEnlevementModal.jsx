import { useRef, useState } from "react";

// ─── helpers ────────────────────────────────────────────────────────────────
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString("fr-FR") : "—";

const printStyles = `
@media print {
  body * { visibility: hidden !important; }
  #bon-enlevement-print, #bon-enlevement-print * { visibility: visible !important; }
  #bon-enlevement-print { position: fixed; inset: 0; background: #fff; z-index: 99999; }
  @page { size: A4; margin: 10mm; }
}
`;

// ─── sub-components ─────────────────────────────────────────────────────────

function PageHeader({ societe }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
      {/* Logo gauche */}
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
      {/* Site web droite */}
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

// ─── Page 1 : Document principal ────────────────────────────────────────────
function Page1({ commande, societe, livreur }) {
  const c = commande?.client || {};
  const eq = commande?.equipement || {};
  const u = commande?.unite || {};

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#111", background: "#fff", padding: "16px 20px", minHeight: "270mm", boxSizing: "border-box" }}>
      <PageHeader societe={societe} />

      {/* Titre */}
      <div style={{ textAlign: "center", margin: "10px 0 14px" }}>
        <span style={{
          fontSize: 17, fontWeight: 700, color: "#16a34a",
          borderBottom: "2px solid #16a34a", paddingBottom: 2, letterSpacing: 1
        }}>BON D'ENLÈVEMENT — {commande?.ref || ""}</span>
      </div>

      {/* Client (aligné droite) */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <div style={{ border: "1px solid #d1d5db", borderRadius: 6, padding: "8px 14px", minWidth: 220, textAlign: "right" }}>
          <div style={{ fontWeight: 700, color: "#166534", marginBottom: 2 }}>Client</div>
          <div style={{ fontWeight: 600 }}>{c.prenom} {c.nom}</div>
          {c.adresse && <div style={{ color: "#555" }}>{c.adresse}</div>}
          {c.quartier && <div style={{ color: "#555" }}>{c.quartier}</div>}
          <div style={{ color: "#555" }}>Maroc</div>
          {c.tel && <div style={{ color: "#555" }}>Tél : {c.tel}</div>}
        </div>
      </div>

      {/* Dates commande */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12, fontSize: 10.5 }}>
        <div><span style={{ color: "#6b7280" }}>Date enlèvement :</span> <b>{fmt(commande?.dateDebut)}</b></div>
        <div><span style={{ color: "#6b7280" }}>Retour prévu :</span> <b>{fmt(commande?.dateFin)}</b></div>
        {commande?.vendeur && <div><span style={{ color: "#6b7280" }}>Vendeur :</span> <b>{commande.vendeur}</b></div>}
      </div>

      {/* Tableau produits */}
      <SectionDivider label="Détail du matériel" />
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5, marginBottom: 14 }}>
        <thead>
          <tr style={{ background: "#f0fdf4" }}>
            {["Réf.", "Description", "Code-barres", "Date enlèvement", "Retour prévu", "Qté"].map(h => (
              <th key={h} style={{ border: "1px solid #d1d5db", padding: "5px 7px", textAlign: "center", color: "#166534", fontWeight: 700 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #d1d5db", padding: "6px 8px", textAlign: "center" }}>{eq.ref || "—"}</td>
            <td style={{ border: "1px solid #d1d5db", padding: "6px 8px" }}>{eq.name || "—"}</td>
            <td style={{ border: "1px solid #d1d5db", padding: "6px 8px", textAlign: "center", fontFamily: "monospace", fontSize: 10 }}>{u.barcode || u.serial || "—"}</td>
            <td style={{ border: "1px solid #d1d5db", padding: "6px 8px", textAlign: "center" }}>{fmt(commande?.dateDebut)}</td>
            <td style={{ border: "1px solid #d1d5db", padding: "6px 8px", textAlign: "center" }}>{fmt(commande?.dateFin)}</td>
            <td style={{ border: "1px solid #d1d5db", padding: "6px 8px", textAlign: "center" }}>{commande?.qte || 1}</td>
          </tr>
          {/* ligne vide pour lisibilité */}
          <tr><td colSpan={6} style={{ border: "1px solid #d1d5db", height: 22 }}></td></tr>
        </tbody>
      </table>

      {/* Coordonnées livreur */}
      <SectionDivider label="Coordonnées du livreur" />
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginBottom: 16 }}>
        <tbody>
          <tr>
            <td style={{ border: "1px solid #d1d5db", padding: "7px 10px", width: "33%", color: "#555" }}>Nom du livreur</td>
            <td style={{ border: "1px solid #d1d5db", padding: "7px 10px", fontWeight: 600 }}>{livreur?.nom || ""}</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #d1d5db", padding: "7px 10px", color: "#555" }}>Véhicule</td>
            <td style={{ border: "1px solid #d1d5db", padding: "7px 10px", fontWeight: 600 }}>{livreur?.vehicule || ""}</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid #d1d5db", padding: "7px 10px", color: "#555" }}>Matricule</td>
            <td style={{ border: "1px solid #d1d5db", padding: "7px 10px", fontWeight: 600 }}>{livreur?.matricule || ""}</td>
          </tr>
        </tbody>
      </table>

      {/* Signatures */}
      <div style={{ display: "flex", gap: 20, marginTop: 18 }}>
        <div style={{ flex: 1, border: "1px solid #d1d5db", borderRadius: 6, padding: "12px 14px", textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 10.5, color: "#166534", marginBottom: 24 }}>Propriétaire OXYMEDIC</div>
          <div style={{ borderTop: "1px dashed #9ca3af", paddingTop: 4, fontSize: 9, color: "#6b7280" }}>Signature & cachet</div>
        </div>
        <div style={{ flex: 1, border: "1px solid #d1d5db", borderRadius: 6, padding: "12px 14px", textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 10.5, color: "#166534", marginBottom: 24 }}>Le livreur</div>
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

// ─── Page 2 : Photos produits ────────────────────────────────────────────────
function Page2({ commande, societe }) {
  const eq = commande?.equipement || {};
  const hasPhoto = eq.photo || eq.icon;

  return (
    <div style={{
      fontFamily: "Arial, sans-serif", fontSize: 11, color: "#111",
      background: "#fff", padding: "16px 20px", minHeight: "200mm",
      boxSizing: "border-box", pageBreakBefore: "always"
    }}>
      <PageHeader societe={societe} />

      <div style={{ textAlign: "center", margin: "10px 0 14px" }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#16a34a", borderBottom: "2px solid #16a34a", paddingBottom: 2 }}>
          PHOTOS DU MATÉRIEL — {commande?.ref || ""}
        </span>
      </div>

      <SectionDivider label="État visuel à l'enlèvement" />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 10 }}>
        {/* Photo principale */}
        <div style={{ border: "1px solid #d1d5db", borderRadius: 8, padding: 10, textAlign: "center", minWidth: 180 }}>
          {hasPhoto ? (
            <img src={eq.photo || eq.icon} alt={eq.name} style={{ width: 160, height: 140, objectFit: "contain" }} />
          ) : (
            <div style={{ width: 160, height: 140, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: 28 }}>📷</div>
          )}
          <div style={{ marginTop: 6, fontWeight: 600, fontSize: 10.5 }}>{eq.name || "Équipement"}</div>
          <div style={{ fontSize: 9.5, color: "#6b7280" }}>Réf. {eq.ref || "—"}</div>
        </div>

        {/* Cases vides pour photos supplémentaires terrain */}
        {[1, 2, 3].map(i => (
          <div key={i} style={{ border: "1px dashed #d1d5db", borderRadius: 8, padding: 10, textAlign: "center", minWidth: 180 }}>
            <div style={{ width: 160, height: 140, background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d5db", fontSize: 28 }}>📷</div>
            <div style={{ marginTop: 6, fontSize: 9.5, color: "#9ca3af" }}>Photo {i + 1}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        <SectionDivider label="Observations visuelles" />
        {[1, 2, 3].map(i => (
          <div key={i} style={{ borderBottom: "1px dotted #9ca3af", marginBottom: 14, height: 18 }}></div>
        ))}
      </div>

      <PageFooter societe={societe} />
    </div>
  );
}

// ─── Modal principal ─────────────────────────────────────────────────────────
export default function BonEnlevementModal({ commande, societe, onClose }) {
  const printRef = useRef();
  const [livreur, setLivreur] = useState({ nom: "", vehicule: "", matricule: "" });
  const [step, setStep] = useState("form"); // "form" | "preview"

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
      {/* Formulaire livreur */}
      {step === "form" && (
        <div style={{
          background: "#fff", borderRadius: 12, padding: 28, width: 420,
          boxShadow: "0 8px 40px rgba(0,0,0,0.25)"
        }}>
          <h3 style={{ margin: "0 0 18px", color: "#166534", fontSize: 16 }}>📦 Bon d'enlèvement — Informations livreur</h3>
          <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 18px" }}>
            Commande <b>{commande.ref}</b> — Client : <b>{commande.client?.prenom} {commande.client?.nom}</b>
          </p>

          {[
            { key: "nom", label: "Nom du livreur", placeholder: "Ex: Mohamed Alami" },
            { key: "vehicule", label: "Véhicule", placeholder: "Ex: Renault Kangoo Blanc" },
            { key: "matricule", label: "Matricule", placeholder: "Ex: 12345-A-6" },
          ].map(({ key, label, placeholder }) => (
            <div key={key} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>{label}</label>
              <input
                value={livreur[key]}
                onChange={e => setLivreur(p => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                style={{
                  width: "100%", padding: "8px 10px", border: "1px solid #d1d5db",
                  borderRadius: 6, fontSize: 13, boxSizing: "border-box",
                  outline: "none"
                }}
              />
            </div>
          ))}

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: "9px 0", border: "1px solid #d1d5db",
              borderRadius: 6, background: "#fff", color: "#374151", cursor: "pointer", fontSize: 13
            }}>Annuler</button>
            <button onClick={() => setStep("preview")} style={{
              flex: 2, padding: "9px 0", border: "none",
              borderRadius: 6, background: "#16a34a", color: "#fff",
              cursor: "pointer", fontWeight: 700, fontSize: 13
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
            <div style={{ fontWeight: 700, color: "#166534", fontSize: 15 }}>📦 Bon d'enlèvement — {commande.ref}</div>
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

          {/* Preview scroll */}
          <div id="bon-enlevement-print" ref={printRef} style={{ overflowY: "auto", padding: 16, flex: 1 }}>
            {/* Page 1 */}
            <div style={{ background: "#fff", borderRadius: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: 16 }}>
              <Page1 commande={commande} societe={societe} livreur={livreur} />
            </div>
            {/* Page 2 */}
            <div style={{ background: "#fff", borderRadius: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <Page2 commande={commande} societe={societe} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}