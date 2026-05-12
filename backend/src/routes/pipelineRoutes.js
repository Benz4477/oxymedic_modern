import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getAllOpportunites, getStages, createOpportunite,
  updateOpportunite, moveOpportunite, advanceOpportunite,
  deleteOpportunite,
} from "../controllers/pipelineController.js";

const router = express.Router();

router.get("/",              protect, getAllOpportunites);
router.get("/stages",        protect, getStages);
router.post("/",             protect, createOpportunite);
router.put("/:id",           protect, updateOpportunite);
router.put("/:id/move",      protect, moveOpportunite);
router.put("/:id/advance",   protect, advanceOpportunite);
router.delete("/:id",        protect, deleteOpportunite);

export default router;