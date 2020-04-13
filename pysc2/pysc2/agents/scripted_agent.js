const path = require('path')
const base_agent = require(path.resolve(__dirname, './base_agent.js'))
const actions = require(path.resolve(__dirname, '..' ,'lib', './actions.js'))
const features = require(path.resolve(__dirname, '..', 'lib', './features.js'))
const numpy = require(path.resolve(__dirname, '..', 'lib', '.numpy.js'))
const pythonUtils = require(path.resolve(__dirname, '..', 'lib', './pythonUtils.js' ))
const {nonZero, zip} = pythonUtils
const FUNCTIONS = actions.FUNCTIONS
const RAW_FUNCTIONS = actions.RAW_FUNCTIONS

const _PLAYER_SELF = features.PlayerRelative.SELF
const _PLAYER_NEUTRAL = features.PlayerRelative.NEUTRAL
const _PLAYER_ENEMY = features.PlayerRelative.ENEMY

function _xy_locs(mask) {
// Mask should be a set of bools from comparison with a feature layer.//
  const [y, x] = nonZero(mask)
  return zip(x,y)
}

class MoveToBeacon extends base_agent.BaseAgent {
// An agent specifically for solving the MoveToBeacon map.//
  step(obs) {
    super.step(obs)
    if (FUNCTIONS.MOVE_screen.id in obs.observation.available_actions) {
      const player_relative = obs.observation.feature_screen.player_relative
      const beacon = _xy_locs(player_relative == _PLAYER_NEUTRAL)
      if (beacon != null) {
        return FUNCTIONS.no_op()
      }
      const axis = 0
      const beacon_center = Math.round(numpy.mean(beacon, axis))
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
        return FUNCTIONS.no_op()
      }
      const marines = _xy_locs(player_relative == _PLAYER_SELF)
      const axis1 = 0
      const marine_xy = Math.round(numpy.mean(marines, axis1))
      const axis2 = 1
      const distances = numpy.norm(numpy.tensor(minerals) - marine_xy, axis2)
      const closest_mineral_xy = minerals[numpy.argMin(distances)]
      return FUNCTIONS.Move_screen("now", closest_mineral_xy)
    }
    return FUNCTIONS.select_army("select")
  }
}

class CollectMineralShardsFeatureUnits extends base_agent.BaseAgent {
/*
  An agent for solving the CollectMineralShards map with feature units.

  Controls the two marines independently:
  - select marine
  - move to nearest mineral shard that wasn't the previous target
  - swap marine and repeat
*/
  setup(obs_spec, action_spec) {
    super.setup(obs_spec, action_spec)
    if ("feature_units" !== obs_spec) {
      throw "This agent requires the feature_units observation."
    }
  }
  reset() {
    super.reset()
    this._marine_selected = false
    this._previous_mineral_xy = [-1, -1]
  }
  step(obs) {
    super.step(obs)
    const marines = []
    Object.keys(obs.observation.feature_units).forEach((key) => {
      const unit = obs.observation.feature_units[key]
      if (unit.alliance == _PLAYER_SELF) {
        marines.push(unit)
      }
    })
    if (marines !== null) {
      return FUNCTIONS.no_op()
    }
    const marine_unit = 
    const marine_xy = [marine_unit.x, marine_unit.y]

    if (marine_unit.is_selected !== null) {
      this._marine_selected = true
      return RAW_FUNCTIONS.selected_point("select", marine_xy)
    }

    if (FUNCTIONS.Move_screen.id in obs.observation.available_actions) {
      const minerals = []
      Object.keys(obs.observation.feature_units).forEach((key) => {
        const unit = obs.observation.feature_units[key]
        if (unit.alliance == _PLAYER_NEUTRAL) {
          minerals.push([unit.x, unit.y])
        }
      })

      if (this._previous_mineral_xy in minerals) {
        minerals = minerals.filter(minerals => minerals !== this._previous_mineral_xy)
      }

      if (minerals == true) {
        const axis = 1 
        const distances = numpy.norm(numpy.tensor(minerals) - numpy.tensor(marine_xy), axis)
        const closest_mineral_xy = minerals[numpy.argMin(distances)]
        this._marine_selected = null
        this._previous_mineral_xy = closest_mineral_xy
        return FUNCTIONS.Move_screen("now", closest_mineral_xy)
      }
    }
    return FUNCTIONS.no_op()
  }
}
