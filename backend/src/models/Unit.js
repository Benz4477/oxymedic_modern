import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
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
    serial: {
      type: String,
      required: true,
    },
    barcode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "rented"],
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
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Unit", unitSchema);
