import React, { useRef, useState } from "react";
import { X, Printer, Check, Clock, Phone, MapPin, CreditCard, Calendar, FileText, CheckCircle, User } from "lucide-react";

const fmt     = (n) => (n || 0).toLocaleString("fr-FR");
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—";

const STATUS_LABELS = {
  draft: "Brouillon",
  pending_signature: "En attente signature",
  signed: "Signé",
  archived: "Archivé",
};

const TYPE_LABELS = {
  location: "📋 Location",
  renouvellement: "🔄 Renouvellement",
  essai: "🔬 Essai",
  vente: "🏷️ Vente",
};

const ViewContratModal = ({ isOpen, onClose, contrat, onSign, societe = {} }) => {
  const printRef = useRef();
  const [logoError, setLogoError] = useState(false);

  if (!isOpen || !contrat) return null;

  const soc    = societe;
  const nomSoc = soc.nom    || "OXYMEDIC";
  const slogan = soc.slogan || "Le confort médical à domicile";
  const logo   = soc.logo   || "/Logo1.png";

  const contratNum = contrat.reference;
  const now        = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  const isSigned   = contrat.statut === "signed";

  // Client
  const clientNom = contrat.clientNom || "—";
  const clientTel = contrat.clientTel || "";
  const clientEmail = contrat.clientEmail || "";
  const clientAdr = contrat.clientAdresse || "";

  // Commande liée
  const commande = contrat.commande || null;
  const cmdRef   = commande ? commande.reference : null;
  const cmdMontant = commande ? commande.montantTTC : null;
  const cmdDateDebut = commande ? new Date(commande.dateDebut).toLocaleDateString("fr-FR") : null;
  const cmdDateFin = commande ? new Date(commande.dateFin).toLocaleDateString("fr-FR") : null;

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
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Contrat ${contrat.reference}</title>
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
                <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: isSigned ? "#F0FDF4" : "#FFFBEB", color: isSigned ? "#15803D" : "#B45309", border: `1px solid ${isSigned ? "#BBF7D0" : "#FDE68A"}` }}>
                  {isSigned ? <Check size={12} /> : <Clock size={12} />}
                  {isSigned ? "SIGNÉ" : "EN ATTENTE"}
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
              <div style={{ fontSize: 26, fontWeight: 700, color: "#16A34A" }}>{TYPE_LABELS[contrat.type] || "Contrat"}</div>
              <div style={{ fontSize: 13, fontFamily: "monospace", color: "#374151", marginTop: 6 }}>{contratNum}</div>
              <div style={{ display: "flex", gap: 40, marginTop: 12 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#D97706" }}>Date création</span>
                  <div style={{ fontSize: 13 }}>{new Date(contrat.createdAt).toLocaleDateString("fr-FR")}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#D97706" }}>Statut</span>
                  <div style={{ fontSize: 13 }}>{STATUS_LABELS[contrat.statut] || contrat.statut}</div>
                </div>
                {contrat.dateSignature && (
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#D97706" }}>Date signature</span>
                    <div style={{ fontSize: 13 }}>{new Date(contrat.dateSignature).toLocaleDateString("fr-FR")}</div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Tableau du contrat ── */}
            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  <th style={s.th}>Description</th>
                  <th style={s.th}>Client</th>
                  <th style={{ ...s.th, textAlign: "right" }}>Info</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...s.td, fontSize: 14 }}>Contrat de location</td>
                  <td style={{ ...s.td, fontSize: 14 }}>{clientNom}</td>
                  <td style={{ ...s.td, textAlign: "right", fontWeight: 700, fontFamily: "monospace", fontSize: 16, color: "#16A34A" }}>
                    {cmdMontant ? fmt(cmdMontant) + " MAD" : "—"}
                  </td>
                </tr>
              </tbody>
              {cmdMontant && (
                <tfoot>
                  <tr style={{ background: "#F0FDF4", borderTop: "2px solid #BBF7D0" }}>
                    <td colSpan={2} style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: "#15803D" }}>
                      MONTANT TOTAL
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right", fontSize: 18, fontWeight: 900, fontFamily: "monospace", color: "#15803D" }}>
                      {fmt(cmdMontant)} MAD
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>

            {/* ── Description ── */}
            <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, padding: "16px 18px", marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 12, color: "#6B7280", fontSize: 11, textTransform: "uppercase", letterSpacing: ".05em" }}>Description</div>
              
              {/* Coordonnées client */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Coordonnées client</div>
                <div style={s.infoRow}><User size={12} /> {clientNom}</div>
                {clientTel && <div style={s.infoRow}><Phone size={12} /> {clientTel}</div>}
                {clientEmail && <div style={s.infoRow}><CreditCard size={12} /> {clientEmail}</div>}
                {clientAdr && <div style={s.infoRow}><MapPin size={12} /> {clientAdr}</div>}
              </div>

              {/* Ligne de séparation */}
              {commande && <div style={{ borderTop: "1px dashed #D1D5DB", margin: "12px 0" }}></div>}

              {/* Commande liée */}
              {commande && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Commande liée</div>
                  <div style={s.infoRow}><FileText size={12} /> Référence: <span style={{ fontFamily: "monospace", color: "#0369A1" }}>{cmdRef}</span></div>
                  <div style={s.infoRow}><Calendar size={12} /> Période: {cmdDateDebut} au {cmdDateFin}</div>
                </div>
              )}
            </div>

            {/* ── Conditions spéciales ── */}
            {contrat.conditionsSpeciales && (
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#92400E" }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Conditions spéciales :</div>
                <div style={{ fontStyle: "italic", whiteSpace: "pre-wrap" }}>{contrat.conditionsSpeciales}</div>
              </div>
            )}

            {/* ── Signature info ── */}
            {contrat.signature?.image && (
              <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "#15803D", fontWeight: 600, marginBottom: 6 }}>✓ Signé électroniquement</div>
                <div style={{ fontSize: 12, color: "#166534" }}>
                  Le {new Date(contrat.signature.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  {contrat.signature.ip && ` - IP: ${contrat.signature.ip}`}
                </div>
              </div>
            )}

            {/* ── Signatures ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, marginBottom: 28, marginTop: 20 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Signature de la société</div>
                <div style={{ fontSize: 12, color: "#374151", marginBottom: 48 }}>{nomSoc}</div>
                <div style={{ borderTop: "1px solid #9CA3AF", paddingTop: 6, fontSize: 11, color: "#9CA3AF" }}>Signature & Cachet</div>
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

        {/* Actions */}
        <div className="flex gap-3 justify-end px-5 py-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
          >
            Fermer
          </button>
          {contrat.statut !== "signed" && (
            <button
              onClick={() => onSign(contrat)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition flex items-center gap-2"
            >
              <CheckCircle size={16} />
              Signer le contrat
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewContratModal;
