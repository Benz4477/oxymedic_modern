import express from "express";
const router = express.Router();
import {
  getAllUnits,
  getUnitById,
  getUnitsByEquipement,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../controllers/unitController.js";
import { protect } from "../middleware/auth.js";
router.use(protect);

router.get("/", getAllUnits);
router.get("/:id", getUnitById);
router.get("/equipement/:equipId", getUnitsByEquipement);
router.post("/", createUnit);
router.put("/:id", updateUnit);
router.delete("/:id", deleteUnit);
export default router;
