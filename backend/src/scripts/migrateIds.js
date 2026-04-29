// backend/src/scripts/migrateIds.js
// Script de migration pour ajouter les IDs numériques aux collections existantes

import mongoose from 'mongoose';
import Client from '../models/Client.js';
import Equipement from '../models/Equipement.js';
import Unit from '../models/Unit.js';
import dotenv from 'dotenv';

dotenv.config();

const migrateData = async () => {
  try {
    console.log('🔄 Début de la migration des IDs numériques...');
    
    // Connexion à la base de données
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/oxymedic');
    console.log('✅ Connecté à MongoDB');

    // Migration des Clients
    console.log('\n📋 Migration des Clients...');
    const clients = await Client.find({ id: { $exists: false } });
    console.log(`Trouvé ${clients.length} clients sans ID numérique`);
    
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      const nextId = await Client.getNextId();
      client.id = nextId;
      await client.save();
      console.log(`Client ${client.prenom} ${client.nom} -> ID: ${nextId}`);
    }

    // Migration des Équipements
    console.log('\n🔧 Migration des Équipements...');
    const equipements = await Equipement.find({ id: { $exists: false } });
    console.log(`Trouvé ${equipements.length} équipements sans ID numérique`);
    
    for (let i = 0; i < equipements.length; i++) {
      const equip = equipements[i];
      const nextId = await Equipement.getNextId();
      equip.id = nextId;
      // Ajouter l'icône par défaut si manquant
      if (!equip.icon) {
        equip.icon = "📦";
      }
      await equip.save();
      console.log(`Équipement ${equip.name} -> ID: ${nextId}`);
    }

    // Migration des Units (mettre à jour les equipId si nécessaire)
    console.log('\n📦 Migration des Units...');
    const units = await Unit.find({});
    console.log(`Trouvé ${units.length} unités à vérifier`);
    
    for (const unit of units) {
      // Si equipId est un ObjectId, le convertir en nombre
      if (typeof unit.equipId === 'object' && unit.equipId._id) {
        // Chercher l'équipement correspondant pour récupérer son ID numérique
        const equip = await Equipement.findById(unit.equipId);
        if (equip && equip.id) {
          unit.equipId = equip.id;
          await unit.save();
          console.log(`Unit ${unit.serial} -> equipId: ${equip.id}`);
        }
      }
    }

    console.log('\n🎉 Migration terminée avec succès !');
    
    // Statistiques finales
    const clientCount = await Client.countDocuments();
    const equipCount = await Equipement.countDocuments();
    const unitCount = await Unit.countDocuments();
    
    console.log('\n📊 Statistiques finales:');
    console.log(`- Clients: ${clientCount}`);
    console.log(`- Équipements: ${equipCount}`);
    console.log(`- Units: ${unitCount}`);

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
};

// Exécuter la migration
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateData();
}

export default migrateData;
