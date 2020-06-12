const path = require('path') //eslint-disable-line
const s2clientprotocol = require('s2clientprotocol') //eslint-disable-line
const maps = require(path.resolve(__dirname, '..', 'maps'))
const run_configs = require(path.resolve(__dirname, '..', 'run_configs'))
const actions = require(path.resolve(__dirname, '..', 'lib', 'actions.js'))
const pythonUtils = require(path.resolve(__dirname, '..', 'lib', 'pythonUtils.js'))
const portspicker = require(path.resolve(__dirname, '..', 'lib', 'portspicker.js'))
const utils = require(path.resolve(__dirname, './utils.js'))

const sc_common = s2clientprotocol.common_pb
const sc_pb = s2clientprotocol.sc2api_pb
const { assert, randomSample } = pythonUtils

function get_maps(count = null, filter_fn = null) {
  const temp = maps.get_maps()
  const all_maps = {}
  Object.keys(temp).forEach((k) => {
    const v = temp[k]
    if (filter_fn === null || filter_fn(v)) {
      all_maps[k] = v
    }
  })
  count = count || Object.keys(all_maps).length
  return randomSample(all_maps.keys(), Math.min(count, Object.keys(all_maps).length))
}

let _sc2_proc = null

function cache_sc2_proc(self, ) {
  //A decorator to replace setUp/tearDown so it can handle exceptions.//
}

