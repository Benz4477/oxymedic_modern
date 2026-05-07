import React, { useState, useEffect } from "react";
import { Users, TrendingUp, Star, Award } from "lucide-react";
import crmService from "../services/crmService";

const SegmentsView = () => {
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSegments();
  }, []);

  const loadSegments = async () => {
    try {
      const data = await crmService.getSegments();
      setSegments(data);
    } catch (error) {
      console.error("Erreur chargement segments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreBadge = (score) => {
    switch (score.grade) {
      case "A":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
            <Star size={12} />
            {score.label}
          </span>
        );
      case "B":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
            <TrendingUp size={12} />
            {score.label}
          </span>
        );
      case "C":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
            {score.label}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
            {score.label}
          </span>
        );
    }
  };

  const getDaysSinceColor = (days) => {
    if (!days) return "text-slate-500";
    if (days <= 30) return "text-emerald-600";
    if (days <= 90) return "text-amber-600";
    return "text-red-600";
  };

  if (loading) {
    return <div className="text-slate-500">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {["A", "B", "C", "D"].map((grade) => {
          const count = segments.filter((s) => s.score.grade === grade).length;
          const colors = {
            A: "bg-purple-50 border-purple-200 text-purple-700",
            B: "bg-blue-50 border-blue-200 text-blue-700",
            C: "bg-amber-50 border-amber-200 text-amber-700",
            D: "bg-slate-50 border-slate-200 text-slate-700",
          };
          const labels = { A: "VIP", B: "Fidèle", C: "Actif", D: "Prospect" };
          return (
            <div key={grade} className={`p-4 rounded-xl border ${colors[grade]}`}>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm font-medium">{labels[grade]}</div>
            </div>
          );
        })}
      </div>

      {/* Tableau des segments */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Segments Clients</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Segment
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Commandes
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  CA Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Dernière commande
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Jours depuis
                </th>
              </tr>
            </thead>
            <tbody>
              {segments.map((segment) => (
                <tr key={segment._id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">
                      {segment.prenom} {segment.nom}
                    </div>
                    <div className="text-sm text-slate-500">{segment.tel}</div>
                  </td>
                  <td className="px-6 py-4">{getScoreBadge(segment.score)}</td>
                  <td className="px-6 py-4 text-slate-600">{segment.cmdsCount}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {segment.totalCA.toLocaleString()} MAD
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {segment.lastCmd
                      ? new Date(segment.lastCmd).toLocaleDateString("fr-FR")
                      : "—"}
                  </td>
                  <td className="px-6 py-4">
                    {segment.daysSince !== null ? (
                      <span className={`font-medium ${getDaysSinceColor(segment.daysSince)}`}>
                        {segment.daysSince} jours
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SegmentsView;
