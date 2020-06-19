const s2clientprotocol = require('s2clientprotocol')
const dir = require('path')
const proto_diff = require(dir.resolve(__dirname, './proto_diff.js'))
const { sc2api_pb, score_pb } = s2clientprotocol
const sc_pb = sc2api_pb

// Tests for proto_diff.js
describe('proto_diff.js', () => {
  describe('  ProtoPathTest', () => {
    test('testCreationFromList', () => {
      const result = new proto_diff.ProtoPath(['observation', 'actions'])
      expect(result.toString()).toBe('observation.actions')
    })

    test('testCreationFromGenerator', () => {
      const str = 'abc'
      const a = []
      for (let i = 0; i < str.length; i++) {
        a.push(str[i])
      }
      const result = new proto_diff.ProtoPath(a)
      expect(result.toString()).toBe('a.b.c')
    })

    test('testStringRepr', () => {
      const result = new proto_diff.ProtoPath(['observation', 'actions', 1, 'target'])
      expect(result.toString()).toBe('observation.actions[1].target')
    })

    test('testOrdering', () => {
      const a = new proto_diff.ProtoPath(['observation', 'actions', 1, 'target'])
      const b = new proto_diff.ProtoPath(['observation', 'actions', 1, 'game_loop'])
      const c = new proto_diff.ProtoPath(['observation', 'actions', 1])
      const d = new proto_diff.ProtoPath(['observation'])
      expect(b < a).toBe(true)
      expect(c < a).toBe(true)
      expect(c > d).toBe(true)
    })

    test('testEquals', () => {
      const a = new proto_diff.ProtoPath(['observation', 'actions', 1])
      const b = new proto_diff.ProtoPath(['observation', 'actions', 1])
      expect(a.toString()).toBe(b.toString())
      expect(a.__hash__()).toBe(b.__hash__())
    })

    test('testNotEqual', () => {
      const a = new proto_diff.ProtoPath(['observation', 'actions', 1])
      const b = new proto_diff.ProtoPath(['observation', 'actions', 2])
      expect(a.toString()).not.toBe(b.toString())
      expect(a.__hash__()).not.toBe(b.__hash__())
    })

    test('testIndexing', () => {
      const path = new proto_diff.ProtoPath(['observation', 'actions', 1])
      expect(path[0]).toBe('observation')
      expect(path[1]).toBe('actions')
      expect(path[path.length - 2]).toBe('actions')
      expect(path[path.length - 1]).toBe(1)
    })

    test('testGetField', () => {
      var proto = new sc_pb.ResponseObservation()
      var observation = new sc_pb.Observation()
      observation.setGameLoop(1)
      observation.setAlertsList([sc_pb.Alert.ALERTERROR])
      proto.setObservation(observation)
      const game_loop = new proto_diff.ProtoPath(['observation', 'game_loop'])
      const alert = new proto_diff.ProtoPath(['observation', 'alerts', 0])
      expect(game_loop.get_field(proto)).toBe(1)

    })

    test('testWithAnonymousArrayIndices', () => {
      const a = new proto_diff.ProtoPath(['observation', 'actions'])
      const b = new proto_diff.ProtoPath(['observation', 'actions', 1])
      const c = new proto_diff.ProtoPath(['observation', 'actions', 2])
      expect(a.toString()).toBe('observation.actions')
      expect(b.with_anonymous_array_indices().toString()).toBe('observation.actions[*]')
      expect(b.with_anonymous_array_indices().toString()).toBe(c.with_anonymous_array_indices().toString())
    })
  })

  // function _alert_formatter(path proto_a, proto_b) {

  // }

  describe('  ProtoDiffTest', () => {
    test('testNoDiffs', () => {
      var a = new sc_pb.ResponseObservation()
      var b = new sc_pb.ResponseObservation()
      const diff = proto_diff.compute_diff(a, b)
      expect(diff).toBeNull()
    })

    test('testAddedField', () => {
      var a = new sc_pb.ResponseObservation()
      var b = new sc_pb.ResponseObservation()
      var observation = new sc_pb.Observation()
      observation.setGameLoop(1)
      b.setObservation(observation)
      const diff = proto_diff.compute_diff(a, b)
      expect(diff).not.toBeNull()
      expect(diff.added.length).toBe(1)
      // self.assertLen(diff.added, 1, diff)
      // self.assertEqual(str(diff.added[0]), "observation")
      // self.assertEqual(diff.added, diff.all_diffs())
      // self.assertEqual(diff.report(), "Added observation.")
    })

    test('testAddedFields', () => {
      var a = new sc_pb.ResponseObservation()
      var observation1 = new sc_pb.Observation()
      var b = new sc_pb.ResponseObservation()
      var observation2 = new sc_pb.Observation()
      observation1.setAlertsList([sc_pb.Alert.ALERTERROR])
      a.setObservation(observation1)
      observation2.setAlertsList([sc_pb.Alert.ALERTERROR, sc_pb.Alert.MERGECOMPLETE])
      observation2.setPlayerResultList([sc_pb.PlayerResult()])
      b.setObservation(observation2)
      const diff = proto_diff.compute_diff(a, b)
      expect(diff).not.toBeNull()
      // self.assertLen(diff.added, 2, diff)
      // self.assertEqual(str(diff.added[0]), "observation.alerts[1]")
      // self.assertEqual(str(diff.added[1]), "player_result")
      // self.assertEqual(diff.added, diff.all_diffs())
      // self.assertEqual(
      //     diff.report(),
      //     "Added observation.alerts[1].\n"
      //     "Added player_result.")
    })

    test('testRemovedField', () => {
      var a = new sc_pb.ResponseObservation()
      var observation1 = new sc_pb.Observation()
      var b = new sc_pb.ResponseObservation()
      var observation2 = new sc_pb.Observation()
      observation1.setGameLoop(1)
      observation1.setScore(score_pb.Score())
      observation1.setAlertsList([sc_pb.Alert.ALERTERROR, sc_pb.Alert.MERGECOMPLETE])
      a.setObservation(observation1)
      observation2.setAlertsList([sc_pb.Alert.ALERTERROR])
      b.setObservation(observation2)
      const diff = proto_diff.compute_diff(a, b)
      expect(diff).not.toBeNull()
      // self.assertLen(diff.removed, 1, diff)
      // self.assertEqual(str(diff.removed[0]), "observation.game_loop")
      // self.assertEqual(diff.removed, diff.all_diffs())
      // self.assertEqual(
      //     diff.report(),
      //     "Removed observation.game_loop.")
    })

    test('testRemovedFields', () => {
      var a = new sc_pb.ResponseObservation()
      var observation1 = new sc_pb.Observation()
      var b = new sc_pb.ResponseObservation()
      var observation2 = new sc_pb.Observation()

    })
  })
})
