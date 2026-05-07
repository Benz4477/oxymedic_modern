import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getAllFactures,
  getFactureById,
  createFacture,
  updateFacture,
  deleteFacture,
  markAsPaid,
  archiveFacture,
  getNextNumero,
  getFactureStats,
} from "../controllers/factureController.js";

const router = express.Router();

router.use(protect);

router.get("/stats",              getFactureStats);
router.get("/next-number/:type",  getNextNumero);
router.get("/",                   getAllFactures);
router.get("/:id",                getFactureById);
router.post("/",                  createFacture);
router.put("/:id",                updateFacture);
router.delete("/:id",             deleteFacture);
router.post("/:id/pay",           markAsPaid);
router.post("/:id/archive",       archiveFacture);

export default router;