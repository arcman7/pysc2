const path = require('path') //eslint-disable-line
const run_parallel = require(path.resolve(__dirname, './run_parallel.js'))

describe('run_parallel.js:', () => {
  describe('  RunParallelTest:', () => {
    test('test_returns_expected_values', async () => {
      const pool = await run_parallel.RunParallel()
      const out = pool.run([Number])
      expect(out).toMatchObject([0])
    })
  })
})
