// Solve the nm_easy map using a fixed policy by reading the feature layers.
const path = require('path') //eslint-disable-line
const scripted_agent = require(path.resolve(__dirname, '..', 'agents', 'scripted_agent.js'))
const run_loop = require(path.resolve(__dirname, '..', 'env', 'run_loop.js'))
const sc2_env = require(path.resolve(__dirname, '..', 'env', 'sc2_env.js'))
const pythonUtils = require(path.resolve(__dirname, '..', 'lib', 'pythonUtils.js'))
const utils = require(path.resolve(__dirname, '..', './utils.js'))
const { assert } = pythonUtils

async function TestEasy() {
  console.log('TestEasy')
  const testCase = utils.TestCase()
  const steps = 200
  const step_mul = 16
  async function test_move_to_beacon() {
    console.log('   test_move_to_beacon')
    testCase.setUp()
    const env = new sc2_env.SC2Env({
      map_name: 'MoveToBeacon',
      players: [new sc2_env.Agent(Number(sc2_env.Race.terran))],
      agent_interface_format: new sc2_env.AgentInterfaceFormat({
        feature_dimensions: new sc2_env.Dimensions(84, 64)
      }),
      step_mul: step_mul,
      game_steps_per_episode: steps * step_mul
    })
    const agent = scripted_agent.MoveToBeacon()
    await run_loop.run_loop([agent], env, steps)

    testCase.tearDown()
    assert(agent.episodes <= agent.reward, 'Error: agent.episodes <= agent.reward')
    assert(agent.stpes == steps, 'Error: agent.steps == steps')
  }
  await test_move_to_beacon()
}

TestEasy()
