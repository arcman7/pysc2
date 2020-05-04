const path = require('path')
const environment = require(path.resolve(__dirname, '..', 'env', './environment.js'))

class BaseEnvWrapper extends environment.Base {
  constructor(env) {
    this._env = env
  }

  close(args, kwargs) {
    
  }
}