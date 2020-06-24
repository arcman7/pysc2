const path = require('path') //eslint-disable-line
const pythonUtils = require(path.resolve(__dirname, './pythonUtils.js'))
const { arraySub, nonZero } = pythonUtils

function summarize_array_diffs(lhs, rhs) {
  // Output value differences, with index for each, between two arrays.
  const indices = nonZero(arraySub(lhs, rhs))
  if (indices.length == 0) {
    return ""
  }
  const str = indices.map((coord) => {
    console.log('length: ', coord.length)
    if (coord.length == null) {
      return `[${coord}]: ${lhs[coord]} -> ${rhs[coord]}`
    }
    const tempstr = coord.join('][')
    return `[${tempstr}]: ${lhs[coord[0]][coord[1]]} -> ${rhs[coord[0]][coord[1]]}`
  }).join('; ')
  return `${indices.length} element(s) changed - ${str}`
}

module.exports = {
  summarize_array_diffs,
}
