'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'

// Navigation items
const navigation = [
  { name: 'Accueil', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Tarifs', href: '/price' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'C.V.', href: '/cv' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contactez-nous', href: '/contact' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-white w-full overflow-hidden">
      <header className="fixed inset-x-0 top-0 mb-5 z-50 bg-white">
        <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          {/* Logo - Centré sur mobile, aligné à gauche sur desktop */}
          <div className="flex flex-1 justify-center lg:justify-start">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Gaia Motion Design</span>
              <Image
                alt="Logo Gaia Motion Design"
                src="/logos/logo.gif"
                width={80}
                height={80}
                className="h-8 w-auto sm:h-10 md:h-12 lg:h-14"
                priority
              />
            </Link>
          </div>
          
          {/* Menu desktop */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-gray-900">
                {item.name}
              </a>
            ))}
          </div>
          
          {/* Connexion (desktop uniquement) */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="/login" className="text-sm/6 font-semibold text-gray-900">
              Connexion <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
          
          {/* Zone mobile avec menu hamburger uniquement */}
          <div className="flex justify-end lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Ouvrir le menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
        </nav>
        
        {/* Menu mobile */}
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Gaia Motion Design</span>
                <Image
                  alt="Logo Gaia Motion Design"
                  src="/logos/logo_HD_clean_transparent.png"
                  width={56}
                  height={56}
                  className="h-8 w-auto sm:h-10 md:h-12 lg:h-14"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Fermer menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Connexion
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </div>
  )
}