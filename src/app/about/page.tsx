'use client'

import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import type { NextPage } from 'next'

const About: NextPage = () => {
return (
 <>
      <Header />
      <div className="container text-align  align-center mx-auto px-4 py-8 mt-24">
        <h1 className="text-center">A PROPOS</h1>
        
      </div>
      <Footer />
    </>
  )
}
export default About