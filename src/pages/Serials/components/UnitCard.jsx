// src/pages/Serials/components/UnitCard.jsx
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

  return (
    <div className={`bg-white rounded-2xl w-72 border ${unit.archived ? "border-slate-200 opacity-70" : "border-slate-100"} shadow-sm overflow-hidden hover:shadow-md transition-all group`}>
      {/* Image / Icône */}
      <div className="h-28 bg-slate-100 flex items-center justify-center text-4xl border-b border-slate-100">
        {equipement?.photo ? (
          <img src={equipement.photo} className="h-full w-full object-cover" alt={equipement.name} />
        ) : (
          <span>{equipement?.icon || "🏥"}</span>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="font-bold text-slate-800 truncate max-w-35">{equipement?.name || "—"}</div>
            <div className="font-mono text-xs text-purple-600 mt-0.5">{unit.serial}</div>
          </div>
          <StatusBadge status={unit.status} />
        </div>

        {/* Code-barres */}
        <div className="my-3">
          <svg ref={barcodeRef} className="w-full h-8" />
          <div className="text-[9px] text-slate-400 font-mono text-center mt-1">{unit.barcode}</div>
        </div>

        {/* Infos complémentaires */}
        <div className="text-xs text-slate-500 space-y-1">
          {unit.dateIn && <div>📅 Entrée : {unit.dateIn}</div>}
          {unit.clientNom && <div>👤 Client : {unit.clientNom}</div>}
          {unit.cmdRef && <div>📋 Commande : {unit.cmdRef}</div>}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 items-center justify-center">
          <button onClick={() => onView(unit)} className="py-1.5 px-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition" title="Voir">
            <Eye size={12}/> 
          </button>
          <button onClick={() => onEdit(unit)} className="py-1.5 px-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition" title="Modifier">
            <Edit size={12}/> 
          </button>
          <button onClick={() => onArchive(unit)} className="py-1.5 px-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition" title={unit.archived ? "Restaurer" : "Archiver"}>
            {unit.archived ? <RotateCcw size={12} /> : <Archive size={12} />}
          </button>
          <button onClick={() => onPrint(unit)} className="py-1.5 px-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition" title="Imprimer étiquette">
            <Printer size={12} />
          </button>
          <button onClick={() => onDelete(unit.id)} className="py-1.5 px-2 text-xs font-semibold rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition" title="Supprimer">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnitCard;