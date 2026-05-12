import mongoose from "mongoose";

const opportuniteSchema = new mongoose.Schema({
  client:     { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  equipement: { type: mongoose.Schema.Types.ObjectId, ref: "Equipement", default: null },
  stageId:    { type: Number, required: true, default: 1 },
  amount:     { type: Number, default: 0, min: 0 },
  prob:       { type: Number, default: 50, min: 0, max: 100 },
  notes:      { type: String, default: "" },
  lostReason: { type: String, default: "" },
  createdBy:  { type: String, default: "Admin" },
}, { timestamps: true });

opportuniteSchema.index({ stageId: 1, client: 1 });

export default mongoose.model("Opportunite", opportuniteSchema);