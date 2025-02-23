import type { NextPage } from 'next'
import Navbar from '@/components/Navbar'


const Home: NextPage = () => {
  return (
    <div className="space-y-8">
      <section className="text-center py-16 bg-yellow-50">
        <h1 className="text-4xl font-bold mb-4 text-black">
          Bienvenue chez GAIA Motion Design
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Votre partenaire de confiance pour tous vos besoins de montage vidéos
        </p>
      </section>
      <Navbar />
    </div>
  )
}

export default Home