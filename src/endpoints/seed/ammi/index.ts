/**
 * Contenido inicial de AMMI, tomado de sus piezas publicadas.
 * Ejecutar con: pnpm seed:ammi
 *
 * No borra ni sobrescribe nada. Reutiliza las imágenes, categorías, publicaciones y
 * páginas que ya existan (por nombre de archivo, título o slug) y solo crea lo que falta.
 * El encabezado y el pie se llenan únicamente si todavía están vacíos.
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

const custom = (url: string, label: string, appearance?: 'default' | 'outline') => ({
  link: { type: 'custom', url, label, ...(appearance ? { appearance } : {}) },
})

const run = async () => {
  const payload = await getPayload({ config })
  const ctx = { disableRevalidate: true }

  // --- Ayudas para crear o reutilizar ---------------------------------------------
  // `name` permite subir el mismo archivo como otra imagen: cada sección tiene la suya
  const media = async (file: string, alt: string, name = file) => {
    const found = await payload.find({ collection: 'media', where: { filename: { equals: name } }, limit: 1 })
    if (found.docs[0]) return found.docs[0]
    const data = fs.readFileSync(path.join(dirname, file))
    return payload.create({
      collection: 'media',
      data: { alt },
      file: { data, mimetype: 'image/jpeg', name, size: data.length },
    })
  }

  const category = async (title: string) => {
    const found = await payload.find({ collection: 'categories', where: { title: { equals: title } }, limit: 1 })
    return found.docs[0] || payload.create({ collection: 'categories', data: { title, slug: title.toLowerCase() } })
  }

  const post = async (data: {
    slug: string
    title: string
    description: string
    image: number
    category: number
    publishedAt: string
    content: unknown[]
  }) => {
    const found = await payload.find({ collection: 'posts', where: { slug: { equals: data.slug } }, limit: 1 })
    if (found.docs[0]) return found.docs[0]
    return payload.create({
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
  }

  // Las páginas que ya existen no se tocan: pueden tener cambios hechos desde el admin
  const page = async (slug: string, data: Record<string, unknown>) => {
    const found = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1 })
    if (found.docs[0]) {
      console.log(`  «${slug}» ya existe; se conserva como está.`)
      return found.docs[0]
    }
    return payload.create({
      collection: 'pages',
      context: ctx,
      data: { slug, _status: 'published', ...data } as any,
    })
  }

  // --- Imágenes ----------------------------------------------------------------
  console.log('Imágenes…')
  const img = {
    defensores: await media(
      'ilustracion-defensores.jpg',
      'Ilustración de Luis Pacheco, Héctor Chaclán, Basilio Puac y Esteban Toc entre claveles rojos',
    ),
    ponentes: await media(
      'conversatorio-ponentes.jpg',
      'Marta Juana López y Carmen Aida Ibarra frente a la Corte de Constitucionalidad dibujada',
    ),
    mujeres: await media(
      'ilustracion-mujeres.jpg',
      'Ilustración de cuatro mujeres frente al Tribunal Supremo Electoral, campaña «En la justicia nuestras voces cuentan»',
    ),
    magistrada: await media('magistrada-lemus.jpg', 'Retrato de la magistrada Astrid Lemus Rodríguez'),
    logoRojo: await media('pieza-logo-rojo.jpg', 'Logotipo de AMMI sobre fondo rojo'),
    // Copias para que cada sección pueda cambiar su imagen sin afectar a otras
    eje: await media('ilustracion-mujeres.jpg', 'Ilustración de la campaña «En la justicia nuestras voces cuentan»', 'eje-incidencia.jpg'),
    franja: await media('ilustracion-mujeres.jpg', 'Ilustración de la campaña «En la justicia nuestras voces cuentan»', 'franja-ni-una-menos.jpg'),
    sumarse: await media('conversatorio-ponentes.jpg', 'Marta Juana López y Carmen Aida Ibarra', 'sumarse.jpg'),
    quienes: await media('conversatorio-ponentes.jpg', 'Marta Juana López y Carmen Aida Ibarra', 'quienes-somos.jpg'),
    postNiUnaMenos: await media('post-ni-una-menos.jpg', 'Pronunciamiento «Ni una menos, vivas, libres y con derechos»'),
    postJusticia: await media('post-justicia-prevalecio.jpg', 'Pieza «La justicia prevaleció»'),
    postConversatorio: await media('post-conversatorio-cc.jpg', 'Afiche del conversatorio sobre la Corte de Constitucionalidad'),
    postEncuentro: await media('post-encuentro-nacional.jpg', 'Afiche del Encuentro Nacional sobre elecciones de segundo grado'),
    postMagistrada: await media('post-magistrada-lemus.jpg', 'Cita de la magistrada Astrid Lemus Rodríguez'),
  }

  // --- Categorías y publicaciones ----------------------------------------------
  console.log('Publicaciones…')
  const pronunciamientos = await category('Pronunciamientos')
  const actividades = await category('Actividades')
  const voces = await category('Voces')

  const niUnaMenos = await post({
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
    slug: 'encuentro-nacional-participacion-politica',
    title: 'Aprendizajes y desafíos de la participación política de mujeres',
    description:
      'Encuentro Nacional sobre las elecciones de segundo grado en Guatemala, el 28 y 29 de mayo.',
    image: img.postEncuentro.id,
    category: actividades.id,
    publishedAt: '2026-05-15T12:00:00.000Z',
    content: [
      p(
        'Encuentro Nacional «Aprendizajes y desafíos de la participación política de mujeres y mujeres indígenas: elecciones de segundo grado en Guatemala».',
      ),
      p(
        '28 de mayo de 8:00 a 17:00 horas y 29 de mayo de 8:30 a 13:00 horas, en el Hotel Royal Palace, 6a avenida 12-66, zona 1.',
      ),
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

  // --- Contacto ----------------------------------------------------------------
  console.log('Contacto…')
  const existingForm = await payload.find({ collection: 'forms', where: { title: { equals: 'Contacto' } }, limit: 1 })
  const form =
    existingForm.docs[0] ||
    (await payload.create({
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
          { name: 'telefono', blockType: 'text', label: 'Teléfono (opcional)', required: false, width: 100 },
          { name: 'mensaje', blockType: 'textarea', label: 'Mensaje', required: true, width: 100 },
        ],
      } as any,
    }))

  const contacto = await page('contacto', {
    title: 'Contacto',
    hero: {
      type: 'lowImpact',
      tone: 'contacto',
      kicker: 'Contacto',
      richText: doc(h('h1', 'Escríbenos')),
      standfirst:
        'Para sumarte a la Alianza, invitarnos a un espacio o pedir información sobre nuestras actividades.',
    },
    layout: [{ blockType: 'formBlock', form: form.id, enableIntro: false }],
  })
  const toContacto = (label: string) => ({
    link: { type: 'reference', reference: { relationTo: 'pages', value: contacto.id }, label },
  })

  // --- Quiénes somos --------------------------------------------------------------
  console.log('Quiénes somos…')
  await page('quienes-somos', {
    title: 'Quiénes somos',
    hero: {
      type: 'mediumImpact',
      kicker: 'Quiénes somos',
      media: img.quienes.id,
      richText: doc(h('h1', 'Una alianza de 18 organizaciones')),
      standfirst:
        'Mujeres mayas, garífunas, afrodescendientes, xinkas, mestizas y ladinas que, desde 2013, defendemos la participación política y el acceso a la justicia.',
    },
    layout: [
      {
        blockType: 'quote',
        quote:
          'Las mujeres deben ocupar liderazgos a la par, en igualdad de condiciones y sin conformarse con impulsar solo a otros.',
        author: 'Magistrada Astrid Lemus Rodríguez',
        role: 'Abogada y magistrada',
        source: 'VI Encuentro Virtual Mujeres y Poder',
        image: img.magistrada.id,
        tone: 'corinto',
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
    ],
  })

  // --- Inicio ------------------------------------------------------------------
  console.log('Inicio…')
  await page('home', {
    title: 'Inicio',
    hero: {
      type: 'highImpact',
      kicker: 'Guatemala · desde 2013',
      media: img.ponentes.id,
      richText: doc(h('h1', 'Alianza de Mujeres y Mujeres Indígenas por el Acceso a la Justicia')),
      standfirst:
        'Articulamos 18 organizaciones para que las mujeres participen, decidan y accedan a la justicia en Guatemala.',
      links: [
        custom('/quienes-somos', 'Conoce la Alianza', 'default'),
        custom('/posts', 'Lee nuestros pronunciamientos', 'outline'),
      ],
      featured: { label: 'Nuevo pronunciamiento', post: niUnaMenos.id },
    },
    layout: [
      {
        blockType: 'intro',
        blockName: 'Quienes somos',
        kicker: 'Quiénes somos',
        heading: 'Luchando por el acceso a la justicia',
        body: 'Trabajamos para que las mujeres y las mujeres indígenas de Guatemala accedan a la justicia y participen, con voz propia, en las decisiones que definen el país.',
        highlight: 'Mujeres mayas, garífunas, xinkas, mestizas y ladinas en una sola alianza.',
        facts: [
          { value: '18', label: 'organizaciones de la sociedad civil' },
          { value: '2013', label: 'año en que se formó la Alianza' },
          { value: '6', label: 'ediciones del Encuentro Virtual Mujeres y Poder' },
        ],
      },
      {
        blockType: 'workAreas',
        blockName: 'Ejes',
        heading: 'Ejes estratégicos',
        subheading:
          'Nuestras líneas de trabajo guían nuestra labor para que las mujeres y las mujeres indígenas de Guatemala ejerzan sus derechos, participen en las decisiones y accedan a la justicia.',
        allLink: { enabled: false },
        items: [
          {
            title: 'Incidencia y acciones políticas',
            summary:
              'Llevamos la voz de las mujeres indígenas al Congreso, a las cortes y a las instituciones del Estado.',
            image: img.eje.id,
          },
          {
            title: 'Participación política de mujeres',
            summary:
              'Acompañamos a mujeres para que sean candidatas, ocupen cargos de decisión y los ejerzan sin violencia política.',
          },
          {
            title: 'Formación y fortalecimiento',
            summary:
              'Talleres, diálogos y materiales para que cada mujer conozca y defienda sus derechos.',
          },
          {
            title: 'Alianzas',
            summary:
              'Organizaciones, mujeres a lo individual y cooperantes que caminan con nosotras.',
          },
        ],
      },
      {
        blockType: 'archive',
        blockName: 'Publicaciones',
        populateBy: 'collection',
        relationTo: 'posts',
        limit: 4,
        display: 'featured',
        introContent: doc(
          h('h2', 'Últimas publicaciones'),
          p('Pronunciamientos, actividades y voces de la Alianza frente a la coyuntura del país.'),
        ),
        allLink: { enabled: true, ...custom('/posts', 'Ver todas las publicaciones') },
      },
      {
        blockType: 'mediaBlock',
        media: img.franja.id,
        fullBleed: true,
        overlayText: 'Ni una menos, vivas, libres y con derechos.',
        overlayAuthor: 'Pronunciamiento de la AMMI, 25 de noviembre de 2025'
      },
      {
        blockType: 'socialGallery',
        heading: 'Síguenos en Instagram',
        description: 'Campañas, conversatorios y transmisiones en vivo.',
        handle: '@alianzammi',
        profileUrl: 'https://www.instagram.com/alianzammi',
        posts: [
          { image: img.postNiUnaMenos.id },
          { image: img.postMagistrada.id },
          { image: img.postConversatorio.id },
          { image: img.logoRojo.id },
          { image: img.postEncuentro.id },
          { image: img.postJusticia.id },
        ],
      },
      {
        blockType: 'cta',
        backgroundImage: img.sumarse.id,
        note: '18 organizaciones ya caminan juntas',
        richText: doc(
          h('h2', '¿Tu organización quiere sumarse?'),
          p(
            'Si trabajas por los derechos de las mujeres y las mujeres indígenas, escríbenos y conversemos sobre cómo caminar juntas.',
          ),
        ),
        links: [
          { link: { ...toContacto('Contáctanos').link, appearance: 'default' } },
          custom('/quienes-somos#organizaciones', 'Conoce a las organizaciones', 'outline'),
        ],
      },
    ],
  })

  // --- Globales ----------------------------------------------------------------
  console.log('Encabezado y pie…')
  const nav = [
    custom('/', 'Inicio'),
    custom('/quienes-somos', 'Quiénes somos'),
    custom('/ejes', 'Ejes estratégicos'),
    custom('/posts', 'Publicaciones'),
  ]
  const header = await payload.findGlobal({ slug: 'header' })
  const footer = await payload.findGlobal({ slug: 'footer' })
  if (header.navItems?.length || footer.navItems?.length) {
    console.log('  El encabezado o el pie ya tienen contenido; se conservan.')
    console.log('Listo.')
    process.exit(0)
  }
  await payload.updateGlobal({
    slug: 'header',
    context: ctx,
    data: { navItems: nav, action: { enabled: true, ...toContacto('Contáctanos') } } as any,
  })

  await payload.updateGlobal({
    slug: 'footer',
    context: ctx,
    data: {
      statement: 'Para que ninguna mujer quede sola frente a la justicia.',
      contacts: [{ label: 'Escríbenos', href: '/contacto' }, { label: 'Paxil Kayala, Guatemala' }],
      navItems: [...nav, toContacto('Contacto')],
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
