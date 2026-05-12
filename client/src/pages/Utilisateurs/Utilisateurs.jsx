import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Shield, UserCheck, UserX, Eye, EyeOff, X } from "lucide-react";
import { toast } from "react-toastify";
import userService from "../../services/userService";

// ── Helpers ──────────────────────────────────────────────
const ROLES = {
  superadmin: { label: "Super Admin",    color: "bg-red-100 text-red-700",      icon: "🛡️" },
  admin:      { label: "Administrateur", color: "bg-rose-100 text-rose-700",    icon: "👑" },
  commercial: { label: "Commercial",     color: "bg-blue-100 text-blue-700",     icon: "💼" },
  livreur:    { label: "Livreur",        color: "bg-green-100 text-green-700",   icon: "🚚" },
  caissier:   { label: "Caissier",       color: "bg-yellow-100 text-yellow-700", icon: "💰" },
  comptable:  { label: "Comptable",      color: "bg-purple-100 text-purple-700", icon: "📊" },
  technicien: { label: "Technicien",     color: "bg-orange-100 text-orange-700", icon: "🔧" },
  employe:    { label: "Employé",        color: "bg-slate-100 text-slate-600",   icon: "👤" },
};

const MODULES = [
  { key: "dashboard",    label: "Dashboard" },
  { key: "clients",      label: "Clients" },
  { key: "commandes",    label: "Commandes" },
  { key: "devis",        label: "Devis" },
  { key: "paiements",    label: "Paiements" },
  { key: "facturation",  label: "Facturation" },
  { key: "stock",        label: "Stock" },
  { key: "serials",      label: "N° Série" },
  { key: "cautions",     label: "Cautions" },
  { key: "livraisons",   label: "Livraisons" },
  { key: "contrats",     label: "Contrats" },
  { key: "crm",          label: "CRM" },
  { key: "pipeline",     label: "Pipeline" },
  { key: "fidelite",     label: "Fidélité" },
  { key: "agenda",        label: "Agenda" },
  { key: "disponibilite", label: "Disponibilité" },
  { key: "reservations",  label: "Réservations" },
  { key: "livreurs",      label: "Livreurs" },
  { key: "categories",    label: "Catégories" },
  { key: "maintenance",   label: "Maintenance" },
  { key: "apparence",     label: "Apparence" },
  { key: "access",        label: "Droits d'accès" },
  { key: "societe",      label: "Société" },
  { key: "utilisateurs", label: "Utilisateurs" },
];

const EMPTY_FORM = {
  username: "", password: "", name: "", email: "", tel: "",
  role: "employe", status: "active",
  permissions: {
    dashboard:true, clients:false, commandes:false, stock:false,
    serials:false, paiements:false, facturation:false, devis:false,
    contrats:false, crm:false, pipeline:false, fidelite:false, agenda:false,
    disponibilite:false, reservations:false, livreurs:false, categories:false,
    maintenance:false, apparence:false, access:false, cautions:false,
    livraisons:false, societe:false, utilisateurs:false,
  },
};

