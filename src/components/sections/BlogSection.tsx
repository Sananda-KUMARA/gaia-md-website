'use client'
import Image from 'next/image';

const blogPosts = [
  {
    id: 1,
    title: 'Comment gérer la colorimétie ddans Adobe Première Pro',
    href: '#',
    description:
      'Rappel des concepts de base, et explications pour améliorer la colorimétrie de vos vidéos.',
    imageUrl:
      'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80',
    date: 'Mar 16, 2020',
    datetime: '2020-03-16',
    author: {
      name: 'Florent LEFEVRE',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
]

export default function BlogSection() {
  return (
    <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
        <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
          Depuis le Blog
        </h2>
        <p className="mt-2 text-lg/8 text-gray-600">Apprendre quelques techniques de montage vidéos (gratuitement).</p>
      </div>
      <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        {blogPosts.map((post) => (
          <article
            key={post.id}
            className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pt-80 pb-8 sm:pt-48 lg:pt-80"
          >
            <Image
              alt={`Image pour l'article: ${post.title}`}
              src={post.imageUrl}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="absolute inset-0 -z-10 object-cover"
              priority={post.id === 1} // Prioritize the first post image
            />
            <div className="absolute inset-0 -z-10 bg-linear-to-t from-gray-900 via-gray-900/40" />
            <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-gray-900/10 ring-inset" />
            <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm/6 text-gray-300">
              <time dateTime={post.datetime} className="mr-8">
                {post.date}
              </time>
              <div className="-ml-4 flex items-center gap-x-4">
                <svg viewBox="0 0 2 2" className="-ml-0.5 size-0.5 flex-none fill-white/50">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <div className="flex gap-x-2.5">
                  <Image
                    alt={`Photo de ${post.author.name}`}
                    src={post.author.imageUrl}
                    width={24}
                    height={24}
                    className="size-6 flex-none rounded-full bg-white/10"
                  />
                  {post.author.name}
                </div>
              </div>
            </div>
            <h3 className="mt-3 text-lg/6 font-semibold text-white">
              <a href={post.href}>
                <span className="absolute inset-0" />
                {post.title}
              </a>
            </h3>
          </article>
        ))}
      </div>
    </div>
  )
}