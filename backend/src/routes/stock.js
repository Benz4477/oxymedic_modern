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
import {
  uploadEquipementPhoto as uploadMiddleware,
  handleUploadError,
} from "../middleware/equipementUpload.js";

const router = express.Router();

// ── Routes CRUD ──
router.get("/", getAllEquipements);
router.get("/:id", getEquipementById);
router.post("/", createEquipement);
router.put("/:id", updateEquipement);
router.delete("/:id", deleteEquipement);

// ── Route additionnelle ──
router.patch("/:id/toggle-archive", toggleArchive);

// ── Route upload photo ──
router.post(
  "/upload-photo",
  uploadMiddleware,
  handleUploadError,
  uploadEquipementPhoto,
);

export default router;
