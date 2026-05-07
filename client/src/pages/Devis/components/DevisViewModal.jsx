import React, { useRef, useState } from "react";
import { X, Printer, Send, Check, ArrowRight, Clock, AlertCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";

const fmtMad  = (n) => `${(n || 0).toLocaleString("fr-FR")} MAD`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "—";

const DevisViewModal = ({ isOpen, onClose, devis, societe = {}, onSend, onAccept, onReject, onConvert }) => {
  const printRef = useRef();
  const [logoError, setLogoError] = useState(false);

  if (!isOpen || !devis) return null;

  const soc    = societe;
  const nomSoc = soc.nom  || "OXYMEDIC";
  const logo   = soc.logo || "/Logo1.png";

  const clientNom   = devis.clientNom || (devis.client ? `${devis.client.prenom || ""} ${devis.client.nom || ""}`.trim() : "—");
  const clientAdr   = devis.clientAdresse || devis.client?.adresse || "";
  const clientVille = devis.client?.quartier || devis.client?.ville || "Casablanca";

  const isExpired = devis.dateValidite && new Date(devis.dateValidite) < new Date() && devis.status !== "converted";

  // ── Pied de page légal ────────────────────────────────
  const piedLigne1 = [
    soc.adresse  && soc.tel     ? `Casablanca (SAV): ${soc.adresse} / Tél: ${soc.tel}`                        : null,
    soc.adresse2 && soc.tel_mag ? `${soc.ville2 || "Kénitra"} (MAG): ${soc.adresse2} / Tél: ${soc.tel_mag}` : null,
  ].filter(Boolean).join(" I ");

  const piedLigne2 = [
    soc.siege   ? `Siège: ${soc.siege}`     : null,
    soc.rc      ? `RC: ${soc.rc}`           : null,
    soc.ice     ? `ICE: ${soc.ice}`         : null,
    soc.if_fisc ? `IF: ${soc.if_fisc}`      : null,
    soc.patente ? `Patente: ${soc.patente}` : null,
  ].filter(Boolean).join(" I ");

  const s = {
    mono: { fontFamily: "monospace" },
    th:   { padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em", color: "#9CA3AF", background: "#F9FAFB" },
    td:   { padding: "14px 16px", fontSize: 13, borderTop: "1px solid #F3F4F6" },
    row:  { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, padding: "4px 0", color: "#6B7280" },
  };

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank", "width=800,height=1100");
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Devis ${devis.reference}</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'Segoe UI',Arial,sans-serif;background:white;color:#111;}
        @media print{
          body{print-color-adjust:exact;-webkit-print-color-adjust:exact;}
          .page-break{page-break-before:always;}
        }
      </style></head><body>${content}</body></html>`);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); win.close(); }, 400);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>

        {/* ── Header modal ── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
          </div>
          <div className="flex items-center gap-2">
            {devis.status === "draft" && onSend && (
              <button onClick={() => { onSend(devis); onClose(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition">
                <Send size={12} /> Envoyer
              </button>
            )}
            {devis.status === "sent" && onAccept && (
              <button onClick={() => { onAccept(devis); onClose(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition">
                <Check size={12} /> Accepter
              </button>
            )}
            {devis.status === "accepted" && onConvert && (
              <button onClick={() => { onConvert(devis); onClose(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition">
                <ArrowRight size={12} /> Convertir
              </button>
            )}
            <button onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-600 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition">
              <Printer size={12} /> Imprimer
            </button>
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* ── Corps ── */}
        <div className="overflow-y-auto flex-1 p-5">
          <div ref={printRef} style={{ fontFamily: "'Segoe UI',Arial,sans-serif", maxWidth: 640, margin: "0 auto", color: "#111" }}>

            {/* ══════════════ PAGE 1 ══════════════ */}

            {/* Logo gauche + site web droite */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ width: 180, height: 90, display: "flex", alignItems: "center" }}>
                {!logoError
                  ? <img src={logo} alt="logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onError={() => setLogoError(true)} />
                  : <span style={{ fontSize: 26, fontWeight: 700, color: "#15803D" }}>{nomSoc}</span>
                }
              </div>
              {soc.website && <div style={{ fontSize: 11, color: "#9CA3AF" }}>{soc.website}</div>}
            </div>

            {/* Client aligné à droite */}
            <div style={{ textAlign: "right", marginBottom: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{clientNom}</div>
              {clientAdr   && <div style={{ fontSize: 12, color: "#6B7280" }}>{clientAdr}</div>}
              <div style={{ fontSize: 12, color: "#6B7280" }}>{clientVille}</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Maroc</div>
              {(devis.dateDebut || devis.dateFin) && (
                <div style={{ fontSize: 12, color: "#374151", marginTop: 8 }}>
                  <strong>Période de location :</strong><br />
                  {fmtDate(devis.dateDebut)} → {fmtDate(devis.dateFin || devis.dateValidite)}
                </div>
              )}
            </div>

            {/* Titre vert + infos */}
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E5E7EB" }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#16A34A" }}>
                {devis.type === "proforma" ? "Devis Proforma" : `Devis ${devis.reference}`}
              </div>
              {soc.vendeur_defaut && (
                <div style={{ fontSize: 13, color: "#374151", marginTop: 6 }}>
                  <strong>Vendeur : </strong>{soc.vendeur_defaut}
                </div>
              )}
              <div style={{ display: "flex", gap: 40, marginTop: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#D97706" }}>Date du devis</div>
                  <div style={{ fontSize: 13 }}>{fmtDate(devis.date)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#D97706" }}>Échéance</div>
                  <div style={{ fontSize: 13, color: isExpired ? "#DC2626" : "#111" }}>
                    {fmtDate(devis.dateValidite)} {isExpired && "⚠️"}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#D97706" }}>Statut</div>
                  <div style={{ fontSize: 13 }}>
                    {devis.status === "accepted"  ? "✅ Accepté"  :
                     devis.status === "converted" ? "✅ Converti" :
                     devis.status === "sent"      ? "📤 Envoyé"  :
                     devis.status === "expired"   ? "⏰ Expiré"  :
                     "📄 Brouillon"}
                  </div>
                </div>
              </div>
            </div>

            {/* Tableau lignes (format PDF client) */}
            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #E5E7EB", marginBottom: 20 }}>
              <thead>
                <tr>
                  <th style={s.th}>Image</th>
                  <th style={s.th}>Référence</th>
                  <th style={s.th}>Description</th>
                  <th style={{ ...s.th, textAlign: "center" }}>Quantité</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Prix Unitaire</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Montant</th>
                </tr>
              </thead>
              <tbody>
                {(devis.lignes || []).map((ligne, i) => {
                  const equip = ligne.equipement || {};
                  return (
                    <tr key={i}>
                      <td style={{ ...s.td, width: 56 }}>
                        {equip.photo
                          ? <img src={equip.photo} alt={equip.name} style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 4, border: "1px solid #E5E7EB" }} />
                          : <span style={{ fontSize: 28 }}>{equip.icon || "🏥"}</span>
                        }
                      </td>
                      <td style={{ ...s.td, fontFamily: "monospace", fontSize: 12, color: "#6B7280" }}>
                        {equip.ref || `L${i + 1}`}
                      </td>
                      <td style={{ ...s.td, fontWeight: 500, fontSize: 14 }}>
                        {ligne.description}
                        {equip.name && equip.name !== ligne.description && (
                          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{equip.name}</div>
                        )}
                      </td>
                      <td style={{ ...s.td, textAlign: "center", fontSize: 13 }}>
                        {ligne.quantite},00<br />
                        <span style={{ fontSize: 11, color: "#6B7280" }}>Unité(s)</span>
                      </td>
                      <td style={{ ...s.td, textAlign: "right", ...s.mono, fontSize: 14 }}>
                        {ligne.prixHT === 0 ? "Offert" : fmtMad(ligne.prixHT)}
                      </td>
                      <td style={{ ...s.td, textAlign: "right", fontWeight: 600, ...s.mono, fontSize: 14 }}>
                        {ligne.prixHT === 0 ? "Offert" : fmtMad(ligne.totalHT || ligne.quantite * ligne.prixHT)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Totaux — conditions gauche + caution+totaux droite */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "flex-start" }}>

              {/* Conditions courtes à gauche */}
              <div style={{ flex: "0 0 220px", fontSize: 10, color: "#374151", lineHeight: 1.6, border: "1px solid #E5E7EB", borderRadius: 8, padding: "10px 12px" }}>
                {soc.conditions_location
                  ? soc.conditions_location.split("\n").slice(0, 8).join("\n")
                  : "Valable 30 jours. Paiement d'avance. La caution sera restituée à la fin de la location déduction faite des éventuels dommages."
                }
              </div>

              {/* Caution + Totaux à droite */}
              <div style={{ flex: 1 }}>
                {/* Caution au dessus des totaux */}
                {(devis.caution > 0) && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "8px 8px 0 0", padding: "8px 14px", fontSize: 12 }}>
                    <span style={{ fontWeight: 700, color: "#92400E" }}>Caution Restituable à la fin de la location</span>
                    <span style={{ fontWeight: 900, color: "#D97706", fontFamily: "monospace" }}>{fmtMad(devis.caution)}</span>
                  </div>
                )}
                <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #E5E7EB", borderTop: devis.caution > 0 ? "none" : "1px solid #E5E7EB" }}>
                  <tbody>
                    <tr style={{ background: "#F9FAFB" }}>
                      <td style={{ padding: "8px 14px", fontSize: 12, fontWeight: 600 }}>Total de la location du matériel médical</td>
                      <td style={{ padding: "8px 14px", textAlign: "right", fontSize: 12, fontWeight: 600, ...s.mono }}>{fmtMad(devis.montantHT)}</td>
                    </tr>
                    {devis.remiseGlobale > 0 && (
                      <tr>
                        <td style={{ padding: "8px 14px", fontSize: 12, color: "#D97706" }}>Remise ({devis.remiseGlobale}%)</td>
                        <td style={{ padding: "8px 14px", textAlign: "right", fontSize: 12, color: "#D97706", ...s.mono }}>- {fmtMad(Math.round(devis.montantHT * devis.remiseGlobale / 100))}</td>
                      </tr>
                    )}
                    <tr style={{ background: "#F0FDF4", borderTop: "2px solid #BBF7D0" }}>
                      <td style={{ padding: "10px 14px", fontSize: 14, fontWeight: 700, color: "#15803D" }}>Total Global</td>
                      <td style={{ padding: "10px 14px", textAlign: "right", fontSize: 14, fontWeight: 700, color: "#15803D", ...s.mono }}>{fmtMad(devis.montantTTC)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signatures page 1 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, marginBottom: 24, marginTop: 8 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Propriétaire</div>
                <div style={{ fontSize: 11, color: "#374151", marginBottom: 48 }}>{nomSoc} sarl</div>
                <div style={{ borderTop: "1px solid #9CA3AF", paddingTop: 4, fontSize: 10, color: "#9CA3AF" }}>Signature</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Le locataire</div>
                <div style={{ fontSize: 11, color: "#374151", marginBottom: 48 }}>&nbsp;</div>
                <div style={{ borderTop: "1px solid #9CA3AF", paddingTop: 4, fontSize: 10, color: "#9CA3AF" }}>Signature</div>
              </div>
            </div>

            {/* Pied de page légal page 1 */}
            <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 10, marginTop: 8 }}>
              {piedLigne1 && <div style={{ fontSize: 9.5, color: "#6B7280", textAlign: "center", marginBottom: 3 }}>{piedLigne1}</div>}
              {piedLigne2 && <div style={{ fontSize: 9.5, color: "#6B7280", textAlign: "center", marginBottom: 3 }}>{piedLigne2}</div>}
              {soc.email  && <div style={{ fontSize: 9.5, color: "#6B7280", textAlign: "center" }}>E-mail: {soc.email}</div>}
              <div style={{ fontSize: 9.5, color: "#9CA3AF", textAlign: "center", marginTop: 4 }}>Page 1 / 2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevisViewModal;