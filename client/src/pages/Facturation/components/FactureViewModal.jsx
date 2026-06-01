import React, { useRef, useState } from "react";
import { X, Printer, Phone, Mail, MapPin, Calendar, CreditCard, Check, Clock, AlertCircle } from "lucide-react";

const fmtD   = (d) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";
const fmtMad = (n) => `${(n || 0).toLocaleString("fr-FR")} MAD`;

const StatusBadge = ({ status }) => {
  const map = {
    draft:     { label: "Brouillon", bg: "#F1F5F9", color: "#64748B", icon: <AlertCircle size={11} /> },
    sent:      { label: "Envoyée",   bg: "#EFF6FF", color: "#2563EB", icon: <Clock size={11} /> },
    unpaid:    { label: "Impayée",   bg: "#FEF2F2", color: "#DC2626", icon: <AlertCircle size={11} /> },
    partial:   { label: "Partielle", bg: "#FFFBEB", color: "#D97706", icon: <Clock size={11} /> },
    paid:      { label: "Payée",     bg: "#F0FDF4", color: "#16A34A", icon: <Check size={11} /> },
    cancelled: { label: "Annulée",   bg: "#FEF2F2", color: "#DC2626", icon: <X size={11} /> },
  };
  const s = map[status] || map.draft;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.color}33` }}>
      {s.icon} {s.label}
    </span>
  );
};

const FactureViewModal = ({ isOpen, onClose, facture, societe = {} }) => {
  const printRef = useRef();
  const [logoError, setLogoError] = useState(false);

  if (!isOpen || !facture) return null;

  const soc    = societe;
  const nomSoc = soc.nom  || "OXYMEDIC";
  const logo   = soc.logo || "/Logo1.png";
  const isPaid = facture.status === "paid";

  const clientNom   = facture.clientNom || (facture.client ? `${facture.client.prenom || ""} ${facture.client.nom || ""}`.trim() : "—");
  const clientTel   = facture.client?.tel   || "";
  const clientEmail = facture.clientEmail   || facture.client?.email || "";
  const clientAdr   = facture.clientAdresse || facture.client?.adresse || "";
  const clientVille = facture.client?.quartier || facture.client?.ville || "";

  // ── Pied de page légal format client ──────────────────
  const piedLigne1 = [
    soc.adresse && soc.tel   ? `Casablanca (SAV): ${soc.adresse} / Tél: ${soc.tel}` : null,
    soc.adresse2 && soc.tel_mag ? `${soc.ville2 || "Kénitra"} (MAG): ${soc.adresse2} / Tél: ${soc.tel_mag}` : null,
  ].filter(Boolean).join(" I ");

  const piedLigne2 = [
    soc.siege   ? `Siège: ${soc.siege}` : null,
    soc.rc      ? `RC: ${soc.rc}`       : null,
    soc.ice     ? `ICE: ${soc.ice}`     : null,
    soc.if_fisc ? `IF: ${soc.if_fisc}`  : null,
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
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Facture ${facture.num}</title>
      <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',Arial,sans-serif;background:white;color:#111;}
      @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact;}}
      </style></head><body>${content}</body></html>`);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); win.close(); }, 400);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>

        {/* Header modal */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95">
              <Printer size={14} /> Imprimer
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 hover:rotate-90 transition-all">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-5">
          <div ref={printRef} style={{ fontFamily: "'Segoe UI',Arial,sans-serif", maxWidth: 640, margin: "0 auto", color: "#111" }}>

            {/* ── En-tête : Logo gauche + site web ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ width: 180, height: 90, display: "flex", alignItems: "center" }}>
                {!logoError
                  ? <img src={logo} alt="logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onError={() => setLogoError(true)} />
                  : <span style={{ fontSize: 26, fontWeight: 700, color: "#15803D" }}>{nomSoc}</span>
                }
              </div>
              <div style={{ textAlign: "right" }}>
                {soc.website && <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 8 }}>{soc.website}</div>}
              </div>
            </div>

            {/* ── Client aligné à droite (format PDF client) ── */}
            <div style={{ textAlign: "right", marginBottom: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{clientNom}</div>
              {clientAdr   && <div style={{ fontSize: 12, color: "#6B7280" }}>{clientAdr}</div>}
              {clientVille && <div style={{ fontSize: 12, color: "#6B7280" }}>{clientVille}</div>}
              <div style={{ fontSize: 12, color: "#6B7280" }}>Maroc</div>
              {facture.commande?.dateDebut && facture.commande?.dateFin && (
                <div style={{ fontSize: 12, color: "#374151", marginTop: 8 }}>
                  <strong>Période de location :</strong><br />
                  {fmtD(facture.commande.dateDebut)} → {fmtD(facture.commande.dateFin)}
                </div>
              )}
            </div>

            {/* ── Titre Facture (comme "Location DEV2601253") ── */}
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E5E7EB" }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#16A34A", marginBottom: 10 }}>
                {facture.type === "proforma" ? "Devis proforma" : `Facture ${facture.num}`}
              </div>
              {soc.vendeur_defaut && (
                <div style={{ fontSize: 13, color: "#374151" }}>
                  <strong>Vendeur : </strong>{soc.vendeur_defaut}
                </div>
              )}
              <div style={{ display: "flex", gap: 40, marginTop: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#D97706" }}>Date de la facture</div>
                  <div style={{ fontSize: 13 }}>{fmtD(facture.date)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#D97706" }}>Échéance</div>
                  <div style={{ fontSize: 13, color: facture.status === "unpaid" ? "#DC2626" : "#111" }}>{fmtD(facture.dateEcheance)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#D97706" }}>Statut</div>
                  <div style={{ marginTop: 2 }}><StatusBadge status={facture.status} /></div>
                </div>
              </div>
            </div>

            {/* ── Tableau lignes (format PDF client) ── */}
            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #E5E7EB", marginBottom: 16 }}>
              <thead>
                <tr>
                  <th style={s.th}>Référence</th>
                  <th style={s.th}>Description</th>
                  <th style={{ ...s.th, textAlign: "center" }}>Quantité</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Prix Unitaire</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Montant</th>
                </tr>
              </thead>
              <tbody>
                {(facture.lignes || []).map((ligne, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                    <td style={{ ...s.td, ...s.mono, fontSize: 12, color: "#6B7280" }}>{ligne.ref || `L${i + 1}`}</td>
                    <td style={{ ...s.td, fontWeight: 500, fontSize: 14 }}>{ligne.description}</td>
                    <td style={{ ...s.td, textAlign: "center", fontSize: 13 }}>{ligne.quantite} Unité(s)</td>
                    <td style={{ ...s.td, textAlign: "right", ...s.mono, fontSize: 14 }}>{fmtMad(ligne.prixHT || ligne.prixUnitaire)}</td>
                    <td style={{ ...s.td, textAlign: "right", fontWeight: 600, ...s.mono, fontSize: 14 }}>{fmtMad(ligne.totalHT || ligne.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ── Totaux (format PDF client) ── */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
              <table style={{ width: "50%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr style={{ background: "#F9FAFB" }}>
                    <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 600 }}>Total de la location du matériel médical</td>
                    <td style={{ padding: "10px 16px", textAlign: "right", fontSize: 13, fontWeight: 600, ...s.mono }}>{fmtMad(facture.montantHT)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px 16px", fontSize: 13, color: "#6B7280" }}>TVA ({facture.tvaGlobale || 20}%)</td>
                    <td style={{ padding: "10px 16px", textAlign: "right", fontSize: 13, color: "#7C3AED", ...s.mono }}>{fmtMad(facture.montantTVA)}</td>
                  </tr>
                  <tr style={{ background: "#F0FDF4", borderTop: "2px solid #BBF7D0" }}>
                    <td style={{ padding: "12px 16px", fontSize: 16, fontWeight: 700, color: "#15803D" }}>Total Global</td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 16, fontWeight: 700, color: "#15803D", ...s.mono }}>{fmtMad(facture.montantTTC)}</td>
                  </tr>
                  {facture.montantPaye > 0 && (
                    <tr>
                      <td style={{ padding: "10px 16px", fontSize: 13, color: "#16A34A" }}>Déjà payé</td>
                      <td style={{ padding: "10px 16px", textAlign: "right", fontSize: 13, color: "#16A34A", ...s.mono }}>- {fmtMad(facture.montantPaye)}</td>
                    </tr>
                  )}
                  {facture.montantRestant > 0 && (
                    <tr style={{ borderTop: "1px solid #FCA5A5", background: "#FEF2F2" }}>
                      <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 700, color: "#DC2626" }}>Reste à payer</td>
                      <td style={{ padding: "10px 16px", textAlign: "right", fontSize: 13, fontWeight: 700, color: "#DC2626", ...s.mono }}>{fmtMad(facture.montantRestant)}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Notes */}
            {facture.notes && (
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "14px 16px", marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: "#B45309", marginBottom: 6 }}>Notes</div>
                <div style={{ fontSize: 13, color: "#78350F" }}>{facture.notes}</div>
              </div>
            )}

            {/* ── Signatures ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, marginBottom: 28, marginTop: 20 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Propriétaire</div>
                <div style={{ fontSize: 12, color: "#374151", marginBottom: 48 }}>{nomSoc}</div>
                <div style={{ borderTop: "1px solid #9CA3AF", paddingTop: 6, fontSize: 11, color: "#9CA3AF" }}>Signature</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Le locataire</div>
                <div style={{ fontSize: 12, color: "#374151", marginBottom: 48 }}>&nbsp;</div>
                <div style={{ borderTop: "1px solid #9CA3AF", paddingTop: 6, fontSize: 11, color: "#9CA3AF" }}>Signature</div>
              </div>
            </div>

            {/* ── Pied de page légal format exact client ── */}
            <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 12, marginTop: 10 }}>
              {piedLigne1 && (
                <div style={{ fontSize: 8, color: "#6B7280", textAlign: "center", marginBottom: 4 }}>
                  {piedLigne1}
                </div>
              )}
              {piedLigne2 && (
                <div style={{ fontSize: 8, color: "#6B7280", textAlign: "center", marginBottom: 4 }}>
                  {piedLigne2}
                </div>
              )}
              {soc.email && (
                <div style={{ fontSize: 8, color: "#6B7280", textAlign: "center" }}>
                  E-mail: {soc.email}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FactureViewModal;