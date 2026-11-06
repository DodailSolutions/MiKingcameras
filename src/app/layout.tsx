import React, { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { AIAssistantWidget } from '@/components/AIAssistantWidget';
import { PWARegistration } from '@/components/PWARegistration';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0b09' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://mikcameras.in'),
  title: "MiKing's Cameras | Hyderabad's Premium DSLR, Mirrorless, Drones & Accessories",
  description: "Official store for Mi King's DSLR Camera Shop. Shop Canon, Nikon, Sony Alpha, DJI Drones, lenses, and certified pre-owned equipment with 1-2 year store warranty and 25-point inspection.",
  keywords: "Mi King cameras, camera shop Hyderabad, DSLR cameras, mirrorless cameras, Canon 90D, Nikon D7500, Sony A7, DJI Drones, camera lenses Hyderabad",
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-200x200.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: "Mi King's",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "MiKing's Cameras — Premium Photography & Cinema Equipment",
    description: "New & Certified Pre-Owned DSLRs, Mirrorless Bodies, Drones & Gimbals in Hyderabad with 1-2 year store warranty.",
    url: 'https://mikcameras.in',
    siteName: "MiKing's Cameras",
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: "MiKing's Cameras Official Identity"
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark overflow-x-hidden" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-stone-50 text-stone-900 dark:bg-[#110f0d] dark:text-stone-100 min-h-screen flex flex-col transition-colors duration-200 overflow-x-hidden max-w-full`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <CartProvider>
            <PWARegistration />
            <Header />
            <main className="flex-1 pt-[196px] sm:pt-[200px] md:pt-[156px] lg:pt-[158px] pb-16 md:pb-0 overflow-x-hidden w-full max-w-full">{children}</main>
            <Footer />
            <Suspense fallback={null}>
              <MobileBottomNav />
            </Suspense>
            <WhatsAppButton />
            <AIAssistantWidget />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
