'use client'
import ProgressRing from '@/components/cv/ProgressRing'
import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import type { NextPage } from 'next'

const Tarifs: NextPage = () => {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 mt-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-center text-center">
            <ProgressRing
              size={250}
              strokeWidth={20}
              progress={80}
              primaryColor="green"
              backgroundColor="gray"
              showPercentage={true}
              resetOnHover={true}
              resetDelay={1000}
            />
            <p className="mt-4 text-lg font-semibold">Adobe Première Pro</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <ProgressRing
              size={250}
              strokeWidth={20}
              progress={80}
              primaryColor="green"
              backgroundColor="gray"
              showPercentage={true}
              resetOnHover={true}
              resetDelay={2000}
            />
            <p className="mt-4 text-lg font-semibold">Adobe After Effects</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <ProgressRing
              size={250}
              strokeWidth={20}
              progress={30}
              primaryColor="red"
              backgroundColor="gray"
              showPercentage={true}
              resetOnHover={true}
              resetDelay={3000}
            />
            <p className="mt-4 text-lg font-semibold">Adobe Photoshop</p>
          </div>

             <div className="flex flex-col items-center text-center">
            <ProgressRing
              size={250}
              strokeWidth={20}
              progress={30}
              primaryColor="orange"
              backgroundColor="gray"
              showPercentage={true}
              resetOnHover={true}
              resetDelay={4000}
            />
            <p className="mt-4 text-lg font-semibold">Da Vinci resolve</p>
          </div>

        </div>
      </div>
      <Footer />
    </>
  )
}

export default Tarifs