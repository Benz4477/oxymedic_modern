// backend/src/models/Sav.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    date: { type: String, required: true }, // DD/MM/YYYY
    note: { type: String, required: true },
    by: { type: String, default: "Système" },
}, { _id: false });

const savSchema = new mongoose.Schema(
    {
        id: { type: Number, unique: true }, // ID numérique auto-incrémenté
        num: { type: String, unique: true }, // Référence SAV-YYYY-XXXX
        client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
        magasin: { type: mongoose.Schema.Types.ObjectId, ref: "Magasin", required: true, index: true },
        equipement: { type: mongoose.Schema.Types.ObjectId, ref: "Equipement", default: null },
        unite: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", default: null },
        commande: { type: mongoose.Schema.Types.ObjectId, ref: "Commande", default: null },
        type: { type: String, enum: ["panne", "livraison", "facture", "autre"], default: "autre" },
        title: { type: String, required: true },
        description: { type: String, default: "" },
        urgency: { type: String, enum: ["haute", "moyenne", "basse"], default: "moyenne" },
        status: { type: String, enum: ["open", "progress", "resolved", "closed"], default: "open" },
        createdAt: { type: String, required: true }, // DD/MM/YYYY
        closedAt: { type: String, default: "" },
        notes: [noteSchema],
    },
    { timestamps: true }
);

// Auto-incrément ID numérique et génération du numéro
savSchema.pre("save", async function (next) {
    if (this.isNew) {
        const last = await mongoose.model("Sav").findOne().sort({ id: -1 });
        this.id = last && last.id ? last.id + 1 : 1;
        const year = new Date().getFullYear();
        const count = await mongoose.model("Sav").countDocuments();
        this.num = `SAV-${year}-${String(count + 1).padStart(4, "0")}`;
    }
    next();
});

export default mongoose.model("Sav", savSchema);