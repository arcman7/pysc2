const path = require('path') //eslint-disable-line
const s2clientprotocol = require('s2clientprotocol') //eslint-disable-line
const Enum = require('python-enum') //eslint-disable-line
const actions = require(path.resolve(__dirname, './actions.js'))
const colors = require(path.resolve(__dirname, './colors.js'))
const named_array = require(path.resolve(__dirname, './named_array.js'))
const point = require(path.resolve(__dirname, './point.js'))
const static_data = require(path.resolve(__dirname, './static_data.js'))
const stopwatch = require(path.resolve(__dirname, './stopwatch.js'))
const transform = require(path.resolve(__dirname, './transform.js'))
const pythonUtils = require(path.resolve(__dirname, './pythonUtils.js'))
const all_collections_generated_classes = require(path.resolve(__dirname, './all_collections_generated_classes.js'))
const np = require(path.resolve(__dirname, './numpy.js'))

const sw = stopwatch.sw
const { raw_pb, sc2api_pb } = s2clientprotocol
const sc_raw = raw_pb
const sc_pb = sc2api_pb
const { Defaultdict, int, isinstance, len, map, withPython, setUpProtoAction, sum, zip, getArgsArray } = pythonUtils
const EPSILON = 1e-5

const FeatureType = Enum.Enum('FeatureType', {
  SCALAR: 1,
  CATEGORICAL: 2,
})

const PlayerRelative = Enum.IntEnum('PlayerRelative', {
  /*The values for the `player_relative` feature layers.*/
  null: 0,
  SELF: 1,
  ALLY: 2,
  NEUTRAL: 3,
  ENEMY: 4,
})

const Visibility = Enum.IntEnum('Visibility', {
  /*Values for the `visibility` feature layers.*/
  HIDDEN: 0,
  SEEN: 1,
  VISIBLE: 2,
})

