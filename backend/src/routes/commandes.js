import express from "express";
import {
  getAllCommandes,
  getCommandeById,
  createCommande,
  updateCommande,
  deleteCommande,
  updateStatut,
  reconduireCommande,
} from "../controllers/commandeController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/",                      getAllCommandes);
router.get("/:id",                   getCommandeById);
router.post("/",                     createCommande);
router.put("/:id",                   updateCommande);
router.delete("/:id",                deleteCommande);
router.put("/:id/statut",            updateStatut);
router.post("/:id/reconduire",       reconduireCommande);

export default router;