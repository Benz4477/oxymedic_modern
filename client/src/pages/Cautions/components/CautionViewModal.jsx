import React, { useRef, useState } from "react";
import { X, Printer, Check, Clock, Settings } from "lucide-react";

const fmt     = (n) => (n || 0).toLocaleString("fr-FR");
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—";

const MODE_LABELS = {
  Cash:     "Espèce",
  Chèque:   "Chèque",
  Virement: "Virement bancaire",
  Carte:    "Carte bancaire",
};

const STATUS_LABELS = {
  held:     "En cours",
  returned: "Restituée",
  deducted: "Déduite",
};

export default function CautionViewModal({ isOpen, onClose, caution, societe = {} }) {
  const printRef = useRef();
  const [logoError, setLogoError] = useState(false);
  const [printerMode, setPrinterMode] = useState(() => {
    try {
      const saved = localStorage.getItem('printerMode');
      return saved || 'standard';
    } catch {
      return 'standard';
    }
  });

  const handlePrinterModeChange = () => {
    const newMode = printerMode === 'thermal' ? 'standard' : 'thermal';
    setPrinterMode(newMode);
    try { localStorage.setItem('printerMode', newMode); } catch {}
  };

  if (!isOpen || !caution) return null;

  const soc    = societe;
  const nomSoc = soc.nom    || "OXYMEDIC";
  const slogan = soc.slogan || "Le confort médical à domicile";
  const logo   = soc.logo   || "/Logo1.png";

  const receiptNum = caution.ref;
  const now        = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  const isHeld     = caution.status === "held";

  const client    = caution.client || {};
  const clientNom = typeof client === "object" ? `${client.prenom || ""} ${client.nom || ""}`.trim() : "—";
  const clientTel = client.tel || "";
  const clientCin = client.cin?.numero || client.cinNum || "";
  const clientAdr = [client.adresse, client.quartier].filter(Boolean).join(", ");

  const commande = caution.commande || null;
  const cmdRef   = commande ? (typeof commande === "object" ? commande.reference : commande) : null;

  const equipement = caution.equipement || null;
  const equipName  = equipement ? (typeof equipement === "object" ? equipement.name : equipement) : null;
  const equipIcon  = equipement ? (typeof equipement === "object" ? equipement.icon : "📦") : null;

  const unite = caution.unite || null;
  const unitSerial = unite ? (typeof unite === "object" ? unite.serial : unite) : null;

  const piedPageLegal = () => {
    const parts = [];
    if (soc.adresse && soc.tel) parts.push(`Casablanca (SAV): ${soc.adresse} / Tél: ${soc.tel}`);
    if (soc.adresse2 && soc.tel_mag) parts.push(`${soc.ville2 || "Kénitra"} (MAG): ${soc.adresse2} / Tél: ${soc.tel_mag}`);
    return parts.join(" I ");
  };

  const piedPageLegal2 = () => {
    const parts = [];
    if (soc.siege)   parts.push(`Siège: ${soc.siege}`);
    if (soc.rc)      parts.push(`RC: ${soc.rc}`);
    if (soc.ice)     parts.push(`ICE: ${soc.ice}`);
    if (soc.if_fisc) parts.push(`IF: ${soc.if_fisc}`);
    if (soc.patente) parts.push(`Patente: ${soc.patente}`);
    return parts.join(" I ");
  };

  const handlePrint = () => {
    if (printerMode === 'thermal') {
      printThermalReceipt();
    } else {
      printStandardReceipt();
    }
  };

  const printStandardReceipt = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank", "width=800,height=900");
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Reçu ${caution.ref}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Segoe UI',Arial,sans-serif; background:white; color:#111; }
        @media print {
          body { print-color-adjust:exact; -webkit-print-color-adjust:exact; }
        }
      </style></head><body>${content}</body></html>`);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); win.close(); }, 400);
  };

  /* ─── IMPRESSION TICKET THERMIQUE ─────────────────────────────────── */
  const printThermalReceipt = () => {
    const win = window.open("", "_blank", "width=360,height=700,scrollbars=yes");
    const thermalContent = generateThermalReceipt();

    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reçu ${caution.ref}</title>
  <style>
    /* ── Reset ── */
    * { margin: 0; padding: 0; box-sizing: border-box; }

    /* ── Mise en page impression ── */
    @media print {
      @page {
        size: 80mm auto;
        margin: 3mm 2mm;
      }
      .no-print { display: none !important; }
      body {
        width: 76mm;
        font-family: 'Courier New', Courier, monospace;
        font-size: 10pt;
        line-height: 1.35;
        color: #000 !important;
        background: #fff !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      * { color: #000 !important; background: transparent !important; font-weight: bold !important; }
      .total-line { font-size: 13pt !important; font-weight: bold !important; }
      img { display: block !important; width: 160px !important; max-width: 160px !important; height: auto !important; max-height: 80px !important; margin: 0 auto 6px auto !important; object-fit: contain !important; }
    }

    /* ── Aperçu écran ── */
    body {
      font-family: 'Courier New', Courier, monospace;
      background: #fff;
      color: #000;
      width: 300px;
      max-width: 300px;
      margin: 0 auto;
      padding: 10px;
      font-size: 11px;
      line-height: 1.35;
      font-weight: bold;
    }
    * { font-weight: bold; }

    /* ── Composants ticket ── */
    .header        { text-align: center; margin-bottom: 10px; }
    .logo-img      { display: block; width: 160px; max-width: 160px; height: auto; max-height: 80px; object-fit: contain; margin: 0 auto 8px auto; }
    .company-name  { font-size: 15px; font-weight: bold; margin-bottom: 3px; letter-spacing: 1px; }
    .slogan        { font-size: 10px; margin-bottom: 4px; }
    .contact-line  { font-size: 10px; margin-bottom: 2px; }

    .divider       { border: none; border-top: 1.5px solid #000; margin: 8px 0; }
    .divider-dash  { border: none; border-top: 1px dashed #555; margin: 8px 0; }

    .section-title {
      text-align: center;
      font-size: 13px;
      font-weight: bold;
      letter-spacing: 1px;
      margin: 6px 0;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin: 3px 0;
      font-size: 10.5px;
    }
    .info-row .lbl  { flex-shrink: 0; color: #444; min-width: 55px; }
    .info-row .val  { text-align: right; font-weight: bold; word-break: break-word; }

    .total-block   { text-align: right; margin: 8px 0; }
    .total-line    { font-size: 14px; font-weight: bold; letter-spacing: 0.5px; }

    .status-badge  {
      display: inline-block;
      padding: 2px 10px;
      border: 1.5px solid #000;
      font-size: 11px;
      font-weight: bold;
      letter-spacing: 1px;
      margin: 4px 0;
    }

    .note-box {
      font-size: 9.5px;
      font-style: italic;
      text-align: center;
      margin: 4px 0;
      padding: 3px 6px;
      border: 1px dashed #555;
    }

    .footer {
      font-size: 9px;
      text-align: center;
      margin-top: 10px;
      line-height: 1.6;
    }
    .footer .merci { font-size: 11px; font-weight: bold; margin-bottom: 4px; }

    /* ── Barre d'aperçu (masquée à l'impression) ── */
    .no-print {
      padding: 14px;
      text-align: center;
      background: #f5f5f5;
      border-bottom: 1px solid #ddd;
      margin-bottom: 12px;
    }
    .no-print h3 { font-size: 13px; margin-bottom: 6px; }
    .no-print p  { font-size: 11px; color: #555; margin-bottom: 8px; }
    .no-print button {
      padding: 8px 18px;
      background: #16a34a;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="no-print">
    <h3>Aperçu ticket thermique</h3>
    <p>Vérifiez l'aperçu puis cliquez pour imprimer</p>
    <button onclick="window.print()">🖨 Imprimer</button>
  </div>

  ${thermalContent}
</body>
</html>`);
    win.document.close();
  };

  /* ─── CONTENU HTML DU TICKET ───────────────────────────────────────── */
  const generateThermalReceipt = () => {
    const nowTime  = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const nowShort = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
    const cl       = caution.client || {};
    const nom      = typeof cl === "object" ? `${cl.prenom || ""} ${cl.nom || ""}`.trim() : "—";
    const tel      = cl.tel || "";
    const logoUrl  = soc.logo || "/Logo1.png";

    return `
<div class="header">
  <img
    src="${logoUrl}"
    alt="logo"
    class="logo-img"
    onerror="this.style.display='none'; document.getElementById('fallback-name').style.display='block';"
  />
  <div id="fallback-name" class="company-name" style="display:none;">${nomSoc.toUpperCase()}</div>
  <div class="slogan">${slogan}</div>
  ${soc.tel ? `<div class="contact-line">${soc.tel}</div>` : ""}
  <div class="contact-line">Service Casablanca</div>
</div>

<hr class="divider" />

<div class="section-title">★ REÇU DE CAUTION ★</div>

<hr class="divider-dash" />

<div class="info-row"><span class="lbl">N° :</span>      <span class="val">${caution.ref}</span></div>
<div class="info-row"><span class="lbl">Date :</span>    <span class="val">${nowShort} ${nowTime}</span></div>
<div class="info-row"><span class="lbl">Mode :</span>    <span class="val">${MODE_LABELS[caution.mode] || caution.mode || "—"}</span></div>
<div class="info-row"><span class="lbl">Statut :</span>  <span class="val">${STATUS_LABELS[caution.status] || caution.status || "—"}</span></div>

<hr class="divider-dash" />

<div class="info-row"><span class="lbl">Client :</span>  <span class="val">${nom}</span></div>
${tel ? `<div class="info-row"><span class="lbl">Tél :</span> <span class="val">${tel}</span></div>` : ""}
${cmdRef     ? `<div class="info-row"><span class="lbl">Commande :</span> <span class="val">${cmdRef}</span></div>` : ""}
${equipName  ? `<div class="info-row"><span class="lbl">Équipement :</span> <span class="val">${equipIcon} ${equipName}</span></div>` : ""}
${unitSerial ? `<div class="info-row"><span class="lbl">N° série :</span> <span class="val">${unitSerial}</span></div>` : ""}

<hr class="divider" />

<div class="info-row">
  <span class="lbl">Montant :</span>
  <span class="val">${fmt(caution.amount)} MAD</span>
</div>

<div class="total-block">
  <div class="total-line">TOTAL : ${fmt(caution.amount)} MAD</div>
</div>

<hr class="divider" />

<div style="text-align:center; margin: 6px 0;">
  <span class="status-badge">${isHeld ? "⏳ EN COURS" : caution.status === "returned" ? "✓ RESTITUÉE" : "⚠ DÉDUITE"}</span>
</div>

${caution.note ? `<div class="note-box">"${caution.note}"</div>` : ""}

${caution.mode === 'Chèque' && caution.numeroChèque ? `
<hr class="divider-dash" />
${caution.numeroChèque ? `<div class="info-row"><span class="lbl">N° Chèque :</span> <span class="val">${caution.numeroChèque}</span></div>` : ""}
${caution.banque ? `<div class="info-row"><span class="lbl">Banque :</span> <span class="val">${caution.banque}</span></div>` : ""}
` : ""}

${caution.status === 'deducted' ? `
<hr class="divider-dash" />
<div class="info-row"><span class="lbl">Retenu :</span> <span class="val">${fmt(caution.deductionAmount)} MAD</span></div>
<div class="info-row"><span class="lbl">Rendu :</span> <span class="val">${fmt(caution.amount - caution.deductionAmount)} MAD</span></div>
${caution.deductionReason ? `<div class="note-box">Motif: ${caution.deductionReason}</div>` : ""}
` : ""}

<hr class="divider" />

<div class="footer">
  <div class="merci">Merci pour votre confiance !</div>
  ${soc.website ? `<div>${soc.website}</div>` : ""}
  ${soc.email   ? `<div>${soc.email}</div>`   : ""}
  ${soc.ice     ? `<div>ICE : ${soc.ice}</div>` : ""}
  <div style="margin-top: 12px;"> </div>
</div>`;
  };

  /* ─── STYLES INTERNES ──────────────────────────────────────────────── */
  const s = {
    card:    { background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "16px 18px" },
    label:   { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", color: "#9CA3AF", marginBottom: 10, display: "block" },
    infoRow: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6B7280", marginBottom: 6 },
    mono:    { fontFamily: "monospace" },
    th:      { padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".07em", color: "#9CA3AF", background: "#F9FAFB" },
    td:      { padding: "14px 16px", fontSize: 13, borderTop: "1px solid #F3F4F6" },
  };

  /* ─── RENDU ────────────────────────────────────────────────────────── */
  return (
    <div
      className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header modal */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2" />
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrinterModeChange}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-600 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition"
              title={printerMode === 'thermal' ? 'Basculer vers format A4' : 'Basculer vers format ticket caisse'}
            >
              <Settings size={13} />
              {printerMode === 'thermal' ? 'Format A4' : 'Ticket caisse'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition"
            >
              <Printer size={13} /> Imprimer
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-5">

          {/* ══════════════════ MODE STANDARD (A4) ══════════════════ */}
          {printerMode === 'standard' ? (
            <div ref={printRef} style={{ fontFamily: "'Segoe UI',Arial,sans-serif", maxWidth: 640, margin: "0 auto", color: "#111" }}>

              {/* En-tête */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ width: 160, height: 80, display: "flex", alignItems: "center" }}>
                  {!logoError
                    ? <img src={logo} alt="logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onError={() => setLogoError(true)} />
                    : <span style={{ fontSize: 26, fontWeight: 700, color: "#15803D" }}>{nomSoc}</span>
                  }
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{soc.website || "www.oxymedic.ma"}</div>
                  <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: isHeld ? "#FFFBEB" : caution.status === "returned" ? "#F0FDF4" : "#F8FAFC", color: isHeld ? "#B45309" : caution.status === "returned" ? "#15803D" : "#475569", border: `1px solid ${isHeld ? "#FDE68A" : caution.status === "returned" ? "#BBF7D0" : "#E2E8F0"}` }}>
                    {isHeld ? <Clock size={12} /> : caution.status === "returned" ? <Check size={12} /> : <Clock size={12} />}
                    {STATUS_LABELS[caution.status] || caution.status}
                  </div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>{now}</div>
                </div>
              </div>

              {/* Client */}
              <div style={{ textAlign: "right", marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{clientNom}</div>
                {clientAdr && <div style={{ fontSize: 12, color: "#6B7280" }}>{clientAdr}</div>}
                <div style={{ fontSize: 12, color: "#6B7280" }}>Maroc</div>
              </div>

              {/* Titre */}
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E5E7EB" }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#16A34A" }}>Reçu de caution</div>
                <div style={{ fontSize: 13, fontFamily: "monospace", color: "#374151", marginTop: 6 }}>{receiptNum}</div>
                <div style={{ display: "flex", gap: 40, marginTop: 12 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#D97706" }}>Date</span>
                    <div style={{ fontSize: 13 }}>{now}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#D97706" }}>Mode</span>
                    <div style={{ fontSize: 13 }}>{MODE_LABELS[caution.mode] || caution.mode}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#D97706" }}>Statut</span>
                    <div style={{ fontSize: 13 }}>{STATUS_LABELS[caution.status] || caution.status}</div>
                  </div>
                </div>
              </div>

              {/* Tableau */}
              <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
                <thead>
                  <tr style={{ background: "#F9FAFB" }}>
                    <th style={s.th}>Type</th>
                    <th style={s.th}>Client</th>
                    <th style={{ ...s.th, textAlign: "right" }}>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ ...s.td, fontSize: 14 }}>Caution de garantie</td>
                    <td style={{ ...s.td, fontSize: 14 }}>{clientNom}</td>
                    <td style={{ ...s.td, textAlign: "right", fontWeight: 700, fontFamily: "monospace", fontSize: 16, color: "#16A34A" }}>
                      {fmt(caution.amount)} MAD
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr style={{ background: "#F0FDF4", borderTop: "2px solid #BBF7D0" }}>
                    <td colSpan={2} style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: "#15803D" }}>
                      MONTANT DÉPOSÉ
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontSize: 18, fontWeight: 900, fontFamily: "monospace", color: "#15803D" }}>
                      {fmt(caution.amount)} MAD
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Chèque */}
              {caution.mode === 'Chèque' && (caution.numeroChèque || caution.banque) && (
                <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#1E40AF" }}>
                  {caution.numeroChèque && <div>📋 N° Chèque : {caution.numeroChèque}</div>}
                  {caution.banque           && <div>🏦 Banque : {caution.banque}</div>}
                </div>
              )}

              {/* Commande */}
              {cmdRef && (
                <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#374151" }}>
                  <div>📋 Commande liée : <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{cmdRef}</span></div>
                </div>
              )}

              {/* Équipement */}
              {equipName && (
                <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#374151" }}>
                  <div>📦 Équipement : {equipIcon} {equipName}</div>
                  {unitSerial && <div style={{ marginTop: 4, fontFamily: "monospace", fontSize: 11 }}>N° série : {unitSerial}</div>}
                </div>
              )}

              {/* Note */}
              {caution.note && (
                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#92400E", fontStyle: "italic" }}>
                  {caution.note}
                </div>
              )}

              {/* Déduction */}
              {caution.status === 'deducted' && (
                <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#475569" }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Détail de la déduction</div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span>Montant retenu :</span>
                    <span style={{ fontWeight: 700 }}>{fmt(caution.deductionAmount)} MAD</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Montant rendu :</span>
                    <span style={{ fontWeight: 700, color: "#16A34A" }}>{fmt(caution.amount - caution.deductionAmount)} MAD</span>
                  </div>
                  {caution.deductionReason && <div style={{ marginTop: 8, fontStyle: "italic", fontSize: 12 }}>Motif : {caution.deductionReason}</div>}
                  {caution.retourDate && <div style={{ marginTop: 4, fontSize: 12 }}>Date : {fmtDate(caution.retourDate)}</div>}
                </div>
              )}

              {/* Restitution */}
              {caution.status === 'returned' && (
                <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#15803D" }}>
                  ✅ Caution restituée intégralement le {fmtDate(caution.retourDate)}
                </div>
              )}

              {/* Signatures */}
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

              {/* Pied de page légal */}
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

          ) : (
            /* ══════════════════ MODE TICKET (aperçu écran) ══════════════════ */
            <div style={{ fontFamily: "'Courier New',Courier,monospace", maxWidth: 300, margin: "0 auto", color: "#000", padding: "10px", fontSize: 11, lineHeight: 1.35, fontWeight: "bold" }}>

              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: 10 }}>
                <img
                  src={logo}
                  alt="logo"
                  style={{ display: "block", width: 160, maxWidth: 160, height: "auto", maxHeight: 80, objectFit: "contain", margin: "0 auto 8px auto" }}
                  onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "block"; }}
                />
                <div style={{ display: "none", fontSize: 15, fontWeight: "bold", marginBottom: 3, letterSpacing: 1 }}>{nomSoc.toUpperCase()}</div>
                <div style={{ fontSize: 10, marginBottom: 4 }}>{slogan}</div>
                {soc.tel && <div style={{ fontSize: 10 }}>{soc.tel}</div>}
                <div style={{ fontSize: 10 }}>Service Casablanca</div>
              </div>

              <div style={{ borderTop: "1.5px solid #000", margin: "8px 0" }} />

              <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 13, letterSpacing: 1, margin: "6px 0" }}>
                ★ REÇU DE CAUTION ★
              </div>

              <div style={{ borderTop: "1px dashed #555", margin: "8px 0" }} />

              {[
                ["N° :",    caution.ref],
                ["Date :",  new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) + " " + new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })],
                ["Mode :",  MODE_LABELS[caution.mode] || caution.mode || "—"],
                ["Statut :", STATUS_LABELS[caution.status] || caution.status || "—"],
              ].map(([lbl, val]) => (
                <div key={lbl} style={{ display: "flex", justifyContent: "space-between", margin: "3px 0", fontSize: 10.5, fontWeight: "bold" }}>
                  <span style={{ minWidth: 55 }}>{lbl}</span>
                  <span style={{ textAlign: "right" }}>{val}</span>
                </div>
              ))}

              <div style={{ borderTop: "1px dashed #555", margin: "8px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", margin: "3px 0", fontWeight: "bold" }}>
                <span style={{ minWidth: 55 }}>Client :</span>
                <span>{clientNom}</span>
              </div>
              {clientTel && (
                <div style={{ display: "flex", justifyContent: "space-between", margin: "3px 0", fontWeight: "bold" }}>
                  <span style={{ minWidth: 55 }}>Tél :</span>
                  <span>{clientTel}</span>
                </div>
              )}
              {cmdRef && (
                <div style={{ display: "flex", justifyContent: "space-between", margin: "3px 0", fontWeight: "bold" }}>
                  <span style={{ minWidth: 55 }}>Commande :</span>
                  <span>{cmdRef}</span>
                </div>
              )}
              {equipName && (
                <div style={{ display: "flex", justifyContent: "space-between", margin: "3px 0", fontWeight: "bold" }}>
                  <span style={{ minWidth: 55 }}>Équipement :</span>
                  <span>{equipIcon} {equipName}</span>
                </div>
              )}
              {unitSerial && (
                <div style={{ display: "flex", justifyContent: "space-between", margin: "3px 0", fontWeight: "bold" }}>
                  <span style={{ minWidth: 55 }}>N° série :</span>
                  <span>{unitSerial}</span>
                </div>
              )}

              <div style={{ borderTop: "1.5px solid #000", margin: "8px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", margin: "3px 0", fontWeight: "bold" }}>
                <span>Montant :</span>
                <span>{fmt(caution.amount)} MAD</span>
              </div>
              <div style={{ textAlign: "right", fontSize: 14, fontWeight: "bold", margin: "8px 0", letterSpacing: 0.5 }}>
                TOTAL : {fmt(caution.amount)} MAD
              </div>

              <div style={{ borderTop: "1.5px solid #000", margin: "8px 0" }} />

              <div style={{ textAlign: "center", margin: "6px 0" }}>
                <span style={{ display: "inline-block", padding: "2px 10px", border: "1.5px solid #000", fontSize: 11, fontWeight: "bold", letterSpacing: 1 }}>
                  {isHeld ? "⏳ EN COURS" : caution.status === "returned" ? "✓ RESTITUÉE" : "⚠ DÉDUITE"}
                </span>
              </div>

              {caution.note && (
                <div style={{ fontSize: 9.5, fontStyle: "italic", textAlign: "center", margin: "4px 0", padding: "3px 6px", border: "1px dashed #555" }}>
                  "{caution.note}"
                </div>
              )}

              {caution.mode === 'Chèque' && (caution.numeroChèque || caution.banque) && (
                <>
                  <div style={{ borderTop: "1px dashed #555", margin: "8px 0" }} />
                  {caution.numeroChèque && <div style={{ display: "flex", justifyContent: "space-between", margin: "3px 0", fontWeight: "bold" }}><span>N° Chèque :</span><span>{caution.numeroChèque}</span></div>}
                  {caution.banque           && <div style={{ display: "flex", justifyContent: "space-between", margin: "3px 0", fontWeight: "bold" }}><span>Banque :</span><span>{caution.banque}</span></div>}
                </>
              )}

              {caution.status === 'deducted' && (
                <>
                  <div style={{ borderTop: "1px dashed #555", margin: "8px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", margin: "3px 0", fontWeight: "bold" }}><span>Retenu :</span><span>{fmt(caution.deductionAmount)} MAD</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", margin: "3px 0", fontWeight: "bold" }}><span>Rendu :</span><span>{fmt(caution.amount - caution.deductionAmount)} MAD</span></div>
                  {caution.deductionReason && <div style={{ fontSize: 9.5, fontStyle: "italic", textAlign: "center", margin: "4px 0", padding: "3px 6px", border: "1px dashed #555" }}>{caution.deductionReason}</div>}
                </>
              )}

              <div style={{ borderTop: "1.5px solid #000", margin: "8px 0" }} />

              <div style={{ fontSize: 9, textAlign: "center", marginTop: 10, lineHeight: 1.6, fontWeight: "bold" }}>
                <div style={{ fontSize: 11, fontWeight: "bold", marginBottom: 4 }}>Merci pour votre confiance !</div>
                {soc.website && <div>{soc.website}</div>}
                {soc.email   && <div>{soc.email}</div>}
                {soc.ice     && <div>ICE : {soc.ice}</div>}
                <div style={{ marginTop: 12 }}>&nbsp;</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}