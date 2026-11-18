'use client'

import { NavGroup } from '@payloadcms/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

/**
 * Grupo «Ajustes avanzados» al final del menú del admin, después de «Partes fijas del sitio».
 * Payload pone los grupos de Encabezado y Pie de página después de todas las colecciones,
 * así que este grupo se dibuja aparte (las colecciones tienen `admin.group: false`).
 */
const LINKS = [
  { href: '/admin/collections/users', label: 'Usuarias', slug: 'users' },
  { href: '/admin/collections/redirects', label: 'Redirecciones', slug: 'redirects' },
  { href: '/admin/collections/search', label: 'Resultados de búsqueda', slug: 'search' },
]

export const NavAjustes: React.FC = () => {
  const pathname = usePathname()

  return (
    <NavGroup label="Ajustes avanzados">
      {LINKS.map(({ href, label, slug }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`)
        return (
          <Link className="nav__link" href={href} id={`nav-${slug}`} key={slug} prefetch={false}>
            {isActive && <div className="nav__link-indicator" />}
            <span className="nav__link-label">{label}</span>
          </Link>
        )
      })}
    </NavGroup>
  )
}
