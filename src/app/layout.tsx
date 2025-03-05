import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from 'next/font/google'
import AudioProvider from '../components/ui/AudioProvider';
import CookieConsentBanner from '../components/ui/CookieConsentBanner';
import "./globals.css";

import NextAuthSessionProvider from './AuthProvider'
const inter = Inter({ subsets: ['latin'] })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Gaïa Motion Design',
    default: 'Gaïa MD',
  },
  description: 'Studio de création numérique spécialisée dans le motion design, l\'animation et le montage video.',
  keywords: ['Motion Design', 'Gaïa', 'Studio cratif', 'Montage vidéo'],
  authors: [{ name: 'Florent LEFEVRE' }],
  creator: 'Gaïa Motion Design',
  publisher: 'Gaïa Motion Design',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  }
};

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="fr">
      <body>
        <NextAuthSessionProvider>
          <AudioProvider>
             {children}
               <CookieConsentBanner />
             <Analytics />
             <SpeedInsights />
        </AudioProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}

