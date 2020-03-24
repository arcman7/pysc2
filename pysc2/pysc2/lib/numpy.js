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

const tf = require('@tensorflow/tfjs')
require('@tensorflow/tfjs-node'); //eslint-disable-line
module.exports = {
  cumsum() {
    return tf.cumsum(...arguments).dataSync() //eslint-disable-line
  },
}
