import mongoose from "mongoose";

const equipementSchema = new mongoose.Schema(
  {
    // Identification
    icon: { type: String, default: "🏥" },
    name: { type: String, required: true },
    cat: { type: String, required: true }, // catégorie principale
    subcat: { type: String, default: "" }, // sous‑catégorie (optionnel)
    ref: { type: String, default: "" }, // référence produit
    emplacement: { type: String, default: "" }, // lieu de stockage
    cardColor: { type: String, default: "#16A34A" }, // couleur de la carte
    marque: { type: String, default: "" },
    origine: { type: String, default: "" },

    // Codes‑barres
    productBarcode: { type: String, default: "" },

    // Tarifs
    pDay: { type: Number, default: 0 },
    pWeek: { type: Number, default: 0 },
    pMonth: { type: Number, default: 0 },
    pVente: { type: Number, default: 0 }, // prix de vente
    caution: { type: Number, default: 0 },

    // Stock
    total: { type: Number, default: 1 },
    dispo: { type: Number, default: 1 },

    // Statuts
    visible: { type: Boolean, default: true },
    archived: { type: Boolean, default: false },

    // Médias et description
    photo: { type: String, default: "" }, // base64 ou URL
    desc: { type: String, default: "" },
  },
  {
    timestamps: true, // ajoute createdAt et updatedAt
  },
);

export default mongoose.model("Equipement", equipementSchema);
