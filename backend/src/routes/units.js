import express from "express";
const router = express.Router();
import {
  getAllUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../controllers/unitController.js";
router.get("/", getAllUnits);
router.get("/:id", getUnitById);
router.post("/", createUnit);
router.put("/:id", updateUnit);
router.delete("/:id", deleteUnit);
export default router;
