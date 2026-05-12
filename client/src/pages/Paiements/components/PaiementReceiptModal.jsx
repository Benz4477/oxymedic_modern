import React, { useRef, useState } from "react";
import { X, Printer, Check, Clock, Phone, MapPin, CreditCard, Calendar, Settings } from "lucide-react";

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
  const [printerMode, setPrinterMode] = useState(() => {
    const saved = localStorage.getItem('printerMode');
    return saved || 'standard';
  });

  const handlePrinterModeChange = () => {
    const newMode = printerMode === 'thermal' ? 'standard' : 'thermal';
    setPrinterMode(newMode);
    localStorage.setItem('printerMode', newMode);
  };

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
    if (printerMode === 'thermal') {
      printThermalReceipt();
    } else {
      printStandardReceipt();
    }
  };

  const printStandardReceipt = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank", "width=800,height=900");
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Reçu ${paiement.reference}</title>
      <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',Arial,sans-serif;background:white;color:#111;}
      @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact;}}
      </style></head><body>${content}</body></html>`);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); win.close(); }, 400);
  };

  const printThermalReceipt = () => {
    // Créer une fenêtre avec des dimensions optimales pour les tickets
    const win = window.open("", "_blank", "width=320,height=600,scrollbars=yes");
    
    const thermalContent = generateThermalReceipt();
    
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Reçu ${paiement.reference}</title>
      <style>
        @media print {
          @page {
            size: 80mm 200mm;
            margin: 2mm;
          }
          body {
            margin: 0;
            padding: 0;
            width: 76mm;
            font-family: 'Courier New', monospace;
            font-size: 9pt;
            line-height: 1.1;
          }
          .no-print {
            display: none !important;
          }
        }
        body {
          font-family: 'Courier New', monospace;
          background: white;
          color: black;
          width: 280px;
          max-width: 280px;
          margin: 0 auto;
          padding: 5px;
          font-size: 10px;
          line-height: 1.1;
        }
        .header { text-align: center; margin-bottom: 10px; }
        .logo-img { max-width: 60px; max-height: 30px; margin-bottom: 5px; }
        .company-name { font-size: 14px; font-weight: bold; margin-bottom: 3px; }
        .slogan { font-size: 9px; margin-bottom: 5px; }
        .divider { border-top: 1px solid black; margin: 8px 0; height: 1px; }
        .info-row { display: flex; justify-content: space-between; margin: 2px 0; }
        .center { text-align: center; }
        .right { text-align: right; }
        .bold { font-weight: bold; }
        .large { font-size: 12px; }
        .total { font-size: 14px; font-weight: bold; margin: 8px 0; }
        .footer { font-size: 8px; text-align: center; margin-top: 10px; }
      </style></head><body>
        <div class="no-print" style="padding: 20px; text-align: center;">
          <h3>Aperçu du ticket d'impression</h3>
          <p>Utilisez Ctrl+P ou Cmd+P pour imprimer</p>
          <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Imprimer</button>
          <hr style="margin: 20px 0;">
        </div>
        ${thermalContent}
      </body></html>`);
    win.document.close();
  };

  const generateThermalReceipt = () => {
    const soc = societe;
    const nomSoc = soc.nom || "OXYMEDIC";
    const slogan = soc.slogan || "Le confort médical à domicile";
    const logoUrl = soc.logo || "/Logo1.png";
    
    const client = paiement.client || {};
    const clientNom = typeof client === "object" ? `${client.prenom || ""} ${client.nom || ""}`.trim() : "—";
    const clientTel = client.tel || "";
    
    const receiptNum = `RCP-${paiement.reference}`;
    const now = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
    const time = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const isPaid = paiement.statut === "paid";
    
    return `
      <div class="header">
        <img src="${logoUrl}" alt="logo" class="logo-img" onerror="this.style.display='none';this.nextElementSibling.style.display='block';" />
        <div class="company-name" style="display:none;">${nomSoc.toUpperCase()}</div>
        <div class="slogan">${slogan}</div>
        ${soc.tel ? `<div>${soc.tel}</div>` : ''}
        ${soc.adresse ? `<div style="font-size:9px;">${soc.adresse}</div>` : ''}
      </div>
      
      <div class="divider"></div>
      
      <div class="center bold large">
        RECU DE PAIEMENT
      </div>
      
      <div class="info-row">
        <span>N°:</span>
        <span class="bold">${receiptNum}</span>
      </div>
      
      <div class="info-row">
        <span>Date:</span>
        <span>${now} ${time}</span>
      </div>
      
      <div class="info-row">
        <span>Mode:</span>
        <span>${MODE_LABELS[paiement.modePaiement] || paiement.modePaiement}</span>
      </div>
      
      <div class="info-row">
        <span>Type:</span>
        <span>${TYPE_LABELS[paiement.type] || paiement.type}</span>
      </div>
      
      <div class="divider"></div>
      
      <div class="info-row">
        <span>Client:</span>
        <span class="bold">${clientNom}</span>
      </div>
      
      ${clientTel ? `
      <div class="info-row">
        <span>Tel:</span>
        <span>${clientTel}</span>
      </div>
      ` : ''}
      
      <div class="divider"></div>
      
      <div class="info-row">
        <span>Montant:</span>
        <span class="bold">${fmt(paiement.montant)} MAD</span>
      </div>
      
      <div class="total right">
        TOTAL: ${fmt(paiement.montant)} MAD
      </div>
      
      <div class="divider"></div>
      
      <div class="center">
        <div style="margin-bottom:3px;">${isPaid ? 'PAYE' : 'ATTENTE'}</div>
        ${paiement.note ? `<div style="font-size:9px;font-style:italic;">"${paiement.note}"</div>` : ''}
      </div>
      
      ${paiement.banque || paiement.referenceBancaire ? `
      <div class="divider"></div>
      ${paiement.banque ? `<div class="info-row"><span>Banque:</span><span>${paiement.banque}</span></div>` : ''}
      ${paiement.referenceBancaire ? `<div class="info-row"><span>Ref:</span><span>${paiement.referenceBancaire}</span></div>` : ''}
      ` : ''}
      
      <div class="divider"></div>
      
      <div class="footer">
        <div>Merci pour votre confiance</div>
        ${soc.website ? `<div>${soc.website}</div>` : ''}
        ${soc.email ? `<div>${soc.email}</div>` : ''}
        ${soc.rc ? `<div>RC: ${soc.rc}</div>` : ''}
        ${soc.ice ? `<div>ICE: ${soc.ice}</div>` : ''}
      </div>
    `;
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
            <button 
              onClick={handlePrinterModeChange}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-600 text-white text-xs font-semibold rounded-lg hover:bg-slate-700 transition"
              title={printerMode === 'thermal' ? 'Basculer vers format A4' : 'Basculer vers format ticket caisse'}
            >
              <Settings size={13} />
              {printerMode === 'thermal' ? 'Ticket' : 'A4'}
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition">
              <Printer size={13} /> Imprimer
            </button>
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-5">
          {printerMode === 'standard' ? (
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
          ) : (
            <div style={{ fontFamily: "'Courier New',monospace", maxWidth: 280, margin: "0 auto", color: "#000", padding: "5px" }}>
              <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}>
                  <img src={logo} alt="logo" style={{ maxWidth: "60px", maxHeight: "30px" }} onError={(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='block'; }} />
                </div>
                <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "3px", display: "none", textAlign: "center" }}>{nomSoc.toUpperCase()}</div>
                <div style={{ fontSize: "9px", marginBottom: "5px" }}>{slogan}</div>
                {soc.tel && <div>{soc.tel}</div>}
                {soc.adresse && <div style={{ fontSize: "9px" }}>{soc.adresse}</div>}
              </div>
              
              <div style={{ borderTop: "1px solid #000", margin: "8px 0", height: "1px" }}></div>
              
              <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "12px", marginBottom: "8px" }}>
                RECU DE PAIEMENT
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", margin: "2px 0" }}>
                <span>N°:</span>
                <span style={{ fontWeight: "bold" }}>{receiptNum}</span>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", margin: "2px 0" }}>
                <span>Date:</span>
                <span>{now}</span>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", margin: "2px 0" }}>
                <span>Mode:</span>
                <span>{MODE_LABELS[paiement.modePaiement] || paiement.modePaiement}</span>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", margin: "2px 0" }}>
                <span>Type:</span>
                <span>{TYPE_LABELS[paiement.type] || paiement.type}</span>
              </div>
              
              <div style={{ borderTop: "1px solid #000", margin: "8px 0", height: "1px" }}></div>
              
              <div style={{ display: "flex", justifyContent: "space-between", margin: "2px 0" }}>
                <span>Client:</span>
                <span style={{ fontWeight: "bold" }}>{clientNom}</span>
              </div>
              
              {clientTel && (
                <div style={{ display: "flex", justifyContent: "space-between", margin: "2px 0" }}>
                  <span>Tel:</span>
                  <span>{clientTel}</span>
                </div>
              )}
              
              <div style={{ borderTop: "1px solid #000", margin: "8px 0", height: "1px" }}></div>
              
              <div style={{ display: "flex", justifyContent: "space-between", margin: "2px 0" }}>
                <span>Montant:</span>
                <span style={{ fontWeight: "bold" }}>{fmt(paiement.montant)} MAD</span>
              </div>
              
              <div style={{ fontSize: "14px", fontWeight: "bold", margin: "8px 0", textAlign: "right" }}>
                TOTAL: {fmt(paiement.montant)} MAD
              </div>
              
              <div style={{ borderTop: "1px solid #000", margin: "8px 0", height: "1px" }}></div>
              
              <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <div style={{ marginBottom: "3px" }}>{isPaid ? 'PAYE' : 'ATTENTE'}</div>
                {paiement.note && <div style={{ fontSize: "9px", fontStyle: "italic" }}>"{paiement.note}"</div>}
              </div>
              
              {(paiement.banque || paiement.referenceBancaire) && (
                <>
                  <div style={{ borderTop: "1px solid #000", margin: "8px 0", height: "1px" }}></div>
                  {paiement.banque && (
                    <div style={{ display: "flex", justifyContent: "space-between", margin: "2px 0" }}>
                      <span>Banque:</span>
                      <span>{paiement.banque}</span>
                    </div>
                  )}
                  {paiement.referenceBancaire && (
                    <div style={{ display: "flex", justifyContent: "space-between", margin: "2px 0" }}>
                      <span>Ref:</span>
                      <span>{paiement.referenceBancaire}</span>
                    </div>
                  )}
                </>
              )}
              
              <div style={{ borderTop: "1px solid #000", margin: "8px 0", height: "1px" }}></div>
              
              <div style={{ fontSize: "8px", textAlign: "center", marginTop: "10px" }}>
                <div>Merci pour votre confiance</div>
                {soc.website && <div>{soc.website}</div>}
                {soc.email && <div>{soc.email}</div>}
                {soc.rc && <div>RC: {soc.rc}</div>}
                {soc.ice && <div>ICE: {soc.ice}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaiementReceiptModal;