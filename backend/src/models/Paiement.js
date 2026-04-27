import mongoose from "mongoose";

const paiementSchema = new mongoose.Schema(
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
    cmdRef: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "pending"],
      default: "pending",
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Paiement", paiementSchema);
