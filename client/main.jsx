import { Meteor } from 'meteor/meteor';
import { SHA } from '../imports/api/SHA'
import { blocks } from '../imports/api/blocks'
import { generateFromBlock } from '../imports/api/generateFromBlock'

Meteor.startup(async () => {

  for (const block of blocks) {
    const { title, from, to } = block
    console.debug('--------------------------------------------------')
    console.debug(title, from, '..', to)

    const inputs = [generateFromBlock(from, to).join('')]

    for (const input of inputs) {
      const { output, equal } = await SHA.generate(input)

      if (equal) {
        // Uncomment for super-verbose mode
        // console.debug('\x1b[90m%s\x1b[0m', '[input]:', input)
        console.debug('[pass!]')
      }
      else {
        // Uncomment for verbose mode
        // console.debug('[input]:', input)
        console.debug('[fail!]:', JSON.stringify(output, null, 2))
      }
    }
  }
});
