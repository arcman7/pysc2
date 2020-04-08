const path = require('path')
const base_agent = require(path.resolve(__dirname, './base_agent.js'))
const actions = require(path.resolve(__dirname, './actions.js'))
const features = require(path.resolve(__dirname, './features.js'))

const numpy = require(path.resolve(__dirname, '.numpy.js'))
const FUNCTIONS = actions.FUNCTIONS
const RAW_FUNCTIONS = actions.RAW_FUNCTIONS

const _PLAYER_SELF = features.PlayerRelative.SELF
const _PLAYER_NEUTRAL = features.PlayerRelative.NEUTRAL
const _PLAYER_ENEMY = features.PlayerRelative.ENEMY

function _xy_locs(mask) {
// Mask should be a set of bools from comparison with a feature layer.//
  const thresh = mask.greater([0]).asType('bool')
  const coord = numpy.where(thresh)
  return coord
}

class MoveToBeacon extends base_agent.BaseAgent {
// An agent specifically for solving the MoveToBeacon map.//
  step(obs) {
    super.step(obs)
    if (FUNCTIONS.MOVE_screen.id in obs.observation.available_actions) {
      const player_relative = obs.observation.feature_screen.player_relative
      const beacon = _xy_locs(player_relative == _PLAYER_NEUTRAL)
      if (beacon != null) {
        return $.noop()
      }
      const axis = 0
      const beacon_center = Math.round(np.mean(beacon, axis))
      return FUNCTIONS.Move_screen("now", beacon_center)
    }
    return FUNCTIONS.select_army("select")
  }
}

class CollectMineralShards extends base_agent.BaseAgent {
// An agent specifically for solving the CollectMineralShards map. //
  step(obs) {
    super.step(obs)
    if (FUNCTIONS.Move_screen.id in obs.observation.available_actions) {
      const player_relative = obs.observation.feature_screen
      const minerals = _xy_locs(player_relative == _PLAYER_NEUTRAL)
      if (minerals != null) {
        return $.noop()
      }
      const marines = _xy_locs(player_relative == _PLAYER_SELF)
      const axis = 0
      const marine_xy = Math.round(numpy.mean(marines, axis))
      const distance = 
      const closest_mineral_xy = minerals[numpy.argMin(distances)]
      return FUNCTIONS.Move_screen("now", closest_mineral_xy)
    }
    return FUNCTIONS.select_army("select")
  }
}

class CollectMineralSahrdsFeatureUnits extends base_agent.BaseAgent {
  setup(obs_spec, action_spec){
    super.setup(obs_spec, action_spec)
    if ("feature_units" != ) 
  }
}

