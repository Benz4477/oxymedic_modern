import dotenv from "dotenv";
import connectDB from "../config/db.js";
import mongoose from "mongoose";

dotenv.config();

const fixIndex = async () => {
  try {
    await connectDB();
    
    // Supprimer l'index problématique sur le champ id
    await mongoose.connection.db.collection('users').dropIndex('id_1');
    console.log("✅ Index 'id_1' supprimé");
    
    // Vérifier les indexes restants
    const indexes = await mongoose.connection.db.collection('users').listIndexes().toArray();
    console.log("📋 Indexes restants:", indexes.map(i => i.name));
    
    process.exit(0);
  } catch (error) {
    if (error.code === 27) {
      console.log("ℹ️ L'index 'id_1' n'existe pas déjà");
    } else {
      console.error("❌ Erreur:", error);
    }
    process.exit(0);
  }
};

fixIndex();
