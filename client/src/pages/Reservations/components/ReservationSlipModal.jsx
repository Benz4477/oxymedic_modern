import React, { useRef, useState } from "react";
import { X, Printer } from "lucide-react";

const fmtD = (d) => {
    if (!d) return "—";
    // Si c'est déjà au format DD/MM/YYYY
    if (typeof d === "string" && d.includes("/")) return d;
    return new Date(d).toLocaleDateString("fr-FR");
};

const ReservationSlipModal = ({ isOpen, onClose, reservation, societe = {} }) => {
    const printRef = useRef();
    const [logoError, setLogoError] = useState(false);

    if (!isOpen || !reservation) return null;

    const soc = societe;
    const nomSoc = soc.nom || "OXYMEDIC";
    const logo = soc.logo || "/Logo1.png";

    const client = reservation.client || {};
    const clientNom = `${client.prenom || ""} ${client.nom || ""}`.trim() || "Client inconnu";
    const clientTel = client.tel || "";
    const clientAdr = client.adresse || "";

    const equip = reservation.equipement || {};
    const equipNom = equip.name || "Équipement";
    const equipRef = equip.ref || equip.reference || "—";

    const ref = reservation.num || `RES-${reservation.id}`;
    const dateCreation = reservation.createdAt || fmtD(new Date());

    const s = {
        th: { padding: "12px 15px", textAlign: "left", fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#64748b", background: "#f8fafc", border: "1px solid #e2e8f0" },
        td: { padding: "12px 15px", fontSize: 13, border: "1px solid #e2e8f0", verticalAlign: "middle" },
    };

    const handlePrint = () => {
        const content = printRef.current.innerHTML;
        const win = window.open("", "_blank", "width=850,height=1100");
        win.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Bon de Réservation ${ref}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Arial, sans-serif; background: white; color: #111; padding: 40px; line-height: 1.5; }
                    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
                    .logo-box { width: 200px; }
                    .client-box { text-align: right; }
                    .title-section { margin-bottom: 30px; border-bottom: 2px solid #10b981; padding-bottom: 15px; }
                    .title { font-size: 24px; font-weight: 800; color: #064e3b; text-transform: uppercase; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    .notes-section { border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 30px; background: #f8fafc; }
                    .signatures { display: flex; justify-content: space-between; margin-top: 60px; }
                    .sig-box { width: 250px; border-top: 1px solid #cbd5e1; padding-top: 10px; text-align: center; font-size: 12px; font-weight: 700; color: #64748b; }
                    .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px dashed #e2e8f0; paddingTop: 20px; }
                    @media print {
                        body { padding: 20px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                ${content}
            </body>
            </html>
        `);
        win.document.close();
        setTimeout(() => {
            win.focus();
            win.print();
            win.close();
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div>
                        <h3 className="text-lg font-black text-slate-900">Aperçu du Bon de Réservation</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{ref}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-xs font-black rounded-xl hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 transition-all active:scale-95"
                        >
                            <Printer size={16} /> Imprimer le Bon
                        </button>
                        <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Modal Body / Print Content */}
                <div className="overflow-y-auto flex-1 p-8 bg-slate-50/50">
                    <div ref={printRef} className="bg-white p-10 shadow-sm border border-slate-200 rounded-lg mx-auto" style={{ width: "100%", maxWidth: "800px" }}>
                        
                        {/* Header Section */}
                        <div className="header" style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
                            <div className="logo-box">
                                {!logoError ? (
                                    <img src={logo} alt="Oxymedic" style={{ maxWidth: "180px" }} onError={() => setLogoError(true)} />
                                ) : (
                                    <span style={{ fontSize: "24px", fontWeight: "900", color: "#059669" }}>{nomSoc}</span>
                                )}
                            </div>
                            <div className="client-box" style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "5px" }}>Destinataire</div>
                                <div style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>{clientNom}</div>
                                <div style={{ fontSize: "13px", color: "#64748b" }}>{clientTel}</div>
                                <div style={{ fontSize: "13px", color: "#64748b" }}>{clientAdr}</div>
                            </div>
                        </div>

                        {/* Title Section */}
                        <div className="title-section" style={{ borderBottom: "2px solid #10b981", paddingBottom: "15px", marginBottom: "30px" }}>
                            <h2 className="title" style={{ fontSize: "24px", fontWeight: "800", color: "#064e3b", textTransform: "uppercase" }}>Bon de Réservation</h2>
                            <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
                                <div style={{ fontSize: "12px", color: "#64748b" }}>Réf: <strong>{ref}</strong></div>
                                <div style={{ fontSize: "12px", color: "#64748b" }}>Date: <strong>{dateCreation}</strong></div>
                            </div>
                        </div>

                        {/* Details Table */}
                        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
                            <thead>
                                <tr>
                                    <th style={s.th}>Désignation de l'Équipement</th>
                                    <th style={s.th}>Référence</th>
                                    <th style={{ ...s.th, textAlign: "center" }}>Période</th>
                                    <th style={{ ...s.th, textAlign: "right" }}>Montant</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={s.td}>
                                        <div style={{ fontWeight: "700", color: "#0f172a" }}>{equipNom}</div>
                                        <div style={{ fontSize: "11px", color: "#64748b" }}>Réservation confirmée</div>
                                    </td>
                                    <td style={s.td}>{equipRef}</td>
                                    <td style={{ ...s.td, textAlign: "center" }}>
                                        <div style={{ fontSize: "12px", fontWeight: "700" }}>Du {reservation.startDate}</div>
                                        <div style={{ fontSize: "12px", fontWeight: "700" }}>Au {reservation.endDate}</div>
                                    </td>
                                    <td style={{ ...s.td, textAlign: "right", fontWeight: "800", color: "#0f172a" }}>
                                        {reservation.montant?.toLocaleString("fr-FR")} DH
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Note Section */}
                        <div className="notes-section" style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "15px", marginBottom: "30px", background: "#f8fafc" }}>
                            <div style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", color: "#94a3b8", marginBottom: "5px" }}>Note Importante</div>
                            <p style={{ fontSize: "11px", color: "#475569" }}>
                                Ce bon confirme la réservation et le blocage du matériel cité ci-dessus pour la période indiquée. 
                                Ce document ne constitue pas un contrat de location définitif. Le contrat de location sera établi 
                                au moment de l'enlèvement ou de la livraison du matériel.
                            </p>
                            {reservation.notes && (
                                <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px dashed #cbd5e1" }}>
                                    <div style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", color: "#94a3b8" }}>Observations :</div>
                                    <p style={{ fontSize: "11px", color: "#475569" }}>{reservation.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Signatures */}
                        <div className="signatures" style={{ display: "flex", justifyContent: "space-between", marginTop: "60px" }}>
                            <div className="sig-box" style={{ width: "200px", borderTop: "1px solid #cbd5e1", paddingTop: "10px", textAlign: "center" }}>
                                <div style={{ fontSize: "10px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase" }}>Cachet Oxymedic</div>
                            </div>
                            <div className="sig-box" style={{ width: "200px", borderTop: "1px solid #cbd5e1", paddingTop: "10px", textAlign: "center" }}>
                                <div style={{ fontSize: "10px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase" }}>Signature Client</div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="footer" style={{ marginTop: "60px", textAlign: "center", fontSize: "10px", color: "#94a3b8", borderTop: "1px dashed #e2e8f0", paddingTop: "20px" }}>
                            <div>{soc.nom} - {soc.adresse}</div>
                            <div>Tél: {soc.tel} - Email: {soc.email}</div>
                            <div style={{ marginTop: "5px", fontWeight: "700" }}>Merci de votre confiance.</div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationSlipModal;
