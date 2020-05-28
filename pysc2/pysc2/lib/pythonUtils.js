const s2clientprotocol = require('s2clientprotocol') //eslint-disable-line

const { common_pb, raw_pb, spatial_pb, ui_pb } = s2clientprotocol

class ABCMeta {
  static get abstractMethods() { return [] }

  constructor() {
    const abstractMethods = this.constructor.abstractMethods
    function NotImplementedError(message) {
      this.name = "NotImplementedError"
      this.message = (message || "")
    }
    NotImplementedError.prototype = Error.prototype
    Object.keys(abstractMethods).forEach((key) => {
      const methodName = abstractMethods[key]
      /* keeping this comment for inheritance blocking in the future */
      // if (!this.constructor.prototype.hasOwnProperty(methodName) || typeof this.constructor.prototype[methodName] !== 'function') {
      //   throw new NotImplementedError(methodName)
      // }
      if (typeof this.constructor.prototype[methodName] !== 'function') {
        throw new NotImplementedError(methodName)
      }
    })
  }
}

function assert(cond, errMsg) {
  if (cond === false) {
    throw new Error(errMsg)
  }
}


//eslint-disable-next-line
Array.prototype.extend = function(array) {
  for (let i = 0; i < array.length; i++) {
    this.push(array[i])
  }
}

class DefaultDict {
  constructor(DefaultInit) {
    return new Proxy({}, {
      //eslint-disable-next-line
      get: (target, name) => {
        if (name in target) {
          return target[name]
        }
        if (typeof DefaultInit === 'function') {
          target[name] = new DefaultInit().valueOf()
        } else {
          target[name] = DefaultInit
        }
        return target[name]
      },
    })
  }
}

function eq(a, b) {
  if (a.__eq__) {
    return a.__eq__(b)
  }
  if (b.__eq__) {
    return b.__eq__(a)
  }
  return a === b
}

function getArgNames(func) {
  // First match everything inside the function argument parens.
  const args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1]

  // Split the arguments string into an array comma delimited.
  return args.split(',').map(function(arg) {
    // Ensure no inline comments are parsed and trim the whitespace.
    return arg.replace(/\/\*.*\*\//, '').trim()
  }).filter(function(arg) {
    // Ensure no undefined values are added.
    return arg
  })
}
function getArgsArray(func, kwargs) {
  if (getArgsArray.argSignatures[func.name]) {
    return getArgsArray.argSignatures[func.name].map((argName) => kwargs[argName])
  }
  getArgsArray.argSignatures[func.name] = getArgNames(func)
  return getArgsArray.argSignatures[func.name].map((argName) => kwargs[argName])
}
getArgsArray.argSignatures = {}
getArgsArray.getArgNames = getArgNames

function iter(container) {
  if (container.__iter__) {
    return container.__iter__()
  }
  if (len(container)) { //eslint-disable-line
    return Object.keys(container).map((key) => container[key])
  }
  throw new Error('ValueError: Cannont iterate over non-iterable')
}

//eslint-disable-next-line
String.prototype.splitlines = function() {
  return this.split(/\r?\n/)
}
//eslint-disable-next-line
String.prototype.ljust = function(length, char = ' ') {
  const fill = [];
  while (fill.length + this.length < length) {
    fill[fill.length] = char;
  }
  return fill.join('') + this;
}
//eslint-disable-next-line
String.prototype.rjust = function(length, char = ' ') {
  const fill = [];
  while (fill.length + this.length < length) {
    fill[fill.length] = char;
  }
  return this + fill.join('');
}
function isinstance(a, compare) {
  const keys = Object.keys(compare);
  if (Array.isArray(compare) && keys.length) {
    for (let i = 0; i < keys.length; i++) {
      if (isinstance(a, compare[keys[i]])) {
        return true
      }
    }
    return false
  }
  if (compare === Number) {
    return Number(a) === a
  }
  if (compare === Boolean) {
    return Boolean(a) === a
  }
  if (compare === String) {
    return String(a) === a
  }
  return a instanceof compare;
}

function isObject(a) {
  return a === Object(a)
}

function len(container) {
  if (container.__len__) {
    return container.__len__()
  }
  return Object.keys(container).length;
}

function map(func, collection) {
  function clone(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    const copy = obj.constructor();
    for (let attr in obj) {//eslint-disable-line
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = obj[attr];
      }
    }
    return copy;
  }
  const copy = clone(collection)
  Object.keys(copy).forEach((key) => {
    collection[key] = func(collection[key])
  })
}

