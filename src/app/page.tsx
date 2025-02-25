'use client'

import Header from '@/components/homePage/Header'
import HeroSection from '@/components/homePage/HeroSection'
import LogoCloud from '@/components/homePage/LogoCloud'
import TeamSection from '@/components/homePage/TeamSection'
import BlogSection from '@/components/homePage/BlogSection'
import Footer from '@/components/homePage/Footer'



export default function Home() {

  return (
    <div className="bg-white">
        <Header />

        <HeroSection />

        <LogoCloud />

        <TeamSection />

        <BlogSection />
        
        <Footer />
    </div>
   
  )
}
