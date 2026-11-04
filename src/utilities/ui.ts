/**
 * Utility functions for UI components automatically added by ShadCN and used in a few of our frontend components and blocks.
 *
 * Other functions may be exported from here in the future or by installing other shadcn components.
 */

import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Los pasos tipográficos propios (text-step-*) son tamaños, no colores
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ 'text-step': ['small', 'regular', 'body', 'lead', 'title', 'head', 'display'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
