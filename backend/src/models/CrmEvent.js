import mongoose from "mongoose";

const crmEventSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    type: {
      type: String,
      enum: ["call", "email", "visit", "note", "sms", "whatsapp"],
      default: "note",
    },
    title: { type: String, required: true, trim: true },
    note:  { type: String, default: "" },
    date:  { type: Date, default: Date.now },
    createdBy: { type: String, default: "Admin" },
  },
  { timestamps: true }
);

export default mongoose.model("CrmEvent", crmEventSchema);