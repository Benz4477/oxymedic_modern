import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  useEffect(() => {
    // Marquer qu'on vient de la page 404 pour éviter la redirection vers la connexion
    sessionStorage.setItem('from404', 'true');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center">
        {/* Icône simple */}
        <div className="text-6xl mb-4">🔍</div>
        
        {/* Message simple */}
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page non trouvée</h1>
        <p className="text-slate-500 mb-6">
          La page que vous cherchez n'existe pas.
        </p>

        {/* Boutons simples */}
        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Home size={16} />
            Accueil
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
