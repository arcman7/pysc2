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


 Simplified 

Python:

a = [delay / total for delay in delays]

JavaScript:

var a = Object.keys(delays).map((key) => {
    var delay = delays[key]
    return delay / total
})

*/

const np = require('./numpy.js')

describe('numpy:', () => {
  test('cumsum', () => {
    const a = [1, 2, 3, 4]
    const b = np.cumsum(a)
    // b should like [1, 3, 6, 10]
    expect(b.length).toBe(4)
    expect(b[0]).toBe(1)
    expect(b[1]).toBe(3)
    expect(b[2]).toBe(6)
    expect(b[3]).toBe(10)
  })
})
