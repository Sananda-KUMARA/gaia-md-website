'use client'

import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import type { NextPage } from 'next'

const Price: NextPage = () => {
  return (
 <>
      <Header />
      <div className="container align-center mx-auto px-4 py-8 mt-24">
        <p>🎬 Grille Tarifaire - Montage Vidéo  </p>

         <p>🔹 Des prestations sur mesure adaptées à vos besoins !</p>
        <p>📌 Tarifs à l’heure</p> 
        <p>💼 Idéal pour les petites retouches ou montages courts</p> 

        <p> Montage standard : XX €/h</p>    
        <p> Effets spéciaux / Motion design : XX €/h</p>    
         <p> Correction colorimétrique avancée : XX €/h</p>   

        <p>📌 Forfaits par projet (Prix indicatifs, ajustables selon les besoins)</p> 
       <p> Type de projet  Tarif de base</p> 
       <p>🎥 Montage simple (1-3 min)  XX €</p>  
       <p>  🏢 Vidéo corporate (3-5 min)  XX €</p>
        <p> 🎶 Clip musical (2-5 min)  XX €</p>
        <p> 🎞 Court-métrage (5-20 min)  XX €</p>
        <p>📺 Publicité (15-60 sec)  XX €</p> 
       <p> 📌 Services complémentaires</p> 

        <p> 🎨 Correction colorimétrique avancée → +XX € </p>   
        <p> 🔊 Mixage et optimisation audio → +XX €</p>    
         <p>🕹 Animation / Motion design → Sur devis</p>    
          <p> ⏳ Livraison express → +XX % du prix total</p>  

        <p>💡 Besoin d’un devis personnalisé ? Contactez-moi </p> 
        
      </div>
      <Footer />
    </>
  )
}

export default Price