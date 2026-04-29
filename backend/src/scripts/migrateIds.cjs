// backend/src/scripts/migrateIds.cjs
// Script de migration pour ajouter les IDs numériques aux collections existantes

const mongoose = require('mongoose');
require('dotenv').config();

// Importer les modèles avec dynamic import pour ES6
const importModels = async () => {
  const { default: Client } = await import('../models/Client.js');
  const { default: Equipement } = await import('../models/Equipement.js');
  const { default: Unit } = await import('../models/Unit.js');
  return { Client, Equipement, Unit };
};

const migrateData = async () => {
  try {
    console.log('🔄 Début de la migration des IDs numériques...');
    
    // Connexion à la base de données
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/oxymedic');
    console.log('✅ Connecté à MongoDB');

    // Importer les modèles
    const { Client, Equipement, Unit } = await importModels();

    // Migration des Clients
    console.log('\n📋 Migration des Clients...');
    const clients = await Client.find({ id: { $exists: false } });
    console.log(`Trouvé ${clients.length} clients sans ID numérique`);
    
    // Générer les IDs manuellement si la méthode getNextId n'existe pas
    let maxClientId = 0;
    const existingClients = await Client.find({ id: { $exists: true } });
    if (existingClients.length > 0) {
      maxClientId = Math.max(...existingClients.map(c => c.id || 0));
    }
    
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      const nextId = maxClientId + i + 1;
      client.id = nextId;
      await client.save();
      console.log(`Client ${client.prenom} ${client.nom} -> ID: ${nextId}`);
    }

    // Migration des Équipements
    console.log('\n🔧 Migration des Équipements...');
    const equipements = await Equipement.find({ id: { $exists: false } });
    console.log(`Trouvé ${equipements.length} équipements sans ID numérique`);
    
    // Générer les IDs manuellement pour les équipements aussi
    let maxEquipId = 0;
    const existingEquips = await Equipement.find({ id: { $exists: true } });
    if (existingEquips.length > 0) {
      maxEquipId = Math.max(...existingEquips.map(e => e.id || 0));
    }
    
    for (let i = 0; i < equipements.length; i++) {
      const equip = equipements[i];
      const nextId = maxEquipId + i + 1;
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
migrateData();
