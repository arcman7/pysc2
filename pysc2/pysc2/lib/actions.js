import * as tf from '@tensorflow/tfjs-node'
import all_collections_generated_classes from 'all_collections_generated_classes'
import point from 'point'
import Tuple from 'tuple'

const numpy = {
  array: tf.tensor2d,
}

function len(container) {
  if (container.__len__) {
    return container.__len__()
  }
  return Object.keys(container).length;
}

function eq(a, b) {
  if (a.__eq__) {
    return a.__eq__(b)
  } 
  if(b.__eq__) {
    return b.__eq__(a)
  }
  return a === b
}

function iter(container) {
  if (container.__iter__) {
    return container.__iter__
  }
  if (len(container)) {
    return container
  }
  throw new Error('ValueError: Cannont iterate over non-iterable')
}


Array.prototype.extend = function(array) {
  for (let i = 0; i < array.length; i++) {
    this.push(array[i])
  }
}

function isinstance(a, compare) {
  const keys = Object.keys(compare);
  if (keys.length) {
    for (let i = 0; i < keys.length; i++) {
      if (a instanceof compare[keys[i]]) {
        return true;
      }
    }
    return false
  }
  return a instanceof compare;
}



var Enum  = function(name, dict) {
  let str = ''
  keys = Object.keys(dict)
  for (let i = 0; i < dict.length; i++) {
    str += `static ${key} = (class ${key} extends Number {
      constructor(val) {
        super(val)
      }
    })(dict[key]);`
    str += ``
  }
  return new Function(`
    return class ${name} {
      ${str}
      constructor(val) {
        if (!classDict.hasOwnProperty(val)) {
          throw new Error('ValueError: ', val, ' is not a valid ', name)
        }
        return static[]
      }
    }`
  )
}
var test = Enum('test', { test: 1, foo: 2 })

class Enumeration extends Map {
  constructor(dict) {
    for (const key in dict) {
      const val = dict[key]
      this[key] = dict[key]
      this[val] = key
    }
    return Object.freeze(this)
  }
  has(key) {
    return this.hasOwnProperty(key)
  }
}

// Enum = Enumeration;
function Enum(name, dict) {
  class Enum {
    constructor(val) {
      this.val = val
    }
  }
}
const ActionSpace = Enum({
  FEATURES: 1, // Act in feature layer pixel space with FUNCTIONS below.
  RGB: 2,      // Act in RGB pixel space with FUNCTIONS below.
  RAW: 3,      // Act with unit tags with RAW_FUNCTIONS below.
})

function spactial(action, action_space) {
  // Choose the action space for the action proto.//
  if (action_space === ActionSpace.FEATURES) {
    return action.action_feature_layer;
  } else if (action_space === ActionSpace.RGB) {
    return action.action_render;
  } else {
    throw new Error(`ValueError: Unexpected value for action_space: ${action_space}`);
  }
}
function no_op(action, action_space) {
  delete action[action_space]
}
function move_camera(action, action_space, minimap) {
  // Move the camera.//
  minimap.assign_to(spactial(action, action_space).camera_move.center_minimap);
}
function select_point(action, action_space, select_point_act, screen) {
  // Select a unit at a point.//
  select = spatial(action, action_space).unit_selection_point
  screen.assign_to(select.selection_screen_coord)
  select.type = select_point_act
}
function select_rect(action, action_space, select_add, screen, screen2) {
  // Select units within a rectangle.//
  select = spatial(action, action_space).unit_selection_rect
  out_rect = select.selection_screen_coord.add()
  screen_rect = point.Rect(screen, screen2)
  screen_rect.tl.assign_to(out_rect.p0)
  screen_rect.br.assign_to(out_rect.p1)
  select.selection_add = Boolean(select_add)
}
function select_idle_worker(action, action_space, select_worker) {
  // Select an idle worker.// 
  /* delete action_space has no equivalent in js */
  action.action_ui.select_idle_worker.type = select_worker
}

function select_army(action, action_space, select_add) {
  // Select the entire army.// 
  /* delete action_space has no equivalent in js */
  action.action_ui.select_army.selection_add = select_add
}

function select_warp_gates(action, action_space, select_add) {
  // Select all warp gates.// 
  /* delete action_space has no equivalent in js */
  action.action_ui.select_warp_gates.selection_add = select_add
}

function select_larva(action, action_space) {
  // Select all larva.// 
  /* delete action_space has no equivalent in js */
  action.action_ui.select_larva.SetInParent()  // Adds the empty proto field.
}

function select_unit(action, action_space, select_unit_act, select_unit_id) {
  // Select a specific unit from the multi-unit selection.// 
  /* delete action_space has no equivalent in js */
  select = action.action_ui.multi_panel
  select.type = select_unit_act
  select.unit_index = select_unit_id
}

function control_group(action, action_space, control_group_act, control_group_id) {
  // Act on a control group, selecting, setting, etc.// 
  /* delete action_space has no equivalent in js */
  select = action.action_ui.control_group
  select.action = control_group_act
  select.control_group_index = control_group_id
}

function unload(action, action_space, unload_id) {
  // Unload a unit from a transport/bunker/nydus/etc.// 
  /* delete action_space has no equivalent in js */
  action.action_ui.cargo_panel.unit_index = unload_id
}

function build_queue(action, action_space, build_queue_id) {
  // Cancel a unit in the build queue.// 
  /* delete action_space has no equivalent in js */
  action.action_ui.production_panel.unit_index = build_queue_id
}

function cmd_quick(action, action_space, ability_id, queued) {
  // Do a quick command like 'Stop' or 'Stim'.// 
  action_cmd = spatial(action, action_space).unit_command
  action_cmd.ability_id = ability_id
  action_cmd.queue_command = queued
}

function cmd_screen(action, action_space, ability_id, queued, screen) {
  // Do a command that needs a point on the screen.// 
  action_cmd = spatial(action, action_space).unit_command
  action_cmd.ability_id = ability_id
  action_cmd.queue_command = queued
  screen.assign_to(action_cmd.target_screen_coord)
}

function cmd_minimap(action, action_space, ability_id, queued, minimap) {
  // Do a command that needs a point on the minimap.// 
  action_cmd = spatial(action, action_space).unit_command
  action_cmd.ability_id = ability_id
  action_cmd.queue_command = queued
  minimap.assign_to(action_cmd.target_minimap_coord)
}

function autocast(action, action_space, ability_id) {
  // Toggle autocast.// 
  /* delete action_space has no equivalent in js */
  action.action_ui.toggle_autocast.ability_id = ability_id
}

function raw_no_op(action) {
  /* delete action has no equivalent in js */
}

function raw_move_camera(action, world) {
  // Move the camera.// 
  action_cmd = action.action_raw.camera_move
  world.assign_to(action_cmd.center_world_space)
}

function raw_cmd(action, ability_id, queued, unit_tags) {
  // Do a raw command to another unit.// 
  action_cmd = action.action_raw.unit_command
  action_cmd.ability_id = ability_id
  action_cmd.queue_command = queued
  if (!isinstance(unit_tags, [Tuple, Array])) {
    unit_tags = [unit_tags]
  }
  action_cmd.unit_tags.extend(unit_tags)
}

function raw_cmd_pt(action, ability_id, queued, unit_tags, world) {
  // Do a raw command to another unit towards a point.// 
  action_cmd = action.action_raw.unit_command
  action_cmd.ability_id = ability_id
  action_cmd.queue_command = queued
  if (!isinstance(unit_tags, [Tuple, Array])) {
    unit_tags = [unit_tags]
  }
  action_cmd.unit_tags.extend(unit_tags)
  world.assign_to(action_cmd.target_world_space_pos)
}

function raw_cmd_unit(action, ability_id, queued, unit_tags,
                 target_unit_tag) {
  // Do a raw command to another unit towards a unit.// 
  action_cmd = action.action_raw.unit_command
  action_cmd.ability_id = ability_id
  action_cmd.queue_command = queued
  if (!isinstance(unit_tags, [Tuple, Array])) {
    unit_tags = [unit_tags]
  }
  action_cmd.unit_tags.extend(unit_tags)
  action_cmd.target_unit_tag = target_unit_tag
}

function raw_autocast(action, ability_id, unit_tags) {
  // Toggle autocast.// 
  action_cmd = action.action_raw.toggle_autocast
  action_cmd.ability_id = ability_id
  if (!isinstance(unit_tags, [Tuple, Array])) {
    unit_tags = [unit_tags]
  }
  action_cmd.unit_tags.extend(unit_tags)
}

function numpy_to_python(val) {
  // Convert numpy types to their corresponding python types.// 
  if (isinstance(val, [int, float])) {
    return val
  }
  if (isinstance(val, String)) {
    return val
  }
  if (isinstance(val, numpy.number) ||
      isinstance(val, numpy.ndarray) && !(val.shape)) {  // numpy.array(1)
    return val.item()
  }
  if (isinstance(val, [Array, Tuple, numpy.ndarray])) {
    const result = [];
    Object.keys(val).forEach((key) => {
      result.push(numpy_to_python(val[key]))
    })
    return result
  }
  throw new Error(`ValueError: Unknown value. Type:${typeof(val)}, repr: ${JSON.stringify(val)}`)
}

class ArgumentType extends all_collections_generated_classes.ArgumentType {
  /*Represents a single argument type.

  Attributes:
    id: The argument id. This is unique.
    name: The name of the argument, also unique.
    sizes: The max+1 of each of the dimensions this argument takes.
    fn: The function to convert the list of integers into something more
        meaningful to be set in the protos to send to the game.
    values: An enum representing the values this argument type could hold. None
        if this isn't an enum argument type.
    count: Number of valid values. Only useful for unit_tags.
  */
  constructor(kwargs) {
    super(kwargs);
  }
  toString() {
    return `${this.id} / ${this.name} ${JSON.stringify(this.sizes)}`
  }
  static enum(options, values) {
    // Create an ArgumentType where you choose one of a set of known values.//
    const real = []
    options.forEach((tuple) => {
      const thing = tuple[1]
      real.push(thing)
    })
    function factor(i, name) {
      return new this.prototype.constructor({
        id: i,
        name,
        sizes: [len(real),],
        fn: (a) => real[a[0]],
        values,
        count: null,
      })
    }
    return factory
  }
  static scalar(value) {
    // Create an ArgumentType with a single scalar in range(value).//
    return (i, name) => this.prototype.constructor({
      id: i,
      name,
      sizes: [value,],
      fn: (a) => a[0],
      values: null,
      count: null,
    })
  }
  static point() {
    // Create an ArgumentType that is represented by a point.Point.//
    const self = this;
    function factory(i, name) {
      return self.prototype.constructor({
        id: i,
        name,
        sizes: [0, 0],
        fn: (a) => point.Point(...a).floor(),
        values: null,
        count: null,
      })
    }
    return factory
  }
  static spec(id_, name, sizes) {
    // Create an ArgumentType to be used in ValidActions.//
    return this.prototype.constructor({
      id: id_,
      name,
      sizes,
      fn: null,
      values: null,
      count: null,
    })
  }
  static unit_tags(count, size) {
    // Create an ArgumentType with a list of unbounded ints.//
    function clean(arg) {
      arg = numpy_to_python(arg)
      if (isinstance(arg, Array) && len(arg) === 1 && isinstance(arg[0], Array)) {
        arg = arg[0] // Support [[list, of, tags]].
      }
      return args.slice(0, count)
    }
    return (i, name) => this.prototype.constructor({
      id: i,
      name,
      sizes: [size,],
      fn: clean,
      values: null,
      count,
    })
  }
}

class Arguments extends all_collections_generated_classes.Arguments {
  /*The full list of argument types.

   Take a look at TYPES and FUNCTION_TYPES for more details.

   Attributes:
   screen: A point on the screen.
   minimap: A point on the minimap.
   screen2: The second point for a rectangle. This is needed so that no
      function takes the same type twice.
   queued: Whether the action should be done immediately or after all other
      actions queued for this unit.
   control_group_act: What to do with the control group.
   control_group_id: Which control group to do it with.
   select_point_act: What to do with the unit at the point.
   select_add: Whether to add the unit to the selection or replace it.
   select_unit_act: What to do when selecting a unit by id.
   select_unit_id: Which unit to select by id.
   select_worker: What to do when selecting a worker.
   build_queue_id: Which build queue index to target.
   unload_id: Which unit to target in a transport/nydus/command center.
  */
    constructor(kwargs) {
      super(kwargs);
    }
    static types(kwargs) {
      const named = {}
      Object.keys(kwargs).forEach((name) => {
        const factory = kwargs[key]
        named[name] = factory(Arugments._fields.indexOf(name), name)
      })
      return this.prototype.constructor(named)
    }
}

class RawArguments extends all_collections_generated_classes.RawArguments {
  /*The full list of argument types.

  Take a look at TYPES and FUNCTION_TYPES for more details.

  Attributes:
  world: A point in world coordinates
  queued: Whether the action should be done immediately or after all other actions queued for this unit.
  unit_tags: Which units should execute this action.
  target_unit_tag: The target unit of this action.
  */
  constructor(kwargs) {
    super(kwargs);
  }
  static types(kwargs) {
    const named = {}
    Object.keys(kwargs).forEach((name) => {
      const factory = kwargs[key]
      named[name] = factory(RawArguments._fields.indexOf(name), name)
    })
    return this.prototype.constructor(named)
  }
}

