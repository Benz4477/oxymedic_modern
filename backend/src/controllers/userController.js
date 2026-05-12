import User from "../models/User.js";
import { DEFAULT_PERMISSIONS } from "../models/User.js";
import { generateToken } from "../middleware/auth.js";

// ── LOGIN ─────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username et mot de passe requis" });
    }
    const user = await User.findOne({ username }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Identifiants incorrects" });
    }
    if (user.status !== "active") {
      return res.status(401).json({ success: false, message: "Compte désactivé" });
    }
    // Mettre à jour lastLogin
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      data: {
        _id:         user._id,
        name:        user.name,
        username:    user.username,
        email:       user.email,
        role:        user.role,
        permissions: user.permissions,
        avatar:      user.avatar,
      },
      message: "Connexion réussie ✅",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET CURRENT USER ──────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET ALL USERS (admin) ─────────────────────────────────
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('+permissions').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── CREATE USER (admin) ───────────────────────────────────
export const createUser = async (req, res) => {
  try {
    const { username, password, name, email, tel, role, permissions } = req.body;

    if (!username || !password || !name) {
      return res.status(400).json({ success: false, message: "Username, mot de passe et nom requis" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Mot de passe minimum 6 caractères" });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ success: false, message: "Ce nom d'utilisateur existe déjà" });
    }

    // Permissions : utiliser celles fournies ou les défauts du rôle
    const defaultPerms = DEFAULT_PERMISSIONS[role] || DEFAULT_PERMISSIONS.employe;
    const finalPerms   = permissions || defaultPerms;

    const user = await User.create({ username, password, name, email: email || "", tel: tel || "", role: role || "employe", permissions: finalPerms });

    const created = await User.findById(user._id); // sans password
    res.status(201).json({ success: true, data: created, message: "Utilisateur créé ✅" });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: "Username déjà utilisé" });
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── UPDATE USER (admin) ───────────────────────────────────
export const updateUser = async (req, res) => {
  try {
    const { password, ...updates } = req.body;

    // Empêcher modification des utilisateurs système
    const existing = await User.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    if (existing.system && req.user.role !== "superadmin" && req.user._id.toString() !== existing._id.toString()) {
      return res.status(403).json({ success: false, message: "Impossible de modifier un utilisateur système" });
    }

    // Si nouveau mot de passe fourni
    if (password) {
      if (password.length < 6) return res.status(400).json({ success: false, message: "Mot de passe minimum 6 caractères" });
      existing.password = password;
      await existing.save(); // déclenche le hook bcrypt
    }

    // Mettre à jour les autres champs
    const updated = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, data: updated, message: "Utilisateur mis à jour ✅" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── DELETE USER (admin) ───────────────────────────────────
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    if (user.system) return res.status(400).json({ success: false, message: "Impossible de supprimer un utilisateur système" });
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "Impossible de supprimer votre propre compte" });
    }
    await user.deleteOne();
    res.json({ success: true, message: "Utilisateur supprimé" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── TOGGLE STATUS (admin) ─────────────────────────────────
export const toggleStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    if (user.system) return res.status(400).json({ success: false, message: "Impossible de désactiver un utilisateur système" });
    user.status = user.status === "active" ? "inactive" : "active";
    await user.save();
    res.json({ success: true, data: user, message: `Utilisateur ${user.status === "active" ? "activé" : "désactivé"}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET ACTIVE USERS (public) ──────────────────────────────
export const getActiveUsers = async (req, res) => {
  try {
    // Retourner seulement les utilisateurs actifs, sans infos sensibles
    const users = await User.find({ status: "active" })
      .select("_id username name role status")
      .sort({ name: 1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET PUBLIC USER (public) ───────────────────────────────
export const getPublicUser = async (req, res) => {
  try {
    // Retourner les infos publiques d'un utilisateur (pour le login)
    const user = await User.findOne({ _id: req.params.id, status: "active" })
      .select("_id username name role status");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GET DEFAULT PERMISSIONS ───────────────────────────────
export const getDefaultPermissions = async (req, res) => {
  res.json({ success: true, data: DEFAULT_PERMISSIONS });
};