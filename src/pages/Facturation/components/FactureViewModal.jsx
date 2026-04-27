// src/pages/Facturation/components/FactureViewModal.jsx
import React from "react";
import { X, Download, User, Calendar, FileText, CreditCard } from "lucide-react";
import StatusBadge from "./StatusBadge";

const FactureViewModal = ({ isOpen, onClose, facture }) => {
  if (!isOpen || !facture) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const formatMontant = (montant) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR"
    }).format(montant || 0);
  };

  const handleDownload = () => {
    // Logique de téléchargement PDF à implémenter
    console.log("Téléchargement de la facture:", facture.numero);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-5 py-3 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <FileText size={18} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
                Facture {facture.numero}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                {formatDate(facture.dateFacture)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition"
              title="Télécharger PDF"
            >
              <Download size={14} />
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Informations client</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                    <User size={14} className="text-slate-600" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Client
                    </div>
                    <div className="text-sm font-medium text-slate-700">
                      {facture.clientNom}
                    </div>
                  </div>
                </div>
                {facture.clientEmail && (
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <FileText size={14} className="text-slate-600" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Email
                      </div>
                      <div className="text-sm text-slate-600">
                        {facture.clientEmail}
                      </div>
                    </div>
                  </div>
                )}
                {facture.clientAdresse && (
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <FileText size={14} className="text-slate-600" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Adresse
                      </div>
                      <div className="text-sm text-slate-600">
                        {facture.clientAdresse}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Détails facture</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Calendar size={14} className="text-amber-600" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Date facture
                    </div>
                    <div className="text-sm font-medium text-slate-700">
                      {formatDate(facture.dateFacture)}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <Calendar size={14} className="text-red-600" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Date échéance
                    </div>
                    <div className="text-sm font-medium text-slate-700">
                      {formatDate(facture.dateEcheance)}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <CreditCard size={14} className="text-purple-600" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Statut
                    </div>
                    <div className="flex items-center">
                      <StatusBadge status={facture.status} />
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                    <FileText size={14} className="text-slate-600" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Type
                    </div>
                    <div className="text-sm font-medium text-slate-700 capitalize">
                      {facture.type}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lignes de facture */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Lignes de facture</h4>
            <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                      Description
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                      Quantité
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                      Prix unitaire
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {facture.lignes?.map((ligne, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {ligne.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-center">
                        {ligne.quantite}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700 text-right">
                        {formatMontant(ligne.prixUnitaire)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900 text-right">
                        {formatMontant(ligne.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-white border-t border-slate-200">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-sm font-bold text-slate-700 text-right">
                      Total TTC
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-900 text-right">
                      {formatMontant(facture.montantTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Notes */}
          {facture.notes && (
            <div>
              <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Notes</h4>
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <p className="text-sm text-slate-600">{facture.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default FactureViewModal;
