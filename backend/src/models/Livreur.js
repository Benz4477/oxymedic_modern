import mongoose from "mongoose";

const livreurSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    tel: {
      type: String,
      required: true,
      trim: true,
    },
    vehicule: {
      type: String,
      required: true,
      trim: true,
    },
    zone: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    livraisons: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Livreur", livreurSchema);
