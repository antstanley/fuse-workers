const cleanString = str => {
  return str
    .replace(/\s/g, '')
    .replace(
      /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
      ''
    )
}

const createIndex = (indexName, data, index) => {
  const { keys, fields } = index

  const compoundIndex = keys
    .map(key => {
      return data[key]
    })
    .join('')

  const fieldMap = {}
  fieldMap[indexName] = cleanString(compoundIndex)

  for (const field in fields) {
    fieldMap[field] = data[fields[field]]
  }

  return fieldMap
}

export default createIndex
