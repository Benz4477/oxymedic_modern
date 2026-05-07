import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getAllDevis, getDevisById, getDevisStats,
  createDevis, updateDevis, deleteDevis,
  sendDevis, acceptDevis, rejectDevis, convertDevis,
} from "../controllers/devisController.js";

const router = express.Router();

router.get("/stats",      protect, getDevisStats);
router.get("/",           protect, getAllDevis);
router.get("/:id",        protect, getDevisById);
router.post("/",          protect, createDevis);
router.put("/:id",        protect, updateDevis);
router.delete("/:id",     protect, deleteDevis);
router.put("/:id/send",   protect, sendDevis);
router.put("/:id/accept", protect, acceptDevis);
router.put("/:id/reject", protect, rejectDevis);
router.post("/:id/convert", protect, convertDevis);

export default router;