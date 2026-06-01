import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    // Référence vers l'équipement — ObjectId propre
    equipement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipement",
      required: [true, "L'équipement est requis"],
      index: true,
    },
    magasin: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Magasin", 
      required: false, 
      index: true 
    },
    serial: {
      type: String,
      required: [true, "Le numéro de série est requis"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    barcode: {
      type: String,
      required: [true, "Le code-barres est requis"],
      unique: true,
      trim: true,
    },
    // Statut — source de vérité pour la disponibilité
    statut: {
      type: String,
      enum: ["disponible", "loué", "maintenance", "retiré", "archive"],
      default: "disponible",
      index: true,
    },
    // Commande active liée (null si disponible)
    commandeActive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Commande",
      default: null,
    },
    // Client actuel (dénormalisé pour performance)
    clientActuel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      default: null,
    },
    // Infos physiques
    etat: {
      type: String,
      enum: ["neuf", "bon", "use", "defectueux"],
      default: "bon",
    },
    dateAchat: {
      type: Date,
      default: null,
    },
    emplacement: {
      type: String,
      default: "",
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

// Index composé pour recherche
unitSchema.index({ serial: 1, equipement: 1 });
unitSchema.index({ barcode: 1 });
unitSchema.index({ statut: 1, equipement: 1 }); // pour getUnitesDisponibles()

export default mongoose.model("Unit", unitSchema);