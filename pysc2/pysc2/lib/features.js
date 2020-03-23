const tf = require('@tensorflow/tfjs-node')
const s2clientprotocol = require('s2clientprotocol')
const Enum = require('enum')
const actions = require('./actions.js')
const colors = require('./colors.js')
const named_array = require('./named_array.js')
const point = require('./point.js')
const static_data = require('./static_data.js')
const stopwatch = require('./stopwatch.js')
const transform = require('./transform.js')
const pythonUtils = require('./pythonUtils.js')
const all_collections_generated_classes = require('./all_collections_generated_classes.js')

const sw = stopwatch.sw
const { spatial_pb2, ui_pb2 } = s2clientprotocol
const sc_spatial = spatial_pb2
const sc_ui = ui_pb2

// tf.tensor (values, shape?, dtype?) 
//tf.buffer([2, 2]);
const np = {
  array: tf.tensor,
  frombuffer: tf.buffer,
}
const np = tf.tensor
np.array = tf.tensor

const { int, isinstance } = pythonUtils

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
    this.color = sw.decorate(this.color)
  }

  static get dtypes() {
    return {
      1: np.uint8,
      8: np.uint8,
      16: np.uint16,
      32: np.int32,
    }
  }

  unpack(obs) {
    //Return a correctly shaped numpy array for this feature.//
    const planes = obs.feature_layer_data[this.layer_set]
    const plane = planes[this.name]
    return this.unpack_layer(plane)
  }

  static unpack_layer(plane) {
    //Return a correctly shaped numpy array given the feature layer bytes.//
    const size = point.Point.build(plane.size)
    if (size[0] === 0 && size[1] === 0) {
      // New layer that isn't implemented in this SC2 version.
      return null
    }
    let data = np.frombuffer(plane.data, Feature.dtypes[plane.bits_per_pixel])
    if (plane.bits_per_pixel === 1) {
      data = np.unpackbits(data)
      if (data.shape[0] != (size.x * size.y)) {
        // This could happen if the correct length isn't a multiple of 8, leading
        // to some padding bits at the end of the string which are incorrectly
        // interpreted as data.
        data = data.slice(0, size.x * size.y)
      }
    }
    return data.reshape(size.y, size.x)
  }

  static unpack_rgb_image(plane) {
    //Return a correctly shaped numpy array given the image bytes.//
    if (plane.bits_per_pixel !== 24) {
      throw new Error(`ValueError: plane.bits_per_pixel ${plane.bits_per_pixel} !== 24`)
    }
    const size = point.Point.build(plane.size)
    const data = np.frombuffer(plane.data, np.uint8)
    return data.reshape(size.y, size.x, 3)
  }

  color(plane) {
    if (this.clip) {
      plane = np.clip(plane, 0, this.scale - 1)
    }
    return this.palette[plane]
  }
}

Feature.unpack_layer = sw.decorate(Feature.unpack_layer)
Feature.unpack_rgb_image = sw.decorate(Feature.unpack_rgb_image)
class ScreenFeatures extends all_collections_generated_classes.ScreenFeatures {
  constructor(kwargs) {
    //The set of screen feature layers.//
    const feats = {}
    let val
    Object.keys(kwargs).forEach((name) => {
      val = kwargs[name]
      const { scale, type_, palette, clip } = val
      feats[name] = new Feature({
        index: this.constructor._fields.indexOf(name),
        name,
        layer_set: 'renders',
        full_name: 'screen ' + name,
        scale,
        type: type_,
        palette: typeof (palette) === 'function' ? palette(scale) : palette,
        clip,
      })
    })
    super(feats)
  }
}

class MinimapFeatures extends all_collections_generated_classes.MinimapFeatures {
  //The set of minimap feature layers.//
  constructor(kwargs) {
    const feats = {}
    let val
    Object.keys(kwargs).forEach((name) => {
      val = kwargs[name]
      const { scale, type_, palette } = val
      feats[name] = new Feature({
        index: this.constructor._fields.indexOf(name),
        name,
        layer_set: 'minimap_renders',
        full_name: 'minimap ' + name,
        scale,
        type: type_,
        palette: typeof (palette) === 'function' ? palette(scale) : palette,
        clip: false,
      })
    })
    super(feats)
  }
}

