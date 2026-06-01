import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
    {
        id: { type: Number, unique: true },           // ID numérique auto‑incrémenté
        num: { type: String, unique: true },          // Réf: RES-YYYY-XXXX
        magasin: { type: mongoose.Schema.Types.ObjectId, ref: "Magasin", required: true, index: true },
        client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true, index: true },
        equipement: { type: mongoose.Schema.Types.ObjectId, ref: "Equipement", required: true, index: true },
        unite: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", default: null, index: true },
        startDate: { type: String, required: true },   // format DD/MM/YYYY
        endDate: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "pending",
            index: true,
        },
        montant: { type: Number, default: 0, min: 0 },
        notes: { type: String, default: "" },
        createdAt: { type: String, required: true },
        confirmedAt: { type: String, default: "" },
        cancelledAt: { type: String, default: "" },
        completedAt: { type: String, default: "" },
    },
    { timestamps: true }
);

// Auto‑incrément du champ id numérique et génération du numéro
reservationSchema.pre("save", async function (next) {
    if (this.isNew) {
        // ID numérique
        const last = await mongoose.model("Reservation").findOne().sort({ id: -1 });
        this.id = last && last.id ? last.id + 1 : 1;
        // Numéro de réservation RES-YYYY-XXXX
        const year = new Date().getFullYear();
        const count = await mongoose.model("Reservation").countDocuments();
        this.num = `RES-${year}-${String(count + 1).padStart(4, "0")}`;
        // Date de création
        this.createdAt = new Date().toLocaleDateString("fr-FR");
    }
    next();
});

export default mongoose.model("Reservation", reservationSchema);