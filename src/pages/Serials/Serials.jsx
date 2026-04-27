// src/pages/Serials/Serials.jsx
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import UnitStats from "./components/UnitStats";
import UnitFilters from "./components/UnitFilters";
import UnitCard from "./components/UnitCard";
import UnitModal from "./components/UnitModal";
import UnitViewModal from "./components/UnitViewModal";
import UnitService from "../../services/unitService";
import EquipementService from "../../services/equipementService";

const Serials = () => {
  const [units, setUnits] = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [formData, setFormData] = useState({
    equipId: "",
    serial: "",
    barcode: "",
    status: "available",
    dateIn: "",
    note: "",
  });

  const resetFormData = () => {
    setFormData({
      equipId: "",
      serial: "",
      barcode: "",
      status: "available",
      dateIn: "",
      note: "",
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [unitsData, equipementsData] = await Promise.all([
        UnitService.getAllUnits(),
        EquipementService.getAllEquipements(),
      ]);
      setUnits(unitsData);
      setEquipements(equipementsData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
  };

  const filtered = units.filter(u => {
    const matchSearch = u.serial.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        u.barcode.includes(searchTerm);
    const matchArchived = showArchived ? true : !u.archived;
    return matchSearch && matchArchived;
  });

  const getEquipement = (equipId) => {
    if (typeof equipId === 'object') {
      return equipId;
    }
    return equipements.find(e => String(e._id) === String(equipId));
  };

  const handleSave = async () => {
    try {
      if (showEditModal && selectedUnit) {
        await UnitService.updateUnit(selectedUnit.id, formData);
      } else {
        await UnitService.createUnit(formData);
      }
      await loadData();
      setShowAddModal(false);
      setShowEditModal(false);
      setFormData({ equipId: "", serial: "", barcode: "", status: "available", dateIn: "", note: "" });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Erreur lors de la sauvegarde: " + error.message);
    }
  };

  const handleArchive = async (unit) => {
    try {
      await UnitService.updateUnit(unit.id, { archived: !unit.archived });
      await loadData();
    } catch (error) {
      console.error("Erreur lors de l'archivage:", error);
      alert("Erreur lors de l'archivage: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Supprimer définitivement cette unité ?")) {
      try {
        await UnitService.deleteUnit(id);
        await loadData();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression: " + error.message);
      }
    }
  };

  const handlePrintLabel = (unit) => {
    const eq = getEquipement(unit.equipId);
    const html = `<!DOCTYPE html><html><head><title>Étiquette ${unit.serial}</title>
      <style>body{font-family:monospace;padding:10px;text-align:center;}.b{border:2px solid #16A34A;border-radius:8px;padding:10px;}.logo{font-weight:800;color:#16A34A;}.sn{font-size:12px;font-weight:700;color:#7C3AED;}svg{width:100%;height:40px;}</style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js"><\/script>
    </head><body><div class="b"><div class="logo">OXYMEDIC</div><div class="sn">${unit.serial}</div><svg id="barcode"></svg><div>${unit.barcode}</div></div>
    <script>JsBarcode(document.getElementById("barcode"),"${unit.barcode}",{format:"CODE128",width:1.5,height:30,displayValue:false});setTimeout(()=>window.print(),400);<\/script>
    </body></html>`;
    const win = window.open("", "_blank", "width=300,height=240");
    win.document.write(html);
    win.document.close();
  };

  const totalUnits = units.length;
  const totalAvailable = units.filter(u => u.status === "available" && !u.archived).length;
  const totalRented = units.filter(u => u.status === "rented" && !u.archived).length;
  const totalMaintenance = units.filter(u => u.status === "maintenance" && !u.archived).length;

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">N° Série & Codes-barres</h1>
          <p className="text-sm text-slate-400 mt-0.5">{totalUnits} unités • {totalAvailable} disponibles</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all">
          <Plus size={16} /> Enregistrer une unité
        </button>
      </div>

      {/* KPIs */}
      <UnitStats total={totalUnits} available={totalAvailable} rented={totalRented} maintenance={totalMaintenance} />

      {/* Filtres */}
      <UnitFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} showArchived={showArchived} setShowArchived={setShowArchived} />

      {/* Grille des cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(unit => (
          <UnitCard
            key={unit.id}
            unit={unit}
            equipement={getEquipement(unit.equipId)}
            onView={(u) => { setSelectedUnit(u); setShowViewModal(true); }}
            onEdit={(u) => { setSelectedUnit(u); setFormData({ equipId: u.equipId?._id || u.equipId, serial: u.serial, barcode: u.barcode, status: u.status, dateIn: u.dateIn, note: u.note }); setShowEditModal(true); }}
            onArchive={handleArchive}
            onDelete={handleDelete}
            onPrint={handlePrintLabel}
          />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16">
            <div className="text-3xl mb-2">🔢</div>
            <div className="text-slate-400 text-sm">Aucune unité trouvée</div>
          </div>
        )}
      </div>

      {/* Modals */}
      <UnitModal
        isOpen={showAddModal || showEditModal}
        onClose={() => { setShowAddModal(false); setShowEditModal(false); }}
        editMode={showEditModal}
        formData={formData}
        setFormData={setFormData}
        equipements={equipements}
        units={units}
        onSave={handleSave}
      />

      <UnitViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        unit={selectedUnit}
        equipement={getEquipement(selectedUnit?.equipId)}
      />
    </div>
  );
};

export default Serials;