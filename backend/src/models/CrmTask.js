import mongoose from "mongoose";

const crmTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      default: null,
    },
    type: {
      type: String,
      enum: ["call", "email", "delivery", "contract", "other"],
      default: "other",
    },
    priority: {
      type: String,
      enum: ["haute", "moyenne", "basse"],
      default: "moyenne",
    },
    dueDate:    { type: Date, default: null },
    assignedTo: { type: String, default: "" },
    done:       { type: Boolean, default: false },
    doneAt:     { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("CrmTask", crmTaskSchema);