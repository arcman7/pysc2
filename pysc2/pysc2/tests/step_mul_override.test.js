// Test that stepping without observing works correctly for multiple players.
const path = require('path')
const sc2_env = require(path.resolve(__dirname, '..', 'env', 'sc2_env.js'))
const actions = require(path.resolve(__dirname, '..', 'lib', 'actions.js'))
const utils = require(path.resolve(__dirname, './utils.js'))
const pythonUtils = require(path.resolve(__dirname. '..', 'lib', 'pythonUtils.js'))
const { assert } = pythonUtils

const AGENT_INTERFACE_FORMAT = new sc2_env.AgentInterfaceFormat({
  feature_dimensions: new sc2_env.Dimensions(32, 32)
})

async function StepMulOverrideTest() {
  console.log('StepMulOverrideTest')
  const testCase = new utils.TestCase()
  async function test_returns_game_loop_zero_on_first_step_despite_override() {
    console.log('=== test_returns_game_loop_zero_on_first_step_despite_override ===')
    testCase.setUp()
    const env = new sc2_env.SC2Env({
      map_name: 'DefeatRoaches',
      players: [new sc2_env.Agent(Number(sc2_env.Race.random))],
      step_mul: 1,
      agent_interface_format: AGENT_INTERFACE_FORMAT
    })
    const timestep = await env.step([actions.FUNCTIONS.no_op()], 1234)
    assert(timestep[0].observation.game_loop[0] == 0, 'Error: timestep[0].observation.game_loop[0] == 0')
    await testCase.tearDown()
  }
  await test_returns_game_loop_zero_on_first_step_despite_override()

  async function test_respects_override() {
    console.log('=== test_respects_override ===')
    testCase.setUp()
    const env = sc2_env.SC2Env({
      map_name: 'DefeatRoaches',
      players: [sc2_env.Agent(Number(sc2_env.Race.random))],
      step_mul: 1,
      agent_interface_format: AGENT_INTERFACE_FORMAT
    })

    let expected_game_loop = 0
    for (let delta = 0; delta < 10; delta += 1) {
      const timestep = await env.step([actions.FUNCTIONS.no_op()], delta)
      expected_game_loop += delta
      assert(timestep[0].observation.game_loop[0] == expected_game_loop, 'Error: timestep[0].observation.game_loop[0] == expected_game_loop')
    }
    await testCase.tearDown()
  }
  await test_respects_override()
}
StepMulOverrideTest()
