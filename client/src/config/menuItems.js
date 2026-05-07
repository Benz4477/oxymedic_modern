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
      { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard, badge: null },
    ],
  },
  {
    title: "Commercial",
    items: [
      { id: "clients",   label: "Clients",      icon: Users,        badge: null },
      { id: "crm",       label: "CRM",           icon: Zap,          badge: null },
      { id: "pipeline",  label: "Opportunités",  icon: GitBranch,    badge: null },
      { id: "devis",     label: "Devis",         icon: FileText,     badge: null },
      { id: "commandes", label: "Commandes",     icon: ShoppingCart, badge: null },
      { id: "fidelite",  label: "Fidélité",      icon: Heart,        badge: null },
    ],
  },
  // {
  //   title: "Location",
  //   items: [
  //     { id: "agenda",        label: "Agenda Planning",    icon: Calendar,  badge: null },
  //     { id: "disponibilite", label: "Disponibilité",      icon: Calendar,  badge: null },
  //     { id: "reservations",  label: "Réservations",       icon: Clipboard, badge: null },
  //     { id: "contrats",      label: "Contrats clients",   icon: FileCheck, badge: null },
  //     { id: "cautions",      label: "Dépôts de garantie", icon: Lock,     badge: null },
  //   ],
  // },
  {
    title: "Livraison",
    items: [
      { id: "livraisons", label: "Livraisons & Waze", icon: MapPin, badge: null },
      { id: "livreurs",   label: "Livreurs & Frais",  icon: Truck,  badge: null },
    ],
  },
  {
    title: "Inventaire",
    items: [
      { id: "stock",        label: "Stock produits & photos", icon: Package, badge: null },
      { id: "serials",      label: "N° Série & Codes-barres", icon: Scan,   badge: null },
      { id: "consommables", label: "Consommables",            icon: Droplet, badge: null },
    ],
  },
  {
    title: "Finance",
    items: [
      { id: "paiements",   label: "Paiements & Reçus", icon: CreditCard, badge: null },
      { id: "facturation", label: "Facturation",        icon: Receipt,    badge: null },
    ],
  },
  {
    title: "Catalogue & Outils",
    items: [
      // { id: "catalogue",  label: "Équipements",    icon: Package,  badge: null },
      // { id: "prodlist",   label: "Liste produits", icon: Clipboard, badge: null },
      { id: "categories", label: "Catégories",     icon: Tag,      badge: null },
      { id: "scanner",    label: "Scanner CB",     icon: Scan,     badge: null },
      { id: "analytics",  label: "Analytics",      icon: BarChart3, badge: null },
      { id: "sav",        label: "SAV",            icon: Wrench,   badge: null },
    ],
  },
  {
    title: "Technique",
    items: [
      { id: "maintenance", label: "Maintenance", icon: Wrench, badge: null },
    ],
  },
  {
    title: "Administration",
    items: [
      { id: "societe",   label: "Paramètres société", icon: Building2, badge: null },
      { id: "apparence", label: "Apparence",          icon: Palette,   badge: null },
      { id: "access",    label: "Droits d'accès",     icon: Shield,    badge: null },
      { id: "users",     label: "Utilisateurs",       icon: Users,     badge: null },
    ],
  },
];