// client/src/pages/Cautions/components/CautionCard.jsx
import React from 'react';
import {
  Lock,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Banknote,
  Building2,
  User,
  Calendar,
  Package,
  RotateCcw,
  Trash2,
  Eye,
  Edit,
  Hash
} from 'lucide-react';

const fmt = (n) =>
  (n || 0).toLocaleString('fr-FR', { maximumFractionDigits: 0 });

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR');
};

const statusConfig = {
  held: { label: 'En cours', color: 'amber', icon: Lock },
  returned: { label: 'Restituée', color: 'emerald', icon: CheckCircle },
  deducted: { label: 'Déduite', color: 'rose', icon: AlertTriangle },
};

const modeIcons = {
  Cash: Banknote,
  Chèque: CreditCard,
  Virement: Building2,
  Carte: CreditCard,
};

export default function CautionCard({
  caution,
  onReturn,
  onDeduct,
  onCancel,
  onView,
  onEdit,
  onDelete,
  isAdmin,
}) {
  const cfg = statusConfig[caution.status] || statusConfig.held;
  const StatusIcon = cfg.icon;
  const ModeIcon = modeIcons[caution.mode] || Banknote;

  const clientName = caution.client
    ? `${caution.client.prenom || ''} ${caution.client.nom || ''}`.trim()
    : 'Client supprimé';

  const equipName = caution.equipement?.name || '—';
  const equipIcon = caution.equipement?.icon || '📦';
  const unitSerial = caution.unite?.serial || null;

  return (
    <div className="group bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500 flex flex-col h-full">
      {/* Reduced Top Section */}
      <div className="px-5 pt-4 pb-3 flex justify-between items-center border-b border-slate-50">
        <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
          <Hash size={10} /> {caution.ref}
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border border-${cfg.color}-100 bg-${cfg.color}-50`}>
          <StatusIcon size={9} className={`text-${cfg.color}-600`} />
          <span className={`text-[8px] font-black tracking-wider text-${cfg.color}-600 uppercase`}>
            {cfg.label}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1">
        {/* Main Content: Horizontal Layout for Amount and Title */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <div className="flex items-baseline gap-1 mb-0.5">
              <span className="text-2xl font-black text-slate-900 tracking-tighter">{fmt(caution.amount)}</span>
              <span className="text-[10px] font-black text-slate-400">MAD</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700 truncate max-w-[180px]">
              <User size={10} className="text-slate-300" /> {clientName}
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onView(caution)}
              className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
            >
              <Eye size={12} />
            </button>
            <button
              onClick={() => onEdit?.(caution)}
              className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
            >
              <Edit size={12} />
            </button>
          </div>
        </div>

        {/* Info Grid: Shorter by using 2 columns */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
          <div>
            <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Équipement</div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 truncate">
              {equipIcon} {equipName}
            </div>
          </div>
          <div>
            <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Paiement</div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
              <ModeIcon size={10} /> {caution.mode}
              {caution.mode === 'Chèque' && caution.numeroChèque && (
                <span className="text-[9px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                  n° {caution.numeroChèque}
                </span>
              )}
            </div>
            {caution.mode === 'Chèque' && caution.banque && (
              <div className="text-[8px] font-bold text-slate-400 mt-0.5 ml-4 truncate">
                {caution.banque}
              </div>
            )}
          </div>
          <div>
            <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Date Dépôt</div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
              <Calendar size={10} /> {formatDate(caution.date)}
            </div>
          </div>
          {unitSerial && (
            <div>
              <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Série</div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 font-mono">
                #{unitSerial}
              </div>
            </div>
          )}
        </div>

        {/* Deducted Info - More Compact */}
        {caution.status === 'deducted' && (
          <div className="p-2 bg-rose-50/30 rounded-xl border border-rose-100/50 text-[10px] flex justify-between gap-4">
            <div className="flex gap-2">
              <span className="text-rose-600 font-bold">Retenu:</span>
              <span className="font-black text-slate-700">{fmt(caution.deductionAmount)}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-emerald-600 font-bold">Rendu:</span>
              <span className="font-black text-emerald-700">{fmt(caution.amount - caution.deductionAmount)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons - Shorter height */}
      <div className="px-5 pb-5 pt-0 mt-auto">
        {caution.status === 'held' ? (
          <div className="flex gap-2">
            <button
              onClick={() => onReturn(caution)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-sm font-bold text-xs"
            >
              <CheckCircle size={14} /> Restituer
            </button>
            <button
              onClick={() => onDeduct(caution)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition font-bold text-xs"
            >
              <AlertTriangle size={14} /> Déduire
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => onCancel(caution)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition font-bold text-xs"
            >
              <RotateCcw size={14} /> Réactiver
            </button>
            {isAdmin && (
              <button
                onClick={() => onDelete(caution)}
                className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}