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

const mod = (n: number, m: number) => ((n % m) + m) % m

export const cholqij = (date: Date) => {
  const n = julianDay(date.getFullYear(), date.getMonth() + 1, date.getDate()) - 584283
  const numero = mod(n + 3, 13)
  const nawal = NAWALES[mod(n + 19, 20)]
  return { numero: numero + 1, nawal, nombre: `${NUMEROS[numero]} ${nawal}` }
}
