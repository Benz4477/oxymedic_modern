import React, { useState, useEffect } from "react";
import { Menu, Bell, LogOut, Search, MessageSquare, ChevronDown, Store, Globe } from "lucide-react";
import { getMenuForUser } from "../../config/menuItems";
import { useLocation, useNavigate } from "react-router-dom";
import notificationService from "../../services/notificationService";
import magasinService from "../../services/magasinService";
import { useAuthStore } from "../../store/authStore";

const TopBar = ({ onMenuToggle, onSearch, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = getMenuForUser(user);

  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [magasins, setMagasins] = useState([]);
  
  // Correction automatique si la session contient une valeur corrompue "[object Object]"
  const getInitialMagasinId = () => {
    const id = sessionStorage.getItem("activeMagasinId");
    if (id === "[object Object]") {
      sessionStorage.removeItem("activeMagasinId");
      return "";
    }
    return id || "";
  };
  
  const [activeMagasinId, setActiveMagasinId] = useState(getInitialMagasinId());
  const [showMagasinSelect, setShowMagasinSelect] = useState(false);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (error) {
      console.error("Erreur notifications", error);
    }
  };

  const loadMagasins = async () => {
    // Super-admins voient tout, Assistants voient leurs magasins assignés
    if (user?.role === "superadmin" || user?.role === "assistant") {
      try {
        const data = await magasinService.getAll();
        if (user?.role === "assistant") {
          // Filtrer localement pour l'assistant (le backend filtre déjà normalement mais on sécurise l'affichage)
          const assignedIds = (user.assignedMagasins || []).map(m => (m._id || m).toString());
          setMagasins(data.filter(m => assignedIds.includes(m._id.toString())));
        } else {
          setMagasins(data);
        }
      } catch (error) {
        console.error("Erreur magasins", error);
      }
    }
  };

  useEffect(() => {
    loadNotifications();
    loadMagasins();
    const interval = setInterval(loadNotifications, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotifClick = async (notif) => {
    try {
      await notificationService.markAsRead(notif._id);
      loadNotifications();
      if (notif.link) {
        navigate(notif.link);
        setShowNotifs(false);
      }
    } catch (error) {
      console.error("Erreur marquage lu", error);
    }
  };

  const handleMagasinChange = (id) => {
    if (id) {
      sessionStorage.setItem("activeMagasinId", id);
    } else {
      sessionStorage.removeItem("activeMagasinId");
    }
    setActiveMagasinId(id);
    setShowMagasinSelect(false);
    // Rafraîchir pour appliquer le filtre globalement via l'intercepteur axios
    window.location.reload();
  };

  const getActiveMagasinLabel = () => {
    if (!activeMagasinId) return "Vue Globale";
    const m = magasins.find(x => x._id === activeMagasinId);
    return m ? m.nom : "Chargement...";
  };

  const getCurrentTitle = () => {
    const currentPath = location.pathname.replace("/app/", "");
    if (location.pathname === "/app") return "Tableau de bord";
    const item = menuItems
      .flatMap((section) => section.items)
      .find((item) => item.id === currentPath);
    return item?.label || "Tableau de bord";
  };

  const handleLogout = () => {
    // Utiliser le store d'authentification Zustand
    useAuthStore.getState().logout();
    navigate("/");
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-40 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
        >
          <Menu size={20} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-none">
            {getCurrentTitle()}
          </h1>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 hidden md:block">
            Système de gestion intégré
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Affichage/Sélecteur de Magasin */}
        <div className="relative mr-2">
          {user?.role === "superadmin" || user?.role === "assistant" ? (
            // Sélecteur Interactif pour Super Admin et Assistant
            <>
              <button
                onClick={() => setShowMagasinSelect(!showMagasinSelect)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 hover:bg-white hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/5 transition-all group"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 border border-amber-100/40 flex items-center justify-center">
                  {activeMagasinId ? <Store size={14} /> : <Globe size={14} />}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 leading-none mb-1">Point de vente</span>
                  <span className="text-[11px] font-bold text-slate-900 leading-none">{getActiveMagasinLabel()}</span>
                </div>
                <ChevronDown size={12} className={`text-slate-400 transition-transform ${showMagasinSelect ? 'rotate-180' : ''}`} />
              </button>

              {showMagasinSelect && (
                <div className="absolute top-full mt-2 left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-150 py-3 z-50 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-5 mb-3">
                    <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Choisir une agence</h3>
                  </div>
                  <div className="space-y-1 px-2">
                    {user?.role === "superadmin" && (
                      <button
                        onClick={() => handleMagasinChange("")}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${!activeMagasinId ? 'bg-amber-50 text-amber-700 border border-amber-100/40' : 'hover:bg-slate-50 text-slate-600'}`}
                      >
                        <Globe size={14} className="text-amber-600" />
                        <span className="text-xs font-bold">Vue Globale (Tous)</span>
                      </button>
                    )}
                    {user?.role === "superadmin" && <div className="h-[1px] bg-slate-100 mx-3 my-2"></div>}
                    {magasins.map(m => (
                      <button
                        key={m._id}
                        onClick={() => handleMagasinChange(m._id)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${activeMagasinId === m._id ? 'bg-amber-50 text-amber-700 border border-amber-100/40' : 'hover:bg-slate-50 text-slate-600'}`}
                      >
                        <Store size={14} className="text-amber-600" />
                        <div className="flex flex-col items-start">
                          <span className="text-xs font-bold">{m.nom}</span>
                          <span className="text-[9px] font-bold text-slate-400">{m.ville}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            // Affichage Simple (Lecture seule) pour Utilisateur Magasin
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-50/50 border border-slate-100/50 text-slate-600">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <Store size={16} />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[9px] font-black uppercase tracking-tighter text-slate-300 leading-none mb-1">Magasin Affecté</span>
                <span className="text-[11px] font-black text-slate-500 leading-none">{user?.magasin?.nom || "Chargement..."}</span>
              </div>
            </div>
          )}
        </div>

        {/* Barre de recherche premium */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 w-60 focus-within:bg-white focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 transition-all duration-300 group">
          <Search size={14} className="text-slate-400 group-focus-within:text-amber-500" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-transparent border-none outline-none text-xs font-bold w-full text-slate-700 placeholder:text-slate-400"
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 px-1">
          {/* Notifications */}
          <div className="relative group/notif">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className={`relative w-10 h-10 rounded-xl border flex items-center justify-center transition-all shadow-sm ${
                unreadCount > 0 
                ? "bg-amber-50 text-amber-600 border-amber-100 animate-pulse" 
                : "bg-white text-slate-500 border-slate-100 hover:bg-slate-50"
              }`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white"></span>
              )}
            </button>

            {/* Dropdown Notifications */}
            {showNotifs && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 py-4 z-50 animate-in slide-in-from-top-2 duration-300">
                <div className="px-6 mb-4 flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Notifications</h3>
                  {unreadCount > 0 && <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full">{unreadCount} neuve(s)</span>}
                </div>
                
                <div className="max-h-96 overflow-y-auto px-2 space-y-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center">
                      <div className="text-2xl mb-2 opacity-20">🔔</div>
                      <p className="text-[10px] font-black uppercase text-slate-400">Aucune notification</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n._id} 
                        onClick={() => handleNotifClick(n)}
                        className={`p-3 rounded-2xl transition-all cursor-pointer border border-transparent ${
                          n.read ? "opacity-60 grayscale hover:grayscale-0 hover:opacity-100" : "bg-slate-50 hover:bg-white hover:border-slate-100 hover:shadow-lg hover:shadow-slate-200/50"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs ${
                            n.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
                            n.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {n.type === 'warning' ? '⚠️' : n.type === 'success' ? '✅' : '📢'}
                          </div>
                          <div>
                            <div className="text-[11px] font-black text-slate-900 leading-none mb-1">{n.title}</div>
                            <p className="text-[10px] text-slate-500 font-bold leading-tight">{n.message}</p>
                            <div className="text-[9px] font-mono text-slate-400 mt-2">{new Date(n.createdAt).toLocaleDateString('fr-FR')}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="mt-4 px-6 pt-3 border-t border-slate-50">
                  <button className="w-full text-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors">Tout marquer comme lu</button>
                </div>
              </div>
            )}
          </div>

          {/* Logout Shortcut */}
          <button 
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100 flex items-center justify-center"
            title="Déconnexion"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* User Quick View */}
        <div className="h-10 w-[1px] bg-slate-100 mx-1 hidden sm:block"></div>
        
        <div className="flex items-center gap-3 pl-2 group cursor-pointer" onClick={() => navigate("/app/societe")}>
          <div className="hidden md:flex flex-col items-end">
            <div className="text-[11px] font-black text-slate-900 leading-none">{user?.name}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
              {user?.role === 'superadmin' ? 'Super Administrateur' : 
               user?.role === 'assistant' ? 'Assistant Multi-Sites' : 
               user?.role === 'chef_magasin' ? 'Chef de Magasin' : 'Agent Magasin'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-amber-600 group-hover:bg-amber-50 transition-colors">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
