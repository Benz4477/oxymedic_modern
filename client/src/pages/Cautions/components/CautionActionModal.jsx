// client/src/pages/Cautions/components/CautionActionModal.jsx
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

const fmt = (n) =>
  (n || 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 });

/**
 * Modal pour les actions Restituer / Déduire
 * action: 'return' | 'deduct'
 */
export default function CautionActionModal({
  isOpen,
  onClose,
  onConfirm,
  caution,
  action,
}) {
  const [retourDate, setRetourDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [deductionAmount, setDeductionAmount] = useState('');
  const [deductionReason, setDeductionReason] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRetourDate(new Date().toISOString().split('T')[0]);
      setDeductionAmount('');
      setDeductionReason('');
      setNote('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen || !caution) return null;

  const isReturn = action === 'return';
  const isDeduct = action === 'deduct';

  const handleConfirm = async () => {
    setError('');
    if (isDeduct) {
      const ded = parseFloat(deductionAmount);
      if (!ded || ded <= 0) return setError('Montant de déduction invalide');
      if (ded > caution.amount)
        return setError('La déduction dépasse le montant de la caution');
      if (!deductionReason.trim())
        return setError('Indiquez le motif de déduction');
    }

    setLoading(true);
    try {
      if (isReturn) {
        await onConfirm({ retourDate, note });
      } else {
        await onConfirm({
          retourDate,
          deductionAmount: parseFloat(deductionAmount),
          deductionReason,
        });
      }
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const ded = parseFloat(deductionAmount) || 0;
  const rendu = caution.amount - ded;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isReturn
              ? 'bg-white border-slate-100'
              : 'bg-white border-slate-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-md ${
                isReturn ? 'bg-emerald-500' : 'bg-slate-500'
              }`}
            >
              {isReturn ? (
                <CheckCircle className="w-5 h-5 text-white" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isReturn ? 'Restituer la caution' : 'Déduire de la caution'}
              </h2>
              <p className="text-xs text-gray-600 font-mono">{caution.ref}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-white/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Récap caution */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Caution
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-800">
                {caution.client?.prenom} {caution.client?.nom}
              </span>
              <span className="text-2xl font-bold text-slate-900">
                {fmt(caution.amount)} MAD
              </span>
            </div>
            {caution.commande && (
              <div className="text-[11px] font-mono text-gray-500 mt-1">
                {caution.commande.ref}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Date {isReturn ? 'de restitution' : 'de déduction'} *
            </label>
            <input
              type="date"
              value={retourDate}
              onChange={(e) => setRetourDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Champs déduction */}
          {isDeduct && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Montant retenu (MAD) *
                </label>
                <input
                  type="number"
                  value={deductionAmount}
                  onChange={(e) => setDeductionAmount(e.target.value)}
                  placeholder="0"
                  max={caution.amount}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                {ded > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
                      <div className="text-[10px] text-slate-600 uppercase font-semibold">
                        Retenu
                      </div>
                      <div className="font-bold text-slate-800">
                        {fmt(ded)} MAD
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                      <div className="text-[10px] text-green-600 uppercase font-semibold">
                        Rendu au client
                      </div>
                      <div className="font-bold text-green-700">
                        {fmt(rendu)} MAD
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Motif de déduction *
                </label>
                <textarea
                  value={deductionReason}
                  onChange={(e) => setDeductionReason(e.target.value)}
                  rows={3}
                  placeholder="ex: Matériel endommagé, retard de restitution, accessoire manquant…"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </>
          )}

          {/* Note pour restitution */}
          {isReturn && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Note (optionnel)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Note de restitution…"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            {isReturn ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            {loading
              ? 'Traitement…'
              : isReturn
              ? 'Confirmer la restitution'
              : 'Confirmer la déduction'}
          </button>
        </div>
      </div>
    </div>
  );
}