function _define_position_based_enum(name, options) {
  const dict = {}
  options.forEach((tuple, index) => {
    const funcName = tuple[0]
    dict[funcName] = index
  })
  return Enum(dict)
}

const QUEUED_OPTIONS = [
  ["now", false],
  ["queued", true],
]

Queued = _define_position_based_enum("Queued", QUEUED_OPTIONS)

CONTROL_GROUP_ACT_OPTIONS = [
  ["recall", sc_ui.ActionControlGroup.Recall],
  ["set", sc_ui.ActionControlGroup.Set],
  ["append", sc_ui.ActionControlGroup.Append],
  ["set_and_steal", sc_ui.ActionControlGroup.SetAndSteal],
  ["append_and_steal", sc_ui.ActionControlGroup.AppendAndSteal],
]

ControlGroupAct = _define_position_based_enum(
  "ControlGroupAct", CONTROL_GROUP_ACT_OPTIONS)

SELECT_POINT_ACT_OPTIONS = [
  ["select", sc_spatial.ActionSpatialUnitSelectionPoint.Select],
  ["toggle", sc_spatial.ActionSpatialUnitSelectionPoint.Toggle],
  ["select_all_type", sc_spatial.ActionSpatialUnitSelectionPoint.AllType],
  ["add_all_type", sc_spatial.ActionSpatialUnitSelectionPoint.AddAllType],
]
SelectPointAct = _define_position_based_enum(
  "SelectPointAct", SELECT_POINT_ACT_OPTIONS)

SELECT_ADD_OPTIONS = [
  ["select", False],
  ["add", True],
]
SelectAdd = _define_position_based_enum(
  "SelectAdd", SELECT_ADD_OPTIONS)

SELECT_UNIT_ACT_OPTIONS = [
  ["select", sc_ui.ActionMultiPanel.SingleSelect],
  ["deselect", sc_ui.ActionMultiPanel.DeselectUnit],
  ["select_all_type", sc_ui.ActionMultiPanel.SelectAllOfType],
  ["deselect_all_type", sc_ui.ActionMultiPanel.DeselectAllOfType],
]
SelectUnitAct = _define_position_based_enum(
  "SelectUnitAct", SELECT_UNIT_ACT_OPTIONS)

SELECT_WORKER_OPTIONS = [
  ["select", sc_ui.ActionSelectIdleWorker.Set],
  ["add", sc_ui.ActionSelectIdleWorker.Add],
  ["select_all", sc_ui.ActionSelectIdleWorker.All],
  ["add_all", sc_ui.ActionSelectIdleWorker.AddAll],
]
SelectWorker = _define_position_based_enum(
  "SelectWorker", SELECT_WORKER_OPTIONS)

TYPES = Arguments.types({
  screen: ArgumentType.point(),
  minimap: ArgumentType.point(),
  screen2: ArgumentType.point(),
  queued: ArgumentType.enum(QUEUED_OPTIONS, Queued),
  control_group_act: ArgumentType.enum(
      CONTROL_GROUP_ACT_OPTIONS, ControlGroupAct),
  control_group_id: ArgumentType.scalar(10),
  select_point_act: ArgumentType.enum(
      SELECT_POINT_ACT_OPTIONS, SelectPointAct),
  select_add: ArgumentType.enum(SELECT_ADD_OPTIONS, SelectAdd),
  select_unit_act: ArgumentType.enum(SELECT_UNIT_ACT_OPTIONS, SelectUnitAct),
  select_unit_id: ArgumentType.scalar(500),  // Depends on current selection.
  select_worker: ArgumentType.enum(SELECT_WORKER_OPTIONS, SelectWorker),
  build_queue_id: ArgumentType.scalar(10),  // Depends on current build queue.
  unload_id: ArgumentType.scalar(500),  // Depends on the current loaded units.
})

RAW_TYPES = RawArguments.types({
  world: ArgumentType.point(),
  queued: ArgumentType.enum(QUEUED_OPTIONS, Queued),
  unit_tags: ArgumentType.unit_tags(512, 512),
  target_unit_tag: ArgumentType.unit_tags(1, 512),
})

// Which argument types do each function need?
FUNCTION_TYPES = {
  no_op: [],
  move_camera: [TYPES.minimap],
  select_point: [TYPES.select_point_act, TYPES.screen],
  select_rect: [TYPES.select_add, TYPES.screen, TYPES.screen2],
  select_unit: [TYPES.select_unit_act, TYPES.select_unit_id],
  control_group: [TYPES.control_group_act, TYPES.control_group_id],
  select_idle_worker: [TYPES.select_worker],
  select_army: [TYPES.select_add],
  select_warp_gates: [TYPES.select_add],
  select_larva: [],
  unload: [TYPES.unload_id],
  build_queue: [TYPES.build_queue_id],
  cmd_quick: [TYPES.queued],
  cmd_screen: [TYPES.queued, TYPES.screen],
  cmd_minimap: [TYPES.queued, TYPES.minimap],
  autocast: [],
  raw_no_op: [],
  raw_cmd: [RAW_TYPES.queued, RAW_TYPES.unit_tags],
  raw_cmd_pt: [RAW_TYPES.queued, RAW_TYPES.unit_tags, RAW_TYPES.world],
  raw_cmd_unit: [RAW_TYPES.queued, RAW_TYPES.unit_tags,
                 RAW_TYPES.target_unit_tag],
  raw_move_camera: [RAW_TYPES.world],
  raw_autocast: [RAW_TYPES.unit_tags],
}

// Which ones need an ability?
ABILITY_FUNCTIONS = { cmd_quick, cmd_screen, cmd_minimap, autocast }
RAW_ABILITY_FUNCTIONS = { raw_cmd, raw_cmd_pt, raw_cmd_unit, raw_autocast }

// Which ones require a point?
POINT_REQUIRED_FUNCS = new Map()
POINT_REQUIRED_FUNCS.set(false, { cmd_quick, autocast })
POINT_REQUIRED_FUNCS.set(true, { cmd_screen, cmd_minimap, autocast })

const always = () => true

class Function extends all_collections_generated_classes.Function {
  /*Represents a function action.

  Attributes:
    id: The function id, which is what the agent will use.
    name: The name of the function. Should be unique.
    ability_id: The ability id to pass to sc2.
    general_id: 0 for normal abilities, and the ability_id of another ability if
        it can be represented by a more general action.
    function_type: One of the functions in FUNCTION_TYPES for how to construct
        the sc2 action proto out of python types.
    args: A list of the types of args passed to function_type.
    avail_fn: For non-abilities, this function returns whether the function is
        valid.
    raw: Whether the function is raw or not.
  */
  constructor(kwargs) {
    super(kwargs)
  }

  static ui_func(cls, id_, name, function_type, avail_fn=always) {
    //Define a function representing a ui action.//
    return this.prototype.constructor({
      id: id_,
      name,
      ability_id: 0,
      general_id: 0,
      function_type,
      args: FUNCTION_TYPES[function_type],
      avail_fn,
      raw: false,
    })
  }

  static ability(cls, id_, name, function_type, ability_id, general_id=0) {
    //Define a function represented as a game ability.//
    // assert function_type in ABILITY_FUNCTIONS
    if (!ABILITY_FUNCTIONS[function_type]) {
      console.warn('Unknown function type: ', JSON.stringify(function_type))
    }
    return this.prototype.constructor({
      id: id_,
      name,
      ability_id,
      general_id,
      function_type,
      args: FUNCTION_TYPES[function_type],
      avail_fn: null,
      raw: false,
    })
  }
  static raw_ability(cls, id_, name, function_type, ability_id, general_id=0,
                  avail_fn=always) {
    //Define a function represented as a game ability.//
    if (!RAW_ABILITY_FUNCTIONS[function_type]) {
      console.warn('Unknown function type: ', JSON.stringify(function_type))
    }
    return this.prototype.constructor({
      id: id_,
      name,
      ability_id,
      general_id,
      function_type,
      args: FUNCTION_TYPES[function_type],
      avail_fn,
      raw: true,
    })
  }
  static raw_ui_func(cls, id_, name, function_type, avail_fn=always) {
    //Define a function representing a ui action.//
    return this.prototype.constructor({
      id: id_,
      name,
      ability_id: 0,
      general_id: 0,
      function_type,
      args: FUNCTION_TYPES[function_type],
      avail_fn,
      raw: true,
    })
  }
  static spec(cls, id_, name, args) {
    //Create a Function to be used in ValidActions.//
    return this.prototype.constructor({
      id: id_, name,
      ability_id: null,
      general_id: null,
      function_type: null,
      args,
      avail_fn: null,
      raw: false,
    })
  }
  __hash__() {  // So it can go in a set().
    return this.id
  }

  __str__() {
    return this.str()
  }

  __call__() {
    //A convenient way to create a FunctionCall from this Function.//
    return FunctionCall.init_with_validation({
      function: this.id,
      arguments: arguments,
      raw: this.raw,
    })
  }  

  str(self, space=false) {
    //String version. Set space=True to line them all up nicely.//
    const val1 = (String(Math.floor(self.id))).rjust(space && 4)
    return `${ val1 } ${ this.name.ljust(space && 50) } (${ this.args.join('; ') })`
  }
}

class Functions {
  /*Represents the full set of functions.

  Can't use namedtuple since python3 has a limit of 255 function arguments, so
  build something similar.
  */
  constructor(functions) {
    this.__init__(functions)
  }
  __init__(functions) {
    functions = functions.sort((f) => f.id)
    this._func_list = functions
    this._func_dict = {}
    functions.forEach((f) => {
      this._func_dict[f.name] = f
    })
    if (len(this._func_dict) !== len(this._function_list)) {
      throw new Error('ValueError: Function names must be unique')
    }
  }
  __getstate__() {
    return this._func_list
  }
  __setstate__(functions) {
    this.__init__(functions)
  }
  __iter__() {
    return this._func_list
  }
  __len__() {
    return len(this._func_list)
  }
  __eq__(other) {
    for (let i = 0; i < this._func_list.length; i++) {
      if (this._func_list[i] !== other._func_list[i]) {
        return false;
      }
    }
    return true;
  }
}

