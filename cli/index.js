import search from '../search/index.js'
import config from '../config/index.js'
import prep from '../prep/index.js'

const cli = async args => {
  try {
    const validCommands = ['search', 'prep']
    const command = args._[0] || null

    if (command) {
      if (validCommands.includes(command)) {
        let configFile = args.config || args.c || false
        const searchFile = args.search || args.s || false
        const inputFile = args.input || args.i || false

        if (!configFile && !searchFile && !inputFile) {
          configFile = './search.config.json'
        }

        const options = await config(configFile, searchFile, inputFile)

        if (!options.error) {
          switch (command) {
            case 'prep':
              prep(options)
              break
            case 'search':
              const searchTerm = args._[1] || null
              if (searchTerm) {
                search(options, searchTerm)
              } else {
                console.log('Please specify a search term')
              }
              break
          }
        } else {
          console.log(options.error)
        }
      } else {
        console.log(`Command '${command}' not recognised`)
      }
    } else {
      console.log('No command specified')
    }
  } catch (error) {
    console.log(error)
  }
}

export default cli
