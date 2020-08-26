const path = require('path'); //eslint-disable-line
const base_agent = require(path.resolve(__dirname, './base_agent.js'))
const actions = require(path.resolve(__dirname, '..', 'lib', './actions.js'))
const pythonUtils = require(path.resolve(__dirname, '..', 'lib', './pythonUtils.js'))
const { randomChoice } = pythonUtils

class RandomAgent extends base_agent.BaseAgent {
  // A random agent for starcraft. //
  step(obs) {
    super.step(obs)
    // console.log('random agent step: ', obs.observation.available_actions)
    const function_id = randomChoice(obs.observation.available_actions)
    // console.log('function_id: ', function_id)
    // console.log('this.action_spec.functions[function_id]:', this.action_spec.functions[function_id])
    // console.log('this.action_spec.functions[function_id].args:', this.action_spec.functions[function_id].args)
    // console.log('this.action_spec: ', this.action_spec)
    const args = []
    this.action_spec.functions[function_id].args.forEach((arg) => {
      // console.log('arg: ', arg)
      // console.log('arg.sizes: ', arg.sizes)
      args.push(arg.sizes.map((size) => { //eslint-disable-line
        return Math.floor(Math.random() * size)
      }))
    })
    // console.log('actions.FunctionCall(function_id, args) - function_id: ', function_id, 'args: ', args)
    return new actions.FunctionCall(function_id, args)
  }
}

module.exports = {
  RandomAgent
}
