// seed-videos.js
const mongoose = require('mongoose');
require('dotenv').config();

// IMPORTANT: Définissez votre URI MongoDB ici si la variable d'environnement n'est pas définie
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lefevreflorent:OUIqFWiUflIsEUSa@cluster0.lu22j.mongodb.net/gaia?retryWrites=true&w=majority';

console.log('Tentative de connexion à MongoDB...');
console.log('URI MongoDB:', MONGODB_URI);

// Connecter à MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => {
    console.error('Erreur de connexion à MongoDB:', err);
    process.exit(1);
  });

// Le reste du code reste identique...

// Schéma et modèle
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  client: { type: String },
  duration: { type: String },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Video = mongoose.model('Video', videoSchema);

// Données de test
const testVideos = [
  {
    title: "Film documentaire sur Paris",
    description: "Un documentaire explorant les quartiers historiques de Paris",
    category: "Documentaire",
    videoUrl: "https://www.youtube.com/watch?v=example1",
    thumbnailUrl: "https://via.placeholder.com/320x180?text=Paris+Documentaire",
    client: "Office du Tourisme",
    duration: "18:24",
    active: true
  },
  {
    title: "Spot publicitaire - Nouveau Parfum",
    description: "Publicité pour le lancement d'un nouveau parfum de luxe",
    category: "Commercial",
    videoUrl: "https://www.youtube.com/watch?v=example2",
    thumbnailUrl: "https://via.placeholder.com/320x180?text=Parfum+Pub",
    client: "Maison de Parfums",
    duration: "0:45",
    active: true
  },
  {
    title: "Court-métrage 'Le Matin'",
    description: "Un court-métrage poétique sur les premières heures du jour",
    category: "Court-métrage",
    videoUrl: "https://www.youtube.com/watch?v=example3",
    thumbnailUrl: "https://via.placeholder.com/320x180?text=Le+Matin",
    duration: "12:05",
    active: true
  },
  {
    title: "Captation Festival de Musique",
    description: "Couverture du festival de musique de l'été dernier",
    category: "Event",
    videoUrl: "https://www.youtube.com/watch?v=example4",
    thumbnailUrl: "https://via.placeholder.com/320x180?text=Festival+Musique",
    client: "Festival Mélodie",
    duration: "120:00",
    active: true
  },
  {
    title: "Vidéo Explicative - Nouvelle Application",
    description: "Présentation des fonctionnalités d'une application mobile",
    category: "Commercial",
    videoUrl: "https://www.youtube.com/watch?v=example5",
    thumbnailUrl: "https://via.placeholder.com/320x180?text=App+Demo",
    client: "TechStartup Inc.",
    duration: "3:15",
    active: true
  }
];

// Fonction pour insérer les données
async function seedDatabase() {
  try {
    // Supprimer les données existantes
    const deleteResult = await Video.deleteMany({});
    console.log(`Anciennes vidéos supprimées: ${deleteResult.deletedCount} document(s)`);
    
    // Insérer les nouvelles vidéos
    const result = await Video.insertMany(testVideos);
    console.log(`${result.length} vidéos ajoutées avec succès`);
    
    // Afficher les IDs des documents insérés
    result.forEach((video, index) => {
      console.log(`${index + 1}. ${video.title} - ID: ${video._id}`);
    });
  } catch (error) {
    console.error('Erreur lors de l\'insertion des vidéos:', error);
  } finally {
    // Fermer la connexion
    mongoose.connection.close();
    console.log('Déconnecté de MongoDB');
  }
}

// Exécuter le script
seedDatabase().catch(err => {
  console.error('Une erreur non gérée s\'est produite:', err);
  process.exit(1);
});