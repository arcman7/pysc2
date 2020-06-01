const path = require('path') //eslint-disable-line
const actions = require(path.resolve(__dirname, '..', 'lib', 'actions.js'))
const units = require(path.resolve(__dirname, '..', 'lib', 'units.js'))
const utils = require(path.resolve(__dirname, './utils.js'))

function raw_ability_ids(obs) {
  return obs.getActions().filter((action) => (action !== null) || (action !== undefined))
}

describe('actions_test.js', () => {
  describe('  ActionsTest', () => {
    test('test_general_attack', async () => {
      const testState = new utils.GameReplayTestCase()
      await testState.create_unit(units.Protoss.Zealot, 1, [30, 30])
      await testState.create_unit(units.Protoss.Observer, 1, [30, 30])
      await testState.step()
      let obs = await testState.observe()

      let zealot = utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Zealot })
      let observer = utils.get_units({ obs: obs[0], unit_type: units.Protoss.Observer })

      testState.raw_unit_command(0, 'Attack_screen', [zealot.tag, observer.tag], [32, 32])
      await testState.step(64)
      obs = await testState.observe()

      zealot = utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Zealot })
      observer = utils.get_units({ obs: obs[0], unit_type: units.Protoss.Observer })
      testState.assert_point(zealot.getPos(), [32, 32])
      testState.assert_point(observer.getPos(), [32, 32])
      expect(raw_ability_ids(obs[0])).toMatchObject([actions.FUNCTIONS.Attack_Attack_screen.ability_id])
      
    })
  })
})
