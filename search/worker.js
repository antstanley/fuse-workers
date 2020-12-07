import Fuse from 'fuse.js'
import { parentPort, workerData, isMainThread } from 'worker_threads'

const fuseSearch = ({ cleanSearch, searchData, options }) => {
  const fuse = new Fuse(searchData, options)
  const searchResult = fuse.search(cleanSearch)

  return searchResult
}

if (!isMainThread) {
  if (workerData) {
    parentPort.postMessage(fuseSearch(workerData))
  }
}
