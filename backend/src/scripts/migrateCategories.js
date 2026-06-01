import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Category from "../models/Category.js";
import connectDB from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const migrate = async () => {
  try {
    await connectDB();
    console.log("Connecté à MongoDB.");

    // Récupérer la collection brute pour éviter le casting Mongoose de 'cat' (qui est déjà en type ObjectId dans le modèle)
    const db = mongoose.connection.db;
    const equipementsColl = db.collection("equipements");
    const equipements = await equipementsColl.find({}).toArray();
    const categories = await Category.find({});

    console.log(`Analyse brute de ${equipements.length} équipements et ${categories.length} catégories.`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const eq of equipements) {
      const currentCatVal = eq.cat;

      // Si c'est déjà un ObjectId valide de 24 caractères, on saute
      if (currentCatVal && mongoose.Types.ObjectId.isValid(currentCatVal) && String(currentCatVal).length === 24) {
        skipped++;
        continue;
      }

      if (!currentCatVal) {
        console.warn(`[WARN] Équipement "${eq.name}" n'a pas de champ 'cat'.`);
        errors++;
        continue;
      }

      // Trouver la catégorie par nom (comparaison insensible à la casse et sans accents/espaces)
      const catMatch = categories.find((c) => {
        if (!c.name) return false;
        return c.name.trim().toLowerCase() === String(currentCatVal).trim().toLowerCase();
      });

      if (catMatch) {
        // Mettre à jour avec l'ObjectId de la catégorie de façon brute
        await equipementsColl.updateOne(
          { _id: eq._id },
          { $set: { cat: catMatch._id } }
        );
        console.log(`[OK] Équipement "${eq.name}" mis à jour: "${currentCatVal}" -> ${catMatch._id} (${catMatch.name})`);
        updated++;
      } else {
        console.warn(`[WARN] Catégorie introuvable pour l'équipement "${eq.name}": "${currentCatVal}"`);
        errors++;
      }
    }

    console.log(`Migration terminée ! ${updated} mis à jour, ${skipped} déjà convertis, ${errors} erreurs.`);
    process.exit(0);
  } catch (error) {
    console.error("Erreur de migration:", error);
    process.exit(1);
  }
};

migrate();