const SCREEN_FEATURES = new ScreenFeatures({
  height_map: [256, FeatureType.SCALAR, colors.height_map, false],
  visibility_map: [4, FeatureType.CATEGORICAL, colors.VISIBILITY_PALETTE, false],
  creep: [2, FeatureType.CATEGORICAL, colors.CREEP_PALETTE, false],
  power: [2, FeatureType.CATEGORICAL, colors.POWER_PALETTE, false],
  player_id: [17, FeatureType.CATEGORICAL,
             colors.PLAYER_ABSOLUTE_PALETTE, false],
  player_relative: [5, FeatureType.CATEGORICAL,
                   colors.PLAYER_RELATIVE_PALETTE, false],
  unit_type: [Math.max(static_data.UNIT_TYPES) + 1, FeatureType.CATEGORICAL,
             colors.unit_type, false],
  selected: [2, FeatureType.CATEGORICAL, colors.SELECTED_PALETTE, false],
  unit_hit_points: [1600, FeatureType.SCALAR, colors.hot, true],
  unit_hit_points_ratio: [256, FeatureType.SCALAR, colors.hot, false],
  unit_energy: [1000, FeatureType.SCALAR, colors.hot, true],
  unit_energy_ratio: [256, FeatureType.SCALAR, colors.hot, false],
  unit_shields: [1000, FeatureType.SCALAR, colors.hot, true],
  unit_shields_ratio: [256, FeatureType.SCALAR, colors.hot, false],
  unit_density: [16, FeatureType.SCALAR, colors.hot, true],
  unit_density_aa: [256, FeatureType.SCALAR, colors.hot, false],
  effects: [16, FeatureType.CATEGORICAL, colors.effects, false],
  hallucinations: [2, FeatureType.CATEGORICAL, colors.POWER_PALETTE, false],
  cloaked: [2, FeatureType.CATEGORICAL, colors.POWER_PALETTE, false],
  blip: [2, FeatureType.CATEGORICAL, colors.POWER_PALETTE, false],
  buffs: [Math.max(static_data.BUFFS) + 1, FeatureType.CATEGORICAL,
         colors.buffs, false],
  buff_duration: [256, FeatureType.SCALAR, colors.hot, false],
  active: [2, FeatureType.CATEGORICAL, colors.POWER_PALETTE, false],
  build_progress: [256, FeatureType.SCALAR, colors.hot, false],
  pathable: [2, FeatureType.CATEGORICAL, colors.winter, false],
  buildable: [2, FeatureType.CATEGORICAL, colors.winter, false],
  placeholder: [2, FeatureType.CATEGORICAL, colors.winter, false],
})

const MINIMAP_FEATURES = MinimapFeatures({
  height_map: [256, FeatureType.SCALAR, colors.height_map],
  visibility_map: [4, FeatureType.CATEGORICAL, colors.VISIBILITY_PALETTE],
  creep: [2, FeatureType.CATEGORICAL, colors.CREEP_PALETTE],
  camera: [2, FeatureType.CATEGORICAL, colors.CAMERA_PALETTE],
  player_id: [17, FeatureType.CATEGORICAL, colors.PLAYER_ABSOLUTE_PALETTE],
  player_relative: [5, FeatureType.CATEGORICAL,
                   colors.PLAYER_RELATIVE_PALETTE],
  selected: [2, FeatureType.CATEGORICAL, colors.winter],
  unit_type: [Math.max(static_data.UNIT_TYPES) + 1, FeatureType.CATEGORICAL,
             colors.unit_type],
  alerts: [2, FeatureType.CATEGORICAL, colors.winter],
  pathable: [2, FeatureType.CATEGORICAL, colors.winter],
  buildable: [2, FeatureType.CATEGORICAL, colors.winter],
})

function _to_point(dims) {
  //Convert (width, height) or size -> point.Point.//
  if (!dims) {
    throw new Error(`ValueError: ${dims}`)
  }
  if (isinstance(dims, [Array])) {
    if (dims.length !== 2) {
      throw new Error(`ValueError: A two element array is expected here, got ${dims}.`)
    } else {
      const width = int(dims[0])
      const height = int(dims[1])
      if (width <= 0 || height <= 0) {
        throw new Error(`ValueError: Must specify +ve dims, got ${dims}.`)
      }
      return new point.Point(width, height)
    }
  } else {
    const size = int(dims)
    if (size <= 0) {
      throw new Error(`ValueError: Must specify +ve value for size, got ${dims}.`)
    }
    return point.Point(size, size)
  }
}

class Dimensions {
  constructor(screen = null, minimap = null) {
    /*Screen and minimap dimensions configuration.
    Both screen and minimap must be specified. Sizes must be positive.
    Screen size must be greater than or equal to minimap size in both dimensions.

    Attributes:
      screen: A (width, height) int tuple or a single int to be used for both.
      minimap: A (width, height) int tuple or a single int to be used for both.
    */
    if (!screen || !minimap) {
      throw new Error(`ValueError: screen and minimap must both be set, screen=${screen}, minimap=${minimap}.`)
    }
    this._screen = _to_point(screen)
    this._minimap = _to_point(minimap)
  }

