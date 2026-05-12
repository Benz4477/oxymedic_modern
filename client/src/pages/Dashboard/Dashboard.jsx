import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Users, ShoppingCart, CreditCard, Package,
  TrendingUp, TrendingDown, RefreshCw, AlertTriangle,
  Clock, Activity, Calendar,
} from "lucide-react";
import { fetchAllDashboardData, fetchSociete } from "../../services/dashboardService";

const fmtMad  = (n) => `${(n || 0).toLocaleString("fr-FR")} MAD`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "—";
const COLORS  = ["#16A34A", "#2563EB", "#7C3AED", "#0891B2", "#D97706", "#DC2626", "#059669"];

const Badge = ({ statut }) => {
  const map = {
    active: { label: "Active", cls: "bg-emerald-100 text-emerald-700" },
    pending: { label: "En attente", cls: "bg-amber-100 text-amber-700" },
    transit: { label: "En transit", cls: "bg-blue-100 text-blue-700" },
    ended: { label: "Terminée", cls: "bg-slate-100 text-slate-600" },
    cancelled: { label: "Annulée", cls: "bg-red-100 text-red-700" },
    paid: { label: "Payé", cls: "bg-emerald-100 text-emerald-700" },
    unpaid: { label: "Impayé", cls: "bg-red-100 text-red-700" },
    partial: { label: "Partiel", cls: "bg-amber-100 text-amber-700" },
    draft: { label: "Brouillon", cls: "bg-slate-100 text-slate-600" },
  };
  const s = map[statut] || { label: statut, cls: "bg-slate-100 text-slate-600" };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.cls}`}>{s.label}</span>;
};

const KpiCard = ({ icon: Icon, iconBg, iconColor, label, value, sub, subColor, evol, onClick }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 min-w-[200px] flex-1 ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
    onClick={onClick}>
    <div className="flex justify-between items-start mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={18} className={iconColor} />
      </div>
      {evol !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-bold ${evol >= 0 ? "text-emerald-600" : "text-red-500"}`}>
          {evol >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {evol >= 0 ? "+" : ""}{evol}%
        </div>
      )}
    </div>
    <div className="text-xl font-extrabold text-slate-900 truncate">{value}</div>
    <div className="text-xs text-slate-400 mt-1">{label}</div>
    {sub && <div className={`text-xs mt-1 font-medium ${subColor || "text-slate-500"}`}>{sub}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg text-xs">
      <div className="font-bold text-slate-700 mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name} : {p.value?.toLocaleString("fr-FR")}</div>
      ))}
    </div>
  );
};

