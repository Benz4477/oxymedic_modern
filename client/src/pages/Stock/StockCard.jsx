import React from "react";
import { Edit, Archive, RotateCcw, Printer, Trash2 } from "lucide-react";
import EquipIcon from "./EquipIcon.jsx";

const StockCard = ({
  equip,
  onEdit,
  onToggleArchive,
  onDelete,
  onPrint,
  onPhotoUpload,
}) => {
  const stockColor = equip.archived
    ? "text-gray-400"
    : equip.dispo === 0
      ? "text-red-500"
      : equip.dispo <= 1
        ? "text-amber-500"
        : "text-green-600";

  const pct = equip.total ? Math.round((equip.dispo / equip.total) * 100) : 0;

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onPhotoUpload(equip._id || equip.id, file);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border ${equip.archived ? "border-gray-200 opacity-70" : "border-slate-100"} shadow-sm overflow-hidden hover:shadow-md transition-all group`}
    >
      {/* En-tête avec photo / icône */}
      <div className="relative h-32 bg-slate-100">
        <EquipIcon
          icon={equip.icon}
          photo={equip.photo}
          name={equip.name}
          color={equip.cardColor}
        />
        {!equip.archived && (
          <label className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded cursor-pointer backdrop-blur-sm">
            📷
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </label>
        )}
        <div
          className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold text-white ${equip.archived ? "bg-gray-600" : stockColor === "text-red-500" ? "bg-red-500" : stockColor === "text-amber-500" ? "bg-amber-500" : "bg-green-600"}`}
        >
          {equip.archived ? "Archivé" : `${equip.dispo}/${equip.total}`}
        </div>
      </div>

      {/* Corps */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {equip.cat}
            </div>
            <div className="font-bold text-slate-800 mt-1">{equip.name}</div>
            {equip.ref && (
              <div className="text-xs font-mono text-purple-600 mt-0.5">
                {equip.ref}
              </div>
            )}
          </div>
        </div>

        {/* Prix */}
        <div className="grid grid-cols-3 gap-1 mt-3 text-center text-xs">
          <div className="bg-slate-50 rounded-lg py-1">
            <div className="text-slate-400">Jour</div>
            <div className="font-bold text-slate-700">
              {equip.pDay || 0} MAD
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg py-1">
            <div className="text-slate-400">Semaine</div>
            <div className="font-bold text-slate-700">
              {equip.pWeek || 0} MAD
            </div>
          </div>
          <div className="bg-emerald-50 rounded-lg py-1">
            <div className="text-emerald-600">Mois ★</div>
            <div className="font-bold text-emerald-700">
              {equip.pMonth || 0} MAD
            </div>
          </div>
        </div>

        {/* Barre de stock */}
        <div className="mt-3">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, background: equip.cardColor }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>Caution: {equip.caution} MAD</span>
            <span>Vente: {equip.pVente} MAD</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onEdit(equip)}
            className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          >
            <Edit size={12} className="inline mr-1" /> Modifier
          </button>
          <button
            onClick={() => onToggleArchive(equip.id)}
            className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          >
            {equip.archived ? (
              <RotateCcw size={12} className="inline mr-1" />
            ) : (
              <Archive size={12} className="inline mr-1" />
            )}
            {equip.archived ? "Restaurer" : "Archiver"}
          </button>
          <button
            onClick={() => onPrint(equip)}
            className="py-1.5 px-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          >
            <Printer size={12} />
          </button>
          <button
            onClick={() => onDelete(equip.id)}
            className="py-1.5 px-2 text-xs font-semibold rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
