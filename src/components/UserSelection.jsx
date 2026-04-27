// src/pages/UserSelection.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Exemple de service API (à adapter)
import { fetchActiveUsers } from "../services/userService";

const UserSelection = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les utilisateurs actifs depuis l'API
    fetchActiveUsers().then(setUsers).catch(console.error);
  }, []);

  const selectUser = (userId) => {
    navigate(`/login/${userId}`);
  };

  // Fonction pour obtenir les initiales
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8">
        {/* Logo & Brand */}
        <div className="flex flex-col items-center justify-center mb-6">
          <img
            src="/Logo.png"
            alt="OXYMEDIC"
            className="w-28 h-28 object-contain"
          />
          <div className="text-center -mt-6">
            <div className="text-xs text-gray-500 uppercase tracking-wider">
              Gestion Pro · Casablanca
            </div>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
            Connexion
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Sélectionnez votre profil
          </p>
        </div>

        {/* Grille des utilisateurs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => selectUser(user.id)}
              className="p-3 rounded-xl border-2 border-gray-200 bg-gray-50 hover:border-green-400 hover:bg-green-50 transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center text-sm font-extrabold text-green-700 mb-2">
                {getInitials(user.name)}
              </div>
              <div className="text-sm font-bold text-gray-800">
                {user.name.split(" ")[0]}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {user.role === "admin" && "🛡️ Admin"}
                {user.role === "employe" && "👤 Employé"}
                {user.role === "livreur" && "🚚 Livreur"}
                {user.role === "caissier" && "💰 Caissier"}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSelection;
