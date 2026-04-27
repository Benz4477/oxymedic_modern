import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    prenom: { type: String, required: true, trim: true },
    nom: { type: String, required: true, trim: true },
    tel: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true },
    dateNaiss: { type: Date, default: null },
    quartier: { type: String, default: "", trim: true },
    adresse: { type: String, default: "", trim: true },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    cinNum: { type: String, default: "", trim: true },
    cinExp: { type: String, default: "", trim: true }, // format "MM/YYYY"
    docs: {
      cin_r: { type: String, default: "" },
      cin_v: { type: String, default: "" },
      ordonnance: { type: String, default: "" },
      assurance: { type: String, default: "" },
      justif: { type: String, default: "" },
      autre: { type: String, default: "" },
    },
    note: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

export default mongoose.model("Client", clientSchema);
