'use client'
import Header from '@/components/layout/Header'
import HeroSection from '@/components/sections/HeroSection'
import LogoCloud from '@/components/sections/LogoCloud'
import TeamSection from '@/components/sections/TeamSection'
import BlogSection from '@/components/sections/BlogSection'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Conteneur de la vidéo en position fixe pour couvrir toute la fenêtre */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full"
          style={{
            objectFit: 'fill',
            width: '100%',
            height: '100%'
          }}
        >
          <source src="/test_wallpaper_animated.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay optionnel pour améliorer la lisibilité du contenu */}
        <div className="Overlay absolute inset-0 bg-black bg-opacity-40"></div>
      </div>
     
      {/* Contenu de la page qui peut défiler normalement */}
      <div className="relative">
        <Header />
        <HeroSection />
        {/* <LogoCloud />   LOGO des partenaires commerciaux et clients qui nous ont fait confiance ...*/}
        <TeamSection />
        <BlogSection />
        <Footer />
      </div>
    </div>
  )
}