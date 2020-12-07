import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const config = async (configFile, searchFile, inputFile) => {
  try {
    const cwd = process.cwd()
    let options = {}
    if (configFile) {
      const fileLoc = join(cwd, configFile)
      if (existsSync(fileLoc)) {
        options = JSON.parse(readFileSync(fileLoc, 'utf8'))
      } else {
        throw new Error(`${configFile} does not exist`)
      }
    }

    if (searchFile) {
      const fileLoc = join(cwd, searchFile)
      if (existsSync(fileLoc)) {
        options.searchFile = searchFile
      } else {
        console.error(
          `searchFile: ${searchFile} does not exist, using file specified in config file`
        )
      }
    }

    if (inputFile) {
      const fileLoc = join(cwd, inputFile)
      if (existsSync(fileLoc)) {
        options.inputFile = inputFile
      } else {
        console.error(`inputFile: ${inputFile} does not exist`)
      }
    }
    return options
  } catch (error) {
    return {
      error
    }
  }
}

export default config
