import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import UnitStats    from "./components/UnitStats";
import UnitFilters  from "./components/UnitFilters";
import UnitCard     from "./components/UnitCard";
import UnitModal    from "./components/UnitModal";
import UnitViewModal from "./components/UnitViewModal";
import unitService       from "../../services/unitService";
import equipementService from "../../services/equipementService";

const Serials = () => {
  const [units, setUnits]             = useState([]);
  const [equipements, setEquipements] = useState([]);
  const [searchTerm, setSearchTerm]   = useState("");
  const [showArchived, setShowArchived]   = useState(false);
  const [showAddModal, setShowAddModal]   = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUnit, setSelectedUnit]   = useState(null);
  const [formData, setFormData] = useState({
    equipement: "", serial: "", barcode: "",
    statut: "disponible", dateAchat: "", note: "",
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [unitsData, equipementsData] = await Promise.all([
        unitService.getAll(),
        equipementService.getAll(),
      ]);
      setUnits(unitsData);
      setEquipements(equipementsData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      toast.error("Erreur de chargement");
    }
  };

  const filtered = units.filter(u => {
    const serial  = u.serial  || "";
    const barcode = u.barcode || "";
    const matchSearch   = serial.toLowerCase().includes(searchTerm.toLowerCase()) || barcode.includes(searchTerm);
    const matchArchived = showArchived ? true : !u.archived;
    return matchSearch && matchArchived;
  });

  const getEquipement = (equipId) => {
    if (typeof equipId === "object" && equipId !== null) return equipId;
    return equipements.find(e => String(e._id) === String(equipId));
  };

  const handleSave = async () => {
    try {
      if (showEditModal && selectedUnit) {
        await unitService.update(selectedUnit._id, formData);
        toast.success("Unité mise à jour");
      } else {
        await unitService.create(formData);
        toast.success("Unité créée ✅");
      }
      await loadData();
      setShowAddModal(false);
      setShowEditModal(false);
      setFormData({ equipement: "", serial: "", barcode: "", statut: "disponible", dateAchat: "", note: "" });
    } catch (error) {
      toast.error("Erreur : " + error.message);
    }
  };

  const handleArchive = async (unit) => {
    try {
      await unitService.update(unit._id, { archived: !unit.archived });
      await loadData();
    } catch (error) {
      toast.error("Erreur lors de l'archivage");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer définitivement cette unité ?")) return;
    try {
      await unitService.delete(id);
      toast.success("Unité supprimée");
      await loadData();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handlePrintLabel = (unit) => {
    const html = `<!DOCTYPE html><html><head><title>Étiquette ${unit.serial}</title>
      <style>body{font-family:monospace;padding:10px;text-align:center;}.b{border:2px solid #16A34A;border-radius:8px;padding:10px;}.logo{font-weight:800;color:#16A34A;}.sn{font-size:12px;font-weight:700;color:#7C3AED;}svg{width:100%;height:40px;}</style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js"><\/script>
    </head><body><div class="b"><div class="logo">OXYMEDIC</div><div class="sn">${unit.serial}</div><svg id="barcode"></svg></div>
    <script>JsBarcode(document.getElementById("barcode"),"${unit.serial}",{format:"CODE128",width:1.5,height:30,displayValue:false});setTimeout(()=>window.print(),400);<\/script>
    </body></html>`;
    const win = window.open("", "_blank", "width=300,height=240");
    win.document.write(html);
    win.document.close();
  };

  const totalUnits       = units.length;
  const totalAvailable   = units.filter(u => u.statut === "disponible" && !u.archived).length;
  const totalRented      = units.filter(u => u.statut === "loué"       && !u.archived).length;
  const totalMaintenance = units.filter(u => u.statut === "maintenance" && !u.archived).length;

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-48">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">N° Série & Codes-barres</h1>
          <p className="text-sm text-slate-400 mt-0.5">{totalUnits} unités • {totalAvailable} disponibles</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all">
          <Plus size={16} /> Enregistrer une unité
        </button>
      </div>

      <UnitStats total={totalUnits} available={totalAvailable} rented={totalRented} maintenance={totalMaintenance} />
      <UnitFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} showArchived={showArchived} setShowArchived={setShowArchived} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-72">
        {filtered.map(unit => (
          <UnitCard
            key={unit._id}
            unit={unit}
            equipement={getEquipement(unit.equipement)}
            onView={(u) => { setSelectedUnit(u); setShowViewModal(true); }}
            onEdit={(u) => {
              setSelectedUnit(u);
              setFormData({
                equipement: u.equipement?._id || u.equipement || "",
                serial:     u.serial    || "",
                barcode:    u.barcode   || "",
                statut:     u.statut    || "disponible",
                dateAchat:  u.dateAchat ? new Date(u.dateAchat).toISOString().split("T")[0] : "",
                note:       u.note      || "",
              });
              setShowEditModal(true);
            }}
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
        equipement={getEquipement(selectedUnit?.equipement)}
      />
    </div>
  );
};

export default Serials;