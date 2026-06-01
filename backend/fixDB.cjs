const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://oxymedic2026_db_user:akqVcx6yH1OYIwcj@cluster0.inopwum.mongodb.net/Oxymedic_DB?appName=Cluster0').then(async () => {
  const db = mongoose.connection.db;
  
  // Find all categories to create a map of _id (string) -> name
  const categories = await db.collection('categories').find({}).toArray();
  const catMap = {};
  for (const c of categories) {
    catMap[c._id.toString()] = c.name;
  }
  
  // Find all equipments
  const equipements = await db.collection('equipements').find({}).toArray();
  let updatedCount = 0;
  
  for (const eq of equipements) {
    let catStr = eq.cat ? eq.cat.toString().trim() : '';
    
    // Check if it's a 24-char hex string (ObjectId format)
    if (catStr.length === 24 && /^[0-9a-fA-F]{24}$/.test(catStr)) {
      const realName = catMap[catStr] || 'Inconnu';
      console.log('Fixing equipment', eq.name, ':', catStr, '->', realName);
      await db.collection('equipements').updateOne(
        { _id: eq._id },
        { $set: { cat: realName } }
      );
      updatedCount++;
    }
  }
  
  console.log('Fixed', updatedCount, 'equipments.');
  process.exit(0);
});
