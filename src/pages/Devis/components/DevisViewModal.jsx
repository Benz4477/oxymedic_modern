// src/pages/Devis/components/DevisViewModal.jsx
import React from "react";
import { X, Download, Send, Calendar, User, Euro, Clock, FileText, Edit, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";

const DevisViewModal = ({ isOpen, onClose, devis = null, onEdit, onDelete, onConvert, onSend }) => {
  if (!isOpen || !devis) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0);
  };

  const handleDownload = () => {
    window.open(`/devis/${devis.id}/pdf`, '_blank');
  };

  const handleSend = async () => {
    try {
      await onSend(devis);
      alert("Devis envoyé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      alert("Erreur lors de l'envoi du devis");
    }
  };

  const handleConvert = async () => {
    try {
      await onConvert(devis.id);
      alert("Devis converti en facture avec succès");
    } catch (error) {
      console.error("Erreur lors de la conversion:", error);
      alert("Erreur lors de la conversion du devis");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce devis ?")) return;
    
    try {
      await onDelete(devis.id);
      alert("Devis supprimé avec succès");
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression du devis");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto m-4">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Détails du devis {devis.reference}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={devis.status} />
                <span className="text-sm text-slate-500">
                  Créé le {formatDate(devis.createdAt)}
                </span>
              </div>
            </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Informations générales</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Référence:</span>
                  <span className="text-sm font-medium text-slate-900">{devis.reference}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Client:</span>
                  <span className="text-sm font-medium text-slate-900">{devis.clientName}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Date:</span>
                  <span className="text-sm font-medium text-slate-900">{formatDate(devis.date)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Validité:</span>
                  <span className="text-sm font-medium text-slate-900">{formatDate(devis.validity)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Montant total:</span>
                  <span className="text-lg font-bold text-emerald-600">{formatCurrency(devis.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Commande liée */}
            {devis.cmdRef && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Commande liée</h3>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <span className="text-sm font-medium text-slate-900">{devis.cmdRef}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {devis.description && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Description</h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{devis.description}</p>
              </div>
            </div>
          )}

          {/* Lignes du devis */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Lignes du devis</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Description</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Quantité</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Prix HT</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Total HT</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">TVA</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-700 uppercase tracking-wider">Total TTC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {devis.lignes?.map((ligne, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-700">{ligne.description}</td>
                      <td className="px-4 py-3 text-sm text-slate-900 text-center">{ligne.quantite}</td>
                      <td className="px-4 py-3 text-sm text-slate-900 text-right">{formatCurrency(ligne.prixHT)}</td>
                      <td className="px-4 py-3 text-sm text-slate-900 text-right">{formatCurrency(ligne.totalHT)}</td>
                      <td className="px-4 py-3 text-sm text-slate-900 text-center">{ligne.tvaRate}%</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900 text-right">
                        {formatCurrency(ligne.totalHT * (1 + ligne.tvaRate / 100))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          {devis.notes && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Notes</h3>
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{devis.notes}</p>
              </div>
            </div>
          )}

          {/* Résumé financier */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Résumé financier</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Total HT:</span>
                <span className="text-lg font-bold text-slate-900">
                  {formatCurrency(devis.totalAmount * 0.8)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">TVA ({devis.tvaRate || 20}%):</span>
                <span className="text-lg font-bold text-slate-900">
                  {formatCurrency(devis.totalAmount * 0.2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <span className="text-sm font-semibold text-slate-900">Total TTC:</span>
                <span className="text-xl font-bold text-emerald-600">
                  {formatCurrency(devis.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center p-6 border-t border-slate-200 bg-slate-50">
          <div className="text-xs text-slate-500">
            {devis.status === 'draft' && "En attente d'envoi"}
            {devis.status === 'sent' && "En attente de réponse"}
            {devis.status === 'accepted' && "Devis accepté"}
            {devis.status === 'rejected' && "Devis refusé"}
            {devis.status === 'expired' && "Devis expiré"}
            {devis.status === 'converted' && "Devis converti en facture"}
          </div>
          <div className="flex gap-2">
            {/* Télécharger PDF */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Télécharger PDF
            </button>

            {/* Envoyer */}
            {devis.status === 'draft' && (
              <button
                onClick={handleSend}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Envoyer
              </button>
            )}

            {/* Convertir en facture */}
            {devis.status === 'accepted' && (
              <button
                onClick={handleConvert}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Convertir en facture
              </button>
            )}

            {/* Modifier */}
            {['draft', 'sent'].includes(devis.status) && (
              <button
                onClick={() => onEdit(devis)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
            )}

            {/* Supprimer */}
            {devis.status === 'draft' && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>

  );
};


export default DevisViewModal;
