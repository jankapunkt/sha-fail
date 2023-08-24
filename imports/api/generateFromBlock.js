export const generateFromBlock = (from, to) => {
  const fromN = Number(`0x${from}`)
  const toN = Number(`0x${to}`)
  const chars = []

  for (let i = fromN; i <= toN; i++ ) {
    chars.push(String.fromCodePoint(i))
  }

  return chars
}
