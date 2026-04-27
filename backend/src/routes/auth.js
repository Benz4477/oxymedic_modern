import express from "express";
import { body } from "express-validator";
import { login, logout, getMe } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

// POST /api/auth/login - Connexion utilisateur (correspond à doLogin du code original)
router.post(
  "/login",
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("L'identifiant est requis")
      .isLength({ min: 3, max: 50 })
      .withMessage("L'identifiant doit contenir entre 3 et 50 caractères")
      .escape(),
    body("password")
      .notEmpty()
      .withMessage("Le mot de passe est requis")
      .isLength({ min: 4 })
      .withMessage("Le mot de passe doit contenir au moins 4 caractères"),
    validate,
  ],
  login,
);

// POST /api/auth/logout - Déconnexion utilisateur
router.post("/logout", logout);

// GET /api/auth/me - Obtenir l'utilisateur connecté
router.get("/me", getMe);

export default router;
