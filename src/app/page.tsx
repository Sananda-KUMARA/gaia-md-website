'use client'

import Header from '@/components/layout/Header'
import HeroSection from '@/components/sections/HeroSection'
import LogoCloud from '@/components/sections/LogoCloud'
import TeamSection from '@/components/sections/TeamSection'
import BlogSection from '@/components/sections/BlogSection'
import Footer from '@/components/layout/Footer'



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
