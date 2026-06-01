import mongoose from "mongoose";

const ligneSchema = new mongoose.Schema({
  equipement:   { type: mongoose.Schema.Types.ObjectId, ref: "Equipement", required: true },
  unite:        { type: mongoose.Schema.Types.ObjectId, ref: "Unit", default: null },
  description:  { type: String, default: "" },
  quantite:     { type: Number, default: 1, min: 1 },
  prixUnitaire: { type: Number, required: true, min: 0 },
  remisePct:    { type: Number, default: 0, min: 0, max: 100 },
  total:        { type: Number, required: true, min: 0 },
});

const historiqueSchema = new mongoose.Schema({
  date:   { type: Date, default: Date.now },
  statut: { type: String },
  note:   { type: String, default: "" },
  user:   { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
});

const commandeSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true },
    magasin: { type: mongoose.Schema.Types.ObjectId, ref: "Magasin", required: false, index: true },

    client:     { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: [true, "Le client est requis"], index: true },
    equipement: { type: mongoose.Schema.Types.ObjectId, ref: "Equipement", required: [true, "L'équipement est requis"] },
    unite:      { type: mongoose.Schema.Types.ObjectId, ref: "Unit", default: null, index: true },
    caution:    { type: mongoose.Schema.Types.ObjectId, ref: "Caution", default: null },
    devis:      { type: mongoose.Schema.Types.ObjectId, ref: "Devis", default: null },

    dateDebut:   { type: Date, required: [true, "La date de début est requise"] },
    dateFin:     { type: Date, required: [true, "La date de fin est requise"] },
    dureeJours:  { type: Number, default: 0 },

    statut: {
      type: String,
      enum: ["pending", "active", "transit", "ended", "cancelled"],
      default: "pending", index: true,
    },

    modePaiement: {
      type: String,
      enum: ["carte", "virement", "cash_livraison", "cash_magasin", "espece", "cheque", "mobile"],
      required: [true, "Le mode de paiement est requis"],
    },
    montantHT:      { type: Number, default: 0, min: 0 },
    tauxTVA:        { type: Number, default: 20 },
    montantTVA:     { type: Number, default: 0, min: 0 },
    montantTTC:     { type: Number, required: true, min: 0 },
    montantCaution: { type: Number, default: 0, min: 0 },
    modeCaution:    { type: String, default: "cash" },

    lignes: [ligneSchema],

    commandeParente:  { type: mongoose.Schema.Types.ObjectId, ref: "Commande", default: null },
    typeReconduction: { type: String, enum: ["prolongation", "renouvellement", "libre", null], default: null },

    // ── Bon d'enlèvement ──────────────────────────────────
    bonEnlevement: {
      livreur:   { type: String, default: "" },
      vehicule:  { type: String, default: "" },
      matricule: { type: String, default: "" },
      date:      { type: Date, default: null },
    },

    // ── Bon de retour ─────────────────────────────────────
    bonRetour: {
      recuperateur: { type: String, default: "" },
      vehicule:     { type: String, default: "" },
      matricule:    { type: String, default: "" },
      etat:         { type: String, default: "" },
      observation:  { type: String, default: "" },
      date:         { type: Date, default: null },
    },

    historique: [historiqueSchema],
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

commandeSchema.pre("save", async function (next) {
  if (this.isNew && !this.reference) {
    const count = await mongoose.model("Commande").countDocuments();
    const annee = new Date().getFullYear();
    this.reference = `CMD-${annee}-${String(count + 1).padStart(4, "0")}`;
  }
  if (this.dateDebut && this.dateFin) {
    this.dureeJours = Math.ceil((this.dateFin - this.dateDebut) / (1000 * 60 * 60 * 24));
  }
  if (this.montantHT > 0 && !this.montantTVA) {
    this.montantTVA = Math.round(this.montantHT * (this.tauxTVA / 100));
  }
  next();
});

commandeSchema.index({ unite: 1, dateDebut: 1, dateFin: 1 });
commandeSchema.index({ client: 1, statut: 1 });
commandeSchema.index({ statut: 1, dateFin: 1 });

export default mongoose.model("Commande", commandeSchema);