import mongoose from "mongoose";

const loyaltySchema = new mongoose.Schema(
  {
    clientId: {
      type: Number,
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
      required: true,
      unique: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
    history: [
      {
        date: String,
        action: String,
        points: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Loyalty", loyaltySchema);
