// AppLayout.js
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./layout/Sidebar";
import TopBar from "./layout/TopBar";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Récupérer l'utilisateur du localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erreur parsing user:", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - visible sur desktop, conditionnelle sur mobile */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} user={user} />

      {/* Zone principale */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar onMenuToggle={toggleSidebar} user={user} />

        {/* Contenu défilant avec le padding exact de l'original */}
        <main className="flex-1 overflow-y-auto p-[22px_26px_50px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
