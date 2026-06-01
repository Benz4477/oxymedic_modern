import React, { useRef, useState } from "react";
import { X, Printer, ArrowLeft } from "lucide-react";

const fmtD = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "—";

const TransfertSlipModal = ({ isOpen, onClose, transfert, societe = {} }) => {
    const printRef = useRef();
    const [logoError, setLogoError] = useState(false);

    if (!isOpen || !transfert) return null;

    const soc = societe;
    const logo = soc.logo || "/Logo1.png";
    const nomSoc = soc.nom || "OXYMEDIC";
    const ref = transfert.reference || "—";

    const s = {
        th: {
            padding: "12px 14px",
            textAlign: "left",
            fontSize: 9,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".07em",
            color: "#4B5563",
            background: "#F3F4F6",
            border: "1px solid #E5E7EB"
        },
        td: {
            padding: "12px 14px",
            fontSize: 13,
            border: "1px solid #E5E7EB",
            verticalAlign: "middle"
        },
        mono: {
            fontFamily: "monospace",
            fontWeight: "700"
        },
    };

    const piedLigne1 = [
        soc.adresse && soc.tel ? `Casablanca (SAV): ${soc.adresse} / Tél: ${soc.tel}` : null,
        soc.adresse2 && soc.tel_mag ? `${soc.ville2 || "Kénitra"} (MAG): ${soc.adresse2} / Tél: ${soc.tel_mag}` : null,
    ].filter(Boolean).join(" I ");

    const piedLigne2 = [
        soc.siege ? `Siège: ${soc.siege}` : null,
        soc.rc ? `RC: ${soc.rc}` : null,
        soc.ice ? `ICE: ${soc.ice}` : null,
        soc.if_fisc ? `IF: ${soc.if_fisc}` : null,
        soc.patente ? `Patente: ${soc.patente}` : null,
    ].filter(Boolean).join(" I ");

    const handlePrint = () => {
        const content = printRef.current.innerHTML;
        const win = window.open("", "_blank", "width=850,height=900");
        win.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Bon de Transfert ${ref}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Arial, sans-serif; background: white; color: #111; padding: 20px; }
                    @media print {
                        body { print-color-adjust: exact; -webkit-print-color-adjust: exact; padding: 10px; }
                    }
                </style>
            </head>
            <body>${content}</body>
            </html>
        `);
        win.document.close();
        setTimeout(() => {
            win.focus();
            win.print();
            win.close();
        }, 400);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                    <h3 className="text-sm font-extrabold text-slate-900">
                        📦 Bon de transfert — {ref}
                    </h3>
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition">
                            <Printer size={12} /> Imprimer
                        </button>
                        <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* Body / Aperçu PDF */}
                <div className="overflow-y-auto flex-1 p-5 bg-slate-50">
                    <div ref={printRef} className="bg-white p-10 shadow-sm rounded-lg mx-auto" style={{ fontFamily: "'Segoe UI',Arial,sans-serif", maxWidth: 680, color: "#111" }}>

                        {/* Bloc Logo & Website */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                            <div style={{ width: 160, height: 80, display: "flex", alignItems: "center" }}>
                                {!logoError ? (
                                    <img src={logo} alt="logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} onError={() => setLogoError(true)} />
                                ) : (
                                    <span style={{ fontSize: 22, fontWeight: 700, color: "#16A34A" }}>{nomSoc}</span>
                                )}
                            </div>
                            {soc.website && <div style={{ fontSize: 10, color: "#9CA3AF" }}>{soc.website}</div>}
                        </div>

                        {/* Titre & Ref */}
                        <div style={{ marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #E5E7EB" }}>
                            <div style={{ fontSize: 24, fontWeight: 700, color: "#16A34A" }}>Bon de Transfert Inter-Sites</div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#4B5563", marginTop: 4 }}>
                                <div><strong>Référence : </strong><span style={s.mono}>{ref}</span></div>
                                <div><strong>Date : </strong>{fmtD(transfert.createdAt)}</div>
                            </div>
                        </div>

                        {/* De -> Vers (Route logistique premium) */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                            <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: "12px 16px", background: "#F9FAFB" }}>
                                <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "#9CA3AF", marginBottom: 4 }}>Origine (Expéditeur)</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{transfert.sourceMagasin?.nom}</div>
                                <div style={{ fontSize: 12, color: "#6B7280" }}>{transfert.sourceMagasin?.ville}, Maroc</div>
                            </div>
                            <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: "12px 16px", background: "#F0FDF4", borderColor: "#DCFCE7" }}>
                                <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "#16A34A", marginBottom: 4 }}>Destination (Destinataire)</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: "#15803D" }}>{transfert.targetMagasin?.nom}</div>
                                <div style={{ fontSize: 12, color: "#166534" }}>{transfert.targetMagasin?.ville}, Maroc</div>
                            </div>
                        </div>

                        {/* Tableau des items */}
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                            <thead>
                                <tr>
                                    <th style={s.th}>Type</th>
                                    <th style={s.th}>Désignation / Article</th>
                                    <th style={{ ...s.th, textAlign: "center" }}>S/N ou Quantité</th>
                                    <th style={{ ...s.th, textAlign: "center" }}>État</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transfert.items?.map((item, idx) => (
                                    <tr key={idx}>
                                        <td style={{ ...s.td, fontSize: 10, fontWeight: "bold", color: "#4B5563" }}>
                                            {item.type === "unit" ? "📦 MACHINE" : "💊 CONSO"}
                                        </td>
                                        <td style={s.td}>
                                            <div style={{ fontWeight: 600, fontSize: 14 }}>
                                                {item.type === "unit" ? item.equipement?.name : item.consommable?.name}
                                            </div>
                                        </td>
                                        <td style={{ ...s.td, textAlign: "center", ...s.mono, fontSize: 13, color: item.type === "unit" ? "#7C3AED" : "#111" }}>
                                            {item.type === "unit" ? item.unite?.serial : `Qté: ${item.quantity}`}
                                        </td>
                                        <td style={{ ...s.td, textAlign: "center", fontSize: 12, color: "#6B7280" }}>
                                            {item.type === "unit" ? "En bon état" : "Neuf / Scellé"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Informations de transport (Logistique) */}
                        <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: "12px 16px", marginBottom: 24 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "#9CA3AF", marginBottom: 8 }}>Informations de Transport / Chauffeur</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: "600" }}>Chauffeur</span>
                                    <span style={{ fontSize: 12, color: "#111", fontWeight: "700", marginTop: 2 }}>{transfert.logistique?.chauffeur || "—"}</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: "600" }}>Véhicule</span>
                                    <span style={{ fontSize: 12, color: "#111", fontWeight: "700", marginTop: 2 }}>{transfert.logistique?.vehicule || "—"}</span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: "600" }}>Matricule</span>
                                    <span style={{ fontSize: 12, color: "#111", fontWeight: "700", marginTop: 2 }}>{transfert.logistique?.matricule || "—"}</span>
                                </div>
                            </div>
                            {transfert.notes && (
                                <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #F3F4F6" }}>
                                    <span style={{ fontSize: 10, color: "#9CA3AF", fontWeight: "600" }}>Instructions / Notes :</span>
                                    <p style={{ fontSize: 12, color: "#374151", marginTop: 2, fontStyle: "italic" }}>{transfert.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Signatures Tripartites */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 30, marginTop: 40 }}>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Visa Expéditeur</div>
                                <div style={{ marginBottom: 40 }}>&nbsp;</div>
                                <div style={{ borderTop: "1px solid #9CA3AF", paddingTop: 4, fontSize: 10, color: "#9CA3AF" }}>Signature</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Visa Chauffeur</div>
                                <div style={{ marginBottom: 40 }}>&nbsp;</div>
                                <div style={{ borderTop: "1px solid #9CA3AF", paddingTop: 4, fontSize: 10, color: "#9CA3AF" }}>Signature</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Visa Réceptionnaire</div>
                                <div style={{ marginBottom: 40 }}>&nbsp;</div>
                                <div style={{ borderTop: "1px solid #9CA3AF", paddingTop: 4, fontSize: 10, color: "#9CA3AF" }}>Signature</div>
                            </div>
                        </div>

                        {/* Pied de page */}
                        <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 10, marginTop: 20 }}>
                            {piedLigne1 && <div style={{ fontSize: 9, color: "#6B7280", textAlign: "center", marginBottom: 3 }}>{piedLigne1}</div>}
                            {piedLigne2 && <div style={{ fontSize: 9, color: "#6B7280", textAlign: "center", marginBottom: 3 }}>{piedLigne2}</div>}
                            {soc.email && <div style={{ fontSize: 9, color: "#6B7280", textAlign: "center" }}>E-mail: {soc.email}</div>}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default TransfertSlipModal;
