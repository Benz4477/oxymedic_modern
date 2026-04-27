import mongoose from "mongoose";

const cautionSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    clientId: {
      type: Number,
      required: true,
    },
    cmdRef: {
      type: String,
      required: true,
    },
    equipId: {
      type: Number,
      required: true,
    },
    unitSerial: {
      type: String,
      default: "",
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["held"],
      default: "held",
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    retourDate: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Caution", cautionSchema);
