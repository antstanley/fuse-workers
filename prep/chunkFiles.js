import { writeFileSync } from 'fs'

const chunkFiles = (fileName, sortedData, chunks, records) => {
  try {
    const chunkSize = Math.ceil(records / chunks)

    let counter = 0

    for (let i = 0; i < chunks; i++) {
      let dataChunk = []
      for (let x = 0; x < chunkSize; x++) {
        if (counter < records) {
          dataChunk.push(sortedData[counter])
          counter++
        }
      }
      console.log(`chunk: ${i}\nrecords:${counter}`)
      writeFileSync(`${fileName}.chunk${i}`, JSON.stringify(dataChunk), 'utf8')
    }

    return {
      chunks,
      chunkSize,
      counter
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

export default chunkFiles
