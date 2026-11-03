import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
  /** `mark`: glifo, AMMI y tejido. `full`: incluye el nombre completo de la Alianza. */
  variant?: 'mark' | 'full'
  /** Color del logo según el fondo sobre el que se coloca. */
  tone?: 'ink' | 'white'
}

const sizes = {
  full: { width: 1199, height: 674 },
  mark: { width: 1199, height: 300 },
}

export const Logo = ({
  className,
  loading = 'lazy',
  priority = 'low',
  tone = 'ink',
  variant = 'mark',
}: Props) => {
  const { width, height } = sizes[variant]
  const file = variant === 'full' ? 'ammi-logo' : 'ammi-mark'

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      alt="AMMI, Alianza de Mujeres y Mujeres Indígenas por el Acceso a la Justicia"
      className={clsx('block h-auto', className)}
      decoding="async"
      fetchPriority={priority}
      height={height}
      loading={loading}
      src={`/brand/${file}-${tone}.png`}
      width={width}
    />
  )
}
