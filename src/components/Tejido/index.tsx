import { cn } from '@/utilities/ui'
import React from 'react'

/** La franja de tejido de la marca, usada como costura entre secciones. */
export const Tejido: React.FC<{ className?: string }> = ({ className }) => (
  <span aria-hidden="true" className={cn('tejido w-full', className)} />
)
