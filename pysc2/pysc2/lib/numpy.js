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
module.exports = {
  cumsum() {
    return tf.cumsum(...arguments).dataSync() //eslint-disable-line
  },
  arange() {
    if (arguments.length === 1) {
      return tf.range(0, arguments[0])
    }
    return tf.range(...arguments)
  },
  range: tf.range,
  ndarray: tf.tensor,
  zeros: tf.zeros,
  ones: tf.ones,
  absolute: tf.abs,
  abs: tf.abs,
  tensor: tf.tensor,
  mod: tf.mod,
  where: tf.where,
  
  getCol(tensor, col) {
    const temp = tf.transpose(tensor)
    return temp.slice(col, 1)
  },
  greater: tf.greater,
  greaterEqual: tf.greaterEqual,
  less: tf.less,
  stack: tf.stack,
  transpose: tf.transpose,
  util: tf.util,
  zip(tensorA, tensorB) {
    return tf.transpose(tf.stack([tensorA, tensorB]))
  }
}
