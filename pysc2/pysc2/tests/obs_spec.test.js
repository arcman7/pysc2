const path = require('path') //eslint-disable-line
const { performance } = require('perf_hooks') //eslint-disable-line
const s2clientprotocol = require('s2clientprotocol') //eslint-disable-line
const random_agent = require(path.resolve(__dirname, '..', 'agents', 'random_agent.js'))
const sc2_env = require(path.resolve(__dirname, '..', 'env', 'sc2_env.js'))
const utils = require(path.resolve(__dirname, './utils.js'))
const pythonUtils = require(path.resolve(__dirname, '..', 'lib', 'pythonUtils.js'))

async function TestObservationSpec() {
  const env = new sc2_env.SC2Env({
    map_name: 'Simple64',
    players: [
      new sc2_env.Agent(Number(sc2_env.Race.random)),
      new sc2_env.Bot(Number(sc2_env.Race.random), Number(sc2_env.Difficulty.easy))
    ],
    agent_interface_format: new sc2_env.AgentInterfaceFormat({
      feature_dimensions: new sc2_env.Dimensions(
        [84, 87],
        [64, 67]
      )
    })
  })

  const multiplayer_obs_spec = env.observation_spec()
}