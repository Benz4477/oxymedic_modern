import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  Users, ShoppingCart, CreditCard, Package,
  TrendingUp, TrendingDown, RefreshCw, AlertTriangle,
  Clock, Activity, Calendar, LayoutDashboard, ChevronRight,
  ArrowUpRight, ArrowDownRight, Trophy, List
} from "lucide-react";
import { fetchAllDashboardData, fetchSociete } from "../../services/dashboardService";

const fmtMad  = (n) => `${(n || 0).toLocaleString("fr-FR")} MAD`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("fr-FR") : "—";
const COLORS  = ["#10B981", "#3B82F6", "#8B5CF6", "#06B6D4", "#F59E0B", "#EF4444", "#10B981"];

const Badge = ({ statut }) => {
  const map = {
    active: { label: "Active", cls: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    pending: { label: "En attente", cls: "bg-amber-50 text-amber-600 border-amber-100" },
    transit: { label: "En transit", cls: "bg-blue-50 text-blue-600 border-blue-100" },
    ended: { label: "Terminée", cls: "bg-slate-50 text-slate-500 border-slate-100" },
    cancelled: { label: "Annulée", cls: "bg-rose-50 text-rose-600 border-rose-100" },
    paid: { label: "Payé", cls: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    unpaid: { label: "Impayé", cls: "bg-rose-50 text-rose-600 border-rose-100" },
    partial: { label: "Partiel", cls: "bg-amber-50 text-amber-600 border-amber-100" },
    draft: { label: "Brouillon", cls: "bg-slate-50 text-slate-400 border-slate-100" },
  };
  const s = map[statut] || { label: statut, cls: "bg-slate-50 text-slate-400 border-slate-100" };
  return <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${s.cls}`}>{s.label}</span>;
};

const KpiCard = ({ icon: Icon, color, label, value, sub, subColor, evol, onClick }) => (
  <div 
    className={`group card-linear p-5 flex-1 min-w-[240px] ${onClick ? "cursor-pointer active:scale-95" : ""}`}
    onClick={onClick}
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 bg-${color}-50 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={20} className={`text-${color}-600`} />
      </div>
      {evol !== undefined && (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${evol >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>
          {evol >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {evol >= 0 ? "+" : ""}{evol}%
        </div>
      )}
    </div>
    <div className="text-2xl font-black text-slate-900 tracking-tight mb-1 truncate">{value}</div>
    <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</div>
    {sub && <div className={`text-[10px] font-bold mt-2 ${subColor || "text-slate-400"}`}>{sub}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-2xl p-4 shadow-2xl text-[10px] font-black">
      <div className="text-slate-400 uppercase tracking-[0.2em] mb-2 border-b border-slate-50 pb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-1" style={{ color: p.color }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: p.color }} />
            {p.name}
          </div>
          <span className="text-slate-900">{p.value?.toLocaleString("fr-FR")}</span>
        </div>
      ))}
    </div>
  );
};

const hp = (user, perm) => user?.role === "admin" || user?.role === "superadmin" || user?.permissions?.[perm] === true;

const Dashboard = () => {
  const navigate = useNavigate();
  const { isDepot } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [data, setData]       = useState(null);
  const [societe, setSociete] = useState({});
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-amber-600/20 rounded-full" />
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
      </div>
    </div>
  );

  if (!data) return null;

  const nomSoc = societe.nom || "OXYMEDIC";

  const kpis1 = [
    !isDepot && hp(user, "clients") && { icon: Users, color: "blue", label: "Clients Actifs", value: data.totalClients, onClick: () => navigate("/app/clients") },
    !isDepot && hp(user, "commandes") && { icon: ShoppingCart, color: "emerald", label: "Commandes Actives", value: data.commandesActives, sub: `${data.commandesPending} en attente`, subColor: data.commandesPending > 0 ? "text-amber-500" : "text-slate-400", onClick: () => navigate("/app/commandes") },
    hp(user, "stock") && { icon: Package, color: "purple", label: "Taux Occupation", value: `${data.tauxOccupation}%`, sub: `${data.unitsLoues}/${data.totalUnits} louées`, onClick: () => navigate("/app/serials") },
    !isDepot && hp(user, "paiements") && { icon: CreditCard, color: "emerald", label: "Chiffre Aff. Mois", value: fmtMad(data.caMois), evol: data.caEvol, sub: `Cumul : ${fmtMad(data.caTotal)}`, onClick: () => navigate("/app/paiements") },
  ].filter(Boolean);

  const kpis2 = [
    !isDepot && hp(user, "facturation") && { icon: AlertTriangle, color: "rose", label: "Factures Impayées", value: data.facturesImpayees.length, sub: fmtMad(data.totalRestant) + " restant", subColor: "text-rose-500", onClick: () => navigate("/app/facturation") },
    !isDepot && hp(user, "paiements") && { icon: Clock, color: "amber", label: "Paiements Attente", value: data.paiementsPending, onClick: () => navigate("/app/paiements") },
    hp(user, "commandes") && { icon: Calendar, color: "orange", label: "Expirations (7j)", value: data.commandesARenouveler.length, sub: data.commandesARenouveler.length > 0 ? "À renouveler" : "R.A.S", onClick: () => navigate("/app/commandes") },
    hp(user, "stock") && { icon: Activity, color: "slate", label: "En Maintenance", value: data.unitsMaintenance, sub: data.unitsMaintenance > 0 ? "Action requise" : "Tout est OK", onClick: () => navigate("/app/serials") },
  ].filter(Boolean);

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* Flat Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1">
        <div className="flex items-center gap-3 md:gap-4 font-display">
          <div className="p-3 bg-amber-500 rounded-xl shadow-xl shadow-amber-500/10 text-white">
            <LayoutDashboard size={22} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">Vue d'ensemble</h1>
            <div className="flex items-center gap-2 text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {nomSoc} · {fmtDate(new Date())}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button onClick={loadData} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-slate-600 border border-slate-100 rounded-xl hover:bg-slate-50 transition shadow-sm font-black text-[10px] uppercase tracking-widest">
            <RefreshCw size={14} /> Actualiser
          </button>
        </div>
      </div>

      {/* Modernized Alerts */}
      {data.alertes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.alertes.map((a, i) => (
            <div key={i} className={`flex items-center gap-4 px-5 py-4 rounded-xl border font-bold shadow-sm transition-all hover:scale-[1.01] duration-300 ${a.type === "danger" ? "bg-rose-50 border-rose-100/50 text-rose-700" : a.type === "warning" ? "bg-amber-50 border-amber-100/50 text-amber-700" : "bg-blue-50 border-blue-100/50 text-blue-700"}`}>
              <div className="text-2xl p-2 bg-white/50 rounded-lg">{a.icon}</div>
              <div className="flex flex-col">
                <span className="text-[11px] leading-tight">{a.message}</span>
                <span className="text-[9px] opacity-60 uppercase tracking-widest mt-1">Notification système</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KPI Sections */}
      <div className="space-y-6">
        {kpis1.length > 0 && <div className="flex flex-wrap gap-6">{kpis1.map((kpi, i) => <KpiCard key={i} {...kpi} />)}</div>}
        {kpis2.length > 0 && <div className="flex flex-wrap gap-6">{kpis2.map((kpi, i) => <KpiCard key={i} {...kpi} />)}</div>}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chiffre Affaires */}
        {!isDepot && (
          <div className="card-linear p-6 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col">
                <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Performance</h3>
                <div className="text-base font-bold text-slate-800 flex items-center gap-2 font-display">
                  <TrendingUp size={18} className="text-amber-500" /> Chiffre d'Affaires
                </div>
              </div>
              <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-bold rounded-lg uppercase tracking-widest">12 derniers mois</span>
            </div>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.caParMois} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="mois" tick={{ fontSize: 9, fontWeight: 900, fill: "#94A3B8" }} axisLine={false} tickLine={false} interval={1} />
                  <YAxis tick={{ fontSize: 9, fontWeight: 900, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="ca" name="C.A." stroke="#10B981" strokeWidth={4} dot={{ r: 5, fill: "#10B981", strokeWidth: 3, stroke: "#fff" }} activeDot={{ r: 8, strokeWidth: 0, fill: "#10B981" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {/* Volume Commandes */}
        {!isDepot && (
          <div className="card-linear p-6 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col">
                <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Activité</h3>
                <div className="text-base font-bold text-slate-800 flex items-center gap-2 font-display">
                  <ShoppingCart size={18} className="text-amber-500" /> Volume Commandes
                </div>
              </div>
              <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[9px] font-bold rounded-lg uppercase tracking-widest">6 derniers mois</span>
            </div>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.commandesParMois} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="mois" tick={{ fontSize: 9, fontWeight: 900, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fontWeight: 900, fill: "#94A3B8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="commandes" name="Commandes" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* New Design: Top Locations List (Always visible as it's inventory performance) */}
        <div className="card-linear p-6 flex flex-col min-h-[450px]">
          {/* ... (content remains same) */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Classement</h3>
              <div className="text-base font-bold text-slate-800 flex items-center gap-2 font-display">
                <Trophy size={18} className="text-amber-500" /> Top Locations
              </div>
            </div>
            <button onClick={() => navigate("/app/serials")} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-amber-600 transition-colors border border-slate-100/50">
              <List size={16} />
            </button>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
            {data.topEquipements.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                  <Package size={24} className="text-slate-200" />
                </div>
                <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">Aucune donnée de location</p>
              </div>
            ) : (
              data.topEquipements.slice(0, 6).map((eq, i) => {
                const maxCount = Math.max(...data.topEquipements.map(e => e.count));
                const percentage = (eq.count / maxCount) * 100;
                return (
                  <div key={i} className="group/item bg-slate-50/50 p-4 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 border border-transparent hover:border-slate-100 transition-all duration-300">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black shadow-sm ${i === 0 ? "bg-amber-100 text-amber-600" : i === 1 ? "bg-slate-200 text-slate-600" : i === 2 ? "bg-orange-100 text-orange-600" : "bg-white text-slate-400"}`}>
                          {i + 1}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-black text-slate-800 leading-none mb-1">{eq.name}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Équipement médical</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[13px] font-black text-slate-900 leading-none">{eq.count}</div>
                        <div className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Locations</div>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500 rounded-full transition-all duration-1500 ease-out" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Répartition Cat. (Always visible) */}
        <div className="card-linear p-6 flex flex-col min-h-[450px]">
          {/* ... (content remains same) */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Segmentation</h3>
              <div className="text-base font-bold text-slate-800 flex items-center gap-2 font-display">
                <PieChart size={18} className="text-amber-500" /> Répartition Catégories
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full h-[280px]">
              {data.repartitionCat.length === 0 ? <div className="flex items-center justify-center h-full text-slate-400 text-[10px] font-bold italic">Aucune donnée</div> : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.repartitionCat} cx="50%" cy="50%" innerRadius={70} outerRadius={105} dataKey="value" nameKey="name" paddingAngle={4}>
                      {data.repartitionCat.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="w-full mt-6 flex flex-row-reverse flex-wrap justify-center gap-3 max-h-[160px] overflow-y-auto scrollbar-hide px-2">
              {data.repartitionCat.map((c, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
                  <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-black text-slate-800 truncate leading-none mb-1">{c.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-black text-emerald-500">{c.value}</span>
                      <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">unités</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      {!isDepot && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Commandes Récentes */}
          <div className="card-linear overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100/60 flex justify-between items-center bg-slate-50/20 font-display">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><ShoppingCart size={16} /></div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Commandes Récentes</h3>
              </div>
              <button onClick={() => navigate("/app/commandes")} className="text-[9px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group">
                VOIR TOUT <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            <div className="overflow-x-auto">
              {data.recentCommandes.length === 0 ? <div className="p-12 text-center text-slate-400 text-xs font-black uppercase tracking-widest italic opacity-50">Aucune commande</div> : (
                <table className="w-full">
                  <thead className="bg-slate-50/30 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-8 py-4 text-left">Réf / Client</th>
                      <th className="px-8 py-4 text-left">Statut</th>
                      <th className="px-8 py-4 text-right">Total TTC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.recentCommandes.map(cmd => (
                      <tr key={cmd._id} className="hover:bg-slate-50/80 cursor-pointer group transition-colors" onClick={() => navigate("/app/commandes")}>
                        <td className="px-8 py-4">
                          <div className="font-mono text-[11px] font-black text-blue-600 mb-0.5 group-hover:underline">#{cmd.reference}</div>
                          <div className="text-[12px] font-bold text-slate-800">{cmd.client ? `${cmd.client.prenom || ""} ${cmd.client.nom || ""}`.trim() : "—"}</div>
                        </td>
                        <td className="px-8 py-4"><Badge statut={cmd.statut} /></td>
                        <td className="px-8 py-4 text-right font-black text-slate-900 text-[13px]">{fmtMad(cmd.montantTTC)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Paiements Récents */}
          <div className="card-linear overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100/60 flex justify-between items-center bg-slate-50/20 font-display">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><CreditCard size={16} /></div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Paiements Récents</h3>
              </div>
              <button onClick={() => navigate("/app/paiements")} className="text-[9px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group">
                VOIR TOUT <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            <div className="overflow-x-auto">
              {data.recentPaiements.length === 0 ? <div className="p-12 text-center text-slate-400 text-xs font-black uppercase tracking-widest italic opacity-50">Aucun paiement</div> : (
                <table className="w-full">
                  <thead className="bg-slate-50/30 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-8 py-4 text-left">Réf / Client</th>
                      <th className="px-8 py-4 text-left">Statut</th>
                      <th className="px-8 py-4 text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.recentPaiements.map(p => (
                      <tr key={p._id} className="hover:bg-slate-50/80 cursor-pointer group transition-colors" onClick={() => navigate("/app/paiements")}>
                        <td className="px-8 py-4">
                          <div className="font-mono text-[11px] font-black text-purple-600 mb-0.5 group-hover:underline">#{p.reference}</div>
                          <div className="text-[12px] font-bold text-slate-800">{p.client ? `${p.client.prenom || ""} ${p.client.nom || ""}`.trim() : "—"}</div>
                        </td>
                        <td className="px-8 py-4"><Badge statut={p.statut} /></td>
                        <td className="px-8 py-4 text-right font-black text-slate-900 text-[13px]">{fmtMad(p.montant)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Factures Impayées */}
      {!isDepot && hp(user, "facturation") && data.facturesImpayees.length > 0 && (
        <div className="card-linear overflow-hidden">
          {/* ... (content remains same) */}
          <div className="px-6 py-4 border-b border-slate-100/60 flex justify-between items-center bg-rose-50/10 font-display">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><AlertTriangle size={16} /></div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Recouvrement : Factures Impayées</h3>
              <span className="px-2 py-0.5 rounded-md text-[8px] bg-rose-600 text-white font-bold tracking-tight">{data.facturesImpayees.length} dossiers</span>
            </div>
            <button onClick={() => navigate("/app/facturation")} className="text-[9px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group">
              GÉRER <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/30 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-8 py-4 text-left">N° Facture / Client</th>
                  <th className="px-8 py-4 text-left">Échéance</th>
                  <th className="px-8 py-4 text-left">Statut</th>
                  <th className="px-8 py-4 text-right">Reste à recouvrer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {data.facturesImpayees.map(f => {
                  const isLate = f.dateEcheance && new Date(f.dateEcheance) < new Date();
                  const clientNom = f.clientNom || (f.client ? `${f.client.prenom || ""} ${f.client.nom || ""}`.trim() : "—");
                  return (
                    <tr key={f._id} className="hover:bg-rose-50/30 cursor-pointer group transition-colors" onClick={() => navigate("/app/facturation")}>
                      <td className="px-8 py-4">
                        <div className="font-mono text-[11px] font-black text-blue-600 mb-0.5 group-hover:underline">{f.num}</div>
                        <div className="text-[12px] font-bold text-slate-800">{clientNom}</div>
                      </td>
                      <td className="px-8 py-4">
                        <div className={`text-[11px] font-black flex items-center gap-1.5 ${isLate ? "text-rose-600" : "text-slate-500"}`}>
                          <Calendar size={12} />
                          {fmtDate(f.dateEcheance)}
                          {isLate && <span className="text-[9px] px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded uppercase animate-pulse ml-1">Retard</span>}
                        </div>
                      </td>
                      <td className="px-8 py-4"><Badge statut={f.status} /></td>
                      <td className="px-8 py-4 text-right font-black text-rose-600 text-[13px]">{fmtMad(f.montantRestant)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;