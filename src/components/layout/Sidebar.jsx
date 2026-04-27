import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { menuItems } from "../../config/menuItems";

const Sidebar = ({ isOpen, onClose, user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    else {
      // comportement par défaut
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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
          fixed top-0 left-0 z-50 h-full w-64 flex flex-col bg-gray-900 text-white
          transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header avec logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <img
            src="/Logo.png"
            alt="OXYMEDIC"
            className="w-20 h-20 object-contain"
          />
          <div>
            <div className="text-sm font-extrabold tracking-wide text-white">
              OXYMEDIC
            </div>
            <div className="text-[9px] text-white/30 uppercase tracking-wider">
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
                <div className="text-[9px] font-extrabold uppercase tracking-wider text-white/30 px-5 pt-5 pb-1">
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
                      `flex items-center gap-3 mx-2 my-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                      ${
                        isActive
                          ? "bg-green-500/20 text-green-400 shadow-[inset_0_0_0_1px_rgba(74,222,128,0.2)]"
                          : "text-white/50 hover:bg-white/10 hover:text-white/85"
                      }`
                    }
                    onClick={onClose}
                  >
                    <div className="w-7 h-7 rounded-md flex items-center justify-center bg-white/10 text-sm">
                      <Icon size={14} />
                    </div>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-red-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer utilisateur */}
        <div className="border-t border-white/10 p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-700 to-green-600 flex items-center justify-center text-xs font-bold text-white">
            {getInitials()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white/90 truncate">
              {user?.name || "Utilisateur"}
            </div>
            <div className="text-[10px] text-white/30">
              {roleLabels[user?.role] || user?.role || "Rôle"}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-7 h-7 rounded-md border border-white/20 bg-transparent text-white/40 hover:bg-white/10 hover:text-white flex items-center justify-center transition"
            title="Déconnexion"
          >
            <span className="text-sm">⏏</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
