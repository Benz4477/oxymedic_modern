import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getAllInteractions, createInteraction, deleteInteraction,
  getAllTaches, createTache, toggleTache, deleteTache,
  getSegments, getCrmStats,
} from "../controllers/crmController.js";

const router = express.Router();

// Stats
router.get("/stats",               protect, getCrmStats);

// Interactions
router.get("/interactions",        protect, getAllInteractions);
router.post("/interactions",       protect, createInteraction);
router.delete("/interactions/:id", protect, deleteInteraction);

// Tâches
router.get("/taches",              protect, getAllTaches);
router.post("/taches",             protect, createTache);
router.put("/taches/:id/toggle",   protect, toggleTache);
router.delete("/taches/:id",       protect, deleteTache);

// Segments
router.get("/segments",            protect, getSegments);

export default router;