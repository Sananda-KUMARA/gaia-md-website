'use client';
import type { NextPage } from 'next';
import Navbar from '../components/Navbar';
import Video from 'next-video';
import myVideo from '../../videos/video1.mp4';

const Home: NextPage = () => {
  return (
    <div className="gaia-container">
      <Navbar />
      <section className="py-16">
        <h1 className="gaia-title">
          Bienvenue chez GAIA Motion Design
        </h1>
        <p className="gaia-text text-center max-w-2xl mx-auto mt-4">
          Votre partenaire de confiance pour tous vos besoins de montage vidéos
        </p>
      </section>
     
      <div className="max-w-4xl mx-auto">
        <Video
          src={myVideo}
          controls
          className="w-full rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default Home;