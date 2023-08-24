import { blocks } from '../imports/api/blocks'
import { SHA } from '../imports/api/SHA'
import { generateFromBlock } from '../imports/api/generateFromBlock'

Meteor.startup(async () => {
  const affected = []

  for (const block of blocks) {
    const { title, from, to } = block
    console.debug('--------------------------------------------------')
    const headline = `${title} (${from} .. ${to})`
    console.debug(headline)

    const inputs = [generateFromBlock(from, to).join('')]
    // use the line below if you want to test each character separately
    // inputs = generateFromBlock(from, to).join('')

    for (const input of inputs) {
      const { output, equal } = await SHA.generate(input)

      if (equal) {
        // Uncomment for super verbose mode
        // console.debug('\x1b[90m%s\x1b[0m', '[input]:', input)
        console.debug('\x1b[32m%s\x1b[0m', '[pass!]')
      }
      else {
        // uncomment for verbose mode
        // console.debug('\x1b[31m%s\x1b[0m', '[input]:', input)
        console.debug('\x1b[31m%s\x1b[0m', '[fail!]', output)
        affected.push(headline)
      }
    }
  }

  console.debug('Affected', affected.length, 'of', blocks.length)
})
