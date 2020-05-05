// const googleProtobuf = require('google-protobuf')
// const text_format = require('protobuf-textformat');
const s2clientprotocol = require('s2clientprotocol')
const Enum = require('python-enum')
const path = require('path')
const actions = require(path.resolve(__dirname, './actions.js'))
const features = require(path.resolve(__dirname, './features.js'))
const point = require(path.resolve(__dirname, './point.js'))
const pythonUtils = require(path.resolve(__dirname, './pythonUtils.js'))

const { sc2api_pb, raw_pb } = s2clientprotocol
// const sc_raw = raw_pb
const sc_pb = sc2api_pb
// const observation_text_proto = `
// player_common {
//   player_id: 1
//   minerals: 0
//   vespene: 0
//   food_cap: 10
//   food_used: 0
//   food_army: 0
//   food_workers: 0
//   idle_worker_count: 0
//   army_count: 0
//   warp_gate_count: 0
//   larva_count: 0
// }
// game_loop: 20
// `
const RECTANGULAR_DIMENSIONS = new features.Dimensions([84, 80], [64, 67])
const SQUARE_DIMENSIONS = new features.Dimensions(84, 64)
const always_expected = new Set([
  "no_op", "move_camera", "select_point", "select_rect",
  "select_control_group"
])
const testState = { obs: null, features: null }
function hideSpecificActions(hide_specific_actions) {
  testState.features = new features.Features(
    new features.AgentInterfaceFormat({
      feature_dimensions: RECTANGULAR_DIMENSIONS,
      hide_specific_actions,
    })
  )
}
function eqSet(as, bs) {
  return as.size === bs.size && all(isIn(bs), as) //eslint-disable-line
}
function all(pred, as) {
  for (var a of as) if (!pred(a)) return false; //eslint-disable-line
  return true
}
function isIn(as) {
  return function (a) {
    return as.has(a)
  }
}
function setForEach(set, callback) {
  const iter = set.values()
  const results = []
  let val
  let i = 0
  while(val = iter.next().value) { callback(val, i, results); i++ } //eslint-disable-line
  return results
}
function assertAvail(expected) {
  const actual = testState.features.available_actions(testState.obs)
  console.log('actual: ', actual)
  // const actual_names = {}
  const actual_names = new Set()
  Object.keys(actual).forEach((key) => {
    let i = actual[key]
    if (typeof i === 'function') {
      i = i.name
    }
    actual_names.add(actions.FUNCTIONS[i].name)
  })
  const compareTo = expected && expected.length ? new Set(expected) : always_expected
  if (eqSet(actual_names, compareTo) === false) {
    throw new Error(`Sets not equal:\n   expected:\n    [${setForEach(actual_names, (val, _, results) => results.push(val))}]\n   recieved:\n    [${setForEach(compareTo, (val, _, results) => results.push(val))}]`)
  }
}
describe('features:', () => {
  beforeEach(() => {
    const playerCommon = new sc_pb.PlayerCommon()
    playerCommon.setPlayerId(1)
    playerCommon.setMinerals(0)
    playerCommon.setVespene(0)
    playerCommon.setFoodCap(10)
    playerCommon.setFoodUsed(0)
    playerCommon.setFoodArmy(0)
    playerCommon.setFoodWorkers(0)
    playerCommon.setIdleWorkerCount(0)
    playerCommon.setArmyCount(0)
    playerCommon.setWarpGateCount(0)
    playerCommon.setLarvaCount(0)
    const observation = new sc_pb.Observation()
    observation.setPlayerCommon(playerCommon)
    observation.setGameLoop(20)
    testState.obs = observation
    hideSpecificActions(true)
  })
  describe('  AvailableActionsTest', () => {
    test('testAlways', () => {
      assertAvail([])
    })
    test('testSelectUnit', () => {
      testState.obs.ui_data.multi.units.add(1)
      assertAvail(['select_unit'])
    })
  })
})
