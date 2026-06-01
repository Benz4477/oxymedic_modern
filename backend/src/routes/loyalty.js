import express from "express";
import {
    getAllLoyalty,
    getLoyaltyByClient,
    createLoyaltyCard,
    addPoints,
    usePoints,
    deleteLoyaltyCard,
    getLoyaltyStats} from "../controllers/loyaltyController.js";
import { protect,  authorize } from "../middleware/auth.js";
import { requirePermission } from "../middleware/permissionGuard.js";

const router = express.Router();

router.use(protect);

router.get("/stats", authorize("superadmin", "admin", "employe", "commercial"), getLoyaltyStats);
router.get("/", authorize("superadmin", "admin", "employe", "commercial"), getAllLoyalty);
router.get("/client/:clientId", authorize("superadmin", "admin", "employe", "commercial"), getLoyaltyByClient);
router.post("/", authorize("superadmin", "admin"), createLoyaltyCard);
router.post("/points/add", authorize("superadmin", "admin", "employe", "commercial"), addPoints);
router.post("/points/use", authorize("superadmin", "admin", "employe", "commercial"), usePoints);
router.delete("/:id", authorize("superadmin", "admin"), deleteLoyaltyCard);

export default router;