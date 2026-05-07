import React, { useRef, useEffect } from "react";
import { X, User, FileText } from "lucide-react";
import JsBarcode from "jsbarcode";
import StatusBadge from "./StatusBadge";

const UnitViewModal = ({ isOpen, onClose, unit, equipement }) => {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current && unit?.barcode && unit.barcode.length >= 6) {
      try {
        JsBarcode(barcodeRef.current, unit.barcode, {
          format: "CODE128", width: 1.8, height: 48,
          displayValue: false, margin: 5,
          background: "transparent", lineColor: "#15803D",
        });
      } catch (err) {}
    }
  }, [unit]);

  if (!isOpen || !unit) return null;

  const equipName  = equipement?.name  || equipement?.nom  || "Équipement";
  const equipIcon  = equipement?.icon  || "🏥";
  const equipPhoto = equipement?.photo || "";

  const statut   = unit.statut   || unit.status  || "—";
  const dateStr  = unit.dateAchat
    ? new Date(unit.dateAchat).toLocaleDateString("fr-FR")
    : unit.dateIn || "—";

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-5 py-3 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl overflow-hidden">
              {equipPhoto
                ? <img src={equipPhoto} className="w-full h-full object-cover" alt={equipName} />
                : <span>{equipIcon}</span>
              }
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-tight text-slate-900">{equipName}</h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{unit.serial}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition flex items-center justify-center">
            <X size={14} />
          </button>
        </div>

        {/* Corps */}
        <div className="p-5 space-y-5">
          {/* Code-barres */}
          {unit.barcode && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Code-barres</div>
              <svg ref={barcodeRef} className="w-full h-14" />
              <div className="text-[10px] font-mono text-slate-500 mt-2">{unit.barcode}</div>
            </div>
          )}

          {/* Statut + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Statut</div>
              <div className="flex justify-center">
                <StatusBadge status={statut} />
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Date d'entrée</div>
              <div className="text-sm font-medium text-slate-700">{dateStr}</div>
            </div>
          </div>

          {/* Note */}
          {unit.note && (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <FileText size={14} className="text-amber-600" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Note</div>
                <div className="text-sm text-slate-600">{unit.note}</div>
              </div>
            </div>
          )}

          {/* Catégorie équipement */}
          {equipement?.cat && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Catégorie</div>
              <div className="text-sm font-medium text-slate-700">{equipement.cat}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 flex justify-end rounded-b-2xl">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnitViewModal;