import mongoose from "mongoose";

const transfertItemSchema = new mongoose.Schema({
    type: { type: String, enum: ["unit", "consommable"], default: "unit" },
    
    // Pour les machines (Unités)
    equipement: { type: mongoose.Schema.Types.ObjectId, ref: "Equipement" },
    unite: { type: mongoose.Schema.Types.ObjectId, ref: "Unit" },
    
    // Pour les consommables
    consommable: { type: mongoose.Schema.Types.ObjectId, ref: "Consommable" },
    quantity: { type: Number, default: 1 },
    
    note: { type: String, default: "" }
});

const transfertSchema = new mongoose.Schema(
    {
        reference: { type: String, unique: true },
        sourceMagasin: { type: mongoose.Schema.Types.ObjectId, ref: "Magasin", required: true, index: true },
        targetMagasin: { type: mongoose.Schema.Types.ObjectId, ref: "Magasin", required: true, index: true },
        
        items: [transfertItemSchema],
        
        statut: {
            type: String,
            enum: ["pending", "in_transit", "completed", "cancelled"],
            default: "pending",
            index: true
        },
        
        logistique: {
            chauffeur: { type: String, default: "" },
            vehicule: { type: String, default: "" },
            matricule: { type: String, default: "" }
        },
        
        dateExpedition: { type: Date, default: null },
        dateReception: { type: Date, default: null },
        
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        notes: { type: String, default: "" }
    },
    { timestamps: true }
);

transfertSchema.pre("save", async function (next) {
    if (this.isNew && !this.reference) {
        const count = await mongoose.model("Transfert").countDocuments();
        const year = new Date().getFullYear();
        this.reference = `TRF-${year}-${String(count + 1).padStart(4, "0")}`;
    }
    next();
});

export default mongoose.model("Transfert", transfertSchema);
