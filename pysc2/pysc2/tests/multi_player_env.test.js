const path = require('path')
const random_agent = require(path.resolve(__dirname, '..', 'agents', 'random_agent.js'))
const run_loop = require(path.resolve(__dirname, '..', 'env', 'run_loop.js'))
const sc2_env = require(path.resolve(__dirname, '..', 'env', 'sc2_env.js'))
const utils = require(path.resolve(__dirname, '..', 'tests', 'utils.js'))

const testCase = new utils.TestCase()

async function TestMultiplayerEnv() {
  console.log('TestMultiplayerEnv: ')
  const step = 100
  const step_mul = 16
  const players = 2

  async function test_multi_player_env_features () {
    console.log('   test_multi_player_env_features')
    testCase.setUp()
    const env = new sc2_env.AgentIterfaceFormat({
      feature_dimentions: new sc2_env.Dimensions(84, 64),
    })
    const env = new sc2_env.
  }
}