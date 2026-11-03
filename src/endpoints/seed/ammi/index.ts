/**
 * Contenido inicial de AMMI, tomado de sus piezas publicadas.
 * Ejecutar con: pnpm seed:ammi
 * Crea la página de inicio, contacto, los pronunciamientos de ejemplo
 * y los globales de encabezado y pie. No borra nada: si ya existe una
 * página de inicio, no hace cambios.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '@payload-config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// --- Ayudas para Lexical -------------------------------------------------------
const text = (value: string, format = 0) => ({
  type: 'text',
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text: value,
  version: 1,
})
const block = (type: 'paragraph' | 'heading', children: unknown[], tag?: string) => ({
  type,
  children,
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  version: 1,
  ...(type === 'heading' ? { tag } : { textFormat: 0 }),
})
const p = (value: string) => block('paragraph', [text(value)])
const h = (tag: 'h1' | 'h2' | 'h3', value: string) => block('heading', [text(value)], tag)
const doc = (...children: unknown[]) =>
  ({
    root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 },
  }) as any

const run = async () => {
  const payload = await getPayload({ config })
  const ctx = { disableRevalidate: true }

  const existing = await payload.count({ collection: 'pages', where: { slug: { equals: 'home' } } })
  if (existing.totalDocs > 0) {
    console.log('Ya existe una página de inicio; no se cargó nada.')
    process.exit(0)
  }

  // --- Imágenes ----------------------------------------------------------------
  const upload = async (file: string, alt: string) => {
    const filePath = path.join(dirname, file)
    const data = fs.readFileSync(filePath)
    return payload.create({
      collection: 'media',
      data: { alt },
      file: { data, mimetype: 'image/jpeg', name: file, size: data.length },
    })
  }

  console.log('Subiendo imágenes…')
  const img = {
    defensores: await upload(
      'ilustracion-defensores.jpg',
      'Ilustración de Luis Pacheco, Héctor Chaclán, Basilio Puac y Esteban Toc entre claveles rojos',
    ),
    ponentes: await upload(
      'conversatorio-ponentes.jpg',
      'Marta Juana López y Carmen Aida Ibarra frente a la Corte de Constitucionalidad dibujada',
    ),
    mujeres: await upload(
      'ilustracion-mujeres.jpg',
      'Ilustración de cuatro mujeres frente al Tribunal Supremo Electoral, campaña «En la justicia nuestras voces cuentan»',
    ),
    magistrada: await upload('magistrada-lemus.jpg', 'Retrato de la magistrada Astrid Lemus Rodríguez'),
    postNiUnaMenos: await upload('post-ni-una-menos.jpg', 'Pronunciamiento «Ni una menos, vivas, libres y con derechos»'),
    postJusticia: await upload('post-justicia-prevalecio.jpg', 'Pieza «La justicia prevaleció»'),
    postConversatorio: await upload('post-conversatorio-cc.jpg', 'Afiche del conversatorio sobre la Corte de Constitucionalidad'),
    postEncuentro: await upload('post-encuentro-nacional.jpg', 'Afiche del Encuentro Nacional sobre elecciones de segundo grado'),
    postMagistrada: await upload('post-magistrada-lemus.jpg', 'Cita de la magistrada Astrid Lemus Rodríguez'),
  }

  // --- Categorías y pronunciamientos -------------------------------------------
  console.log('Creando pronunciamientos…')
  const [pronunciamientos, actividades, voces] = await Promise.all(
    ['Pronunciamientos', 'Actividades', 'Voces'].map((title) =>
      payload.create({ collection: 'categories', data: { title, slug: title.toLowerCase() } }),
    ),
  )

  const post = (data: {
    slug: string
    title: string
    description: string
    image: number
    category: number
    publishedAt: string
    content: unknown[]
  }) =>
    payload.create({
      collection: 'posts',
      context: ctx,
      data: {
        _status: 'published',
        slug: data.slug,
        title: data.title,
        heroImage: data.image,
        categories: [data.category],
        publishedAt: data.publishedAt,
        content: doc(...data.content),
        meta: { title: data.title, description: data.description, image: data.image },
      },
    })

  await post({
    slug: 'ni-una-menos-vivas-libres-y-con-derechos',
    title: 'Ni una menos, vivas, libres y con derechos',
    description:
      'En el Día Internacional para la Eliminación de las Violencias contra las Mujeres, las organizaciones que integramos la AMMI manifestamos.',
    image: img.postNiUnaMenos.id,
    category: pronunciamientos.id,
    publishedAt: '2025-11-25T12:00:00.000Z',
    content: [
      p(
        'Nosotras, organizaciones de mujeres, mujeres indígenas y mujeres a lo individual que integramos la AMMI, manifestamos nuestra profunda preocupación ante el continuum de violencias que enfrentan niñas, adolescentes, mujeres y mujeres indígenas en Guatemala.',
      ),
      p(
        'Seguiremos avanzando con memoria, organización y sororidad, hasta que la justicia sea costumbre y la igualdad una realidad para todas. Porque sin justicia para las mujeres y mujeres indígenas, no hay democracia.',
      ),
      p('Paxil Kayala, Wuqu’ Iq’. Guatemala, 25 de noviembre de 2025.'),
    ],
  })

  await post({
    slug: 'la-justicia-prevalecio',
    title: 'La justicia prevaleció',
    description:
      'Celebramos el sobreseimiento dictado a favor de Luis Pacheco, Héctor Chaclán, Basilio Puac y Esteban Toc.',
    image: img.postJusticia.id,
    category: pronunciamientos.id,
    publishedAt: '2026-01-20T12:00:00.000Z',
    content: [
      p(
        'Celebramos el sobreseimiento dictado a favor de Luis Pacheco, Héctor Chaclán, Basilio Puac y Esteban Toc, quienes enfrentaron un proceso injusto e infundado.',
      ),
      p(
        'Su libertad también es un reconocimiento a la resistencia y el derecho de los pueblos a defender su autodeterminación y sus derechos.',
      ),
      h('h2', 'Defender la justicia no es delito. Defender la democracia tampoco.'),
    ],
  })

  await post({
    slug: 'conversatorio-integracion-corte-de-constitucionalidad',
    title: 'La Corte de Constitucionalidad y la democracia',
    description:
      'Conversatorio con Marta Juana López y Carmen Aida Ibarra, con la moderación de Nanci Sinto.',
    image: img.postConversatorio.id,
    category: actividades.id,
    publishedAt: '2026-03-10T12:00:00.000Z',
    content: [
      p(
        'Conversatorio del ciclo Elecciones de Segundo Nivel. Participan Marta Juana López, de la Asociación de Mujeres Mayas Moloj, y Carmen Aida Ibarra, del Movimiento Pro-Justicia. Modera Nanci Sinto.',
      ),
      p('Martes 17 de marzo de 2026, Ka’i’ I’x, de 9:30 a 12:00 horas, en el Restaurante El Adobe, 7a avenida 9-45, zona 1.'),
    ],
  })

  await post({
    slug: 'mujeres-deben-ocupar-liderazgos-a-la-par',
    title: 'Las mujeres deben ocupar liderazgos a la par',
    description: 'La magistrada Astrid Lemus Rodríguez en el VI Encuentro Virtual Mujeres y Poder.',
    image: img.postMagistrada.id,
    category: voces.id,
    publishedAt: '2026-02-12T12:00:00.000Z',
    content: [
      p(
        'Se debe superar el refrán tradicional «detrás de un gran hombre hay una gran mujer». Las mujeres deben ocupar liderazgos a la par, en igualdad de condiciones y sin conformarse con impulsar solo a otros.',
      ),
    ],
  })

  // --- Formulario y página de contacto ------------------------------------------
  console.log('Creando contacto…')
  const form = await payload.create({
    collection: 'forms',
    data: {
      title: 'Contacto',
      submitButtonLabel: 'Enviar mensaje',
      confirmationType: 'message',
      confirmationMessage: doc(h('h2', 'Gracias. Recibimos tu mensaje y te responderemos pronto.')),
      fields: [
        { name: 'nombre', blockType: 'text', label: 'Nombre completo', required: true, width: 100 },
        { name: 'organizacion', blockType: 'text', label: 'Organización (opcional)', required: false, width: 100 },
        { name: 'email', blockType: 'email', label: 'Correo electrónico', required: true, width: 100 },
        { name: 'mensaje', blockType: 'textarea', label: 'Mensaje', required: true, width: 100 },
      ],
    } as any,
  })

  const contacto = await payload.create({
    collection: 'pages',
    context: ctx,
    data: {
      title: 'Contacto',
      slug: 'contacto',
      _status: 'published',
      hero: {
        type: 'lowImpact',
        richText: doc(h('h1', 'Escríbenos')),
        standfirst:
          'Para sumarte a la Alianza, invitarnos a un espacio o pedir información sobre nuestras actividades.',
      },
      layout: [
        {
          blockType: 'formBlock',
          form: form.id,
          enableIntro: false,
        },
      ],
    } as any,
  })

  // --- Página de inicio --------------------------------------------------------
  console.log('Creando la página de inicio…')
  const evento = (date: string, time: string, kind: string, title: string, place: string, people?: string) => ({
    date,
    time,
    kind,
    title,
    place,
    people,
  })

  await payload.create({
    collection: 'pages',
    context: ctx,
    data: {
      title: 'Inicio',
      slug: 'home',
      _status: 'published',
      hero: {
        type: 'highImpact',
        media: img.mujeres.id,
        mosaic: [{ image: img.ponentes.id }, { image: img.defensores.id }, { image: img.magistrada.id }],
        richText: doc(h('h1', 'Nuestras voces cuentan')),
        standfirst:
          'La Alianza de Mujeres y Mujeres Indígenas por el Acceso a la Justicia articula 18 organizaciones de Guatemala por la participación política de las mujeres.',
        links: [
          { link: { type: 'custom', url: '/#nosotras', label: 'Conoce la Alianza', appearance: 'default' } },
          { link: { type: 'custom', url: '/posts', label: 'Pronunciamientos', appearance: 'outline' } },
        ],
      },
      layout: [
        {
          blockType: 'intro',
          blockName: 'Nosotras',
          heading: 'Una alianza de 18 voces',
          body: 'Somos mujeres mayas, garífunas, afrodescendientes, xinkas, mestizas y ladinas. Desde 2013 fortalecemos la participación, el liderazgo y la representación política de las mujeres en los espacios de toma de decisiones y en el sistema de justicia.',
          facts: [
            { value: '18', label: 'organizaciones de la sociedad civil' },
            { value: '2013', label: 'año en que se formó la Alianza' },
            { value: 'Moloj', label: 'Asociación Política de Mujeres Mayas, que administra la Alianza' },
            { value: '2026', label: 'elecciones de segundo grado que vigilamos' },
          ],
        },
        {
          blockType: 'workAreas',
          blockName: 'Lineas de trabajo',
          heading: 'Lo que defendemos',
          items: [
            {
              title: 'Participación política',
              summary:
                'Formamos y acompañamos a mujeres y mujeres indígenas para que participen, sean electas y ejerzan sus cargos sin violencia política.',
              image: img.mujeres.id,
            },
            {
              title: 'Elecciones de segundo grado',
              summary:
                'Observamos la integración de cortes, tribunales y comisiones de postulación para exigir idoneidad, paridad e independencia.',
              image: img.ponentes.id,
            },
            {
              title: 'Acceso a la justicia',
              summary:
                'Exigimos un sistema de justicia que reconozca a las mujeres indígenas, su idioma y su cultura, y que no criminalice a defensoras.',
              image: img.defensores.id,
            },
            {
              title: 'Liderazgo de mujeres',
              summary:
                'Impulsamos que las mujeres ocupen liderazgos a la par, en igualdad de condiciones, en organizaciones, comunidades e instituciones.',
              image: img.magistrada.id,
            },
          ],
        },
        {
          blockType: 'agenda',
          blockName: 'Agenda',
          heading: 'Conversatorios',
          headingSecond: 'y encuentros',
          action: {
            link: { type: 'custom', url: '/contacto', label: 'Pide información' },
          },
          events: [
            evento(
              '2026-03-17T12:00:00.000Z',
              '9:30 a 12:00',
              'Conversatorio',
              'Integración de la Corte de Constitucionalidad: desafíos para la democracia en Guatemala',
              'Restaurante El Adobe, 7a avenida 9-45, zona 1',
              'Marta Juana López, Carmen Aida Ibarra · modera Nanci Sinto',
            ),
            evento(
              '2026-05-28T12:00:00.000Z',
              '8:00 a 17:00',
              'Encuentro Nacional',
              'Aprendizajes y desafíos de la participación política de mujeres y mujeres indígenas',
              'Hotel Royal Palace, 6a avenida 12-66, zona 1',
            ),
            evento(
              '2026-05-29T12:00:00.000Z',
              '8:30 a 13:00',
              'Encuentro Nacional',
              'Elecciones de segundo grado en Guatemala: segunda jornada',
              'Hotel Royal Palace, 6a avenida 12-66, zona 1',
            ),
          ],
        },
        {
          blockType: 'quote',
          quote:
            'Las mujeres deben ocupar liderazgos a la par, en igualdad de condiciones y sin conformarse con impulsar solo a otros.',
          author: 'Magistrada Astrid Lemus Rodríguez',
          role: 'VI Encuentro Virtual Mujeres y Poder',
          image: img.magistrada.id,
          tone: 'corinto',
        },
        {
          blockType: 'archive',
          blockName: 'Pronunciamientos',
          populateBy: 'collection',
          relationTo: 'posts',
          limit: 3,
          introContent: doc(
            h('h2', 'Lo que decimos'),
            p('Pronunciamientos, posicionamientos y voces de la Alianza frente a la coyuntura del país.'),
          ),
        },
        {
          blockType: 'strip',
          heading: 'En la justicia, nuestras voces cuentan',
          panelTitle: 'Memoria, organización y sororidad',
          images: [
            { image: img.mujeres.id },
            { image: img.magistrada.id },
            { image: img.defensores.id },
            { image: img.ponentes.id },
          ],
          caption: 'Ilustraciones y retratos de las campañas y actividades de la Alianza.',
        },
        {
          blockType: 'members',
          blockName: 'Organizaciones',
          heading: 'Organizaciones',
          headingSecond: 'que caminan juntas',
          intro:
            'La Alianza articula 18 organizaciones de mujeres y mujeres indígenas. Este listado se completa desde el administrador del sitio.',
          organizations: [
            { name: 'Asociación Política de Mujeres Mayas, Moloj', focus: 'Administra la Alianza' },
            { name: 'Unión Nacional de Mujeres Guatemaltecas, UNAMG' },
            { name: 'Asociación de Mujeres Alas de Mariposas' },
            { name: "Ixoqib' Miriam" },
            { name: 'Poder Constituyente' },
            { name: 'Convergencia Cívico Política de Mujeres' },
            { name: 'Mujeres Transformando el Mundo' },
            { name: 'Crisálidas' },
            { name: "Asociación de Abogadas Indígenas Chomija'" },
            { name: 'Impunity Watch' },
          ],
        },
        {
          blockType: 'cta',
          richText: doc(
            h('h2', 'Sin justicia no hay democracia'),
            p(
              'Súmate a la Alianza: organizaciones, colectivas y mujeres a lo individual que defienden la participación política y el acceso a la justicia.',
            ),
          ),
          links: [
            { link: { type: 'reference', reference: { relationTo: 'pages', value: contacto.id }, label: 'Escríbenos', appearance: 'default' } },
          ],
        },
      ],
    } as any,
  })

  // --- Globales ----------------------------------------------------------------
  console.log('Actualizando encabezado y pie…')
  await payload.updateGlobal({
    slug: 'header',
    context: ctx,
    data: {
      navItems: [
        { link: { type: 'custom', url: '/#nosotras', label: 'Nosotras' } },
        { link: { type: 'custom', url: '/#lineas-de-trabajo', label: 'Lo que hacemos' } },
        { link: { type: 'custom', url: '/#agenda', label: 'Agenda' } },
        { link: { type: 'custom', url: '/posts', label: 'Pronunciamientos' } },
      ],
      action: {
        link: { type: 'reference', reference: { relationTo: 'pages', value: contacto.id }, label: 'Escríbenos' },
      },
    } as any,
  })

  await payload.updateGlobal({
    slug: 'footer',
    context: ctx,
    data: {
      statement:
        'Seguiremos avanzando con memoria, organización y sororidad, hasta que la justicia sea costumbre.',
      contacts: [{ label: 'Escríbenos', href: '/contacto' }, { label: 'Paxil Kayala, Guatemala' }],
      navItems: [
        { link: { type: 'custom', url: '/#nosotras', label: 'Nosotras' } },
        { link: { type: 'custom', url: '/#lineas-de-trabajo', label: 'Lo que hacemos' } },
        { link: { type: 'custom', url: '/#agenda', label: 'Agenda' } },
        { link: { type: 'custom', url: '/posts', label: 'Pronunciamientos' } },
        { link: { type: 'custom', url: '/#organizaciones', label: 'Organizaciones' } },
        { link: { type: 'reference', reference: { relationTo: 'pages', value: contacto.id }, label: 'Contacto' } },
      ],
      legal: 'Alianza administrada por la Asociación Política de Mujeres Mayas, Moloj.',
    } as any,
  })

  console.log('Listo.')
  process.exit(0)
}

// `payload run` termina al evaluar el módulo, así que esperamos aquí
await run().catch((err) => {
  console.error(err)
  process.exit(1)
})
