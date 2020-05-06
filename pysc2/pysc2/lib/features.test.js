// const googleProtobuf = require('google-protobuf')
// const text_format = require('protobuf-textformat');
const s2clientprotocol = require('s2clientprotocol')
const Enum = require('python-enum')
const path = require('path')
const actions = require(path.resolve(__dirname, './actions.js'))
const features = require(path.resolve(__dirname, './features.js'))
const point = require(path.resolve(__dirname, './point.js'))
const pythonUtils = require(path.resolve(__dirname, './pythonUtils.js'))

const { sc2api_pb, raw_pb, ui_pb, common_pb } = s2clientprotocol
const sc_raw = raw_pb
const sc_pb = sc2api_pb
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
  // console.log('actual: ', actual)
  // const actual_names = {}
  const actual_names = new Set()
  Object.keys(actual).forEach((key) => {
    const i = actual[key]
    // if (typeof i === 'function') {
    //   i = i.name
    // }
    // if (!actions.FUNCTIONS[i]) {
    //   console.log('i: ', i)
    // }
    actual_names.add(actions.FUNCTIONS[i].name)
  })
  const compareTo = expected && expected.length ? new Set(expected) : always_expected
  if (all(isIn(actual_names), compareTo) === false) {
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
      const obs = testState.obs
      const uiData = new ui_pb.ObservationUI()
      obs.setUiData(uiData)
      const multi = new ui_pb.MultiPanel()
      uiData.setMulti(multi)
      const unit = new ui_pb.UnitInfo()
      unit.setUnitType(1)
      assertAvail(['select_unit'])
    })
    test('testSelectIdleWorkder', () => {
      testState.obs.getPlayerCommon().setIdleWorkerCount(1)
      assertAvail(["select_idle_worker"])
    })
    test('testSelectArmy', () => {
      testState.obs.getPlayerCommon().setArmyCount(3)
      assertAvail(["select_army"])
    })
    test('testSelectWarpGates', () => {
      testState.obs.getPlayerCommon().setWarpGateCount(1)
      assertAvail(["select_warp_gates"])
    })

    test('testSelectLarva', () => {
      testState.obs.getPlayerCommon().setLarvaCount(2)
      assertAvail(["select_larva"])
    })

    test('testQuick', () => {
      const ability = new common_pb.AvailableAbility()
      ability.setAbilityId(32)
      testState.obs.addAbilities(ability)
      assertAvail(["Effect_Salvage_quick"])
    })

    test('testScreen', () => {
      const ability = new common_pb.AvailableAbility()
      ability.setAbilityId(326)
      ability.setRequiresPoint(true)
      testState.obs.addAbilities(ability)
      assertAvail(["Build_SensorTower_screen"])
    })

    test('testScreenMinimap', () => {
      const ability = new common_pb.AvailableAbility()
      ability.setAbilityId(17)
      ability.setRequiresPoint(true)
      testState.obs.addAbilities(ability)
      assertAvail(["Patrol_screen", "Patrol_minimap"])
    })

    test('testScreenAutocast', () => {
      const ability = new common_pb.AvailableAbility()
      ability.setAbilityId(386)
      ability.setRequiresPoint(true)
      testState.obs.addAbilities(ability)
      assertAvail(["Effect_Heal_screen", "Effect_Heal_autocast"])
    })
    test('testScreenQuick', () => {
      const ability = new common_pb.AvailableAbility()
      ability.setAbilityId(421)
      testState.obs.addAbilities(ability)
      hideSpecificActions(true)
      ability.setRequiresPoint(false)
      assertAvail(["Build_TechLab_quick"])
      ability.setRequiresPoint(true)
      assertAvail(["Build_TechLab_screen"])
      hideSpecificActions(false)
      ability.setRequiresPoint(false)
      assertAvail(["Build_TechLab_Barracks_quick", "Build_TechLab_quick"])
      ability.setRequiresPoint(true)
      assertAvail(["Build_TechLab_Barracks_screen", "Build_TechLab_screen"])
    })
    test('testGeneral', () => {
      const ability = new common_pb.AvailableAbility()
      ability.setAbilityId(1374)
      testState.obs.addAbilities(ability)
      hideSpecificActions(false)
      assertAvail(["BurrowDown_quick", "BurrowDown_Baneling_quick"])
      hideSpecificActions(true)
      assertAvail(["BurrowDown_quick"])
    })
    test('testGeneralType', () => {
      const ability = new common_pb.AvailableAbility()
      ability.setAbilityId(1376)
      testState.obs.addAbilities(ability)
      hideSpecificActions(false)
      assertAvail(["BurrowUp_quick", "BurrowUp_Baneling_quick", "BurrowUp_autocast", "BurrowUp_Baneling_autocast"])
      hideSpecificActions(true)
      assertAvail(["BurrowUp_quick", "BurrowUp_autocast"])
      ability.setAbilityId(2110)
      hideSpecificActions(false)
      assertAvail(["BurrowUp_quick", "BurrowUp_Lurker_quick"])
      hideSpecificActions(true)
      assertAvail(["BurrowUp_quick"])
    })
    test('testMany', () => {
      const add = [
        [23, true],  // Attack
        [318, true],  // Build_CommandCenter
        [320, true],  // Build_Refinery
        [319, true],  // Build_SupplyDepot
        [316, true],  // Effect_Repair_SCV
        [295, true],  // Harvest_Gather_SCV
        [16, true],  // Move
        [17, true],  // Patrol
        [4, false],  // Stop
      ]
      add.forEach(([aId, reqP]) => {
        const ability = new common_pb.AvailableAbility()
        ability.setAbilityId(aId)
        ability.setRequiresPoint(reqP)
        testState.obs.addAbilities(ability)
      })
      hideSpecificActions(false)
      assertAvail([
        "Attack_Attack_minimap",
        "Attack_Attack_screen",
        "Attack_minimap",
        "Attack_screen",
        "Build_CommandCenter_screen",
        "Build_Refinery_screen",
        "Build_SupplyDepot_screen",
        "Effect_Repair_screen",
        "Effect_Repair_autocast",
        "Effect_Repair_SCV_autocast",
        "Effect_Repair_SCV_screen",
        "Harvest_Gather_screen",
        "Harvest_Gather_SCV_screen",
        "Move_minimap",
        "Move_screen",
        "Move_Move_minimap",
        "Move_Move_screen",
        "Patrol_minimap",
        "Patrol_screen",
        "Patrol_Patrol_minimap",
        "Patrol_Patrol_screen",
        "Stop_quick",
        "Stop_Stop_quick"
      ])
      hideSpecificActions(true)
      assertAvail([
        "Attack_minimap",
        "Attack_screen",
        "Build_CommandCenter_screen",
        "Build_Refinery_screen",
        "Build_SupplyDepot_screen",
        "Effect_Repair_screen",
        "Effect_Repair_autocast",
        "Harvest_Gather_screen",
        "Move_minimap",
        "Move_screen",
        "Patrol_minimap",
        "Patrol_screen",
        "Stop_quick",
      ])
    })
  })
  describe('  ToPointTest', () => {
    test('testIntAsString', () => {
      const value = features._to_point('32')
      expect(value).toMatchObject(new point.Point(32, 32))
    })
    test('testIntStringTwoArray', () => {
      const value = features._to_point(['32', 64])
      expect(value).toMatchObject(new point.Point(32, 64))
    })
    test('testNoneInputReturnsNullOutput', () => {
      expect(() => features._to_point(null)).toThrow(Error)
    })
  })
})
