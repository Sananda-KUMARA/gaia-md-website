'use client';
import type { NextPage } from 'next';
import Navbar from '../components/Navbar';
import  Video  from 'next-video';

const Home: NextPage = () => {
  return (
    <div className="space-y-8">
      <Navbar />
      <section className="text-center py-16 bg-yellow-50">
        <h1 className="text-4xl font-bold mb-4 text-black">
          Bienvenue chez GAIA Motion Design
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Votre partenaire de confiance pour tous vos besoins de montage vidéos
        </p>
      </section>
      
      <div className="max-w-4xl mx-auto px-4">
        <Video 
          src="/videos/my-video.mp4"
          controls
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default Home;