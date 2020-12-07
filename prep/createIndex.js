const cleanString = str => {
  return str
    .replace(/\s/g, '')
    .replace(
      /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
      ''
    )
}

const createIndex = (indexName, data, index) => {
  const { compoundKeys, fields } = index

  const compoundIndex = compoundKeys
    .map(key => {
      return data[key]
    })
    .join('')

  const fieldMap = {}
  fieldMap[indexName] = cleanString(compoundIndex)

  for (const field in fields) {
    if (fields.hasOwnProperty(field)) {
      fieldMap[field] = data[fields[field]]
    }
  }

  return fieldMap
}

export default createIndex
