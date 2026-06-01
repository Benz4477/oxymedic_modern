import mongoose from "mongoose";

const fournisseurSchema = new mongoose.Schema({
  nom: { type: String, default: "" },
  tel: { type: String, default: "" },
  email: { type: String, default: "" },
}, { _id: false });

const consommableSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true }, // ID numérique auto-incrémenté (compatible legacy)
    name: { type: String, required: true, trim: true },
    magasin: { type: mongoose.Schema.Types.ObjectId, ref: "Magasin", required: true, index: true },
    ref: { type: String, unique: true, sparse: true, trim: true }, // Référence produit
    marque: { type: String, default: "", trim: true },
    origine: { type: String, default: "", trim: true },
    prixAchatHT: { type: Number, default: 0, min: 0 },
    tva: { type: Number, default: 20, min: 0, max: 100 },
    prixAchatTTC: { type: Number, default: 0, min: 0 },
    prixVente: { type: Number, default: 0, min: 0 },
    unite: { type: String, default: "pièce" },
    conditionnement: { type: String, default: "", trim: true },
    barcode: { type: String, default: "", trim: true },
    stock: { type: Number, default: 0, min: 0 },
    stockMin: { type: Number, default: 10, min: 0 },
    compatEquips: [{ type: mongoose.Schema.Types.ObjectId, ref: "Equipement" }],
    desc: { type: String, default: "", trim: true },
    photo: { type: String, default: "" }, // URL Cloudinary ou base64
    fournisseurPrincipal: { type: fournisseurSchema, default: () => ({}) },
    autresFournisseurs: [fournisseurSchema],
  },
  { timestamps: true }
);

// Auto-incrément de l'ID numérique
consommableSchema.pre("save", async function (next) {
  if (this.isNew && !this.id) {
    const last = await mongoose.model("Consommable").findOne().sort({ id: -1 });
    this.id = last && last.id ? last.id + 1 : 1;
  }
  // Calculer prixAchatTTC si non renseigné
  if (this.prixAchatHT > 0 && this.tva >= 0 && !this.prixAchatTTC) {
    this.prixAchatTTC = Math.round(this.prixAchatHT * (1 + this.tva / 100));
  }
  next();
});

export default mongoose.model("Consommable", consommableSchema);