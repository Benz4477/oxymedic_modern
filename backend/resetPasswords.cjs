const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb+srv://oxymedic2026_db_user:akqVcx6yH1OYIwcj@cluster0.inopwum.mongodb.net/Oxymedic_DB?appName=Cluster0')
.then(async () => {
  console.log('✅ Connecté à MongoDB Atlas');
  
  const db = mongoose.connection.db;
  const usersCollection = db.collection('users');
  
  // Lister tous les utilisateurs existants
  const users = await usersCollection.find({}, { projection: { username: 1, name: 1, role: 1, status: 1 } }).toArray();
  
  console.log('\n📋 Utilisateurs existants dans la base :');
  users.forEach(u => {
    console.log(`   - username: "${u.username}" | name: "${u.name}" | role: "${u.role}" | status: "${u.status}"`);
  });
  
  // Réinitialiser les mots de passe
  const newPassword = await bcrypt.hash('Admin@1234', 12);
  
  // Mettre à jour TOUS les utilisateurs avec le nouveau mot de passe
  const result = await usersCollection.updateMany(
    {},
    { $set: { password: newPassword, status: 'active' } }
  );
  
  console.log(`\n✅ ${result.modifiedCount} utilisateur(s) mis à jour`);
  console.log('🔑 Nouveau mot de passe pour TOUS les comptes : Admin@1234');
  console.log('\nVous pouvez maintenant vous connecter avec :');
  users.forEach(u => {
    console.log(`   - Identifiant: "${u.username}" | Mot de passe: Admin@1234`);
  });
  
  process.exit(0);
})
.catch(err => {
  console.error('❌ Erreur :', err.message);
  process.exit(1);
});
