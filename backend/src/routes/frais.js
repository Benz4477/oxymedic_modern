import express from "express";
const router = express.Router();
import {
  getAllFrais,
  getFraisById,
  createFrais,
  updateFrais,
  deleteFrais,
} from "../controllers/fraisController.js";
import { protect } from "../middleware/auth.js";

router.use(protect);

router.get("/", getAllFrais);
router.get("/:id", getFraisById);
router.post("/", createFrais);
router.put("/:id", updateFrais);
router.delete("/:id", deleteFrais);

export default router;
