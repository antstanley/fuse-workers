import { Worker } from 'worker_threads'

const handleWorkers = (
  cleanSearch,
  searchData,
  options,
  chunks,
  workerScript
) => {
  return new Promise((resolve, reject) => {
    let resultArray = []
    let workerCounter = 0
    const errors = {
      count: 0,
      messages: []
    }
    for (let i = 0; i < chunks; i++) {
      const workerData = {
        cleanSearch,
        searchData: searchData[i],
        options
      }
      const worker = new Worker(workerScript, { workerData })

      worker.on('message', sortedArray => {
        resultArray.push(sortedArray)
      })
      worker.on('error', error => {
        errors.count++
        errors.messages.push(error)
        console.error(`error in chunk ${1}`, error)
        if (errors.count == chunks) reject(errors)
      })
      worker.on('exit', () => {
        workerCounter++
        if (workerCounter === chunks) {
          if (resultArray.length === chunks) {
            const searchResults = resultArray
              .reduce((newArray, workerArray) => {
                const reducedArray = newArray.concat(
                  workerArray.map(responseItem => {
                      
                    const { item, score } = responseItem
                    const { ...fields } = item
                    if (fields.item) {
                        console.log(fields)
                      const { ...nestedFields } = fields.item
                      return { ...nestedFields, score }
                    } else {
                      return { ...fields, score }
                    }
                  })
                )
                return reducedArray
              })
              .sort((a, b) => {
                if (a.score == b.score) {
                  const aKeys = Object.keys(a)
                  const bKeys = Object.keys(b)

                  if (a[aKeys[0]] > b[bKeys[0]]) {
                    return 1
                  } else {
                    return -1
                  }
                } else {
                  if (a.score > b.score) {
                    return 1
                  } else {
                    return -1
                  }
                }
              })

            resolve(searchResults)
          }
        }
      })
    }
  })
}

export default handleWorkers
