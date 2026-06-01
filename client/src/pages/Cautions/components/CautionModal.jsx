// client/src/pages/Cautions/components/CautionModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Lock, Save } from 'lucide-react';

export default function CautionModal({
  isOpen,
  onClose,
  onSubmit,
  clients = [],
  commandes = [],
  equipements = [],
  unites = [],
  caution = null, // null = création, sinon édition
}) {
  const isEdit = !!caution;
  const [form, setForm] = useState({
    client: '',
    commande: '',
    equipement: '',
    unite: '',
    amount: '',
    mode: 'Cash',
    numeroChèque: '',
    banque: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (caution) {
      setForm({
        client: caution.client?._id || caution.client || '',
        commande: caution.commande?._id || caution.commande || '',
        equipement: caution.equipement?._id || caution.equipement || '',
        unite: caution.unite?._id || caution.unite || '',
        amount: caution.amount || '',
        mode: caution.mode || 'Cash',
        numeroChèque: caution.numeroChèque || '',
        banque: caution.banque || '',
        date: caution.date
          ? new Date(caution.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        note: caution.note || '',
      });
    } else {
      setForm({
        client: '',
        commande: '',
        equipement: '',
        unite: '',
        amount: '',
        mode: 'Cash',
        numeroChèque: '',
        banque: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
      });
    }
    setError('');
  }, [caution, isOpen]);

  // Pré-remplissage auto depuis la commande sélectionnée
  useEffect(() => {
    if (!form.commande || isEdit) return;
    const cmd = commandes.find((c) => c._id === form.commande);
    if (cmd) {
      setForm((f) => ({
        ...f,
        client: cmd.client?._id || cmd.client || f.client,
        equipement: cmd.equipement?._id || cmd.equipement || f.equipement,
        unite: cmd.unite?._id || cmd.unite || f.unite,
        amount: cmd.equipement?.caution || f.amount,
      }));
    }
  }, [form.commande, commandes, isEdit]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError('');
    if (!form.client) return setError('Sélectionnez un client');
    if (!form.amount || parseFloat(form.amount) <= 0)
      return setError('Montant invalide');
    if (form.mode === 'Chèque' && !form.numeroChèque)
      return setError('N° de chèque requis');

    setLoading(true);
    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        commande: form.commande || null,
        equipement: form.equipement || null,
        unite: form.unite || null,
      };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-sm">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isEdit ? 'Modifier la caution' : 'Nouvelle caution'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEdit ? caution.ref : 'Dépôt de garantie client'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Commande (optionnel) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Commande liée (optionnel)
            </label>
            <select
              value={form.commande}
              onChange={(e) =>
                setForm({ ...form, commande: e.target.value })
              }
              disabled={isEdit}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-slate-100"
            >
              <option value="">— Aucune commande —</option>
              {commandes.map((c) => (
                <option key={c._id} value={c._id}>
                  {(c.reference || c.ref || 'Commande inconnue')} — {c.client?.prenom} {c.client?.nom}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-500 mt-1">
              Sélectionner une commande pré-remplit client, équipement et
              montant
            </p>
          </div>

          {/* Client */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Client *
            </label>
            <select
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="">— Sélectionner —</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.prenom} {c.nom} {c.tel ? `· ${c.tel}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Équipement */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Équipement (optionnel)
              </label>
              <select
                value={form.equipement}
                onChange={(e) =>
                  setForm({ ...form, equipement: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">— Aucun —</option>
                {equipements.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.icon} {e.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Unité */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                N° de série (optionnel)
              </label>
              <select
                value={form.unite}
                onChange={(e) => setForm({ ...form, unite: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">— Aucune —</option>
                {unites
                  .filter(
                    (u) =>
                      !form.equipement ||
                      u.equipement === form.equipement ||
                      u.equipement?._id === form.equipement
                  )
                  .map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.serial}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Montant */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Montant (MAD) *
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              />
            </div>

            {/* Mode */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Mode de paiement *
              </label>
              <select
                value={form.mode}
                onChange={(e) => setForm({ ...form, mode: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="Cash">💵 Cash</option>
                <option value="Chèque">📝 Chèque</option>
                <option value="Virement">🏦 Virement</option>
                <option value="Carte">💳 Carte</option>
              </select>
            </div>
          </div>

          {/* Champs chèque */}
          {form.mode === 'Chèque' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  N° de chèque *
                </label>
                <input
                  type="text"
                  value={form.numeroChèque}
                  onChange={(e) =>
                    setForm({ ...form, numeroChèque: e.target.value })
                  }
                  placeholder="ex: 1234567"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Banque
                </label>
                <input
                  type="text"
                  value={form.banque}
                  onChange={(e) =>
                    setForm({ ...form, banque: e.target.value })
                  }
                  placeholder="ex: Attijariwafa Bank"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Date du dépôt
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Note (optionnel)
            </label>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={2}
              placeholder="Informations complémentaires…"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
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
            onClick={handleSubmit}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading
              ? 'Enregistrement…'
              : isEdit
              ? 'Mettre à jour'
              : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}