import React, { useEffect, useRef } from "react";
import { Eye, Edit, Archive, RotateCcw, Printer, Trash2 } from "lucide-react";
import JsBarcode from "jsbarcode";
import StatusBadge from "./StatusBadge";

const UnitCard = ({ unit, equipement, onView, onEdit, onArchive, onDelete, onPrint }) => {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current && unit.barcode) {
      try {
        JsBarcode(barcodeRef.current, unit.barcode, {
          format: "CODE128",
          width: 1.2,
          height: 26,
          displayValue: false,
          margin: 0,
          background: "transparent",
          lineColor: "#15803D",
        });
      } catch (err) {}
    }
  }, [unit.barcode]);

  // Champs compatibles ancien (nom) et nouveau (name) modèle
  const equipName  = equipement?.name  || equipement?.nom  || "—";
  const equipIcon  = equipement?.icon  || "🏥";
  const equipPhoto = equipement?.photo || "";

  return (
    <div className={`bg-white rounded-2xl w-72 border ${unit.archived ? "border-slate-200 opacity-70" : "border-slate-100"} shadow-sm overflow-hidden hover:shadow-md transition-all group`}>
      {/* Image / Icône */}
      <div className="h-28 bg-slate-100 flex items-center justify-center text-4xl border-b border-slate-100">
        {equipPhoto ? (
          <img src={equipPhoto} className="h-full w-full object-cover" alt={equipName} />
        ) : (
          <span>{equipIcon}</span>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="font-bold text-slate-800 truncate max-w-[140px]">{equipName}</div>
            <div className="font-mono text-xs text-purple-600 mt-0.5">{unit.serial}</div>
          </div>
          <StatusBadge status={unit.statut || unit.status} />
        </div>

        {/* Code-barres */}
        {unit.barcode && (
          <div className="my-3">
            <svg ref={barcodeRef} className="w-full h-8" />
            <div className="text-[9px] text-slate-400 font-mono text-center mt-1">{unit.barcode}</div>
          </div>
        )}

        {/* Infos complémentaires */}
        <div className="text-xs text-slate-500 space-y-1">
          {unit.dateAchat && (
            <div>📅 Entrée : {new Date(unit.dateAchat).toLocaleDateString("fr-FR")}</div>
          )}
          {unit.note && <div>📝 {unit.note}</div>}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 items-center justify-center">
          <button onClick={() => onView(unit)} title="Voir"
            className="py-1.5 px-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
            <Eye size={12} />
          </button>
          <button onClick={() => onEdit(unit)} title="Modifier"
            className="py-1.5 px-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
            <Edit size={12} />
          </button>
          <button onClick={() => onArchive(unit)} title={unit.archived ? "Restaurer" : "Archiver"}
            className="py-1.5 px-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
            {unit.archived ? <RotateCcw size={12} /> : <Archive size={12} />}
          </button>
          <button onClick={() => onPrint(unit)} title="Imprimer étiquette"
            className="py-1.5 px-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
            <Printer size={12} />
          </button>
          <button onClick={() => onDelete(unit._id)} title="Supprimer"
            className="py-1.5 px-2 text-xs font-semibold rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnitCard;