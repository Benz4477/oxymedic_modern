import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    equipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipement",
      required: true,
    },
    serial: {
      type: String,
      required: true,
      unique: true,
    },
    barcode: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["available", "rented", "maintenance", "retired"],
      default: "available",
    },
    clientId: {
      type: Number,
      default: null,
    },
    cmdRef: {
      type: String,
      default: "",
    },
    dateIn: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Unit", unitSchema);
