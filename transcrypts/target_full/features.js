// Transcrypt'ed from Python, 2020-03-07 14:37:34
var collections = {};
var random = {};
var six = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as sc_pb from './s2clientprotocol.sc2api_pb2.js';
import * as sc_raw from './s2clientprotocol.raw_pb2.js';
import {transform} from './pysc2.lib.js';
import {stopwatch} from './pysc2.lib.js';
import * as static_data from './pysc2.lib.static_data.js';
import * as point from './pysc2.lib.point.js';
import {named_array} from './pysc2.lib.js';
import {colors} from './pysc2.lib.js';
import {actions} from './pysc2.lib.js';
import * as __module_six__ from './six.js';
__nest__ (six, '', __module_six__);
import * as np from './numpy.js';
import * as Enum from './enum.js';
import * as __module_random__ from './random.js';
__nest__ (random, '', __module_random__);
import {logging} from './absl.js';
import * as __module_collections__ from './collections.js';
__nest__ (collections, '', __module_collections__);
import {print_function} from './__future__.js';
import {division} from './__future__.js';
import {absolute_import} from './__future__.js';
var __name__ = '__main__';
export var sw = stopwatch.sw;
export var EPSILON = 1e-05;
export var FeatureType =  __class__ ('FeatureType', [Enum.Enum], {
	__module__: __name__,
	SCALAR: 1,
	CATEGORICAL: 2
});
export var PlayerRelative =  __class__ ('PlayerRelative', [Enum.IntEnum], {
	__module__: __name__,
	NONE: 0,
	SELF: 1,
	ALLY: 2,
	NEUTRAL: 3,
	ENEMY: 4
});
export var Visibility =  __class__ ('Visibility', [Enum.IntEnum], {
	__module__: __name__,
	HIDDEN: 0,
	SEEN: 1,
	VISIBLE: 2
});
export var Effects =  __class__ ('Effects', [Enum.IntEnum], {
	__module__: __name__,
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
	LurkerSpines: 12
});
export var ScoreCumulative =  __class__ ('ScoreCumulative', [Enum.IntEnum], {
	__module__: __name__,
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
	spent_vespene: 12
});
export var ScoreByCategory =  __class__ ('ScoreByCategory', [Enum.IntEnum], {
	__module__: __name__,
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
	total_used_vespene: 10
});
export var ScoreCategories =  __class__ ('ScoreCategories', [Enum.IntEnum], {
	__module__: __name__,
	none: 0,
	army: 1,
	economy: 2,
	technology: 3,
	upgrade: 4
});
export var ScoreByVital =  __class__ ('ScoreByVital', [Enum.IntEnum], {
	__module__: __name__,
	total_damage_dealt: 0,
	total_damage_taken: 1,
	total_healed: 2
});
export var ScoreVitals =  __class__ ('ScoreVitals', [Enum.IntEnum], {
	__module__: __name__,
	life: 0,
	shields: 1,
	energy: 2
});
export var Player =  __class__ ('Player', [Enum.IntEnum], {
	__module__: __name__,
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
	larva_count: 10
});
export var UnitLayer =  __class__ ('UnitLayer', [Enum.IntEnum], {
	__module__: __name__,
	unit_type: 0,
	player_relative: 1,
	health: 2,
	shields: 3,
	energy: 4,
	transport_slots_taken: 5,
	build_progress: 6
});
export var UnitCounts =  __class__ ('UnitCounts', [Enum.IntEnum], {
	__module__: __name__,
	unit_type: 0,
	count: 1
});
export var FeatureUnit =  __class__ ('FeatureUnit', [Enum.IntEnum], {
	__module__: __name__,
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
	order_length: 26,
	order_id_0: 27,
	order_id_1: 28,
	tag: 29,
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
	shield_upgrade_level: 45
});
export var EffectPos =  __class__ ('EffectPos', [Enum.IntEnum], {
	__module__: __name__,
	effect: 0,
	alliance: 1,
	owner: 2,
	radius: 3,
	x: 4,
	y: 5
});
export var Radar =  __class__ ('Radar', [Enum.IntEnum], {
	__module__: __name__,
	x: 0,
	y: 1,
	radius: 2
});
export var ProductionQueue =  __class__ ('ProductionQueue', [Enum.IntEnum], {
	__module__: __name__,
	ability_id: 0,
	build_progress: 1
});
export var Feature =  __class__ ('Feature', [collections.namedtuple ('Feature', ['index', 'name', 'layer_set', 'full_name', 'scale', 'type', 'palette', 'clip'])], {
	__module__: __name__,
	__slots__: tuple ([]),
	dtypes: dict ({1: np.uint8, 8: np.uint8, 16: np.uint16, 32: np.int32}),
	get unpack () {return __get__ (this, function (self, obs) {
		var planes = getattr (obs.feature_layer_data, self.layer_set);
		var plane = getattr (planes, self.py_name);
		return self.unpack_layer (plane);
	});},
	get unpack_layer () {return __getsm__ (this, sw.decorate (function (plane) {
		var size = point.Point.build (plane.size);
		if (size == tuple ([0, 0])) {
			return null;
		}
		var data = np.frombuffer (plane.data, __kwargtrans__ ({dtype: Feature.dtypes [plane.bits_per_pixel]}));
		if (plane.bits_per_pixel == 1) {
			var data = np.unpackbits (data);
			if (data.shape [0] != size.x * size.y) {
				var data = data.__getslice__ (0, size.x * size.y, 1);
			}
		}
		return data.reshape (size.y, size.x);
	}));},
	get unpack_rgb_image () {return __getsm__ (this, sw.decorate (function (plane) {
		var size = point.Point.build (plane.size);
		var data = np.frombuffer (plane.data, __kwargtrans__ ({dtype: np.uint8}));
		return data.reshape (size.y, size.x, 3);
	}));},
	get color () {return __get__ (this, sw.decorate (function (self, plane) {
		if (self.clip) {
			var plane = np.clip (plane, 0, self.scale - 1);
		}
		return self.palette [plane];
	}));}
});
export var ScreenFeatures =  __class__ ('ScreenFeatures', [collections.namedtuple ('ScreenFeatures', ['height_map', 'visibility_map', 'creep', 'power', 'player_id', 'player_relative', 'unit_type', 'selected', 'unit_hit_points', 'unit_hit_points_ratio', 'unit_energy', 'unit_energy_ratio', 'unit_shields', 'unit_shields_ratio', 'unit_density', 'unit_density_aa', 'effects', 'hallucinations', 'cloaked', 'blip', 'buffs', 'buff_duration', 'active', 'build_progress', 'pathable', 'buildable', 'placeholder'])], {
	__module__: __name__,
	__slots__: tuple ([]),
	get __new__ () {return __get__ (this, function (cls) {
		var feats = dict ({});
		for (var [py_name, [scale, type_, palette, clip]] of six.iteritems (kwargs)) {
			feats [py_name] = Feature (__kwargtrans__ ({index: ScreenFeatures._fields.index (py_name), py_name: py_name, layer_set: 'renders', full_name: 'screen ' + py_name, scale: scale, py_metatype: type_, palette: (callable (palette) ? palette (scale) : palette), clip: clip}));
		}
		return ScreenFeatures.__init__ (self, __kwargtrans__ (feats));
	});}
});
export var MinimapFeatures =  __class__ ('MinimapFeatures', [collections.namedtuple ('MinimapFeatures', ['height_map', 'visibility_map', 'creep', 'camera', 'player_id', 'player_relative', 'selected', 'unit_type', 'alerts', 'pathable', 'buildable'])], {
	__module__: __name__,
	__slots__: tuple ([]),
	get __new__ () {return __get__ (this, function (cls) {
		var feats = dict ({});
		for (var [py_name, [scale, type_, palette]] of six.iteritems (kwargs)) {
			feats [py_name] = Feature (__kwargtrans__ ({index: MinimapFeatures._fields.index (py_name), py_name: py_name, layer_set: 'minimap_renders', full_name: 'minimap ' + py_name, scale: scale, py_metatype: type_, palette: (callable (palette) ? palette (scale) : palette), clip: false}));
		}
		return MinimapFeatures.__init__ (cls, __kwargtrans__ (feats));
	});}
});
export var SCREEN_FEATURES = ScreenFeatures (__kwargtrans__ ({height_map: tuple ([256, FeatureType.SCALAR, colors.height_map, false]), visibility_map: tuple ([4, FeatureType.CATEGORICAL, colors.VISIBILITY_PALETTE, false]), creep: tuple ([2, FeatureType.CATEGORICAL, colors.CREEP_PALETTE, false]), power: tuple ([2, FeatureType.CATEGORICAL, colors.POWER_PALETTE, false]), player_id: tuple ([17, FeatureType.CATEGORICAL, colors.PLAYER_ABSOLUTE_PALETTE, false]), player_relative: tuple ([5, FeatureType.CATEGORICAL, colors.PLAYER_RELATIVE_PALETTE, false]), unit_type: tuple ([max (static_data.UNIT_TYPES) + 1, FeatureType.CATEGORICAL, colors.unit_type, false]), selected: tuple ([2, FeatureType.CATEGORICAL, colors.SELECTED_PALETTE, false]), unit_hit_points: tuple ([1600, FeatureType.SCALAR, colors.hot, true]), unit_hit_points_ratio: tuple ([256, FeatureType.SCALAR, colors.hot, false]), unit_energy: tuple ([1000, FeatureType.SCALAR, colors.hot, true]), unit_energy_ratio: tuple ([256, FeatureType.SCALAR, colors.hot, false]), unit_shields: tuple ([1000, FeatureType.SCALAR, colors.hot, true]), unit_shields_ratio: tuple ([256, FeatureType.SCALAR, colors.hot, false]), unit_density: tuple ([16, FeatureType.SCALAR, colors.hot, true]), unit_density_aa: tuple ([256, FeatureType.SCALAR, colors.hot, false]), effects: tuple ([16, FeatureType.CATEGORICAL, colors.effects, false]), hallucinations: tuple ([2, FeatureType.CATEGORICAL, colors.POWER_PALETTE, false]), cloaked: tuple ([2, FeatureType.CATEGORICAL, colors.POWER_PALETTE, false]), blip: tuple ([2, FeatureType.CATEGORICAL, colors.POWER_PALETTE, false]), buffs: tuple ([max (static_data.BUFFS) + 1, FeatureType.CATEGORICAL, colors.buffs, false]), buff_duration: tuple ([256, FeatureType.SCALAR, colors.hot, false]), active: tuple ([2, FeatureType.CATEGORICAL, colors.POWER_PALETTE, false]), build_progress: tuple ([256, FeatureType.SCALAR, colors.hot, false]), pathable: tuple ([2, FeatureType.CATEGORICAL, colors.winter, false]), buildable: tuple ([2, FeatureType.CATEGORICAL, colors.winter, false]), placeholder: tuple ([2, FeatureType.CATEGORICAL, colors.winter, false])}));
export var MINIMAP_FEATURES = MinimapFeatures (__kwargtrans__ ({height_map: tuple ([256, FeatureType.SCALAR, colors.height_map]), visibility_map: tuple ([4, FeatureType.CATEGORICAL, colors.VISIBILITY_PALETTE]), creep: tuple ([2, FeatureType.CATEGORICAL, colors.CREEP_PALETTE]), camera: tuple ([2, FeatureType.CATEGORICAL, colors.CAMERA_PALETTE]), player_id: tuple ([17, FeatureType.CATEGORICAL, colors.PLAYER_ABSOLUTE_PALETTE]), player_relative: tuple ([5, FeatureType.CATEGORICAL, colors.PLAYER_RELATIVE_PALETTE]), selected: tuple ([2, FeatureType.CATEGORICAL, colors.winter]), unit_type: tuple ([max (static_data.UNIT_TYPES) + 1, FeatureType.CATEGORICAL, colors.unit_type]), alerts: tuple ([2, FeatureType.CATEGORICAL, colors.winter]), pathable: tuple ([2, FeatureType.CATEGORICAL, colors.winter]), buildable: tuple ([2, FeatureType.CATEGORICAL, colors.winter])}));
export var _to_point = function (dims) {
	if (isinstance (dims, tuple ([tuple, list]))) {
		if (len (dims) != 2) {
			var __except0__ = ValueError ('A two element tuple or list is expected here, got {}.'.format (dims));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		else {
			var width = int (dims [0]);
			var height = int (dims [1]);
			if (width <= 0 || height <= 0) {
				var __except0__ = ValueError ('Must specify +ve dims, got {}.'.format (dims));
				__except0__.__cause__ = null;
				throw __except0__;
			}
			else {
				return point.Point (width, height);
			}
		}
	}
	else {
		var size = int (dims);
		if (size <= 0) {
			var __except0__ = ValueError ('Must specify a +ve value for size, got {}.'.format (dims));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		else {
			return point.Point (size, size);
		}
	}
};
export var Dimensions =  __class__ ('Dimensions', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, screen, minimap) {
		if (typeof screen == 'undefined' || (screen != null && screen.hasOwnProperty ("__kwargtrans__"))) {;
			var screen = null;
		};
		if (typeof minimap == 'undefined' || (minimap != null && minimap.hasOwnProperty ("__kwargtrans__"))) {;
			var minimap = null;
		};
		if (!(screen) || !(minimap)) {
			var __except0__ = ValueError ('screen and minimap must both be set, screen={}, minimap={}'.format (screen, minimap));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		self._screen = _to_point (screen);
		self._minimap = _to_point (minimap);
	});},
	get _get_screen () {return __get__ (this, function (self) {
		return self._screen;
	});},
	get _get_minimap () {return __get__ (this, function (self) {
		return self._minimap;
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return 'Dimensions(screen={}, minimap={})'.format (self.screen, self.minimap);
	});},
	get __eq__ () {return __get__ (this, function (self, other) {
		return isinstance (other, Dimensions) && self.screen == other.screen && self.minimap == other.minimap;
	});},
	get __ne__ () {return __get__ (this, function (self, other) {
		return !(self == other);
	});}
});
Object.defineProperty (Dimensions, 'minimap', property.call (Dimensions, Dimensions._get_minimap));
Object.defineProperty (Dimensions, 'screen', property.call (Dimensions, Dimensions._get_screen));;
export var AgentInterfaceFormat =  __class__ ('AgentInterfaceFormat', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, feature_dimensions, rgb_dimensions, raw_resolution, action_space, camera_width_world_units, use_feature_units, use_raw_units, use_raw_actions, max_raw_actions, max_selected_units, use_unit_counts, use_camera_position, show_cloaked, show_burrowed_shadows, show_placeholders, hide_specific_actions, action_delay_fn, send_observation_proto, crop_to_playable_area, raw_crop_to_playable_area, allow_cheating_layers, add_cargo_to_units) {
		if (typeof feature_dimensions == 'undefined' || (feature_dimensions != null && feature_dimensions.hasOwnProperty ("__kwargtrans__"))) {;
			var feature_dimensions = null;
		};
		if (typeof rgb_dimensions == 'undefined' || (rgb_dimensions != null && rgb_dimensions.hasOwnProperty ("__kwargtrans__"))) {;
			var rgb_dimensions = null;
		};
		if (typeof raw_resolution == 'undefined' || (raw_resolution != null && raw_resolution.hasOwnProperty ("__kwargtrans__"))) {;
			var raw_resolution = null;
		};
		if (typeof action_space == 'undefined' || (action_space != null && action_space.hasOwnProperty ("__kwargtrans__"))) {;
			var action_space = null;
		};
		if (typeof camera_width_world_units == 'undefined' || (camera_width_world_units != null && camera_width_world_units.hasOwnProperty ("__kwargtrans__"))) {;
			var camera_width_world_units = null;
		};
		if (typeof use_feature_units == 'undefined' || (use_feature_units != null && use_feature_units.hasOwnProperty ("__kwargtrans__"))) {;
			var use_feature_units = false;
		};
		if (typeof use_raw_units == 'undefined' || (use_raw_units != null && use_raw_units.hasOwnProperty ("__kwargtrans__"))) {;
			var use_raw_units = false;
		};
		if (typeof use_raw_actions == 'undefined' || (use_raw_actions != null && use_raw_actions.hasOwnProperty ("__kwargtrans__"))) {;
			var use_raw_actions = false;
		};
		if (typeof max_raw_actions == 'undefined' || (max_raw_actions != null && max_raw_actions.hasOwnProperty ("__kwargtrans__"))) {;
			var max_raw_actions = 512;
		};
		if (typeof max_selected_units == 'undefined' || (max_selected_units != null && max_selected_units.hasOwnProperty ("__kwargtrans__"))) {;
			var max_selected_units = 30;
		};
		if (typeof use_unit_counts == 'undefined' || (use_unit_counts != null && use_unit_counts.hasOwnProperty ("__kwargtrans__"))) {;
			var use_unit_counts = false;
		};
		if (typeof use_camera_position == 'undefined' || (use_camera_position != null && use_camera_position.hasOwnProperty ("__kwargtrans__"))) {;
			var use_camera_position = false;
		};
		if (typeof show_cloaked == 'undefined' || (show_cloaked != null && show_cloaked.hasOwnProperty ("__kwargtrans__"))) {;
			var show_cloaked = false;
		};
		if (typeof show_burrowed_shadows == 'undefined' || (show_burrowed_shadows != null && show_burrowed_shadows.hasOwnProperty ("__kwargtrans__"))) {;
			var show_burrowed_shadows = false;
		};
		if (typeof show_placeholders == 'undefined' || (show_placeholders != null && show_placeholders.hasOwnProperty ("__kwargtrans__"))) {;
			var show_placeholders = false;
		};
		if (typeof hide_specific_actions == 'undefined' || (hide_specific_actions != null && hide_specific_actions.hasOwnProperty ("__kwargtrans__"))) {;
			var hide_specific_actions = true;
		};
		if (typeof action_delay_fn == 'undefined' || (action_delay_fn != null && action_delay_fn.hasOwnProperty ("__kwargtrans__"))) {;
			var action_delay_fn = null;
		};
		if (typeof send_observation_proto == 'undefined' || (send_observation_proto != null && send_observation_proto.hasOwnProperty ("__kwargtrans__"))) {;
			var send_observation_proto = false;
		};
		if (typeof crop_to_playable_area == 'undefined' || (crop_to_playable_area != null && crop_to_playable_area.hasOwnProperty ("__kwargtrans__"))) {;
			var crop_to_playable_area = false;
		};
		if (typeof raw_crop_to_playable_area == 'undefined' || (raw_crop_to_playable_area != null && raw_crop_to_playable_area.hasOwnProperty ("__kwargtrans__"))) {;
			var raw_crop_to_playable_area = false;
		};
		if (typeof allow_cheating_layers == 'undefined' || (allow_cheating_layers != null && allow_cheating_layers.hasOwnProperty ("__kwargtrans__"))) {;
			var allow_cheating_layers = false;
		};
		if (typeof add_cargo_to_units == 'undefined' || (add_cargo_to_units != null && add_cargo_to_units.hasOwnProperty ("__kwargtrans__"))) {;
			var add_cargo_to_units = false;
		};
		if (!(feature_dimensions || rgb_dimensions || use_raw_units)) {
			var __except0__ = ValueError ('Must set either the feature layer or rgb dimensions, or use raw units.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (action_space) {
			if (!(isinstance (action_space, actions.ActionSpace))) {
				var __except0__ = ValueError ('action_space must be of type ActionSpace.');
				__except0__.__cause__ = null;
				throw __except0__;
			}
			if (action_space == actions.ActionSpace.RAW) {
				var use_raw_actions = true;
			}
			else if (action_space == actions.ActionSpace.FEATURES && !(feature_dimensions) || action_space == actions.ActionSpace.RGB && !(rgb_dimensions)) {
				var __except0__ = ValueError ('Action space must match the observations, action space={}, feature_dimensions={}, rgb_dimensions={}'.format (action_space, feature_dimensions, rgb_dimensions));
				__except0__.__cause__ = null;
				throw __except0__;
			}
		}
		else if (use_raw_actions) {
			var action_space = actions.ActionSpace.RAW;
		}
		else if (feature_dimensions && rgb_dimensions) {
			var __except0__ = ValueError ('You must specify the action space if you have both screen and rgb observations.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		else if (feature_dimensions) {
			var action_space = actions.ActionSpace.FEATURES;
		}
		else {
			var action_space = actions.ActionSpace.RGB;
		}
		if (raw_resolution) {
			var raw_resolution = _to_point (raw_resolution);
		}
		if (use_raw_actions) {
			if (!(use_raw_units)) {
				var __except0__ = ValueError ('You must set use_raw_units if you intend to use_raw_actions');
				__except0__.__cause__ = null;
				throw __except0__;
			}
			if (action_space != actions.ActionSpace.RAW) {
				var __except0__ = ValueError ("Don't specify both an action_space and use_raw_actions.");
				__except0__.__cause__ = null;
				throw __except0__;
			}
		}
		if (rgb_dimensions && (rgb_dimensions.screen.x < rgb_dimensions.minimap.x || rgb_dimensions.screen.y < rgb_dimensions.minimap.y)) {
			var __except0__ = ValueError (__mod__ ("RGB Screen (%s) can't be smaller than the minimap (%s).", tuple ([rgb_dimensions.screen, rgb_dimensions.minimap])));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		self._feature_dimensions = feature_dimensions;
		self._rgb_dimensions = rgb_dimensions;
		self._action_space = action_space;
		self._camera_width_world_units = camera_width_world_units || 24;
		self._use_feature_units = use_feature_units;
		self._use_raw_units = use_raw_units;
		self._raw_resolution = raw_resolution;
		self._use_raw_actions = use_raw_actions;
		self._max_raw_actions = max_raw_actions;
		self._max_selected_units = max_selected_units;
		self._use_unit_counts = use_unit_counts;
		self._use_camera_position = use_camera_position;
		self._show_cloaked = show_cloaked;
		self._show_burrowed_shadows = show_burrowed_shadows;
		self._show_placeholders = show_placeholders;
		self._hide_specific_actions = hide_specific_actions;
		self._action_delay_fn = action_delay_fn;
		self._send_observation_proto = send_observation_proto;
		self._add_cargo_to_units = add_cargo_to_units;
		self._crop_to_playable_area = crop_to_playable_area;
		self._raw_crop_to_playable_area = raw_crop_to_playable_area;
		self._allow_cheating_layers = allow_cheating_layers;
		if (action_space == actions.ActionSpace.FEATURES) {
			self._action_dimensions = feature_dimensions;
		}
		else {
			self._action_dimensions = rgb_dimensions;
		}
	});},
	get _get_feature_dimensions () {return __get__ (this, function (self) {
		return self._feature_dimensions;
	});},
	get _get_rgb_dimensions () {return __get__ (this, function (self) {
		return self._rgb_dimensions;
	});},
	get _get_action_space () {return __get__ (this, function (self) {
		return self._action_space;
	});},
	get _get_camera_width_world_units () {return __get__ (this, function (self) {
		return self._camera_width_world_units;
	});},
	get _get_use_feature_units () {return __get__ (this, function (self) {
		return self._use_feature_units;
	});},
	get _get_use_raw_units () {return __get__ (this, function (self) {
		return self._use_raw_units;
	});},
	get _get_raw_resolution () {return __get__ (this, function (self) {
		return self._raw_resolution;
	});},
	get _set_raw_resolution () {return __get__ (this, function (self, value) {
		self._raw_resolution = value;
	});},
	get _get_use_raw_actions () {return __get__ (this, function (self) {
		return self._use_raw_actions;
	});},
	get _get_max_raw_actions () {return __get__ (this, function (self) {
		return self._max_raw_actions;
	});},
	get _get_max_selected_units () {return __get__ (this, function (self) {
		return self._max_selected_units;
	});},
	get _get_use_unit_counts () {return __get__ (this, function (self) {
		return self._use_unit_counts;
	});},
	get _get_use_camera_position () {return __get__ (this, function (self) {
		return self._use_camera_position;
	});},
	get _get_show_cloaked () {return __get__ (this, function (self) {
		return self._show_cloaked;
	});},
	get _get_show_burrowed_shadows () {return __get__ (this, function (self) {
		return self._show_burrowed_shadows;
	});},
	get _get_show_placeholders () {return __get__ (this, function (self) {
		return self._show_placeholders;
	});},
	get _get_hide_specific_actions () {return __get__ (this, function (self) {
		return self._hide_specific_actions;
	});},
	get _get_action_delay_fn () {return __get__ (this, function (self) {
		return self._action_delay_fn;
	});},
	get _get_send_observation_proto () {return __get__ (this, function (self) {
		return self._send_observation_proto;
	});},
	get _get_add_cargo_to_units () {return __get__ (this, function (self) {
		return self._add_cargo_to_units;
	});},
	get _get_action_dimensions () {return __get__ (this, function (self) {
		return self._action_dimensions;
	});},
	get _get_crop_to_playable_area () {return __get__ (this, function (self) {
		return self._crop_to_playable_area;
	});},
	get _get_raw_crop_to_playable_area () {return __get__ (this, function (self) {
		return self._raw_crop_to_playable_area;
	});},
	get _get_allow_cheating_layers () {return __get__ (this, function (self) {
		return self._allow_cheating_layers;
	});}
});
Object.defineProperty (AgentInterfaceFormat, 'allow_cheating_layers', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_allow_cheating_layers));
Object.defineProperty (AgentInterfaceFormat, 'raw_crop_to_playable_area', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_raw_crop_to_playable_area));
Object.defineProperty (AgentInterfaceFormat, 'crop_to_playable_area', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_crop_to_playable_area));
Object.defineProperty (AgentInterfaceFormat, 'action_dimensions', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_action_dimensions));
Object.defineProperty (AgentInterfaceFormat, 'add_cargo_to_units', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_add_cargo_to_units));
Object.defineProperty (AgentInterfaceFormat, 'send_observation_proto', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_send_observation_proto));
Object.defineProperty (AgentInterfaceFormat, 'action_delay_fn', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_action_delay_fn));
Object.defineProperty (AgentInterfaceFormat, 'hide_specific_actions', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_hide_specific_actions));
Object.defineProperty (AgentInterfaceFormat, 'show_placeholders', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_show_placeholders));
Object.defineProperty (AgentInterfaceFormat, 'show_burrowed_shadows', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_show_burrowed_shadows));
Object.defineProperty (AgentInterfaceFormat, 'show_cloaked', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_show_cloaked));
Object.defineProperty (AgentInterfaceFormat, 'use_camera_position', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_use_camera_position));
Object.defineProperty (AgentInterfaceFormat, 'use_unit_counts', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_use_unit_counts));
Object.defineProperty (AgentInterfaceFormat, 'max_selected_units', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_max_selected_units));
Object.defineProperty (AgentInterfaceFormat, 'max_raw_actions', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_max_raw_actions));
Object.defineProperty (AgentInterfaceFormat, 'use_raw_actions', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_use_raw_actions));
Object.defineProperty (AgentInterfaceFormat, 'raw_resolution', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_raw_resolution, AgentInterfaceFormat._set_raw_resolution));
Object.defineProperty (AgentInterfaceFormat, 'use_raw_units', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_use_raw_units));
Object.defineProperty (AgentInterfaceFormat, 'use_feature_units', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_use_feature_units));
Object.defineProperty (AgentInterfaceFormat, 'camera_width_world_units', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_camera_width_world_units));
Object.defineProperty (AgentInterfaceFormat, 'action_space', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_action_space));
Object.defineProperty (AgentInterfaceFormat, 'rgb_dimensions', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_rgb_dimensions));
Object.defineProperty (AgentInterfaceFormat, 'feature_dimensions', property.call (AgentInterfaceFormat, AgentInterfaceFormat._get_feature_dimensions));;
export var parse_agent_interface_format = function (feature_screen, feature_minimap, rgb_screen, rgb_minimap, action_space, action_delays) {
	if (typeof feature_screen == 'undefined' || (feature_screen != null && feature_screen.hasOwnProperty ("__kwargtrans__"))) {;
		var feature_screen = null;
	};
	if (typeof feature_minimap == 'undefined' || (feature_minimap != null && feature_minimap.hasOwnProperty ("__kwargtrans__"))) {;
		var feature_minimap = null;
	};
	if (typeof rgb_screen == 'undefined' || (rgb_screen != null && rgb_screen.hasOwnProperty ("__kwargtrans__"))) {;
		var rgb_screen = null;
	};
	if (typeof rgb_minimap == 'undefined' || (rgb_minimap != null && rgb_minimap.hasOwnProperty ("__kwargtrans__"))) {;
		var rgb_minimap = null;
	};
	if (typeof action_space == 'undefined' || (action_space != null && action_space.hasOwnProperty ("__kwargtrans__"))) {;
		var action_space = null;
	};
	if (typeof action_delays == 'undefined' || (action_delays != null && action_delays.hasOwnProperty ("__kwargtrans__"))) {;
		var action_delays = null;
	};
	if (feature_screen || feature_minimap) {
		var feature_dimensions = Dimensions (feature_screen, feature_minimap);
	}
	else {
		var feature_dimensions = null;
	}
	if (rgb_screen || rgb_minimap) {
		var rgb_dimensions = Dimensions (rgb_screen, rgb_minimap);
	}
	else {
		var rgb_dimensions = null;
	}
	var _action_delay_fn = function (delays) {
		if (!(delays)) {
			return null;
		}
		else {
			var total = sum (delays);
			var cumulative_sum = np.cumsum ((function () {
				var __accu0__ = [];
				for (var delay of delays) {
					__accu0__.append (delay / total);
				}
				return __accu0__;
			}) ());
			var fn = function () {
				var sample = random.uniform (0, 1) - EPSILON;
				for (var [i, cumulative] of enumerate (cumulative_sum)) {
					if (sample <= cumulative) {
						return i + 1;
					}
				}
				var __except0__ = ValueError ('Failed to sample action delay??');
				__except0__.__cause__ = null;
				throw __except0__;
			};
			return fn;
		}
	};
	return AgentInterfaceFormat (__kwargtrans__ (__mergekwargtrans__ ({feature_dimensions: feature_dimensions, rgb_dimensions: rgb_dimensions, action_space: action_space && actions.ActionSpace [action_space.upper ()], action_delay_fn: _action_delay_fn (action_delays)}, kwargs)));
};
export var features_from_game_info = function (game_info, agent_interface_format, map_name) {
	if (typeof agent_interface_format == 'undefined' || (agent_interface_format != null && agent_interface_format.hasOwnProperty ("__kwargtrans__"))) {;
		var agent_interface_format = null;
	};
	if (typeof map_name == 'undefined' || (map_name != null && map_name.hasOwnProperty ("__kwargtrans__"))) {;
		var map_name = null;
	};
	if (!(map_name)) {
		var map_name = game_info.map_name;
	}
	if (game_info.options.HasField ('feature_layer')) {
		var fl_opts = game_info.options.feature_layer;
		var feature_dimensions = Dimensions (__kwargtrans__ ({screen: tuple ([fl_opts.resolution.x, fl_opts.resolution.y]), minimap: tuple ([fl_opts.minimap_resolution.x, fl_opts.minimap_resolution.y])}));
		var camera_width_world_units = game_info.options.feature_layer.width;
	}
	else {
		var feature_dimensions = null;
		var camera_width_world_units = null;
	}
	if (game_info.options.HasField ('render')) {
		var rgb_opts = game_info.options.render;
		var rgb_dimensions = Dimensions (__kwargtrans__ ({screen: tuple ([rgb_opts.resolution.x, rgb_opts.resolution.y]), minimap: tuple ([rgb_opts.minimap_resolution.x, rgb_opts.minimap_resolution.y])}));
	}
	else {
		var rgb_dimensions = null;
	}
	var map_size = game_info.start_raw.map_size;
	var requested_races = (function () {
		var __accu0__ = [];
		for (var info of game_info.player_info) {
			if (info.py_metatype != sc_pb.Observer) {
				__accu0__.append ([info.player_id, info.race_requested]);
			}
		}
		return dict (__accu0__);
	}) ();
	if (agent_interface_format) {
		if (kwargs) {
			var __except0__ = ValueError ('Either give an agent_interface_format or kwargs, not both.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		var aif = agent_interface_format;
		if (aif.rgb_dimensions != rgb_dimensions || aif.feature_dimensions != feature_dimensions || feature_dimensions && aif.camera_width_world_units != camera_width_world_units) {
			var __except0__ = ValueError (__mod__ ("\nThe supplied agent_interface_format doesn't match the resolutions computed from\nthe game_info:\n  rgb_dimensions: %s != %s\n  feature_dimensions: %s != %s\n  camera_width_world_units: %s != %s\n", tuple ([aif.rgb_dimensions, rgb_dimensions, aif.feature_dimensions, feature_dimensions, aif.camera_width_world_units, camera_width_world_units])));
			__except0__.__cause__ = null;
			throw __except0__;
		}
	}
	else {
		var agent_interface_format = AgentInterfaceFormat (__kwargtrans__ (__mergekwargtrans__ ({feature_dimensions: feature_dimensions, rgb_dimensions: rgb_dimensions, camera_width_world_units: camera_width_world_units}, kwargs)));
	}
	return Features (__kwargtrans__ ({agent_interface_format: agent_interface_format, map_size: map_size, map_name: map_name, requested_races: requested_races}));
};
export var _init_valid_functions = function (action_dimensions) {
	var sizes = dict ({'screen': tuple ((function () {
		var __accu0__ = [];
		for (var i of action_dimensions.screen) {
			__accu0__.append (int (i));
		}
		return py_iter (__accu0__);
	}) ()), 'screen2': tuple ((function () {
		var __accu0__ = [];
		for (var i of action_dimensions.screen) {
			__accu0__.append (int (i));
		}
		return py_iter (__accu0__);
	}) ()), 'minimap': tuple ((function () {
		var __accu0__ = [];
		for (var i of action_dimensions.minimap) {
			__accu0__.append (int (i));
		}
		return py_iter (__accu0__);
	}) ())});
	var types = actions.Arguments (...(function () {
		var __accu0__ = [];
		for (var t of actions.TYPES) {
			__accu0__.append (actions.ArgumentType.spec (t.id, t.py_name, sizes.py_get (t.py_name, t.sizes)));
		}
		return __accu0__;
	}) ());
	var functions = actions.Functions ((function () {
		var __accu0__ = [];
		for (var f of actions.FUNCTIONS) {
			__accu0__.append (actions.Function.spec (f.id, f.py_name, tuple ((function () {
				var __accu1__ = [];
				for (var t of f.args) {
					__accu1__.append (types [t.id]);
				}
				return py_iter (__accu1__);
			}) ())));
		}
		return __accu0__;
	}) ());
	return actions.ValidActions (types, functions);
};
export var _init_valid_raw_functions = function (raw_resolution, max_selected_units) {
	var sizes = dict ({'world': tuple ((function () {
		var __accu0__ = [];
		for (var i of raw_resolution) {
			__accu0__.append (int (i));
		}
		return py_iter (__accu0__);
	}) ()), 'unit_tags': tuple ([max_selected_units])});
	var types = actions.RawArguments (...(function () {
		var __accu0__ = [];
		for (var t of actions.RAW_TYPES) {
			__accu0__.append (actions.ArgumentType.spec (t.id, t.py_name, sizes.py_get (t.py_name, t.sizes)));
		}
		return __accu0__;
	}) ());
	var functions = actions.Functions ((function () {
		var __accu0__ = [];
		for (var f of actions.RAW_FUNCTIONS) {
			__accu0__.append (actions.Function.spec (f.id, f.py_name, tuple ((function () {
				var __accu1__ = [];
				for (var t of f.args) {
					__accu1__.append (types [t.id]);
				}
				return py_iter (__accu1__);
			}) ())));
		}
		return __accu0__;
	}) ());
	return actions.ValidActions (types, functions);
};
export var Features =  __class__ ('Features', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, agent_interface_format, map_size, requested_races, map_name) {
		if (typeof agent_interface_format == 'undefined' || (agent_interface_format != null && agent_interface_format.hasOwnProperty ("__kwargtrans__"))) {;
			var agent_interface_format = null;
		};
		if (typeof map_size == 'undefined' || (map_size != null && map_size.hasOwnProperty ("__kwargtrans__"))) {;
			var map_size = null;
		};
		if (typeof requested_races == 'undefined' || (requested_races != null && requested_races.hasOwnProperty ("__kwargtrans__"))) {;
			var requested_races = null;
		};
		if (typeof map_name == 'undefined' || (map_name != null && map_name.hasOwnProperty ("__kwargtrans__"))) {;
			var map_name = 'unknown';
		};
		if (!(agent_interface_format)) {
			var __except0__ = ValueError ('Please specify agent_interface_format');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		self._agent_interface_format = agent_interface_format;
		var aif = self._agent_interface_format;
		if (!(aif.raw_resolution) && map_size) {
			aif.raw_resolution = point.Point.build (map_size);
		}
		self._map_size = map_size;
		self._map_name = map_name;
		if (aif.use_feature_units || aif.use_camera_position || aif.use_raw_units) {
			self.init_camera (aif.feature_dimensions, map_size, aif.camera_width_world_units, aif.raw_resolution);
		}
		self._send_observation_proto = aif.send_observation_proto;
		self._raw = aif.use_raw_actions;
		if (self._raw) {
			self._valid_functions = _init_valid_raw_functions (aif.raw_resolution, aif.max_selected_units);
			self._raw_tags = [];
		}
		else {
			self._valid_functions = _init_valid_functions (aif.action_dimensions);
		}
		self._requested_races = requested_races;
		if (requested_races !== null) {
		}
	});},
	get init_camera () {return __get__ (this, function (self, feature_dimensions, map_size, camera_width_world_units, raw_resolution) {
		if (!(map_size) || !(camera_width_world_units)) {
			var __except0__ = ValueError ('Either pass the game_info with raw enabled, or map_size and camera_width_world_units in order to use feature_units or cameraposition.');
			__except0__.__cause__ = null;
			throw __except0__;
		}
		var map_size = point.Point.build (map_size);
		self._world_to_world_tl = transform.Linear (point.Point (1, -(1)), point.Point (0, map_size.y));
		self._world_tl_to_world_camera_rel = transform.Linear (__kwargtrans__ ({offset: -(map_size) / 4}));
		if (feature_dimensions) {
			var world_camera_rel_to_feature_screen = transform.Linear (feature_dimensions.screen / camera_width_world_units, feature_dimensions.screen / 2);
			self._world_to_feature_screen_px = transform.Chain (self._world_to_world_tl, self._world_tl_to_world_camera_rel, world_camera_rel_to_feature_screen, transform.PixelToCoord ());
		}
		var world_tl_to_feature_minimap = transform.Linear (__kwargtrans__ ({scale: (raw_resolution ? raw_resolution / map_size.max_dim () : null)}));
		self._world_to_minimap_px = transform.Chain (self._world_to_world_tl, world_tl_to_feature_minimap, transform.PixelToCoord ());
		self._camera_size = (raw_resolution / map_size.max_dim ()) * camera_width_world_units;
	});},
	get _update_camera () {return __get__ (this, function (self, camera_center) {
		self._world_tl_to_world_camera_rel.offset = -(self._world_to_world_tl.fwd_pt (camera_center)) * self._world_tl_to_world_camera_rel.scale;
	});},
	get observation_spec () {return __get__ (this, function (self) {
		var obs_spec = named_array.NamedDict (dict ({'action_result': tuple ([0]), 'alerts': tuple ([0]), 'build_queue': tuple ([0, len (UnitLayer)]), 'cargo': tuple ([0, len (UnitLayer)]), 'cargo_slots_available': tuple ([1]), 'control_groups': tuple ([10, 2]), 'game_loop': tuple ([1]), 'last_actions': tuple ([0]), 'map_name': tuple ([0]), 'multi_select': tuple ([0, len (UnitLayer)]), 'player': tuple ([len (Player)]), 'production_queue': tuple ([0, len (ProductionQueue)]), 'score_cumulative': tuple ([len (ScoreCumulative)]), 'score_by_category': tuple ([len (ScoreByCategory), len (ScoreCategories)]), 'score_by_vital': tuple ([len (ScoreByVital), len (ScoreVitals)]), 'single_select': tuple ([0, len (UnitLayer)])}));
		if (!(self._raw)) {
			obs_spec ['available_actions'] = tuple ([0]);
		}
		var aif = self._agent_interface_format;
		if (aif.feature_dimensions) {
			obs_spec ['feature_screen'] = tuple ([len (SCREEN_FEATURES), aif.feature_dimensions.screen.y, aif.feature_dimensions.screen.x]);
			obs_spec ['feature_minimap'] = tuple ([len (MINIMAP_FEATURES), aif.feature_dimensions.minimap.y, aif.feature_dimensions.minimap.x]);
		}
		if (aif.rgb_dimensions) {
			obs_spec ['rgb_screen'] = tuple ([aif.rgb_dimensions.screen.y, aif.rgb_dimensions.screen.x, 3]);
			obs_spec ['rgb_minimap'] = tuple ([aif.rgb_dimensions.minimap.y, aif.rgb_dimensions.minimap.x, 3]);
		}
		if (aif.use_feature_units) {
			obs_spec ['feature_units'] = tuple ([0, len (FeatureUnit)]);
			obs_spec ['feature_effects'] = tuple ([0, len (EffectPos)]);
		}
		if (aif.use_raw_units) {
			obs_spec ['raw_units'] = tuple ([0, len (FeatureUnit)]);
			obs_spec ['raw_effects'] = tuple ([0, len (EffectPos)]);
		}
		if (aif.use_feature_units || aif.use_raw_units) {
			obs_spec ['radar'] = tuple ([0, len (Radar)]);
		}
		obs_spec ['upgrades'] = tuple ([0]);
		if (aif.use_unit_counts) {
			obs_spec ['unit_counts'] = tuple ([0, len (UnitCounts)]);
		}
		if (aif.use_camera_position) {
			obs_spec ['camera_position'] = tuple ([2]);
			obs_spec ['camera_size'] = tuple ([2]);
		}
		if (self._send_observation_proto) {
			obs_spec ['_response_observation'] = tuple ([0]);
		}
		obs_spec ['home_race_requested'] = tuple ([1]);
		obs_spec ['away_race_requested'] = tuple ([1]);
		return obs_spec;
	});},
	get action_spec () {return __get__ (this, function (self) {
		return self._valid_functions;
	});},
	get _get_map_size () {return __get__ (this, function (self) {
		return self._map_size;
	});},
	get _get_requested_races () {return __get__ (this, function (self) {
		return self._requested_races;
	});},
	get transform_obs () {return __get__ (this, sw.decorate (function (self, obs) {
		var empty_unit = np.array ([], __kwargtrans__ ({dtype: np.int32})).reshape (tuple ([0, len (UnitLayer)]));
		var out = named_array.NamedDict (dict ({'single_select': empty_unit, 'multi_select': empty_unit, 'build_queue': empty_unit, 'cargo': empty_unit, 'production_queue': np.array ([], __kwargtrans__ ({dtype: np.int32})).reshape (tuple ([0, len (ProductionQueue)])), 'last_actions': np.array ([], __kwargtrans__ ({dtype: np.int32})), 'cargo_slots_available': np.array ([0], __kwargtrans__ ({dtype: np.int32})), 'home_race_requested': np.array ([0], __kwargtrans__ ({dtype: np.int32})), 'away_race_requested': np.array ([0], __kwargtrans__ ({dtype: np.int32})), 'map_name': self._map_name}));
		var or_zeros = function (layer, size) {
			if (layer !== null) {
				return layer.astype (np.int32, __kwargtrans__ ({copy: false}));
			}
			else {
				return np.zeros (tuple ([size.y, size.x]), __kwargtrans__ ({dtype: np.int32}));
			}
		};
		var aif = self._agent_interface_format;
		if (aif.feature_dimensions) {
			var __withid0__ = sw ('feature_screen');
			try {
				__withid0__.__enter__ ();
				out ['feature_screen'] = named_array.NamedNumpyArray (np.stack ((function () {
					var __accu0__ = [];
					for (var f of SCREEN_FEATURES) {
						__accu0__.append (or_zeros (f.unpack (obs.observation), aif.feature_dimensions.screen));
					}
					return __accu0__;
				}) ()), __kwargtrans__ ({names: [ScreenFeatures, null, null]}));
				__withid0__.__exit__ ();
			}
			catch (__except0__) {
				if (! (__withid0__.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
					throw __except0__;
				}
			}
			var __withid0__ = sw ('feature_minimap');
			try {
				__withid0__.__enter__ ();
				out ['feature_minimap'] = named_array.NamedNumpyArray (np.stack ((function () {
					var __accu0__ = [];
					for (var f of MINIMAP_FEATURES) {
						__accu0__.append (or_zeros (f.unpack (obs.observation), aif.feature_dimensions.minimap));
					}
					return __accu0__;
				}) ()), __kwargtrans__ ({names: [MinimapFeatures, null, null]}));
				__withid0__.__exit__ ();
			}
			catch (__except0__) {
				if (! (__withid0__.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
					throw __except0__;
				}
			}
		}
		if (aif.rgb_dimensions) {
			var __withid0__ = sw ('rgb_screen');
			try {
				__withid0__.__enter__ ();
				out ['rgb_screen'] = Feature.unpack_rgb_image (obs.observation.render_data.map).astype (np.int32);
				__withid0__.__exit__ ();
			}
			catch (__except0__) {
				if (! (__withid0__.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
					throw __except0__;
				}
			}
			var __withid0__ = sw ('rgb_minimap');
			try {
				__withid0__.__enter__ ();
				out ['rgb_minimap'] = Feature.unpack_rgb_image (obs.observation.render_data.minimap).astype (np.int32);
				__withid0__.__exit__ ();
			}
			catch (__except0__) {
				if (! (__withid0__.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
					throw __except0__;
				}
			}
		}
		if (!(self._raw)) {
			var __withid0__ = sw ('last_actions');
			try {
				__withid0__.__enter__ ();
				out ['last_actions'] = np.array ((function () {
					var __accu0__ = [];
					for (var a of obs.actions) {
						__accu0__.append (self.reverse_action (a).function);
					}
					return __accu0__;
				}) (), __kwargtrans__ ({dtype: np.int32}));
				__withid0__.__exit__ ();
			}
			catch (__except0__) {
				if (! (__withid0__.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
					throw __except0__;
				}
			}
		}
		out ['action_result'] = np.array ((function () {
			var __accu0__ = [];
			for (var o of obs.action_errors) {
				__accu0__.append (o.result);
			}
			return __accu0__;
		}) (), __kwargtrans__ ({dtype: np.int32}));
		out ['alerts'] = np.array (obs.observation.alerts, __kwargtrans__ ({dtype: np.int32}));
		out ['game_loop'] = np.array ([obs.observation.game_loop], __kwargtrans__ ({dtype: np.int32}));
		var __withid0__ = sw ('score');
		try {
			__withid0__.__enter__ ();
			var score_details = obs.observation.score.score_details;
			out ['score_cumulative'] = named_array.NamedNumpyArray ([obs.observation.score.score, score_details.idle_production_time, score_details.idle_worker_time, score_details.total_value_units, score_details.total_value_structures, score_details.killed_value_units, score_details.killed_value_structures, score_details.collected_minerals, score_details.collected_vespene, score_details.collection_rate_minerals, score_details.collection_rate_vespene, score_details.spent_minerals, score_details.spent_vespene], __kwargtrans__ ({names: ScoreCumulative, dtype: np.int32}));
			var get_score_details = function (key, details, categories) {
				var row = getattr (details, key.py_name);
				return (function () {
					var __accu0__ = [];
					for (var category of categories) {
						__accu0__.append (getattr (row, category.py_name));
					}
					return __accu0__;
				}) ();
			};
			out ['score_by_category'] = named_array.NamedNumpyArray ((function () {
				var __accu0__ = [];
				for (var key of ScoreByCategory) {
					__accu0__.append (get_score_details (key, score_details, ScoreCategories));
				}
				return __accu0__;
			}) (), __kwargtrans__ ({names: [ScoreByCategory, ScoreCategories], dtype: np.int32}));
			out ['score_by_vital'] = named_array.NamedNumpyArray ((function () {
				var __accu0__ = [];
				for (var key of ScoreByVital) {
					__accu0__.append (get_score_details (key, score_details, ScoreVitals));
				}
				return __accu0__;
			}) (), __kwargtrans__ ({names: [ScoreByVital, ScoreVitals], dtype: np.int32}));
			__withid0__.__exit__ ();
		}
		catch (__except0__) {
			if (! (__withid0__.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
				throw __except0__;
			}
		}
		var player = obs.observation.player_common;
		out ['player'] = named_array.NamedNumpyArray ([player.player_id, player.minerals, player.vespene, player.food_used, player.food_cap, player.food_army, player.food_workers, player.idle_worker_count, player.army_count, player.warp_gate_count, player.larva_count], __kwargtrans__ ({names: Player, dtype: np.int32}));
		var unit_vec = function (u) {
			return np.array (tuple ([u.unit_type, u.player_relative, u.health, u.shields, u.energy, u.transport_slots_taken, int (u.build_progress * 100)]), __kwargtrans__ ({dtype: np.int32}));
		};
		var ui = obs.observation.ui_data;
		var __withid0__ = sw ('ui');
		try {
			__withid0__.__enter__ ();
			var groups = np.zeros (tuple ([10, 2]), __kwargtrans__ ({dtype: np.int32}));
			for (var g of ui.groups) {
				groups.__setitem__ ([g.control_group_index, tuple ([0, null, 1])], tuple ([g.leader_unit_type, g.count]));
			}
			out ['control_groups'] = groups;
			if (ui.HasField ('single')) {
				out ['single_select'] = named_array.NamedNumpyArray ([unit_vec (ui.single.unit)], [null, UnitLayer]);
			}
			else if (ui.HasField ('multi')) {
				out ['multi_select'] = named_array.NamedNumpyArray ((function () {
					var __accu0__ = [];
					for (var u of ui.multi.units) {
						__accu0__.append (unit_vec (u));
					}
					return __accu0__;
				}) (), [null, UnitLayer]);
			}
			else if (ui.HasField ('cargo')) {
				out ['single_select'] = named_array.NamedNumpyArray ([unit_vec (ui.cargo.unit)], [null, UnitLayer]);
				out ['cargo'] = named_array.NamedNumpyArray ((function () {
					var __accu0__ = [];
					for (var u of ui.cargo.passengers) {
						__accu0__.append (unit_vec (u));
					}
					return __accu0__;
				}) (), [null, UnitLayer]);
				out ['cargo_slots_available'] = np.array ([ui.cargo.slots_available], __kwargtrans__ ({dtype: np.int32}));
			}
			else if (ui.HasField ('production')) {
				out ['single_select'] = named_array.NamedNumpyArray ([unit_vec (ui.production.unit)], [null, UnitLayer]);
				if (ui.production.build_queue) {
					out ['build_queue'] = named_array.NamedNumpyArray ((function () {
						var __accu0__ = [];
						for (var u of ui.production.build_queue) {
							__accu0__.append (unit_vec (u));
						}
						return __accu0__;
					}) (), [null, UnitLayer], __kwargtrans__ ({dtype: np.int32}));
				}
				if (ui.production.production_queue) {
					out ['production_queue'] = named_array.NamedNumpyArray ((function () {
						var __accu0__ = [];
						for (var item of ui.production.production_queue) {
							__accu0__.append (tuple ([item.ability_id, item.build_progress * 100]));
						}
						return __accu0__;
					}) (), [null, ProductionQueue], __kwargtrans__ ({dtype: np.int32}));
				}
			}
			__withid0__.__exit__ ();
		}
		catch (__except0__) {
			if (! (__withid0__.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
				throw __except0__;
			}
		}
		var tag_types = dict ({});
		var get_addon_type = function (tag) {
			if (!(tag_types)) {
				for (var u of raw.units) {
					tag_types [u.tag] = u.unit_type;
				}
			}
			return tag_types.py_get (tag, 0);
		};
		var full_unit_vec = function (u, pos_transform, is_raw) {
			if (typeof is_raw == 'undefined' || (is_raw != null && is_raw.hasOwnProperty ("__kwargtrans__"))) {;
				var is_raw = false;
			};
			var screen_pos = pos_transform.fwd_pt (point.Point.build (u.pos));
			var screen_radius = pos_transform.fwd_dist (u.radius);
			var raw_order = function (i) {
				if (len (u.orders) > i) {
					return actions.RAW_ABILITY_ID_TO_FUNC_ID.py_get (u.orders [i].ability_id, 0);
				}
				return 0;
			};
			var features = [u.unit_type, u.alliance, u.health, u.shield, u.energy, u.cargo_space_taken, int (u.build_progress * 100), (u.health_max > 0 ? int ((u.health / u.health_max) * 255) : 0), (u.shield_max > 0 ? int ((u.shield / u.shield_max) * 255) : 0), (u.energy_max > 0 ? int ((u.energy / u.energy_max) * 255) : 0), u.display_type, u.owner, screen_pos.x, screen_pos.y, u.facing, screen_radius, u.cloak, u.is_selected, u.is_blip, u.is_powered, u.mineral_contents, u.vespene_contents, u.cargo_space_max, u.assigned_harvesters, u.ideal_harvesters, u.weapon_cooldown, len (u.orders), raw_order (0), raw_order (1), (is_raw ? u.tag : 0), u.is_hallucination, (len (u.buff_ids) >= 1 ? u.buff_ids [0] : 0), (len (u.buff_ids) >= 2 ? u.buff_ids [1] : 0), (u.add_on_tag ? get_addon_type (u.add_on_tag) : 0), u.is_active, u.is_on_screen, (len (u.orders) >= 1 ? int (u.orders [0].progress * 100) : 0), (len (u.orders) >= 2 ? int (u.orders [1].progress * 100) : 0), raw_order (2), raw_order (3), 0, u.buff_duration_remain, u.buff_duration_max, u.attack_upgrade_level, u.armor_upgrade_level, u.shield_upgrade_level];
			return features;
		};
		var raw = obs.observation.raw_data;
		if (aif.use_feature_units) {
			var __withid0__ = sw ('feature_units');
			try {
				__withid0__.__enter__ ();
				self._update_camera (point.Point.build (raw.player.camera));
				var feature_units = (function () {
					var __accu0__ = [];
					for (var u of raw.units) {
						if (u.is_on_screen) {
							__accu0__.append (full_unit_vec (u, self._world_to_feature_screen_px));
						}
					}
					return __accu0__;
				}) ();
				out ['feature_units'] = named_array.NamedNumpyArray (feature_units, [null, FeatureUnit], __kwargtrans__ ({dtype: np.int64}));
				var feature_effects = [];
				var feature_screen_size = aif.feature_dimensions.screen;
				for (var effect of raw.effects) {
					for (var pos of effect.pos) {
						var screen_pos = self._world_to_feature_screen_px.fwd_pt (point.Point.build (pos));
						if ((0 <= screen_pos.x && screen_pos.x < feature_screen_size.x) && (0 <= screen_pos.y && screen_pos.y < feature_screen_size.y)) {
							feature_effects.append ([effect.effect_id, effect.alliance, effect.owner, effect.radius, screen_pos.x, screen_pos.y]);
						}
					}
				}
				out ['feature_effects'] = named_array.NamedNumpyArray (feature_effects, [null, EffectPos], __kwargtrans__ ({dtype: np.int32}));
				__withid0__.__exit__ ();
			}
			catch (__except0__) {
				if (! (__withid0__.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
					throw __except0__;
				}
			}
		}
		if (aif.use_raw_units) {
			var __withid0__ = sw ('raw_units');
			try {
				__withid0__.__enter__ ();
				var __withid1__ = sw ('to_list');
				try {
					__withid1__.__enter__ ();
					var raw_units = (function () {
						var __accu0__ = [];
						for (var u of raw.units) {
							__accu0__.append (full_unit_vec (u, self._world_to_minimap_px, __kwargtrans__ ({is_raw: true})));
						}
						return __accu0__;
					}) ();
					__withid1__.__exit__ ();
				}
				catch (__except0__) {
					if (! (__withid1__.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
						throw __except0__;
					}
				}
				var __withid1__ = sw ('to_numpy');
				try {
					__withid1__.__enter__ ();
					out ['raw_units'] = named_array.NamedNumpyArray (raw_units, [null, FeatureUnit], __kwargtrans__ ({dtype: np.int64}));
					__withid1__.__exit__ ();
				}
				catch (__except0__) {
					if (! (__withid1__.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
						throw __except0__;
					}
				}
				if (raw_units) {
					self._raw_tags = out ['raw_units'].__getitem__ ([tuple ([0, null, 1]), FeatureUnit.tag]);
				}
				else {
					self._raw_tags = np.array ([]);
				}
				var raw_effects = [];
				for (var effect of raw.effects) {
					for (var pos of effect.pos) {
						var raw_pos = self._world_to_minimap_px.fwd_pt (point.Point.build (pos));
						raw_effects.append ([effect.effect_id, effect.alliance, effect.owner, effect.radius, raw_pos.x, raw_pos.y]);
					}
				}
				out ['raw_effects'] = named_array.NamedNumpyArray (raw_effects, [null, EffectPos], __kwargtrans__ ({dtype: np.int32}));
				__withid0__.__exit__ ();
			}
			catch (__except0__) {
				if (! (__withid0__.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
					throw __except0__;
				}
			}
		}
		out ['upgrades'] = np.array (raw.player.upgrade_ids, __kwargtrans__ ({dtype: np.int32}));
		var cargo_units = function (u, pos_transform, is_raw) {
			if (typeof is_raw == 'undefined' || (is_raw != null && is_raw.hasOwnProperty ("__kwargtrans__"))) {;
				var is_raw = false;
			};
			var screen_pos = pos_transform.fwd_pt (point.Point.build (u.pos));
			var features = [];
			for (var v of u.passengers) {
				features.append ([v.unit_type, u.alliance, v.health, v.shield, v.energy, 0, 0, (v.health_max > 0 ? int ((v.health / v.health_max) * 255) : 0), (v.shield_max > 0 ? int ((v.shield / v.shield_max) * 255) : 0), (v.energy_max > 0 ? int ((v.energy / v.energy_max) * 255) : 0), 0, u.owner, screen_pos.x, screen_pos.y, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, (is_raw ? v.tag : 0), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]);
			}
			return features;
		};
		if (aif.add_cargo_to_units) {
			var __withid0__ = sw ('add_cargo_to_units');
			try {
				__withid0__.__enter__ ();
				if (aif.use_feature_units) {
					var __withid1__ = sw ('feature_units');
					try {
						__withid1__.__enter__ ();
						var __withid2__ = sw ('to_list');
						try {
							__withid2__.__enter__ ();
							var feature_cargo_units = [];
							for (var u of raw.units) {
								if (u.is_on_screen) {
									feature_cargo_units += cargo_units (u, self._world_to_feature_screen_px);
								}
							}
							__withid2__.__exit__ ();
						}
						catch (__except0__) {
							if (! (__withid2__.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
								throw __except0__;
							}
						}
						var __withid2__ = sw ('to_numpy');
						try {
							__withid2__.__enter__ ();
							if (feature_cargo_units) {
								var all_feature_units = np.array (feature_cargo_units, __kwargtrans__ ({dtype: np.int64}));
								var all_feature_units = np.concatenate ([out ['feature_units'], feature_cargo_units], __kwargtrans__ ({axis: 0}));
								out ['feature_units'] = named_array.NamedNumpyArray (all_feature_units, [null, FeatureUnit], __kwargtrans__ ({dtype: np.int64}));
							}
							__withid2__.__exit__ ();
						}
						catch (__except0__) {
							if (! (__withid2__.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
								throw __except0__;
							}
						}
						__withid1__.__exit__ ();
					}
					catch (__except0__) {
						if (! (__withid1__.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
							throw __except0__;
						}
					}
				}
				if (aif.use_raw_units) {
					var __withid1__ = sw ('raw_units');
					try {
						__withid1__.__enter__ ();
						var __withid2__ = sw ('to_list');
						try {
							__withid2__.__enter__ ();
							var raw_cargo_units = [];
							for (var u of raw.units) {
								raw_cargo_units += cargo_units (u, self._world_to_minimap_px, __kwargtrans__ ({is_raw: true}));
							}
							__withid2__.__exit__ ();
						}
						catch (__except0__) {
							if (! (__withid2__.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
								throw __except0__;
							}
						}
						var __withid2__ = sw ('to_numpy');
						try {
							__withid2__.__enter__ ();
							if (raw_cargo_units) {
								var raw_cargo_units = np.array (raw_cargo_units, __kwargtrans__ ({dtype: np.int64}));
								var all_raw_units = np.concatenate ([out ['raw_units'], raw_cargo_units], __kwargtrans__ ({axis: 0}));
								out ['raw_units'] = named_array.NamedNumpyArray (all_raw_units, [null, FeatureUnit], __kwargtrans__ ({dtype: np.int64}));
								self._raw_tags = out ['raw_units'].__getitem__ ([tuple ([0, null, 1]), FeatureUnit.tag]);
							}
							__withid2__.__exit__ ();
						}
						catch (__except0__) {
							if (! (__withid2__.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
								throw __except0__;
							}
						}
						__withid1__.__exit__ ();
					}
					catch (__except0__) {
						if (! (__withid1__.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
							throw __except0__;
						}
					}
				}
				__withid0__.__exit__ ();
			}
			catch (__except0__) {
				if (! (__withid0__.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
					throw __except0__;
				}
			}
		}
		if (aif.use_unit_counts) {
			var __withid0__ = sw ('unit_counts');
			try {
				__withid0__.__enter__ ();
				var unit_counts = collections.defaultdict (int);
				for (var u of raw.units) {
					if (u.alliance == sc_raw.Self) {
						unit_counts [u.unit_type]++;
					}
				}
				out ['unit_counts'] = named_array.NamedNumpyArray (sorted (unit_counts.py_items ()), [null, UnitCounts], __kwargtrans__ ({dtype: np.int32}));
				__withid0__.__exit__ ();
			}
			catch (__except0__) {
				if (! (__withid0__.__exit__ (__except0__.name, __except0__, __except0__.stack))) {
					throw __except0__;
				}
			}
		}
		if (aif.use_camera_position) {
			var camera_position = self._world_to_minimap_px.fwd_pt (point.Point.build (raw.player.camera));
			out ['camera_position'] = np.array (tuple ([camera_position.x, camera_position.y]), __kwargtrans__ ({dtype: np.int32}));
			out ['camera_size'] = np.array (tuple ([self._camera_size.x, self._camera_size.y]), __kwargtrans__ ({dtype: np.int32}));
		}
		if (!(self._raw)) {
			out ['available_actions'] = np.array (self.available_actions (obs.observation), __kwargtrans__ ({dtype: np.int32}));
		}
		if (self._requested_races !== null) {
			out ['home_race_requested'] = np.array (tuple ([self._requested_races [player.player_id]]), __kwargtrans__ ({dtype: np.int32}));
			for (var [player_id, race] of self._requested_races.py_items ()) {
				if (player_id != player.player_id) {
					out ['away_race_requested'] = np.array (tuple ([race]), __kwargtrans__ ({dtype: np.int32}));
				}
			}
		}
		if (aif.use_feature_units || aif.use_raw_units) {
			var transform_radar = function (radar) {
				var p = self._world_to_minimap_px.fwd_pt (point.Point.build (radar.pos));
				return tuple ([p.x, p.y, radar.radius]);
			};
			out ['radar'] = named_array.NamedNumpyArray (list (map (transform_radar, obs.observation.raw_data.radar)), [null, Radar], __kwargtrans__ ({dtype: np.int32}));
		}
		if (self._send_observation_proto) {
			out ['_response_observation'] = (function __lambda__ () {
				return obs;
			});
		}
		return out;
	}));},
	get available_actions () {return __get__ (this, sw.decorate (function (self, obs) {
		var available_actions = set ();
		var hide_specific_actions = self._agent_interface_format.hide_specific_actions;
		for (var [i, func] of six.iteritems (actions.FUNCTIONS_AVAILABLE)) {
			if (func.avail_fn (obs)) {
				available_actions.add (i);
			}
		}
		for (var a of obs.abilities) {
			if (!__in__ (a.ability_id, actions.ABILITY_IDS)) {
				logging.warning ('Unknown ability %s seen as available.', a.ability_id);
				continue;
			}
			var found_applicable = false;
			for (var func of actions.ABILITY_IDS [a.ability_id]) {
				if (__in__ (func.function_type, actions.POINT_REQUIRED_FUNCS [a.requires_point])) {
					if (func.general_id == 0 || !(hide_specific_actions)) {
						available_actions.add (func.id);
						var found_applicable = true;
					}
					if (func.general_id != 0) {
						for (var general_func of actions.ABILITY_IDS [func.general_id]) {
							if (general_func.function_type === func.function_type) {
								available_actions.add (general_func.id);
								var found_applicable = true;
								break;
							}
						}
					}
				}
			}
			if (!(found_applicable)) {
				var __except0__ = ValueError ('Failed to find applicable action for {}'.format (a));
				__except0__.__cause__ = null;
				throw __except0__;
			}
		}
		return list (available_actions);
	}));},
	get transform_action () {return __get__ (this, sw.decorate (function (self, obs, func_call, skip_available) {
		if (typeof skip_available == 'undefined' || (skip_available != null && skip_available.hasOwnProperty ("__kwargtrans__"))) {;
			var skip_available = false;
		};
		if (isinstance (func_call, sc_pb.Action)) {
			return func_call;
		}
		var func_id = func_call.function;
		try {
			if (self._raw) {
				var func = actions.RAW_FUNCTIONS [func_id];
			}
			else {
				var func = actions.FUNCTIONS [func_id];
			}
		}
		catch (__except0__) {
			if (isinstance (__except0__, KeyError)) {
				var __except1__ = ValueError (__mod__ ('Invalid function id: %s.', func_id));
				__except1__.__cause__ = null;
				throw __except1__;
			}
			else {
				throw __except0__;
			}
		}
		if (!(skip_available || self._raw || __in__ (func_id, self.available_actions (obs)))) {
			var __except0__ = ValueError (__mod__ ('Function %s/%s is currently not available', tuple ([func_id, func.py_name])));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		if (len (func_call.py_arguments) != len (func.args)) {
			var __except0__ = ValueError (__mod__ ('Wrong number of arguments for function: %s, got: %s', tuple ([func, func_call.py_arguments])));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		var aif = self._agent_interface_format;
		for (var [t, arg] of zip (func.args, func_call.py_arguments)) {
			if (t.count) {
				if ((1 <= len (arg) && len (arg) <= t.count)) {
					continue;
				}
				else {
					var __except0__ = ValueError (__mod__ ('Wrong number of values for argument of %s, got: %s', tuple ([func, func_call.py_arguments])));
					__except0__.__cause__ = null;
					throw __except0__;
				}
			}
			if (__in__ (t.py_name, tuple (['screen', 'screen2']))) {
				var sizes = aif.action_dimensions.screen;
			}
			else if (t.py_name == 'minimap') {
				var sizes = aif.action_dimensions.minimap;
			}
			else if (t.py_name == 'world') {
				var sizes = aif.raw_resolution;
			}
			else {
				var sizes = t.sizes;
			}
			if (len (sizes) != len (arg)) {
				var __except0__ = ValueError (__mod__ ('Wrong number of values for argument of %s, got: %s', tuple ([func, func_call.py_arguments])));
				__except0__.__cause__ = null;
				throw __except0__;
			}
			for (var [s, a] of zip (sizes, arg)) {
				if (!(np.all (0 <= a)) && np.all (a < s)) {
					var __except0__ = ValueError (__mod__ ('Argument is out of range for %s, got: %s', tuple ([func, func_call.py_arguments])));
					__except0__.__cause__ = null;
					throw __except0__;
				}
			}
		}
		var kwargs = (function () {
			var __accu0__ = [];
			for (var [type_, a] of zip (func.args, func_call.py_arguments)) {
				__accu0__.append ([type_.py_name, type_.fn (a)]);
			}
			return dict (__accu0__);
		}) ();
		var sc2_action = sc_pb.Action ();
		kwargs ['action'] = sc2_action;
		if (func.ability_id) {
			kwargs ['ability_id'] = func.ability_id;
		}
		if (self._raw) {
			if (__in__ ('world', kwargs)) {
				kwargs ['world'] = self._world_to_minimap_px.back_pt (kwargs ['world']);
			}
			var find_original_tag = function (position) {
				if (position >= len (self._raw_tags)) {
					return position;
				}
				var original_tag = self._raw_tags [position];
				if (original_tag == 0) {
					logging.warning ('Tag not found: %s', original_tag);
				}
				return original_tag;
			};
			if (__in__ ('target_unit_tag', kwargs)) {
				kwargs ['target_unit_tag'] = find_original_tag (kwargs ['target_unit_tag'] [0]);
			}
			if (__in__ ('unit_tags', kwargs)) {
				kwargs ['unit_tags'] = (function () {
					var __accu0__ = [];
					for (var t of kwargs ['unit_tags']) {
						__accu0__.append (find_original_tag (t));
					}
					return __accu0__;
				}) ();
			}
			actions.RAW_FUNCTIONS [func_id].function_type (__kwargtrans__ (kwargs));
		}
		else {
			kwargs ['action_space'] = aif.action_space;
			actions.FUNCTIONS [func_id].function_type (__kwargtrans__ (kwargs));
		}
		return sc2_action;
	}));},
	get reverse_action () {return __get__ (this, sw.decorate (function (self, action) {
		var FUNCTIONS = actions.FUNCTIONS;
		var aif = self._agent_interface_format;
		var func_call_ability = function (ability_id, cmd_type) {
			var args = tuple ([].slice.apply (arguments).slice (2));
			if (!__in__ (ability_id, actions.ABILITY_IDS)) {
				logging.warning ('Unknown ability_id: %s. This is probably dance or cheer, or some unknown new or map specific ability. Treating it as a no-op.', ability_id);
				return FUNCTIONS.no_op ();
			}
			if (aif.hide_specific_actions) {
				var general_id = py_next (py_iter (actions.ABILITY_IDS [ability_id])).general_id;
				if (general_id) {
					var ability_id = general_id;
				}
			}
			for (var func of actions.ABILITY_IDS [ability_id]) {
				if (func.function_type === cmd_type) {
					return FUNCTIONS [func.id] (...args);
				}
			}
			var __except0__ = ValueError (__mod__ ('Unknown ability_id: %s, type: %s. Likely a bug.', tuple ([ability_id, cmd_type.__name__])));
			__except0__.__cause__ = null;
			throw __except0__;
		};
		if (action.HasField ('action_ui')) {
			var act_ui = action.action_ui;
			if (act_ui.HasField ('multi_panel')) {
				return FUNCTIONS.select_unit (act_ui.multi_panel.py_metatype - 1, act_ui.multi_panel.unit_index);
			}
			if (act_ui.HasField ('control_group')) {
				return FUNCTIONS.select_control_group (act_ui.control_group.action - 1, act_ui.control_group.control_group_index);
			}
			if (act_ui.HasField ('select_idle_worker')) {
				return FUNCTIONS.select_idle_worker (act_ui.select_idle_worker.py_metatype - 1);
			}
			if (act_ui.HasField ('select_army')) {
				return FUNCTIONS.select_army (act_ui.select_army.selection_add);
			}
			if (act_ui.HasField ('select_warp_gates')) {
				return FUNCTIONS.select_warp_gates (act_ui.select_warp_gates.selection_add);
			}
			if (act_ui.HasField ('select_larva')) {
				return FUNCTIONS.select_larva ();
			}
			if (act_ui.HasField ('cargo_panel')) {
				return FUNCTIONS.unload (act_ui.cargo_panel.unit_index);
			}
			if (act_ui.HasField ('production_panel')) {
				return FUNCTIONS.build_queue (act_ui.production_panel.unit_index);
			}
			if (act_ui.HasField ('toggle_autocast')) {
				return func_call_ability (act_ui.toggle_autocast.ability_id, actions.autocast);
			}
		}
		if (action.HasField ('action_feature_layer') || action.HasField ('action_render')) {
			var act_sp = actions.spatial (action, aif.action_space);
			if (act_sp.HasField ('camera_move')) {
				var coord = point.Point.build (act_sp.camera_move.center_minimap);
				return FUNCTIONS.move_camera (coord);
			}
			if (act_sp.HasField ('unit_selection_point')) {
				var select_point = act_sp.unit_selection_point;
				var coord = point.Point.build (select_point.selection_screen_coord);
				return FUNCTIONS.select_point (select_point.py_metatype - 1, coord);
			}
			if (act_sp.HasField ('unit_selection_rect')) {
				var select_rect = act_sp.unit_selection_rect;
				var tl = point.Point.build (select_rect.selection_screen_coord [0].p0);
				var br = point.Point.build (select_rect.selection_screen_coord [0].p1);
				return FUNCTIONS.select_rect (select_rect.selection_add, tl, br);
			}
			if (act_sp.HasField ('unit_command')) {
				var cmd = act_sp.unit_command;
				var queue = int (cmd.queue_command);
				if (cmd.HasField ('target_screen_coord')) {
					var coord = point.Point.build (cmd.target_screen_coord);
					return func_call_ability (cmd.ability_id, actions.cmd_screen, queue, coord);
				}
				else if (cmd.HasField ('target_minimap_coord')) {
					var coord = point.Point.build (cmd.target_minimap_coord);
					return func_call_ability (cmd.ability_id, actions.cmd_minimap, queue, coord);
				}
				else {
					return func_call_ability (cmd.ability_id, actions.cmd_quick, queue);
				}
			}
		}
		if (action.HasField ('action_raw') || action.HasField ('action_render')) {
			var __except0__ = ValueError (__mod__ ('Unknown action:\n%s', action));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return FUNCTIONS.no_op ();
	}));},
	get reverse_raw_action () {return __get__ (this, sw.decorate (function (self, action, prev_obs) {
		var aif = self._agent_interface_format;
		var raw_tags = prev_obs ['raw_units'].__getitem__ ([tuple ([0, null, 1]), FeatureUnit.tag]);
		var find_tag_position = function (original_tag) {
			for (var [i, tag] of enumerate (raw_tags)) {
				if (tag == original_tag) {
					return i;
				}
			}
			logging.warning ('Not found tag! %s', original_tag);
			return -(1);
		};
		var func_call_ability = function (ability_id, cmd_type) {
			var args = tuple ([].slice.apply (arguments).slice (2));
			if (!__in__ (ability_id, actions.RAW_ABILITY_IDS)) {
				logging.warning ('Unknown ability_id: %s. This is probably dance or cheer, or some unknown new or map specific ability. Treating it as a no-op.', ability_id);
				return actions.RAW_FUNCTIONS.no_op ();
			}
			if (aif.hide_specific_actions) {
				var general_id = py_next (py_iter (actions.RAW_ABILITY_IDS [ability_id])).general_id;
				if (general_id) {
					var ability_id = general_id;
				}
			}
			for (var func of actions.RAW_ABILITY_IDS [ability_id]) {
				if (func.function_type === cmd_type) {
					return actions.RAW_FUNCTIONS [func.id] (...args);
				}
			}
			var __except0__ = ValueError (__mod__ ('Unknown ability_id: %s, type: %s. Likely a bug.', tuple ([ability_id, cmd_type.__name__])));
			__except0__.__cause__ = null;
			throw __except0__;
		};
		if (action.HasField ('action_raw')) {
			var raw_act = action.action_raw;
			if (raw_act.HasField ('unit_command')) {
				var uc = raw_act.unit_command;
				var ability_id = uc.ability_id;
				var queue_command = uc.queue_command;
				var unit_tags = (function () {
					var __accu0__ = [];
					for (var t of uc.unit_tags) {
						__accu0__.append (find_tag_position (t));
					}
					return py_iter (__accu0__);
				}) ();
				var unit_tags = (function () {
					var __accu0__ = [];
					for (var t of unit_tags) {
						if (t != -(1)) {
							__accu0__.append (t);
						}
					}
					return __accu0__;
				}) ();
				if (!(unit_tags)) {
					return actions.RAW_FUNCTIONS.no_op ();
				}
				if (uc.HasField ('target_unit_tag')) {
					var target_unit_tag = find_tag_position (uc.target_unit_tag);
					if (target_unit_tag == -(1)) {
						return actions.RAW_FUNCTIONS.no_op ();
					}
					return func_call_ability (ability_id, actions.raw_cmd_unit, queue_command, unit_tags, target_unit_tag);
				}
				if (uc.HasField ('target_world_space_pos')) {
					var coord = point.Point.build (uc.target_world_space_pos);
					var coord = self._world_to_minimap_px.fwd_pt (coord);
					return func_call_ability (ability_id, actions.raw_cmd_pt, queue_command, unit_tags, coord);
				}
				else {
					return func_call_ability (ability_id, actions.raw_cmd, queue_command, unit_tags);
				}
			}
			if (raw_act.HasField ('toggle_autocast')) {
				var uc = raw_act.toggle_autocast;
				var ability_id = uc.ability_id;
				var unit_tags = (function () {
					var __accu0__ = [];
					for (var t of uc.unit_tags) {
						__accu0__.append (find_tag_position (t));
					}
					return py_iter (__accu0__);
				}) ();
				var unit_tags = (function () {
					var __accu0__ = [];
					for (var t of unit_tags) {
						if (t != -(1)) {
							__accu0__.append (t);
						}
					}
					return __accu0__;
				}) ();
				if (!(unit_tags)) {
					return actions.RAW_FUNCTIONS.no_op ();
				}
				return func_call_ability (ability_id, actions.raw_autocast, unit_tags);
			}
			if (raw_act.HasField ('unit_command')) {
				var __except0__ = ValueError (__mod__ ('Unknown action:\n%s', action));
				__except0__.__cause__ = null;
				throw __except0__;
			}
			if (raw_act.HasField ('camera_move')) {
				var coord = point.Point.build (raw_act.camera_move.center_world_space);
				var coord = self._world_to_minimap_px.fwd_pt (coord);
				return actions.RAW_FUNCTIONS.raw_move_camera (coord);
			}
		}
		return actions.RAW_FUNCTIONS.no_op ();
	}));}
});
Object.defineProperty (Features, 'requested_races', property.call (Features, Features._get_requested_races));
Object.defineProperty (Features, 'map_size', property.call (Features, Features._get_map_size));;

//# sourceMappingURL=features.map