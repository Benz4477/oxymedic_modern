import express from "express";
import { protect,  authorize } from "../middleware/auth.js";
import { requirePermission } from "../middleware/permissionGuard.js";
import { 
    getAllTransferts, 
    createTransfert, 
    updateTransfertStatus 
} from "../controllers/transfertController.js";

const router = express.Router();

router.use(protect); // Toutes les routes de transfert sont protégées

router.get("/", getAllTransferts);
router.post("/", authorize("superadmin", "admin", "employe", "technicien"), createTransfert);
router.put("/:id/status", authorize("superadmin", "admin", "employe", "technicien"), updateTransfertStatus);

export default router;
