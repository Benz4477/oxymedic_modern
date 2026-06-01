import React, { useState, useEffect } from "react";
import { Search, Globe, Store } from "lucide-react";
import { toast } from "react-toastify";
import magasinService from "../../services/magasinService";

// Components
import MagasinHeader from "./components/MagasinHeader";
import MagasinCard from "./components/MagasinCard";
import MagasinModal from "./components/MagasinModal";

const Magasins = () => {
  const [magasins, setMagasins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [form, setForm] = useState({
    nom: "",
    ville: "",
    adresse: "",
    tel: "",
    email: "",
    ice: "",
    status: "active",
    type: "magasin",
    isDefault: false,
  });

  const loadMagasins = async () => {
    setLoading(true);
    try {
      const data = await magasinService.getAll();
      setMagasins(data);
    } catch (err) {
      toast.error("Erreur chargement magasins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMagasins();
  }, []);

  const openAddModal = () => {
    setEditMode(false);
    setForm({
      nom: "",
      ville: "",
      adresse: "",
      tel: "",
      email: "",
      ice: "",
      status: "active",
      type: "magasin",
      isDefault: false,
    });
    setShowModal(true);
  };

  const openEditModal = (m) => {
    setEditMode(true);
    setCurrentId(m._id);
    setForm({
      nom: m.nom,
      ville: m.ville,
      adresse: m.adresse || "",
      tel: m.tel || "",
      email: m.email || "",
      ice: m.ice || "",
      status: m.status || "active",
      type: m.type || "magasin",
      isDefault: m.isDefault || false,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await magasinService.update(currentId, form);
        toast.success("Magasin mis à jour");
      } else {
        await magasinService.create(form);
        toast.success("Magasin créé");
      }
      setShowModal(false);
      loadMagasins();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur sauvegarde");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce magasin ? Cela n'est possible que s'il n'a pas de données liées.")) {
      try {
        await magasinService.delete(id);
        toast.success("Magasin supprimé");
        loadMagasins();
      } catch (err) {
        toast.error(err.response?.data?.message || "Erreur suppression");
      }
    }
  };

  const filtered = magasins.filter(m => 
    m.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.ville.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <MagasinHeader onAdd={openAddModal} count={magasins.length} />

      {/* Search */}
      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
        <input
          type="text"
          placeholder="Rechercher une agence ou une ville..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none shadow-sm"
        />
      </div>

      {/* Magasins Grid */}
      <div className="space-y-12">
        {/* Section Dépôts */}
        {filtered.filter(m => m.type === 'depot').length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-1">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Store size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Nos Dépôts Logistiques</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Gestion exclusive du stock central</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.filter(m => m.type === 'depot').map((m) => (
                <MagasinCard 
                  key={m._id} 
                  magasin={m} 
                  onEdit={openEditModal} 
                  onDelete={handleDelete} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Section Points de Vente */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Store size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Nos Points de Vente</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Agences commerciales et facturation</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.filter(m => m.type === 'magasin').map((m) => (
              <MagasinCard 
                key={m._id} 
                magasin={m} 
                onEdit={openEditModal} 
                onDelete={handleDelete} 
              />
            ))}
            
            {filtered.filter(m => m.type === 'magasin').length === 0 && (
              <div className="col-span-full py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                <div className="p-6 bg-white rounded-3xl shadow-xl mb-4">
                  <Globe size={40} className="text-slate-200" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Aucun magasin trouvé</h3>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Essayez une autre recherche ou créez une agence</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <MagasinModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        editMode={editMode} 
        form={form} 
        setForm={setForm} 
        onSave={handleSave} 
      />
    </div>
  );
};

export default Magasins;
