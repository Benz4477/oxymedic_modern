import mongoose from "mongoose";

const ligneFactureSchema = new mongoose.Schema({
  description: { type: String, required: true, trim: true },
  quantite:    { type: Number, required: true, min: 1, default: 1 },
  prixHT:      { type: Number, required: true, min: 0 },
  totalHT:     { type: Number, required: true, min: 0 },
  tvaRate:     { type: Number, default: 20 },
  remPct:      { type: Number, default: 0 },
}, { _id: false });

const factureSchema = new mongoose.Schema({
  magasin: { type: mongoose.Schema.Types.ObjectId, ref: 'Magasin', required: false, index: true },
  // Référence auto-générée : FAC-2025-0001
  num: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["facture", "proforma", "avoir"],
    default: "facture",
  },
  status: {
    type: String,
    required: true,
    enum: ["draft", "sent", "unpaid", "partial", "paid", "cancelled"],
    default: "draft",
  },

  // ── Relations ObjectId ──────────────────────────────────
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    default: null,
  },
  commande: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Commande",
    default: null,
  },

  // Champs dénormalisés (pour affichage rapide sans populate)
  clientNom:     { type: String, default: "" },
  clientEmail:   { type: String, default: "" },
  clientAdresse: { type: String, default: "" },

  // ── Dates réelles ───────────────────────────────────────
  date:         { type: Date, default: Date.now },
  dateEcheance: { type: Date, default: null },
  datePaiement: { type: Date, default: null },

  // ── Lignes de facturation ───────────────────────────────
  lignes:         [ligneFactureSchema],
  remiseGlobale:  { type: Number, default: 0 },
  tvaGlobale:     { type: Number, default: 20 },

  // ── Financier (calculé par pre-save) ───────────────────
  montantHT:      { type: Number, default: 0 },
  montantTVA:     { type: Number, default: 0 },
  montantTTC:     { type: Number, default: 0 },
  montantPaye:    { type: Number, default: 0 },
  montantRestant: { type: Number, default: 0 },

  // ── Paiement ───────────────────────────────────────────
  modePaiement: {
    type: String,
    enum: ["espece", "virement", "cheque", "carte", "autre"],
    default: null,
  },

  notes:     { type: String, default: "" },
  pdfPath:   { type: String, default: "" },
  archived:  { type: Boolean, default: false },
  createdBy: { type: String, default: "" },
}, { timestamps: true });

// ── Pre-save : calcul automatique des totaux ────────────
factureSchema.pre("save", function (next) {
  let totalHT  = 0;
  let totalTVA = 0;

  this.lignes.forEach((ligne) => {
    const ht      = ligne.totalHT || (ligne.quantite * ligne.prixHT);
    const remPct  = ligne.remPct || 0;
    const tvaRate = ligne.tvaRate ?? this.tvaGlobale;
    const htApres = ht * (1 - remPct / 100);
    totalHT  += htApres;
    totalTVA += htApres * tvaRate / 100;
  });

  if (this.remiseGlobale > 0) {
    totalHT  = totalHT  * (1 - this.remiseGlobale / 100);
    totalTVA = totalTVA * (1 - this.remiseGlobale / 100);
  }

  this.montantHT      = Math.round(totalHT);
  this.montantTVA     = Math.round(totalTVA);
  this.montantTTC     = this.montantHT + this.montantTVA;
  this.montantRestant = Math.max(0, this.montantTTC - this.montantPaye);
  next();
});

// ── Méthode : marquer comme payée ──────────────────────
factureSchema.methods.markAsPaid = function (montant, mode) {
  this.montantPaye    += montant;
  this.montantRestant  = Math.max(0, this.montantTTC - this.montantPaye);
  if (this.montantRestant === 0) {
    this.status       = "paid";
    this.datePaiement = new Date();
  } else if (this.montantPaye > 0) {
    this.status = "partial";
  }
  if (mode) this.modePaiement = mode;
  return this.save();
};

// ── Static : générer le prochain numéro ────────────────
factureSchema.statics.getNextNumero = async function (type) {
  const year   = new Date().getFullYear();
  const prefix = type === "facture" ? "FAC" : "PRO";
  const last   = await this.findOne({ type, num: { $regex: `^${prefix}-${year}` } }).sort({ num: -1 });
  if (!last) return `${prefix}-${year}-0001`;
  const lastNum = parseInt(last.num.split("-").pop());
  return `${prefix}-${year}-${String(lastNum + 1).padStart(4, "0")}`;
};

factureSchema.index({ client: 1, status: 1 });
factureSchema.index({ commande: 1 });
factureSchema.index({ num: 1 });

export default mongoose.model("Facture", factureSchema);