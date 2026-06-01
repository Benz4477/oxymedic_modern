import mongoose from "mongoose";

const cautionSchema = new mongoose.Schema(
  {
    ref: {
      type: String,
      unique: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    magasin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Magasin",
      default: null,
    },
    commande: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Commande",
      default: null,
    },
    equipement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipement",
      default: null,
    },
    unite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      default: null,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    mode: {
      type: String,
      enum: ["Cash", "Chèque", "Virement", "Carte"],
      default: "Cash",
    },
    "numeroChèque": {
      type: String,
      default: "",
    },
    banque: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["held", "returned", "deducted"],
      default: "held",
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    retourDate: {
      type: Date,
      default: null,
    },
    deductionAmount: {
      type: Number,
      default: 0,
    },
    deductionReason: {
      type: String,
      default: "",
    },
    saisiePar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    restituePar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Caution", cautionSchema);
