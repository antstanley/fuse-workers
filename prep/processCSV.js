import { readFileSync } from 'fs'
import neatCsv from 'neat-csv'

import createIndex from './createIndex.js'
import sortIndex from './sortIndex.js'

const processCSV = async (inputFile, indexes) => {
  try {
    const csvFile = readFileSync(inputFile, 'utf-8')
    const csvJson = await neatCsv(csvFile)
    const indexData = {}
    for (const index in indexes) {
      if (indexes.hasOwnProperty(index)) {
        indexData[index] = []
        for (let i = 0; i < csvJson.length; i++) {
          indexData[index].push(createIndex(index, csvJson[i], indexes[index]))
        }
        indexData[index] = sortIndex(indexData[index], index)
      }
    }

    console.log(`Rows processed: ${csvJson.length}`)

    return {
      data: indexData,
      records: csvJson.length
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

export default processCSV
