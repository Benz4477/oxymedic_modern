import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  type:   { type: String, enum: ["earn", "redeem"], required: true },
  points: { type: Number, required: true },
  reason: { type: String, default: "" },
  date:   { type: Date,   default: Date.now },
}, { _id: false });

const loyaltySchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      unique: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    totalRentals: {
      type: Number,
      default: 0,
    },
    tier: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum"],
      default: "bronze",
    },
    cardNum: {
      type: String,
      unique: true,
      sparse: true,
    },
    history: [historySchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Loyalty", loyaltySchema);
