const path = require('path')
const environment = require(path.resolve(__dirname, '..', 'env', './environment.js'))

class BaseEnvWrapper extends environment.Base {
  constructor(env) {
    this._env = env
  }

  close() {
    return this._env.close(arguments)
  }

  action_spec() {
    return this._env.action_spec(arguments)
  }

  observation_spec() {
    return this._env.observation_spec(arguments)
  }

  reset() {
    return this._env.reset(arguments)
  }

  step() {
    return this._env.step(arguments)
  }

  save_replay() {
    return this._env.save_replay(arguments)
  }

  get state() {
    return this._env.state
  }
}