function randomUniform(min, max) {
  return Math.random() * (max - min) + min;
}
randomUniform.int = function (min, max) {
  return Math.round(randomUniform(min, max))
}
function setUpProtoAction(action, name) {
  if (name === 'no_op') {
    return action
  }
  if (name === 'move_camera') {
    const actionSpatial = new spatial_pb.ActionSpatial()
    const camMove = new spatial_pb.ActionSpatialCameraMove()
    camMove.setCenterMinimap(new common_pb.PointI())
    actionSpatial.setCameraMove(camMove)
    action.setActionFeatureLayer(actionSpatial)
    action.setActionRender(actionSpatial)
    return action
  }
  if (name === 'select_point') {
    const actionSpatial = new spatial_pb.ActionSpatial()
    const unitSelectionPoint = new spatial_pb.ActionSpatialUnitSelectionPoint()
    unitSelectionPoint.setSelectionScreenCoord(new common_pb.PointI())
    actionSpatial.setUnitSelectionPoint(unitSelectionPoint)
    action.setActionFeatureLayer(actionSpatial)
    action.setActionRender(actionSpatial)
    return action
  }
  if (name === 'select_rect') {
    const actionSpatial = new spatial_pb.ActionSpatial()
    const unitSelectionRect = new spatial_pb.ActionSpatialUnitSelectionRect()
    // unitSelectionRect.addSelectionScreenCoord(new common_pb.RectangleI())
    actionSpatial.setUnitSelectionRect(unitSelectionRect)
    action.setActionFeatureLayer(actionSpatial)
    action.setActionRender(actionSpatial)
    return action
  }
  if (name === 'select_idle_worker') {
    const actionUI = new ui_pb.ActionUI()
    const selectIdleWorker = new ui_pb.ActionSelectIdleWorker()
    actionUI.setSelectIdleWorker(selectIdleWorker)
    action.setActionUi(actionUI)
    return action
  }
  if (name === 'select_army') {
    const actionUI = new ui_pb.ActionUI()
    const selectArmy = new ui_pb.ActionSelectArmy()
    actionUI.setSelectArmy(selectArmy)
    action.setActionUi(actionUI)
    return action
  }
  if (name === 'select_warp_gates') {
    const actionUI = new ui_pb.ActionUI()
    const selectWarpGates = new ui_pb.ActionSelectWarpGates()
    actionUI.setSelectWarpGates(selectWarpGates)
    action.setActionUi(actionUI)
    return action
  }
  if (name === 'select_larva') {
    const actionUI = new ui_pb.ActionUI()
    // const selectLarva = new ui_pb.ActionSelectLarva()
    // actionUI.setSelectLarva(selectLarva)
    action.setActionUi(actionUI)
    return action
  }
  if (name === 'select_unit') {
    const actionUI = new ui_pb.ActionUI()
    const multiPanel = new ui_pb.ActionMultiPanel()
    actionUI.setMultiPanel(multiPanel)
    action.setActionUi(actionUI)
    return action
  }
  if (name === 'select_control_group' || name === 'control_group') {
    const actionUI = new ui_pb.ActionUI()
    const controlGroup = new ui_pb.ActionControlGroup()
    actionUI.setControlGroup(controlGroup)
    action.setActionUi(actionUI)
    return action
  }
  if (name === 'unload') {
    const actionUI = new ui_pb.ActionUI()
    const cargoPanel = new ui_pb.ActionCargoPanelUnload()
    actionUI.setCargoPanel(cargoPanel)
    action.setActionUi(actionUI)
    return action
  }
  if (name === 'build_queue') {
    const actionUI = new ui_pb.ActionUI()
    const productionPanel = new ui_pb.ActionProductionPanelRemoveFromQueue()
    actionUI.setProductionPanel(productionPanel)
    action.setActionUi(actionUI)
    return action
  }
  if (name === 'cmd_quick') {
    const unitCommand = new spatial_pb.ActionSpatialUnitCommand()
    const actionSpatial = new spatial_pb.ActionSpatial()
    actionSpatial.setUnitCommand(unitCommand)
    action.setActionFeatureLayer(actionSpatial)
    action.setActionRender(actionSpatial)
    return action
  }
  if (name === 'cmd_screen') {
    const unitCommand = new spatial_pb.ActionSpatialUnitCommand()
    unitCommand.setTargetScreenCoord(new common_pb.PointI())
    const actionSpatial = new spatial_pb.ActionSpatial()
    actionSpatial.setUnitCommand(unitCommand)
    action.setActionFeatureLayer(actionSpatial)
    action.setActionRender(actionSpatial)
    return action
  }
  if (name === 'cmd_minimap') {
    const unitCommand = new spatial_pb.ActionSpatialUnitCommand()
    unitCommand.setTargetMinimapCoord(new common_pb.PointI())
    const actionSpatial = new spatial_pb.ActionSpatial()
    actionSpatial.setUnitCommand(unitCommand)
    action.setActionFeatureLayer(actionSpatial)
    action.setActionRender(actionSpatial)
    return action
  }
  if (name === 'autocast') {
    const actionUI = new ui_pb.ActionUI()
    const toggleAutocast = new ui_pb.ActionToggleAutocast()
    actionUI.setToggleAutocast(toggleAutocast)
    action.setActionUi(actionUI)
    return action
  }
  if (name === 'raw_no_op') {
    return action
  }
  if (name === 'raw_move_camera') {
    const actionRaw = new raw_pb.ActionRaw()
    const camMove = new raw_pb.ActionRawCameraMove()
    camMove.setCenterWorldSpace(new common_pb.Point())
    actionRaw.setCameraMove(camMove)
    action.setActionRaw(actionRaw)
    return action
  }
  if (name === 'raw_cmd') {
    const actionRaw = new raw_pb.ActionRaw()
    const unitCommand = new raw_pb.ActionRawUnitCommand()
    actionRaw.setUnitCommand(unitCommand)
    action.setActionRaw(actionRaw)
    return action
  }
  if (name === 'raw_cmd_pt') {
    const actionRaw = new raw_pb.ActionRaw()
    const unitCommand = new raw_pb.ActionRawUnitCommand()
    unitCommand.setTargetWorldSpacePos(new common_pb.Point2D())
    actionRaw.setUnitCommand(unitCommand)
    action.setActionRaw(actionRaw)
    return action
  }
  if (name === 'raw_cmd_unit') {
    const actionRaw = new raw_pb.ActionRaw()
    const unitCommand = new raw_pb.ActionRawUnitCommand()
    actionRaw.setUnitCommand(unitCommand)
    action.setActionRaw(actionRaw)
    return action
  }
  if (name === 'raw_autocast') {
    const actionRaw = new raw_pb.ActionRaw()
    const toggleAutocast = new raw_pb.ActionRawCameraMove()
    actionRaw.setToggleAutocast(toggleAutocast)
    action.setActionRaw(actionRaw)
    return action
  }
}
const snakeToCamel = (str) => str
  .toLowerCase().replace(/([-_][a-z])/g, (group) => group
    .toUpperCase()
    .replace('-', '')
    .replace('_', ''))
