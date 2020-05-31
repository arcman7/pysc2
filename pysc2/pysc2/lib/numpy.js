/* list comprehensions

Python:
cumulative_sum = np.cumsum([delay / total for delay in delays])

JavaScript:

// 1st version (simple way)
var result = []
Object.keys(delays).forEach((key) => {
    var delay = delays[key]
    result.push(delay / total)
})
np.cumsum(result)


// 2nd version
np.cumsum(Object.keys(delays).map((key) => {
    var delay = delays[key]
    return delay / total
}))


**** Simplified ****

Python:

a = [delay / total for delay in delays]

JavaScript:

var a = Object.keys(delays).map((key) => {
    var delay = delays[key]
    return delay / total
})

*/
/*eslint-disable prefer-rest-params*/
const tf = require('@tensorflow/tfjs')
require('@tensorflow/tfjs-node'); //eslint-disable-line
const foo = tf.tensor([1])
const TensorMeta = foo.constructor // currently unknown where else to get this value
module.exports = {
  absolute: tf.abs,
  abs: tf.abs,
  arange() {
    if (arguments.length === 1) {
      return tf.range(0, arguments[0])
    }
    return tf.range(...arguments)
  },
  array: tf.tensor,
  argMin: tf.argMin,
  argMax: tf.argMax,
  cumsum() {
    return tf.cumsum(...arguments).dataSync() //eslint-disable-line
  },
  getValueAt(arr, index) {
    if (arr instanceof TensorMeta) {
      arr = arr.arraySync()
    }
    if (Number.isInteger(index)) {
      return arr[index]
    }
    let curVal = arr
    for (let i = 0; i < index.length; i++) {
      curVal = curVal[index[i]]
    }
    return curVal
  },
  getCol(tensor, col) {
    const temp = tf.transpose(tensor)
    return temp.slice(col, 1)
  },
  greater: tf.greater,
  greaterEqual: tf.greaterEqual,
  less: tf.less,
  mean: tf.mean,
  mod: tf.mod,
  ndarray: tf.tensor,
  norm: tf.norm,
  ones: tf.ones,
  round: tf.round,
  range: tf.range,
  stack: tf.stack,
  tensor: tf.tensor,
  TensorMeta, // used for type checking
  transpose: tf.transpose,
  where: tf.where,
  whereAsync: tf.whereAsync,
  util: tf.util,
  zeros: tf.zeros,
  zip(tensorA, tensorB) {
    if (Array.isArray(tensorA)) {
      tensorA = tf.tensor(tensorA)
    }
    if (Array.isArray(tensorB)) {
      tensorA = tf.tensor(tensorB)
    }
    return tf.transpose(tf.stack([tensorA, tensorB]))
  },
}
