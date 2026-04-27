import mongoose from "mongoose";

const lineSchema = new mongoose.Schema({
  type: { type: String, enum: ["equip", "conso"], required: true },
  itemId: { type: Number, required: true },      // equipId ou consoId
  qte: { type: Number, default: 1 },
  pu: { type: Number, required: true },          // prix unitaire HT
  remPct: { type: Number, default: 0 },          // remise % sur la ligne
  total: { type: Number, required: true },       // total HT après remise
  label: { type: String, default: "" },
});

const checklistItemSchema = new mongoose.Schema({
  id: { type: String, required: true },          // present, propre, fonctionnel, cables...
  checked: { type: Boolean, default: false },
});

const commandeSchema = new mongoose.Schema(
  {
    // Identifiants
    id: { type: Number, required: true, unique: true },
    ref: { type: String, required: true, unique: true },

    // Liens
    clientId: { type: Number, required: true },
    equipId: { type: Number, required: true },
    unitId: { type: Number, default: null },
    cautionId: { type: Number, default: null },
    devisId: { type: String, default: "" },       // référence du devis source
    reconFrom: { type: Number, default: null },   // id de la commande reconduite
    reconType: { type: String, enum: ["prolongation", "renouvellement", "libre"] },

    // Dates
    start: { type: String, required: true },      // format DD/MM/YYYY
    end: { type: String, required: true },

    // Statuts
    status: {
      type: String,
      enum: ["active", "pending", "transit", "ended"],
      default: "pending",
    },

    // Financier
    pay: { type: String, required: true },        // Carte, Virement, Cash livr., Cash mag.
    amountHT: { type: Number, default: 0 },
    tvaRate: { type: Number, default: 20 },
    amountTTC: { type: Number, required: true },
    caution: { type: Number, default: 0 },        // Montant de la caution
    cautionMode: { type: String, default: "Cash" }, // Mode de paiement de la caution

    // Multi‑produits (si la commande contient plusieurs lignes)
    lines: [lineSchema],

    // Checklist retour
    checklistRetour: {
      date: { type: String, default: "" },
      results: [checklistItemSchema],
      notes: { type: String, default: "" },
      photo: { type: String, default: "" },       // base64
    },

    // Note
    note: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Commande", commandeSchema);
