'use client';
import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link href="/" className="flex items-center py-4">
                <span className="font-semibold text-gray-500 text-lg">GAIA MD</span>
              </Link>
            </div>
            
            {/* Navigation primaire - Desktop */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/" className="py-4 px-2 text-gray-500 hover:text-blue-500">
                Accueil
              </Link>
              <Link href="/services" className="py-4 px-2 text-gray-500 hover:text-blue-500">
                Services
              </Link>
              <Link href="/contact" className="py-4 px-2 text-gray-500 hover:text-blue-500">
                Contact
              </Link>
              <Link href="/about" className="py-4 px-2 text-gray-500 hover:text-blue-500">
                A propos
              </Link>
            </div>
          </div>

          {/* Bouton Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button 
              className="outline-none mobile-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            href="/" 
            className="block px-2 py-2 text-gray-500 hover:bg-blue-500 hover:text-white rounded"
          >
            Accueil
          </Link>
          <Link 
            href="/services" 
            className="block px-2 py-2 text-gray-500 hover:bg-blue-500 hover:text-white rounded"
          >
            Services
          </Link>
          <Link 
            href="/contact" 
            className="block px-2 py-2 text-gray-500 hover:bg-blue-500 hover:text-white rounded"
          >
            Contact
          </Link>
          <Link 
            href="/about" 
            className="block px-2 py-2 text-gray-500 hover:bg-blue-500 hover:text-white rounded"
          >
            A propos
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;