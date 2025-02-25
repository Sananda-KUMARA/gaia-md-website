const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function createAdminUser() {
  // Utilisez l'URI de votre cluster MongoDB Atlas
  const uri = process.env.MONGODB_URI || "mongodb+srv://lefevreflorent:OUIqFWiUflIsEUSa@cluster0.lu22j.mongodb.net/gaia?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connecté à MongoDB Atlas");

    const database = client.db(); // Le nom de la base est généralement spécifié dans l'URI
    const users = database.collection('users');

    // Vérifier si l'admin existe déjà
    const existingUser = await users.findOne({ email: 'admin@votredomaine.com' });
    
    if (existingUser) {
      console.log('L\'utilisateur admin existe déjà');
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('MotDePasseSecurise', 10);
    
    // Créer l'utilisateur admin
    const result = await users.insertOne({
      name: "Admin",
      email: "admin@admin.fr",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log(`Utilisateur admin créé avec l'ID: ${result.insertedId}`);
  } catch (error) {
    console.error("Erreur:", error);
  } finally {
    await client.close();
  }
}

createAdminUser();