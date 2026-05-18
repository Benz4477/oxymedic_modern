import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, ShieldCheck, ChevronLeft } from "lucide-react";
import { login } from "../services/authService";
import userService from "../services/userService";
import { useAuthStore } from "../store/authStore";

const LoginScreen = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("❌ Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await login(email, password);
      
      // Utiliser le store d'authentification Zustand
      useAuthStore.getState().login(response.data, response.token);
      
      navigate("/app/dashboard");
    } catch (err) {
      setError(err.message || "❌ Identifiant ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-[#F8FAFC] flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-500/5 max-w-[400px] w-full p-8 relative">
        <div className="flex flex-col items-center justify-center mb-0">
          <div>
            <img src="/Logo1.png" alt="OXYMEDIC" className="w-28 h-28 object-contain" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Bon retour</h2>
          <p className="text-xs font-bold text-slate-400">
            Connectez-vous à votre espace
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-[11px] font-black flex items-center gap-3 animate-shake">
            <span className="text-lg">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email ou Identifiant</label>
            <input
              type="text"
              placeholder="prenom.nom@oxymedic.fr ou identifiant"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none placeholder:text-slate-200"
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="space-y-2 relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mot de passe</label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
                className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all outline-none placeholder:text-slate-200"
                autoComplete="current-password"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-5 text-slate-300 hover:text-emerald-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              " Connexion..."
            ) : (
              <>
                Connexion <LogIn size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
