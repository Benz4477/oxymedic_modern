import mongoose from "mongoose";

const magasinSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, unique: true, trim: true },
    ville: { type: String, required: true, trim: true },
    adresse: { type: String, default: "" },
    tel: { type: String, default: "" },
    email: { type: String, default: "" },
    ice: { type: String, default: "" }, // Optionnel, si chaque magasin a son propre ICE
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    type: { type: String, enum: ["magasin", "depot"], default: "magasin" },
    isDefault: { type: Boolean, default: false }, // Pour identifier le dépôt principal ou siège
  },
  { timestamps: true }
);

export default mongoose.model("Magasin", magasinSchema);
