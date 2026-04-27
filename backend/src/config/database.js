import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`✅ MongoDB Connecté: ${conn.connection.host}`)
    
    // Création des index si nécessaire
    await createIndexes()
    
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message)
    process.exit(1)
  }
}

const createIndexes = async () => {
  try {
    // Index pour les clients
    await mongoose.connection.db.collection('clients').createIndex({ email: 1 }, { unique: true })
    await mongoose.connection.db.collection('clients').createIndex({ tel: 1 }, { unique: true })
    await mongoose.connection.db.collection('clients').createIndex({ cin: 1 }, { unique: true })
    
    // Index pour les commandes
    await mongoose.connection.db.collection('commandes').createIndex({ ref: 1 }, { unique: true })
    await mongoose.connection.db.collection('commandes').createIndex({ clientId: 1 })
    await mongoose.connection.db.collection('commandes').createIndex({ dateDebut: -1 })
    
    // Index pour les équipements
    await mongoose.connection.db.collection('equipements').createIndex({ reference: 1 }, { unique: true })
    await mongoose.connection.db.collection('equipements').createIndex({ archived: 1 })
    
    console.log('📊 Index créés avec succès')
  } catch (error) {
    console.warn('⚠️ Warning lors de la création des index:', error.message)
  }
}

export default connectDB
