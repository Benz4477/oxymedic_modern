import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["info", "warning", "success", "error"], default: "info" },
    read: { type: Boolean, default: false },
    targetRoles: [{ type: String }], // Rôles qui recevront cette notification
    link: { type: String, default: "" }, // Lien vers l'élément concerné
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
