import { join } from 'path'
import { readFileSync } from 'fs'
import { Worker } from 'worker_threads'

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

const search = async ({ searchFile, searchOptions, chunks }, searchTerm) => {
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
      minMatchCharLength: 6,
      keys: ['nameIdx', 'addressIdx']
    }

    if (!searchOptions) {
      options = defaultOptions
    } else {
      options = Object.assign({}, defaultOptions, searchOptions)
    }
    console.log(searchTerm)
    const workerScript = new URL('./worker.js', import.meta.url)
    const cleanSearch = cleanString(searchTerm)
    let resultArray = []

    for (let i = 0; i < chunks; i++) {
      const workerData = {
        cleanSearch,
        searchData: searchData[i],
        options
      }

      const worker = new Worker(workerScript, { workerData })

      worker.on('message', sortedArray => {
        if (sortedArray.length > 0) {
          if (sortedArray[0].score === 0) {
            console.log(sortedArray[0])

            return sortedArray[0]
          }
        }
        resultArray.push(sortedArray)
      })
      worker.on('error', error => console.error('error', error))
      worker.on('exit', () => {
        if (resultArray.length === chunks) {
          // console.log(JSON.stringify(resultArray, '', 2))

          const searchResults = resultArray.reduce((newArray, workerArray) => {
            const reducedArray = newArray.concat(
              workerArray.map(responseItem => {
                const { item, score } = responseItem
                const { ...fields } = item
                return { ...fields, score }
              })
            )
            return reducedArray
          })

          const sortedResults = searchResults.sort((a, b) => {
            if (a.score > b.score) {
              return 1
            } else {
              return -1
            }
          })

          console.log(JSON.stringify(sortedResults, '', 2))
        }
      })
    }
    /*const searchResults = resultArray.map(workerArray => {
      return workerArray.map(responseItem => {
        const { item, score } = responseItem
        const { ...fields } = item
        return { ...fields, score }
      })
    })
    console.log(JSON.stringify(searchResults, '', 2))
    console.timeEnd('Search')
    */
  } catch (error) {
    console.log(error)
  }
}

export default search