// The semantic meaning of these actions can mainly be found by searching:
// http://liquipedia.net/starcraft2/ or http://starcraft.wikia.com/ .
_FUNCTIONS = [
  Function.ui_func({ id: 0, name: "no_op",  function_type: no_op }),
  Function.ui_func({ id: 1, name: "move_camera", function_type: move_camera }),
  Function.ui_func({ id: 2, name: "select_point", function_type: select_point }),
  Function.ui_func({ id: 3, name: "select_rect", function_type: select_rect }),
  Function.ui_func({ id: 4, name: "select_control_group", function_type: control_group }),
  Function.ui_func({ id: 5, name: "select_unit", function_type: select_unit,
                          avail_fn: (obs) => obs.ui_data.HasField("multi") }),
  Function.ui_func({ id: 6, name: "select_idle_worker", function_type: select_idle_worker,
                          avail_fn: (obs) => obs.player_common.idle_worker_count > 0 }),
  Function.ui_func({ id: 7, name: "select_army", function_type: select_army,
                          avail_fn: (obs) => obs.player_common.army_count > 0 }),
  Function.ui_func({ id: 8, name: "select_warp_gates", select_warp_gates,
                          avail_fn: (obs) => obs.player_common.warp_gate_count > 0 }),
  Function.ui_func({ id: 9, name: "select_larva", function_type: select_larva,
                          avail_fn: (obs) => obs.player_common.larva_count > 0 }),
  Function.ui_func({ id: 10, name:  "unload", function_type: unload,
                          avail_fn: (obs) => obs.ui_data.HasField("cargo") }),
  Function.ui_func({ id: 11, name:  "build_queue", function_type: build_queue,
                          avail_fn: (obs) => obs.ui_data.HasField("production") }),
  // Everything below here is generated with gen_actions.py
  Function.ability({ id_: 12, name: "Attack_screen", function_type: cmd_screen, ability_id: 3674 }),
  Function.ability({ id_: 13, name: "Attack_minimap", function_type: cmd_minimap, ability_id: 3674 }),
  Function.ability({ id_: 14, name: "Attack_Attack_screen", function_type: cmd_screen, ability_id: 23, general_id: 3674 }),
  Function.ability({ id_: 15, name: "Attack_Attack_minimap", function_type: cmd_minimap, ability_id: 23, general_id: 3674 }),
  Function.ability({ id_: 16, name: "Attack_AttackBuilding_screen", function_type: cmd_screen, ability_id: 2048, general_id: 3674 }),
  Function.ability({ id_: 17, name: "Attack_AttackBuilding_minimap", function_type: cmd_minimap, ability_id: 2048, general_id: 3674 }),
  Function.ability({ id_: 555, name: "Attack_Battlecruiser_screen", function_type: cmd_screen, ability_id: 3771, general_id: 3674 }),
  Function.ability({ id_: 556, name: "Attack_Battlecruiser_minimap", function_type: cmd_minimap, ability_id: 3771, general_id: 3674 }),
  Function.ability({ id_: 18, name: "Attack_Redirect_screen", function_type: cmd_screen, ability_id: 1682, general_id: 3674 }),
  Function.ability({ id_: 19, name: "Scan_Move_screen", function_type: cmd_screen, ability_id: 19, general_id: 3674 }),
  Function.ability({ id_: 20, name: "Scan_Move_minimap", function_type: cmd_minimap, ability_id: 19, general_id: 3674 }),
  Function.ability({ id_: 21, name: "Behavior_BuildingAttackOff_quick", function_type: cmd_quick, ability_id: 2082 }),
  Function.ability({ id_: 22, name: "Behavior_BuildingAttackOn_quick", function_type: cmd_quick, ability_id: 2081 }),
  Function.ability({ id_: 23, name: "Behavior_CloakOff_quick", function_type: cmd_quick, ability_id: 3677 }),
  Function.ability({ id_: 24, name: "Behavior_CloakOff_Banshee_quick", function_type: cmd_quick, ability_id: 393, general_id: 3677 }),
  Function.ability({ id_: 25, name: "Behavior_CloakOff_Ghost_quick", function_type: cmd_quick, ability_id: 383, general_id: 3677 }),
  Function.ability({ id_: 26, name: "Behavior_CloakOn_quick", function_type: cmd_quick, ability_id: 3676 }),
  Function.ability({ id_: 27, name: "Behavior_CloakOn_Banshee_quick", function_type: cmd_quick, ability_id: 392, general_id: 3676 }),
  Function.ability({ id_: 28, name: "Behavior_CloakOn_Ghost_quick", function_type: cmd_quick, ability_id: 382, general_id: 3676 }),
  Function.ability({ id_: 29, name: "Behavior_GenerateCreepOff_quick", function_type: cmd_quick, ability_id: 1693 }),
  Function.ability({ id_: 30, name: "Behavior_GenerateCreepOn_quick", function_type: cmd_quick, ability_id: 1692 }),
  Function.ability({ id_: 31, name: "Behavior_HoldFireOff_quick", function_type: cmd_quick, ability_id: 3689 }),
  Function.ability({ id_: 32, name: "Behavior_HoldFireOff_Ghost_quick", function_type: cmd_quick, ability_id: 38, general_id: 3689 }),
  Function.ability({ id_: 33, name: "Behavior_HoldFireOff_Lurker_quick", function_type: cmd_quick, ability_id: 2552, general_id: 3689 }),
  Function.ability({ id_: 34, name: "Behavior_HoldFireOn_quick", function_type: cmd_quick, ability_id: 3688 }),
  Function.ability({ id_: 35, name: "Behavior_HoldFireOn_Ghost_quick", function_type: cmd_quick, ability_id: 36, general_id: 3688 }),
  Function.ability({ id_: 36, name: "Behavior_HoldFireOn_Lurker_quick", function_type: cmd_quick, ability_id: 2550, general_id: 3688 }),
  Function.ability({ id_: 37, name: "Behavior_PulsarBeamOff_quick", function_type: cmd_quick, ability_id: 2376 }),
  Function.ability({ id_: 38, name: "Behavior_PulsarBeamOn_quick", function_type: cmd_quick, ability_id: 2375 }),
  Function.ability({ id_: 39, name: "Build_Armory_screen", function_type: cmd_screen, ability_id: 331 }),
  Function.ability({ id_: 40, name: "Build_Assimilator_screen", function_type: cmd_screen, ability_id: 882 }),
  Function.ability({ id_: 41, name: "Build_BanelingNest_screen", function_type: cmd_screen, ability_id: 1162 }),
  Function.ability({ id_: 42, name: "Build_Barracks_screen", function_type: cmd_screen, ability_id: 321 }),
  Function.ability({ id_: 43, name: "Build_Bunker_screen", function_type: cmd_screen, ability_id: 324 }),
  Function.ability({ id_: 44, name: "Build_CommandCenter_screen", function_type: cmd_screen, ability_id: 318 }),
  Function.ability({ id_: 45, name: "Build_CreepTumor_screen", function_type: cmd_screen, ability_id: 3691 }),
  Function.ability({ id_: 46, name: "Build_CreepTumor_Queen_screen", function_type: cmd_screen, ability_id: 1694, general_id: 3691 }),
  Function.ability({ id_: 47, name: "Build_CreepTumor_Tumor_screen", function_type: cmd_screen, ability_id: 1733, general_id: 3691 }),
  Function.ability({ id_: 48, name: "Build_CyberneticsCore_screen", function_type: cmd_screen, ability_id: 894 }),
  Function.ability({ id_: 49, name: "Build_DarkShrine_screen", function_type: cmd_screen, ability_id: 891 }),
  Function.ability({ id_: 50, name: "Build_EngineeringBay_screen", function_type: cmd_screen, ability_id: 322 }),
  Function.ability({ id_: 51, name: "Build_EvolutionChamber_screen", function_type: cmd_screen, ability_id: 1156 }),
  Function.ability({ id_: 52, name: "Build_Extractor_screen", function_type: cmd_screen, ability_id: 1154 }),
  Function.ability({ id_: 53, name: "Build_Factory_screen", function_type: cmd_screen, ability_id: 328 }),
  Function.ability({ id_: 54, name: "Build_FleetBeacon_screen", function_type: cmd_screen, ability_id: 885 }),
  Function.ability({ id_: 55, name: "Build_Forge_screen", function_type: cmd_screen, ability_id: 884 }),
  Function.ability({ id_: 56, name: "Build_FusionCore_screen", function_type: cmd_screen, ability_id: 333 }),
  Function.ability({ id_: 57, name: "Build_Gateway_screen", function_type: cmd_screen, ability_id: 883 }),
  Function.ability({ id_: 58, name: "Build_GhostAcademy_screen", function_type: cmd_screen, ability_id: 327 }),
  Function.ability({ id_: 59, name: "Build_Hatchery_screen", function_type: cmd_screen, ability_id: 1152 }),
  Function.ability({ id_: 60, name: "Build_HydraliskDen_screen", function_type: cmd_screen, ability_id: 1157 }),
  Function.ability({ id_: 61, name: "Build_InfestationPit_screen", function_type: cmd_screen, ability_id: 1160 }),
  Function.ability({ id_: 62, name: "Build_Interceptors_quick", function_type: cmd_quick, ability_id: 1042 }),
  Function.ability({ id_: 63, name: "Build_Interceptors_autocast", function_type: autocast, ability_id: 1042 }),
  Function.ability({ id_: 524, name: "Build_LurkerDen_screen", function_type: cmd_screen, ability_id: 1163 }),
  Function.ability({ id_: 64, name: "Build_MissileTurret_screen", function_type: cmd_screen, ability_id: 323 }),
  Function.ability({ id_: 65, name: "Build_Nexus_screen", function_type: cmd_screen, ability_id: 880 }),
  Function.ability({ id_: 66, name: "Build_Nuke_quick", function_type: cmd_quick, ability_id: 710 }),
  Function.ability({ id_: 67, name: "Build_NydusNetwork_screen", function_type: cmd_screen, ability_id: 1161 }),
  Function.ability({ id_: 68, name: "Build_NydusWorm_screen", function_type: cmd_screen, ability_id: 1768 }),
  Function.ability({ id_: 69, name: "Build_PhotonCannon_screen", function_type: cmd_screen, ability_id: 887 }),
  Function.ability({ id_: 70, name: "Build_Pylon_screen", function_type: cmd_screen, ability_id: 881 }),
  Function.ability({ id_: 71, name: "Build_Reactor_quick", function_type: cmd_quick, ability_id: 3683 }),
  Function.ability({ id_: 72, name: "Build_Reactor_screen", function_type: cmd_screen, ability_id: 3683 }),
  Function.ability({ id_: 73, name: "Build_Reactor_Barracks_quick", function_type: cmd_quick, ability_id: 422, general_id: 3683 }),
  Function.ability({ id_: 74, name: "Build_Reactor_Barracks_screen", function_type: cmd_screen, ability_id: 422, general_id: 3683 }),
  Function.ability({ id_: 75, name: "Build_Reactor_Factory_quick", function_type: cmd_quick, ability_id: 455, general_id: 3683 }),
  Function.ability({ id_: 76, name: "Build_Reactor_Factory_screen", function_type: cmd_screen, ability_id: 455, general_id: 3683 }),
  Function.ability({ id_: 77, name: "Build_Reactor_Starport_quick", function_type: cmd_quick, ability_id: 488, general_id: 3683 }),
  Function.ability({ id_: 78, name: "Build_Reactor_Starport_screen", function_type: cmd_screen, ability_id: 488, general_id: 3683 }),
  Function.ability({ id_: 79, name: "Build_Refinery_screen", function_type: cmd_screen, ability_id: 320 }),
  Function.ability({ id_: 80, name: "Build_RoachWarren_screen", function_type: cmd_screen, ability_id: 1165 }),
  Function.ability({ id_: 81, name: "Build_RoboticsBay_screen", function_type: cmd_screen, ability_id: 892 }),
  Function.ability({ id_: 82, name: "Build_RoboticsFacility_screen", function_type: cmd_screen, ability_id: 893 }),
  Function.ability({ id_: 83, name: "Build_SensorTower_screen", function_type: cmd_screen, ability_id: 326 }),
  Function.ability({ id_: 525, name: "Build_ShieldBattery_screen", function_type: cmd_screen, ability_id: 895 }),
  Function.ability({ id_: 84, name: "Build_SpawningPool_screen", function_type: cmd_screen, ability_id: 1155 }),
  Function.ability({ id_: 85, name: "Build_SpineCrawler_screen", function_type: cmd_screen, ability_id: 1166 }),
  Function.ability({ id_: 86, name: "Build_Spire_screen", function_type: cmd_screen, ability_id: 1158 }),
  Function.ability({ id_: 87, name: "Build_SporeCrawler_screen", function_type: cmd_screen, ability_id: 1167 }),
  Function.ability({ id_: 88, name: "Build_Stargate_screen", function_type: cmd_screen, ability_id: 889 }),
  Function.ability({ id_: 89, name: "Build_Starport_screen", function_type: cmd_screen, ability_id: 329 }),
  Function.ability({ id_: 90, name: "Build_StasisTrap_screen", function_type: cmd_screen, ability_id: 2505 }),
  Function.ability({ id_: 91, name: "Build_SupplyDepot_screen", function_type: cmd_screen, ability_id: 319 }),
  Function.ability({ id_: 92, name: "Build_TechLab_quick", function_type: cmd_quick, ability_id: 3682 }),
  Function.ability({ id_: 93, name: "Build_TechLab_screen", function_type: cmd_screen, ability_id: 3682 }),
  Function.ability({ id_: 94, name: "Build_TechLab_Barracks_quick", function_type: cmd_quick, ability_id: 421, general_id: 3682 }),
  Function.ability({ id_: 95, name: "Build_TechLab_Barracks_screen", function_type: cmd_screen, ability_id: 421, general_id: 3682 }),
  Function.ability({ id_: 96, name: "Build_TechLab_Factory_quick", function_type: cmd_quick, ability_id: 454, general_id: 3682 }),
  Function.ability({ id_: 97, name: "Build_TechLab_Factory_screen", function_type: cmd_screen, ability_id: 454, general_id: 3682 }),
  Function.ability({ id_: 98, name: "Build_TechLab_Starport_quick", function_type: cmd_quick, ability_id: 487, general_id: 3682 }),
  Function.ability({ id_: 99, name: "Build_TechLab_Starport_screen", function_type: cmd_screen, ability_id: 487, general_id: 3682 }),
  Function.ability({ id_: 100, name: "Build_TemplarArchive_screen", function_type: cmd_screen, ability_id: 890 }), 
  Function.ability({ id_: 101, name: "Build_TwilightCouncil_screen", function_type: cmd_screen, ability_id: 886 }),
  Function.ability({ id_: 102, name: "Build_UltraliskCavern_screen", function_type: cmd_screen, ability_id: 1159 }),
  Function.ability({ id_: 103, name: "BurrowDown_quick", function_type: cmd_quick, ability_id: 3661 }),
  Function.ability({ id_: 104, name: "BurrowDown_Baneling_quick", function_type: cmd_quick, ability_id: 1374, general_id: 3661 }),
  Function.ability({ id_: 105, name: "BurrowDown_Drone_quick", function_type: cmd_quick, ability_id: 1378, general_id: 3661 }),
  Function.ability({ id_: 106, name: "BurrowDown_Hydralisk_quick", function_type: cmd_quick, ability_id: 1382, general_id: 3661 }),
  Function.ability({ id_: 107, name: "BurrowDown_Infestor_quick", function_type: cmd_quick, ability_id: 1444, general_id: 3661 }),
  Function.ability({ id_: 108, name: "BurrowDown_InfestorTerran_quick", function_type: cmd_quick, ability_id: 1394, general_id: 3661 }),
  Function.ability({ id_: 109, name: "BurrowDown_Lurker_quick", function_type: cmd_quick, ability_id: 2108, general_id: 3661 }),
  Function.ability({ id_: 110, name: "BurrowDown_Queen_quick", function_type: cmd_quick, ability_id: 1433, general_id: 3661 }),
  Function.ability({ id_: 111, name: "BurrowDown_Ravager_quick", function_type: cmd_quick, ability_id: 2340, general_id: 3661 }),
  Function.ability({ id_: 112, name: "BurrowDown_Roach_quick", function_type: cmd_quick, ability_id: 1386, general_id: 3661 }),
  Function.ability({ id_: 113, name: "BurrowDown_SwarmHost_quick", function_type: cmd_quick, ability_id: 2014, general_id: 3661 }),
  Function.ability({ id_: 114, name: "BurrowDown_Ultralisk_quick", function_type: cmd_quick, ability_id: 1512, general_id: 3661 }),
  Function.ability({ id_: 115, name: "BurrowDown_WidowMine_quick", function_type: cmd_quick, ability_id: 2095, general_id: 3661 }),
  Function.ability({ id_: 116, name: "BurrowDown_Zergling_quick", function_type: cmd_quick, ability_id: 1390, general_id: 3661 }),
  Function.ability({ id_: 117, name: "BurrowUp_quick", function_type: cmd_quick, ability_id: 3662 }),
  Function.ability({ id_: 118, name: "BurrowUp_autocast", function_type: autocast, ability_id: 3662 }),
  Function.ability({ id_: 119, name: "BurrowUp_Baneling_quick", function_type: cmd_quick, ability_id: 1376, general_id: 3662 }),
  Function.ability({ id_: 120, name: "BurrowUp_Baneling_autocast", function_type: autocast, ability_id: 1376, general_id: 3662 }),
  Function.ability({ id_: 121, name: "BurrowUp_Drone_quick", function_type: cmd_quick, ability_id: 1380, general_id: 3662 }),
  Function.ability({ id_: 122, name: "BurrowUp_Hydralisk_quick", function_type: cmd_quick, ability_id: 1384, general_id: 3662 }),
  Function.ability({ id_: 123, name: "BurrowUp_Hydralisk_autocast", function_type: autocast, ability_id: 1384, general_id: 3662 }),
  Function.ability({ id_: 124, name: "BurrowUp_Infestor_quick", function_type: cmd_quick, ability_id: 1446, general_id: 3662 }),
  Function.ability({ id_: 125, name: "BurrowUp_InfestorTerran_quick", function_type: cmd_quick, ability_id: 1396, general_id: 3662 }),
  Function.ability({ id_: 126, name: "BurrowUp_InfestorTerran_autocast", function_type: autocast, ability_id: 1396, general_id: 3662 }),
  Function.ability({ id_: 127, name: "BurrowUp_Lurker_quick", function_type: cmd_quick, ability_id: 2110, general_id: 3662 }),
  Function.ability({ id_: 128, name: "BurrowUp_Queen_quick", function_type: cmd_quick, ability_id: 1435, general_id: 3662 }),
  Function.ability({ id_: 129, name: "BurrowUp_Queen_autocast", function_type: autocast, ability_id: 1435, general_id: 3662 }),
  Function.ability({ id_: 130, name: "BurrowUp_Ravager_quick", function_type: cmd_quick, ability_id: 2342, general_id: 3662 }),
  Function.ability({ id_: 131, name: "BurrowUp_Ravager_autocast", function_type: autocast, ability_id: 2342, general_id: 3662 }),
  Function.ability({ id_: 132, name: "BurrowUp_Roach_quick", function_type: cmd_quick, ability_id: 1388, general_id: 3662 }),
  Function.ability({ id_: 133, name: "BurrowUp_Roach_autocast", function_type: autocast, ability_id: 1388, general_id: 3662 }),
  Function.ability({ id_: 134, name: "BurrowUp_SwarmHost_quick", function_type: cmd_quick, ability_id: 2016, general_id: 3662 }),
  Function.ability({ id_: 135, name: "BurrowUp_Ultralisk_quick", function_type: cmd_quick, ability_id: 1514, general_id: 3662 }),
  Function.ability({ id_: 136, name: "BurrowUp_Ultralisk_autocast", function_type: autocast, ability_id: 1514, general_id: 3662 }),
  Function.ability({ id_: 137, name: "BurrowUp_WidowMine_quick", function_type: cmd_quick, ability_id: 2097, general_id: 3662 }),
  Function.ability({ id_: 138, name: "BurrowUp_Zergling_quick", function_type: cmd_quick, ability_id: 1392, general_id: 3662 }),
  Function.ability({ id_: 139, name: "BurrowUp_Zergling_autocast", function_type: autocast, ability_id: 1392, general_id: 3662 }),
  Function.ability({ id_: 140, name: "Cancel_quick", function_type: cmd_quick, ability_id: 3659 }),
  Function.ability({ id_: 141, name: "Cancel_AdeptPhaseShift_quick", function_type: cmd_quick, ability_id: 2594, general_id: 3659 }),
  Function.ability({ id_: 142, name: "Cancel_AdeptShadePhaseShift_quick", function_type: cmd_quick, ability_id: 2596, general_id: 3659 }),
  Function.ability({ id_: 143, name: "Cancel_BarracksAddOn_quick", function_type: cmd_quick, ability_id: 451, general_id: 3659 }),
  Function.ability({ id_: 144, name: "Cancel_BuildInProgress_quick", function_type: cmd_quick, ability_id: 314, general_id: 3659 }),
  Function.ability({ id_: 145, name: "Cancel_CreepTumor_quick", function_type: cmd_quick, ability_id: 1763, general_id: 3659 }),
  Function.ability({ id_: 146, name: "Cancel_FactoryAddOn_quick", function_type: cmd_quick, ability_id: 484, general_id: 3659 }),
  Function.ability({ id_: 147, name: "Cancel_GravitonBeam_quick", function_type: cmd_quick, ability_id: 174, general_id: 3659 }),
  Function.ability({ id_: 148, name: "Cancel_LockOn_quick", function_type: cmd_quick, ability_id: 2354, general_id: 3659 }),
  Function.ability({ id_: 149, name: "Cancel_MorphBroodlord_quick", function_type: cmd_quick, ability_id: 1373, general_id: 3659 }),
  Function.ability({ id_: 150, name: "Cancel_MorphGreaterSpire_quick", function_type: cmd_quick, ability_id: 1221, general_id: 3659 }),
  Function.ability({ id_: 151, name: "Cancel_MorphHive_quick", function_type: cmd_quick, ability_id: 1219, general_id: 3659 }),
  Function.ability({ id_: 152, name: "Cancel_MorphLair_quick", function_type: cmd_quick, ability_id: 1217, general_id: 3659 }),
  Function.ability({ id_: 153, name: "Cancel_MorphLurker_quick", function_type: cmd_quick, ability_id: 2333, general_id: 3659 }),
  Function.ability({ id_: 154, name: "Cancel_MorphLurkerDen_quick", function_type: cmd_quick, ability_id: 2113, general_id: 3659 }),
  Function.ability({ id_: 155, name: "Cancel_MorphMothership_quick", function_type: cmd_quick, ability_id: 1848, general_id: 3659 }),
  Function.ability({ id_: 156, name: "Cancel_MorphOrbital_quick", function_type: cmd_quick, ability_id: 1517, general_id: 3659 }),
  Function.ability({ id_: 157, name: "Cancel_MorphOverlordTransport_quick", function_type: cmd_quick, ability_id: 2709, general_id: 3659 }),
  Function.ability({ id_: 158, name: "Cancel_MorphOverseer_quick", function_type: cmd_quick, ability_id: 1449, general_id: 3659 }),
  Function.ability({ id_: 159, name: "Cancel_MorphPlanetaryFortress_quick", function_type: cmd_quick, ability_id: 1451, general_id: 3659 }),
  Function.ability({ id_: 160, name: "Cancel_MorphRavager_quick", function_type: cmd_quick, ability_id: 2331, general_id: 3659 }),
  Function.ability({ id_: 161, name: "Cancel_MorphThorExplosiveMode_quick", function_type: cmd_quick, ability_id: 2365, general_id: 3659 }),
  Function.ability({ id_: 162, name: "Cancel_NeuralParasite_quick", function_type: cmd_quick, ability_id: 250, general_id: 3659 }),
  Function.ability({ id_: 163, name: "Cancel_Nuke_quick", function_type: cmd_quick, ability_id: 1623, general_id: 3659 }),
  Function.ability({ id_: 164, name: "Cancel_SpineCrawlerRoot_quick", function_type: cmd_quick, ability_id: 1730, general_id: 3659 }),
  Function.ability({ id_: 165, name: "Cancel_SporeCrawlerRoot_quick", function_type: cmd_quick, ability_id: 1732, general_id: 3659 }),
  Function.ability({ id_: 166, name: "Cancel_StarportAddOn_quick", function_type: cmd_quick, ability_id: 517, general_id: 3659 }),
  Function.ability({ id_: 167, name: "Cancel_StasisTrap_quick", function_type: cmd_quick, ability_id: 2535, general_id: 3659 }),
  Function.ability({ id_: 546, name: "Cancel_VoidRayPrismaticAlignment_quick", function_type: cmd_quick, ability_id: 3707, general_id: 3659 }),
  Function.ability({ id_: 168, name: "Cancel_Last_quick", function_type: cmd_quick, ability_id: 3671 }),
  Function.ability({ id_: 169, name: "Cancel_HangarQueue5_quick", function_type: cmd_quick, ability_id: 1038, general_id: 3671 }),
  Function.ability({ id_: 170, name: "Cancel_Queue1_quick", function_type: cmd_quick, ability_id: 304, general_id: 3671 }),
  Function.ability({ id_: 171, name: "Cancel_Queue5_quick", function_type: cmd_quick, ability_id: 306, general_id: 3671 }),
  Function.ability({ id_: 172, name: "Cancel_QueueAddOn_quick", function_type: cmd_quick, ability_id: 312, general_id: 3671 }),
  Function.ability({ id_: 173, name: "Cancel_QueueCancelToSelection_quick", function_type: cmd_quick, ability_id: 308, general_id: 3671 }),
  Function.ability({ id_: 174, name: "Cancel_QueuePassive_quick", function_type: cmd_quick, ability_id: 1831, general_id: 3671 }),
  Function.ability({ id_: 175, name: "Cancel_QueuePassiveCancelToSelection_quick", function_type: cmd_quick, ability_id: 1833, general_id: 3671 }),
  Function.ability({ id_: 176, name: "Effect_Abduct_screen", function_type: cmd_screen, ability_id: 2067 }),
  Function.ability({ id_: 177, name: "Effect_AdeptPhaseShift_screen", function_type: cmd_screen, ability_id: 2544 }),
  Function.ability({ id_: 547, name: "Effect_AdeptPhaseShift_minimap", function_type: cmd_minimap, ability_id: 2544 }),
  Function.ability({ id_: 526, name: "Effect_AntiArmorMissile_screen", function_type: cmd_screen, ability_id: 3753 }),
  Function.ability({ id_: 178, name: "Effect_AutoTurret_screen", function_type: cmd_screen, ability_id: 1764 }),
  Function.ability({ id_: 179, name: "Effect_BlindingCloud_screen", function_type: cmd_screen, ability_id: 2063 }),
  Function.ability({ id_: 180, name: "Effect_Blink_screen", function_type: cmd_screen, ability_id: 3687 }),
  Function.ability({ id_: 543, name: "Effect_Blink_minimap", function_type: cmd_minimap, ability_id: 3687 }),
  Function.ability({ id_: 181, name: "Effect_Blink_Stalker_screen", function_type: cmd_screen, ability_id: 1442, general_id: 3687 }),
  Function.ability({ id_: 544, name: "Effect_Blink_Stalker_minimap", function_type: cmd_minimap, ability_id: 1442, general_id: 3687 }),
  Function.ability({ id_: 182, name: "Effect_ShadowStride_screen", function_type: cmd_screen, ability_id: 2700, general_id: 3687 }),
  Function.ability({ id_: 545, name: "Effect_ShadowStride_minimap", function_type: cmd_minimap, ability_id: 2700, general_id: 3687 }),
  Function.ability({ id_: 183, name: "Effect_CalldownMULE_screen", function_type: cmd_screen, ability_id: 171 }),
  Function.ability({ id_: 184, name: "Effect_CausticSpray_screen", function_type: cmd_screen, ability_id: 2324 }),
  Function.ability({ id_: 185, name: "Effect_Charge_screen", function_type: cmd_screen, ability_id: 1819 }),
  Function.ability({ id_: 186, name: "Effect_Charge_autocast", function_type: autocast, ability_id: 1819 }),
  Function.ability({ id_: 187, name: "Effect_ChronoBoost_screen", function_type: cmd_screen, ability_id: 261 }),
  Function.ability({ id_: 527, name: "Effect_ChronoBoostEnergyCost_screen", function_type: cmd_screen, ability_id: 3755 }),
  Function.ability({ id_: 188, name: "Effect_Contaminate_screen", function_type: cmd_screen, ability_id: 1825 }),
  Function.ability({ id_: 189, name: "Effect_CorrosiveBile_screen", function_type: cmd_screen, ability_id: 2338 }),
  Function.ability({ id_: 190, name: "Effect_EMP_screen", function_type: cmd_screen, ability_id: 1628 }),
  Function.ability({ id_: 191, name: "Effect_Explode_quick", function_type: cmd_quick, ability_id: 42 }),
  Function.ability({ id_: 192, name: "Effect_Feedback_screen", function_type: cmd_screen, ability_id: 140 }),
  Function.ability({ id_: 193, name: "Effect_ForceField_screen", function_type: cmd_screen, ability_id: 1526 }),
  Function.ability({ id_: 194, name: "Effect_FungalGrowth_screen", function_type: cmd_screen, ability_id: 74 }),
  Function.ability({ id_: 195, name: "Effect_GhostSnipe_screen", function_type: cmd_screen, ability_id: 2714 }),
  Function.ability({ id_: 196, name: "Effect_GravitonBeam_screen", function_type: cmd_screen, ability_id: 173 }),
  Function.ability({ id_: 197, name: "Effect_GuardianShield_quick", function_type: cmd_quick, ability_id: 76 }),
  Function.ability({ id_: 198, name: "Effect_Heal_screen", function_type: cmd_screen, ability_id: 386 }),
  Function.ability({ id_: 199, name: "Effect_Heal_autocast", function_type: autocast, ability_id: 386 }),
  Function.ability({ id_: 200, name: "Effect_HunterSeekerMissile_screen", function_type: cmd_screen, ability_id: 169 }),
  Function.ability({ id_: 201, name: "Effect_ImmortalBarrier_quick", function_type: cmd_quick, ability_id: 2328 }),
  Function.ability({ id_: 202, name: "Effect_ImmortalBarrier_autocast", function_type: autocast, ability_id: 2328 }),
  Function.ability({ id_: 203, name: "Effect_InfestedTerrans_screen", function_type: cmd_screen, ability_id: 247 }),
  Function.ability({ id_: 204, name: "Effect_InjectLarva_screen", function_type: cmd_screen, ability_id: 251 }),
  Function.ability({ id_: 528, name: "Effect_InterferenceMatrix_screen", function_type: cmd_screen, ability_id: 3747 }),
  Function.ability({ id_: 205, name: "Effect_KD8Charge_screen", function_type: cmd_screen, ability_id: 2588 }),
  Function.ability({ id_: 206, name: "Effect_LockOn_screen", function_type: cmd_screen, ability_id: 2350 }),
  Function.ability({ id_: 557, name: "Effect_LockOn_autocast", function_type: autocast, ability_id: 2350 }),
  Function.ability({ id_: 207, name: "Effect_LocustSwoop_screen", function_type: cmd_screen, ability_id: 2387 }),
  Function.ability({ id_: 208, name: "Effect_MassRecall_screen", function_type: cmd_screen, ability_id: 3686 }),
  Function.ability({ id_: 209, name: "Effect_MassRecall_Mothership_screen", function_type: cmd_screen, ability_id: 2368, general_id: 3686 }),
  Function.ability({ id_: 210, name: "Effect_MassRecall_MothershipCore_screen", function_type: cmd_screen, ability_id: 1974, general_id: 3686 }),
  Function.ability({ id_: 529, name: "Effect_MassRecall_Nexus_screen", function_type: cmd_screen, ability_id: 3757, general_id: 3686 }),
  Function.ability({ id_: 548, name: "Effect_MassRecall_StrategicRecall_screen", function_type: cmd_screen, ability_id: 142, general_id: 3686 }),
  Function.ability({ id_: 211, name: "Effect_MedivacIgniteAfterburners_quick", function_type: cmd_quick, ability_id: 2116 }),
  Function.ability({ id_: 212, name: "Effect_NeuralParasite_screen", function_type: cmd_screen, ability_id: 249 }),
  Function.ability({ id_: 213, name: "Effect_NukeCalldown_screen", function_type: cmd_screen, ability_id: 1622 }),
  Function.ability({ id_: 214, name: "Effect_OracleRevelation_screen", function_type: cmd_screen, ability_id: 2146 }),
  Function.ability({ id_: 215, name: "Effect_ParasiticBomb_screen", function_type: cmd_screen, ability_id: 2542 }),
  Function.ability({ id_: 216, name: "Effect_PhotonOvercharge_screen", function_type: cmd_screen, ability_id: 2162 }),
  Function.ability({ id_: 217, name: "Effect_PointDefenseDrone_screen", function_type: cmd_screen, ability_id: 144 }),
  Function.ability({ id_: 218, name: "Effect_PsiStorm_screen", function_type: cmd_screen, ability_id: 1036 }),
  Function.ability({ id_: 219, name: "Effect_PurificationNova_screen", function_type: cmd_screen, ability_id: 2346 }),
  Function.ability({ id_: 220, name: "Effect_Repair_screen", function_type: cmd_screen, ability_id: 3685 }),
  Function.ability({ id_: 221, name: "Effect_Repair_autocast", function_type: autocast, ability_id: 3685 }),
  Function.ability({ id_: 222, name: "Effect_Repair_Mule_screen", function_type: cmd_screen, ability_id: 78, general_id: 3685 }),
  Function.ability({ id_: 223, name: "Effect_Repair_Mule_autocast", function_type: autocast, ability_id: 78, general_id: 3685 }),
  Function.ability({ id_: 530, name: "Effect_Repair_RepairDrone_screen", function_type: cmd_screen, ability_id: 3751, general_id: 3685 }),
  Function.ability({ id_: 531, name: "Effect_Repair_RepairDrone_autocast", function_type: autocast, ability_id: 3751, general_id: 3685 }),
  Function.ability({ id_: 224, name: "Effect_Repair_SCV_screen", function_type: cmd_screen, ability_id: 316, general_id: 3685 }),
  Function.ability({ id_: 225, name: "Effect_Repair_SCV_autocast", function_type: autocast, ability_id: 316, general_id: 3685 }),
  Function.ability({ id_: 532, name: "Effect_RepairDrone_screen", function_type: cmd_screen, ability_id: 3749 }),
  Function.ability({ id_: 533, name: "Effect_Restore_screen", function_type: cmd_screen, ability_id: 3765 }),
  Function.ability({ id_: 534, name: "Effect_Restore_autocast", function_type: autocast, ability_id: 3765 }),
  Function.ability({ id_: 226, name: "Effect_Salvage_quick", function_type: cmd_quick, ability_id: 32 }),
  Function.ability({ id_: 227, name: "Effect_Scan_screen", function_type: cmd_screen, ability_id: 399 }),
  Function.ability({ id_: 542, name: "Effect_Scan_minimap", function_type: cmd_minimap, ability_id: 399 }),
  Function.ability({ id_: 228, name: "Effect_SpawnChangeling_quick", function_type: cmd_quick, ability_id: 181 }),
  Function.ability({ id_: 229, name: "Effect_SpawnLocusts_screen", function_type: cmd_screen, ability_id: 2704 }),
  Function.ability({ id_: 230, name: "Effect_Spray_screen", function_type: cmd_screen, ability_id: 3684 }),
  Function.ability({ id_: 231, name: "Effect_Spray_Protoss_screen", function_type: cmd_screen, ability_id: 30, general_id: 3684 }),
  Function.ability({ id_: 232, name: "Effect_Spray_Terran_screen", function_type: cmd_screen, ability_id: 26, general_id: 3684 }),
  Function.ability({ id_: 233, name: "Effect_Spray_Zerg_screen", function_type: cmd_screen, ability_id: 28, general_id: 3684 }),
  Function.ability({ id_: 549, name: "Effect_Spray_minimap", function_type: cmd_minimap, ability_id: 3684 }),
  Function.ability({ id_: 550, name: "Effect_Spray_Protoss_minimap", function_type: cmd_minimap, ability_id: 30, general_id: 3684 }),
  Function.ability({ id_: 551, name: "Effect_Spray_Terran_minimap", function_type: cmd_minimap, ability_id: 26, general_id: 3684 }),
  Function.ability({ id_: 552, name: "Effect_Spray_Zerg_minimap", function_type: cmd_minimap, ability_id: 28, general_id: 3684 }),
  Function.ability({ id_: 234, name: "Effect_Stim_quick", function_type: cmd_quick, ability_id: 3675 }),
  Function.ability({ id_: 235, name: "Effect_Stim_Marauder_quick", function_type: cmd_quick, ability_id: 253, general_id: 3675 }),
  Function.ability({ id_: 236, name: "Effect_Stim_Marauder_Redirect_quick", function_type: cmd_quick, ability_id: 1684, general_id: 3675 }),
  Function.ability({ id_: 237, name: "Effect_Stim_Marine_quick", function_type: cmd_quick, ability_id: 380, general_id: 3675 }),
  Function.ability({ id_: 238, name: "Effect_Stim_Marine_Redirect_quick", function_type: cmd_quick, ability_id: 1683, general_id: 3675 }),
  Function.ability({ id_: 239, name: "Effect_SupplyDrop_screen", function_type: cmd_screen, ability_id: 255 }),
  Function.ability({ id_: 240, name: "Effect_TacticalJump_screen", function_type: cmd_screen, ability_id: 2358 }),
  Function.ability({ id_: 553, name: "Effect_TacticalJump_minimap", function_type: cmd_minimap, ability_id: 2358 }),
  Function.ability({ id_: 241, name: "Effect_TimeWarp_screen", function_type: cmd_screen, ability_id: 2244 }),
  Function.ability({ id_: 242, name: "Effect_Transfusion_screen", function_type: cmd_screen, ability_id: 1664 }),
  Function.ability({ id_: 243, name: "Effect_ViperConsume_screen", function_type: cmd_screen, ability_id: 2073 }),
  Function.ability({ id_: 244, name: "Effect_VoidRayPrismaticAlignment_quick", function_type: cmd_quick, ability_id: 2393 }),
  Function.ability({ id_: 245, name: "Effect_WidowMineAttack_screen", function_type: cmd_screen, ability_id: 2099 }),
  Function.ability({ id_: 246, name: "Effect_WidowMineAttack_autocast", function_type: autocast, ability_id: 2099 }),
  Function.ability({ id_: 247, name: "Effect_YamatoGun_screen", function_type: cmd_screen, ability_id: 401 }),
  Function.ability({ id_: 248, name: "Hallucination_Adept_quick", function_type: cmd_quick, ability_id: 2391 }),
  Function.ability({ id_: 249, name: "Hallucination_Archon_quick", function_type: cmd_quick, ability_id: 146 }),
  Function.ability({ id_: 250, name: "Hallucination_Colossus_quick", function_type: cmd_quick, ability_id: 148 }),
  Function.ability({ id_: 251, name: "Hallucination_Disruptor_quick", function_type: cmd_quick, ability_id: 2389 }),
  Function.ability({ id_: 252, name: "Hallucination_HighTemplar_quick", function_type: cmd_quick, ability_id: 150 }),
  Function.ability({ id_: 253, name: "Hallucination_Immortal_quick", function_type: cmd_quick, ability_id: 152 }),
  Function.ability({ id_: 254, name: "Hallucination_Oracle_quick", function_type: cmd_quick, ability_id: 2114 }),
  Function.ability({ id_: 255, name: "Hallucination_Phoenix_quick", function_type: cmd_quick, ability_id: 154 }),
  Function.ability({ id_: 256, name: "Hallucination_Probe_quick", function_type: cmd_quick, ability_id: 156 }),
  Function.ability({ id_: 257, name: "Hallucination_Stalker_quick", function_type: cmd_quick, ability_id: 158 }),
  Function.ability({ id_: 258, name: "Hallucination_VoidRay_quick", function_type: cmd_quick, ability_id: 160 }),
  Function.ability({ id_: 259, name: "Hallucination_WarpPrism_quick", function_type: cmd_quick, ability_id: 162 }),
  Function.ability({ id_: 260, name: "Hallucination_Zealot_quick", function_type: cmd_quick, ability_id: 164 }),
  Function.ability({ id_: 261, name: "Halt_quick", function_type: cmd_quick, ability_id: 3660 }),
  Function.ability({ id_: 262, name: "Halt_Building_quick", function_type: cmd_quick, ability_id: 315, general_id: 3660 }),
  Function.ability({ id_: 263, name: "Halt_TerranBuild_quick", function_type: cmd_quick, ability_id: 348, general_id: 3660 }),
  Function.ability({ id_: 264, name: "Harvest_Gather_screen", function_type: cmd_screen, ability_id: 3666 }),
  Function.ability({ id_: 265, name: "Harvest_Gather_Drone_screen", function_type: cmd_screen, ability_id: 1183, general_id: 3666 }),
  Function.ability({ id_: 266, name: "Harvest_Gather_Mule_screen", function_type: cmd_screen, ability_id: 166, general_id: 3666 }),
  Function.ability({ id_: 267, name: "Harvest_Gather_Probe_screen", function_type: cmd_screen, ability_id: 298, general_id: 3666 }),
  Function.ability({ id_: 268, name: "Harvest_Gather_SCV_screen", function_type: cmd_screen, ability_id: 295, general_id: 3666 }),
  Function.ability({ id_: 269, name: "Harvest_Return_quick", function_type: cmd_quick, ability_id: 3667 }),
  Function.ability({ id_: 270, name: "Harvest_Return_Drone_quick", function_type: cmd_quick, ability_id: 1184, general_id: 3667 }),
  Function.ability({ id_: 271, name: "Harvest_Return_Mule_quick", function_type: cmd_quick, ability_id: 167, general_id: 3667 }),
  Function.ability({ id_: 272, name: "Harvest_Return_Probe_quick", function_type: cmd_quick, ability_id: 299, general_id: 3667 }),
  Function.ability({ id_: 273, name: "Harvest_Return_SCV_quick", function_type: cmd_quick, ability_id: 296, general_id: 3667 }),
  Function.ability({ id_: 274, name: "HoldPosition_quick", function_type: cmd_quick, ability_id: 3793 }),
  Function.ability({ id_: 558, name: "HoldPosition_Battlecruiser_quick", function_type: cmd_quick, ability_id: 3778, general_id: 3793 }),
  Function.ability({ id_: 559, name: "HoldPosition_Hold_quick", function_type: cmd_quick, ability_id: 18, general_id: 3793 }),
  Function.ability({ id_: 275, name: "Land_screen", function_type: cmd_screen, ability_id: 3678 }),
  Function.ability({ id_: 276, name: "Land_Barracks_screen", function_type: cmd_screen, ability_id: 554, general_id: 3678 }),
  Function.ability({ id_: 277, name: "Land_CommandCenter_screen", function_type: cmd_screen, ability_id: 419, general_id: 3678 }),
  Function.ability({ id_: 278, name: "Land_Factory_screen", function_type: cmd_screen, ability_id: 520, general_id: 3678 }),
  Function.ability({ id_: 279, name: "Land_OrbitalCommand_screen", function_type: cmd_screen, ability_id: 1524, general_id: 3678 }),
  Function.ability({ id_: 280, name: "Land_Starport_screen", function_type: cmd_screen, ability_id: 522, general_id: 3678 }),
  Function.ability({ id_: 281, name: "Lift_quick", function_type: cmd_quick, ability_id: 3679 }),
  Function.ability({ id_: 282, name: "Lift_Barracks_quick", function_type: cmd_quick, ability_id: 452, general_id: 3679 }),
  Function.ability({ id_: 283, name: "Lift_CommandCenter_quick", function_type: cmd_quick, ability_id: 417, general_id: 3679 }),
  Function.ability({ id_: 284, name: "Lift_Factory_quick", function_type: cmd_quick, ability_id: 485, general_id: 3679 }),
  Function.ability({ id_: 285, name: "Lift_OrbitalCommand_quick", function_type: cmd_quick, ability_id: 1522, general_id: 3679 }),
  Function.ability({ id_: 286, name: "Lift_Starport_quick", function_type: cmd_quick, ability_id: 518, general_id: 3679 }),
  Function.ability({ id_: 287, name: "Load_screen", function_type: cmd_screen, ability_id: 3668 }),
  Function.ability({ id_: 288, name: "Load_Bunker_screen", function_type: cmd_screen, ability_id: 407, general_id: 3668 }),
  Function.ability({ id_: 289, name: "Load_Medivac_screen", function_type: cmd_screen, ability_id: 394, general_id: 3668 }),
  Function.ability({ id_: 290, name: "Load_NydusNetwork_screen", function_type: cmd_screen, ability_id: 1437, general_id: 3668 }),
  Function.ability({ id_: 291, name: "Load_NydusWorm_screen", function_type: cmd_screen, ability_id: 2370, general_id: 3668 }),
  Function.ability({ id_: 292, name: "Load_Overlord_screen", function_type: cmd_screen, ability_id: 1406, general_id: 3668 }),
  Function.ability({ id_: 293, name: "Load_WarpPrism_screen", function_type: cmd_screen, ability_id: 911, general_id: 3668 }),
  Function.ability({ id_: 294, name: "LoadAll_quick", function_type: cmd_quick, ability_id: 3663 }),
  Function.ability({ id_: 295, name: "LoadAll_CommandCenter_quick", function_type: cmd_quick, ability_id: 416, general_id: 3663 }),
  Function.ability({ id_: 296, name: "Morph_Archon_quick", function_type: cmd_quick, ability_id: 1766 }),
  Function.ability({ id_: 297, name: "Morph_BroodLord_quick", function_type: cmd_quick, ability_id: 1372 }),
  Function.ability({ id_: 298, name: "Morph_Gateway_quick", function_type: cmd_quick, ability_id: 1520 }),
  Function.ability({ id_: 299, name: "Morph_GreaterSpire_quick", function_type: cmd_quick, ability_id: 1220 }),
  Function.ability({ id_: 300, name: "Morph_Hellbat_quick", function_type: cmd_quick, ability_id: 1998 }),
  Function.ability({ id_: 301, name: "Morph_Hellion_quick", function_type: cmd_quick, ability_id: 1978 }),
  Function.ability({ id_: 302, name: "Morph_Hive_quick", function_type: cmd_quick, ability_id: 1218 }),
  Function.ability({ id_: 303, name: "Morph_Lair_quick", function_type: cmd_quick, ability_id: 1216 }),
  Function.ability({ id_: 304, name: "Morph_LiberatorAAMode_quick", function_type: cmd_quick, ability_id: 2560 }),
  Function.ability({ id_: 305, name: "Morph_LiberatorAGMode_screen", function_type: cmd_screen, ability_id: 2558 }),
  Function.ability({ id_: 554, name: "Morph_LiberatorAGMode_minimap", function_type: cmd_minimap, ability_id: 2558 }),
  Function.ability({ id_: 306, name: "Morph_Lurker_quick", function_type: cmd_quick, ability_id: 2332 }),
  Function.ability({ id_: 307, name: "Morph_LurkerDen_quick", function_type: cmd_quick, ability_id: 2112 }),
  Function.ability({ id_: 308, name: "Morph_Mothership_quick", function_type: cmd_quick, ability_id: 1847 }),
  Function.ability({ id_: 535, name: "Morph_ObserverMode_quick", function_type: cmd_quick, ability_id: 3739 }),
  Function.ability({ id_: 309, name: "Morph_OrbitalCommand_quick", function_type: cmd_quick, ability_id: 1516 }),
  Function.ability({ id_: 310, name: "Morph_OverlordTransport_quick", function_type: cmd_quick, ability_id: 2708 }),
  Function.ability({ id_: 311, name: "Morph_Overseer_quick", function_type: cmd_quick, ability_id: 1448 }),
  Function.ability({ id_: 536, name: "Morph_OverseerMode_quick", function_type: cmd_quick, ability_id: 3745 }),
  Function.ability({ id_: 537, name: "Morph_OversightMode_quick", function_type: cmd_quick, ability_id: 3743 }),
  Function.ability({ id_: 312, name: "Morph_PlanetaryFortress_quick", function_type: cmd_quick, ability_id: 1450 }),
  Function.ability({ id_: 313, name: "Morph_Ravager_quick", function_type: cmd_quick, ability_id: 2330 }),
  Function.ability({ id_: 314, name: "Morph_Root_screen", function_type: cmd_screen, ability_id: 3680 }),
  Function.ability({ id_: 315, name: "Morph_SpineCrawlerRoot_screen", function_type: cmd_screen, ability_id: 1729, general_id: 3680 }),
  Function.ability({ id_: 316, name: "Morph_SporeCrawlerRoot_screen", function_type: cmd_screen, ability_id: 1731, general_id: 3680 }),
  Function.ability({ id_: 317, name: "Morph_SiegeMode_quick", function_type: cmd_quick, ability_id: 388 }),
  Function.ability({ id_: 318, name: "Morph_SupplyDepot_Lower_quick", function_type: cmd_quick, ability_id: 556 }),
  Function.ability({ id_: 319, name: "Morph_SupplyDepot_Raise_quick", function_type: cmd_quick, ability_id: 558 }),
  Function.ability({ id_: 538, name: "Morph_SurveillanceMode_quick", function_type: cmd_quick, ability_id: 3741 }),
  Function.ability({ id_: 320, name: "Morph_ThorExplosiveMode_quick", function_type: cmd_quick, ability_id: 2364 }),
  Function.ability({ id_: 321, name: "Morph_ThorHighImpactMode_quick", function_type: cmd_quick, ability_id: 2362 }),
  Function.ability({ id_: 322, name: "Morph_Unsiege_quick", function_type: cmd_quick, ability_id: 390 }),
  Function.ability({ id_: 323, name: "Morph_Uproot_quick", function_type: cmd_quick, ability_id: 3681 }),
  Function.ability({ id_: 324, name: "Morph_SpineCrawlerUproot_quick", function_type: cmd_quick, ability_id: 1725, general_id: 3681 }),
  Function.ability({ id_: 325, name: "Morph_SporeCrawlerUproot_quick", function_type: cmd_quick, ability_id: 1727, general_id: 3681 }),
  Function.ability({ id_: 326, name: "Morph_VikingAssaultMode_quick", function_type: cmd_quick, ability_id: 403 }),
  Function.ability({ id_: 327, name: "Morph_VikingFighterMode_quick", function_type: cmd_quick, ability_id: 405 }),
  Function.ability({ id_: 328, name: "Morph_WarpGate_quick", function_type: cmd_quick, ability_id: 1518 }),
  Function.ability({ id_: 560, name: "Morph_WarpGate_autocast", function_type: autocast, ability_id: 1518 }),
  Function.ability({ id_: 329, name: "Morph_WarpPrismPhasingMode_quick", function_type: cmd_quick, ability_id: 1528 }),
  Function.ability({ id_: 330, name: "Morph_WarpPrismTransportMode_quick", function_type: cmd_quick, ability_id: 1530 }),
  Function.ability({ id_: 331, name: "Move_screen", function_type: cmd_screen, ability_id: 3794 }),
  Function.ability({ id_: 332, name: "Move_minimap", function_type: cmd_minimap, ability_id: 3794 }),
  Function.ability({ id_: 561, name: "Move_Battlecruiser_screen", function_type: cmd_screen, ability_id: 3776, general_id: 3794 }),
  Function.ability({ id_: 562, name: "Move_Battlecruiser_minimap", function_type: cmd_minimap, ability_id: 3776, general_id: 3794 }),
  Function.ability({ id_: 563, name: "Move_Move_screen", function_type: cmd_screen, ability_id: 16, general_id: 3794 }),
  Function.ability({ id_: 564, name: "Move_Move_minimap", function_type: cmd_minimap, ability_id: 16, general_id: 3794 }),
  Function.ability({ id_: 333, name: "Patrol_screen", function_type: cmd_screen, ability_id: 3795 }),
  Function.ability({ id_: 334, name: "Patrol_minimap", function_type: cmd_minimap, ability_id: 3795 }),
  Function.ability({ id_: 565, name: "Patrol_Battlecruiser_screen", function_type: cmd_screen, ability_id: 3777, general_id: 3795 }),
  Function.ability({ id_: 566, name: "Patrol_Battlecruiser_minimap", function_type: cmd_minimap, ability_id: 3777, general_id: 3795 }),
  Function.ability({ id_: 567, name: "Patrol_Patrol_screen", function_type: cmd_screen, ability_id: 17, general_id: 3795 }),
  Function.ability({ id_: 568, name: "Patrol_Patrol_minimap", function_type: cmd_minimap, ability_id: 17, general_id: 3795 }),
  Function.ability({ id_: 335, name: "Rally_Units_screen", function_type: cmd_screen, ability_id: 3673 }),
  Function.ability({ id_: 336, name: "Rally_Units_minimap", function_type: cmd_minimap, ability_id: 3673 }),
  Function.ability({ id_: 337, name: "Rally_Building_screen", function_type: cmd_screen, ability_id: 195, general_id: 3673 }),
  Function.ability({ id_: 338, name: "Rally_Building_minimap", function_type: cmd_minimap, ability_id: 195, general_id: 3673 }),
  Function.ability({ id_: 339, name: "Rally_Hatchery_Units_screen", function_type: cmd_screen, ability_id: 211, general_id: 3673 }),
  Function.ability({ id_: 340, name: "Rally_Hatchery_Units_minimap", function_type: cmd_minimap, ability_id: 211, general_id: 3673 }),
  Function.ability({ id_: 341, name: "Rally_Morphing_Unit_screen", function_type: cmd_screen, ability_id: 199, general_id: 3673 }),
  Function.ability({ id_: 342, name: "Rally_Morphing_Unit_minimap", function_type: cmd_minimap, ability_id: 199, general_id: 3673 }),
  Function.ability({ id_: 343, name: "Rally_Workers_screen", function_type: cmd_screen, ability_id: 3690 }),
  Function.ability({ id_: 344, name: "Rally_Workers_minimap", function_type: cmd_minimap, ability_id: 3690 }),
  Function.ability({ id_: 345, name: "Rally_CommandCenter_screen", function_type: cmd_screen, ability_id: 203, general_id: 3690 }),
  Function.ability({ id_: 346, name: "Rally_CommandCenter_minimap", function_type: cmd_minimap, ability_id: 203, general_id: 3690 }),
  Function.ability({ id_: 347, name: "Rally_Hatchery_Workers_screen", function_type: cmd_screen, ability_id: 212, general_id: 3690 }),
  Function.ability({ id_: 348, name: "Rally_Hatchery_Workers_minimap", function_type: cmd_minimap, ability_id: 212, general_id: 3690 }),
  Function.ability({ id_: 349, name: "Rally_Nexus_screen", function_type: cmd_screen, ability_id: 207, general_id: 3690 }),
  Function.ability({ id_: 350, name: "Rally_Nexus_minimap", function_type: cmd_minimap, ability_id: 207, general_id: 3690 }),
  Function.ability({ id_: 539, name: "Research_AdaptiveTalons_quick", function_type: cmd_quick, ability_id: 3709 }),
  Function.ability({ id_: 351, name: "Research_AdeptResonatingGlaives_quick", function_type: cmd_quick, ability_id: 1594 }),
  Function.ability({ id_: 352, name: "Research_AdvancedBallistics_quick", function_type: cmd_quick, ability_id: 805 }),
  Function.ability({ id_: 569, name: "Research_AnabolicSynthesis_quick", function_type: cmd_quick, ability_id: 263 }),
  Function.ability({ id_: 353, name: "Research_BansheeCloakingField_quick", function_type: cmd_quick, ability_id: 790 }),
  Function.ability({ id_: 354, name: "Research_BansheeHyperflightRotors_quick", function_type: cmd_quick, ability_id: 799 }),
  Function.ability({ id_: 355, name: "Research_BattlecruiserWeaponRefit_quick", function_type: cmd_quick, ability_id: 1532 }),
  Function.ability({ id_: 356, name: "Research_Blink_quick", function_type: cmd_quick, ability_id: 1593 }),
  Function.ability({ id_: 357, name: "Research_Burrow_quick", function_type: cmd_quick, ability_id: 1225 }),
  Function.ability({ id_: 358, name: "Research_CentrifugalHooks_quick", function_type: cmd_quick, ability_id: 1482 }),
  Function.ability({ id_: 359, name: "Research_Charge_quick", function_type: cmd_quick, ability_id: 1592 }),
  Function.ability({ id_: 360, name: "Research_ChitinousPlating_quick", function_type: cmd_quick, ability_id: 265 }),
  Function.ability({ id_: 361, name: "Research_CombatShield_quick", function_type: cmd_quick, ability_id: 731 }),
  Function.ability({ id_: 362, name: "Research_ConcussiveShells_quick", function_type: cmd_quick, ability_id: 732 }),
  Function.ability({ id_: 570, name: "Research_CycloneLockOnDamage_quick", function_type: cmd_quick, ability_id: 769 }),
  Function.ability({ id_: 540, name: "Research_CycloneRapidFireLaunchers_quick", function_type: cmd_quick, ability_id: 768 }),
  Function.ability({ id_: 363, name: "Research_DrillingClaws_quick", function_type: cmd_quick, ability_id: 764 }),
  Function.ability({ id_: 572, name: "Research_EnhancedShockwaves_quick", function_type: cmd_quick, ability_id: 822 }),
  Function.ability({ id_: 364, name: "Research_ExtendedThermalLance_quick", function_type: cmd_quick, ability_id: 1097 }),
  Function.ability({ id_: 365, name: "Research_GlialRegeneration_quick", function_type: cmd_quick, ability_id: 216 }),
  Function.ability({ id_: 366, name: "Research_GraviticBooster_quick", function_type: cmd_quick, ability_id: 1093 }),
  Function.ability({ id_: 367, name: "Research_GraviticDrive_quick", function_type: cmd_quick, ability_id: 1094 }),
  Function.ability({ id_: 368, name: "Research_GroovedSpines_quick", function_type: cmd_quick, ability_id: 1282 }),
  Function.ability({ id_: 369, name: "Research_HiSecAutoTracking_quick", function_type: cmd_quick, ability_id: 650 }),
  Function.ability({ id_: 370, name: "Research_HighCapacityFuelTanks_quick", function_type: cmd_quick, ability_id: 804 }),
  Function.ability({ id_: 371, name: "Research_InfernalPreigniter_quick", function_type: cmd_quick, ability_id: 761 }),
  Function.ability({ id_: 372, name: "Research_InterceptorGravitonCatapult_quick", function_type: cmd_quick, ability_id: 44 }),
  Function.ability({ id_: 374, name: "Research_MuscularAugments_quick", function_type: cmd_quick, ability_id: 1283 }),
  Function.ability({ id_: 375, name: "Research_NeosteelFrame_quick", function_type: cmd_quick, ability_id: 655 }),
  Function.ability({ id_: 376, name: "Research_NeuralParasite_quick", function_type: cmd_quick, ability_id: 1455 }),
  Function.ability({ id_: 377, name: "Research_PathogenGlands_quick", function_type: cmd_quick, ability_id: 1454 }),
  Function.ability({ id_: 378, name: "Research_PersonalCloaking_quick", function_type: cmd_quick, ability_id: 820 }),
  Function.ability({ id_: 379, name: "Research_PhoenixAnionPulseCrystals_quick", function_type: cmd_quick, ability_id: 46 }),
  Function.ability({ id_: 380, name: "Research_PneumatizedCarapace_quick", function_type: cmd_quick, ability_id: 1223 }),
  Function.ability({ id_: 381, name: "Research_ProtossAirArmor_quick", function_type: cmd_quick, ability_id: 3692 }),
  Function.ability({ id_: 382, name: "Research_ProtossAirArmorLevel1_quick", function_type: cmd_quick, ability_id: 1565, general_id: 3692 }),
  Function.ability({ id_: 383, name: "Research_ProtossAirArmorLevel2_quick", function_type: cmd_quick, ability_id: 1566, general_id: 3692 }),
  Function.ability({ id_: 384, name: "Research_ProtossAirArmorLevel3_quick", function_type: cmd_quick, ability_id: 1567, general_id: 3692 }),
  Function.ability({ id_: 385, name: "Research_ProtossAirWeapons_quick", function_type: cmd_quick, ability_id: 3693 }),
  Function.ability({ id_: 386, name: "Research_ProtossAirWeaponsLevel1_quick", function_type: cmd_quick, ability_id: 1562, general_id: 3693 }),
  Function.ability({ id_: 387, name: "Research_ProtossAirWeaponsLevel2_quick", function_type: cmd_quick, ability_id: 1563, general_id: 3693 }),
  Function.ability({ id_: 388, name: "Research_ProtossAirWeaponsLevel3_quick", function_type: cmd_quick, ability_id: 1564, general_id: 3693 }),
  Function.ability({ id_: 389, name: "Research_ProtossGroundArmor_quick", function_type: cmd_quick, ability_id: 3694 }),
  Function.ability({ id_: 390, name: "Research_ProtossGroundArmorLevel1_quick", function_type: cmd_quick, ability_id: 1065, general_id: 3694 }),
  Function.ability({ id_: 391, name: "Research_ProtossGroundArmorLevel2_quick", function_type: cmd_quick, ability_id: 1066, general_id: 3694 }),
  Function.ability({ id_: 392, name: "Research_ProtossGroundArmorLevel3_quick", function_type: cmd_quick, ability_id: 1067, general_id: 3694 }),
  Function.ability({ id_: 393, name: "Research_ProtossGroundWeapons_quick", function_type: cmd_quick, ability_id: 3695 }),
  Function.ability({ id_: 394, name: "Research_ProtossGroundWeaponsLevel1_quick", function_type: cmd_quick, ability_id: 1062, general_id: 3695 }),
  Function.ability({ id_: 395, name: "Research_ProtossGroundWeaponsLevel2_quick", function_type: cmd_quick, ability_id: 1063, general_id: 3695 }),
  Function.ability({ id_: 396, name: "Research_ProtossGroundWeaponsLevel3_quick", function_type: cmd_quick, ability_id: 1064, general_id: 3695 }),
  Function.ability({ id_: 397, name: "Research_ProtossShields_quick", function_type: cmd_quick, ability_id: 3696 }),
  Function.ability({ id_: 398, name: "Research_ProtossShieldsLevel1_quick", function_type: cmd_quick, ability_id: 1068, general_id: 3696 }),
  Function.ability({ id_: 399, name: "Research_ProtossShieldsLevel2_quick", function_type: cmd_quick, ability_id: 1069, general_id: 3696 }),
  Function.ability({ id_: 400, name: "Research_ProtossShieldsLevel3_quick", function_type: cmd_quick, ability_id: 1070, general_id: 3696 }),
  Function.ability({ id_: 401, name: "Research_PsiStorm_quick", function_type: cmd_quick, ability_id: 1126 }),
  Function.ability({ id_: 402, name: "Research_RavenCorvidReactor_quick", function_type: cmd_quick, ability_id: 793 }),
  Function.ability({ id_: 403, name: "Research_RavenRecalibratedExplosives_quick", function_type: cmd_quick, ability_id: 803 }),
  Function.ability({ id_: 404, name: "Research_ShadowStrike_quick", function_type: cmd_quick, ability_id: 2720 }),
  Function.ability({ id_: 373, name: "Research_SmartServos_quick", function_type: cmd_quick, ability_id: 766 }),
  Function.ability({ id_: 405, name: "Research_Stimpack_quick", function_type: cmd_quick, ability_id: 730 }),
  Function.ability({ id_: 406, name: "Research_TerranInfantryArmor_quick", function_type: cmd_quick, ability_id: 3697 }),
  Function.ability({ id_: 407, name: "Research_TerranInfantryArmorLevel1_quick", function_type: cmd_quick, ability_id: 656, general_id: 3697 }),
  Function.ability({ id_: 408, name: "Research_TerranInfantryArmorLevel2_quick", function_type: cmd_quick, ability_id: 657, general_id: 3697 }),
  Function.ability({ id_: 409, name: "Research_TerranInfantryArmorLevel3_quick", function_type: cmd_quick, ability_id: 658, general_id: 3697 }),
  Function.ability({ id_: 410, name: "Research_TerranInfantryWeapons_quick", function_type: cmd_quick, ability_id: 3698 }),
  Function.ability({ id_: 411, name: "Research_TerranInfantryWeaponsLevel1_quick", function_type: cmd_quick, ability_id: 652, general_id: 3698 }),
  Function.ability({ id_: 412, name: "Research_TerranInfantryWeaponsLevel2_quick", function_type: cmd_quick, ability_id: 653, general_id: 3698 }),
  Function.ability({ id_: 413, name: "Research_TerranInfantryWeaponsLevel3_quick", function_type: cmd_quick, ability_id: 654, general_id: 3698 }),
  Function.ability({ id_: 414, name: "Research_TerranShipWeapons_quick", function_type: cmd_quick, ability_id: 3699 }),
  Function.ability({ id_: 415, name: "Research_TerranShipWeaponsLevel1_quick", function_type: cmd_quick, ability_id: 861, general_id: 3699 }),
  Function.ability({ id_: 416, name: "Research_TerranShipWeaponsLevel2_quick", function_type: cmd_quick, ability_id: 862, general_id: 3699 }),
  Function.ability({ id_: 417, name: "Research_TerranShipWeaponsLevel3_quick", function_type: cmd_quick, ability_id: 863, general_id: 3699 }),
  Function.ability({ id_: 418, name: "Research_TerranStructureArmorUpgrade_quick", function_type: cmd_quick, ability_id: 651 }),
  Function.ability({ id_: 419, name: "Research_TerranVehicleAndShipPlating_quick", function_type: cmd_quick, ability_id: 3700 }),
  Function.ability({ id_: 420, name: "Research_TerranVehicleAndShipPlatingLevel1_quick", function_type: cmd_quick, ability_id: 864, general_id: 3700 }),
  Function.ability({ id_: 421, name: "Research_TerranVehicleAndShipPlatingLevel2_quick", function_type: cmd_quick, ability_id: 865, general_id: 3700 }),
  Function.ability({ id_: 422, name: "Research_TerranVehicleAndShipPlatingLevel3_quick", function_type: cmd_quick, ability_id: 866, general_id: 3700 }),
  Function.ability({ id_: 423, name: "Research_TerranVehicleWeapons_quick", function_type: cmd_quick, ability_id: 3701 }),
  Function.ability({ id_: 424, name: "Research_TerranVehicleWeaponsLevel1_quick", function_type: cmd_quick, ability_id: 855, general_id:3701 }),
  Function.ability({ id_: 425, name: "Research_TerranVehicleWeaponsLevel2_quick", function_type: cmd_quick, ability_id: 856, general_id:3701 }),
  Function.ability({ id_: 426, name: "Research_TerranVehicleWeaponsLevel3_quick", function_type: cmd_quick, ability_id: 857, general_id:3701 }),
  Function.ability({ id_: 427, name: "Research_TunnelingClaws_quick", function_type: cmd_quick, ability_id: 217 }),
  Function.ability({ id_: 428, name: "Research_WarpGate_quick", function_type: cmd_quick, ability_id: 1568 }),
  Function.ability({ id_: 429, name: "Research_ZergFlyerArmor_quick", function_type: cmd_quick, ability_id: 3702 }),
  Function.ability({ id_: 430, name: "Research_ZergFlyerArmorLevel1_quick", function_type: cmd_quick, ability_id: 1315, general_id: 3702 }),
  Function.ability({ id_: 431, name: "Research_ZergFlyerArmorLevel2_quick", function_type: cmd_quick, ability_id: 1316, general_id: 3702 }),
  Function.ability({ id_: 432, name: "Research_ZergFlyerArmorLevel3_quick", function_type: cmd_quick, ability_id: 1317, general_id: 3702 }),
  Function.ability({ id_: 433, name: "Research_ZergFlyerAttack_quick", function_type: cmd_quick, ability_id: 3703 }),
  Function.ability({ id_: 434, name: "Research_ZergFlyerAttackLevel1_quick", function_type: cmd_quick, ability_id: 1312, general_id: 3703 }),
  Function.ability({ id_: 435, name: "Research_ZergFlyerAttackLevel2_quick", function_type: cmd_quick, ability_id: 1313, general_id: 3703 }),
  Function.ability({ id_: 436, name: "Research_ZergFlyerAttackLevel3_quick", function_type: cmd_quick, ability_id: 1314, general_id: 3703 }),
  Function.ability({ id_: 437, name: "Research_ZergGroundArmor_quick", function_type: cmd_quick, ability_id: 3704 }),
  Function.ability({ id_: 438, name: "Research_ZergGroundArmorLevel1_quick", function_type: cmd_quick, ability_id: 1189, general_id: 3704 }),
  Function.ability({ id_: 439, name: "Research_ZergGroundArmorLevel2_quick", function_type: cmd_quick, ability_id: 1190, general_id: 3704 }),
  Function.ability({ id_: 440, name: "Research_ZergGroundArmorLevel3_quick", function_type: cmd_quick, ability_id: 1191, general_id: 3704 }),
  Function.ability({ id_: 441, name: "Research_ZergMeleeWeapons_quick", function_type: cmd_quick, ability_id: 3705 }),
  Function.ability({ id_: 442, name: "Research_ZergMeleeWeaponsLevel1_quick", function_type: cmd_quick, ability_id: 1186, general_id: 3705 }),
  Function.ability({ id_: 443, name: "Research_ZergMeleeWeaponsLevel2_quick", function_type: cmd_quick, ability_id: 1187, general_id: 3705 }),
  Function.ability({ id_: 444, name: "Research_ZergMeleeWeaponsLevel3_quick", function_type: cmd_quick, ability_id: 1188, general_id: 3705 }),
  Function.ability({ id_: 445, name: "Research_ZergMissileWeapons_quick", function_type: cmd_quick, ability_id: 3706 }),
  Function.ability({ id_: 446, name: "Research_ZergMissileWeaponsLevel1_quick", function_type: cmd_quick, ability_id: 1192, general_id: 3706 }),
  Function.ability({ id_: 447, name: "Research_ZergMissileWeaponsLevel2_quick", function_type: cmd_quick, ability_id: 1193, general_id: 3706 }),
  Function.ability({ id_: 448, name: "Research_ZergMissileWeaponsLevel3_quick", function_type: cmd_quick, ability_id: 1194, general_id: 3706 }),
  Function.ability({ id_: 449, name: "Research_ZerglingAdrenalGlands_quick", function_type: cmd_quick, ability_id: 1252 }),
  Function.ability({ id_: 450, name: "Research_ZerglingMetabolicBoost_quick", function_type: cmd_quick, ability_id: 1253 }),
  Function.ability({ id_: 451, name: "Smart_screen", function_type: cmd_screen, ability_id: 1 }),
  Function.ability({ id_: 452, name: "Smart_minimap", function_type: cmd_minimap, ability_id: 1 }),
  Function.ability({ id_: 453, name: "Stop_quick", function_type: cmd_quick, ability_id: 3665 }),
  Function.ability({ id_: 571, name: "Stop_Battlecruiser_quick", function_type: cmd_quick, ability_id: 3783, general_id: 3665 }),
  Function.ability({ id_: 454, name: "Stop_Building_quick", function_type: cmd_quick, ability_id: 2057, general_id: 3665 }),
  Function.ability({ id_: 455, name: "Stop_Redirect_quick", function_type: cmd_quick, ability_id: 1691, general_id: 3665 }),
  Function.ability({ id_: 456, name: "Stop_Stop_quick", function_type: cmd_quick, ability_id: 4, general_id: 3665 }),
  Function.ability({ id_: 457, name: "Train_Adept_quick", function_type: cmd_quick, ability_id: 922 }),
  Function.ability({ id_: 458, name: "Train_Baneling_quick", function_type: cmd_quick, ability_id: 80 }),
  Function.ability({ id_: 459, name: "Train_Banshee_quick", function_type: cmd_quick, ability_id: 621 }),
  Function.ability({ id_: 460, name: "Train_Battlecruiser_quick", function_type: cmd_quick, ability_id: 623 }),
  Function.ability({ id_: 461, name: "Train_Carrier_quick", function_type: cmd_quick, ability_id: 948 }),
  Function.ability({ id_: 462, name: "Train_Colossus_quick", function_type: cmd_quick, ability_id: 978 }),
  Function.ability({ id_: 463, name: "Train_Corruptor_quick", function_type: cmd_quick, ability_id: 1353 }),
  Function.ability({ id_: 464, name: "Train_Cyclone_quick", function_type: cmd_quick, ability_id: 597 }),
  Function.ability({ id_: 465, name: "Train_DarkTemplar_quick", function_type: cmd_quick, ability_id: 920 }),
  Function.ability({ id_: 466, name: "Train_Disruptor_quick", function_type: cmd_quick, ability_id: 994 }),
  Function.ability({ id_: 467, name: "Train_Drone_quick", function_type: cmd_quick, ability_id: 1342 }),
  Function.ability({ id_: 468, name: "Train_Ghost_quick", function_type: cmd_quick, ability_id: 562 }),
  Function.ability({ id_: 469, name: "Train_Hellbat_quick", function_type: cmd_quick, ability_id: 596 }),
  Function.ability({ id_: 470, name: "Train_Hellion_quick", function_type: cmd_quick, ability_id: 595 }),
  Function.ability({ id_: 471, name: "Train_HighTemplar_quick", function_type: cmd_quick, ability_id: 919 }),
  Function.ability({ id_: 472, name: "Train_Hydralisk_quick", function_type: cmd_quick, ability_id: 1345 }),
  Function.ability({ id_: 473, name: "Train_Immortal_quick", function_type: cmd_quick, ability_id: 979 }),
  Function.ability({ id_: 474, name: "Train_Infestor_quick", function_type: cmd_quick, ability_id: 1352 }),
  Function.ability({ id_: 475, name: "Train_Liberator_quick", function_type: cmd_quick, ability_id: 626 }),
  Function.ability({ id_: 476, name: "Train_Marauder_quick", function_type: cmd_quick, ability_id: 563 }),
  Function.ability({ id_: 477, name: "Train_Marine_quick", function_type: cmd_quick, ability_id: 560 }),
  Function.ability({ id_: 478, name: "Train_Medivac_quick", function_type: cmd_quick, ability_id: 620 }),
  Function.ability({ id_: 541, name: "Train_Mothership_quick", function_type: cmd_quick, ability_id: 110 }),
  Function.ability({ id_: 479, name: "Train_MothershipCore_quick", function_type: cmd_quick, ability_id: 1853 }),
  Function.ability({ id_: 480, name: "Train_Mutalisk_quick", function_type: cmd_quick, ability_id: 1346 }),
  Function.ability({ id_: 481, name: "Train_Observer_quick", function_type: cmd_quick, ability_id: 977 }),
  Function.ability({ id_: 482, name: "Train_Oracle_quick", function_type: cmd_quick, ability_id: 954 }),
  Function.ability({ id_: 483, name: "Train_Overlord_quick", function_type: cmd_quick, ability_id: 1344 }),
  Function.ability({ id_: 484, name: "Train_Phoenix_quick", function_type: cmd_quick, ability_id: 946 }),
  Function.ability({ id_: 485, name: "Train_Probe_quick", function_type: cmd_quick, ability_id: 1006 }),
  Function.ability({ id_: 486, name: "Train_Queen_quick", function_type: cmd_quick, ability_id: 1632 }),
  Function.ability({ id_: 487, name: "Train_Raven_quick", function_type: cmd_quick, ability_id: 622 }),
  Function.ability({ id_: 488, name: "Train_Reaper_quick", function_type: cmd_quick, ability_id: 561 }),
  Function.ability({ id_: 489, name: "Train_Roach_quick", function_type: cmd_quick, ability_id: 1351 }),
  Function.ability({ id_: 490, name: "Train_SCV_quick", function_type: cmd_quick, ability_id: 524 }),
  Function.ability({ id_: 491, name: "Train_Sentry_quick", function_type: cmd_quick, ability_id: 921 }),
  Function.ability({ id_: 492, name: "Train_SiegeTank_quick", function_type: cmd_quick, ability_id: 591 }),
  Function.ability({ id_: 493, name: "Train_Stalker_quick", function_type: cmd_quick, ability_id: 917 }),
  Function.ability({ id_: 494, name: "Train_SwarmHost_quick", function_type: cmd_quick, ability_id: 1356 }),
  Function.ability({ id_: 495, name: "Train_Tempest_quick", function_type: cmd_quick, ability_id: 955 }),
  Function.ability({ id_: 496, name: "Train_Thor_quick", function_type: cmd_quick, ability_id: 594 }),
  Function.ability({ id_: 497, name: "Train_Ultralisk_quick", function_type: cmd_quick, ability_id: 1348 }),
  Function.ability({ id_: 498, name: "Train_VikingFighter_quick", function_type: cmd_quick, ability_id: 624 }),
  Function.ability({ id_: 499, name: "Train_Viper_quick", function_type: cmd_quick, ability_id: 1354 }),
  Function.ability({ id_: 500, name: "Train_VoidRay_quick", function_type: cmd_quick, ability_id: 950 }),
  Function.ability({ id_: 501, name: "Train_WarpPrism_quick", function_type: cmd_quick, ability_id: 976 }),
  Function.ability({ id_: 502, name: "Train_WidowMine_quick", function_type: cmd_quick, ability_id: 614 }),
  Function.ability({ id_: 503, name: "Train_Zealot_quick", function_type: cmd_quick, ability_id: 916 }),
  Function.ability({ id_: 504, name: "Train_Zergling_quick", function_type: cmd_quick, ability_id: 1343 }),
  Function.ability({ id_: 505, name: "TrainWarp_Adept_screen", function_type: cmd_screen, ability_id: 1419 }),
  Function.ability({ id_: 506, name: "TrainWarp_DarkTemplar_screen", function_type: cmd_screen, ability_id: 1417 }),
  Function.ability({ id_: 507, name: "TrainWarp_HighTemplar_screen", function_type: cmd_screen, ability_id: 1416 }),
  Function.ability({ id_: 508, name: "TrainWarp_Sentry_screen", function_type: cmd_screen, ability_id: 1418 }),
  Function.ability({ id_: 509, name: "TrainWarp_Stalker_screen", function_type: cmd_screen, ability_id: 1414 }),
  Function.ability({ id_: 510, name: "TrainWarp_Zealot_screen", function_type: cmd_screen, ability_id: 1413 }),
  Function.ability({ id_: 511, name: "UnloadAll_quick", function_type: cmd_quick, ability_id: 3664 }),
  Function.ability({ id_: 512, name: "UnloadAll_Bunker_quick", function_type: cmd_quick, ability_id: 408, general_id: 3664 }),
  Function.ability({ id_: 513, name: "UnloadAll_CommandCenter_quick", function_type: cmd_quick, ability_id: 413, general_id: 3664 }),
  Function.ability({ id_: 514, name: "UnloadAll_NydusNetwork_quick", function_type: cmd_quick, ability_id: 1438, general_id: 3664 }),
  Function.ability({ id_: 515, name: "UnloadAll_NydusWorm_quick", function_type: cmd_quick, ability_id: 2371, general_id: 3664 }),
  Function.ability({ id_: 516, name: "UnloadAllAt_screen", function_type: cmd_screen, ability_id: 3669 }),
  Function.ability({ id_: 517, name: "UnloadAllAt_minimap", function_type: cmd_minimap, ability_id: 3669 }),
  Function.ability({ id_: 518, name: "UnloadAllAt_Medivac_screen", function_type: cmd_screen, ability_id: 396, general_id: 3669 }),
  Function.ability({ id_: 519, name: "UnloadAllAt_Medivac_minimap", function_type: cmd_minimap, ability_id: 396, general_id: 3669 }),
  Function.ability({ id_: 520, name: "UnloadAllAt_Overlord_screen", function_type: cmd_screen, ability_id: 1408, general_id: 3669 }),
  Function.ability({ id_: 521, name: "UnloadAllAt_Overlord_minimap", function_type: cmd_minimap, ability_id: 1408, general_id: 3669 }),
  Function.ability({ id_: 522, name: "UnloadAllAt_WarpPrism_screen", function_type: cmd_screen, ability_id: 913, general_id: 3669 }),
  Function.ability({ id_: 523, name: "UnloadAllAt_WarpPrism_minimap", function_type: cmd_minimap, ability_id: 913, general_id: 3669 }),
]

