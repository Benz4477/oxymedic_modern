import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import TopBar from "./layout/TopBar";
import magasinService from "../services/magasinService";
import { Info } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();
  const [activeMagasin, setActiveMagasin] = useState(null);

  useEffect(() => {
    loadActiveMagasin();
  }, [user]);

  const loadActiveMagasin = async () => {
    const id = sessionStorage.getItem("activeMagasinId");
    if (!id || id === "[object Object]") return setActiveMagasin(null);
    try {
      const data = await magasinService.getById(id);
      setActiveMagasin(data);
    } catch (e) {
      console.error("Error loading active magasin", e);
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const isDepot = activeMagasin?.type === "depot";

  return (
    <div className="flex h-screen bg-slate-50/50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar} 
        user={user} 
        activeMagasin={activeMagasin}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar onMenuToggle={toggleSidebar} user={user} />

        {isDepot && (
          <div className="bg-amber-600 text-white px-8 py-2 flex items-center justify-between shadow-lg z-30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Info size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Mode Logistique Actif</span>
                <span className="text-xs font-bold leading-none mt-1">Vous êtes sur le dépôt <span className="underline">{activeMagasin?.nom}</span>. Les ventes et factures sont désactivées ici.</span>
              </div>
            </div>
            <div className="text-[9px] font-black border border-white/30 px-3 py-1 rounded-full uppercase tracking-tighter bg-white/10">
              Stock Uniquement
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-[22px_26px_50px]">
          <Outlet context={{ user, activeMagasin, isDepot }} />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
