// Test that the multiplayer environment works.
const path = require('path')
const random_agent = require(path.resolve(__dirname, '..', 'agents', 'random_agent.js'))
const run_loop = require(path.resolve(__dirname, '..', 'env', 'run_loop.js'))
const sc2_env = require(path.resolve(__dirname, '..', 'env', 'sc2_env.js'))
const utils = require(path.resolve(__dirname, '..', 'tests', 'utils.js'))

