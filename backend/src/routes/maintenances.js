import express from "express";
import {
  getAllMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getStats,
  addNote,
  closeMaintenance,
} from "../controllers/maintenanceController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.get("/stats", getStats);
router.get("/", getAllMaintenance);
router.get("/:id", getMaintenanceById);
router.post("/", createMaintenance);
router.put("/:id", updateMaintenance);
router.delete("/:id", deleteMaintenance);
router.post("/:id/notes", addNote);
router.put("/:id/close", closeMaintenance);
export default router;
