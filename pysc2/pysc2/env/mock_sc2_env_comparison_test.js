/*Tests that mock environment has same shape outputs as true environment.*/
const path = require('path')
const mock_sc2_env = require(path.resolve(__dirname, './mock_sc2_env.js'))
const sc2_env = require(path.resolve(__dirname, './sc2_env.js'))
const pythonUtils = require(path.resolve(__dirname, '..', 'lib', 'pythonUtils.js'))
const { assert } = pythonUtils

async function tearDown(env, mock_env) {
  await env.close()
  await mock_env.close()
}

async function TestCompareEnvironments() {
  function setUpEnv() {
    const race1 = sc2_env.Race.terran
    const race2 = sc2_env.Race.protoss
    const player1 = new sc2_env.Agent(race1)
    const player2 = new sc2_env.Agent(race2)
    const players = [player1, player2]
    const featureDim = new sc2_env.Dimensions([32, 32], [8, 16])
    const rgbDim1 = new sc2_env.Dimensions([31, 63], [7, 15])
    const aif1 = new sc2_env.AgentInterfaceFormat({
      feature_dimensions: featureDim,
      rgb_dimensions: rgbDim1,
      action_space: sc2_env.ActionSpace.FEATURES
    })
    const rgbDim2 = new sc2_env.Dimensions(64, 32)
    const aif2 = new sc2_env.AgentInterfaceFormat({
      rgb_dimensions: rgbDim2
    })

    const env = new sc2_env.SC2Env({
      map_name: 'Flat64',
      players: players,
      agent_interface_format: [aif1, aif2]
    })
    return env
  }

  function setUpMockEnv() {
    const race1 = sc2_env.Race.terran
    const race2 = sc2_env.Race.protoss
    const player1 = new sc2_env.Agent(race1)
    const player2 = new sc2_env.Agent(race2)
    const players = [player1, player2]
    const featureDim = new sc2_env.Dimensions([32, 32], [8, 16])
    const rgbDim1 = new sc2_env.Dimensions([31, 63], [7, 15])
    const aif1 = new sc2_env.AgentInterfaceFormat({
      feature_dimensions: featureDim,
      rgb_dimensions: rgbDim1,
      action_space: sc2_env.ActionSpace.FEATURES
    })
    const rgbDim2 = new sc2_env.Dimensions(64, 32)
    const aif2 = new sc2_env.AgentInterfaceFormat({
      rgb_dimensions: rgbDim2
    })
    const mock_env = new mock_sc2_env.SC2TestEnv({
      map_name: 'Flat64',
      players: players,
      agent_interface_format: [aif1, aif2]
    })
    return mock_env
  }

  async function test_observation_spec() {
    const env = setUpEnv()
    const mock_env = setUpMockEnv()
    assert(env.observation_spec(), mock_env.observation_spec())
  }
  await test_observation_spec()

  async function test_action_spec() {
    const env = setUpEnv()
    const mock_env = setUpMockEnv()
    assert(env.action_spec(), mock_env.action_spec())
  }
  await test_action_spec()
}

TestCompareEnvironments().then(() => tearDown())
