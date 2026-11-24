'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { getOptimizedImageUrl } from '@/utilities/getOptimizedImageUrl'
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
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const navItems = data?.navItems || []
  const action = data?.action?.enabled ? data.action.link : undefined
  const logo = data?.logo && typeof data.logo === 'object' ? data.logo : null

  useEffect(() => setOpen(false), [pathname])

  // Sobre la portada del inicio la barra es transparente; al bajar se vuelve blanca y de lado a lado
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const isActive = (link: NavLink) => {
    const href = hrefOf(link)
    if (!href || href.includes('#')) return false
    return href === '/' ? pathname === '/' : pathname.startsWith(href)
  }

  return (
    // Con el menú abierto el encabezado se ve como al bajar: blanco de lado a lado, y el panel queda pegado debajo
    <header className="site-header relative z-30 pt-4 md:pt-5" data-scrolled={scrolled || open || undefined}>
      <div className="container">
        {/* Sin relleno lateral hasta escritorio: el logo y la hamburguesa quedan a ras del margen del contenido */}
        <div className="site-header-bar relative flex h-16 w-full items-center justify-between gap-2 rounded-full bg-white/95 py-2 ps-0 pe-0 text-texto-primario shadow-[0_20px_40px_-20px_rgb(36_15_22/0.45)] ring-1 ring-texto-primario/8 backdrop-blur-md md:h-[4.5rem] lg:pe-2 lg:ps-7">
          <Link
            aria-label="AMMI, ir al inicio"
            className="shrink-0"
            href="/"
          >
            {logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                alt={logo.alt || 'AMMI, ir al inicio'}
                className="header-logo block h-9 w-auto max-w-[10rem] object-contain md:h-10 md:max-w-[12rem]"
                src={getOptimizedImageUrl(logo.url, logo.updatedAt, 384)}
              />
            ) : (
              <Logo className="header-logo w-[6.5rem] md:w-[7.5rem]" loading="eager" priority="high" variant="mark" />
            )}
            {/* Sobre la foto de la portada se muestra la versión blanca */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="AMMI, ir al inicio"
              className="header-logo-white hidden h-9 w-auto max-w-[10rem] object-contain md:h-10 md:max-w-[12rem]"
              height={462}
              src="/brand/ammi-logo-extendido-blanco.png"
              width={2000}
            />
          </Link>

          <nav aria-label="Principal" className="hidden lg:flex items-center xl:gap-1">
            {navItems.map(({ link }, i) => (
              <CMSLink
                className={cn(
                  'relative px-2 py-2 text-step-body font-medium whitespace-nowrap transition-colors hover:text-corinto xl:px-4',
                  isActive(link) &&
                    'text-corinto after:absolute after:inset-x-2 after:bottom-0.5 after:h-0.5 after:rounded-full after:bg-corinto xl:after:inset-x-4',
                )}
                key={i}
                {...link}
              />
            ))}
          </nav>

          <div className="flex h-full items-center gap-2">
            {action?.label && (
              <CMSLink
                {...action}
                appearance="inline"
                className="hidden h-full items-center rounded-full bg-corinto px-5 text-step-body font-medium whitespace-nowrap text-besh-suave transition-colors hover:bg-corinto-secundario lg:flex xl:px-6"
              />
            )}
            <button
              aria-controls="menu-movil"
              aria-expanded={open}
              aria-label={open ? 'Cerrar el menú' : 'Abrir el menú'}
              className="header-menu grid aspect-square h-full place-items-center rounded-full bg-besh-fuerte transition-colors hover:bg-besh-oscuro lg:hidden"
              onClick={() => setOpen((v) => !v)}
              type="button"
            >
              {/* Tres barras que se convierten en una X: la de arriba y la de abajo giran, la del medio se desvanece */}
              <span aria-hidden="true" className="relative block size-6">
                <span
                  className={cn(
                    'absolute left-1 top-[5px] block h-0.5 w-4 rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                    open && 'translate-y-[6px] rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-1 top-[11px] block h-0.5 w-4 rounded-full bg-current transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none',
                    open && 'scale-x-0 opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-1 top-[17px] block h-0.5 w-4 rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                    open && '-translate-y-[6px] -rotate-45',
                  )}
                />
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Panel del menú: fuera de la barra para cubrir todo el ancho, pegado al borde inferior del encabezado.
          Sin redondeo arriba; con la altura limitada y scroll para que en horizontal no se corte.
          Se despliega hacia abajo desde el encabezado (recorte + fundido): entra en 300 ms y sale más rápido, en 200 ms.
          Cerrado queda invisible, así no recibe foco ni lo lee el lector de pantalla */}
      <div
        className={cn(
          'lg:hidden absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-h))] overflow-y-auto overscroll-contain rounded-b-[var(--radius-card)] bg-besh-suave px-[var(--margin)] pb-5 pt-2 text-texto-primario shadow-[0_24px_48px_-16px_rgb(36_15_22/0.35)] transition-[clip-path,opacity,visibility] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
          open
            ? 'visible opacity-100 duration-300 [clip-path:inset(0_0_-3rem_0)]'
            : 'invisible opacity-0 duration-200 [clip-path:inset(0_0_100%_0)]',
        )}
        id="menu-movil"
      >
        <nav aria-label="Menú móvil" className="flex flex-col">
          {navItems.map(({ link }, i) => (
            <CMSLink
              className={cn(
                '-mx-4 rounded-xl px-4 py-3 text-step-lead transition-colors hover:bg-besh-fuerte',
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
    </header>
  )
}
