// src/pages/LoginScreen.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { login } from "../services/authService";
import { getUserById } from "../services/userService";

const LoginScreen = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Charger l'utilisateur sélectionné
  useEffect(() => {
    if (userId) {
      getUserById(userId).then(setUser).catch(console.error);
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("❌ Aucun utilisateur sélectionné");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await login(user.username, password);
      // Stocker le token et les informations utilisateur (contexte ou localStorage)
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      // Rediriger vers l'application (tableau de bord)
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "❌ Identifiant ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  if (!user && userId) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0  flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full p-8 animate-[loginIn_0.4s_cubic-bezier(0.175,0.885,0.32,1.1)]">
        {/* Logo */}
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
            Entrez votre mot de passe pour {user ? user.name : "votre compte"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={user ? user.username : ""}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
            />
          </div>

          <div className="mb-6 relative">
            <label className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              "Connexion..."
            ) : (
              <>
                Se connecter
                <LogIn size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
