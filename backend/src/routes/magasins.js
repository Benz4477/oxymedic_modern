import express from "express";
import * as magasinController from "../controllers/magasinController.js";
import { protect,  authorize } from "../middleware/auth.js";
import { requirePermission } from "../middleware/permissionGuard.js";

const router = express.Router();

router.use(protect);

router.get("/", magasinController.getAll);
router.get("/:id", magasinController.getById);

// Seuls les admins globaux peuvent créer/modifier des magasins
router.post("/", authorize("superadmin"), magasinController.create);
router.put("/:id", authorize("superadmin"), magasinController.update);
router.delete("/:id", authorize("superadmin"), magasinController.remove);

export default router;
