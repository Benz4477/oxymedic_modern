// backend/src/models/Facture.js
import mongoose from "mongoose";

const ligneFactureSchema = new mongoose.Schema({
  description: { type: String, required: true, trim: true },
  quantite: { type: Number, required: true, min: 1, default: 1 },
  prixHT: { type: Number, required: true, min: 0 },
  totalHT: { type: Number, required: true, min: 0 },
  tvaRate: { type: Number, default: 20 },
  remPct: { type: Number, default: 0 },
}, { _id: false });

const factureSchema = new mongoose.Schema({
  // Identifiants
  num: { type: String, required: true, unique: true, uppercase: true },
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

  // Liens
  clientId: { type: Number, default: 1 },
  clientNom: { type: String, default: "" },      // Ajouté pour stocker le nom du client
  clientEmail: { type: String, default: "" },    // Ajouté
  clientAdresse: { type: String, default: "" },  // Ajouté
  cmdRef: { type: String, default: "" },
  livId: { type: Number, default: null },
  devisId: { type: String, default: "" },

  // Dates
  date: { type: String, required: true },
  dateEcheance: { type: String, default: "" },

  // Financier
  lignes: [ligneFactureSchema],
  remiseGlobale: { type: Number, default: 0 },
  tvaGlobale: { type: Number, default: 20 },
  montantHT: { type: Number, default: 0 },
  montantTVA: { type: Number, default: 0 },
  montantTTC: { type: Number, required: true, default: 0 },
  montantPaye: { type: Number, default: 0 },
  montantRestant: { type: Number, default: 0 },

  // Paiement – CORRECTION ICI
  modePaiement: { 
    type: String, 
    enum: ["espece", "virement", "cheque", "carte", "autre"],
    required: false,        // ← pas obligatoire
    default: undefined      // ← pas de valeur par défaut
  },
  datePaiement: { type: String, default: "" },

  // Documents
  notes: { type: String, default: "" },
  pdfPath: { type: String, default: "" },
  archived: { type: Boolean, default: false },

  // Audit
  createdBy: { type: String, default: "" },
}, {
  timestamps: true,
});

// Middleware pre-save pour calculer les totaux
factureSchema.pre("save", function(next) {
  let totalHT = 0;
  let totalTVA = 0;

  this.lignes.forEach(ligne => {
    const ligneHT = ligne.totalHT;
    const tvaRate = ligne.tvaRate !== undefined ? ligne.tvaRate : this.tvaGlobale;
    const remPct = ligne.remPct || 0;
    const htApresRemise = ligneHT * (1 - remPct / 100);
    totalHT += htApresRemise;
    totalTVA += htApresRemise * tvaRate / 100;
  });

  if (this.remiseGlobale > 0) {
    totalHT = totalHT * (1 - this.remiseGlobale / 100);
    totalTVA = totalTVA * (1 - this.remiseGlobale / 100);
  }

  this.montantHT = Math.round(totalHT);
  this.montantTVA = Math.round(totalTVA);
  this.montantTTC = this.montantHT + this.montantTVA;
  this.montantRestant = this.montantTTC - this.montantPaye;

  next();
});

// Méthode pour marquer comme payée
factureSchema.methods.markAsPaid = function(montant, mode) {
  this.montantPaye += montant;
  this.montantRestant = Math.max(0, this.montantTTC - this.montantPaye);
  if (this.montantRestant === 0) {
    this.status = "paid";
    this.datePaiement = new Date().toLocaleDateString("fr-FR");
  } else if (this.montantPaye > 0 && this.montantRestant > 0) {
    this.status = "partial";
  }
  if (mode) this.modePaiement = mode;
  return this.save();
};

// Génération automatique du numéro
factureSchema.statics.getNextNumero = async function(type) {
  const year = new Date().getFullYear();
  const prefix = type === "facture" ? "FAC" : "PRO";
  const lastFacture = await this.findOne({ type, num: { $regex: `^${prefix}-${year}` } }).sort({ num: -1 });
  if (!lastFacture) return `${prefix}-${year}-0001`;
  const lastNum = parseInt(lastFacture.num.split("-").pop());
  const nextNum = String(lastNum + 1).padStart(4, "0");
  return `${prefix}-${year}-${nextNum}`;
};

export default mongoose.model("Facture", factureSchema);