// ── Modal Utilisateur ─────────────────────────────────────
const UserModal = ({ isOpen, onClose, editMode, initialData, onSave }) => {
  const [form, setForm]           = useState(EMPTY_FORM);
  const [showPwd, setShowPwd]     = useState(false);
  const [defaultPerms, setDefaultPerms] = useState({});

  useEffect(() => {
    // Utiliser les permissions par défaut directement pour éviter l'erreur 500
    setDefaultPerms({
      superadmin: { dashboard:true, clients:true, commandes:true, stock:true, serials:true, paiements:true, facturation:true, devis:true, contrats:true, crm:true, pipeline:true, fidelite:true, agenda:true, disponibilite:true, reservations:true, livreurs:true, categories:true, maintenance:true, apparence:true, access:true, cautions:true, livraisons:true, societe:true, utilisateurs:true },
      admin:       { dashboard:true, clients:true, commandes:true, stock:true, serials:true, paiements:true, facturation:true, devis:true, contrats:true, crm:true, pipeline:true, fidelite:true, agenda:true, disponibilite:true, reservations:true, livreurs:true, categories:true, maintenance:true, apparence:true, access:true, cautions:true, livraisons:true, societe:true, utilisateurs:false },
      commercial:  { dashboard:true, clients:true, commandes:true, stock:false, serials:false, paiements:false, facturation:false, devis:true, contrats:true, crm:true, pipeline:true, fidelite:true, agenda:true, disponibilite:true, reservations:true, livreurs:false, categories:false, maintenance:false, apparence:false, access:false, cautions:false, livraisons:false, societe:false, utilisateurs:false },
      livreur:     { dashboard:true, clients:false, commandes:true, stock:false, serials:false, paiements:false, facturation:false, devis:false, contrats:false, crm:false, pipeline:false, fidelite:false, agenda:false, disponibilite:false, reservations:false, livreurs:true, categories:false, maintenance:false, apparence:false, access:false, cautions:false, livraisons:true, societe:false, utilisateurs:false },
      caissier:    { dashboard:true, clients:true, commandes:true, stock:false, serials:false, paiements:true, facturation:true, devis:false, contrats:true, crm:false, pipeline:false, fidelite:false, agenda:false, disponibilite:false, reservations:false, livreurs:false, categories:false, maintenance:false, apparence:false, access:false, cautions:true, livraisons:false, societe:false, utilisateurs:false },
      comptable:   { dashboard:true, clients:false, commandes:false, stock:false, serials:false, paiements:true, facturation:true, devis:false, contrats:true, crm:false, pipeline:false, fidelite:false, agenda:false, disponibilite:false, reservations:false, livreurs:false, categories:false, maintenance:false, apparence:false, access:false, cautions:true, livraisons:false, societe:false, utilisateurs:false },
      technicien:  { dashboard:true, clients:false, commandes:false, stock:true, serials:true, paiements:false, facturation:false, devis:false, contrats:false, crm:false, pipeline:false, fidelite:false, agenda:false, disponibilite:false, reservations:false, livreurs:false, categories:false, maintenance:true, apparence:false, access:false, cautions:false, livraisons:false, societe:false, utilisateurs:false },
      employe:     { dashboard:true, clients:true, commandes:true, stock:false, serials:false, paiements:false, facturation:false, devis:false, contrats:false, crm:false, pipeline:false, fidelite:false, agenda:false, disponibilite:false, reservations:false, livreurs:false, categories:false, maintenance:false, apparence:false, access:false, cautions:false, livraisons:false, societe:false, utilisateurs:false },
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    
    if (editMode && initialData) {
      // Fusionner les permissions existantes avec toutes les permissions possibles
      const mergedPermissions = { ...EMPTY_FORM.permissions };
      Object.keys(EMPTY_FORM.permissions).forEach(key => {
        mergedPermissions[key] = initialData.permissions?.[key] ?? false;
      });
      
      setForm({
        username:    initialData.username   || "",
        password:    "",
        name:        initialData.name       || "",
        email:       initialData.email      || "",
        tel:         initialData.tel        || "",
        role:        initialData.role       || "employe",
        status:      initialData.status     || "active",
        permissions: mergedPermissions,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setShowPwd(false);
  }, [isOpen, editMode, initialData]);

  const applyRoleDefaults = (role) => {
    const perms = defaultPerms[role] || EMPTY_FORM.permissions;
    setForm(f => ({ ...f, role, permissions: { ...perms } }));
  };

  const togglePerm = (key) => {
    if (key === "dashboard") return; // Dashboard toujours activé
    setForm(f => ({ ...f, permissions: { ...f.permissions, [key]: !f.permissions[key] } }));
  };

  const handleSave = () => {
    if (!form.username.trim()) return toast.error("Username requis");
    if (!form.name.trim())     return toast.error("Nom requis");
    if (!editMode && !form.password) return toast.error("Mot de passe requis");
    if (form.password && form.password.length < 6) return toast.error("Mot de passe minimum 6 caractères");
    const data = { ...form };
    if (!data.password) delete data.password;
    onSave(data);
  };

  if (!isOpen) return null;

    
  const roleInfo = ROLES[form.role] || ROLES.employe;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 px-5 py-3 flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-slate-900">
            {editMode ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
          </h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Infos de base */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Nom complet *</label>
              <input type="text" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={form.name || "Prénom Nom"} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Username *</label>
              <input type="text" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/\s/g, "") }))} placeholder="ex: benz.admin" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
                {editMode ? "Nouveau mot de passe (laisser vide = inchangé)" : "Mot de passe *"}
              </label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} className="w-full border border-slate-200 rounded-xl px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="Min. 6 caractères" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Email</label>
              <input type="email" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@oxymedic.ma" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Téléphone</label>
              <input type="text" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} placeholder="06XXXXXXXX" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widests text-slate-400 mb-1.5">Statut</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="active">✅ Actif</option>
                <option value="inactive">❌ Inactif</option>
              </select>
            </div>
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Rôle *</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(ROLES).map(([key, r]) => (
                <button key={key} type="button" onClick={() => applyRoleDefaults(key)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 text-xs font-semibold transition ${form.role === key ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                  <span className="text-lg">{r.icon}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Choisir un rôle applique des permissions par défaut (modifiables ci-dessous)</p>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Accès aux modules
              <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${roleInfo.color}`}>
                {roleInfo.icon} {roleInfo.label}
              </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {MODULES.map(mod => (
                <button key={mod.key} type="button" onClick={() => togglePerm(mod.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition ${
                    form.permissions[mod.key]
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 text-slate-400 hover:border-slate-300"
                  } ${mod.key === "dashboard" ? "opacity-60 cursor-not-allowed" : ""}`}
                  disabled={mod.key === "dashboard"}>
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${form.permissions[mod.key] ? "border-emerald-500 bg-emerald-500" : "border-slate-300"}`}>
                    {form.permissions[mod.key] && <span className="text-white text-[8px] font-bold">✓</span>}
                  </div>
                  {mod.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-slate-100 px-5 py-3 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition">Annuler</button>
          <button onClick={handleSave} className="px-4 py-1.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition">
            {editMode ? "Mettre à jour" : "Créer l'utilisateur"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Page principale ───────────────────────────────────────
const Utilisateurs = () => {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode]   = useState(false);
  const [selected, setSelected]   = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      console.log("Données utilisateurs reçues:", data);
      // Trier: superadmin, puis admin, puis les autres par nom
      const roleOrder = { superadmin: 0, admin: 1 };
      const sorted = data.sort((a, b) => {
        const orderA = roleOrder[a.role] ?? 2;
        const orderB = roleOrder[b.role] ?? 2;
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name);
      });
      setUsers(sorted);
    } catch (err) {
      toast.error("Erreur de chargement");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSave = async (data) => {
    try {
      if (editMode && selected) {
        await userService.update(selected._id, data);
        toast.success("Utilisateur mis à jour ✅");
      } else {
        await userService.create(data);
        toast.success("Utilisateur créé ✅");
      }
      setShowModal(false);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  const handleToggle = async (id) => {
    try {
      await userService.toggleStatus(id);
      await loadData();
    } catch { toast.error("Erreur"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      await userService.delete(id);
      toast.success("Utilisateur supprimé");
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50/60 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Gestion des utilisateurs</h1>
          <p className="text-sm text-slate-400 mt-0.5">{users.length} utilisateur{users.length !== 1 ? "s" : ""}</p>
        </div>
        {/* Bouton créer uniquement pour Super Admin */}
        {JSON.parse(localStorage.getItem("user") || "{}")?.role === "superadmin" && (
          <button onClick={() => { 
            setSelected(null); 
            setEditMode(false); 
            setShowModal(true); 
          }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95">
            <Plus size={16} /> Nouvel utilisateur
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {["Utilisateur", "Username", "Rôle", "Modules accessibles", "Statut", "Dernière connexion", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map(user => {
              const roleInfo = ROLES[user.role] || ROLES.employe;
              console.log("Utilisateur:", user.username, "Permissions:", user.permissions);
              const activeModules = MODULES.filter(m => user.permissions?.[m.key]);
              console.log("Modules actifs pour", user.username, ":", activeModules.map(m => m.label));
              const accessCount = Object.values(user.permissions || {}).filter(Boolean).length;
              return (
                <tr key={user._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-base font-bold text-emerald-700">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{user.name}</div>
                        {user.email && <div className="text-xs text-slate-400">{user.email}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{user.username}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${roleInfo.color}`}>
                      {roleInfo.icon} <span>{roleInfo.label}</span>
                    </span>
                    {user.system && <span className="ml-1 text-[10px] text-slate-400">système</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {MODULES.filter(m => (user.permissions && user.permissions[m.key] === true)).slice(0, 4).map(m => (
                        <span key={m.key} className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-600">{m.label}</span>
                      ))}
                      {accessCount > 4 && <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-500">+{accessCount - 4}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${user.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                      {user.status === "active" ? "✅" : "❌"} <span>{user.status === "active" ? "Actif" : "Inactif"}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString("fr-FR") : "Jamais"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { 
                        setSelected(user); 
                        setEditMode(true); 
                        setShowModal(true); 
                      }}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition" title="Modifier">
                        <Edit size={13} />
                      </button>
                      {!user.system && (
                        <button onClick={() => handleToggle(user._id)}
                          className={`p-1.5 rounded-lg border transition ${user.status === "active" ? "border-amber-200 text-amber-600 hover:bg-amber-50" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"}`}
                          title={user.status === "active" ? "Désactiver" : "Activer"}>
                          {user.status === "active" ? <UserX size={13} /> : <UserCheck size={13} />}
                        </button>
                      )}
                      {!user.system && JSON.parse(localStorage.getItem("user") || "{}")?.role === "superadmin" && (
                        <button onClick={() => handleDelete(user._id)}
                          className="p-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition" title="Supprimer">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="py-16 text-center text-slate-400 text-sm">Aucun utilisateur</div>
        )}
      </div>

      <UserModal
        key={selected?._id || 'new'} // Force re-render quand selected change
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelected(null);
          setEditMode(false);
        }}
        editMode={editMode}
        initialData={selected}
        onSave={handleSave}
      />
    </div>
  );
};

export default Utilisateurs;
