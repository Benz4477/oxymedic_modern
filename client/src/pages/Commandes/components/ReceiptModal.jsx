import React, { useRef, useState } from "react";
import { X, Printer } from "lucide-react";

const fmt    = (n) => (n || 0).toLocaleString("fr-FR");
const fmtD   = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "—";
const fmtDLong = (d) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—";

const ReceiptModal = ({ isOpen, onClose, commande, societe = {} }) => {
  const printRef = useRef();
  const [logoError, setLogoError]   = useState(false);
  const [equipError, setEquipError] = useState(false);

  if (!isOpen || !commande) return null;

  const soc     = societe;
  const nomSoc  = soc.nom  || "OXYMEDIC";
  const logo    = soc.logo || "/Logo1.png";

  const ref    = commande.reference || "—";
  const now    = fmtDLong(new Date());
  const isPaid = commande.statut === "ended";

  const client      = commande.client || {};
  const clientNom   = `${client.prenom || ""} ${client.nom || ""}`.trim() || "—";
  const clientAdr   = client.adresse   || "";
  const clientVille = client.quartier  || client.ville || "Casablanca";

  const equip      = commande.equipement || {};
  const equipNom   = equip.name  || "Équipement";
  const equipIcon  = equip.icon  || "🏥";
  const equipPhoto = equip.photo || "";
  const equipRef   = equip.ref   || equip.reference || "—";
  const equipCat   = equip.cat   || "—";

  const unite  = commande.unite || {};
  const serial = typeof unite === "object" ? unite.serial : null;

  const montantTTC     = commande.montantTTC     || 0;
  const montantHT      = commande.montantHT      || 0;
  const montantTVA     = commande.montantTVA     || 0;
  const montantCaution = commande.montantCaution || 0;
  const totalGeneral   = montantTTC + montantCaution;
  const modePaiement   = (commande.modePaiement || "").replace(/_/g, " ");

  const dateDebut = fmtD(commande.dateDebut);
  const dateFin   = fmtD(commande.dateFin);

  // ── Pied de page légal ────────────────────────────────
  const piedLigne1 = [
    soc.adresse  && soc.tel     ? `Casablanca (SAV): ${soc.adresse} / Tél: ${soc.tel}`                        : null,
    soc.adresse2 && soc.tel_mag ? `${soc.ville2 || "Kénitra"} (MAG): ${soc.adresse2} / Tél: ${soc.tel_mag}` : null,
  ].filter(Boolean).join(" I ");

  const piedLigne2 = [
    soc.siege   ? `Siège: ${soc.siege}`         : null,
    soc.rc      ? `RC: ${soc.rc}`               : null,
    soc.ice     ? `ICE: ${soc.ice}`             : null,
    soc.if_fisc ? `IF: ${soc.if_fisc}`          : null,
    soc.patente ? `Patente: ${soc.patente}`     : null,
  ].filter(Boolean).join(" I ");

  const s = {
    mono: { fontFamily: "monospace" },
    th: {
      padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600,
      textTransform: "uppercase", letterSpacing: ".07em", color: "#9CA3AF", background: "#F9FAFB",
    },
    td: { padding: "14px 16px", fontSize: 13, borderTop: "1px solid #F3F4F6" },
  };

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank", "width=800,height=1000");
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Reçu ${ref}</title>
      <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Segoe UI',Arial,sans-serif;background:white;color:#111;}
      @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact;}}
      </style></head><body>${content}</body></html>`);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); win.close(); }, 400);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Header modal */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">🧾</span>
            <h3 className="text-sm font-semibold text-slate-800">Reçu — {ref}</h3>
          </div>
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

            {/* ── En-tête : Logo gauche + site web droite ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ width: 180, height: 90, display: "flex", alignItems: "center" }}>
                {!logoError
                  ? <img src={logo} alt="logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onError={() => setLogoError(true)} />
                  : <span style={{ fontSize: 24, fontWeight: 700, color: "#15803D" }}>{nomSoc}</span>
                }
              </div>
              {soc.website && <div style={{ fontSize: 11, color: "#9CA3AF" }}>{soc.website}</div>}
            </div>

            {/* ── Client aligné à droite ── */}
            <div style={{ textAlign: "right", marginBottom: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{clientNom}</div>
              {clientAdr   && <div style={{ fontSize: 12, color: "#6B7280" }}>{clientAdr}</div>}
              <div style={{ fontSize: 12, color: "#6B7280" }}>{clientVille}</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Maroc</div>
              <div style={{ fontSize: 12, color: "#374151", marginTop: 8 }}>
                <strong>Période de location :</strong><br />
                {dateDebut} → {dateFin}
              </div>
            </div>

            {/* ── Titre ── */}
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E5E7EB" }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#16A34A" }}>Location {ref}</div>
              {soc.vendeur_defaut && (
                <div style={{ fontSize: 13, color: "#374151", marginTop: 6 }}>
                  <strong>Vendeur : </strong>{soc.vendeur_defaut}
                </div>
              )}
              <div style={{ display: "flex", gap: 40, marginTop: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#D97706" }}>Date du reçu</div>
                  <div style={{ fontSize: 13 }}>{now}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#D97706" }}>Échéance</div>
                  <div style={{ fontSize: 13 }}>{dateFin}</div>
                </div>
                {modePaiement && (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#D97706" }}>Mode paiement</div>
                    <div style={{ fontSize: 13, textTransform: "capitalize" }}>{modePaiement}</div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Tableau produits ── */}
            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #E5E7EB", marginBottom: 16 }}>
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
                {/* Ligne équipement */}
                <tr>
                  <td style={{ ...s.td, width: 70 }}>
                    {equipPhoto && !equipError ? (
                      <img
                        src={equipPhoto}
                        alt={equipNom}
                        style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6, border: "1px solid #E5E7EB" }}
                        onError={() => setEquipError(true)}
                      />
                    ) : (
                      <span style={{ fontSize: 32 }}>{equipIcon}</span>
                    )}
                  </td>
                  <td style={{ ...s.td, fontFamily: "monospace", fontSize: 12, color: "#6B7280" }}>
                    {equipRef}
                  </td>
                  <td style={{ ...s.td }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{equipNom}</div>
                    {equipCat && <div style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}>{equipCat}</div>}
                    {serial && (
                      <div style={{ fontSize: 11, fontFamily: "monospace", color: "#7C3AED", marginTop: 3 }}>
                        {serial}
                      </div>
                    )}
                  </td>
                  <td style={{ ...s.td, textAlign: "center" }}>1,00<br /><span style={{ fontSize: 11, color: "#6B7280" }}>Unité(s)</span></td>
                  <td style={{ ...s.td, textAlign: "right", fontFamily: "monospace", fontSize: 14 }}>{fmt(montantTTC)} MAD</td>
                  <td style={{ ...s.td, textAlign: "right", fontWeight: 600, fontFamily: "monospace", fontSize: 14 }}>{fmt(montantTTC)} MAD</td>
                </tr>
                {/* Ligne caution */}
                {montantCaution > 0 && (
                  <tr style={{ background: "#FFFBEB" }}>
                    <td style={s.td} />
                    <td style={{ ...s.td, fontSize: 12, color: "#92400E", fontFamily: "monospace" }}>CAUTION</td>
                    <td style={{ ...s.td, color: "#92400E", fontSize: 13 }}>Caution Restituable à la fin de la location</td>
                    <td style={{ ...s.td, textAlign: "center", color: "#92400E" }}>1,00<br /><span style={{ fontSize: 11 }}>Unité(s)</span></td>
                    <td style={{ ...s.td, textAlign: "right", fontFamily: "monospace", fontSize: 14, color: "#D97706" }}>{fmt(montantCaution)} MAD</td>
                    <td style={{ ...s.td, textAlign: "right", fontWeight: 600, fontFamily: "monospace", fontSize: 14, color: "#D97706" }}>{fmt(montantCaution)} MAD</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* ── Totaux ── */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
              {/* Caution à gauche */}
              {montantCaution > 0 && (
                <div style={{ flex: "0 0 220px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "14px 16px", fontSize: 13 }}>
                  <div style={{ fontWeight: 700, color: "#92400E" }}>Caution Restituable à</div>
                  <div style={{ fontWeight: 700, color: "#92400E" }}>la fin de la location</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#D97706", marginTop: 8 }}>{fmt(montantCaution)} MAD</div>
                </div>
              )}
              {/* Totaux à droite */}
              <div style={{ flex: 1 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr style={{ background: "#F9FAFB" }}>
                      <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 600, color: "#374151" }}>Sous-total</td>
                      <td style={{ padding: "10px 16px", textAlign: "right", fontSize: 13, fontWeight: 600, fontFamily: "monospace" }}>{fmt(montantTTC)} MAD</td>
                    </tr>
                    <tr style={{ background: "#F0FDF4", borderTop: "2px solid #BBF7D0" }}>
                      <td style={{ padding: "12px 16px", fontSize: 16, fontWeight: 700, color: "#15803D" }}>Total Global</td>
                      <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 16, fontWeight: 700, color: "#15803D", fontFamily: "monospace" }}>{fmt(totalGeneral)} MAD</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Signatures — même ligne, bordure alignée ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, marginBottom: 28, marginTop: 12 }}>
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

            {/* ── Pied de page légal ── */}
            <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 12, marginTop: 10 }}>
              {piedLigne1 && (
                <div style={{ fontSize: 8, color: "#6B7280", textAlign: "center", marginBottom: 4 }}>{piedLigne1}</div>
              )}
              {piedLigne2 && (
                <div style={{ fontSize: 8, color: "#6B7280", textAlign: "center", marginBottom: 4 }}>{piedLigne2}</div>
              )}
              {soc.email && (
                <div style={{ fontSize: 8, color: "#6B7280", textAlign: "center" }}>E-mail: {soc.email}</div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;