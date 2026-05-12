import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const cleanupUsers = async () => {
  try {
    await connectDB();
    
    // Supprimer le champ id de tous les utilisateurs
    const result = await User.updateMany(
      {},
      { $unset: { id: "" } }
    );
    
    console.log(`✅ ${result.modifiedCount} utilisateurs nettoyés (champ id supprimé)`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors du nettoyage:", error);
    process.exit(1);
  }
};

cleanupUsers();
