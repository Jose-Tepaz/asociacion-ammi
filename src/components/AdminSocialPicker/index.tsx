'use client'
import type { TextFieldClientComponent } from 'payload'
import { TextField, useField } from '@payloadcms/ui'
import React from 'react'

import { socialNetworks } from '@/components/SocialIcon'

/** Campo «Red»: los íconos de las redes en fila; al tocar uno se escribe su nombre. También se puede escribir otra. */
export const SocialPicker: TextFieldClientComponent = (props) => {
  const { setValue, value } = useField<string>({ path: props.path })
  const current = (value || '').trim().toLowerCase()

  return (
    <div className="ammi-redes">
      <TextField {...props} />
      <div aria-label="Elige una red" className="ammi-redes__fila" role="group">
        {socialNetworks.map(({ Icon, name }) => {
          const active = current === name.toLowerCase()
          return (
            <button
              aria-pressed={active}
              className={`ammi-redes__boton${active ? ' is-active' : ''}`}
              key={name}
              onClick={() => setValue(name)}
              title={name}
              type="button"
            >
              {React.createElement(Icon, { 'aria-hidden': true })}
              <span>{name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
