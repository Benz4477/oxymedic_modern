import mongoose from "mongoose";

const fraisSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    livreurId: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["gasoil", "autoroute", "parking", "autre"],
      required: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    livId: {
      type: Number,
      default: null,
    },
    montant: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Frais", fraisSchema);
