const path = require('path') //eslint-disable-line
const s2clientprotocol = require('s2clientprotocol') //eslint-disable-line
const host_remote_agent = require(path.resolve(__dirname, '..', 'env', 'host_remote_agent.js'))
const remote_controller = require(path.resolve(__dirname, '..', 'lib', 'remote_controller.js'))
// const run_parallel = require(path.resolve(__dirname, '..', 'lib', 'run_parallel.js'))
// const portspicker = require(path.resolve(__dirname, '..', 'lib', 'portspicker.js'))
const utils = require(path.resolve(__dirname, './utils.js'))
const pythonUtils = require(path.resolve(__dirname, '..', 'lib', 'pythonUtils.js'))

const { assert, sequentialTaskQueue, withPython, zip } = pythonUtils
const sc_common = s2clientprotocol.common_pb
const sc_pb = s2clientprotocol.sc2api_pb

const NUM_MATCHES = 2
const STEPS = 100

const testState = new utils.TestCase()
async function testHostRemoteAgent() {
  console.log('testHostRemoteAgent:')
  async function testVsBot() {
    console.log(' running "testVsBot"')
    let bot_first = true
    testState.setUp()
    const tasks = []
    for (let i = 0; i < NUM_MATCHES; i++) {
      tasks.push(async () => { //eslint-disable-line
        const game = await host_remote_agent.VsBotFactory()
        await game.create_game(
          'Simple64',
          sc_pb.Difficulty.VERYHARD,
          bot_first
        )
        const controller = await remote_controller.RemoteControllerFactory(
          game.host, game.host_port
        )

        const join = new sc_pb.RequestJoinGame()
        const Interface = new sc_pb.InterfaceOptions()
        Interface.setRaw(true)
        join.setOptions(Interface)
        join.setRace(sc_common.Race.RANDOM)
        await controller.join_game(join)
        const gameSteps = []
        let hasPlayerResult = false
        for (let j = 0; j < STEPS; j++) {
          gameSteps.push(async () => { //eslint-disable-line
            if (hasPlayerResult) {
              return
            }
            await controller.step()
            const response_observation = await controller.observe()
            if (response_observation.getPlayerResultList().length) {
              hasPlayerResult = true
            }
          })
        }
        await sequentialTaskQueue(gameSteps)
        await controller.leave()
        await controller.close()
        bot_first = !bot_first
        game.close()
      })
    }
    await sequentialTaskQueue(tasks)
    testState.tearDown()
  }
  await testVsBot()
  /*


          const controllers = await Promise.all(
          zip(game.hosts, game.host_ports)
            .map(([host, host_port]) => remote_controller.RemoteControllerFactory(host, host_port))
        )
  */
}

testHostRemoteAgent()
