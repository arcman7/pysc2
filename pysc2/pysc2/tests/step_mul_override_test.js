// Test that stepping without observing works correctly for multiple players.
const path = require('path')
const sc2_env = require(resolve(__dirname, '..', 'env', 'sc2_env.js'))
const actions = require(resolve(__dirname, '..', 'lib', 'actions.js'))
const utils = require(resolve(__dirname, './utils.js'))

const AGENT_INTERFACE_FORMAT = new sc2_env.AgentInterfaceFormat({
  feature_dimensions: new sc2_env.Dimensions(32, 32)
})

async function StepMulOverrideTest() {
  const testCase = new utils.TestCase()

}

StepMulOverrideTest()
