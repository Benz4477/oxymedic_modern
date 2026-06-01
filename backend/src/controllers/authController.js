import User from "../models/User.js";
import Magasin from "../models/Magasin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Entrez votre identifiant et mot de passe",
      });
    }

    // Trouver l'utilisateur avec status='active' (par email ou username) et peupler le magasin
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }],
      status: "active",
    }).populate("magasin").select("+password");

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
    user.lastLogin = new Date();
    await user.save();

    // Générer un token JWT avec expiration courte (1 heure)
    const userAgent = req.headers["user-agent"] || "";
    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username, 
        role: user.role,
        magasinId: user.magasin?._id || null, // null = superadmin
        userAgent: userAgent.substring(0, 100) // Stocker user-agent pour binding
      },
      process.env.JWT_SECRET || "oxymedic-secret-key",
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    res.json({
      success: true,
      token,
      data: {
        _id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        status: user.status,
        magasin: user.magasin, // Objet Magasin complet pour le profil
        lastLogin: user.lastLogin,
        permissions: user.permissions,
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
    const user = await User.findById(req.user._id).populate("magasin").select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.json({
      success: true,
      data: user,
      message: "Utilisateur connecté récupéré avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des données",
      error: error.message,
    });
  }
};

export { login, logout, getMe };
