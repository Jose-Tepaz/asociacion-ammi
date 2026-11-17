import React from 'react'

/* Logo e icono de AMMI en el admin. Muestran la versión oscura o blanca según el tema del admin. */

export const AdminLogo: React.FC = () => (
  <span className="ammi-admin-logo">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img alt="AMMI" className="ammi-admin-tone-ink" src="/brand/ammi-logo-ink.png" />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img alt="AMMI" className="ammi-admin-tone-white" src="/brand/ammi-logo-white.png" />
  </span>
)

export const AdminIcon: React.FC = () => (
  <span className="ammi-admin-icon">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img alt="AMMI" className="ammi-admin-tone-ink" src="/brand/ammi-glifo-ink.png" />
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img alt="AMMI" className="ammi-admin-tone-white" src="/brand/ammi-glifo-white.png" />
  </span>
)
