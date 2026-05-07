import mongoose from "mongoose";
import Unit from "../models/Unit.js";
import Equipement from "../models/Equipement.js";

const migrateUnits = async () => {
  try {
    console.log("🔄 Début de la migration des unités...");
    
    // Connexion à la base
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/oxymedic");
    console.log("✅ Connecté à MongoDB");

    // Récupérer toutes les unités
    const units = await Unit.find({});
    console.log(`📊 trouvé ${units.length} unités à migrer`);

    for (const unit of units) {
      // Si l'unité a encore equipId, le migrer vers equipement
      if (unit.equipId && !unit.equipement) {
        // Trouver l'équipement correspondant
        const equip = await Equipement.findOne({ id: unit.equipId });
        
        if (equip) {
          unit.equipement = equip._id;
          // Garder equipId pour compatibilité mais le marquer pour suppression future
          delete unit.equipId;
          await unit.save();
          console.log(`✅ Unité ${unit.serial} migrée vers équipement ${equip.name}`);
        } else {
          console.log(`⚠️ Équipement non trouvé pour unité ${unit.serial} (equipId: ${unit.equipId})`);
        }
      }
    }

    console.log("🎉 Migration terminée !");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error);
    process.exit(1);
  }
};

migrateUnits();
