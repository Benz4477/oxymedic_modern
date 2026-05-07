import mongoose from "mongoose";

// Ligne de commande (multi-produits)
const ligneSchema = new mongoose.Schema({
  equipement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipement",
    required: true,
  },
  unite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Unit",
    default: null,
  },
  description: { type: String, default: "" },
  quantite:    { type: Number, default: 1, min: 1 },
  prixUnitaire:{ type: Number, required: true, min: 0 },
  remisePct:   { type: Number, default: 0, min: 0, max: 100 },
  total:       { type: Number, required: true, min: 0 },
});

// Entrée de l'historique des changements
const historiqueSchema = new mongoose.Schema({
  date:   { type: Date, default: Date.now },
  statut: { type: String },
  note:   { type: String, default: "" },
  user:   { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
});

const commandeSchema = new mongoose.Schema(
  {
    // Référence lisible auto-générée (CMD-2025-0001)
    reference: {
      type: String,
      unique: true,
      // généré dans le pre-save
    },

    // ── Relations — 100% ObjectId ──────────────────────────
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Le client est requis"],
      index: true,
    },
    equipement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipement",
      required: [true, "L'équipement est requis"],
    },
    unite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      default: null,
      index: true,
    },
    caution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Caution",
      default: null,
    },
    devis: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Devis",
      default: null,
    },

    // ── Dates — vrais types Date ───────────────────────────
    dateDebut: {
      type: Date,
      required: [true, "La date de début est requise"],
    },
    dateFin: {
      type: Date,
      required: [true, "La date de fin est requise"],
    },
    dureeJours: {
      type: Number,
      default: 0, // calculé automatiquement
    },

    // ── Statut ─────────────────────────────────────────────
    statut: {
      type: String,
      enum: ["pending", "active", "transit", "ended", "cancelled"],
      default: "pending",
      index: true,
    },

    // ── Financier ──────────────────────────────────────────
    modePaiement: {
      type: String,
      enum: ["carte", "virement", "cash_livraison", "cash_magasin", "espece", "cheque", "mobile"],
      required: [true, "Le mode de paiement est requis"],
    },
    montantHT:  { type: Number, default: 0, min: 0 },
    tauxTVA:    { type: Number, default: 20 },
    montantTVA: { type: Number, default: 0, min: 0 },
    montantTTC: { type: Number, required: true, min: 0 },
    montantCaution: { type: Number, default: 0, min: 0 },
    modeCaution:    { type: String, default: "cash" },

    // ── Multi-produits ─────────────────────────────────────
    lignes: [ligneSchema],

    // ── Reconduction ───────────────────────────────────────
    commandeParente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Commande",
      default: null,
    },
    typeReconduction: {
      type: String,
      enum: ["prolongation", "renouvellement", "libre", null],
      default: null,
    },

    // ── Historique des changements ─────────────────────────
    historique: [historiqueSchema],

    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ── Auto-génération de la référence + calcul durée ──────────
commandeSchema.pre("save", async function (next) {
  // Générer la référence seulement à la création
  if (this.isNew && !this.reference) {
    const count = await mongoose.model("Commande").countDocuments();
    const annee = new Date().getFullYear();
    this.reference = `CMD-${annee}-${String(count + 1).padStart(4, "0")}`;
  }

  // Calculer la durée en jours
  if (this.dateDebut && this.dateFin) {
    this.dureeJours = Math.ceil(
      (this.dateFin - this.dateDebut) / (1000 * 60 * 60 * 24)
    );
  }

  // Calculer TVA si non fournie
  if (this.montantHT > 0 && !this.montantTVA) {
    this.montantTVA = Math.round(this.montantHT * (this.tauxTVA / 100));
  }

  next();
});

// ── Index composé pour le moteur de disponibilité ──────────
// Détection de conflits : "quelle unité est occupée entre date A et date B ?"
commandeSchema.index({ unite: 1, dateDebut: 1, dateFin: 1 });
commandeSchema.index({ client: 1, statut: 1 });
commandeSchema.index({ statut: 1, dateFin: 1 }); // pour les alertes d'expiration

export default mongoose.model("Commande", commandeSchema);