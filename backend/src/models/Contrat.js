import mongoose from "mongoose";

const contratSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      unique: true,
      uppercase: true,
    },

    // Type de contrat
    type: {
      type: String,
      enum: ["location", "renouvellement", "essai", "vente"],
      default: "location",
    },

    // Relation avec la commande
    commande: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Commande",
      required: true,
    },

    // Relation avec le client (dénormalisé pour affichage rapide)
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    clientNom: { type: String, default: "" },
    clientEmail: { type: String, default: "" },
    clientTel: { type: String, default: "" },
    clientAdresse: { type: String, default: "" },

    // Statut du contrat
    statut: {
      type: String,
      enum: ["draft", "pending_signature", "signed", "archived"],
      default: "draft",
    },

    // Chemin du fichier PDF
    pdfPath: {
      type: String,
      default: "",
    },

    // Signature
    signature: {
      image: { type: String, default: "" }, // Base64 ou chemin fichier
      date: { type: Date, default: null },
      ip: { type: String, default: "" },
      userAgent: { type: String, default: "" },
    },

    // Dates
    dateGeneration: {
      type: Date,
      default: Date.now,
    },
    dateSignature: {
      type: Date,
      default: null,
    },

    // Conditions du contrat
    conditionsSpeciales: {
      type: String,
      default: "",
    },

    // Métadonnées
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Auto-génération de la référence
contratSchema.pre("save", async function (next) {
  if (this.isNew && !this.reference) {
    const year = new Date().getFullYear();
    const count = await mongoose.model("Contrat").countDocuments();
    this.reference = `CTR-${year}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// Middleware pour dénormaliser les données du client
contratSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("client")) {
    try {
      const Client = mongoose.model("Client");
      const clientData = await Client.findById(this.client);
      if (clientData) {
        this.clientNom = `${clientData.prenom} ${clientData.nom}`;
        this.clientEmail = clientData.email || "";
        this.clientTel = clientData.tel || "";
        this.clientAdresse = clientData.adresse || "";
      }
    } catch (e) {
      console.error("Erreur lors de la dénormalisation du client", e);
    }
  }
  next();
});

// Indexes
contratSchema.index({ commande: 1 });
contratSchema.index({ client: 1 });
contratSchema.index({ statut: 1 });
contratSchema.index({ reference: 1 });

export default mongoose.model("Contrat", contratSchema);
