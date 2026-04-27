import mongoose from "mongoose";

const commandeSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    ref: {
      type: String,
      required: true,
    },
    clientId: {
      type: Number,
      required: true,
    },
    equipId: {
      type: Number,
      required: true,
    },
    unitId: {
      type: Number,
      default: null,
    },
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "pending", "transit"],
      default: "pending",
    },
    pay: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    cautionId: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Commande", commandeSchema);
