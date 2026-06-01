import mongoose from "mongoose";

const venteConsommableSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    num: { type: String, unique: true, default: () => `VCO-${Date.now().toString().slice(-8)}` },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    magasin: { type: mongoose.Schema.Types.ObjectId, ref: "Magasin", required: true, index: true },
    consommable: { type: mongoose.Schema.Types.ObjectId, ref: "Consommable", required: true },
    qte: { type: Number, required: true, min: 1 },
    prixUnit: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    commandeRef: { type: String, default: "" }, // Lien avec une commande existante
    note: { type: String, default: "" },
    date: { type: String, required: true }, // format DD/MM/YYYY
  },
  { timestamps: true }
);

venteConsommableSchema.pre("save", async function (next) {
  if (this.isNew && !this.id) {
    const last = await mongoose.model("VenteConsommable").findOne().sort({ id: -1 });
    this.id = last && last.id ? last.id + 1 : 1;
  }
  next();
});

export default mongoose.model("VenteConsommable", venteConsommableSchema);