'use client'

import Header from '@/components/layoout/Header'
import HeroSection from '@/components/sections/HeroSection'
import LogoCloud from '@/components/sections/LogoCloud'
import TeamSection from '@/components/sections/TeamSection'
import BlogSection from '@/components/sections/BlogSection'
import Footer from '@/components/layoout/Footer'



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
