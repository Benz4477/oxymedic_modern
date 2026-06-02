import express from "express";
import {
  getAllPermissions,
  getPermissionByModule,
  createPermission,
  updatePermission,
  deletePermission,
} from "../controllers/permissionController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

router.get("/", getAllPermissions);
router.get("/:module", getPermissionByModule);
router.post("/", createPermission);
router.put("/:module", updatePermission);
router.delete("/:module", deletePermission);
export default router;
