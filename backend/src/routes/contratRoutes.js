import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getAllContrats,
  getContratById,
  createContrat,
  generatePDF,
  signContrat,
  updateContrat,
  deleteContrat,
  archiveContrat,
} from "../controllers/contratController.js";

const router = express.Router();

// Get all contrats
router.get("/", protect, getAllContrats);

// Generate PDF (DOIT ÊTRE AVANT /:id pour éviter confusion)
router.get("/:id/generate-pdf", protect, generatePDF);

// Get one contrat
router.get("/:id", protect, getContratById);

// Create contrat from commande
router.post("/", protect, createContrat);

// Sign contrat
router.post("/:id/sign", protect, signContrat);

// Update contrat
router.put("/:id", protect, updateContrat);

// Delete contrat
router.delete("/:id", protect, deleteContrat);

// Archive contrat
router.patch("/:id/archive", protect, archiveContrat);

export default router;
