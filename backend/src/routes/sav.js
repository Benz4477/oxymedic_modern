// backend/src/routes/sav.js
import express from "express";
import {
    getAllSav,
    getSavById,
    createSav,
    updateSav,
    addSavNote,
    resolveSav,
    deleteSav,
    getSavStats,
    convertToMaintenance} from "../controllers/savController.js";
import { protect,  authorize } from "../middleware/auth.js";
import { requirePermission } from "../middleware/permissionGuard.js";

const router = express.Router();

router.use(protect);

router.get("/stats", authorize("superadmin", "admin", "employe", "commercial", "technicien", "livreur", "caissier"), getSavStats);
router.get("/", authorize("superadmin", "admin", "employe", "commercial", "technicien", "livreur", "caissier"), getAllSav);
router.get("/:id", authorize("superadmin", "admin", "employe", "commercial", "technicien", "livreur", "caissier"), getSavById);
router.post("/", authorize("superadmin", "admin", "employe", "commercial"), createSav);
router.put("/:id", authorize("superadmin", "admin", "employe"), updateSav);
router.post("/:id/notes", authorize("superadmin", "admin", "employe", "technicien"), addSavNote);
router.post("/:id/to-maintenance", authorize("superadmin", "admin", "employe"), convertToMaintenance);
router.put("/:id/resolve", authorize("superadmin", "admin", "employe", "technicien"), resolveSav);
router.delete("/:id", authorize("superadmin", "admin"), deleteSav);

export default router;