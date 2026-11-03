// Cholq'ij: calendario sagrado maya de 260 días (13 números × 20 nawales).
// Correlación GMT 584283; nombres y números en kaqchikel, como firma AMMI sus pronunciamientos.
const NAWALES = [
  'Imox',
  "Iq'",
  "Aq'ab'al",
  "K'at",
  'Kan',
  'Keme',
  'Kej',
  "Q'anil",
  'Toj',
  "Tz'i'",
  "B'atz'",
  'E',
  'Aj',
  "I'x",
  "Tz'ikin",
  'Ajmaq',
  "No'j",
  'Tijax',
  'Kawoq',
  'Ajpu',
]

const NUMEROS = [
  'Jun',
  "Ka'i'",
  "Oxi'",
  "Kaji'",
  "Wo'o'",
  "Waqi'",
  "Wuqu'",
  "Waqxaqi'",
  "B'elej",
  'Lajuj',
  'Julajuj',
  "Kab'lajuj",
  "Oxlajuj",
]

const julianDay = (y: number, m: number, d: number) => {
  const a = Math.floor((14 - m) / 12)
  const yy = y + 4800 - a
  const mm = m + 12 * a - 3
  return (
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  )
}

// Significado breve de cada nawal, en el mismo orden que NAWALES
const SIGNIFICADOS = [
  'Agua, lo oculto, la intuición.',
  'Viento, aliento de vida, la palabra.',
  'Amanecer, renovación, nuevos comienzos.',
  'Red, abundancia, lo que une a la comunidad.',
  'Serpiente, energía vital, sabiduría.',
  'Muerte y renacimiento, las abuelas y los abuelos.',
  'Venado, fuerza, equilibrio, autoridad.',
  'Semilla, fertilidad, la siembra.',
  'Ofrenda, gratitud, reciprocidad.',
  'Perro, justicia, la ley y la autoridad.',
  'Hilo, el tejido del tiempo, las artes.',
  'Camino, el viaje, el destino.',
  'Caña, el hogar, la familia.',
  'Jaguar, la fuerza de la Madre Tierra.',
  'Pájaro, libertad, visión, buena fortuna.',
  'Perdón, reconciliación.',
  'Pensamiento, sabiduría, el buen consejo.',
  'Pedernal, sanación, la palabra que corta lo injusto.',
  'Comunidad, la familia, la lluvia que renueva.',
  'Sol, plenitud, la fuerza de las y los guerreros.',
]

// Glifos de Bluebalam (CC BY-SA 4.0, Wikimedia Commons): 01–10 en SVG original,
// 11–20 como PNG de alta resolución. Se pueden reemplazar por SVG con el mismo número.
const GLIFOS_PNG = new Set([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])

const mod = (n: number, m: number) => ((n % m) + m) % m

export const cholqij = (date: Date) => {
  const n = julianDay(date.getFullYear(), date.getMonth() + 1, date.getDate()) - 584283
  const numero = mod(n + 3, 13)
  const indice = mod(n + 19, 20)
  const nawal = NAWALES[indice]!
  return {
    numero: numero + 1,
    nawal,
    nombre: `${NUMEROS[numero]} ${nawal}`,
    significado: SIGNIFICADOS[indice]!,
    /** Glifo del día en /public/brand/nawales (01 = Imox … 20 = Ajpu) */
    glifo: `/brand/nawales/${String(indice + 1).padStart(2, '0')}.${GLIFOS_PNG.has(indice + 1) ? 'png' : 'svg'}`,
  }
}
