import mongoose from "mongoose";

const paiementSchema = new mongoose.Schema(
  {
    // Référence auto-générée : TXN-2025-0001
    reference: {
      type: String,
      unique: true,
    },

    // Relations ObjectId
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "Le client est requis"],
      index: true,
    },
    commande: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Commande",
      default: null,
      index: true,
    },
    facture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facture",
      default: null,
      index: true,
    },

    // Financier
    montant: {
      type: Number,
      required: [true, "Le montant est requis"],
      min: [0, "Le montant doit être positif"],
    },
    modePaiement: {
      type: String,
      enum: ["espece", "virement", "cheque", "carte", "mobile"],
      required: [true, "Le mode de paiement est requis"],
    },
    type: {
      type: String,
      enum: ["avance", "solde", "caution", "remboursement"],
      default: "solde",
    },

    // Statut
    statut: {
      type: String,
      enum: ["pending", "paid", "cancelled", "refunded"],
      default: "pending",
      index: true,
    },

    // Date du paiement (réelle)
    datePaiement: {
      type: Date,
      default: null,
    },

    // Infos bancaires (optionnel)
    banque:             { type: String, default: "" },
    referenceBancaire:  { type: String, default: "" },

    note: { type: String, default: "" },
  },
  { timestamps: true }
);

// Auto-génération de la référence
paiementSchema.pre("save", async function (next) {
  if (this.isNew && !this.reference) {
    const count = await mongoose.model("Paiement").countDocuments();
    const annee = new Date().getFullYear();
    this.reference = `TXN-${annee}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

paiementSchema.index({ client: 1, statut: 1 });
paiementSchema.index({ commande: 1 });

export default mongoose.model("Paiement", paiementSchema);