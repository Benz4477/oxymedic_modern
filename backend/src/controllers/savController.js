// backend/src/controllers/savController.js
import Sav from "../models/Sav.js";
import Maintenance from "../models/Maintenance.js";
import Unit from "../models/Unit.js";
import { createNotification } from "./notificationController.js";

const POPULATE = [
    { path: "client", select: "prenom nom tel email" },
    { path: "equipement", select: "name icon ref cat" },
    { path: "unite", select: "serial statut" },
    { path: "commande", select: "reference dateDebut" },
];

export const getAllSav = async (req, res) => {
    try {
        const { status, urgency } = req.query;
        const filter = req.magasinId ? { magasin: req.magasinId } : {};
        if (status) filter.status = status;
        if (urgency) filter.urgency = urgency;

        const tickets = await Sav.find(filter).populate(POPULATE).sort({ createdAt: -1 });
        res.json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSavById = async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        if (req.magasinId) filter.magasin = req.magasinId;

        const ticket = await Sav.findOne(filter).populate(POPULATE);
        if (!ticket) return res.status(404).json({ success: false, message: "Ticket non trouvé ou accès non autorisé" });
        res.json({ success: true, data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createSav = async (req, res) => {
    try {
        const { user } = req;
        const ticket = new Sav({
            ...req.body,
            magasin: req.magasinId, // Liaison magasin
            createdAt: new Date().toLocaleDateString("fr-FR"),
            notes: [{ date: new Date().toLocaleDateString("fr-FR"), note: "Ticket créé", by: user?.name || "Admin" }]
        });
        await ticket.save();

        // Notification (optionnel: limiter aux rôles du même magasin si possible)
        await createNotification({
            title: "Nouveau Ticket SAV",
            message: `Un ticket SAV (${ticket.num}) a été ouvert pour : ${req.body.title}`,
            type: "info",
            targetRoles: ["admin", "superadmin", "commercial"],
            link: "/app/sav"
        });

        const populated = await Sav.findById(ticket._id).populate(POPULATE);
        res.status(201).json({ success: true, data: populated, message: "Ticket créé" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateSav = async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        if (req.magasinId) filter.magasin = req.magasinId;

        const ticket = await Sav.findOneAndUpdate(filter, req.body, { new: true }).populate(POPULATE);
        if (!ticket) return res.status(404).json({ success: false, message: "Ticket non trouvé ou accès non autorisé" });
        res.json({ success: true, data: ticket, message: "Ticket mis à jour" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const addSavNote = async (req, res) => {
    try {
        const { note } = req.body;
        const { user } = req;
        if (!note) return res.status(400).json({ success: false, message: "Note requise" });

        const filter = { _id: req.params.id };
        if (req.magasinId) filter.magasin = req.magasinId;

        const ticket = await Sav.findOne(filter);
        if (!ticket) return res.status(404).json({ success: false, message: "Ticket non trouvé ou accès non autorisé" });

        ticket.notes.push({ date: new Date().toLocaleDateString("fr-FR"), note, by: user?.name || "Admin" });
        await ticket.save();
        const populated = await Sav.findById(ticket._id).populate(POPULATE);
        res.json({ success: true, data: populated, message: "Note ajoutée" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const resolveSav = async (req, res) => {
    try {
        const { user } = req;
        const filter = { _id: req.params.id };
        if (req.magasinId) filter.magasin = req.magasinId;

        const ticket = await Sav.findOne(filter);
        if (!ticket) return res.status(404).json({ success: false, message: "Ticket non trouvé ou accès non autorisé" });

        ticket.status = "resolved";
        ticket.closedAt = new Date().toLocaleDateString("fr-FR");
        ticket.notes.push({ date: new Date().toLocaleDateString("fr-FR"), note: "Ticket résolu", by: user?.name || "Admin" });
        await ticket.save();
        const populated = await Sav.findById(ticket._id).populate(POPULATE);
        res.json({ success: true, data: populated, message: "Ticket marqué comme résolu" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteSav = async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        if (req.magasinId) filter.magasin = req.magasinId;

        const ticket = await Sav.findOneAndDelete(filter);
        if (!ticket) return res.status(404).json({ success: false, message: "Ticket non trouvé ou accès non autorisé" });
        res.json({ success: true, message: "Ticket supprimé" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getSavStats = async (req, res) => {
    try {
        const filter = req.magasinId ? { magasin: req.magasinId } : {};
        const [open, progress, resolved, closed, urgent] = await Promise.all([
            Sav.countDocuments({ ...filter, status: "open" }),
            Sav.countDocuments({ ...filter, status: "progress" }),
            Sav.countDocuments({ ...filter, status: "resolved" }),
            Sav.countDocuments({ ...filter, status: "closed" }),
            Sav.countDocuments({ ...filter, urgency: "haute", status: { $in: ["open", "progress"] } })
        ]);
        res.json({ success: true, data: { open, progress, resolved, closed, urgent } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const convertToMaintenance = async (req, res) => {
    try {
        const { user } = req;
        const filter = { _id: req.params.id };
        if (req.magasinId) filter.magasin = req.magasinId;

        const sav = await Sav.findOne(filter);
        if (!sav) return res.status(404).json({ success: false, message: "Ticket SAV non trouvé ou accès non autorisé" });

        if (sav.type !== "panne") {
            return res.status(400).json({ success: false, message: "Seuls les tickets de type panne peuvent être transférés en maintenance" });
        }

        // Créer l'intervention de maintenance
        const maintenance = new Maintenance({
            magasin: sav.magasin || req.magasinId, // Hériter du magasin
            equipement: sav.equipement,
            unite: sav.unite,
            savSource: sav._id,
            type: "curative",
            description: `[SAV ${sav.num}] ${sav.title}: ${sav.description}`,
            priority: sav.urgency,
            status: "open",
            dateOuvert: new Date().toLocaleDateString("fr-FR"),
            historique: [{
                date: new Date().toLocaleDateString("fr-FR"),
                action: `Créé via SAV ${sav.num}`,
                user: user?.name || "Système"
            }]
        });

        await maintenance.save();

        // Mettre à jour le statut du ticket SAV
        sav.status = "progress";
        sav.notes.push({
            date: new Date().toLocaleDateString("fr-FR"),
            note: `Transféré en maintenance (Réf: ${maintenance.num})`,
            by: user?.name || "Système"
        });
        await sav.save();

        // Mettre à jour le statut de l'unité si présente
        if (sav.unite) {
            await Unit.findByIdAndUpdate(sav.unite, { statut: "maintenance" });
        }

        res.json({
            success: true,
            data: { maintenanceId: maintenance._id, maintenanceNum: maintenance.num },
            message: "Transfert en maintenance réussi"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
