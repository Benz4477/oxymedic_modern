import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const cleanIndexes = async () => {
  try {
    await connectDB();
    console.log("Connecté à MongoDB.");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    for (const collInfo of collections) {
      const collName = collInfo.name;
      const collection = db.collection(collName);
      
      try {
        const indexes = await collection.indexes();
        console.log(`\nIndex dans la collection "${collName}":`);
        for (const idx of indexes) {
          console.log(`- Nom: ${idx.name}, Unique: ${!!idx.unique}, Clés: ${JSON.stringify(idx.key)}`);
          
          // Nettoyer l'index 'id_1' s'il existe et est unique
          if (idx.name === "id_1" && idx.unique) {
            console.log(`[ACTION] Suppression de l'index obsolète 'id_1' unique de "${collName}"...`);
            await collection.dropIndex("id_1");
            console.log(`[OK] Index 'id_1' supprimé de "${collName}".`);
          }
        }
      } catch (err) {
        console.error(`Erreur d'analyse des index pour "${collName}":`, err.message);
      }
    }

    console.log("\nNettoyage des index terminé !");
    process.exit(0);
  } catch (error) {
    console.error("Erreur de nettoyage des index:", error);
    process.exit(1);
  }
};

cleanIndexes();
