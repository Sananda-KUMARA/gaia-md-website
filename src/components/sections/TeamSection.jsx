'use client'

import Carousel from "../ui/Caroussel"

const team = [
    {
      name: 'Ghilas MADOURI',
      imageUrl:  '/photos/ghilas_profile2.jpg',
      role: 'Co-Fondateur / Motion Designer & Monteur Vidéo',
    },
    {
      name: 'Florent LEFEVRE',
      role: 'Co-Fondateur / Créateur numérique &Ingénieur informaticien',
      imageUrl:
        '/photos/florent_profile.jpg',
    }
  ]

export default function TeamSection() {
    return (
<>

<Carousel />

<div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-48 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-semibold tracking-tight text-pretty text-blue-600 sm:text-5xl">Notre équipe</h2>
            <p className="mt-6 text-lg/8 text-gray-600">
             Nous sommes deux passionnés dans le domaine du motion design. Nous avons décidé de nous lancer dans l&lsquo;aventure de l&lsquo;entrepreneuriat pour partager notre passion avec le monde entier.
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-16 text-center sm:grid-cols-3 md:grid-cols-4 lg:mx-0 lg:max-w-none lg:grid-cols-5 xl:grid-cols-6"
          >
            {team.map((person) => (
              <li key={person.name}>
                <img alt="" src={person.imageUrl} className="mx-auto size-24 rounded-full" />
                <h3 className="mt-6 text-base/7 font-semibold tracking-tight text-blue-600">{person.name}</h3>
                <p className="text-sm/6 text-gray-600">{person.role}</p>
              </li>
            ))}
          </ul>
        </div>
        </>
  )
}