const Effects = Enum.IntEnum('Effects', {
  /*Values for the `effects` feature layer.*/
  null: 0,
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

const ScoreCumulative = Enum.IntEnum('ScoreCumulative', {
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

const ScoreByCategory = Enum.IntEnum('ScoreByCategory', {
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

const ScoreCategories = Enum.IntEnum('ScoreCategories', {
  /*Indices for the `score_by_category` observation's second dimension.*/
  null: 0,
  army: 1,
  economy: 2,
  technology: 3,
  upgrade: 4,
})

const ScoreByVital = Enum.IntEnum('ScoreByVital', {
  /*Indices for the `score_by_vital` observation's first dimension.*/
  total_damage_dealt: 0,
  total_damage_taken: 1,
  total_healed: 2,
})

const ScoreVitals = Enum.IntEnum('ScoreVitals', {
  /*Indices for the `score_by_vital` observation's second dimension.*/
  life: 0,
  shields: 1,
  energy: 2,
})

const Player = Enum.IntEnum('Player', {
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

const UnitLayer = Enum.IntEnum('UnitLayer', {
  /*Indices into the unit layers in the observations.*/
  unit_type: 0,
  player_relative: 1,
  health: 2,
  shields: 3,
  energy: 4,
  transport_slots_taken: 5,
  build_progress: 6,
})

const UnitCounts = Enum.IntEnum('UnitCounts', {
  /*Indices into the `unit_counts` observations.*/
  unit_type: 0,
  count: 1,
})

const FeatureUnit = Enum.IntEnum('FeatureUnit', {
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

const EffectPos = Enum.IntEnum('EffectPos', {
  /*Positions of the active effects.*/
  effect: 0,
  alliance: 1,
  owner: 2,
  radius: 3,
  x: 4,
  y: 5,
})

const Radar = Enum.IntEnum('Radar', {
  /*Positions of the Sensor towers.*/
  x: 0,
  y: 1,
  radius: 2,
})

const ProductionQueue = Enum.IntEnum('ProductionQueue', {
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
    // javascript only set up
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
const ScreenFeatures_fields = all_collections_generated_classes.ScreenFeatures._fields
class ScreenFeatures extends all_collections_generated_classes.ScreenFeatures {
  constructor(kwargs) {
    //The set of screen feature layers.//
    const feats = {}
    let val
    Object.keys(kwargs).forEach((name) => {
      val = kwargs[name]
      const { scale, type_, palette, clip } = val
      feats[name] = new Feature({
        index: ScreenFeatures_fields.indexOf(name),
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
const MinimapFeatures_fields = all_collections_generated_classes.MinimapFeatures._fields
class MinimapFeatures extends all_collections_generated_classes.MinimapFeatures {
  //The set of minimap feature layers.//
  constructor(kwargs) {
    const feats = {}
    let val
    Object.keys(kwargs).forEach((name) => {
      val = kwargs[name]
      const { scale, type_, palette } = val
      feats[name] = new Feature({
        index: MinimapFeatures_fields.indexOf(name),
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

const MINIMAP_FEATURES = new MinimapFeatures({
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
    return new point.Point(size, size)
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
      // arguments got passed as object
      if (screen.screen && screen.minimap) {
        const args = arguments[0] //eslint-disable-line
        screen = args.screen
        minimap = args.minimap
      } else {
        throw new Error(`ValueError: screen and minimap must both be set, screen=${screen}, minimap=${minimap}.`)
      }
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
          loops to apply to a requested action. Defaults to null, meaning no
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
        throw new Error('ValueError: action_space must be of type ActionSpace.')
      }
      if (action_space === actions.ActionSpace.RAW) {
        use_raw_actions = true
      } else if ((action_space === actions.ActionSpace.FEATURES && !(feature_dimensions)) || (action_space === actions.ActionSpace.RGB && !(rgb_dimensions))) {
        throw new Error(`ValueError: Action space must match the observations, action space=${action_space}, feature_dimensions=${feature_dimensions}, rgb_dimensions=${rgb_dimensions} `)
      }
    } else {
      if (use_raw_actions) {//eslint-disable-line
        action_space = actions.ActionSpace.RAW
      } else if (feature_dimensions && rgb_dimensions) {
        throw new Error('ValueError: You must specify the action space if you have both screen and rgb observations.')
      } else if (feature_dimensions) {
        action_space = actions.ActionSpace.FEATURES
      } else {
        action_space = actions.ActionSpace.RGB
      }
    }

    if (raw_resolution) {
      raw_resolution = _to_point(raw_resolution)
    }

    if (use_raw_actions) {
      if (!use_raw_units) {
        throw new Error('ValueError: You must set use_raw_units if you intend to use_raw_actions')
      }
      if (action_space !== actions.ActionSpace.RAW) {
        throw new Error('Don\'t specify both an action_space and use_raw_actions.')
      }
    }

    if (rgb_dimensions && (rgb_dimensions.screen.x < rgb_dimensions.minimap.x
      || rgb_dimensions.screen.y < rgb_dimensions.minimap.y)) {
      throw new Error(`RGB Screen (${rgb_dimensions.screen}) can't be smaller than the minimap (${rgb_dimensions.minimap}).`)
    }

    this._feature_dimensions = feature_dimensions
    this._rgb_dimensions = rgb_dimensions
    this._action_space = action_space
    this._camera_width_world_units = camera_width_world_units || 24
    this._use_feature_units = use_feature_units
    this._use_raw_units = use_raw_units
    this._raw_resolution = raw_resolution
    this._use_raw_actions = use_raw_actions
    this._max_raw_actions = max_raw_actions
    this._max_selected_units = max_selected_units
    this._use_unit_counts = use_unit_counts
    this._use_camera_position = use_camera_position
    this._show_cloaked = show_cloaked
    this._show_burrowed_shadows = show_burrowed_shadows
    this._show_placeholders = show_placeholders
    this._hide_specific_actions = hide_specific_actions
    this._action_delay_fn = action_delay_fn
    this._send_observation_proto = send_observation_proto
    this._add_cargo_to_units = add_cargo_to_units
    this._crop_to_playable_area = crop_to_playable_area
    this._raw_crop_to_playable_area = raw_crop_to_playable_area
    this._allow_cheating_layers = allow_cheating_layers

    if (action_space === actions.ActionSpace.FEATURES) {
      this._action_dimensions = feature_dimensions
    } else {
      this._action_dimensions = rgb_dimensions
    }
  }

  get feature_dimensions() {
    return this._feature_dimensions
  }

  get rgb_dimensions() {
    return this._rgb_dimensions
  }

  get action_space() {
    return this._action_space
  }

  get camera_width_world_units() {
    return this._camera_width_world_units
  }

  get use_feature_units() {
    return this._use_feature_units
  }

  get use_raw_units() {
    return this._use_raw_units
  }

  get raw_resolution() {
    return this._raw_resolution
  }

  set raw_resolution(value) {
    this._raw_resolution = value
  }

  get use_raw_actions() {
    return this._use_raw_actions
  }

  get max_raw_actions() {
    return this._max_raw_actions
  }

  get max_selected_units() {
    return this._max_selected_units
  }

  get use_unit_counts() {
    return this._use_unit_counts
  }

  get use_camera_position() {
    return this._use_camera_position
  }

  get show_cloaked() {
    return this._show_cloaked
  }

  get show_burrowed_shadows() {
    return this._show_burrowed_shadows
  }

  get show_placeholders() {
    return this._show_placeholders
  }

  get hide_specific_actions() {
    return this._hide_specific_actions
  }

  get action_delay_fn() {
    return this._action_delay_fn
  }

  get send_observation_proto() {
    return this._send_observation_proto
  }

  get add_cargo_to_units() {
    return this._add_cargo_to_units
  }

  get action_dimensions() {
    return this._action_dimensions
  }

  get crop_to_playable_area() {
    return this._crop_to_playable_area
  }

  get raw_crop_to_playable_area() {
    return this._raw_crop_to_playable_area
  }

  get allow_cheating_layers() {
    return this._allow_cheating_layers
  }
}

function parse_agent_interface_format({
  feature_screen = null,
  feature_minimap = null,
  rgb_screen = null,
  rgb_minimap = null,
  action_space = null,
  action_delays = null,
  kwargs
}) {
  /*Creates an AgentInterfaceFormat object from keyword args.

  Convenient when using dictionaries or command-line arguments for config.

  Note that the feature_* and rgb_* properties define the respective spatial
  observation dimensions and accept:
      * null or 0 to disable that spatial observation.
      * A single int for a square observation with that side length.
      * A (int, int) tuple for a rectangular (width, height) observation.

  Args:
    feature_screen: If specified, so must feature_minimap be.
    feature_minimap: If specified, so must feature_screen be.
    rgb_screen: If specified, so must rgb_minimap be.
    rgb_minimap: If specified, so must rgb_screen be.
    action_space: ["FEATURES", "RGB", "RAW"].
    action_delays: List of relative frequencies for each of [1, 2, 3, ...]
      game loop delays on executed actions. Only used when the environment
      is non-realtime. Intended to simulate the delays which can be
      experienced when playing in realtime. Note that 1 is the minimum
      possible delay; as actions can only ever be executed on a subsequent
      game loop.
    **kwargs: Anything else is passed through to AgentInterfaceFormat.

  Returns:
    An `AgentInterfaceFormat` object.

  Raises:
    ValueError: If an invalid parameter is specified.
  */
  let feature_dimensions
  let rgb_dimensions
  if (feature_screen || feature_minimap) {
    feature_dimensions = new Dimensions(feature_screen, feature_minimap)
  } else {
    feature_dimensions = null
  }

  if (rgb_screen || rgb_minimap) {
    rgb_dimensions = new Dimensions(rgb_screen, rgb_minimap)
  } else {
    rgb_dimensions = null
  }

  function _action_delay_fn(delays) {
    //Delay frequencies per game loop delay -> fn returning game loop delay.//
    if (!delays) {
      return null
    }
    const total = sum(delays)
    let delay
    const cumulative_sum = np.cumsum(Object.keys(delays).map((key) => {
      delay = delays[key]
      return delay / total
    }))
    function fn() {
      const sample = Math.random() - EPSILON
      let cumulative
      for (let i = 0; i < cumulative_sum.length; i++) {
        cumulative = cumulative_sum[0]
        if (sample <= cumulative) {
          return i + 1
        }
      }
      throw new Error('ValueError: Failed to sample action delay??')
    }
    return fn
  }
  const usedArgs = {
    feature_dimensions,
    rgb_dimensions,
    action_space: (action_space && actions.ActionSpace[action_space.toUpperCase()]),
    action_delay_fn: _action_delay_fn(action_delays),
    kwargs,
  }
  Object.keys(arguments[0]).forEach((key) => {
    usedArgs[key] = usedArgs[key] || arguments[0][key]
  })
  return new AgentInterfaceFormat(usedArgs)
}

function features_from_game_info({ game_info, agent_interface_format = null, map_name = null, kwargs }) {
  /*Construct a Features object using data extracted from game info.

  Args:
    game_info: A `sc_pb.ResponseGameInfo` from the game.
    agent_interface_format: an optional AgentInterfaceFormat.
    map_name: an optional map name, which overrides the one in game_info.
    **kwargs: Anything else is passed through to AgentInterfaceFormat. It's an
        error to send any kwargs if you pass an agent_interface_format.

  Returns:
    A features object matching the specified parameterisation.

  Raises:
    ValueError: if you pass both agent_interface_format and kwargs.
    ValueError: if you pass an agent_interface_format that doesn't match
        game_info's resolutions.
  */
  if (!map_name) {
    map_name = game_info.getMapName()
  }
  let fl_opts
  let feature_dimensions
  let camera_width_world_units
  if (game_info.getOptions().hasFeatureLayer()) {
    fl_opts = game_info.getOptions().getFeatureLayer()
    feature_dimensions = new Dimensions({
      screen: [fl_opts.getResolution().getX(), fl_opts.getResolution().getY()],
      minimap: [fl_opts.getMinimapResolution().getX(), fl_opts.getMinimapResolution().getY()],
    })
    camera_width_world_units = game_info.getOptions().getFeatureLayer().getWidth()
  } else {
    feature_dimensions = null
    camera_width_world_units = null
  }
  let rgb_opts
  let rgb_dimensions
  if (game_info.getOptions().hasRender()) {
    rgb_opts = game_info.getOptions().getRender()
    rgb_dimensions = new Dimensions({
      screen: [rgb_opts.getResolution().getX(), rgb_opts.getResolution().getY()],
      minimap: [rgb_opts.getMinimapResolution().getX(), rgb_opts.getMinimapResolution().getY()],
    })
  } else {
    rgb_dimensions = null
  }

  const map_size = game_info.getStartRaw().getMapSize()

  const requested_races = {}
  game_info.getPlayerInfoList().forEach((info) => {
    if (info.getType() !== sc_pb.PlayerType.OBSERVER) {
      requested_races[info.getPlayerId()] = info.getRaceRequested()
    }
  })

  if (agent_interface_format) {
    if (kwargs) {
      throw new Error('ValueError: Either give an agent_interface_format or kwargs, not both.')
    }
    const aif = agent_interface_format
    if (aif.rgb_dimensions !== rgb_dimensions
      || aif.feature_dimensions !== feature_dimensions
      || (feature_dimensions
      && aif.camera_width_world_units !== camera_width_world_units)) {
      throw new Error(`The supplied agent_interface_format doesn't match the resolutions computed from the game_info:
  rgb_dimensions: ${aif.rgb_dimensions} !== ${rgb_dimensions}
  feature_dimensions: ${aif.feature_dimensions} !== ${feature_dimensions}
  camera_width_world_units: ${aif.camera_width_world_units} !== ${camera_width_world_units}`)
    }
  } else {
    const args = {
      feature_dimensions,
      rgb_dimensions,
      camera_width_world_units,
    }
    Object.keys(kwargs).forEach((key) => {
      args[key] = kwargs[key]
    })
    agent_interface_format = new AgentInterfaceFormat(args)
  }
  return new Feature({
    agent_interface_format,
    map_size,
    map_name,
    requested_races,
  })
}

function _init_valid_functions(action_dimensions) {
  //Initialize ValidFunctions and set up the callbacks.//
  const screen = []
  const screen2 = []
  const minimap = []
  action_dimensions.screen.forEach((i) => {
    screen.push(int(i))
    screen2.push(int(i))
  })
  action_dimensions.minimap.forEach((i) => {
    minimap.push(int(i))
  })
  const sizes = {
    screen,
    screen2,
    minimap,
  }
  let args = actions.TYPES.map((t) => {
    return actions.ArgumentType.spec(t.id, t.name, sizes[t.name] || t.sizes)
  })
  const types = new actions.Arguments(args)
  args = actions.FUNCTIONS.map((f) => {
    const tuple = []
    f.args.forEach((t) => {
      tuple.push(types[t.id])
    })
    return actions.Function.spec(f.id, f.name, tuple)
  })
  const functions = new actions.Functions(args)
  return new actions.ValidActions(types, functions)
}

function _init_valid_raw_functions(raw_resolution, max_selected_units) {
  //Initialize ValidFunctions and set up the callbacks.//
  const world = []
  const unit_tags = [max_selected_units]
  Object.keys(raw_resolution).forEach((key) => {
    const i = raw_resolution[key]
    world.push(int(i))
  })
  const sizes = {
    world,
    unit_tags,
  }
  let args = actions.RAW_TYPES.map((t) => actions.ArgumentType
    .spec(t.id, t.name, sizes[t.name] || t.sizes))
  const types = new actions.RawArguments(args)
  args = actions.RAW_FUNCTIONS.map((f) => {
    const tuple = []
    Object.keys(f.args).forEach((k) => {
      const t = f.args[k]
      tuple.push(types[t.id])
    })
    return actions.Function.spec(f.id, f.name, tuple)
  })
  const functions = new actions.Functions(args)
  return new actions.ValidActions(types, functions)
}


class Features {
  /*Render feature layers from SC2 Observation protos into numpy arrays.

  This has the implementation details of how to render a starcraft environment.
  It translates between agent action/observation formats and starcraft
  action/observation formats, which should not be seen by agent authors. The
  starcraft protos contain more information than they should have access to.

  This is outside of the environment so that it can also be used in other
  contexts, eg a supervised dataset pipeline.
  */

  constructor(agent_interface_format = null, map_size = null,
    requested_races = null, map_name = 'unknown') {
    /*Initialize a Features instance matching the specified interface format.

    Args:
      agent_interface_format: See the documentation for `AgentInterfaceFormat`.
      map_size: The size of the map in world units, needed for feature_units.
      requested_races: Optional. Dict mapping `player_id`s to that player's
          requested race. If present, will send player races in observation.
      map_name: Optional name of the map, to be added to the observation.

    Raises:
      ValueError: if agent_interface_format isn't specified.
      ValueError: if map_size isn't specified when use_feature_units or
          use_camera_position is.
    */
    if (!agent_interface_format) {
      throw new Error('ValueError: Please specify agent_interface_format')
    }

    this._agent_interface_format = agent_interface_format
    const aif = this._agent_interface_format
    if (!aif.raw_resolution && map_size) {
      aif.raw_resolution = point.Point.build(map_size)
    }
    this._map_size = map_size
    this._map_name = map_name

    if (aif.use_feature_units
        || aif.use_camera_position
        || aif.use_raw_units) {
      this.init_camera(
        aif.feature_dimensions,
        map_size,
        aif.camera_width_world_units,
        aif.raw_resolution
      )
    }
    this._send_observation_proto = aif.send_observation_proto
    this._raw = aif.use_raw_actions

    if (this._raw) {
      this._valid_functions = _init_valid_raw_functions(
        aif.raw_resolution, aif.max_selected_units
      )
      this._raw_tags = []
    } else {
      this._valid_functions = _init_valid_functions(aif.action_dimensions)
    }
    this._requested_races = requested_races

    if (requested_races !== null && requested_races.length <= 2) {
      throw new Error('ValueError: requested_races.length is greater than 2')
    }
    // apply @sw.decorate
    this.transform_obs = sw.decorate(this.transform_obs.bind(this))
    this.available_actions = sw.decorate(this.available_actions.bind(this))
    this.transform_action = sw.decorate(this.transform_action.bind(this))
    this.reverse_action = sw.decorate(this.reverse_action.bind(this))
    this.reverse_raw_action = sw.decorate(this.reverse_raw_action.bind(this))
  }

  init_camera(feature_dimensions, map_size, camera_width_world_units, raw_resolution) {
    /*Initialize the camera (especially for feature_units).

    This is called in the constructor and may be called repeatedly after
    `Features` is constructed, since it deals with rescaling coordinates and not
    changing environment/action specs.

    Args:
      feature_dimensions: See the documentation in `AgentInterfaceFormat`.
      map_size: The size of the map in world units.
      camera_width_world_units: See the documentation in `AgentInterfaceFormat`.
      raw_resolution: See the documentation in `AgentInterfaceFormat`.

    Raises:
      ValueError: If map_size or camera_width_world_units are falsey (which
          should mainly happen if called by the constructor).
    */
    if (!map_size || !camera_width_world_units) {
      throw new Error(`ValueError:
          "Either pass the game_info with raw enabled, or map_size and "
          "camera_width_world_units in order to use feature_units or camera"
          "position.`)
    }
    map_size = point.Point.build(map_size)
    this._world_to_world_tl = new transform.Linear(
      new point.Point(1, -1),
      new point.Point(0, map_size.y)
    )
    const offset = -map_size.div(4)
    this._world_tl_to_world_camera_rel = new transform.Linear(null, offset)
    if (feature_dimensions) {
      const world_camera_rel_to_feature_screen = new transform.Linear(
        feature_dimensions.screen.div(camera_width_world_units),
        feature_dimensions.screen.div(2)
      )
      this._world_to_feature_screen_px = new transform.Chain(
        this._world_to_world_tl,
        this._world_tl_to_world_camera_rel,
        world_camera_rel_to_feature_screen,
        new transform.PixelToCoord()
      )
    }
    // If we don't have a specified raw resolution, we do no new transform.
    const scale = raw_resolution ? raw_resolution.div(map_size.max_dim()) : null
    const world_tl_to_feature_minimap = new transform.Linear(scale)
    this._world_to_minimap_px = new transform.Chain(
      this._world_to_world_tl,
      world_tl_to_feature_minimap,
      new transform.PixelToCoord()
    )
    this._camera_size = (
      raw_resolution.div(map_size.max_dim()) * camera_width_world_units
    )
  }

  _update_camera(camera_center) {
    //Update the camera transform based on the new camera center.//
    this._world_tl_to_world_camera_rel.offset = (
      -this._world_to_world_tl.fwd_pt(camera_center)
      * this._world_tl_to_world_camera_rel.scale
    )
  }

  observation_spec() {
    /*The observation spec for the SC2 environment.

    It's worth noting that the image-like observations are in y,x/row,column
    order which is different than the actions which are in x,y order. This is
    due to conflicting conventions, and to facilitate printing of the images.

    Returns:
      The dict of observation names to their tensor shapes. Shapes with a 0 can
      vary in length, for example the number of valid actions depends on which
      units you have selected.
    */
    const obs_spec = new named_array.NamedDict({
      "action_result": [0], // See error.proto: ActionResult.
      "alerts": [0], // See sc2api.proto: Alert.
      "build_queue": [0, UnitLayer._keys.length],
      "cargo": [0, UnitLayer._keys.length],
      "cargo_slots_available": [1],
      "control_groups": [10, 2],
      "game_loop": [1],
      "last_actions": [0],
      "map_name": [0],
      "multi_select": [0, UnitLayer._keys.length],
      "player": [Player._keys.length],
      "production_queue": [0, ProductionQueue._keys.length],
      "score_cumulative": [ScoreCumulative._keys.length],
      "score_by_category": [ScoreByCategory._keys.length, ScoreCategories._keys.length],
      "score_by_vital": [ScoreByVital._keys.length, ScoreVitals._keys.length],
      "single_select": [0, UnitLayer._keys.length], // Only (n, 7) for n in (0, 1).
    })

    if (!this._raw) {
      obs_spec["available_actions"] = [0]
    }

    const aif = this._agent_interface_format

    if (aif.feature_dimensions) {
      obs_spec["feature_screen"] = [
        SCREEN_FEATURES.length,
        aif.feature_dimensions.screen.y,
        aif.feature_dimensions.screen.x
      ]

      obs_spec["feature_minimap"] = [
        MINIMAP_FEATURES.length,
        aif.feature_dimensions.minimap.y,
        aif.feature_dimensions.minimap.x
      ]
    }
    if (aif.rgb_dimensions) {
      obs_spec["rgb_screen"] = [
        aif.rgb_dimensions.screen.y,
        aif.rgb_dimensions.screen.x,
        3
      ]
      obs_spec["rgb_minimap"] = [
        aif.rgb_dimensions.minimap.y,
        aif.rgb_dimensions.minimap.x,
        3
      ]
    }
    if (aif.use_feature_units) {
      obs_spec["feature_units"] = [0, FeatureUnit._keys.length]
      obs_spec["feature_effects"] = [0, EffectPos._keys.length]
    }
    if (aif.use_raw_units) {
      obs_spec["raw_units"] = [0, FeatureUnit._keys.length]
      obs_spec["raw_effects"] = [0, EffectPos._keys.length]
    }
    if (aif.use_feature_units || aif.use_raw_units) {
      obs_spec["radar"] = [0, Radar._keys.length]
    }

    obs_spec["upgrades"] = [0]

    if (aif.use_unit_counts) {
      obs_spec["unit_counts"] = [0, UnitCounts._keys.length]
    }

    if (aif.use_camera_position) {
      obs_spec["camera_position"] = [2]
      obs_spec["camera_size"] = [2]
    }
    if (this._send_observation_proto) {
      obs_spec["_response_observation"] = [0]
    }

    obs_spec["home_race_requested"] = [1]
    obs_spec["away_race_requested"] = [1]
    return obs_spec
  }

  action_spec() {
    //The action space pretty complicated and fills the ValidFunctions.//
    return this._valid_functions
  }

  get map_size() {
    return this._map_size
  }

  get requested_races() {
    return this._requested_races
  }

  transform_obs(obs) {
    //Render some SC2 observations into something an agent can handle.//
    const empty_unit = np.array([], /*dtype=*/np.int32).reshape([0, UnitLayer._keys.length])
    const out = named_array.NamedDict({ // Fill out some that are sometimes empty.
      'single_select': empty_unit,
      'multi_select': empty_unit,
      'build_queue': empty_unit,
      'cargo': empty_unit,
      'production_queue': np.array([], /*dtype=*/np.int32).reshape(
        [0, ProductionQueue._keys.length]
      ),
      'last_actions': np.array([], /*dtype=*/np.int32),
      'cargo_slots_available': np.array([0], /*dtype=*/np.int32),
      'home_race_requested': np.array([0], /*dtype=*/np.int32),
      'away_race_requested': np.array([0], /*dtype=*/np.int32),
      'map_name': this._map_name,
    })
    let raw // defined on line 1497
    function or_zeros(layer, size) {
      if (layer !== null) {
        return layer.astype(np.int32, /*copy=*/false)
      }
      return np.zeros([size.y, size.x], /*dtype=*/np.int32)
    }
    const aif = this._agent_interface_format

    if (aif.feature_dimensions) {
      withPython(sw('feature_screen'), () => {
        const stacks = SCREEN_FEATURES.map((f) => {
          return or_zeros(f.unpack(obs.observation), aif.feature_dimensions.scren)
        })
        out['feature_screen'] = named_array.NamedNumpyArray(
          np.stack(stacks),
          /*names=*/[ScreenFeatures, null, null]
        )
      })
      withPython(sw('feature_minimap'), () => {
        const stacks = MINIMAP_FEATURES.map((f) => {
          return or_zeros(f.unpack(obs.observation), aif.feature_dimensions.minimap)
        })
        out['feature_minimap'] = named_array.NamedNumpyArray(
          np.stack(stacks),
          /*names=*/[MinimapFeatures, null, null]
        )
      })
    }
    if (aif.rgb_dimensions) {
      withPython(sw('rgb_screen'), () => {
        out['rgb_screen'] = Feature.unpack_rgb_image(
          obs.observation.render_data.map).astype(np.int32)
      })
      withPython(sw('rgb_minimap'), () => {
        out['rgb_minimap'] = Feature.unpack_rgb_image(
          obs.observation.render_data.minimap).astype(np.int32)
      })
    }
    if (!this._raw) {
      withPython(sw('last_actions'), () => {
        const acts = Object.keys(obs.actions).map((key) => {
          const a = obs.actions[key]
          return this.reverse_action(a).function
        })
        out['last_actions'] = np.array(
          acts,
          /*dtype=*/np.int32
        )
      })
    }
    out['action_result'] = np.array(
      Object.keys(obs.action_errors).map((key) => {
        const o = obs.action_errors[key]
        return o.result
      }),
      /*dtype=*/np.int32
    )

    out['alerts'] = np.array(obs.observation.alerts, /*dtype=*/np.int32)

    out['game_loop'] = np.array([obs.observation.game_loop], /*dtype=*/np.int32)

    withPython(sw('score'), () => {
      const score_details = obs.observation.score.score_details
      out['score_cumulative'] = named_array.NamedNumpyArray([
        obs.observation.score.score,
        score_details.idle_production_time,
        score_details.idle_worker_time,
        score_details.total_value_units,
        score_details.total_value_structures,
        score_details.killed_value_units,
        score_details.killed_value_structures,
        score_details.collected_minerals,
        score_details.collected_vespene,
        score_details.collection_rate_minerals,
        score_details.collection_rate_vespene,
        score_details.spent_minerals,
        score_details.spent_vespene,
      ], /*names=*/ScoreCumulative, /*dtype=*/np.int32)

      function get_score_details(key, details, categories) {
        const row = details[key.name]
        return Object.keys(categories)
          .map((category) => row[category.name])
      }
      out['score_by_category'] = named_array.NamedNumpyArray(
        Object.keys(ScoreByCategory).map((k) => {
          const key = ScoreByCategory[k]
          return get_score_details(key, score_details, ScoreCategories)
        }),
        /*names=*/[ScoreByCategory, ScoreCategories],
        /*dtype=*/np.int32
      )

      out['score_by_vital'] = named_array.NamedNumpyArray(
        Object.keys(ScoreByVital).map((k) => {
          const key = ScoreByCategory[k]
          return get_score_details(key, score_details, ScoreVitals)
        }),
        /*names=*/[ScoreByVital, ScoreVitals],
        /*dtype=*/np.int32
      )
    })
    const player = obs.observation.player_common
    out['player'] = named_array.NamedNumpyArray(
      [
        player.player_id,
        player.minerals,
        player.vespene,
        player.food_used,
        player.food_cap,
        player.food_army,
        player.food_workers,
        player.idle_worker_count,
        player.army_count,
        player.warp_gate_count,
        player.larva_count,
      ],
      /*names=*/Player,
      /*dtype=*/np.int32
    )

    function unit_vec(u) {
      return np.array([
        u.unit_type,
        u.player_relative,
        u.health,
        u.shields,
        u.energy,
        u.transport_slots_taken,
        int(u.build_progress * 100), // discretize
      ], /*dtype=*/np.int32)
    }
    const ui = obs.observation.ui_data

    withPython(sw('ui'), () => {
      const groups = np.zeros([10, 2], /*dtype=*/np.int32)
      Object.keys(ui.groups).forEach((key) => {
        const g = ui.groups[key]
        // check this
        groups[g.control_group_index] = [g.leader_unit_type, g.count]
      })
      out['control_groups'] = groups

      if (ui.has('single')) {
        out['single_select'] = named_array.NamedNumpyArray(
          [unit_vec(ui.single.unit)], [null, UnitLayer]
        )
      } else if (ui.has('multi')) {
        out['multi_select'] = named_array.NamedNumpyArray(
          Object.keys(ui.multi.units).map((key) => {
            const u = ui.multi.units[key]
            return unit_vec(u)
          })
        )
      } else if (ui.has('cargo')) {
        out['single_select'] = named_array.NamedNumpyArray(
          [unit_vec(ui.cargo.unit)], [null, UnitLayer]
        )
        out['cargo'] = named_array.NamedNumpyArray(
          Object.keys(ui.cargo.passengers).map((key) => {
            const u = ui.cargo.passengers[key]
            return unit_vec(u)
          }),
          [null, UnitLayer]
        )
        out['cargo_slots_available'] = np.array(
          [ui.cargo.slots_available],
          /*dtype=*/np.int32
        )
      } else if (ui.has('production')) {
        out['single_select'] = named_array.NamedNumpyArray(
          [unit_vec(ui.production.unit)], [null, UnitLayer]
        )
        if (ui.production.build_queue) {
          out['build_queue'] = named_array.NamedNumpyArray(
            Object.keys(ui.production.build_queue).map((key) => {
              const u = ui.production.build_queue[key]
              return unit_vec(u)
            }),
            [null, UnitLayer],
            /*dtype=*/np.int32
          )
        }
        if (ui.production.production_queue) {
          out['production_queue'] = named_array.NamedNumpyArray(
            Object.keys(ui.production.production_queue).map((key) => {
              const item = ui.production.production_queue[key]
              return [item.ability_id, item.build_progress * 100]
            }),
            [null, ProductionQueue],
            /*dtype=*/np.int32
          )
        }
      }
    })
    const tag_types = {} // Only populate the cache if it's needed.
    function get_addon_type(tag) {
      if (!Object.keys(tag_types).length) {
        Object.keys(raw.units).forEach((key) => {
          const u = raw.units[key]
          tag_types[u.tag] = u.unit_type
        })
      }
      return tag_types.get(tag, 0)
    }
    function full_unit_vec(u, pos_transform, is_raw = false) {
      //Compute unit features.//
      const screen_pos = pos_transform.fwd_pt(
        point.Point.build(u.pos)
      )
      const screen_radius = pos_transform.fwd_dist(u.radius)
      function raw_order(i) {
        if (u.order.length === undefined) {
          throw new Error('ValueError: u.order.length is undefined\nu.order: ', u.order)
        }
        if (u.orders.length > i) {
          // TODO(tewalds): Return a generalized func id.
          return actions.RAW_ABILITY_ID_TO_FUNC_ID.get(u.orders[i].ability_id, 0)
        }
        return 0
      }
      const features = [
        // Match unit_vec order
        u.unit_type,
        u.alliance, // Self = 1, Ally = 2, Neutral = 3, Enemy = 4
        u.health,
        u.shield,
        u.energy,
        u.cargo_space_taken,
        int(u.build_progress * 100), // discretize

        // Resume API order
        u.health_max > 0 ? int(u.health / u.health_max * 255) : 0,
        u.shield_max > 0 ? int(u.shield / u.shield_max * 255) : 0,
        u.energy_max > 0 ? int(u.energy / u.energy_max * 255) : 0,
        u.display_type, // Visible = 1, Snapshot = 2, Hidden = 3
        u.owner, // 1-15, 16 = neutral
        screen_pos.x,
        screen_pos.y,
        u.facing,
        screen_radius,
        u.cloak, // Cloaked = 1, CloakedDetected = 2, NotCloaked = 3
        u.is_selected,
        u.is_blip,
        u.is_powered,
        u.mineral_contents,
        u.vespene_contents,

        // Not populated for enemies or neutral
        u.cargo_space_max,
        u.assigned_harvesters,
        u.ideal_harvesters,
        u.weapon_cooldown,
        u.orders.length,
        raw_order(0),
        raw_order(1),
        is_raw ? u.tag : 0,
        u.is_hallucination,
        u.buff_ids.length >= 1 ? u.buff_ids[0] : 0,
        u.buff_ids.length >= 2 ? u.buff_ids[1] : 0,
        u.add_on_tag ? get_addon_type(u.add_on_tag) : 0,
        u.is_active,
        u.is_on_screen,
        u.orders.length >= 1 ? int(u.orders[0].progress * 100) : 0,
        u.orders.length >= 2 ? int(u.orders[1].progress * 100) : 0,
        raw_order(2),
        raw_order(3),
        0,
        u.buff_duration_remain,
        u.buff_duration_max,
        u.attack_upgrade_level,
        u.armor_upgrade_level,
        u.shield_upgrade_level,
      ]
      return features
    }
    raw = obs.observation.raw_data

    if (aif.use_feature_units) {
      console.log('*** THIS SECTION MUST BE FIXED ****')
      withPython(sw('feature_units'), () => {
        // Update the camera location so we can calculate world to screen pos
        this._update_camera(point.Point.build(raw.player.camera))
        const feature_units = Object.keys(raw.units).filter((key) => {
          const u = raw.units[key]
          return u.is_on_screen
        })
          .map((u) => full_unit_vec(u, this._world_to_feature_screen_px))
        out['feature_units'] = named_array.NamedNumpyArray(
          feature_units, [null, FeatureUnit], /*dtype=*/np.int64
        )

        const feature_effects = []
        const feature_screen_size = aif.feature_dimensions.screen
        Object.keys(raw.effects).forEach((key) => {
          const effect = raw.effects[key]
          Object.keys(effect.pos).forEach((k) => {
            const pos = effect.pos[k]
            const screen_pos = this._world_to_feature_screen_px.fwd_pt(
              point.Point.build(pos)
            )
            if (screen_pos.x >= 0 && screen_pos.x < feature_screen_size.x
              && screen_pos.y >= 0 && screen_pos.y < feature_screen_size.y) {
              feature_effects.push([
                effect.effect_id,
                effect.alliance,
                effect.owner,
                effect.radius,
                screen_pos.x,
                screen_pos.y,
              ])
            }
          })
        })
        out['feature_effects'] = named_array.NamedNumpyArray(
          feature_effects, [null, EffectPos], /*dtype=*/np.int32
        )
      })
    }
    if (aif.use_raw_units) {
      let raw_units
      withPython(sw('raw_units'), () => {
        withPython(sw('to_list'), () => {
          raw_units = Object.keys(raw.units).map((key) => {
            const u = raw.units[key]
            return full_unit_vec(u, this._world_to_minimap_px, /*is_raw=*/true)
          })
        })
        withPython(sw('to_numpy'), () => {
          out['raw_units'] = named_array.NamedNumpyArray(
            raw_units, [null, FeatureUnit], /*dtype=*/np.int64
          )
        })
        if (raw_units) {
          const temp = []
          for (let i = 0; i < out['raw_units'].length; i++) {
            temp.push(out['raw_units'][i][FeatureUnit.tag])
          }
          this._raw_tags = temp
        } else {
          this._raw_tags = np.array([])
        }

        const raw_effects = []
        Object.keys(raw.effects).forEach((key) => {
          const effect = raw.effects[key]
          Object.keys(effect.pos).forEach((k) => {
            const pos = effect.pos[k]
            const raw_pos = this._world_to_minimap_px.fwd_pt(point.Point.build(pos))
            raw_effects.push([
              effect.effect_id,
              effect.alliance,
              effect.owner,
              effect.radius,
              raw_pos.x,
              raw_pos.y,
            ])
          })
        })
        out['raw_effects'] = named_array.NamedNumpyArray(
          raw_effects, [null, EffectPos], /*dtype=*/np.int32
        )
      })
    }
    out['upgrades'] = np.array(raw.player.upgrade_ids, /*dtype=*/np.int32)

    function cargo_units(u, pos_transform, is_raw = false) {
      //Compute unit features.//
      const screen_pos = pos_transform.fwd_pt(
        point.Point.build(u.pos)
      )
      const features = []
      Object.keys(u.passengers).forEach((key) => {
        const v = u.passengers[key]
        features.push([
          v.unit_type,
          u.alliance, // this = 1, Ally = 2, Neutral = 3, Enemy = 4
          v.health,
          v.shield,
          v.energy,
          0, // cargo_space_taken
          0, // build_progress
          v.health_max > 0 ? int(v.health / v.health_max * 255) : 0,
          v.shield_max > 0 ? int(v.shield / v.shield_max * 255) : 0,
          v.energy_max > 0 ? int(v.energy / v.energy_max * 255) : 0,
          0, // display_type
          u.owner, // 1-15, 16 = neutral
          screen_pos.x,
          screen_pos.y,
          0, // facing
          0, // screen_radius
          0, // cloak
          0, // is_selected
          0, // is_blip
          0, // is powered
          0, // mineral_contents
          0, // vespene_contents
          0, // cargo_space_max
          0, // assigned_harvesters
          0, // ideal_harvesters
          0, // weapon_cooldown
          0, // order_length
          0, // order_id_0
          0, // order_id_1
          is_raw ? v.tag : 0,
          0, // is hallucination
          0, // buff_id_1
          0, // buff_id_2
          0, // addon_unit_type
          0, // active
          0, // is_on_screen
          0, // order_progress_1
          0, // order_progress_2
          0, // order_id_2
          0, // order_id_3
          1, // is_in_cargo
          0, // buff_duration_remain
          0, // buff_duration_max
          0, // attack_upgrade_level
          0, // armor_upgrade_level
          0, // shield_upgrade_level
        ])
      })
      return features
    }
    if (aif.add_cargo_to_units) {
      let feature_cargo_units
      withPython(sw('add_cargo_to_units'), () => {
        if (aif.use_feature_units) {
          withPython(sw('feature_units'), () => {
            withPython(sw('to_list'), () => {
              feature_cargo_units = []
              Object.keys(raw.units).forEach((key) => {
                const u = raw.units[key]
                if (!u.is_on_screen) {
                  return
                }
                feature_cargo_units
                  .push(cargo_units(u, this._world_to_feature_screen_px))
              })
            })
            withPython(sw('to_numpy'), () => {
              if (feature_cargo_units) {
                let all_feature_units = np.array(
                  feature_cargo_units, /*dtype=*/np.int64)
                all_feature_units = np.concatenate(
                  [out['feature_units'], feature_cargo_units], /*axis=*/0)
                out['feature_units'] = named_array.NamedNumpyArray(
                  all_feature_units, [null, FeatureUnit], /*dtype=*/np.int64)
              }
            })
          })
        }
        if (aif.use_raw_units) {
          let raw_cargo_units
          withPython(sw('raw_units'), () => {
            withPython(sw('to_list'), () => {
              raw_cargo_units = []
              Object.keys(raw.units).forEach((key) => {
                const u = raw.units[key]
                if (!u.is_on_screen) {
                  return
                }
                raw_cargo_units
                  .push(cargo_units(u, this._world_to_minimap_px, true))
              })
            })
            withPython(sw('to_numpy'), () => {
              if (raw_cargo_units) {
                raw_cargo_units = np.array(raw_cargo_units, /*dtype=*/np.int64)
                const all_raw_units = np.concatenate(
                  [out['raw_units'], raw_cargo_units], /*axis=*/0
                )
                out['raw_units'] = named_array.NamedNumpyArray(
                  all_raw_units, [null, FeatureUnit], /*dtype=*/np.int64
                )
                const temp = []
                for (let i = 0; i < out['raw_units'].length; i++) {
                  temp.push(out['raw_units'][i][FeatureUnit.tag])
                }
                this._raw_tags = temp
              }
            })
          })
        }
      })
    }

    if (aif.use_unit_counts) {
      withPython(sw('unit_counts'), () => {
        const unit_counts = new Defaultdict(0)
        Object.keys(raw.units).forEach((key) => {
          const u = raw.units[key]
          if (u.alliance !== sc_raw.Self) {
            return
          }
          unit_counts[u.unit_type] += 1
        })
        out['unit_counts'] = named_array.NamedNumpyArray(
          Object.keys(unit_counts).map((key) => { //eslint-disable-line
            return [key, unit_counts[key]]
          }).sort((a, b) => a[0] < b[0]),
          [null, UnitCounts],
          /*dtype=*/np.int32
        )
      })
    }

    if (aif.use_camera_position) {
      const camera_position = this._world_to_minimap_px.fwd_pt(
        point.Point.build(raw.player.camera)
      )
      out['camera_position'] = np.array((camera_position.x, camera_position.y),
        /*dtype=*/np.int32)
      out['camera_size'] = np.array((this._camera_size.x, this._camera_size.y),
        /*dtype=*/np.int32)
    }
    if (!this._raw) {
      out['available_actions'] = np.array(
        this.available_actions(obs.observation), /*dtype=*/np.int32
      )
    }

    if (this._requested_races !== null) {
      out['home_race_requested'] = np.array(
        [this._requested_races[player.player_id]], /*dtype=*/np.int32
      )
      Object.keys(this._requested_races).forEach((player_id) => {
        const race = this._requested_races[player_id]
        if (player_id !== player.player_id) {
          out['away_race_requested'] = np.array([race], /*dtype=*/np.int32)
        }
      })
    }
    if (aif.use_feature_units || aif.use_raw_units) {
      function transform_radar(radar) { //eslint-disable-line
        const p = this._world_to_minimap_px.fwd_pt(point.Point.build(radar.pos))
        return [p.x, p.y, radar.radius]
      }
      out['radar'] = named_array.NamedNumpyArray(
        [map(transform_radar, obs.observation.raw_data.radar)],
        [null, Radar], /*dtype=*/np.int32
      )
    }
    // Send the entire proto as well (in a function, so it isn't copied).
    if (this._send_observation_proto) {
      out["_response_observation"] = () => obs
    }

    return out
  }

  available_actions(obs) {
    //Return the list of available action ids.//
    const available_actions = new Set()
    const hide_specific_actions = this._agent_interface_format.hide_specific_actions
    Object.keys(actions.FUNCTIONS_AVAILABLE).forEach((i) => {
      const func = actions.FUNCTIONS_AVAILABLE[i]
      if (func.avail_fn(obs)) {
        available_actions.add(func.id.key)
      }
    })
    const abilities = obs.getAbilitiesList()
    for (let index = 0; index < abilities.length; index++) {
      const a = abilities[index]
      if (!(actions.ABILITY_IDS.hasOwnProperty(a.getAbilityId()))) {
        console.warn(`Unknown ability ${a.ability_id} seen as available.`, a.ability_id)
        return
      }
      let found_applicable = false
      const ability_id = a.getAbilityId()
      Object.keys(actions.ABILITY_IDS[ability_id]).forEach((k_id) => {
        const func = actions.ABILITY_IDS[ability_id][k_id]
        if (actions.POINT_REQUIRED_FUNCS.get(a.getRequiresPoint())
          .hasOwnProperty(func.function_type.name)) {
          if (func.general_id == 0 || !hide_specific_actions) {
            available_actions.add(func.id.key)
            found_applicable = true
          }
          if (func.general_id != 0) { // Always offer generic actions.
            const general_funcs = actions.ABILITY_IDS[func.general_id]
            for (let i = 0; i < general_funcs.length; i++) {
              const general_func = general_funcs[i]
              if (general_func.function_type === func.function_type) {
                // Only the right type. Don't want to expose the general action
                // to minimap if only the screen version is available.
                available_actions.add(general_func.id.key)
                found_applicable = true
                break
              }
            }
          }
        }
      })
      if (!found_applicable) {
        throw new Error(`ValueError("Failed to find applicable action for ${JSON.stringify(a.toObject())}`)
      }
    }
    const results = []
    const iter = available_actions.values()
    let i
    while(i = iter.next().value) { results.push(i) } //eslint-disable-line
    return results
  }

  transform_action(obs, func_call, skip_available = false) {
    /*Transform an agent-style action to one that SC2 can consume.

    Args:
      obs: a `sc_pb.Observation` from the previous frame.
      func_call: a `FunctionCall` to be turned into a `sc_pb.Action`.
      skip_available: If true, assume the action is available. This should only
          be used for testing or if you expect to make actions that weren't
          valid at the last observation.

    Returns:
      a corresponding `sc_pb.Action`.

    Raises:
      ValueError: if the action doesn't pass validation.
    */
    // Ignore sc_pb.Action's to make the env more flexible, eg raw actions.
    if (isinstance(func_call, sc_pb.Action)) {
      return func_call
    }

    const func_id = func_call.function
    let func
    try {
      if (this._raw) {
        func = actions.RAW_FUNCTIONS[func_id.key]
      } else {
        func = actions.FUNCTIONS[func_id.key]
      }
    } catch (err) {
      throw new Error(`ValueError: Invalid function id: ${func_id.key}.`)
    }

    // Available?
    if (!skip_available && !this._raw && !this.available_actions(obs).hasOwnProperty(func_id.key)) {
      throw new Error(`ValueError: Function ${func_id.key} ${func.name} is currently not available`)
    }
    // Right number of args?
    if (func_call.arguments.length !== func.args.length) {
      throw new Error(`ValueError: Wrong number of arguments for function: ${func}, got:${func_call} ${func_call.arguments}`)
    }
    // Args are valid?
    const aif = this._agent_interface_format
    zip(func.args, func_call.arguments).forEach((pair) => {
      const [t, arg] = pair
      if (t.count) {
        if (len(arg) >= 1 && len(arg) <= t.count) {
          return
        }
        throw new Error(`ValueError: Wrong number of values for argument of ${func}, got: ${func_call.arguments}`)
      }
      let sizes
      if (t.name === 'screen' || t.name === 'screen2') {
        sizes = aif.action_dimensions.screen
      } else if (t.name === 'minimap') {
        sizes = aif.action_dimensions.minimap
      } else if (t.name === 'world') {
        sizes = aif.raw_resolution
      } else {
        sizes = t.sizes
      }
      if (sizes.length !== arg.length) {
        throw new Error(`ValueError: Wrong number of values for argument of ${func}, got: ${func_call.arguments}`)
      }
      zip(sizes, arg).forEach((p) => {
        const [s, a] = p
        if (!(a >= 0) && (a < s)) {
          throw new Error(`ValueError: Argument is out of range for ${func}, got: ${func_call.arguments}`)
        }
      })
    })

    // Convert them to python types.
    const kwargs = {}
    zip(func.args, func_call.arguments).forEach((pair) => {
      const [type_, a] = pair
      kwargs[type_.name] = type_.fn(a)
    })
    // Call the right callback to get an SC2 action proto.
    /**** set up proto ****/
    /*     SPATIAL     */
    const sc2_action = new sc_pb.Action()
    setUpProtoAction(sc2_action, func.function_type.name)
    kwargs['action'] = sc2_action
    if (func.ability_id) {
      kwargs['ability_id'] = func.ability_id
    }

    if (this._raw) {
      if (kwargs.hasOwnProperty('world')) {
        kwargs['world'] = this._world_to_minimap_px.back_pt(kwargs['world'])
      }
      const self = this
      function find_original_tag(position) {//eslint-disable-line
        if (position >= self._raw_tags.length) { // Assume it's a real unit tag.
          return position
        }
        const original_tag = self._raw_tags[position]
        if (original_tag == 0) {
          console.warn(`Tag not found: ${original_tag}`)
        }
        return original_tag
      }
      if (kwargs.hasOwnProperty('target_unit_tag')) {
        kwargs['target_unit_tag'] = find_original_tag(
          kwargs['target_unit_tag'][0]
        )
      }
      if (kwargs.hasOwnProperty('unit_tags')) {
        Object.keys(kwargs['unit_tags']).map((key) => {
          const t = kwargs['unit_tags'][key]
          return find_original_tag(t)
        })
      }
      const argArray = getArgsArray(actions.RAW_FUNCTIONS[func_id.key].function_type, kwargs)
      actions.RAW_FUNCTIONS[func_id.key].function_type(...argArray)
    } else {
      kwargs['action_space'] = aif.action_space
      const argArray = getArgsArray(actions.FUNCTIONS[func_id.key].function_type, kwargs)
      actions.FUNCTIONS[func_id.key].function_type(...argArray)
    }
    return sc2_action
  }

  reverse_action(action) {
    /*Transform an SC2-style action into an agent-style action.

    This should be the inverse of `transform_action`.

    Args:
      action: a `sc_pb.Action` to be transformed.

    Returns:
      A corresponding `actions.FunctionCall`.

    Raises:
      ValueError: if it doesn't know how to transform this action.
    */
    const FUNCTIONS = actions.FUNCTIONS

    const aif = this._agent_interface_format

    function func_call_ability(ability_id, cmd_type) {
      let args = []
      if (!actions.ABILITY_IDS.hasOwnProperty(ability_id)) {
        console.warn(`Unknown ability_id: ${ability_id}. This is probably dance or cheer, or some unknown new or map specific ability. Treating it as a no-op.", ability_id`)
        return FUNCTIONS.no_op()
      }
      if (aif.hide_specific_actions) {
        const general_id = actions.ABILITY_IDS[ability_id][0].general_id
        if (general_id) {
          ability_id = general_id
        }
      }
      const ks = Object.keys(actions.ABILITY_IDS[ability_id])
      let key
      for (let i = 0; i < ks.length; i++) {
        key = ks[i]
        const func = actions.ABILITY_IDS[ability_id][key]
        if (func.function_type === cmd_type) {
          for (let j = 2; j < arguments.length; j++) {
            args.push(arguments[j]) //eslint-disable-line
          }
          return FUNCTIONS[func.id.key](...args)
        }
      }

      throw new Error(`ValueError: Unknown ability_id: ${ability_id}, type: ${cmd_type.__name__}. Likely a bug.`)
    }

    if (action.getActionUi()) {
      const actUi = action.getActionUi()
      if (actUi.getMultiPanel()) {
        return FUNCTIONS.select_unit(
          actUi.getMultiPanel().getType() - 1,
          actUi.getMultiPanel().getUnitIndex()
        )
      }
      if (actUi.getControlGroup()) {
        return FUNCTIONS.select_control_group(
          actUi.getControlGroup().getAction() - 1,
          actUi.getControlGroup().getControlGroupIndex()
        )
      }
      if (actUi.getSelectIdleWorker()) {
        return FUNCTIONS.select_idle_worker(actUi.getSelectIdleWorker().getType() - 1)
      }
      if (actUi.getSelectArmy()) {
        return FUNCTIONS.select_army(actUi.getSelectArmy().getSelectionAdd())
      }
      if (actUi.getSelectWarpGates()) {
        return FUNCTIONS.select_warp_gates(
          actUi.getSelectWarpGates().getSelectionAdd()
        )
      }
      if (actUi.getSelectLarva()) {
        return FUNCTIONS.select_larva()
      }
      if (actUi.getCargoPanel()) {
        return FUNCTIONS.unload(actUi.getCargoPanel().getUnitIndex())
      }
      if (actUi.getProductionPanel()) {
        return FUNCTIONS.build_queue(actUi.getProductionPanel().getUnitIndex())
      }
      if (actUi.getToggleAutocast()) {
        return func_call_ability(
          actUi.getToggleAutocast().getAbilityId(),
          actions.autocast
        )
      }
    }
    if (action.getActionFeatureLayer() || action.getActionRender()) {
      const act_sp = actions.spatial(action, aif.action_space)
      if (act_sp.getCameraMove()) {
        const coord = point.Point.build(act_sp.getCameraMove().getCenterMinimap())
        return FUNCTIONS.move_camera(coord)
      }
      if (act_sp.getUnitSelectionPoint()) {
        const select_point = act_sp.getUnitSelectionPoint()
        const coord = point.Point.build(select_point.getSelectionScreenCoord())
        return FUNCTIONS.select_point(select_point.getType() - 1, coord)
      }
      if (act_sp.getUnitSelectionRect()) {
        const select_rect = act_sp.getUnitSelectionRect()
        // TODO(tewalds) {} After looking at some replays we should decide if
        // this is good enough. Maybe we need to simulate multiple actions or
        // merge the selection rects into a bigger one.
        const tl = point.Point.build(select_rect.getSelectionScreenCoordList()[0].getP0())
        const br = point.Point.build(select_rect.getSelectionScreenCoordList()[0].getP1())
        return FUNCTIONS.select_rect(select_rect.getSelectionAdd(), tl, br)
      }
      if (act_sp.getUnitCommand()) {
        const cmd = act_sp.getUnitCommand()
        const queue = int(cmd.getQueueCommand())
        if (cmd.getTargetScreenCoord()) {
          const coord = point.Point.build(cmd.getTargetScreenCoord())
          return func_call_ability(cmd.getAbilityId(), actions.cmd_screen,
            queue, coord)
        }
        if (cmd.getTargetMinimapCoord()) {
          const coord = point.Point.build(cmd.getTargetMinimapCoord())
          return func_call_ability(cmd.getAbilityId(), actions.cmd_minimap,
            queue, coord)
        }
        return func_call_ability(cmd.getAbilityId(), actions.cmd_quick, queue)
      }
    }
    if (action.getActionRaw() || action.getActionRender()) {
      throw new Error(`ValueError: Unknown action:\n${action}`)
    }

    return FUNCTIONS.no_op()
  }

  reverse_raw_action(action, prev_obs) {
    /*Transform an SC2-style action into an agent-style action.

    This should be the inverse of `transform_action`.

    Args:
      action: a `sc_pb.Action` to be transformed.
      prev_obs: an obs to figure out tags.

    Returns:
      A corresponding `actions.FunctionCall`.

    Raises:
      ValueError: if it doesn't know how to transform this action.
    */
    const aif = this._agent_interface_format
    const raw_tags = []
    for (let i = 0; i < prev_obs['raw_units'].length; i++) {
      raw_tags.push(prev_obs['raw_units'][FeatureUnit.tag])
    }
    function find_tag_position(original_tag) {
      let tag
      for (let i = 0; i < raw_tags.length; i++) {
        tag = raw_tags[i]
        if (tag === original_tag) {
          return i
        }
      }
      console.warn(`Not found tag! ${original_tag}`)
      return -1
    }
    function func_call_ability(ability_id, cmd_type, args) {
      //Get the function id for a specific ability id and action type.//
      if (actions.RAW_ABILITY_IDS.hasOwnProperty(ability_id)) {
        console.warn(`Unknown ability_id: ${ability_id}. This is probably dance or cheer, or some unknown new or map specific ability. Treating it as a no-op.`)
        return actions.RAW_FUNCTIONS.no_op()
      }
      if (aif.hide_specific_actions) {
        const general_id = actions.RAW_ABILITY_IDS[ability_id][0].general_id
        if (general_id) {
          ability_id = general_id
        }
      }
      const ks = Object.keys(actions.RAW_ABILITY_IDS[ability_id])
      let key
      for (let i = 0; i < ks.length; i++) {
        key = ks[i]
        const func = actions.RAW_ABILITY_IDS[ability_id][key]
        if (func.function_type === cmd_type) {
          return actions.RAW_FUNCTIONS[func.id](...args)
        }
      }
      throw new Error(`ValueError: Unknown ability_id: ${ability_id}, type:${cmd_type.__name__}. Likely a bug.`)
    }
    if (action.getRawAction()) {
      const raw_act = action.getRawAction()
      if (raw_act.getUnitCommand()) {
        const uc = raw_act.getUnitCommand()
        const ability_id = uc.getAbilityId()
        const queue_command = uc.getQueueCommand()
        let unit_tags = uc.getUnitTagsList().map((t) => find_tag_position(t))
        // Remove invalid units.
        unit_tags = unit_tags.filter((t) => t != -1)
        if (!unit_tags) {
          return actions.RAW_FUNCTIONS.no_op()
        }

        if (uc.getTargetUnitTag()) {
          const target_unit_tag = find_tag_position(uc.getTargetUnitTag())
          if (target_unit_tag == -1) {
            return actions.RAW_FUNCTIONS.no_op()
          }
          return func_call_ability(ability_id, actions.raw_cmd_unit,
            queue_command, unit_tags, target_unit_tag)
        }
        if (uc.getTargetWorldSpacePos()) {
          let coord = point.Point.build(uc.getTargetWorldSpacePos())
          coord = this._world_to_minimap_px.fwd_pt(coord)
          return func_call_ability(ability_id, actions.raw_cmd_pt,
            queue_command, unit_tags, coord)
        }
        return func_call_ability(ability_id, actions.raw_cmd,
          queue_command, unit_tags)
      }
      if (raw_act.getToggleAutocast()) {
        const uc = raw_act.getToggleAutocast()
        const ability_id = uc.getAbilityId()
        let unit_tags = uc.getUnitTags().map((t) => find_tag_position(t))
        // Remove invalid units.
        unit_tags = unit_tags.filter((t) => t != -1)
        if (!unit_tags) {
          return actions.RAW_FUNCTIONS.no_op()
        }
        return func_call_ability(ability_id, actions.raw_autocast, unit_tags)
      }
      if (raw_act.getUnitCommand()) {
        throw new Error(`ValueError: 'Unknown action:\n${action}`)
      }

      if (raw_act.getCameraMove()) {
        let coord = point.Point.build(raw_act.getCameraMove().getCenterWorldSpace())
        coord = this._world_to_minimap_px.fwd_pt(coord)
        return actions.RAW_FUNCTIONS.raw_move_camera(coord)
      }
    }
    return actions.RAW_FUNCTIONS.no_op()
  }
}

module.exports = {
  AgentInterfaceFormat,
  Dimensions,
  Features,
  EffectPos,
  Effects,
  Feature,
  FeatureType,
  FeatureUnit,
  features_from_game_info,
  MinimapFeatures,
  MINIMAP_FEATURES,
  parse_agent_interface_format,
  Player,
  PlayerRelative,
  ProductionQueue,
  Radar,
  ScoreCumulative,
  ScoreByCategory,
  ScoreCategories,
  ScoreByVital,
  ScoreVitals,
  ScreenFeatures,
  SCREEN_FEATURES,
  UnitLayer,
  UnitCounts,
  Visibility,
  _to_point,
  _init_valid_functions,
  _init_valid_raw_functions,
}
