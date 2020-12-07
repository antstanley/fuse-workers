const sortIndex = (sortData, index) => {
  try {
    return sortData.sort((a, b) => {
      if (a[index] < b[index]) {
        return -1
      } else {
        return 1
      }
    })
  } catch (error) {
    console.log(error)
    return false
  }
}

export default sortIndex
