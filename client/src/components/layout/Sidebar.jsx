import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getMenuForUser } from "../../config/menuItems";

const Sidebar = ({ isOpen, onClose, user, activeMagasin, onLogout }) => {
  const navigate = useNavigate();
  const menuItems = getMenuForUser(user, activeMagasin?.type);

  const handleLogout = () => {
    if (onLogout) onLogout();
    else {
      // comportement par défaut
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      navigate("/login");
    }
  };

  // Initiales pour l'avatar
  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const roleLabels = {
    admin: "Administrateur",
    employe: "Employé",
    livreur: "Livreur",
    caissier: "Caissier",
    comptable: "Comptable",
    commercial: "Commercial",
    technicien: "Technicien",
  };

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 flex flex-col bg-white text-slate-900
          border-r border-slate-100 transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header avec logo */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <img
            src="/Logo1.png"
            alt="OXYMEDIC"
            className="w-12 h-12 object-contain drop-shadow-sm"
          />
          <div>
            <div className="text-xs font-black tracking-wider text-slate-900 font-display">
              OXYMEDIC
            </div>
            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
              Gestion Pro
            </div>
          </div>
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 overflow-y-auto py-2">
          {menuItems.map((section, idx) => (
            <div key={idx}>
              {/* Séparateur de section */}
              {section.title && (
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-300 px-5 pt-5 pb-1">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = (match, location) => {
                  if (item.id === "dashboard")
                    return (
                      location.pathname === "/app" ||
                      location.pathname === "/app/dashboard"
                    );
                  return location.pathname === `/app/${item.id}`;
                };
                return (
                  <NavLink
                    key={item.id}
                    to={`/app/${item.id}`}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 mx-3 my-0.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300
                      ${
                        isActive
                          ? "bg-amber-50/70 text-amber-700 shadow-sm border border-amber-100/60"
                          : "text-slate-500 hover:bg-slate-50/80 hover:text-slate-900 border border-transparent"
                      }`
                    }
                    onClick={onClose}
                  >
                    {({ isActive }) => (
                      <>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${isActive ? "bg-white text-amber-600 shadow-sm" : "bg-slate-50 text-slate-400 group-hover:text-amber-500 group-hover:bg-white"}`}>
                          <Icon size={14} />
                        </div>
                        <span className="flex-1 tracking-tight">{item.label}</span>
                        {item.badge && (
                          <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer utilisateur */}
        <div className="border-t border-slate-100 p-4 flex items-center gap-3 bg-slate-50/50">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-sm font-black text-amber-700 shadow-sm">
            {getInitials()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-black text-slate-900 truncate">
              {user?.name || "Utilisateur"}
            </div>
            <div className="text-[10px] font-bold text-slate-400">
              {roleLabels[user?.role] || user?.role || "Rôle"}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 flex items-center justify-center transition-all shadow-sm"
            title="Déconnexion"
          >
            <span className="text-lg">⏏</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
