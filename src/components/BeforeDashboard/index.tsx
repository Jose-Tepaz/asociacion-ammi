import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Bienvenida al panel de AMMI</h4>
      </Banner>
      Desde aquí se edita el contenido del sitio:
      <ul className={`${baseClass}__instructions`}>
        <li>
          <strong>Páginas</strong> y <strong>Publicaciones</strong>: guarda tus cambios y presiona{' '}
          <strong>Publicar</strong> cuando estén listos.
        </li>
        <li>
          <strong>Encabezado</strong> y <strong>Pie de página</strong>: el menú, los contactos y las redes
          sociales. Se publican al guardar.
        </li>
        <li>
          <a href="/" rel="noopener noreferrer" target="_blank">
            Ver el sitio
          </a>{' '}
          para revisar cómo quedó.
        </li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
