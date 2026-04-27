import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    equipId: {
      type: Number,
      required: true,
    },
    unitId: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["préventive", "curative"],
      required: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ["basse", "moyenne", "haute"],
      default: "moyenne",
    },
    status: {
      type: String,
      enum: ["open", "scheduled", "progress"],
      default: "open",
    },
    dateOuvert: {
      type: String,
      required: true,
    },
    datePrev: {
      type: String,
      default: "",
    },
    dateCloture: {
      type: String,
      default: "",
    },
    technicien: {
      type: String,
      default: "",
      trim: true,
    },
    cout: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    history: [
      {
        date: String,
        action: String,
        user: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Maintenance", maintenanceSchema);
