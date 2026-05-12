import dotenv from "dotenv";
import bcrypt from "bcrypt";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const cleanAndSeed = async () => {
  try {
    await connectDB();

    // Supprimer tous les utilisateurs
    await User.deleteMany({});
    console.log("🗑️ Base de données utilisateurs nettoyée");

    // Hasher les mots de passe
    const password = await bcrypt.hash("12345678", 12);

    // Créer les utilisateurs par défaut
    const users = [
      {
        username: "superadmin",
        password,
        role: "superadmin",
        name: "Super Admin OXYMEDIC",
        status: "active",
        system: true,
        lastLogin: new Date(),
      },
      {
        username: "admin",
        password,
        role: "admin",
        name: "Admin OXYMEDIC",
        status: "active",
        system: true,
        lastLogin: new Date(),
      },
      {
        username: "employe",
        password,
        role: "employe",
        name: "Sara Elhachmi",
        status: "active",
        lastLogin: new Date(),
      },
      {
        username: "livreur",
        password,
        role: "livreur",
        name: "Karim Mansouri",
        status: "active",
        lastLogin: new Date(),
      },
      {
        username: "caissier",
        password,
        role: "caissier",
        name: "Imane Berrada",
        status: "active",
        lastLogin: new Date(),
      },
    ];

    await User.insertMany(users);
    console.log("✅ 5 utilisateurs créés avec succès");
    console.log("   - superadmin / 12345678 (🛡️ Super Admin)");
    console.log("   - admin / 12345678 (👑 Administrateur)");
    console.log("   - employe / 12345678 (👤 Employé)");
    console.log("   - livreur / 12345678 (🚚 Livreur)");
    console.log("   - caissier / 12345678 (💰 Caissier)");

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
};

cleanAndSeed();
