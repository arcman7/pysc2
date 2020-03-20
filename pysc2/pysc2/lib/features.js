import * as tf from '@tensorflow/tfjs-node'
import s2clientprotocol from 's2clientprotocol'
import Enum from 'enum'
import actions from './actions'
import colors from './colors'
import named_array from './named_array'
import point from './point'
import static_data from './static_data'
import stopwatch from './stopwatch'
import transform from './transform'

import pythonUtils from './pythonUtils'
import all_collections_generated_classes from './all_collections_generated_classes'

const sw = stopwatch.sw
const { spatial_pb2, ui_pb2 } = s2clientprotocol
const sc_spatial = spatial_pb2
const sc_ui = ui_pb2
const np = {
  array: tf.tensor2d,
}

const { len, iter, isinstance, isObject } = pythonUtils

const EPSILON = 1e-5

const FeatureType = Enum.Enum({
  SCALAR: 1,
  CATEGORICAL: 2,
})

const PlayerRelative = Enum.IntEnum({
  /*The values for the `player_relative` feature layers.*/
  NONE: 0,
  SELF: 1,
  ALLY: 2,
  NEUTRAL: 3,
  ENEMY: 4,
})

const Visibility = Enum.IntEnum({
  /*Values for the `visibility` feature layers.*/
  HIDDEN: 0,
  SEEN: 1,
  VISIBLE: 2,
})

const Effects = Enum.IntEnum({
  /*Values for the `effects` feature layer.*/
  none: 0,
  PsiStorm: 1,
  GuardianShield: 2,
  TemporalFieldGrowing: 3,
  TemporalField: 4,
  ThermalLance: 5,
  ScannerSweep: 6,
  NukeDot: 7,
  LiberatorDefenderZoneSetup: 8,
  LiberatorDefenderZone: 9,
  BlindingCloud: 10,
  CorrosiveBile: 11,
  LurkerSpines: 12,
})

const ScoreCumulative = Enum.IntEnum({
  /*Indices into the `score_cumulative` observation.*/
  score: 0,
  idle_production_time: 1,
  idle_worker_time: 2,
  total_value_units: 3,
  total_value_structures: 4,
  killed_value_units: 5,
  killed_value_structures: 6,
  collected_minerals: 7,
  collected_vespene: 8,
  collection_rate_minerals: 9,
  collection_rate_vespene: 10,
  spent_minerals: 11,
  spent_vespene: 12,
})

const ScoreByCategory = Enum.IntEnum({
  /*Indices for the `score_by_category` observation's first dimension.*/
  food_used: 0,
  killed_minerals: 1,
  killed_vespene: 2,
  lost_minerals: 3,
  lost_vespene: 4,
  friendly_fire_minerals: 5,
  friendly_fire_vespene: 6,
  used_minerals: 7,
  used_vespene: 8,
  total_used_minerals: 9,
  total_used_vespene: 10,
})

const ScoreCategories = Enum.IntEnum({
  /*Indices for the `score_by_category` observation's second dimension.*/
  none: 0,
  army: 1,
  economy: 2,
  technology: 3,
  upgrade: 4,
})

const ScoreByVital = Enum.IntEnum({
  /*Indices for the `score_by_vital` observation's first dimension.*/
  total_damage_dealt: 0,
  total_damage_taken: 1,
  total_healed: 2,
})

const ScoreVitals = Enum.IntEnum({
  /*Indices for the `score_by_vital` observation's second dimension.*/
  life: 0,
  shields: 1,
  energy: 2,
})

const Player = Enum.IntEnum({
  /*Indices into the `player` observation.*/
  player_id: 0,
  minerals: 1,
  vespene: 2,
  food_used: 3,
  food_cap: 4,
  food_army: 5,
  food_workers: 6,
  idle_worker_count: 7,
  army_count: 8,
  warp_gate_count: 9,
  larva_count: 10,
})

const UnitLayer = Enum.IntEnum({
  /*Indices into the unit layers in the observations.*/
  unit_type: 0,
  player_relative: 1,
  health: 2,
  shields: 3,
  energy: 4,
  transport_slots_taken: 5,
  build_progress: 6,
})

const UnitCounts = Enum.IntEnum({
  /*Indices into the `unit_counts` observations.*/
  unit_type: 0,
  count: 1,
})

const FeatureUnit = Enum.IntEnum({
  /*Indices for the `feature_unit` observations.*/
  unit_type: 0,
  alliance: 1,
  health: 2,
  shield: 3,
  energy: 4,
  cargo_space_taken: 5,
  build_progress: 6,
  health_ratio: 7,
  shield_ratio: 8,
  energy_ratio: 9,
  display_type: 10,
  owner: 11,
  x: 12,
  y: 13,
  facing: 14,
  radius: 15,
  cloak: 16,
  is_selected: 17,
  is_blip: 18,
  is_powered: 19,
  mineral_contents: 20,
  vespene_contents: 21,
  cargo_space_max: 22,
  assigned_harvesters: 23,
  ideal_harvesters: 24,
  weapon_cooldown: 25,
  order_length: 26, // If zero, the unit is idle.
  order_id_0: 27,
  order_id_1: 28,
  tag: 29, // Unique identifier for a unit (only populated for raw units).
  hallucination: 30,
  buff_id_0: 31,
  buff_id_1: 32,
  addon_unit_type: 33,
  active: 34,
  is_on_screen: 35,
  order_progress_0: 36,
  order_progress_1: 37,
  order_id_2: 38,
  order_id_3: 39,
  is_in_cargo: 40,
  buff_duration_remain: 41,
  buff_duration_max: 42,
  attack_upgrade_level: 43,
  armor_upgrade_level: 44,
  shield_upgrade_level: 45,
})

const EffectPos = Enum.IntEnum({
  /*Positions of the active effects.*/
  effect: 0,
  alliance: 1,
  owner: 2,
  radius: 3,
  x: 4,
  y: 5,
})

const Radar = Enum.IntEnum({
  /*Positions of the Sensor towers.*/
  x: 0,
  y: 1,
  radius: 2,
})

const ProductionQueue = Enum.IntEnum({
  /*Indices for the `production_queue` observations.*/
  ability_id: 0,
  build_progress: 1,
})

class Feature extends all_collections_generated_classes.Feature {
  /*Define properties of a feature layer.

  Attributes:
    index: Index of this layer into the set of layers.
    name: The name of the layer within the set.
    layer_set: Which set of feature layers to look at in the observation proto.
    full_name: The full name including for visualization.
    scale: Max value (+1) of this layer, used to scale the values.
    type: A FeatureType for scalar vs categorical.
    palette: A color palette for rendering.
    clip: Whether to clip the values for coloring.
  */

  constructor(kwargs) {
    super(kwargs)
  }
  static dtypes = {
    1: np.uint8,
    8: np.uint8,
    16: np.uint16,
    32: np.int32,
  }
  unpack(obs) {
    //Return a correctly shaped numpy array for this feature.//
    const planes = obs.feature_layer_data[this.layer_set]
    const plane = planes[this.name]
    return this.unpack_layer(plane)
  }
  unpack_layer(plane) {
    //Return a correctly shaped numpy array given the feature layer bytes.//
    const size = point.Point.build(plane.size)
    if (size[0] === 0 && size[1] === 0) {
      // New layer that isn't implemented in this SC2 version.
      return null
    }
  }
}