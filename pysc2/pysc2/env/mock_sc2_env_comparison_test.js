/*Tests that mock environment has same shape outputs as true environment.*/
const path = require('path')
const mock_sc2_env = require(path.resolve(__dirname, './mock_sc2_env.js'))
const sc2_env = require(path.resolve(__dirname, './sc2_env.js'))

