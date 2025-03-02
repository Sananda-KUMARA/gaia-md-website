'use client'
import ProgressRing from '@/components/cv/ProgressRing'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import type { NextPage } from 'next'

const Tarifs: NextPage = () => {
  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <ProgressRing
            size={80}
            strokeWidth={20}
            primaryColor="green"
            backgroundColor="gray"
          />
          <p className="mt-4 text-xl">After Effects</p>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Tarifs