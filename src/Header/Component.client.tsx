'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { cn } from '@/utilities/ui'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const navItems = data?.navItems || []
  const action = data?.action?.link

  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="relative z-30 bg-background">
      <div className="flex items-stretch h-[4.5rem] md:h-20">
        <Link
          className="flex items-center bg-corinto-terciario px-[var(--margin)] shrink-0 transition-colors hover:bg-corinto-secundario"
          href="/"
        >
          <Logo
            className="w-[7.5rem] md:w-[9.5rem]"
            loading="eager"
            priority="high"
            tone="white"
          />
        </Link>

        <nav
          aria-label="Principal"
          className="hidden lg:flex items-center gap-8 bg-corinto px-8 xl:px-10 min-w-[calc(42%-11rem)] text-besh-suave"
        >
          {navItems.map(({ link }, i) => (
            <CMSLink
              className="text-step-body font-medium underline-offset-[6px] decoration-2 decoration-ocre hover:underline"
              key={i}
              {...link}
            />
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2 pe-[var(--margin)] ps-4">
          {action?.label && (
            <CMSLink
              appearance="default"
              className="hidden sm:inline-flex"
              size="lg"
              {...action}
            />
          )}
          <button
            aria-controls="menu-movil"
            aria-expanded={open}
            className="lg:hidden h-11 px-4 font-medium bg-secondary text-foreground transition-colors hover:bg-accent"
            onClick={() => setOpen((v) => !v)}
            type="button"
          >
            {open ? 'Cerrar' : 'Menú'}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'lg:hidden absolute inset-x-0 top-full bg-corinto text-besh-suave',
          open ? 'block' : 'hidden',
        )}
        id="menu-movil"
      >
        <nav aria-label="Menú móvil" className="container flex flex-col py-6">
          {navItems.map(({ link }, i) => (
            <CMSLink className="py-3 text-step-title font-medium" key={i} {...link} />
          ))}
          {action?.label && (
            <CMSLink
              appearance="default"
              className="mt-6 w-full bg-ocre text-texto-primario hover:bg-besh-suave"
              size="lg"
              {...action}
            />
          )}
        </nav>
      </div>
      <span aria-hidden="true" className="tejido" style={{ '--tejido-h': '0.375rem' } as React.CSSProperties} />
    </header>
  )
}
