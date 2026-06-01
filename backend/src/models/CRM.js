import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema({
  magasin:   { type: mongoose.Schema.Types.ObjectId, ref: "Magasin", required: false, index: true },
  client:    { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  type:      { type: String, enum: ["call", "email", "visit", "note", "sms", "whatsapp"], default: "note" },
  titre:     { type: String, required: true, trim: true },
  note:      { type: String, default: "" },
  date:      { type: Date, default: Date.now },
  createdBy: { type: String, default: "Admin" },
}, { timestamps: true });

// ── Tâche ────────────────────────────────────────────────
const tacheSchema = new mongoose.Schema({
  magasin:    { type: mongoose.Schema.Types.ObjectId, ref: "Magasin", required: false, index: true },
  titre:      { type: String, required: true, trim: true },
  client:     { type: mongoose.Schema.Types.ObjectId, ref: "Client", default: null },
  type:       { type: String, enum: ["call", "email", "delivery", "contract", "other"], default: "other" },
  priorite:   { type: String, enum: ["haute", "moyenne", "basse"], default: "moyenne" },
  echeance:   { type: Date, default: null },
  assignedTo: { type: String, default: "Admin" },
  done:       { type: Boolean, default: false },
  createdBy:  { type: String, default: "Admin" },
}, { timestamps: true });

export const Interaction = mongoose.model("Interaction", interactionSchema);
export const Tache       = mongoose.model("Tache",       tacheSchema);