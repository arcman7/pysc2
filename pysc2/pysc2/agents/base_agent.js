const path = require('path')
const actions = require(path.resolve(__dirname, '..', 'lib', './action.js'))

class BaseAgent { //eslint-disable-line

	constructor(){ //eslint-disable-line
    this.reward = 0
    this.episodes = 0
    this.steps = 0
    this.obs_spec = 0
    this.action_spec = 0
  }

	setup(obs_spec, action_spec){ //eslint-disable-line
    this.obs_spec = obs_spec
    this.action_spec = action_spec
  }

	reset(){ //eslint-disable-line
    this.episodes += 1
  }

  step(obs){ //eslint-disable-line
    this.steps += 1
    this.reward += obs.reward
    return actions.FunctionCall(actions.FUNCTIONS.no_op_id, [])
  }
}

module.exports = {
  BaseAgent
}
