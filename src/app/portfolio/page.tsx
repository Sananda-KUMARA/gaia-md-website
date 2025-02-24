import type { NextPage } from 'next'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

import Video from 'next-video';

// Importation des vidéos
import video1 from '../../../videos/video1.mp4';
import video2 from '../../../videos/video2.mp4';
import video3 from '../../../videos/video3.mp4';
import video4 from '../../../videos/video4.mp4';
import video5 from '../../../videos/video5.mp4';
import Header from '@/components/homePage/Header';
import Footer from '@/components/homePage/Footer';

type VideoProject = {
  id: number;
  title: string;
  description: string;
  video: typeof video1;
}

const videoProjects: VideoProject[] = [
  {
    id: 1,
    title: "Projet 1",
    description: "Description du projet 1",
    video: video1
  },
  {
    id: 2,
    title: "Projet 2",
    description: "Description du projet 2",
    video: video2
  },
  {
    id: 3,
    title: "Projet 3",
    description: "Description du projet 3",
    video: video3
  },
  {
    id: 4,
    title: "Projet 4",
    description: "Description du projet 4",
    video: video4
  },
  {
    id: 5,
    title: "Projet 5",
    description: "Description du projet 5",
    video: video5
  }
];

const Portfolio: NextPage = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Notre Portfolio</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative aspect-video">
                <Video
                  src={project.video}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
             
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Portfolio;