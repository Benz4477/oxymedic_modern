// src/pages/Devis/components/DevisStats.jsx
import { FileText, Send, CheckCircle, AlertTriangle } from "lucide-react";

const DevisStats = ({ total, envoye, accepte, expired }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
          <FileText size={22} className="text-blue-600" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{total}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Total devis</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
          <Send size={22} className="text-amber-600" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{envoye}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Envoyés / En attente</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
          <CheckCircle size={22} className="text-emerald-600" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{accepte}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Acceptés</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
          <AlertTriangle size={22} className="text-red-600" />
        </div>
        <div>
          <div className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">{expired}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Expirés / Refusés</div>
        </div>
      </div>
    </div>
  );
};

export default DevisStats;