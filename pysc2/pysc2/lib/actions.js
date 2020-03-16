import * as tf from '@tensorflow/tfjs-node'
import all_collections_generated_classes from 'all_collections_generated_classes'
import point from 'point'
import Tuple from 'tuple'

const numpy = {
  array: tf.tensor2d,
}
const bool = Boolean;
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
class Enumeration {
  constructor(obj) {
    for (const key in obj) {
      this[key] = obj[key]
    }
    return Object.freeze(this)
  }
  has = (key) => {
    return this.hasOwnProperty(key)
  }
}
Enum = Enumeration;
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
  select.selection_add = bool(select_add)
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
  if (!isinstance(unit_tags, [Tuple, Array]) {
    unit_tags = [unit_tags]
  }
  action_cmd.unit_tags.extend(unit_tags)
}

function raw_cmd_pt(action, ability_id, queued, unit_tags, world) {
  // Do a raw command to another unit towards a point.// 
  action_cmd = action.action_raw.unit_command
  action_cmd.ability_id = ability_id
  action_cmd.queue_command = queued
  if (!isinstance(unit_tags, [Tuple, Array]) {
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
  if (!isinstance(unit_tags, [Tuple, Array]) {
    unit_tags = [unit_tags]
  }
  action_cmd.unit_tags.extend(unit_tags)
  action_cmd.target_unit_tag = target_unit_tag
}

function raw_autocast(action, ability_id, unit_tags) {
  // Toggle autocast.// 
  action_cmd = action.action_raw.toggle_autocast
  action_cmd.ability_id = ability_id
  if (!isinstance(unit_tags, [Tuple, Array]) {
    unit_tags = [unit_tags]
  }
  action_cmd.unit_tags.extend(unit_tags)
}

function numpy_to_python(val) {
  // Convert numpy types to their corresponding python types.// 
  if (isinstance(val, [int, float])) {
    return val
  if (isinstance(val, String)) {
    return val
  if (isinstance(val, numpy.number) ||
      isinstance(val, numpy.ndarray) && !(val.shape)) {  // numpy.array(1)
    return val.item()
  if (isinstance(val, [Array, Tuple, numpy.ndarray])) {
    const result = [];
    Object.keys(val).forEach((key) => {
      result.push(numpy_to_python(val[key]))
    })
    return result
  }
  throw new Error(`ValueError: Unknown value. Type:${typeof(val)}, repr: ${JSON.stringify(val)}`
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
  @classmethod
  def enum(cls, options, values):
    """Create an ArgumentType where you choose one of a set of known values."""
    names, real = zip(*options)
    del names  # unused

    def factory(i, name):
      return cls(i, name, (len(real),), lambda a: real[a[0]], values, None)
    return factory
  static enum(options, values) {
    // Create an ArgumentType where you choose one of a set of known values.//
    
  }
  static scalar(value) {
    // Create an ArgumentType with a single scalar in range(value).//
  }
  static point() {
    // Create an ArgumentType that is represented by a point.Point.//
  }
  static spec(id_, name, sizes) {
    // Create an ArgumentType to be used in ValidActions.//
  }
  static unit_tags(count, size) {
    // Create an ArgumentType with a list of unbounded ints.//
  }
}