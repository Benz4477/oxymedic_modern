import api from "../api";

export const fetchAllDashboardData = async () => {
  const [clientsRes, commandesRes, paiementsRes, unitsRes, facturesRes, equipementsRes] = await Promise.all([
    api.get("/clients").catch(() => ({ data: { data: [] } })),
    api.get("/commandes").catch(() => ({ data: { data: [] } })),
    api.get("/paiements").catch(() => ({ data: { data: [] } })),
    api.get("/units").catch(() => ({ data: { data: [] } })),
    api.get("/factures").catch(() => ({ data: { data: [] } })),
    api.get("/equipements").catch(() => ({ data: { data: [] } })),
  ]);

  const clients    = clientsRes.data?.data    || [];
  const commandes  = commandesRes.data?.data  || [];
  const paiements  = paiementsRes.data?.data  || [];
  const units      = unitsRes.data?.data      || [];
  const factures   = facturesRes.data?.data   || [];
  const equipements = equipementsRes.data?.data || [];

  const now = new Date();
  const debutMois = new Date(now.getFullYear(), now.getMonth(), 1);
  const debutMoisPrecedent = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const finMoisPrecedent   = new Date(now.getFullYear(), now.getMonth(), 0);

  // ── KPIs ─────────────────────────────────────────────
  const paiementsPaid    = paiements.filter(p => p.statut === "paid");
  const paiementsPending = paiements.filter(p => p.statut === "pending");
  const caMois     = paiementsPaid.filter(p => new Date(p.datePaiement) >= debutMois).reduce((s, p) => s + p.montant, 0);
  const caMoisPrec = paiementsPaid.filter(p => new Date(p.datePaiement) >= debutMoisPrecedent && new Date(p.datePaiement) <= finMoisPrecedent).reduce((s, p) => s + p.montant, 0);
  const caTotal    = paiementsPaid.reduce((s, p) => s + p.montant, 0);
  const caEvol     = caMoisPrec > 0 ? Math.round(((caMois - caMoisPrec) / caMoisPrec) * 100) : 0;

  const commandesActives  = commandes.filter(c => c.statut === "active");
  const commandesPending  = commandes.filter(c => c.statut === "pending");
  const unitsDisponibles  = units.filter(u => u.statut === "disponible");
  const unitsLoues        = units.filter(u => u.statut === "loué");
  const unitsMaintenance  = units.filter(u => u.statut === "maintenance");
  const tauxOccupation    = units.length > 0 ? Math.round((unitsLoues.length / units.length) * 100) : 0;

  // ── Commandes expirant dans 7 jours ──────────────────
  const dans7jours = new Date(now);
  dans7jours.setDate(dans7jours.getDate() + 7);
  const commandesARenouveler = commandes.filter(c => {
    if (c.statut !== "active") return false;
    const fin = new Date(c.dateFin);
    return fin >= now && fin <= dans7jours;
  });

  // ── Factures en retard ────────────────────────────────
  const facturesEnRetard = factures.filter(f =>
    (f.status === "unpaid" || f.status === "partial") &&
    f.dateEcheance && new Date(f.dateEcheance) < now
  );
  const facturesImpayees = factures.filter(f => f.status === "unpaid" || f.status === "partial");
  const totalRestant = facturesImpayees.reduce((s, f) => s + (f.montantRestant || 0), 0);

  // ── Top équipements loués ─────────────────────────────
  const equipeCount = {};
  commandes.forEach(cmd => {
    const nom = cmd.equipement?.name || cmd.equipement?.nom || "Autre";
    equipeCount[nom] = (equipeCount[nom] || 0) + 1;
  });
  const topEquipements = Object.entries(equipeCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name: name.length > 20 ? name.slice(0, 18) + "…" : name, count }));

  // ── Répartition par catégorie ─────────────────────────
  const catCount = {};
  equipements.forEach(e => {
    const cat = e.cat || "Autre";
    catCount[cat] = (catCount[cat] || 0) + 1;
  });
  const repartitionCat = Object.entries(catCount).map(([name, value]) => ({ name, value }));

  // ── CA par mois (12 derniers mois) ────────────────────
  const caParMois = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const fin = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const ca = paiementsPaid
      .filter(p => p.datePaiement && new Date(p.datePaiement) >= d && new Date(p.datePaiement) <= fin)
      .reduce((s, p) => s + p.montant, 0);
    caParMois.push({
      mois: d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" }),
      ca: Math.round(ca),
    });
  }

  // ── Commandes par mois (6 derniers mois) ─────────────
  const commandesParMois = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const fin = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const count = commandes.filter(c => {
      const dc = new Date(c.createdAt);
      return dc >= d && dc <= fin;
    }).length;
    commandesParMois.push({
      mois: d.toLocaleDateString("fr-FR", { month: "short" }),
      commandes: count,
    });
  }

  // ── Alertes ───────────────────────────────────────────
  const alertes = [];
  if (unitsMaintenance.length > 0)
    alertes.push({ type: "warning", icon: "🔧", message: `${unitsMaintenance.length} unité(s) en maintenance` });
  if (commandesARenouveler.length > 0)
    alertes.push({ type: "warning", icon: "📅", message: `${commandesARenouveler.length} commande(s) expirent dans 7 jours` });
  if (facturesEnRetard.length > 0)
    alertes.push({ type: "danger", icon: "⚠️", message: `${facturesEnRetard.length} facture(s) en retard de paiement` });
  if (paiementsPending.length > 0)
    alertes.push({ type: "info", icon: "💳", message: `${paiementsPending.length} paiement(s) en attente de confirmation` });

  return {
    // KPIs
    totalClients: clients.length,
    commandesActives: commandesActives.length,
    commandesPending: commandesPending.length,
    totalCommandes: commandes.length,
    unitsDisponibles: unitsDisponibles.length,
    unitsLoues: unitsLoues.length,
    unitsMaintenance: unitsMaintenance.length,
    totalUnits: units.length,
    tauxOccupation,
    caTotal,
    caMois,
    caMoisPrec,
    caEvol,
    paiementsPending: paiementsPending.length,
    totalRestant,
    // Listes
    recentCommandes: commandes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    recentPaiements: paiements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    facturesImpayees: facturesImpayees.slice(0, 5),
    facturesEnRetard,
    commandesARenouveler,
    // Graphiques
    caParMois,
    commandesParMois,
    topEquipements,
    repartitionCat,
    // Alertes
    alertes,
  };
};

export const fetchSociete = async () => {
  try {
    const res = await api.get("/societe");
    return res.data?.data || res.data || {};
  } catch { return {}; }
};

export default { fetchAllDashboardData, fetchSociete };