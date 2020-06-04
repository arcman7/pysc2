const path = require('path') //eslint-disable-line
const actions = require(path.resolve(__dirname, '..', 'lib', 'actions.js'))
const units = require(path.resolve(__dirname, '..', 'lib', 'units.js'))
const utils = require(path.resolve(__dirname, './utils.js'))
const pythonUtils = require(path.resolve(__dirname, '..', 'lib', 'pythonUtils.js'))
const { assert, sequentialTaskQueue } = pythonUtils //eslint-disable-line

function raw_ability_ids(obs) {
  const rawActs = obs.getActionsList().map((a) => a.getActionRaw()
    && a.getActionRaw().getUnitCommand()
    && a.getActionRaw().getUnitCommand().getAbilityId())
  return rawActs.filter((act_id) => Number.isInteger(act_id))
}
function arrayCompare(a, b, sameOrder) {
  if (sameOrder) {
    for (let i = 0; i < a.length; i++) {
      if (a[i] === b[i]) {
        return false
      }
    }
    return true
  }
  const aSeen = {}
  const bSeen = {}
  for (let i = 0; i < a.length; i++) {
    aSeen[a[i]] = true
    bSeen[b[i]] = true
  }
  for (let i = 0; i < a.length; i++) {
    if (!(aSeen[a[i]] && bSeen[a[i]])) {
      return false
    }
  }
  return true
}

let testState

async function main() {
  await (async () => {
    testState = await new utils.GameReplayTestCase()
    let runCount = 0
    async function test_general_attack() {
      console.log('test_general_attack run: ', ++runCount)
      await testState.create_unit(units.Protoss.Zealot, 1, [30, 30])
      await testState.create_unit(units.Protoss.Observer, 1, [30, 30])

      await testState.step()
      let obs = await testState.observe()

      let zealot = utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Zealot })
      let observer = utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Observer })

      await testState.raw_unit_command(0, 'Attack_screen', [zealot.getTag(), observer.getTag()], [32, 32])

      await testState.step(64)
      obs = await testState.observe()

      zealot = utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Zealot })
      observer = utils.get_unit({ obs: obs[0], unit_type: units.Protoss.Observer })
      testState.assert_point(zealot.getPos(), [32, 32])
      testState.assert_point(observer.getPos(), [32, 32])
      assert(
        arrayCompare(
          raw_ability_ids(obs[0]),
          [actions.FUNCTIONS.Attack_Attack_screen.ability_id]
        ),
        'raw_ability_ids(obs[0]) == [actions.FUNCTIONS.Attack_Attack_screen.ability_id]'
      )
    }
    const boundedArgsDecorator = utils.GameReplayTestCase.setup() // no bounded args
    const decoratedFunc = boundedArgsDecorator(test_general_attack)
    decoratedFunc(testState)
  })();
}

main()
