import mongoose from "mongoose";

// Schéma pour une sous‑catégorie
const subcatSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // id numérique (incrémenté par catégorie)
  name: { type: String, required: true },
  desc: { type: String, default: "" },
});

// Schéma principal des catégories
const categorySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true }, // id global auto‑incrément
    icon: { type: String, required: true, default: "🏷️" },
    name: { type: String, required: true, unique: true, trim: true },
    color: { type: String, required: true, default: "#16A34A" },
    desc: { type: String, default: "" }, // optionnel
    subcats: [subcatSchema], // tableau de sous‑catégories
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Category", categorySchema);
