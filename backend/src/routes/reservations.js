import express from "express";
import {
    getAllReservations,
    getReservationById,
    createReservation,
    updateReservation,
    changeReservationStatus,
    deleteReservation,
    convertToCommande,
    checkAvailability} from "../controllers/reservationController.js";
import { protect,  authorize } from "../middleware/auth.js";
import { requirePermission } from "../middleware/permissionGuard.js";

const router = express.Router();

// ─── MIDDLEWARE GLOBAL ───────────────────────────────────────────────────────
// Toutes les routes de réservation nécessitent une authentification et un magasinId
router.use(protect);

// ─── ROUTES DE CONSULTATION ──────────────────────────────────────────────────
// Vérifier la disponibilité d'un équipement
router.get("/check-availability", authorize("superadmin", "admin", "employe", "commercial", "caissier", "comptable", "technicien"), checkAvailability);

// Liste de toutes les réservations du magasin
router.get("/", authorize("superadmin", "admin", "employe", "commercial", "caissier", "comptable", "technicien"), getAllReservations);

// Détails d'une réservation spécifique
router.get("/:id", authorize("superadmin", "admin", "employe", "commercial", "caissier", "comptable", "technicien"), getReservationById);

// ─── ROUTES DE GESTION ──────────────────────────────────────────────────────
// Créer une nouvelle réservation
router.post("/", authorize("superadmin", "admin", "employe", "commercial", "caissier", "comptable", "technicien"), createReservation);

// Modifier une réservation existante
router.put("/:id", authorize("superadmin", "admin", "employe", "commercial", "caissier", "comptable", "technicien"), updateReservation);

// Changer le statut (Confirmée, Annulée, etc.)
router.put("/:id/status", authorize("superadmin", "admin", "employe", "commercial", "caissier", "comptable", "technicien"), changeReservationStatus);

// Convertir une réservation en commande réelle
router.post("/:id/convert", authorize("superadmin", "admin", "employe", "commercial", "caissier", "comptable", "technicien"), convertToCommande);

// ─── ADMINISTRATION ──────────────────────────────────────────────────────────
// Supprimer une réservation (réservé aux administrateurs)
router.delete("/:id", authorize("superadmin", "admin"), deleteReservation);

export default router;