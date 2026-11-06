/**
 * Copia el contenido local a la base de las variables de entorno activas.
 *
 * Vista previa, no escribe nada:  pnpm seed:contenido
 * Aplicar los cambios:            pnpm seed:contenido:aplicar
 */
import { getPayload } from 'payload'
import config from '@payload-config'

import { copyContent } from './copiar'

// Sin esta variable, Payload intentaría cambiar el esquema de la base al conectarse
if (process.env.PAYLOAD_MIGRATING !== 'true') {
  throw new Error('Ejecuta este script con: pnpm seed:contenido')
}

// `payload run` termina al evaluar el módulo, así que esperamos aquí
await getPayload({ config })
  .then((payload) =>
    copyContent({ apply: process.env.APLICAR === 'true', log: console.log, payload }),
  )
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
