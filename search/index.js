import { join } from 'path'
import { readFileSync } from 'fs'

import handleWorkers from './handleWorkers.js'

const cleanString = str => {
  return str
    .replace(/\s/g, '')
    .replace(
      /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
      ''
    )
}

const loadData = (searchFile, chunks) => {
  const datachunks = []
  for (let i = 0; i < chunks; i++) {
    const chunkFile = `${searchFile}.chunk${i}`
    datachunks.push(
      JSON.parse(readFileSync(join(process.cwd(), chunkFile), 'utf8'))
    )
  }
  return datachunks
}

let searchData

const search = async (
  { searchFile, searchOptions, chunks, indexes, results = 10 },
  searchTerm
) => {
  try {
    if (!searchFile) {
      return 'Search file not specified'
    }

    if (!searchData) {
      searchData = loadData(searchFile, chunks)
    }

    let options = {}
    const defaultOptions = {
      shouldSort: true,
      includeScore: true,
      threshold: 0.3,
      location: 0,
      distance: 3,
      maxPatternLength: 32,
      minMatchCharLength: 6
    }

    if (!searchOptions) {
      options = defaultOptions
    } else {
      options = Object.assign({}, defaultOptions, searchOptions)
    }

    const workerScript = new URL('./worker.js', import.meta.url)
    const cleanSearch = cleanString(searchTerm)
    const searchResponse = {}
    console.time('Search')
    for (const index in indexes) {
      if (indexes.hasOwnProperty(index)) {
        options.keys = indexes[index].keys
        const workerResponse = await handleWorkers(
          cleanSearch,
          searchData,
          options,
          chunks,
          workerScript
        )
        searchResponse[index] = workerResponse.slice(0, results)
      }

      console.log(JSON.stringify(searchResponse, '', 2))
    }
    console.timeEnd('Search')
  } catch (error) {
    console.log(error)
  }
}

export default search
