import mongoose from "mongoose";

const livraisonSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    clientId: {
      type: Number,
      required: true,
    },
    equipId: {
      type: Number,
      required: true,
    },
    livreurId: {
      type: Number,
      default: null,
    },
    type: {
      type: String,
      enum: ["livraison", "reprise"],
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      default: "—",
    },
    status: {
      type: String,
      enum: ["pending", "transit"],
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

export default mongoose.model("Livraison", livraisonSchema);
