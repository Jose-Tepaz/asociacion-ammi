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

type NavLink = NonNullable<Header['navItems']>[number]['link']

const hrefOf = (link: NavLink) => {
  if (link.type === 'reference' && typeof link.reference?.value === 'object') {
    const { relationTo, value } = link.reference
    return `${relationTo !== 'pages' ? `/${relationTo}` : ''}/${value.slug === 'home' ? '' : value.slug}`
  }
  return link.url || ''
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const navItems = data?.navItems || []
  const action = data?.action?.enabled ? data.action.link : undefined

  useEffect(() => setOpen(false), [pathname])

  const isActive = (link: NavLink) => {
    const href = hrefOf(link)
    if (!href || href.includes('#')) return false
    return href === '/' ? pathname === '/' : pathname.startsWith(href)
  }

  return (
    <header className="site-header relative z-30 pt-4 md:pt-5">
      <div className="container">
        <div className="site-header-bar relative flex h-16 md:h-[4.5rem] items-center gap-4 rounded-card bg-besh-suave ps-4 pe-2.5 ring-1 ring-texto-primario/8 md:ps-6 md:pe-3">
          <Link aria-label="AMMI, ir al inicio" className="shrink-0" href="/">
            <Logo className="w-[6.5rem] md:w-[7.5rem]" loading="eager" priority="high" variant="mark" />
          </Link>

          <nav aria-label="Principal" className="ms-auto hidden lg:flex items-center gap-1">
            {navItems.map(({ link }, i) => (
              <CMSLink
                className={cn(
                  'relative rounded-full px-4 py-2 text-step-small font-medium transition-colors hover:bg-besh-fuerte',
                  isActive(link) &&
                    'text-fucsia after:absolute after:inset-x-4 after:bottom-1 after:h-0.5 after:rounded-full after:bg-fucsia',
                )}
                key={i}
                {...link}
              />
            ))}
          </nav>

          <div className="ms-auto lg:ms-2 flex items-center gap-2">
            {action?.label && (
              <CMSLink appearance="default" className="hidden sm:inline-flex" {...action} />
            )}
            <button
              aria-controls="menu-movil"
              aria-expanded={open}
              className="lg:hidden h-11 rounded-full px-5 text-step-small font-medium bg-besh-fuerte transition-colors hover:bg-besh-oscuro"
              onClick={() => setOpen((v) => !v)}
              type="button"
            >
              {open ? 'Cerrar' : 'Menú'}
            </button>
          </div>

          <div
            className={cn(
              'lg:hidden absolute inset-x-0 top-[calc(100%+0.5rem)] rounded-card bg-besh-suave p-3 shadow-[0_24px_48px_-16px_rgb(36_15_22/0.35)]',
              open ? 'block' : 'hidden',
            )}
            id="menu-movil"
          >
            <nav aria-label="Menú móvil" className="flex flex-col">
              {navItems.map(({ link }, i) => (
                <CMSLink
                  className={cn(
                    'rounded-xl px-4 py-3 text-step-lead transition-colors hover:bg-besh-fuerte',
                    isActive(link) && 'text-fucsia',
                  )}
                  key={i}
                  {...link}
                />
              ))}
              {action?.label && (
                <CMSLink appearance="default" className="mt-3 w-full" size="lg" {...action} />
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
