import express from "express";
import {
  getAllPermissions,
  getPermissionByModule,
  createPermission,
  updatePermission,
  deletePermission,
} from "../controllers/permissionController.js";

const router = express.Router();
router.get("/", getAllPermissions);
router.get("/:module", getPermissionByModule);
router.post("/", createPermission);
router.put("/:module", updatePermission);
router.delete("/:module", deletePermission);
export default router;
