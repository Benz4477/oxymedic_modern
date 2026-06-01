import Reservation from "../models/Reservation.js";
import Commande from "../models/Commande.js";
import Unit from "../models/Unit.js"; // Correction: Le modèle s'appelle Unit, pas Unite
import mongoose from "mongoose";

// Fonction utilitaire pour vérifier la disponibilité d'une unité (isolée par magasin)
const isUnitAvailable = async (uniteId, startDate, endDate, magasinId, excludeReservationId = null) => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    if (!start || !end || start > end) return false;

    // 1. Vérifier les réservations existantes dans ce magasin
    const resQuery = {
        magasin: magasinId,
        unite: uniteId,
        status: { $in: ["pending", "confirmed"] },
    };
    if (excludeReservationId) resQuery._id = { $ne: excludeReservationId };

    const overlappingRes = await Reservation.find(resQuery);
    
    // Pour les réservations, on doit parser les strings DD/MM/YYYY pour comparer
    for (const res of overlappingRes) {
        const resStart = parseDate(res.startDate);
        const resEnd = parseDate(res.endDate);
        if (
            (resStart <= end && resStart >= start) ||
            (resEnd <= end && resEnd >= start) ||
            (resStart <= start && resEnd >= end)
        ) {
            return false;
        }
    }

    // 2. Vérifier les commandes réelles dans ce magasin
    // Les commandes utilisent des objets Date natifs
    const overlappingCmd = await Commande.findOne({
        magasin: magasinId,
        unite: uniteId,
        statut: { $in: ["pending", "active", "transit"] },
        $or: [
            { dateDebut: { $lte: end, $gte: start } },
            { dateFin: { $lte: end, $gte: start } },
            { $and: [{ dateDebut: { $lte: start } }, { dateFin: { $gte: end } }] },
        ],
    });

    return !overlappingCmd;
};

const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [d, m, y] = dateStr.split("/");
    return new Date(`${y}-${m}-${d}`);
};

