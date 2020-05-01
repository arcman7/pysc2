const path = require('path'); //eslint-disable-line
const base_agent = require(path.resolve(__dirname, './base_agent.js'))
const actions = require(path.resolve(__dirname, '..', 'lib', './actions.js'))
const pythonUtils = require(path.resolve(__dirname, '..', 'lib', './pythonUtils.js'))
const { randomChoice } = pythonUtils

class RandomAgent extends base_agent.BaseAgent {
  // A random agent for starcraft. //
  step(obs) {
    super.step(obs)
    const function_id = randomChoice(obs.observation.available_actions)
    const args = []
    Object.keys(this.action_spec.functions[function_id].args).forEach((key) => {
      const arg = this.action_spec.functions[function_id].args[key]
      Object.keys(arg.sizes).forEach((k) => {
        const size = arg.sizes[k]
        args.push(Math.floor(Math.random() * size))
      })
    })
    return actions.FunctionCall(function_id, args)
  }
}

module.exports = {
  RandomAgent
}
