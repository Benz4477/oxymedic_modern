import express from "express";
import {
  getAllEquipements,
  getEquipementById,
  createEquipement,
  updateEquipement,
  deleteEquipement,
  toggleArchive,
  uploadEquipementPhoto,
} from "../controllers/equipementController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/",          getAllEquipements);
router.get("/:id",       getEquipementById);
router.post("/",         createEquipement);
router.put("/:id",       updateEquipement);
router.delete("/:id",    deleteEquipement);
router.put("/:id/archive", toggleArchive);
router.post("/:id/photo",  uploadEquipementPhoto);

export default router;