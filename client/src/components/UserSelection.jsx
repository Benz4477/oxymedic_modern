// src/pages/UserSelection.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Exemple de service API (à adapter)
import userService from "../services/userService";

const UserSelection = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si on vient de la page 404 pour éviter la redirection automatique
    const from404 = sessionStorage.getItem('from404');
    if (from404) {
      sessionStorage.removeItem('from404');
      return; // Ne pas charger les utilisateurs, rester sur la page 404
    }

    // Récupérer les utilisateurs actifs depuis l'API
    setLoading(true);
    userService.getAll()
      .then(data => {
        // Trier: superadmin, puis admin, puis les autres par nom
        const roleOrder = { superadmin: 0, admin: 1 };
        const sorted = data.sort((a, b) => {
          const orderA = roleOrder[a.role] ?? 2;
          const orderB = roleOrder[b.role] ?? 2;
          if (orderA !== orderB) return orderA - orderB;
          return a.name.localeCompare(b.name);
        });
        setUsers(sorted);
      })
      .catch(err => {
        console.error("Erreur chargement utilisateurs:", err);
        setError("Impossible de charger les utilisateurs");
      })
      .finally(() => setLoading(false));
  }, []);

  const selectUser = (userId) => {
    navigate(`/login/${userId}`);
  };

  const handleManualLogin = () => {
    navigate("/login/manual");
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
      <div className="w-full p-8">
        {/* Logo & Brand */}
        <div className="flex flex-col items-center justify-center mb-6">
          <img
            src="/Logo1.png"
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

        {/* État de chargement */}
        {loading && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des utilisateurs...</p>
          </div>
        )}

        {/* État d'erreur */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={handleManualLogin}
              className="text-emerald-600 hover:text-emerald-700 underline"
            >
              Connexion manuelle
            </button>
          </div>
        )}

        {/* Grille des utilisateurs */}
        {!loading && !error && users.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 max-w-2xl mx-auto">
            {users.map((user) => (
              <button
                key={user._id}
                onClick={() => selectUser(user._id)}
                className="p-3 rounded-xl border-2 border-gray-200 bg-gray-50 hover:border-green-400 hover:bg-green-50 transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <div className="w-10 h-10 mx-auto rounded-full bg-green-100 border-2 border-green-300 flex items-center justify-center text-sm font-extrabold text-green-700 mb-2">
                  {getInitials(user.name)}
                </div>
                <div className="text-sm font-bold text-gray-800">
                  {user.name.split(" ")[0]}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {user.role === "superadmin" && "🛡️ Super Admin"}
                  {user.role === "admin" && "👑 Admin"}
                  {user.role === "employe" && "👤 Employé"}
                  {user.role === "livreur" && "🚚 Livreur"}
                  {user.role === "caissier" && "💰 Caissier"}
                  {user.role === "comptable" && "📊 Comptable"}
                  {user.role === "technicien" && "🔧 Technicien"}
                  {user.role === "commercial" && "💼 Commercial"}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Aucun utilisateur */}
        {!loading && !error && users.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Aucun utilisateur disponible</p>
            <button
              onClick={handleManualLogin}
              className="text-emerald-600 hover:text-emerald-700 underline"
            >
              Connexion manuelle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSelection;
