import React, { useState, useEffect } from "react";
import { Calendar, Clock, AlertCircle, Package, User } from "lucide-react";
import crmService from "../services/crmService";

const RenouvellementsView = () => {
  const [renouvellements, setRenouvellements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [daysFilter, setDaysFilter] = useState(30);

  useEffect(() => {
    loadRenouvellements();
  }, [daysFilter]);

  const loadRenouvellements = async () => {
    try {
      const data = await crmService.getRenouvellements(daysFilter);
      setRenouvellements(data);
    } catch (error) {
      console.error("Erreur chargement renouvellements:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysColor = (dateFin) => {
    const days = Math.ceil((new Date(dateFin) - new Date()) / (1000 * 60 * 60 * 24));
    if (days <= 3) return "text-red-600 bg-red-50";
    if (days <= 7) return "text-amber-600 bg-amber-50";
    return "text-emerald-600 bg-emerald-50";
  };

  const getDaysText = (dateFin) => {
    const days = Math.ceil((new Date(dateFin) - new Date()) / (1000 * 60 * 60 * 24));
    if (days < 0) return "Expiré";
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Demain";
    return `Dans ${days} jours`;
  };

  if (loading) {
    return <div className="text-slate-500">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filtre */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Renouvellements à venir</h2>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Période :</label>
            <select
              value={daysFilter}
              onChange={(e) => setDaysFilter(parseInt(e.target.value))}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value={7}>7 jours</option>
              <option value={14}>14 jours</option>
              <option value={30}>30 jours</option>
              <option value={60}>60 jours</option>
              <option value={90}>90 jours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des renouvellements */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">
              Commandes à renouveler ({renouvellements.length})
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar size={16} />
              {new Date().toLocaleDateString("fr-FR")}
            </div>
          </div>
        </div>

        <div className="p-6">
          {renouvellements.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Aucun renouvellement prévu pour cette période
            </div>
          ) : (
            <div className="space-y-4">
              {renouvellements.map((cmd) => (
                <div
                  key={cmd._id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-emerald-300 transition"
                >
                  <div className="p-3 bg-slate-100 rounded-lg">
                    <Package size={24} className="text-slate-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium text-slate-800">{cmd.reference}</p>
                      {cmd.equipement && (
                        <span className="text-sm text-slate-500">
                          {cmd.equipement.icon} {cmd.equipement.name}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      {cmd.client && (
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {cmd.client.prenom} {cmd.client.nom}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(cmd.dateDebut).toLocaleDateString("fr-FR")} →{" "}
                        {new Date(cmd.dateFin).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getDaysColor(cmd.dateFin)}`}>
                      <AlertCircle size={14} />
                      {getDaysText(cmd.dateFin)}
                    </div>
                    <div className="text-sm font-semibold text-slate-800 mt-1">
                      {cmd.montantTTC?.toLocaleString()} MAD
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RenouvellementsView;