  get screen() {
    return this._screen
  }

  get minimap() {
    return this._minimap
  }

  __repr__() {
    return `Dimensions(screen=${this.screen}, minimap=${this.minimap})`
  }

  __eq__(other) {
    return (isinstance(other, Dimensions) && this.screen === other.screen
      && this.minimap === other.minimap)
  }

  __ne__(other) {
    return !(this.__eq__(other))
  }
}

class AgentInterfaceFormat {
  //Observation and action interface format specific to a particular agent.//
  constructor({
    feature_dimensions = null,
    rgb_dimensions = null,
    raw_resolution = null,
    action_space = null,
    camera_width_world_units = null,
    use_feature_units = false,
    use_raw_units = false,
    use_raw_actions = false,
    max_raw_actions = 512,
    max_selected_units = 30,
    use_unit_counts = false,
    use_camera_position = false,
    show_cloaked = false,
    show_burrowed_shadows = false,
    show_placeholders = false,
    hide_specific_actions = true,
    action_delay_fn = null,
    send_observation_proto = false,
    crop_to_playable_area = false,
    raw_crop_to_playable_area = false,
    allow_cheating_layers = false,
    add_cargo_to_units = false
  }) {
    /*Initializer.

    Args:
      feature_dimensions: Feature layer `Dimension`s. Either this or
          rgb_dimensions (or both) must be set.
      rgb_dimensions: RGB `Dimension`. Either this or feature_dimensions
          (or both) must be set.
      raw_resolution: Discretize the `raw_units` observation's x,y to this
          resolution. Default is the map_size.
      action_space: If you pass both feature and rgb sizes, then you must also
          specify which you want to use for your actions as an ActionSpace Enum.
      camera_width_world_units: The width of your screen in world units. If your
          feature_dimensions.screen=(64, 48) and camera_width is 24, then each
          px represents 24 / 64 = 0.375 world units in each of x and y.
          It'll then represent a camera of size (24, 0.375 * 48) = (24, 18)
          world units.
      use_feature_units: Whether to include feature_unit observations.
      use_raw_units: Whether to include raw unit data in observations. This
          differs from feature_units because it includes units outside the
          screen and hidden units, and because unit positions are given in
          terms of world units instead of screen units.
      use_raw_actions: [bool] Whether to use raw actions as the interface.
          Same as specifying action_space=ActionSpace.RAW.
      max_raw_actions: [int] Maximum number of raw actions
      max_selected_units: [int] The maximum number of selected units in the
          raw interface.
      use_unit_counts: Whether to include unit_counts observation. Disabled by
          default since it gives information outside the visible area.
      use_camera_position: Whether to include the camera's position (in minimap
          coordinates) in the observations.
      show_cloaked: Whether to show limited information for cloaked units.
      show_burrowed_shadows: Whether to show limited information for burrowed
          units that leave a shadow on the ground (ie widow mines and moving
          roaches and infestors).
      show_placeholders: Whether to show buildings that are queued for
          construction.
      hide_specific_actions: [bool] Some actions (eg cancel) have many
          specific versions (cancel this building, cancel that spell) and can
          be represented in a more general form. If a specific action is
          available, the general will also be available. If you set
          `hide_specific_actions` to False, the specific versions will also be
          available, but if it's True, the specific ones will be hidden.
          Similarly, when transforming back, a specific action will be returned
          as the general action. This simplifies the action space, though can
          lead to some actions in replays not being exactly representable using
          only the general actions.
      action_delay_fn: A callable which when invoked returns a delay in game
          loops to apply to a requested action. Defaults to None, meaning no
          delays are added (actions will be executed on the next game loop,
          hence with the minimum delay of 1).
      send_observation_proto: Whether or not to send the raw observation
          response proto in the observations.
      crop_to_playable_area: Crop the feature layer minimap observations down
          from the full map area to just the playable area. Also improves the
          heightmap rendering.
      raw_crop_to_playable_area: Crop the raw units to the playable area. This
          means units will show up closer to the origin with less dead space
          around their valid locations.
      allow_cheating_layers: Show the unit types and potentially other cheating
          layers on the minimap.
      add_cargo_to_units: Whether to add the units that are currently in cargo
          to the feature_units and raw_units lists.

    Raises:
      ValueError: if the parameters are inconsistent.
    */

    if (!(feature_dimensions || rgb_dimensions || use_raw_units)) {
      throw new Error(`Must set either the feature layer or rgb dimensions, or use raw units`)
    }
    if (action_space) {
      if (!isinstance(action_space, actions.ActionSpace)) {

      }
    }
  }
}