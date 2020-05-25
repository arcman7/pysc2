// A run loop for agent/environment interaction.
const path = require('path')
const { performance } = require('perf_hooks')
const pythonUtils = require(path.resolve(__dirname, '..', 'lib', 'pythonUtils.js'))
const { zip } = pythonUtils

function run_loop(agents, env, max_frames = 0, max_episodes = 0) {
  // A run loop to have agents and an environment interact.
  let total_frames = 0
  let total_episodes = 0
  const start_time = performance.now() * 1000

  const observation_spec = env.observation_spec()
  const action_spec = env.action_spec()
  const temp = zip(agents, observation_spec, action_spec)
  // for (const [agent, obs_spec, act_spec] of temp) {
  //   agent.setup(obs_spec, act_spec)
  // }
  temp.forEach(([agent, obs_spec, act_spec]) => {
    agent.setup(obs_spec, act_spec)
  })

  try {
    while (!(max_episodes) || total_episodes < max_episodes) {
      total_episodes += 1
      let timesteps = env.reset()
      Object.keys(agents).forEach((key) => {
        const a = agents[key]
        a.reset()
      })
      while (true) {
        total_frames += 1
        const actions = []
        if (max_frames && total_frames >= max_frames) {
          return
        }
        if (timesteps[0].last()) {
          break
        }
        timesteps = env.step(actions)
      }
    }
  } catch (KeyboardInterrupt) {
    return
  } finally {
    const elapsed_time = performance.now() * 1000 - start_time
    const frame_ratio = total_frames / elapsed_time
    console.log("Took ", elapsed_time.toFixed(3), "seconds for ", total_frames, "steps: ", frame_ratio.toFixed(3), "fps")
  }
}

module.exports = {
  run_loop
}
