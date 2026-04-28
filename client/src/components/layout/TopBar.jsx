import React from "react";
import { Menu, Bell, LogOut, Search } from "lucide-react";
import { menuItems } from "../../config/menuItems";
import { useLocation, useNavigate } from "react-router-dom";

const TopBar = ({ onMenuToggle, onSearch, user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentTitle = () => {
    const currentPath = location.pathname.replace("/app/", "");
    if (location.pathname === "/app") return "Tableau de bord";
    const item = menuItems
      .flatMap((section) => section.items)
      .find((item) => item.id === currentPath);
    return item?.label || "Tableau de bord";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="h-[60px] border-b border-gray-200 bg-white shadow-sm flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-md bg-white border border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors"
        >
          <Menu size={16} />
        </button>
        <h1 className="text-base font-extrabold text-gray-900">
          {getCurrentTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Barre de recherche (optionnelle, reprise de l'original) */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 w-56 focus-within:bg-white focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all">
          <Search size={13} className="text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher…"
            className="bg-transparent border-none outline-none text-sm w-full text-gray-800 placeholder:text-gray-400"
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>

        {/* Bouton de notification */}
        <button className="relative w-9 h-9 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors">
          <Bell size={14} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
        </button>

        {/* Bouton WhatsApp (optionnel, non présent dans l'original mais pourrait être ajouté) */}
        <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold hover:bg-teal-100 transition">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          WhatsApp
        </button>

        {/* Bouton déconnexion */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-100 transition"
        >
          <LogOut size={14} />
          Déconnexion
        </button>
      </div>
    </header>
  );
};

export default TopBar;
