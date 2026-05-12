import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const checkUserPermissions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔗 Connecté à MongoDB");

    const users = await User.find({});
    console.log(`📊 ${users.length} utilisateurs trouvés`);

    users.forEach((user, index) => {
      console.log(`\n--- Utilisateur ${index + 1}: ${user.username} ---`);
      console.log("Rôle:", user.role);
      console.log("Permissions exists?", !!user.permissions);
      console.log("Permissions type:", typeof user.permissions);
      console.log("Permissions keys:", user.permissions ? Object.keys(user.permissions) : "Aucune");
      
      if (!user.permissions) {
        console.log("❌ Permissions manquantes !");
      } else {
        const perms = Object.entries(user.permissions);
        console.log("Permissions détaillées:");
        perms.forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      }
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
};

checkUserPermissions();
