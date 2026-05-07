import React, { useRef, useState } from "react";
import { X, Printer, Check, Clock, Phone, MapPin, CreditCard, Calendar } from "lucide-react";

const fmt     = (n) => (n || 0).toLocaleString("fr-FR");
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—";

const MODE_LABELS = {
  espece:   "Espèce",
  virement: "Virement bancaire",
  cheque:   "Chèque",
  carte:    "Carte bancaire",
  mobile:   "Paiement mobile",
};

const TYPE_LABELS = {
  avance:        "Avance sur commande",
  solde:         "Solde de commande",
  caution:       "Caution de garantie",
  remboursement: "Remboursement",
};

const PaiementReceiptModal = ({ isOpen, onClose, paiement, societe = {} }) => {
  const printRef = useRef();
  const [logoError, setLogoError] = useState(false);

  if (!isOpen || !paiement) return null;

  const soc    = societe;
  const nomSoc = soc.nom    || "OXYMEDIC";
  const slogan = soc.slogan || "Le confort médical à domicile";
  const logo   = soc.logo   || "/Logo1.png";

  const receiptNum = `RCP-${paiement.reference}`;
  const now        = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  const isPaid     = paiement.statut === "paid";

  // Client
  const client    = paiement.client || {};
  const clientNom = typeof client === "object" ? `${client.prenom || ""} ${client.nom || ""}`.trim() : "—";
  const clientTel = client.tel || "";
  const clientCin = client.cin?.numero || client.cinNum || "";
  const clientAdr = [client.adresse, client.quartier].filter(Boolean).join(", ");

  // Commande liée
  const commande = paiement.commande || null;
  const cmdRef   = commande ? (typeof commande === "object" ? commande.reference : commande) : null;

  // Facture liée
  const facture    = paiement.facture || null;
  const factureNum = facture ? (typeof facture === "object" ? facture.num : facture) : null;

  // ── Pied de page légal (format client) ──────────────────
  const piedPageLegal = () => {
    const parts = [];
    if (soc.adresse && soc.tel) parts.push(`Casablanca (SAV): ${soc.adresse} / Tél: ${soc.tel}`);
    if (soc.adresse2 && soc.tel_mag) parts.push(`${soc.ville2 || "Kénitra"} (MAG): ${soc.adresse2} / Tél: ${soc.tel_mag}`);
    return parts.join(" I ");
  };

  const piedPageLegal2 = () => {
    const parts = [];
    if (soc.siege) parts.push(`Siège: ${soc.siege}`);
    if (soc.rc)      parts.push(`RC: ${soc.rc}`);
    if (soc.ice)     parts.push(`ICE: ${soc.ice}`);
    if (soc.if_fisc) parts.push(`IF: ${soc.if_fisc}`);
    if (soc.patente) parts.push(`Patente: ${soc.patente}`);
    return parts.join(" I ");
  };

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank", "width=800,height=900");
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Reçu ${paiement.reference}</title>
      <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',Arial,sans-serif;background:white;color:#111;}
      @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact;}}
      </style></head><body>${content}</body></html>`);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); win.close(); }, 400);
  };

  const s = {
    card:    { background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "16px 18px" },
    label:   { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", color: "#9CA3AF", marginBottom: 10, display: "block" },
    infoRow: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B7280", marginBottom: 6 },
    mono:    { fontFamily: "monospace" },
    th:      { padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em", color: "#9CA3AF", background: "#F9FAFB" },
    td:      { padding: "14px 16px", fontSize: 13, borderTop: "1px solid #F3F4F6" },
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Header modal */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2"></div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition">
              <Printer size={13} /> Imprimer
            </button>
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-5">
          <div ref={printRef} style={{ fontFamily: "'Segoe UI',Arial,sans-serif", maxWidth: 640, margin: "0 auto", color: "#111" }}>

            {/* ── En-tête ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              {/* Logo */}
              <div style={{ width: 160, height: 80, display: "flex", alignItems: "center" }}>
                {!logoError
                  ? <img src={logo} alt="logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onError={() => setLogoError(true)} />
                  : <span style={{ fontSize: 26, fontWeight: 700, color: "#15803D" }}>{nomSoc}</span>
                }
              </div>
              {/* Infos droite */}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>{soc.website || "www.oxymedic.ma"}</div>
                <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: isPaid ? "#F0FDF4" : "#FFFBEB", color: isPaid ? "#15803D" : "#B45309", border: `1px solid ${isPaid ? "#BBF7D0" : "#FDE68A"}` }}>
                  {isPaid ? <Check size={12} /> : <Clock size={12} />}
                  {isPaid ? "PAYÉ" : "EN ATTENTE"}
                </div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>{now}</div>
              </div>
            </div>

            {/* Client (aligné à droite comme dans les PDFs client) */}
            <div style={{ textAlign: "right", marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{clientNom}</div>
              {clientAdr && <div style={{ fontSize: 12, color: "#6B7280" }}>{clientAdr}</div>}
              <div style={{ fontSize: 12, color: "#6B7280" }}>Maroc</div>
            </div>

            {/* ── Titre ── */}
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E5E7EB" }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#16A34A" }}>Reçu de paiement</div>
              <div style={{ fontSize: 13, fontFamily: "monospace", color: "#374151", marginTop: 6 }}>{receiptNum}</div>
              <div style={{ display: "flex", gap: 40, marginTop: 12 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#D97706" }}>Date</span>
                  <div style={{ fontSize: 13 }}>{now}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#D97706" }}>Mode</span>
                  <div style={{ fontSize: 13 }}>{MODE_LABELS[paiement.modePaiement] || paiement.modePaiement}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#D97706" }}>Type</span>
                  <div style={{ fontSize: 13 }}>{TYPE_LABELS[paiement.type] || paiement.type}</div>
                </div>
              </div>
            </div>

            {/* ── Tableau paiement ── */}
            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  <th style={s.th}>Type de paiement</th>
                  <th style={s.th}>Client</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Montant</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...s.td, fontSize: 14 }}>{TYPE_LABELS[paiement.type] || paiement.type || "Paiement"}</td>
                  <td style={{ ...s.td, fontSize: 14 }}>{clientNom}</td>
                  <td style={{ ...s.td, textAlign: "right", fontWeight: 700, fontFamily: "monospace", fontSize: 16, color: "#16A34A" }}>
                    {fmt(paiement.montant)} MAD
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr style={{ background: "#F0FDF4", borderTop: "2px solid #BBF7D0" }}>
                  <td colSpan={2} style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: "#15803D" }}>
                    MONTANT REÇU
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontSize: 18, fontWeight: 900, fontFamily: "monospace", color: "#15803D" }}>
                    {fmt(paiement.montant)} MAD
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Banque si virement/chèque */}
            {(paiement.banque || paiement.referenceBancaire) && (
              <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#1E40AF" }}>
                {paiement.banque && <div>🏦 Banque : {paiement.banque}</div>}
                {paiement.referenceBancaire && <div>📋 Référence : {paiement.referenceBancaire}</div>}
              </div>
            )}

            {/* Note */}
            {paiement.note && (
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#92400E", fontStyle: "italic" }}>
                {paiement.note}
              </div>
            )}

            {/* ── Signatures ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, marginBottom: 28, marginTop: 20 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Signature du caissier</div>
                <div style={{ fontSize: 12, color: "#374151", marginBottom: 48 }}>{nomSoc}</div>
                <div style={{ borderTop: "1px solid #9CA3AF", paddingTop: 6, fontSize: 11, color: "#9CA3AF" }}>Signature</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Signature du client</div>
                <div style={{ fontSize: 12, color: "#374151", marginBottom: 48 }}>{clientNom}</div>
                <div style={{ borderTop: "1px solid #9CA3AF", paddingTop: 6, fontSize: 11, color: "#9CA3AF" }}>Signature</div>
              </div>
            </div>

            {/* ── Pied de page légal (format exact client) ── */}
            <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 12, marginTop: 10 }}>
              {piedPageLegal() && (
                <div style={{ fontSize: 8, color: "#6B7280", textAlign: "center", marginBottom: 4 }}>
                  {piedPageLegal()}
                </div>
              )}
              {piedPageLegal2() && (
                <div style={{ fontSize: 8, color: "#6B7280", textAlign: "center", marginBottom: 4 }}>
                  {piedPageLegal2()}
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

export default PaiementReceiptModal;