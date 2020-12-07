import processCSV from './processCSV.js'
import chunkFiles from './chunkFiles.js'
import { join } from 'path'

const prep = async options => {
  if (options.inputFile) {
    if (options.searchFile) {
      if (options.indexes) {
        console.time('Process CSV')
        const prepData = await processCSV(
          join(process.cwd(), options.inputFile),
          options.indexes
        )
        console.timeEnd('Process CSV')

        if (prepData) {
          const { data, records } = prepData
          console.log(`Records processed: ${records}`)
          if (options.chunks) {
            for (const index in data) {
              if (data.hasOwnProperty(index)) {
                console.log(`Processing index: ${index}`)
                const chunkSort = chunkFiles(
                  join(process.cwd(), options.searchFile),
                  data[index],
                  options.chunks,
                  records
                )
                if (chunkSort) {
                  console.log(`${index} - Chunks created: ${chunkSort.chunks}`)
                  console.log(`${index} - Chunk Size: ${chunkSort.chunkSize}`)
                  console.log(
                    `${index} - Total records chunked: ${chunkSort.counter}`
                  )
                }
              }
            }
          }
        }
      } else {
        console.log('Search Indexes not specified')
      }
    } else {
      console.log('No output file specified')
    }
  } else {
    console.log('No input file specified')
  }
}

export default prep
