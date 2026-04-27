import mongoose from "mongoose";

const societeSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      default: "OXYMEDIC",
    },
    slogan: {
      type: String,
      default: "Le confort médical à domicile",
    },
    adresse: {
      type: String,
      default: "Casablanca, Maroc",
    },
    ville: {
      type: String,
      default: "Casablanca",
    },
    tel: {
      type: String,
      default: "+212 5XX-XXX-XXX",
    },
    tel2: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "contact@oxymedic.ma",
    },
    website: {
      type: String,
      default: "www.oxymedic.ma",
    },
    ice: {
      type: String,
      default: "XXXXXXXXXXXXXXXXX",
    },
    rc: {
      type: String,
      default: "XXXXX / Casablanca",
    },
    if_fisc: {
      type: String,
      default: "XXXXXXXX",
    },
    patente: {
      type: String,
      default: "",
    },
    cnss: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    banque: {
      type: String,
      default: "",
    },
    agence: {
      type: String,
      default: "",
    },
    rib: {
      type: String,
      default: "XXX XXXX XXXXXXXXXXXXXXXX XX",
    },
    iban: {
      type: String,
      default: "",
    },
    swift: {
      type: String,
      default: "",
    },
    tva_rate: {
      type: Number,
      default: 20,
    },
    note_facture: {
      type: String,
      default: "Paiement sous 30 jours. Tout retard de paiement entraîne des pénalités de 1,5% par mois.",
    },
    note_proforma: {
      type: String,
      default: "Cette proforma est valable 15 jours. Elle ne constitue pas une facture définitive.",
    },
    validite_proforma: {
      type: Number,
      default: 15,
    },
    couleur_principale: {
      type: String,
      default: "#16A34A",
    },
    pied_page: {
      type: String,
      default: "Merci de votre confiance — OXYMEDIC",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Societe", societeSchema);
