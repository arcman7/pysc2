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
    let obs = await testState.observe()

    // Verify both can see it, but that only the owner knows details.
    let p1 = utils.get_unit({ obs: obs[0], unit_type: units.Protoss.DarkTemplar })
    let p2 = utils.get_unit({ obs: obs[1], unit_type: units.Protoss.DarkTemplar })
    testState.assert_unit(p1, {
      display_type: sc_raw.DisplayType.VISIBLE,
      cloak: sc_raw.CloakState.CLOAKEDALLIED,
      health: 40,
      shield: 80,
    })
    assert(p2 === null, `p2 === null, p2: ${p2}`)
    let screen1 = testState._features.transform_obs(obs[0])['feature_screen']
    let screen2 = testState._features.transform_obs(obs[1])['feature_screen']
    let dt = utils.xy_locs(screen1.unit_type, units.Protoss.DarkTemplar)[0]
    testState.assert_layers(screen1, dt, {
      unit_type: units.Protoss.DarkTemplar,
      unit_hit_points: 40,
      unit_shields: 80,
      cloaked: 1,
    })
    testState.assert_layers(screen2, dt, {
      unit_type: 0,
      unit_hit_points: 0,
      unit_shields: 0,
      cloaked: 0,
    })

    // Create an observer so the opponent has detection.
    await testState.create_unit(units.Protoss.Observer, 2, [28, 28])
    await testState.step(16) // It takes a few frames for the observer to detect.
    obs = await testState.observe()

    //Verify both can see it, with the same details
    p1 = utils.get_unit({ obs: obs[0], unit_type: units.Protoss.DarkTemplar })
    p2 = utils.get_unit({ obs: obs[1], unit_type: units.Protoss.DarkTemplar })
    testState.assert_unit(p1, {
      display_type: sc_raw.DisplayType.VISIBLE,
      cloak: sc_raw.CloakState.CLOAKEDALLIED,
      health: 40,
      shield: 80,
    })
    testState.assert_unit(p2, {
      display_type: sc_raw.DisplayType.VISIBLE,
      cloak: sc_raw.CloakState.CLOAKEDDETECTED,
      health: 40,
      shield: 80,
    })

    screen1 = testState._features.transform_obs(obs[0])['feature_screen']
    screen2 = testState._features.transform_obs(obs[1])['feature_screen']
    dt = utils.xy_locs(screen1.unit_type, units.Protoss.DarkTemplar)[0]
    testState.assert_layers(screen1, dt, {
      unit_type: units.Protoss.DarkTemplar,
      unit_hit_points: 40,
      unit_shields: 80,
      cloaked: 1,
    })
    testState.assert_layers(screen2, dt, {
      unit_type: units.Protoss.DarkTemplar,
      unit_hit_points: 40,
      unit_shields: 80,
      cloaked: 1,
    })
  }
  boundedArgsDecorator = utils.GameReplayTestCase.setup({ show_cloaked: false })
  decoratedFunc = boundedArgsDecorator(test_hide_cloaked)
  // await decoratedFunc(testState)

  async function test_show_cloaked() {
    assert(
      testState._info.getOptions().getShowCloaked() === true,
      'testState._info.getOptions().getShowCloaked() === true'
    )

    await testState.god()
    await testState.move_camera(32, 32)

    // Create some units. One cloaked, one to see it without detection.
    await testState.create_unit(units.Protoss.DarkTemplar, 1, [30, 30])
    await testState.create_unit(units.Protoss.Sentry, 2, [28, 30])

    await testState.step(16)
    let obs = await testState.observe()

    //Verify both can see it, but that only the owner knows details.
    let p1 = utils.get_unit({ obs: obs[0], unit_type: units.Protoss.DarkTemplar })
    let p2 = utils.get_unit({ obs: obs[1], unit_type: units.Protoss.DarkTemplar })
    testState.assert_unit(p1, {
      display_type: sc_raw.DisplayType.VISIBLE,
      cloak: sc_raw.CloakState.CLOAKEDALLIED,
      health: 40,
      shield: 80,
    })
    // console.log(p2.toObject())
    testState.assert_unit(p2, {
      display_type: sc_raw.DisplayType.HIDDEN,
      cloak: sc_raw.CloakState.CLOAKED,
      health: 0,
      shield: 0,
    })

    let screen1 = testState._features.transform_obs(obs[0])['feature_screen']
    let screen2 = testState._features.transform_obs(obs[1])['feature_screen']
    let dt = utils.xy_locs(screen1.unit_type, units.Protoss.DarkTemplar)[0]
    testState.assert_layers(screen1, dt, {
      unit_type: units.Protoss.DarkTemplar,
      unit_hit_points: 40,
      unit_shields: 80,
      cloaked: 1,
    })
    testState.assert_layers(screen2, dt, {
      unit_type: units.Protoss.DarkTemplar,
      unit_hit_points: 0,
      unit_shields: 0,
      cloaked: 1,
    })

    // Create an observer so the opponent has detection.
    await testState.create_unit(units.Protoss.Observer, 2, [28, 28])
    await testState.step(16) // It takes a few frames for the observer to detect.
    obs = await testState.observe()

    // Verify both can see it, with the same details
    p1 = utils.get_unit({ obs: obs[0], unit_type: units.Protoss.DarkTemplar })
    p2 = utils.get_unit({ obs: obs[1], unit_type: units.Protoss.DarkTemplar })
    testState.assert_unit(p1, {
      display_type: sc_raw.DisplayType.VISIBLE,
      cloak: sc_raw.CloakState.CLOAKEDALLIED,
      health: 40,
      shield: 80,
    })
    testState.assert_unit(p2, {
      display_type: sc_raw.DisplayType.VISIBLE,
      cloak: sc_raw.CloakState.CLOAKEDDETECTED,
      health: 40,
      shield: 80,
    })

    screen1 = testState._features.transform_obs(obs[0])['feature_screen']
    screen2 = testState._features.transform_obs(obs[1])['feature_screen']
    dt = utils.xy_locs(screen1.unit_type, units.Protoss.DarkTemplar)[0]
    testState.assert_layers(screen1, dt, {
      unit_type: units.Protoss.DarkTemplar,
      unit_hit_points: 40,
      unit_shields: 80,
      cloaked: 1,
    })
    testState.assert_layers(screen2, dt, {
      unit_type: units.Protoss.DarkTemplar,
      unit_hit_points: 40,
      unit_shields: 80,
      cloaked: 1,
    })
  }
  boundedArgsDecorator = utils.GameReplayTestCase.setup({ show_cloaked: true })
  decoratedFunc = boundedArgsDecorator(test_show_cloaked)
  // await decoratedFunc(testState)

  async function test_pos() {
    await testState.create_unit(units.Protoss.Archon, 1, [20, 30])
    await testState.create_unit(units.Protoss.Observer, 1, [40, 30])

    await testState.step()
    const obs = await testState.observe()

    const archon = utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Archon })
    const observer = utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Observer })

    testState.assert_point(archon.getPos(), [20, 30])
    testState.assert_point(observer.getPos(), [40, 30])
    assert(archon.getPos().getZ() < observer.getPos().getZ()) // The observer flies.

    // Move them towards the center, make sure they move.
    await testState.raw_unit_command(0, 'Move_screen', [archon.getTag(), observer.getTag()], [30, 25])

    await testState.step(40)
    const obs2 = await testState.observe()

    const archon2 = await utils.get_unit({ obs: obs2[0], unit_type: units.Protoss.Archon })
    const observer2 = await utils.get_unit({ obs: obs2[0], unit_type: units.Protoss.Observer })

    assert(archon2.getPos().getX() > 20, 'archon2.getPos().getX() > 20')
    assert(observer2.getPos().getX() < 40, 'observer2.getPos().getX() < 40')
    assert(archon2.getPos().getZ() < observer2.getPos().getZ(), 'archon2.getPos().getZ() < observer2.getPos().getZ()')
  }
  boundedArgsDecorator = utils.GameReplayTestCase.setup({})
  decoratedFunc = boundedArgsDecorator(test_pos)
  // await decoratedFunc(testState)

  async function test_fog() {
    await testState.observe()

    function assert_visible(unit, display_type, alliance, cloak) {
      testState.assert_unit(unit, {
        display_type,
        alliance,
        cloak,
      })
    }

    await testState.create_unit(units.Protoss.Sentry, 1, [30, 32])
    await testState.create_unit(units.Protoss.DarkTemplar, 1, [32, 32])

    await testState.step()
    let obs = await testState.observe()

    assert_visible(
      utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Sentry }),
      sc_raw.DisplayType.VISIBLE,
      sc_raw.Alliance.SELF,
      sc_raw.CloakState.NOTCLOAKED
    )
    assert_visible(
      utils.get_unit({ obs: obs[0], unit_type: units.Protoss.DarkTemplar }),
      sc_raw.DisplayType.VISIBLE,
      sc_raw.Alliance.SELF,
      sc_raw.CloakState.CLOAKEDALLIED
    )

    assert(
      null === utils.get_unit({ obs: obs[1], unit_type: units.Protoss.Sentry }),
      'null === utils.get_unit({ obs: obs[1], unit_type: units.Protoss.Sentry })'
    )
    assert(
      null === utils.get_unit({ obs: obs[1], unit_type: units.Protoss.DarkTemplar }),
      'null === utils.get_unit({ obs: obs[1], unit_type: units.Protoss.DarkTemplar })'
    )

    const disable_fog = true
    obs = await testState.observe(disable_fog)

    assert_visible(
      utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Sentry }),
      sc_raw.DisplayType.VISIBLE,
      sc_raw.Alliance.SELF,
      sc_raw.CloakState.NOTCLOAKED
    )
    assert_visible(
      utils.get_unit({ obs: obs[0], unit_type: units.Protoss.DarkTemplar }),
      sc_raw.DisplayType.VISIBLE,
      sc_raw.Alliance.SELF,
      sc_raw.CloakState.CLOAKEDALLIED
    )
    assert_visible(
      utils.get_unit({ obs: obs[1], unit_type: units.Protoss.Sentry }),
      sc_raw.DisplayType.HIDDEN,
      sc_raw.Alliance.ENEMY,
      sc_raw.CloakState.CLOAKEDUNKNOWN
    )
    assert_visible(
      utils.get_unit({ obs: obs[1], unit_type: units.Protoss.DarkTemplar }),
      sc_raw.DisplayType.HIDDEN,
      sc_raw.Alliance.ENEMY,
      sc_raw.CloakState.CLOAKEDUNKNOWN
    )
  }
  boundedArgsDecorator = utils.GameReplayTestCase.setup({})
  decoratedFunc = boundedArgsDecorator(test_fog)
  // await decoratedFunc(testState)

  async function test_effects() {
    function get_effect_proto(obs, effect_id) {
      const effects = obs.getObservation().getRawData().getEffectsList()
      for (let i = 0; i < effects.length; i++) {
        const e = effects[i]
        if (e.getEffectId() == effect_id) {
          return e
        }
      }
      return null
    }

    function get_effect_obs(obs, effect_id) {
      for (let i = 0; i < obs.length; i++) {
        const ob = obs[i]
        if (ob.getEffect() == effect_id) {
          return ob
        }
      }
      return null
    }

    await testState.god()
    await testState.move_camera(32, 32)

    // Create some sentries.
    await testState.create_unit(units.Protoss.Sentry, 1, [30, 30])
    await testState.create_unit(units.Protoss.Stalker, 1, [28, 30])
    await testState.create_unit(units.Protoss.Phoenix, 2, [30, 28])

    await testState.step()
    let obs = await testState.observe()

    // Give enough energy.
    const sentry = utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Sentry })
    const stalker = utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Stalker })
    const phoenix = utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Phoenix })
    await testState.set_energy(sentry.getTag(), 200)
    await testState.set_energy(phoenix.getTag(), 200)

    await testState.step()
    await testState.observe()

    await testState.raw_unit_command(0, 'Effect_GuardianShield_quick', sentry.getTag())

    await testState.step(16)
    obs = await testState.observe()

    assert(
      utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Sentry })
        .getBuffIdsList().includes(buffs.Buffs.GuardianShield.val),
      `utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Sentry })
        .getBuffIdsList().includes(buffs.Buffs.GuardianShield.val)`
    )
    assert(
      utils.get_unit({ obs: obs[1], unit_type: units.Protoss.Sentry })
        .getBuffIdsList().includes(buffs.Buffs.GuardianShield.val),
      `utils.get_unit({ obs: obs[1], unit_type: units.Protoss.Sentry })
        .getBuffIdsList().includes(buffs.Buffs.GuardianShield.val)`
    )
    assert(
      utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Stalker })
        .getBuffIdsList().includes(buffs.Buffs.GuardianShield.val),
      `utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Stalker })
        .getBuffIdsList().includes(buffs.Buffs.GuardianShield.val)`
    )
    assert(
      utils.get_unit({ obs: obs[1], unit_type: units.Protoss.Stalker })
        .getBuffIdsList().includes(buffs.Buffs.GuardianShield.val),
      `utils.get_unit({ obs: obs[1], unit_type: units.Protoss.Stalker })
        .getBuffIdsList().includes(buffs.Buffs.GuardianShield.val)`
    )
    assert(
      !utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Phoenix })
        .getBuffIdsList().includes(buffs.Buffs.GuardianShield.val),
      `!utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Phoenix })
        .getBuffIdsList().includes(buffs.Buffs.GuardianShield.val)`
    )
    assert(
      !utils.get_unit({ obs: obs[1], unit_type: units.Protoss.Phoenix })
        .getBuffIdsList().includes(buffs.Buffs.GuardianShield.val),
      `!utils.get_unit({ obs: obs[1], unit_type: units.Protoss.Phoenix })
        .getBuffIdsList().includes(buffs.Buffs.GuardianShield.val)`
    )

    // Both players should see the shield.
    let e = get_effect_proto(obs[0], features.Effects.GuardianShield)
    assert(e, 'e is not null')
    testState.assert_point(e.getPosList()[0], [30, 30])
    assert(
      e.getAlliance() === sc_raw.Alliance.SELF,
      'e.getAlliance() === sc_raw.Alliance.SELF'
    )
    assert(e.getOwner() === 1, 'e.getOwner() === 1')
    assert(e.getRadius() > 3, 'e.getRadius() === 3')

    e = get_effect_proto(obs[1], features.Effects.GuardianShield)
    assert(e, 'e is not null')
    testState.assert_point(e.getPosList()[0], [30, 30])
    assert(
      e.getAlliance() === sc_raw.Alliance.ENEMY,
      'e.getAlliance() === sc_raw.Alliance.ENEMY'
    )
    assert(e.getOwner() === 1, 'e.getOwner() === 1')
    assert(e.getRadius() > 3, 'e.getRadius() === 3')

    // Should show up on the feature layers too.
    const transform_obs1 = testState._features.transform_obs(obs[0])
    const transform_obs2 = testState._features.transform_obs(obs[1])
    const screen1 = transform_obs1['feature_screen']
    const screen2 = transform_obs2['feature_screen']
    const sentry_pos = utils.xy_locs(screen1.unit_type, units.Protoss.Sentry)[0]
    testState.assert_layers(screen1, sentry_pos, {
      unit_type: units.Protoss.Sentry,
      effects: features.Effects.GuardianShield,
      buffs: buffs.Buffs.GuardianShield,
    })
    testState.assert_layers(screen2, sentry_pos, {
      unit_type: units.Protoss.Sentry,
      effects: features.Effects.GuardianShield,
      buffs: buffs.Buffs.GuardianShield,
    })
    const phoenix_pos = utils.xy_locs(screen1.unit_type, units.Protoss.Phoenix)[0]
    testState.assert_layers(screen1, phoenix_pos, {
      unit_type: units.Protoss.Phoenix,
      effects: features.Effects.GuardianShield,
      buffs: 0,
    })
    testState.assert_layers(screen2, phoenix_pos, {
      unit_type: units.Protoss.Phoenix,
      effects: features.Effects.GuardianShield,
      buffs: 0,
    })

    // Also in the raw effects
  }
  boundedArgsDecorator = utils.GameReplayTestCase.setup({})
  decoratedFunc = boundedArgsDecorator(test_effects)
  await decoratedFunc(testState)
}

obsTest()
