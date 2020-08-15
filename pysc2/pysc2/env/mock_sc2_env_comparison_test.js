/*Tests that mock environment has same shape outputs as true environment.*/
const path = require('path') //eslint-disable-line
const mock_sc2_env = require(path.resolve(__dirname, './mock_sc2_env.js'))
const sc2_env = require(path.resolve(__dirname, './sc2_env.js'))
const pythonUtils = require(path.resolve(__dirname, '..', 'lib', 'pythonUtils.js'))
const { assert } = pythonUtils

let env
let mock_env
async function tearDown() {
  await env.close()
  await mock_env.close()
}

async function TestCompareEnvironments() {
  function setUpEnv() {
    const players = [
      new sc2_env.Agent(sc2_env.Race.terran),
      new sc2_env.Agent(sc2_env.Race.protoss),
    ]
    const kwargs = {
      map_name: 'Flat64',
      players,
      'agent_interface_format': [
        new sc2_env.AgentInterfaceFormat({
          feature_dimensions: new sc2_env.Dimensions(
            [32, 64],
            [8, 16]
          ),
          rgb_dimensions: new sc2_env.Dimensions(
            [31, 63],
            [7, 15]
          ),
          action_space: sc2_env.ActionSpace.FEATURES,
        }),
        new sc2_env.AgentInterfaceFormat({
          rgb_dimensions: new sc2_env.Dimensions(64, 32)
        }),
      ]
    }

    env = new sc2_env.SC2Env(kwargs)
    mock_env = new mock_sc2_env.SC2TestEnv(kwargs)
  }

  async function test_observation_spec() {
    setUpEnv()
    assert(env.observation_spec(), mock_env.observation_spec())
  }
  await test_observation_spec()

  async function test_action_spec() {
    setUpEnv()
    assert(env.action_spec(), mock_env.action_spec())
  }
  await test_action_spec()
}

TestCompareEnvironments().then(() => tearDown())