const hp = (user, perm) => user?.role === "admin" || user?.permissions?.[perm] === true;

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData]       = useState(null);
  const [societe, setSociete] = useState({});
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashData, socData] = await Promise.all([fetchAllDashboardData(), fetchSociete()]);
      setData(dashData);
      setSociete(socData);
      setLastRefresh(new Date());
    } catch (err) { console.error("Dashboard:", err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50/60 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Chargement du tableau de bord...</p>
      </div>
    </div>
  );

  if (!data) return null;

  const nomSoc = societe.nom || "OXYMEDIC";

  const kpis1 = [
    hp(user, "clients") && { icon: Users, iconBg: "bg-blue-50", iconColor: "text-blue-600", label: "Clients enregistrés", value: data.totalClients, onClick: () => navigate("/app/clients") },
    hp(user, "commandes") && { icon: ShoppingCart, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", label: "Commandes actives", value: data.commandesActives, sub: `${data.commandesPending} en attente`, subColor: data.commandesPending > 0 ? "text-amber-500" : "text-slate-400", onClick: () => navigate("/app/commandes") },
    hp(user, "stock") && { icon: Package, iconBg: "bg-purple-50", iconColor: "text-purple-600", label: "Taux d'occupation", value: `${data.tauxOccupation}%`, sub: `${data.unitsLoues}/${data.totalUnits} unités louées`, onClick: () => navigate("/app/serials") },
    hp(user, "paiements") && { icon: CreditCard, iconBg: "bg-emerald-50", iconColor: "text-emerald-600", label: "CA ce mois", value: fmtMad(data.caMois), evol: data.caEvol, sub: `Total : ${fmtMad(data.caTotal)}`, onClick: () => navigate("/app/paiements") },
  ].filter(Boolean);

  const kpis2 = [
    hp(user, "facturation") && { icon: AlertTriangle, iconBg: "bg-red-50", iconColor: "text-red-500", label: "Factures impayées", value: data.facturesImpayees.length, sub: fmtMad(data.totalRestant) + " restant", subColor: "text-red-500", onClick: () => navigate("/app/facturation") },
    hp(user, "paiements") && { icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600", label: "Paiements en attente", value: data.paiementsPending, onClick: () => navigate("/app/paiements") },
    hp(user, "commandes") && { icon: Calendar, iconBg: "bg-orange-50", iconColor: "text-orange-600", label: "Contrats expirant (7j)", value: data.commandesARenouveler.length, subColor: "text-orange-500", sub: data.commandesARenouveler.length > 0 ? "À renouveler" : "Aucun", onClick: () => navigate("/app/commandes") },
    hp(user, "stock") && { icon: Activity, iconBg: "bg-slate-50", iconColor: "text-slate-600", label: "Unités en maintenance", value: data.unitsMaintenance, subColor: data.unitsMaintenance > 0 ? "text-orange-500" : "text-slate-400", sub: data.unitsMaintenance > 0 ? "Attention requise" : "Tout est OK", onClick: () => navigate("/app/serials") },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 space-y-6">

      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Tableau de bord</h1>
          <p className="text-sm text-slate-400 mt-0.5">{nomSoc} · {fmtDate(new Date())} · Actualisé à {lastRefresh.toLocaleTimeString("fr-FR")}</p>
        </div>
        <button onClick={loadData} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition">
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      {data.alertes.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {data.alertes.map((a, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium flex-1 min-w-[250px] ${a.type === "danger" ? "bg-red-50 border-red-200 text-red-700" : a.type === "warning" ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-blue-50 border-blue-200 text-blue-700"}`}>
              <span className="text-base">{a.icon}</span><span>{a.message}</span>
            </div>
          ))}
        </div>
      )}

      {kpis1.length > 0 && <div className="flex flex-wrap gap-4">{kpis1.map((kpi, i) => <KpiCard key={i} {...kpi} />)}</div>}
      {kpis2.length > 0 && <div className="flex flex-wrap gap-4">{kpis2.map((kpi, i) => <KpiCard key={i} {...kpi} />)}</div>}

      {(hp(user, "paiements") || hp(user, "commandes") || hp(user, "stock") || hp(user, "crm")) && (
        <div className="flex flex-wrap gap-6">
          {hp(user, "paiements") && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex-1 min-w-[320px]">
              <h3 className="text-sm font-bold text-slate-800 mb-4">📈 CA encaissé — 12 derniers mois</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.caParMois}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="mois" tick={{ fontSize: 10, fill: "#94A3B8" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} formatter={v => [fmtMad(v), "CA"]} />
                  <Line type="monotone" dataKey="ca" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 3, fill: "#16A34A" }} name="CA (MAD)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          {hp(user, "commandes") && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex-1 min-w-[320px]">
              <h3 className="text-sm font-bold text-slate-800 mb-4">📦 Commandes — 6 derniers mois</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.commandesParMois}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="mois" tick={{ fontSize: 10, fill: "#94A3B8" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="commandes" fill="#2563EB" radius={[4, 4, 0, 0]} name="Commandes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {hp(user, "stock") && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex-1 min-w-[320px]">
              <h3 className="text-sm font-bold text-slate-800 mb-4">🏆 Top équipements loués</h3>
              {data.topEquipements.length === 0 ? <div className="text-center text-slate-400 text-sm py-8">Aucune donnée</div> : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={data.topEquipements} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#94A3B8" }} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} width={110} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#7C3AED" radius={[0, 4, 4, 0]} name="Locations" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          )}
          {hp(user, "crm") && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex-1 min-w-[320px]">
              <h3 className="text-sm font-bold text-slate-800 mb-4">🗂️ Répartition par catégorie</h3>
              {data.repartitionCat.length === 0 ? <div className="text-center text-slate-400 text-sm py-8">Aucune donnée</div> : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={data.repartitionCat} cx="50%" cy="50%" outerRadius={75} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`} labelLine={false} fontSize={10}>
                      {data.repartitionCat.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-6">
        {hp(user, "commandes") && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-1 min-w-[360px]">
            <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">📋 Commandes récentes</h3>
              <button onClick={() => navigate("/app/commandes")} className="text-xs text-emerald-600 font-bold hover:underline">Voir tout →</button>
            </div>
            {data.recentCommandes.length === 0 ? <div className="p-8 text-center text-slate-400 text-sm">Aucune commande</div> : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase"><tr><th className="px-4 py-2 text-left">Référence</th><th className="px-4 py-2 text-left">Client</th><th className="px-4 py-2 text-left">Statut</th><th className="px-4 py-2 text-right">Montant</th></tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {data.recentCommandes.map(cmd => (
                    <tr key={cmd._id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate("/app/commandes")}>
                      <td className="px-4 py-2.5 font-mono text-xs font-semibold text-blue-600">{cmd.reference}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-800 text-xs">{cmd.client ? `${cmd.client.prenom || ""} ${cmd.client.nom || ""}`.trim() : "—"}</td>
                      <td className="px-4 py-2.5"><Badge statut={cmd.statut} /></td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-800 text-xs">{fmtMad(cmd.montantTTC)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {hp(user, "paiements") && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-1 min-w-[360px]">
            <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">💰 Paiements récents</h3>
              <button onClick={() => navigate("/app/paiements")} className="text-xs text-emerald-600 font-bold hover:underline">Voir tout →</button>
            </div>
            {data.recentPaiements.length === 0 ? <div className="p-8 text-center text-slate-400 text-sm">Aucun paiement</div> : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase"><tr><th className="px-4 py-2 text-left">Référence</th><th className="px-4 py-2 text-left">Client</th><th className="px-4 py-2 text-left">Statut</th><th className="px-4 py-2 text-right">Montant</th></tr></thead>
                <tbody className="divide-y divide-slate-50">
                  {data.recentPaiements.map(p => (
                    <tr key={p._id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate("/app/paiements")}>
                      <td className="px-4 py-2.5 font-mono text-xs font-semibold text-purple-600">{p.reference}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-800 text-xs">{p.client ? `${p.client.prenom || ""} ${p.client.nom || ""}`.trim() : "—"}</td>
                      <td className="px-4 py-2.5"><Badge statut={p.statut} /></td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-800 text-xs">{fmtMad(p.montant)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {hp(user, "facturation") && data.facturesImpayees.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">🧾 Factures impayées <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-600 font-bold">{data.facturesImpayees.length}</span></h3>
            <button onClick={() => navigate("/app/facturation")} className="text-xs text-emerald-600 font-bold hover:underline">Voir tout →</button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase"><tr><th className="px-4 py-2 text-left">Numéro</th><th className="px-4 py-2 text-left">Client</th><th className="px-4 py-2 text-left">Échéance</th><th className="px-4 py-2 text-left">Statut</th><th className="px-4 py-2 text-right">Restant</th></tr></thead>
            <tbody className="divide-y divide-slate-50">
              {data.facturesImpayees.map(f => {
                const isLate = f.dateEcheance && new Date(f.dateEcheance) < new Date();
                const clientNom = f.clientNom || (f.client ? `${f.client.prenom || ""} ${f.client.nom || ""}`.trim() : "—");
                return (
                  <tr key={f._id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate("/app/facturation")}>
                    <td className="px-4 py-2.5 font-mono text-xs font-semibold text-blue-600">{f.num}</td>
                    <td className="px-4 py-2.5 text-xs font-medium text-slate-800">{clientNom}</td>
                    <td className={`px-4 py-2.5 text-xs ${isLate ? "text-red-600 font-bold" : "text-slate-500"}`}>{fmtDate(f.dateEcheance)} {isLate && "⚠️"}</td>
                    <td className="px-4 py-2.5"><Badge statut={f.status} /></td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-red-600 text-xs">{fmtMad(f.montantRestant)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;