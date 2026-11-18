import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

/**
 * Arriba de «Respuestas de formularios»: a qué correo llegan los avisos de cada formulario
 * y un botón para agregar o cambiar ese correo.
 */
export const FormRecipients = async () => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({ collection: 'forms', depth: 0, limit: 20, sort: 'title' })

  if (!docs.length) return null

  return (
    <div className="ammi-recipients">
      <p className="ammi-recipients__intro">
        Cada vez que alguien envía un formulario del sitio, su mensaje se guarda aquí y llega un aviso por correo.
      </p>
      <ul className="ammi-recipients__list">
        {docs.map((form) => {
          const to = (form.emails || [])
            .map((e) => e.emailTo)
            .filter(Boolean)
            .join(', ')
          return (
            <li className="ammi-recipients__item" key={form.id}>
              <div>
                <div className="ammi-recipients__form">{form.title}</div>
                <div className="ammi-recipients__to">
                  {to ? (
                    <>
                      Los avisos llegan a: <strong>{to}</strong>
                    </>
                  ) : (
                    <strong>Todavía no hay un correo para los avisos.</strong>
                  )}
                </div>
              </div>
              <a className="btn btn--style-secondary btn--size-small" href={`/admin/collections/forms/${form.id}`}>
                {to ? 'Cambiar o agregar correo' : 'Agregar correo'}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