function sum(collection) {
  let total = 0
  Object.keys(collection).forEach((key) => {
    total += collection[key]
  })
  return total
}

function snakeToPascal(str) {
  const usedStr = snakeToCamel(str)
  return usedStr[0].toUpperCase() + usedStr.slice(1, usedStr.length)
}

function withPython(withInterface, callback) {
  if (!withInterface.__enter__ || !withInterface.__exit__) {
    throw new Error('ValueError: withInterface must define a __enter__ and __exit__ method')
  }
  let tempResult = withInterface.__enter__()
  tempResult = callback(tempResult)
  withInterface.__exit__()
  return tempResult
}

function int(numOrStr) {
  return Math.floor(numOrStr)
}

/**
 From:
 https://gist.github.com/tregusti/0b37804798a7634bc49c#gistcomment-2193237

 * @summary A error thrown when a method is defined but not implemented (yet).
 * @param {any} message An additional message for the error.
 */
function NotImplementedError(message) {
  ///<summary>The error thrown when the given function isn't implemented.</summary>
  const sender = (new Error) //eslint-disable-line
    .stack
    .split('\n')[2]
    .replace(' at ', '');

  this.message = `The method ${sender} isn't implemented.`;

  // Append the message if given.
  if (message) {
    this.message += ` Message: "${message}".`;
  }

  let str = this.message;

  while (str.indexOf('  ') > -1) {
    str = str.replace('  ', ' ');
  }

  this.message = str;
}

function ValueError(value) {
  /*
  The error thrown when an invalid argument is passed.
  */
  const sender = (new Error) //eslint-disable-line
    .stack
    .split('\n')[2]
    .replace(' at ', '');

  this.message = `The argument from ${sender} is an invalid arugment.`;

  // Append the message if given.
  if (value) {
    this.message += ` Invalid argument: "${value}".`;
  }

  let str = this.message;

  while (str.indexOf('  ') > -1) {
    str = str.replace('  ', ' ');
  }

  this.message = str;
}

function zip() {
  var args = [].slice.call(arguments); //eslint-disable-line
  var shortest = args.length === 0 ? [] : args.reduce(function(a, b) {
    return a.length < b.length ? a : b
  });

  return shortest.map(function(_, i) {
    return args.map(function(array) { return array[i] })
  });
}
// function zip(arrays) {
//   return Array.apply(null,Array(arrays[0].length)).map(function(_, i) { //eslint-disable-line
//     return arrays.map(function(array){ return array[i] }) //eslint-disable-line
//   });
// }

function randomChoice(arr) {
  // This function does not support "size" of output shape.
  if (Array.isArray(arr)) {
    arr = [Array(arr).key()]
  }
  return arr[Math.floor(Math.random() * arr.length)]
}
function nonZero(arr) {
  // This function outputs a array of indices of nonzero elements
  const rows = []
  const cols = []
  const shape = arr.shape
  arr = arr.arraySync()
  for (let row = 0; row < shape[0]; row++) {
    for (let col = 0; col < shape[1]; col++) {
      if (arr[row][col] !== 0) {
        rows.push(row)
        cols.push(col)
      }
    }
  }
  return [rows, cols]
}

function any(iterable) {
  for (var index = 0; index < iterable.length; index++) {
    if (iterable[index]) return true;
  }
  return false;
}

module.exports = {
  ABCMeta,
  any,
  assert,
  Array,
  DefaultDict,
  eq,
  getArgsArray,
  len,
  int,
  iter,
  isinstance,
  isObject,
  map,
  NotImplementedError,
  randomUniform,
  setUpProtoAction,
  String,
  snakeToCamel,
  snakeToPascal,
  sum,
  ValueError,
  withPython,
  zip,
  randomChoice,
  nonZero,
}
