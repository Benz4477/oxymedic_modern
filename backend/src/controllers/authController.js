import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Entrez votre identifiant et mot de passe",
      });
    }

    // Trouver l'utilisateur avec status='active'
    const user = await User.findOne({
      username: username,
      status: "active",
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Identifiant ou mot de passe incorrect",
      });
    }

    // Vérifier password avec bcrypt (plus sécurisé)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Identifiant ou mot de passe incorrect",
      });
    }

    // Mettre à jour lastLogin
    user.lastLogin = new Date().toLocaleDateString("fr-FR");
    await user.save();

    // Générer un token JWT simple
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "oxymedic-secret-key",
      { expiresIn: "7d" },
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        status: user.status,
        lastLogin: user.lastLogin,
      },
      message: "Connexion réussie",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la connexion",
      error: error.message,
    });
  }
};

const logout = (req, res) => {
  res.json({
    success: true,
    message: "Déconnexion réussie",
  });
};

const getMe = async (req, res) => {
  try {
    // Pour l'instant, retourner l'utilisateur par son id stocké dans le token
    // TODO: Implémenter le système de tokens basé sur l'original
    res.json({
      success: true,
      message: "Utilisateur connecté",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur",
      error: error.message,
    });
  }
};

export { login, logout, getMe };
