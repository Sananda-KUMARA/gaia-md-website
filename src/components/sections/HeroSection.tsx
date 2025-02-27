'use client'
import Image from 'next/image';

const stats = [
  { label: 'Une passion sans limite à part celle de notre imagination créative', value: 'Montages pro effectués sur Adobe Première, After Effects, Da Vinci Resolve, ...' },
  { label: 'Déposez votre avis sur notre site ...', value: 'Nouveaux clients quotidien' },
]

const values = [
  {
    name: 'Être à l&lsquo;écoute de nos clients',
    description:
      'Savoir identifier les attentes de nos clients et y répondre de manière efficace et rapide.',
  },
  {
    name: 'Partager nos connaissances et nos idées',
    description:
      'Proposer des solutions innovantes et adaptées aux besoins de nos clients.',
  },
  {
    name: 'Apprentissage continu des nouvelles technologies et techniques',
    description:
      'Veille technologique permanente de notre équipe sur le montage vidéo et le motion design.',
  },
  {
    name: 'Être proactif',
    description:
      'Aller au devant des attentes de nos clients, et proposer plusieurs solutions en terme de Story Boarding, et d&lsquo;effets spéciaux (V-FX / A-FX).',
  },
  {
    name: 'Respect des délais',
    description:
      'La gestion des délais est un facteur clef pour les créateurs de contenu et influenceurs sur le Web et les réseaux sociaux. Ce critère est pour nous un facteur clef de succès surlequel nous sommes extrêmement vigilant.',
  },
  {
    name: 'Qualité du travail',
    description:
      'Nos créations sont soumises à votre appréciation à date de réception, et plusieurs itérations correctives sont possibles (nous contacter pour plus d&lsquo;informations).',
  },
]

export default function HeroSection() {
  return (
    <main className="isolate">
    <div className="relative isolate -z-10">
      {/* Background pattern */}
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)" width="100%" height="100%" strokeWidth={0} />
      </svg>
      
      {/* Background blur effect */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 left-1/2 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
      >
        <div
          style={{
            clipPath:
              'polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)',
          }}
          className="aspect-801/1036 w-[50.0625rem] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      
      {/* Hero content */}
      <div className="overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pt-36 pb-32 sm:pt-60 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
            <div className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl">
              <h1 className="text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-7xl">
                Nous créons pour vous des vidéos façonnées avec Amour ...
              </h1>
              <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:max-w-md sm:text-xl/8 lg:max-w-none">
                De la simple vidéo événementielle comme un mariage ou annivcersaire, à la vidéo corporate pour votre entreprise, nous sommes là pour vous accompagner dans vos projets.
              </p>
            </div>
            
            {/* Image gallery */}
            <div className="mt-14 flex justify-end gap-4 sm:gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
              <div className="ml-auto w-44 flex-none space-y-6 pt-32 sm:ml-0 sm:pt-60 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                <div className="relative">
                  <Image
                    alt="Image de production vidéo"
                    src="/photos/man-using-computer-with-photo-editing-software-2023-11-27-05-01-30-utc.png"
                    width={176}
                    height={264}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset" />
                </div>
              </div>
              
              <div className="mr-auto w-44 flex-none space-y-10 sm:mr-0 sm:pt-72 lg:pt-56">
                <div className="relative">
                  <Image
                    alt="Image de production créative"
                    src="/photos/photo-studio-with-lighting-equipment-and-fan-2024-11-17-15-41-34-utc.png"
                    width={176}
                    height={264}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset" />
                </div>
                <div className="relative">
                  <Image
                    alt="Image d'équipe créative"
                    src="/photos/camera-on-film-set-behind-the-scenes-2023-11-27-05-35-53-utc.png"
                    width={176}
                    height={264}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset" />
                </div>
              </div>
              
              <div className="w-44 flex-none space-y-8 pt-16 sm:pt-0">
                <div className="relative">
                  <Image
                    alt="Image de matériel vidéo"
                    src="/photos/cinematography-2023-11-27-04-58-01-utc.png"
                    width={176}
                    height={264}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset" />
                </div>
                <div className="relative">
                  <Image
                    alt="Image de production"
                    src="/photos/young-musician-or-producer-showing-african-man-gro-2023-11-27-05-29-14-utc.png"
                    width={176}
                    height={264}
                    className="aspect-2/3 w-full rounded-xl bg-gray-900/5 object-cover shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-900/10 ring-inset" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


{/* Content section */}
      <div className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">Notre objectif</h2>
            <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
              <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
                <p className="text-xl/8 text-gray-600">
                 Notre objectif est de vous accompagner tout au long du processus d&lsquo;léaboration et de conception de l&lsquo;histoire que vous souahitez racontez dans le cadre de votre entreprise, ou avec vos amis.    </p>
                <p className="mt-10 max-w-xl text-base/7 text-gray-700">
                  Pour celà, nous somes en mesure de vous proposer des prestations de tounage sur site (prise de viue, prise de sons, éclairage, ...) jusqu&lsquo;à l&lsquo;édition vidéo. Nous sommes également en mesure de vous proposer des prestations de motion design et d&lsquo;effets spéciaux.
                </p>
              </div>
              <div className="lg:flex lg:flex-auto lg:justify-center">
                <dl className="w-64 space-y-8 xl:w-80">
                  {stats.map((stat) => (
                    <div key={stat.label} className="flex flex-col-reverse gap-y-4">
                      <dt className="text-base/7 text-gray-600">{stat.label}</dt>
                      <dd className="text-5xl font-semibold tracking-tight text-gray-900">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
      </div>


 {/* Image section */}
        <div className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
          <Image
            alt="Équipe en collaboration créative"
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
            width={2832}
            height={1133}
            className="aspect-5/2 w-full object-cover xl:rounded-3xl"
          />
        </div>

        {/* Values section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">Nos valeurs</h2>
            <p className="mt-6 text-lg/8 text-gray-600">
             Nous sommes une équipe dynamique de personnes passionnées par ce que nous faisons et dévouées à offrir les meilleurs résultats à nos clients. Voici nos valeurs cles :
            </p>
          </div>
          <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base/7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.name}>
                <dt className="font-semibold text-gray-900">{value.name}</dt>
                <dd className="mt-1 text-gray-600">{value.description}</dd>
              </div>
            ))}
          </dl>
        </div>


    </main>
  )
}