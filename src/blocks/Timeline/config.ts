import type { Block } from 'payload'

export const Timeline: Block = {
  slug: 'timeline',
  interfaceName: 'TimelineBlock',
  labels: { singular: 'Historia (línea de tiempo)', plural: 'Historia (línea de tiempo)' },
  fields: [
    { name: 'heading', label: 'Título', type: 'text', required: true, defaultValue: 'Nuestra historia' },
    {
      name: 'intro',
      label: 'Texto introductorio',
      type: 'textarea',
      admin: { description: 'Separa los párrafos con una línea en blanco. Se reparten en dos columnas.' },
      defaultValue: [
        "La Alianza nace en 2013 por iniciativa de Kemb'al No'j, asociación de profesionales mayas del Ixcán, y de la Asociación Ixoqib' Miriam, para fortalecer la institucionalidad de las mujeres y del sector justicia, en busca de una justicia pronta y cumplida, especializada, con enfoque de género y pertinencia cultural.",
        'En 2014 la convocatoria se amplió a otras organizaciones de mujeres y mujeres indígenas dedicadas a la defensa de sus derechos. Desde entonces la Alianza se ha fortalecido integrando también a mujeres en lo individual.',
        'Ha elaborado propuestas para coordinar y armonizar el sistema de justicia oficial con la justicia ancestral, indígena y comunitaria, y ha vigilado y denunciado la violencia contra las mujeres en los procesos electorales.',
        'También ha impulsado estudios sobre justicia especializada con pertinencia cultural y campañas contra la corrupción, la impunidad y el despojo de los territorios.',
      ].join('\n\n'),
    },
    {
      name: 'background',
      label: 'Foto de fondo (opcional)',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Se muestra muy tenue, en blanco y negro, detrás de la sección.' },
    },
    {
      name: 'events',
      label: 'Momentos',
      type: 'array',
      minRows: 1,
      admin: { description: 'En orden, del más antiguo al más reciente. Se alternan a izquierda y derecha.' },
      defaultValue: [
        {
          year: '2013',
          title: 'Nace la Alianza',
          text: "Kemb'al No'j, Ixoqib' Miriam y ASIGDHA crean la Alianza para vigilar las comisiones de postulación del sector justicia y promover a abogadas para las magistraturas de las altas cortes.",
        },
        {
          year: '2014',
          title: 'La convocatoria se amplía',
          text: 'Se suman Moloj, Convergencia Cívico Política de Mujeres y Alas de Mariposas. Juntas cabildean ante el Congreso para que la reforma electoral incluya la paridad y la alternancia.',
        },
        {
          year: '2021',
          title: 'Estrategia de comunicación e incidencia',
          text: 'La Alianza define cómo llevar su voz a la opinión pública y a las instituciones del Estado, con un discurso que visibiliza los aportes de las mujeres y mujeres indígenas.',
        },
        {
          year: '2022',
          title: 'Plan estratégico 2022–2026',
          text: 'En talleres colectivos, organizaciones y ciudadanas definen la misión, la visión y cuatro objetivos: acceso a la justicia, participación política, trabajo decente y articulación.',
        },
        {
          year: 'Hoy',
          title: 'Mujeres y Poder',
          text: 'Seis ediciones del Encuentro Virtual Mujeres y Poder y presencia donde se decide sobre la justicia, impulsando la paridad, la alternancia y los derechos laborales de las mujeres.',
        },
      ],
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'year', label: 'Año', type: 'text', required: true, admin: { width: '25%' } },
            { name: 'title', label: 'Título', type: 'text', required: true, admin: { width: '75%' } },
          ],
        },
        { name: 'text', label: 'Texto', type: 'textarea', required: true },
      ],
    },
  ],
}
