const path = require('path') //eslint-disable-line
const { performance } = require('perf_hooks') //eslint-disable-line
const s2clientprotocol = require('s2clientprotocol') //eslint-disable-line
const actions = require(path.resolve(__dirname, '..', 'lib', 'actions.js'))
const features = require(path.resolve(__dirname, '..', 'lib', 'features.js'))
const portspicker = require(path.resolve(__dirname, '..', 'lib', 'portspicker.js'))
const stopwatch = require(path.resolve(__dirname, '..', 'lib', 'stopwatch.js'))
const units = require(path.resolve(__dirname, '..', 'lib', 'units.js'))
const buffs = require(path.resolve(__dirname, '..', 'lib', 'buffs.js'))
const utils = require(path.resolve(__dirname, './utils.js'))
const pythonUtils = require(path.resolve(__dirname, '..', 'lib', 'pythonUtils.js'))

const { assert, sequentialTaskQueue  } = pythonUtils //eslint-disable-line

const sc_debug = s2clientprotocol.debug_pb
const sc_raw = s2clientprotocol.raw_pb
const msToS = 1 / 1000
const EXPECTED_ACTION_DELAY = 2

let testState

async function obsTest() {
  testState = await new utils.GameReplayTestCase()
  async function test_hallucination() {
    await testState.god()

    // Create some sentries
    await testState.create_unit(units.Protoss.Sentry, 1, [30, 30])
    await testState.create_unit(units.Protoss.Sentry, 2, [30, 30])

    await testState.step()
    let obs = await testState.observe()

    // Give one enough energy.
    const tag = utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Sentry, owner: 1 }).getTag()
    const debugType = new sc_debug.DebugSetUnitValue()
    debugType.setUnitValue(sc_debug.DebugSetUnitValue.UnitValue.ENERGY)
    debugType.setValue(200)
    debugType.setUnitTag(tag)
    await testState.debug(0, { unit_value: debugType })

    await testState.step()
    obs = await testState.observe()

    // Create a hallucinated archon.
    await testState.raw_unit_command(0, 'Hallucination_Archon_quick', tag)

    await testState.step()
    obs = await testState.observe()

    // Verify the owner knows it's a hallucination, but the opponent doesn't.
    let p1 = utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Archon })
    let p2 = utils.get_unit({ obs: obs[1], unit_type: units.Protoss.Archon })

    assert(p1.getIsHallucination(), 'p1.getIsHallucination()')
    assert(p2.getIsHallucination() === false, 'p1.getIsHallucination() === false')

    // Create an observer so the opponent has detection
    await testState.create_unit(units.Protoss.Observer, 2, [28, 30])

    await testState.step()

    // Verify the opponent now also knows it'sa hallucination.
    p1 = utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Archon })
    p2 = utils.get_unit({ obs: obs[1], unit_type: units.Protoss.Archon })

    assert(p1.getIsHallucination(), 'p1.getIsHallucination()')
    assert(p2.getIsHallucination(), 'p1.getIsHallucination()')
  }
  // no bounded args
  let boundedArgsDecorator = utils.GameReplayTestCase.setup()
  let decoratedFunc = boundedArgsDecorator(test_hallucination)
  // await decoratedFunc(testState)

  async function test_hide_cloaked() {
    assert(
      testState._info.getOptions().getShowCloaked() === false,
      'testState._info.getOptions().getShowCloaked() === false'
    )
    await testState.god()
    await testState.move_camera(32, 32)

    // Create some units. One cloaked, one to see it without detection.
    await testState.create_unit(units.Protoss.DarkTemplar, 1, [30, 30])
    await testState.create_unit(units.Protoss.Sentry, 2, [30, 30])

    await testState.step(16)
    const obs = await testState.observe()

    // Verify both can see it, but that only the owner knows details.
    let p1 = utils.get_unit({ obs: obs[0], unit_type: units.Protoss.DarkTemplar })
    let p2 = utils.get_unit({ obs: obs[1], unit_type: units.Protoss.DarkTemplar })

    assert(p1.getDisplayType() === sc_raw.DisplayType.VISIBLE, 'p1.getDisplayType() === sc_raw.DisplayType.VISIBLE')
    assert(p1.getCloak() === sc_raw.CloakState.CLOAKEDALLIED, 'p1.getCloak() === sc_raw.CloakState.CLOAKEDALLIED')
    assert(p1.getHealth() === 40, 'p1.getHealth() === 40')
    assert(p1.getShield() === 80, 'p1.getShield() === 80')
    assert(p2 === null, `p2 === null, p2: ${p2}`)
    let screen1 = testState._features.transform_obs(obs[0])['feature_screen']
    let screen2 = testState._features.transform_obs(obs[1])['feature_screen']
    console.log('screen1: ***************')
    console.log(screen1)
    // let dt = utils.xy_locs(screen1.unit_type == units.Protoss.DarkTemplar)[0]
  }
  // no bounded args
  boundedArgsDecorator = utils.GameReplayTestCase.setup({ show_cloaked: false })
  decoratedFunc = boundedArgsDecorator(test_hide_cloaked)
  await decoratedFunc(testState)
}

obsTest()
