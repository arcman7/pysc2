const googleProtobuf = require('google-protobuf')
const s2clientprotocol = require('s2clientprotocol')
const Enum = require('python-enum')
const path = require('path')
const actions = require(path.resolve(__dirname, './actions.js'))
const features = require(path.resolve(__dirname, './features.js'))
const point = require(path.resolve(__dirname, './point.js'))
const pythonUtils = require(path.resolve(__dirname, './pythonUtils.js'))

const { sc2api_pb2, raw_pb2 } = s2clientprotocol
const sc_raw = raw_pb2
const sc_pb = sc2api_pb2
const text_format = googleProtobuf.text_format
const observation_text_proto = `
player_common {
  player_id: 1
  minerals: 0
  vespene: 0
  food_cap: 10
  food_used: 0
  food_army: 0
  food_workers: 0
  idle_worker_count: 0
  army_count: 0
  warp_gate_count: 0
  larva_count: 0
}
game_loop: 20
`
const RECTANGULAR_DIMENSIONS = features.Dimensions([84, 80], [64, 67])
const SQUARE_DIMENSIONS = features.Dimensions(84, 64)
const always_expected = new Set(
  "no_op", "move_camera", "select_point", "select_rect",
  "select_control_group"
)
function hideSpecificActions(self, hide_specific_actions) {
  self.features = features.Features(
    features.AgentInterfaceFormat(
      RECTANGULAR_DIMENSIONS,
      hide_specific_actions,
    )
  )
}
let obs
describe('features:', () => {
  beforeEach(() => {
    obs = text_format.Parse(observation_text_proto, sc_pb.Observation())
  })
  describe('  AvailableActionsTest', () => {

  })
})
