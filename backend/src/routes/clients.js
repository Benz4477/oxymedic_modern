import express from "express";
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  addDocument,
} from "../controllers/clientController.js";
import { uploadSingle, handleUploadError } from "../middleware/upload.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

// Routes principales pour les clients
router.get("/", getAllClients);
router.get("/:id", getClientById);
router.post("/", createClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

// Routes pour les documents
router.post(
  "/:id/documents",
  uploadSingle("document"),
  handleUploadError,
  addDocument,
);

export default router;
