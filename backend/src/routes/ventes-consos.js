import express from "express";
import {
  getAllVentes,
  createVente,
  deleteVente} from "../controllers/venteConsommableController.js";
import { protect,  authorize } from "../middleware/auth.js";
import { requirePermission } from "../middleware/permissionGuard.js";

const router = express.Router();

router.use(protect);
router.get("/", authorize("superadmin", "admin", "employe", "caissier"), getAllVentes);
router.post("/", authorize("superadmin", "admin", "employe", "caissier"), createVente);
router.delete("/:id", authorize("superadmin", "admin"), deleteVente);

export default router;