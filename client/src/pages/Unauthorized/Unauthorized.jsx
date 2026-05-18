import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 md:p-8">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[35%] h-[35%] bg-amber-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[35%] bg-slate-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[480px] w-full bg-white border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-900/5 p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500 font-display">
        <div className="mx-auto p-4 bg-amber-50 rounded-2xl text-amber-500 w-fit shadow-md shadow-amber-500/5">
          <ShieldAlert size={32} />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Accès Non Autorisé</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Erreur de Sécurité 403</p>
        </div>

        <p className="text-slate-500 font-sans text-xs md:text-sm leading-relaxed max-w-[360px] mx-auto">
          Vos droits d'accès actuels ne vous permettent pas d'accéder à ce module d'Oxymedic. Veuillez contacter un super administrateur si vous pensez qu'il s'agit d'une erreur.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200/60 rounded-xl text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition uppercase tracking-widest shadow-sm"
          >
            <ArrowLeft size={14} /> Retourner
          </button>
          <button
            onClick={() => navigate("/app/dashboard")}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition shadow-lg shadow-slate-900/10 active:scale-95"
          >
            <Home size={14} /> Accueil
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
