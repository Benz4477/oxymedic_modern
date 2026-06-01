import Transfert from "../models/Transfert.js";
import Unit from "../models/Unit.js";
import Consommable from "../models/Consommable.js";
import Equipement from "../models/Equipement.js";
import mongoose from "mongoose";

// Récupérer tous les transferts
export const getAllTransferts = async (req, res) => {
    try {
        const filter = {};
        if (req.user.role !== "superadmin" && req.user.role !== "admin") {
            if (req.magasinId) {
                filter.$or = [
                    { sourceMagasin: req.magasinId },
                    { targetMagasin: req.magasinId }
                ];
            }
        }

        const transferts = await Transfert.find(filter)
            .populate("sourceMagasin", "nom ville")
            .populate("targetMagasin", "nom ville")
            .populate("items.equipement", "name icon")
            .populate("items.unite", "serial barcode")
            .populate("items.consommable", "name ref barcode photo")
            .populate("createdBy", "name")
            .sort({ createdAt: -1 });

        res.json({ success: true, data: transferts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Créer un transfert
export const createTransfert = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { sourceMagasin, targetMagasin, items, logistique, notes } = req.body;

        // Vérification de sécurité : les unités doivent être disponibles au départ
        for (const item of items) {
            if (item.type === "unit") {
                const unit = await Unit.findById(item.unite).session(session);
                if (!unit || unit.statut !== "disponible") {
                    throw new Error(`L'unité ${unit?.serial || ""} n'est pas disponible pour un transfert.`);
                }
            }
        }

        const newTransfert = new Transfert({
            sourceMagasin,
            targetMagasin,
            items,
            logistique,
            notes,
            createdBy: req.user._id,
            statut: "pending"
        });

        await newTransfert.save({ session });
        await session.commitTransaction();
        res.status(201).json({ success: true, data: newTransfert });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ success: false, message: error.message });
    } finally {
        session.endSession();
    }
};

// Mettre à jour statut + Mouvement Stock
export const updateTransfertStatus = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { statut } = req.body;
        const transfert = await Transfert.findById(req.params.id).populate("items.consommable").session(session);

        if (!transfert) return res.status(404).json({ success: false, message: "Non trouvé" });

        // SÉCURITÉ : Vérification des droits sur l'action
        if (statut === "in_transit" && String(transfert.sourceMagasin) !== String(req.magasinId) && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Seul le magasin d'origine peut expédier le matériel." });
        }
        if (statut === "completed" && String(transfert.targetMagasin) !== String(req.magasinId) && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Seul le magasin de destination peut réceptionner le matériel." });
        }

        // LOGIQUE DE STOCK
        if (statut === "in_transit") {
            // Passage en "En Transfert" pour bloquer toute réservation
            for (const item of transfert.items) {
                if (item.type === "unit") {
                    await Unit.findByIdAndUpdate(item.unite, { statut: "en_transfert" }, { session });
                }
            }
            transfert.dateExpedition = new Date();
        }

        if (statut === "completed") {
            for (const item of transfert.items) {
                if (item.type === "unit") {
                    // Transfert final de machine
                    // 1. Récupérer l'unité et son équipement d'origine
                    const unit = await Unit.findById(item.unite).session(session);
                    const sourceEquip = await Equipement.findById(unit.equipement).session(session);

                    // 2. Décrémenter les stocks de l'équipement dans le magasin source
                    if (sourceEquip) {
                        sourceEquip.total = Math.max(0, sourceEquip.total - 1);
                        sourceEquip.dispo = Math.max(0, sourceEquip.dispo - 1);
                        await sourceEquip.save({ session });
                    }

                    // 3. Chercher ou créer l'équipement dans le magasin cible
                    let targetEquip = await Equipement.findOne({ 
                        name: sourceEquip.name, 
                        magasin: transfert.targetMagasin 
                    }).session(session);

                    if (!targetEquip) {
                        // Récupérer le prochain ID numérique
                        const lastEquip = await Equipement.findOne().sort({ id: -1 }).session(session);
                        const nextId = lastEquip ? lastEquip.id + 1 : 1;

                        targetEquip = new Equipement({
                            ...sourceEquip.toObject(),
                            _id: new mongoose.Types.ObjectId(),
                            id: nextId,
                            magasin: transfert.targetMagasin,
                            total: 1,
                            dispo: 1
                        });
                        await targetEquip.save({ session });
                    } else {
                        targetEquip.total += 1;
                        targetEquip.dispo += 1;
                        await targetEquip.save({ session });
                    }

                    // 4. Mettre à jour l'unité (magasin cible, liaison avec le nouvel équipement et statut disponible)
                    await Unit.findByIdAndUpdate(item.unite, { 
                        magasin: transfert.targetMagasin,
                        equipement: targetEquip._id, // Liaison avec la fiche équipement locale du magasin cible
                        statut: "disponible", // Redevient disponible à destination
                        $push: { historiqueMouvements: {
                            date: new Date(),
                            from: transfert.sourceMagasin,
                            to: transfert.targetMagasin,
                            type: "transfert",
                            reference: transfert.reference
                        }}
                    }, { session });
                } else if (item.type === "consommable") {
                    // Transfert de consommable
                    // 1. Diminuer stock source
                    await Consommable.findByIdAndUpdate(item.consommable, { 
                        $inc: { stock: -item.quantity } 
                    }, { session });

                    // 2. Augmenter stock cible
                    const sourceConso = await Consommable.findById(item.consommable).session(session);
                    let targetConso = await Consommable.findOne({ 
                        magasin: transfert.targetMagasin, 
                        name: sourceConso.name 
                    }).session(session);

                    if (!targetConso) {
                        targetConso = new Consommable({
                            ...sourceConso.toObject(),
                            _id: new mongoose.Types.ObjectId(),
                            magasin: transfert.targetMagasin,
                            stock: item.quantity,
                            id: undefined
                        });
                        await targetConso.save({ session });
                    } else {
                        targetConso.stock += item.quantity;
                        await targetConso.save({ session });
                    }
                }
            }
            transfert.dateReception = new Date();
        }

        transfert.statut = statut;
        await transfert.save({ session });
        await session.commitTransaction();
        res.json({ success: true, data: transfert });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ success: false, message: error.message });
    } finally {
        session.endSession();
    }
};
