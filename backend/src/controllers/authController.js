import User from "../models/User.js";

import Magasin from "../models/Magasin.js";
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



    // Trouver tous les utilisateurs correspondants (pour gérer les emails en double)
    const users = await User.find({
      $or: [{ username: username }, { email: username }],
      status: "active",
    }).select("+password");

    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Identifiant ou mot de passe incorrect",
      });
    }

    // Vérifier password avec bcrypt pour trouver le bon compte parmi ceux retournés
    let matchedUser = null;
    for (const u of users) {
      const isMatch = await bcrypt.compare(password, u.password);
      if (isMatch) {
        matchedUser = u;
        break;
      }
    }

    if (!matchedUser) {
      return res.status(401).json({
        success: false,
        message: "Identifiant ou mot de passe incorrect",
      });
    }

    const user = matchedUser;

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

        userAgent: userAgent.substring(0, 100) // Stocker user-agent pour binding

      },

      process.env.JWT_SECRET || "oxymedic-secret-key",

      { expiresIn: "1h" },

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

