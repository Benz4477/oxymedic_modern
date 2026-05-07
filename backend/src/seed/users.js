import dotenv from "dotenv";
import bcrypt from "bcrypt";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const seedUsers = async () => {
  try {
    await connectDB();

    // Supprimer les utilisateurs existants (optionnel)
    await User.deleteMany({});
    console.log("🗑️ Utilisateurs existants supprimés");

    // Hasher les mots de passe manuellement pour insertMany
    const password = await bcrypt.hash("12345678", 12);

    // Créer les utilisateurs par défaut
    const users = [
      {
        id: 1,
        username: "admin",
        password,
        role: "admin",
        name: "Admin OXYMEDIC",
        status: "active",
        system: true,
        lastLogin: new Date().toLocaleDateString("fr-FR"),
      },
      {
        id: 2,
        username: "employe",
        password,
        role: "employe",
        name: "Sara Elhachmi",
        status: "active",
        lastLogin: "18/03/2025",
      },
      {
        id: 3,
        username: "livreur",
        password,
        role: "livreur",
        name: "Karim Mansouri",
        status: "active",
        lastLogin: "19/03/2025",
      },
      {
        id: 4,
        username: "caissier",
        password,
        role: "caissier",
        name: "Imane Berrada",
        status: "active",
        lastLogin: "19/03/2025",
      },
    ];

    await User.insertMany(users);
    console.log("✅ 4 utilisateurs créés avec succès");
    console.log("   - admin / 1234 (Administrateur)");
    console.log("   - employe / 1234 (Employé)");
    console.log("   - livreur / 1234 (Livreur)");
    console.log("   - caissier / 1234 (Caissier)");

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du seeding:", error);
    process.exit(1);
  }
};

seedUsers();
