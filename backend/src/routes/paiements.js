import express from "express";
import {
  getAllPaiements,
  getPaiementById,
  createPaiement,
  updatePaiement,
  confirmerPaiement,
  deletePaiement,
} from "../controllers/paiementController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.get("/",                    getAllPaiements);
router.get("/:id",                 getPaiementById);
router.post("/",                   createPaiement);
router.put("/:id",                 updatePaiement);
router.put("/:id/confirmer",       confirmerPaiement);
router.delete("/:id",              deletePaiement);

export default router;