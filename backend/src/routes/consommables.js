import express from "express";
import {
  getAllConsommables,
  getConsommableById,
  createConsommable,
  updateConsommable,
  deleteConsommable,
  getStats} from "../controllers/consommableController.js";
import { protect,  authorize } from "../middleware/auth.js";
import { requirePermission } from "../middleware/permissionGuard.js";

const router = express.Router();

router.use(protect);
router.get("/", authorize("superadmin", "admin", "employe", "caissier"), getAllConsommables);
router.get("/stats", authorize("superadmin", "admin", "employe", "caissier"), getStats);
router.get("/:id", authorize("superadmin", "admin", "employe", "caissier"), getConsommableById);
router.post("/", authorize("superadmin", "admin", "employe"), createConsommable);
router.put("/:id", authorize("superadmin", "admin", "employe"), updateConsommable);
router.delete("/:id", authorize("superadmin", "admin"), deleteConsommable);

export default router;