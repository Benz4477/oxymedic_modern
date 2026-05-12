import express from "express";
import { protect, adminOnly, superAdminOnly } from "../middleware/auth.js";
import {
  login, getMe, getAllUsers, createUser,
  updateUser, deleteUser, toggleStatus, getDefaultPermissions,
  getActiveUsers, getPublicUser,
} from "../controllers/userController.js";

const router = express.Router();

// Public
router.post("/login", login);
router.get("/active", getActiveUsers); // Pour la sélection d'utilisateur (sans infos sensibles)
router.get("/:id", getPublicUser); // Pour le login (infos publiques uniquement)

// Protégé
router.get("/me",                 protect, getMe);
router.get("/default-permissions",protect, adminOnly, getDefaultPermissions);
router.get("/protected-active", protect, async (req, res) => {
  try {
    const users = await User.find({ status: "active" }).select("name role avatar");
    res.json({ success: true, data: users });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Admin seulement (lecture + modification)
router.get("/",                   protect, adminOnly, getAllUsers);
router.get("/default-permissions",protect, adminOnly, getDefaultPermissions);
router.put("/:id",                protect, adminOnly, updateUser);

// Super Admin seulement (création/suppression)
router.post("/",                  protect, superAdminOnly, createUser);
router.delete("/:id",             protect, superAdminOnly, deleteUser);
router.put("/:id/toggle-status",  protect, superAdminOnly, toggleStatus);

export default router;