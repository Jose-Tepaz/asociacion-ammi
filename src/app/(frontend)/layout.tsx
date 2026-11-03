import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Hanken_Grotesk, Source_Serif_4 } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { FloatingCholqij } from '@/components/MayaDate/FloatingCholqij'
import { RevealObserver } from '@/components/RevealObserver'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const hanken = Hanken_Grotesk({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-hanken',
  display: 'swap',
})
const sourceSerif = Source_Serif_4({
  subsets: ['latin', 'latin-ext'],
  weight: ['600', '700'],
  variable: '--font-source-serif',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(hanken.variable, sourceSerif.variable)} lang="es" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      {/* Algunas extensiones del navegador agregan atributos al body; no son un error del sitio */}
      <body id="top" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
          <FloatingCholqij />
          <RevealObserver />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  title: 'AMMI · Alianza de Mujeres y Mujeres Indígenas por el Acceso a la Justicia',
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}