// Récupérer toutes les réservations (filtrées par magasin)
export const getAllReservations = async (req, res) => {
    try {
        const { status, clientId, equipementId, startDate, endDate } = req.query;
        const filter = {};
        
        if (req.magasinId) filter.magasin = req.magasinId;
        if (status) filter.status = status;
        if (clientId) filter.client = clientId;
        if (equipementId) filter.equipement = equipementId;
        if (startDate && endDate) {
            filter.startDate = { $gte: startDate };
            filter.endDate = { $lte: endDate };
        }

        const reservations = await Reservation.find(filter)
            .populate("magasin", "nom type")
            .populate("client", "prenom nom tel")
            .populate("equipement", "name icon cat")
            .populate("unite", "serial status")
            .sort({ createdAt: -1 });

        res.json({ success: true, data: reservations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Récupérer une réservation par ID
export const getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate("magasin", "nom type")
            .populate("client", "prenom nom tel")
            .populate("equipement", "name icon cat")
            .populate("unite", "serial status");

        if (!reservation) return res.status(404).json({ success: false, message: "Réservation non trouvée" });
        
        if (req.magasinId && reservation.magasin._id.toString() !== req.magasinId.toString())
            return res.status(403).json({ success: false, message: "Accès interdit à ce magasin" });

        res.json({ success: true, data: reservation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Créer une réservation
export const createReservation = async (req, res) => {
    try {
        const { client, equipement, unite, startDate, endDate, montant, notes, status } = req.body;
        
        if (!req.magasinId) return res.status(400).json({ success: false, message: "Contexte magasin manquant" });

        if (!client || !equipement || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: "Champs obligatoires manquants" });
        }

        // Vérifier disponibilité si une unité est spécifiée
        if (unite) {
            const available = await isUnitAvailable(unite, startDate, endDate, req.magasinId);
            if (!available) {
                return res.status(409).json({ success: false, message: "L'unité n'est pas disponible sur cette période" });
            }
        }

        const reservation = new Reservation({
            magasin: req.magasinId,
            client,
            equipement,
            unite: unite || null,
            startDate,
            endDate,
            montant: montant || 0,
            notes: notes || "",
            status: status || "pending",
        });
        await reservation.save();
        res.status(201).json({ success: true, data: reservation, message: "Réservation créée ✅" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mettre à jour une réservation
export const updateReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({ success: false, message: "Réservation non trouvée" });
        
        // Sécurité Multi-Site
        if (req.magasinId && reservation.magasin.toString() !== req.magasinId.toString())
            return res.status(403).json({ success: false, message: "Accès interdit" });

        const { unite, startDate, endDate, status, ...rest } = req.body;

        // Vérifier disponibilité si changement d'unité ou de dates
        if ((unite && unite !== reservation.unite?.toString()) || (startDate && startDate !== reservation.startDate) || (endDate && endDate !== reservation.endDate)) {
            const checkUnite = unite || reservation.unite;
            const checkStart = startDate || reservation.startDate;
            const checkEnd = endDate || reservation.endDate;
            if (checkUnite) {
                const available = await isUnitAvailable(checkUnite, checkStart, checkEnd, req.magasinId, reservation._id);
                if (!available) {
                    return res.status(409).json({ success: false, message: "L'unité n'est pas disponible sur cette période" });
                }
            }
        }

        if (status && status !== reservation.status) {
            const now = new Date().toLocaleDateString("fr-FR");
            if (status === "confirmed") reservation.confirmedAt = now;
            else if (status === "cancelled") reservation.cancelledAt = now;
            else if (status === "completed") reservation.completedAt = now;
        }

        Object.assign(reservation, {
            ...rest,
            unite: unite !== undefined ? (unite || null) : reservation.unite,
            startDate: startDate || reservation.startDate,
            endDate: endDate || reservation.endDate,
            status: status || reservation.status,
        });

        await reservation.save();
        res.json({ success: true, data: reservation, message: "Réservation mise à jour ✅" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Convertir une réservation en commande
export const convertToCommande = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({ success: false, message: "Réservation non trouvée" });
        
        // Sécurité Multi-Site
        if (req.magasinId && reservation.magasin.toString() !== req.magasinId.toString())
            return res.status(403).json({ success: false, message: "Accès interdit" });

        if (reservation.status !== "confirmed") {
            return res.status(400).json({ success: false, message: "Seules les réservations confirmées peuvent être converties" });
        }

        // Création de la commande officielle
        const newCommande = new Commande({
            magasin: reservation.magasin,
            client: reservation.client,
            equipement: reservation.equipement,
            unite: reservation.unite || null,
            dateDebut: parseDate(reservation.startDate),
            dateFin: parseDate(reservation.endDate),
            statut: "pending", // En attente de livraison effective
            modePaiement: "cash_magasin",
            montantTTC: reservation.montant,
            note: `Issue de la réservation ${reservation.num}`,
            reservationId: reservation._id,
        });

        await newCommande.save();

        // Mettre à jour le statut de l'unité si spécifiée
        if (reservation.unite) {
            await Unit.findByIdAndUpdate(reservation.unite, {
                statut: "loue",
                commandeActive: newCommande._id,
                clientActuel: reservation.client
            });
        }

        // Mettre à jour la réservation
        reservation.status = "completed";
        reservation.completedAt = new Date().toLocaleDateString("fr-FR");
        await reservation.save();

        res.json({ success: true, data: newCommande, message: "Commande créée avec succès ✅" });
    } catch (error) {
        console.error("Conversion Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Vérifier la disponibilité d'un équipement sur une période (filtré par magasin)
export const checkAvailability = async (req, res) => {
    try {
        const { equipementId, startDate, endDate } = req.query;
        if (!req.magasinId) return res.status(400).json({ success: false, message: "Magasin non identifié" });
        
        if (!equipementId || !startDate || !endDate) {
            return res.status(400).json({ success: false, message: "Paramètres manquants" });
        }

        const unites = await Unit.find({ 
            equipement: equipementId,
            magasin: req.magasinId 
        });

        const disponibilites = [];
        for (const unit of unites) {
            const available = await isUnitAvailable(unit._id, startDate, endDate, req.magasinId);
            disponibilites.push({
                uniteId: unit._id,
                serial: unit.serial,
                available,
            });
        }
        res.json({ success: true, data: disponibilites });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Changer le statut
export const changeReservationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({ success: false, message: "Réservation non trouvée" });
        
        if (req.magasinId && reservation.magasin.toString() !== req.magasinId.toString())
            return res.status(403).json({ success: false, message: "Accès interdit" });

        const now = new Date().toLocaleDateString("fr-FR");
        if (status === "confirmed") reservation.confirmedAt = now;
        else if (status === "cancelled") reservation.cancelledAt = now;
        else if (status === "completed") reservation.completedAt = now;
        
        reservation.status = status;
        await reservation.save();
        res.json({ success: true, data: reservation, message: `Statut mis à jour : ${status}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Supprimer une réservation
export const deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({ success: false, message: "Réservation non trouvée" });
        
        if (req.magasinId && reservation.magasin.toString() !== req.magasinId.toString())
            return res.status(403).json({ success: false, message: "Accès interdit" });
            
        await reservation.deleteOne();
        res.json({ success: true, message: "Réservation supprimée" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};