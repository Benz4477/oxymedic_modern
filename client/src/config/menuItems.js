import {
  LayoutDashboard, Users, FileText, ShoppingCart, Calendar,
  Truck, Package, CreditCard, Receipt, Shield, Wrench,
  BarChart3, Zap, Scan, Tag, GitBranch, Heart, Droplet,
  Palette, MapPin, Clipboard, Lock, FileCheck, Building2,
} from "lucide-react";

export const menuItems = [
  {
    title: "Principal",
    items: [
      { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, badge: null, permission: "dashboard" },
    ],
  },
  {
    title: "Commercial",
    items: [
      { id: "clients",   label: "Clients",       icon: Users,        badge: null, permission: "clients" },
      { id: "crm",       label: "CRM",           icon: Zap,          badge: null, permission: "crm" },
      { id: "pipeline",  label: "Opportunités",  icon: GitBranch,    badge: null, permission: "pipeline" },
      { id: "devis",     label: "Devis",         icon: FileText,     badge: null, permission: "devis" },
      { id: "commandes", label: "Commandes",     icon: ShoppingCart, badge: null, permission: "commandes" },
      { id: "fidelite",  label: "Fidélité",      icon: Heart,        badge: null, permission: "fidelite" },
    ],
  },
  {
    title: "Location",
    items: [
      { id: "reservations",  label: "Réservations",       icon: Clipboard, badge: null, permission: "reservations" },
      { id: "cautions",      label: "Dépôts de garantie", icon: Lock,     badge: null, permission: "cautions" },
    ],
  },
  {
    title: "Livraison",
    items: [
      { id: "livraisons", label: "Livraisons & Waze", icon: MapPin, badge: null, permission: "livraisons" },
      { id: "livreurs",   label: "Livreurs & Frais",  icon: Truck,  badge: null, permission: "livreurs" },
    ],
  },
  {
    title: "Inventaire",
    items: [
      { id: "stock",        label: "Stock produits & photos", icon: Package, badge: null, permission: "stock" },
      { id: "serials",      label: "N° Série & Codes-barres", icon: Scan,   badge: null, permission: "serials" },
      { id: "transferts",   label: "Transferts inter-sites",  icon: Truck,   badge: null, permission: "stock" },
      { id: "consommables", label: "Consommables",            icon: Droplet, badge: null, permission: "consommables" },
    ],
  },
  {
    title: "Finance",
    items: [
      { id: "paiements",   label: "Paiements & Reçus", icon: CreditCard, badge: null, permission: "paiements" },
      { id: "facturation", label: "Facturation",       icon: Receipt,    badge: null, permission: "facturation" },
      { id: "contrats",    label: "Contrats",          icon: FileCheck,  badge: null, permission: "contrats" },
    ],
  },
  {
    title: "Technique",
    items: [
      { id: "maintenance", label: "Maintenance", icon: Wrench, badge: null, permission: "maintenance" },
      { id: "sav",         label: "Service Après-Vente", icon: Wrench, badge: null, permission: "maintenance" },
    ],
  },
  {
    title: "Administration",
    items: [
      { id: "societe",   label: "Paramètres société", icon: Building2, badge: null, permission: "societe" },
      { id: "magasins",  label: "Gestion Magasins", icon: Building2, badge: null, permission: "magasins" },
      { id: "utilisateurs", label: "Utilisateurs", icon: Users, badge: null, permission: "utilisateurs" },
    ],
  },
];

// Fonction pour filtrer le menu selon les permissions
export const getMenuForUser = (user) => {
  // Superadmin voit tout le menu
  if (user?.role === "superadmin") {
    return menuItems;
  }

  // Si pas de permissions définies, seul le dashboard
  if (!user || !user.permissions) {
    return menuItems.filter(section => 
      section.title === "Principal"
    );
  }

  // Filtrer selon les permissions pour les autres rôles
  return menuItems.map(section => ({
    ...section,
    items: section.items.filter(item => 
      !item.permission || user.permissions[item.permission] === true
    )
  })).filter(section => section.items.length > 0);
};