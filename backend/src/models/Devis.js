import mongoose from "mongoose";

const ligneDevisSchema = new mongoose.Schema({
  description: { type: String, required: true, trim: true },
  quantite:    { type: Number, required: true, min: 1, default: 1 },
  prixHT:      { type: Number, required: true, min: 0 },
  totalHT:     { type: Number, required: true, min: 0 },
  equipement:  { type: mongoose.Schema.Types.ObjectId, ref: "Equipement", default: null },
  tvaRate:     { type: Number, default: 20 },
  remPct:      { type: Number, default: 0 },
}, { _id: false });

const devisSchema = new mongoose.Schema({
  reference:   { type: String, unique: true, uppercase: true },
  type:        { type: String, enum: ["devis", "proforma"], default: "devis" },
  status:      {
    type: String,
    enum: ["draft", "sent", "accepted", "rejected", "expired", "converted"],
    default: "draft",
  },

  // ── Relations ObjectId ──────────────────────────────
  client:      { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  commande:    { type: mongoose.Schema.Types.ObjectId, ref: "Commande", default: null },

  // Dénormalisé pour affichage rapide
  clientNom:     { type: String, default: "" },
  clientEmail:   { type: String, default: "" },
  clientAdresse: { type: String, default: "" },

  // ── Dates ───────────────────────────────────────────
  date:            { type: Date, default: Date.now },
  dateValidite:    { type: Date, required: true },
  dateEnvoi:       { type: Date, default: null },
  dateAcceptation: { type: Date, default: null },

  // ── Lignes ──────────────────────────────────────────
  lignes:         [ligneDevisSchema],
  remiseGlobale:  { type: Number, default: 0 },
  tvaGlobale:     { type: Number, default: 20 },

  // ── Montants ────────────────────────────────────────
  montantHT:  { type: Number, default: 0 },
  montantTVA: { type: Number, default: 0 },
  montantTTC: { type: Number, default: 0 },

  // ── Divers ──────────────────────────────────────────
  description: { type: String, default: "" },
  notes:       { type: String, default: "" },
  pdfPath:     { type: String, default: "" },
  archived:    { type: Boolean, default: false },
  createdBy:   { type: String, default: "Admin" },
}, { timestamps: true });

// ── Auto-référence ────────────────────────────────────
devisSchema.pre("save", async function (next) {
  if (this.isNew && !this.reference) {
    const year   = new Date().getFullYear();
    const prefix = this.type === "devis" ? "DEV" : "PRO";
    const count  = await mongoose.model("Devis").countDocuments({ type: this.type });
    this.reference = `${prefix}-${year}-${String(count + 1).padStart(4, "0")}`;
  }

  // Calcul montants
  let totalHT = 0;
  this.lignes.forEach(l => { totalHT += l.totalHT || (l.quantite * l.prixHT); });
  const htApresRemise = totalHT * (1 - (this.remiseGlobale || 0) / 100);
  this.montantHT  = Math.round(htApresRemise);
  this.montantTVA = Math.round(htApresRemise * (this.tvaGlobale || 20) / 100);
  this.montantTTC = this.montantHT + this.montantTVA;

  // Auto-expiration
  if (this.dateValidite && !["converted", "accepted"].includes(this.status)) {
    if (new Date(this.dateValidite) < new Date()) this.status = "expired";
  }

  next();
});

devisSchema.index({ client: 1, status: 1 });
devisSchema.index({ reference: 1 });

export default mongoose.model("Devis", devisSchema);