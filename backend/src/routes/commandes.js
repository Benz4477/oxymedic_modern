import express from "express";
import {
  getAllCommandes,
  getCommandeById,
  createCommande,
  updateCommande,
  deleteCommande,
  reconduireCommande,
  updateChecklistRetour,
  updateStatus,
} from "../controllers/commandeController.js";

const router = express.Router();

// Routes CRUD de base
router.get("/", getAllCommandes);
router.get("/:id", getCommandeById);
router.post("/", createCommande);
router.put("/:id", updateCommande);
router.delete("/:id", deleteCommande);

// Routes spécifiques aux fonctionnalités avancées
router.post("/:id/reconduire", reconduireCommande);
router.put("/:id/checklist-retour", updateChecklistRetour);
router.patch("/:id/status", updateStatus);

export default router;
