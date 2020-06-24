const path = require('path') //eslint-disable-line
const np = require(path.resolve(__dirname, './numpy.js'))

async function summarize_array_diffs(lhs, rhs) {
  //Output value differences, with index for each, between two arrays.//
  if (Array.isArray(lhs)) {
    lhs = np.tensor(lhs)
  }
  const diff = lhs.sub(rhs)
  const mask = diff.abs().greater([0]).asType('bool')
  const coords = (await np.whereAsync(mask)).arraySync()
  if (coords.length === 0) {
    return ''
  }
  const str = coords.map((coord) => {
    if (coord.length === 1) {
      return `[${coord[0]}]: ${np.getValueAt(lhs, coord)} -> ${np.getValueAt(rhs, coord)}`
    }
    const tempStr = coord.join('][')
    return `[${tempStr}]: ${np.getValueAt(lhs, coord)} -> ${np.getValueAt(rhs, coord)}`
  }).join('; ')
  return `${coords.length} element(s) changed - ${str}`
}

module.exports = {
  summarize_array_diffs,
}
