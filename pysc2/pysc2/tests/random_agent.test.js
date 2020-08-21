// Run a random agent for a few steps.
const path = require('path')
const random_agent = require(path.resolve(__dirname, '..', 'agents', 'random_agent.js'))
const run_loop = require(path.resolve(__dirname, '..', 'env', 'run_loop.js'))
const sc2_env = require(path.resolve(__dirname, '..', 'env', 'sc2_env.js'))
const utils = require(path.resolve(__dirname, './utils.js'))
const testCase = new utils.TestCase()

async function TestRandomAgent() {
  console.log('TestRandomAgent: ')
  const steps = 250
  const step_mul = 8

  async function test_random_agent_features() {
    console.log('   test_random_agent_features')
    testCase.setUp()
    const players = [
      new sc2_env.Agent([Number(sc2_env.Race.random), Number(sc2_env.Race.terran)]),
      new sc2_env.Bot([Number(sc2_env.Race.zerg), Number(sc2_env.Race.protoss)],
        sc2_env.Difficulty.easy,
        [Number(sc2_env.BotBuild.rush), Number(sc2_env.BotBuild.timing)])
    ]

    const kwargs = {
      map_name: ['Simple64', 'Simple96'],
      players,
      agent_interface_format: new sc2_env.AgentInterfaceFormat({
        feature_dimensions: new sc2_env.Dimensions(84, 64)
      }),
      step_mul,
      game_steps_per_episode: Math.floor((steps * step_mul) / 3)
    }
    const env = sc2_env.SC2Env(kwargs)
    const agent = new random_agent.RandomAgent()
    await run_loop.run_loop([agent], env, steps)
    testCase.tearDown()
  }
  await test_random_agent_features()

  async function test_random_agent_rgb() {
    console.log('   test_random_agent_rgb')
    testCase.setUp()
    const players = [
      new sc2_env.Agent([Number(sc2_env.Race.random), Number(sc2_env.Race.terran)]),
      new sc2_env.Bot([Number(sc2_env.Race.zerg), Number(sc2_env.Race.protoss)],
        sc2_env.Difficulty.easy,
        [Number(sc2_env.BotBuild.rush), Number(sc2_env.BotBuild.timing)])
    ]

    const kwargs = {
      map_name: ['Simple64', 'Simple96'],
      players,
      agent_interface_format: new sc2_env.AgentInterfaceFormat({
        rgb_dimensions: new sc2_env.Dimensions(128, 64)
      }),
      step_mul,
      game_steps_per_episode: Math.floor((steps * step_mul) / 3)
    }
    const env = sc2_env.SC2Env(kwargs)
    const agent = new random_agent.RandomAgent()
    await run_loop.run_loop([agent], env, steps)
    testCase.tearDown()
  }
  await test_random_agent_rgb()

  async function test_random_agent_all() {
    console.log('   test_random_agent_all')
    testCase.setUp()
    const players = [
      new sc2_env.Agent([Number(sc2_env.Race.random), Number(sc2_env.Race.terran)]),
      new sc2_env.Bot([Number(sc2_env.Race.zerg), Number(sc2_env.Race.protoss)],
        sc2_env.Difficulty.easy,
        [Number(sc2_env.BotBuild.rush), Number(sc2_env.BotBuild.timing)])
    ]

    const kwargs = {
      map_name: ['Simple64', 'Simple96'],
      players,
      agent_interface_format: new sc2_env.AgentInterfaceFormat({
        feature_dimensions: new sc2_env.Dimensions(84, 64),
        rgb_dimensions: new sc2_env.Dimensions(128, 64),
        action_space: sc2_env.ACtionSpace.FEATURES,
        use_unit_counts: true,
        use_feature_units: true
      }),
      step_mul,
      game_steps_per_episode: Math.floor((steps * step_mul) / 3)
    }
    const env = sc2_env.SC2Env(kwargs)
    const agent = new random_agent.RandomAgent()
    await run_loop.run_loop([agent], env, steps)
    testCase.tearDown()
  }
  await test_random_agent_all()
}

TestRandomAgent()