let tempDict = {}
// Create an IntEnum of the function names/ids so that printing the id will
// show something useful.
_FUNCTIONS.forEach((f) => {
  tempDict[f.name] = f.id
})
_Functions = new Enum(tempDict)
_FUNCTIONS.map((f) => {
  return f._replace({ id: _Functions[f.id]})
})
_FUNCTIONS = [f._replace(id=_Functions(f.id)) for f in _FUNCTIONS]
FUNCTIONS = new Functions(_FUNCTIONS)

// Some indexes to support features.py and action conversion.
ABILITY_IDS = p_collections.defaultdict(set)  // {ability_id: {funcs}}
for _func in FUNCTIONS:
  if _func.ability_id >= 0:
    ABILITY_IDS[_func.ability_id].add(_func)
ABILITY_IDS = {k: frozenset(v) for k, v in six.iteritems(ABILITY_IDS)}
FUNCTIONS_AVAILABLE = {f.id: f for f in FUNCTIONS if f.avail_fn}

tempDict = {}
// Create an IntEnum of the function names/ids so that printing the id will
// show something useful.
_RAW_FUNCTIONS.forEach
_Raw_Functions = enum.IntEnum(  
    "_Raw_Functions", {f.name: f.id for f in _RAW_FUNCTIONS})
_RAW_FUNCTIONS = [f._replace(id=_Raw_Functions(f.id)) for f in _RAW_FUNCTIONS]
RAW_FUNCTIONS = Functions(_RAW_FUNCTIONS)

// Some indexes to support features.py and action conversion.
RAW_ABILITY_IDS = p_collections.defaultdict(set)  // {ability_id: {funcs}}
for _func in RAW_FUNCTIONS:
  if _func.ability_id >= 0:
    RAW_ABILITY_IDS[_func.ability_id].add(_func)
RAW_ABILITY_IDS = {k: frozenset(v) for k, v in six.iteritems(RAW_ABILITY_IDS)}
RAW_FUNCTIONS_AVAILABLE = {f.id: f for f in RAW_FUNCTIONS if f.avail_fn}
RAW_ABILITY_ID_TO_FUNC_ID = {k: min(f.id for f in v)  
                             for k, v in six.iteritems(RAW_ABILITY_IDS)}