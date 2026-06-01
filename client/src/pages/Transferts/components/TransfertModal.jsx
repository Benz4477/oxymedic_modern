import React, { useState, useEffect } from "react";
import { X, ArrowRightLeft, Truck, Package, Search, Check, AlertCircle, Building2, Trash2, Plus, Box } from "lucide-react";
import { toast } from "react-toastify";

const TransfertModal = ({ isOpen, onClose, onSave, magasins = [], equipements, units = [], currentMagasinId, livreurs = [], consommables = [] }) => {
    const [targetMagasin, setTargetMagasin] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [chauffeur, setChauffeur] = useState("");
    const [vehicule, setVehicule] = useState("");
    const [matricule, setMatricule] = useState("");
    const [notes, setNotes] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // États pour l'ajout d'un nouvel item
    const [itemType, setItemType] = useState("unit");
    const [tempQty, setTempQty] = useState(1);

    // Réinitialiser au chargement
    useEffect(() => {
        if (isOpen) {
            setTargetMagasin("");
            setSelectedItems([]);
            setChauffeur("");
            setVehicule("");
            setMatricule("");
            setNotes("");
            setItemType("unit");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const magasinsList = Array.isArray(magasins) ? magasins : (magasins.data || []);
    
    // Filtrage des options disponibles pour ne pas ajouter deux fois la même unité
    const availableUnits = units.filter(u => 
        (u.statut === "disponible" || !u.statut) && 
        !selectedItems.find(item => item.type === "unit" && item.unite?._id === u._id)
    );

    const handleAddItem = (e) => {
        const val = e.target.value;
        if (!val) return;

        if (itemType === "unit") {
            const unit = units.find(u => u._id === val);
            if (unit) {
                setSelectedItems([...selectedItems, {
                    type: "unit",
                    unite: unit,
                    equipement: unit.equipement,
                    quantity: 1
                }]);
            }
        } else {
            const conso = consommables.find(c => c._id === val);
            if (conso) {
                // Vérifier si déjà présent pour incrémenter au lieu d'ajouter
                const existing = selectedItems.find(item => item.type === "consommable" && item.consommable?._id === conso._id);
                if (existing) {
                    setSelectedItems(selectedItems.map(item => 
                        item.type === "consommable" && item.consommable?._id === conso._id 
                        ? { ...item, quantity: item.quantity + parseInt(tempQty) }
                        : item
                    ));
                } else {
                    setSelectedItems([...selectedItems, {
                        type: "consommable",
                        consommable: conso,
                        quantity: parseInt(tempQty)
                    }]);
                }
            }
        }
        // Reset
        e.target.value = "";
        setTempQty(1);
    };

    const handleRemoveItem = (index) => {
        const newItems = [...selectedItems];
        newItems.splice(index, 1);
        setSelectedItems(newItems);
    };

    const handleLivreurChange = (e) => {
        const val = e.target.value;
        setChauffeur(val);
        const selectedLivreur = livreurs.find(l => l.nom === val);
        if (selectedLivreur) {
            setVehicule(selectedLivreur.vehicule || "");
            setMatricule(selectedLivreur.matricule || "");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!targetMagasin) return toast.error("Veuillez choisir une destination");
        if (selectedItems.length === 0) return toast.error("Veuillez sélectionner au moins un article");

        setIsSaving(true);
        try {
            const data = {
                sourceMagasin: currentMagasinId,
                targetMagasin,
                items: selectedItems.map(item => ({
                    type: item.type,
                    equipement: item.type === "unit" ? (item.equipement?._id || item.equipement) : undefined,
                    unite: item.type === "unit" ? item.unite?._id : undefined,
                    consommable: item.type === "consommable" ? item.consommable?._id : undefined,
                    quantity: item.quantity,
                    note: ""
                })),
                logistique: { chauffeur, vehicule, matricule },
                notes
            };
            await onSave(data);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur lors de la création du transfert");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
                            <ArrowRightLeft size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Mouvement de Stock Mixte</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Machines & Consommables</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        
                        {/* Gauche : Destination & Logistique */}
                        <div className="space-y-8">
                            <section>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Building2 size={12} className="text-emerald-500" /> Destination
                                </h4>
                                <select 
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all appearance-none"
                                    value={targetMagasin}
                                    onChange={(e) => setTargetMagasin(e.target.value)}
                                    required
                                >
                                    <option value="">Sélectionner le magasin de destination...</option>
                                    {magasinsList.filter(m => m._id !== currentMagasinId).map(m => (
                                        <option key={m._id} value={m._id}>{m.nom} ({m.ville})</option>
                                    ))}
                                </select>
                            </section>

                            <section>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Truck size={12} className="text-emerald-500" /> Informations Logistiques
                                </h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <select 
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all appearance-none"
                                        value={chauffeur}
                                        onChange={handleLivreurChange}
                                    >
                                        <option value="">Choisir un chauffeur (Livreur)...</option>
                                        {livreurs.map(l => (
                                            <option key={l._id} value={l.nom}>{l.nom}</option>
                                        ))}
                                    </select>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            type="text" 
                                            placeholder="Véhicule"
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all"
                                            value={vehicule}
                                            onChange={(e) => setVehicule(e.target.value)}
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Matricule"
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all"
                                            value={matricule}
                                            onChange={(e) => setMatricule(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <AlertCircle size={12} className="text-emerald-500" /> Notes Internes
                                </h4>
                                <textarea 
                                    placeholder="Instructions particulières..."
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-emerald-500 transition-all min-h-[100px]"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </section>
                        </div>

                        {/* Droite : Sélection Mixte */}
                        <div className="flex flex-col h-[560px]">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center justify-between">
                                <span className="flex items-center gap-2"><Package size={12} className="text-emerald-500" /> Choix des articles</span>
                                <span className="text-emerald-600 font-black">{selectedItems.length} article(s)</span>
                            </h4>

                            {/* Sélecteur de type et quantité */}
                            <div className="flex gap-2 mb-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-inner">
                                <button 
                                    type="button"
                                    onClick={() => setItemType("unit")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        itemType === "unit" ? "bg-white text-emerald-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"
                                    }`}
                                >
                                    <Package size={14} /> Machines
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setItemType("consommable")}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        itemType === "consommable" ? "bg-white text-emerald-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"
                                    }`}
                                >
                                    <Box size={14} /> Consommables
                                </button>
                            </div>

                            <div className="flex gap-3 mb-6 items-end">
                                <div className="flex-1">
                                    <select 
                                        className="w-full bg-slate-100 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all appearance-none"
                                        onChange={handleAddItem}
                                        value=""
                                    >
                                        <option value="">➕ Ajouter un {itemType === "unit" ? "équipement" : "consommable"}...</option>
                                        {itemType === "unit" ? (
                                            availableUnits.map(u => (
                                                <option key={u._id} value={u._id}>{u.equipement?.name} — SN: {u.serial}</option>
                                            ))
                                        ) : (
                                            consommables.map(c => (
                                                <option key={c._id} value={c._id}>{c.name} (Stock: {c.stock})</option>
                                            ))
                                        )}
                                    </select>
                                </div>
                                {itemType === "consommable" && (
                                    <div className="w-24">
                                        <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">Quantité</label>
                                        <input 
                                            type="number"
                                            min="1"
                                            className="w-full bg-slate-100 border-2 border-transparent rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500 focus:bg-white transition-all"
                                            value={tempQty}
                                            onChange={(e) => setTempQty(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                                {selectedItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-300 border-2 border-dashed border-slate-100 rounded-[32px] p-8 text-center bg-slate-50/30">
                                        <Box size={48} className="mb-4 opacity-10" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Liste d'expédition vide</p>
                                    </div>
                                ) : (
                                    selectedItems.map((item, idx) => (
                                        <div 
                                            key={idx}
                                            className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all animate-in slide-in-from-right-4 duration-300"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-xl group-hover:bg-emerald-50 transition-colors">
                                                    {item.type === "unit" ? (item.equipement?.icon || "📦") : "💊"}
                                                </div>
                                                <div>
                                                    <div className="text-xs font-black text-slate-800">
                                                        {item.type === "unit" ? item.equipement?.name : item.consommable?.name}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        {item.type === "unit" ? (
                                                            <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-wider">{item.unite?.serial}</span>
                                                        ) : (
                                                            <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">Quantité: {item.quantity}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => handleRemoveItem(idx)}
                                                className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer Actions */}
                <div className="px-8 py-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-[32px]">
                    <button 
                        onClick={onClose}
                        className="px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 rounded-2xl transition"
                    >
                        Annuler
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="px-8 py-4 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-emerald-600/40 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? "Génération du bon..." : "Confirmer l'expédition"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransfertModal;
