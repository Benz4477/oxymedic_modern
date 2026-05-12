import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import { DEFAULT_PERMISSIONS } from "../models/User.js";

dotenv.config();

const updateExistingUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🔗 Connecté à MongoDB");

    const users = await User.find({});
    console.log(`📊 ${users.length} utilisateurs trouvés`);

    let updated = 0;
    for (const user of users) {
      const defaultPerms = DEFAULT_PERMISSIONS[user.role] || DEFAULT_PERMISSIONS.employe;
      let hasChanges = false;

      // Vérifier chaque permission
      Object.keys(defaultPerms).forEach(key => {
        if (user.permissions[key] === undefined) {
          user.permissions[key] = defaultPerms[key];
          hasChanges = true;
        }
      });

      if (hasChanges) {
        await user.save();
        updated++;
        console.log(`✅ ${user.username} - permissions mises à jour`);
      }
    }

    console.log(`\n🎉 ${updated} utilisateurs mis à jour sur ${users.length} total`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
};

updateExistingUsers();
