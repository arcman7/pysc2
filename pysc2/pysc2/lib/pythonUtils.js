const os = require('os') //eslint-disable-line
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

function any(iterable) {
  for (let index = 0; index < iterable.length; index++) {
    if (iterable[index]) return true
  }
  return false
}

function arrayCompare(a, b, sameOrder = false) {
  if (sameOrder) {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
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

function expanduser(path) {
  const homedir = os.homedir()
  path = path.replace(/~user/g, homedir)
  path = path.replace(/~/g, homedir)
  path = path.replace(/\\/g, '/')
  return path
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
function getattr(proto, key) {
  if (!proto[`get${snakeToPascal(key)}`]) {
    return
  }
  return proto[`get${snakeToPascal(key)}`]()
}
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
  return this + fill.join('');
}
//eslint-disable-next-line
String.prototype.rjust = function(length, char = ' ') {
  const fill = [];
  while (fill.length + this.length < length) {
    fill[fill.length] = char;
  }
  return fill.join('') + this;
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
function int(numOrStr) {
  return Math.floor(numOrStr)
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
function namedtuple(name, fields) {
  let consLogic = '';
  let consArgs = '';
  fields.forEach((field, i) => {
    consArgs += i < fields.length - 1 ? `${field}, ` : `${field}`;
    consLogic += i < fields.length - 1 ? `this.${field} = ${field};\n    ` : `this.${field} = ${field};`;
  });
  const classStr = `const _fields = ${JSON.stringify(fields)}; return class ${name} extends Array {
  static get classname() { return '${name}' }
  static get _fields() { return ${JSON.stringify(fields)} }
  constructor(${consArgs}) {
    if (typeof arguments[0] === 'object' && arguments.length === 1 && _fields.length > 1) {
      const args = []
      const kwargs = arguments[0]
      _fields.forEach((field, index) => {
        args[index] = kwargs[field]
      })
      super(...args)
      _fields.forEach((field, index) => {
        args[index] = kwargs[field]
        this[field] = kwargs[field]
      })
      return
    }
    super(...arguments)
    ${consLogic}
  }
  static _make(kwargs) {
    return new this.prototype.constructor(kwargs);
  }
  _replace(kwargs) {
    this.constructor._fields.forEach((field) => {
        kwargs[field] = kwargs[field] || this[field];
    });
    return this.constructor._make(kwargs);
  }
  __reduce__() {
    return [this.constructor, this.constructor._fields.map((field) => this[field])];
  }
${fields.map((field, index) => { //eslint-disable-line
    return `  get ${field}() {\n    return this[${index}]\n  }\n  set ${field}(val) {\n    this[${index}] = val; return val\n  }`
  }).join('\n')}
}`;
  return Function(classStr)() //eslint-disable-line
}
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
function randomChoice(arr) {
  // This function does not support "size" of output shape.
  if (Array.isArray(arr)) {
    arr = [Array(arr).key()]
  }
  return arr[Math.floor(Math.random() * arr.length)]
}
function randomSample(arr, size) {
  var shuffled = arr.slice(0)
  let i = arr.length
  let temp
  let index
  while (i--) {
    index = Math.floor((i + 1) * Math.random())
    temp = shuffled[index]
    shuffled[index] = shuffled[i]
    shuffled[i] = temp
  }
  return shuffled.slice(0, size)
}
function randomUniform(min, max) {
  return Math.random() * (max - min) + min
}
randomUniform.int = function (min, max) {
  return Math.round(randomUniform(min, max))
}
async function sequentialTaskQueue(tasks) {
  const results = []
  const reducer = (promiseChain, currentTask) => { //eslint-disable-line
    return promiseChain.then((result) => {
      if (result) {
        results.push(result)
      }
      return currentTask()
    })
  }
  await tasks.reduce(reducer, Promise.resolve())
  return results
}
function setattr(proto, key, value) {
  if (Array.isArray(value) && proto[`set${snakeToPascal(key)}List`]) {
    proto[`set${snakeToPascal(key)}List`](value)
  } else if (proto[`set${snakeToPascal(key)}`]) {
    proto[`set${snakeToPascal(key)}`](value)
  } else {
    console.error(`Failed to find setter method for field "${key}"\n using "set${snakeToPascal(key)}" or "set${snakeToPascal(key)}List"\n on proto:\n`, proto.toObject())
    throw new Error(`Failed to find setter method for field "${key}" on proto.`)
  }
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
const snakeToCamel = (str) => {
  if (!str.match('_')) {
    return str
  }
  return str
    .toLowerCase().replace(/([-_][a-z])/g, (group) => group
      .toUpperCase()
      .replace('-', '')
      .replace('_', ''))
}
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

function unpackbits(uint8data) {
  if (Number.isInteger(uint8data)) {
    uint8data = Uint8Array.from([uint8data])
  }
  if (uint8data instanceof Array) {
    uint8data = Uint8Array.from(uint8data)
  }
  const results = new Uint8Array(8 * uint8data.length)
  let byte
  let offset
  for (let i = 0; i < uint8data.length; i++) {
    byte = uint8data[i]
    offset = (8 * i)
    results[offset + 7] = ((byte & (1 << 0)) >> 0)
    results[offset + 6] = ((byte & (1 << 1)) >> 1)
    results[offset + 5] = ((byte & (1 << 2)) >> 2)
    results[offset + 4] = ((byte & (1 << 3)) >> 3)
    results[offset + 3] = ((byte & (1 << 4)) >> 4)
    results[offset + 2] = ((byte & (1 << 5)) >> 5)
    results[offset + 1] = ((byte & (1 << 6)) >> 6)
    results[offset + 0] = ((byte & (1 << 7)) >> 7)
  }
  return results
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
function withPython(withInterface, callback) {
  if (!withInterface.__enter__ || !withInterface.__exit__) {
    throw new Error('ValueError: withInterface must define a __enter__ and __exit__ method')
  }
  let tempResult = withInterface.__enter__.call(withInterface)
  tempResult = callback(tempResult)
  if (tempResult instanceof Promise) {
    tempResult.then(() => withInterface.__exit__.call(withInterface))
  } else {
    withInterface.__exit__.call(withInterface)
  }
  return tempResult
}
async function withPythonAsync(withInterface, callback) {
  if (!withInterface.__enter__ || !withInterface.__exit__) {
    throw new Error('ValueError: withInterface must define a __enter__ and __exit__ method')
  }
  let tempResult = withInterface.__enter__()
  tempResult = await callback(tempResult)
  withInterface.__exit__()
  return tempResult
}
/**
 From:
 https://gist.github.com/tregusti/0b37804798a7634bc49c#gistcomment-2193237

 * @summary A error thrown when a method is defined but not implemented (yet).
 * @param {any} message An additional message for the error.
 */
function zip() {
  var args = [].slice.call(arguments); //eslint-disable-line
  var shortest = args.length === 0 ? [] : args.reduce(function(a, b) {
    return a.length < b.length ? a : b
  });

  return shortest.map(function(_, i) {
    return args.map(function(array) { return array[i] })
  });
}

module.exports = {
  ABCMeta,
  any,
  arrayCompare,
  assert,
  Array,
  DefaultDict,
  eq,
  expanduser,
  getArgsArray,
  getattr,
  len,
  int,
  iter,
  isinstance,
  isObject,
  map,
  namedtuple,
  NotImplementedError,
  nonZero,
  randomChoice,
  randomSample,
  randomUniform,
  sequentialTaskQueue,
  setattr,
  setUpProtoAction,
  String,
  snakeToCamel,
  snakeToPascal,
  sum,
  unpackbits,
  ValueError,
  withPython,
  withPythonAsync,
  zip,
}
