var appendChain = function(oChain, oProto) {
  if (arguments.length < 2) { 
    throw new TypeError('Object.appendChain - Not enough arguments');
  }
  if (typeof oProto !== 'object' && typeof oProto !== 'string') {
    throw new TypeError('second argument to Object.appendChain must be an object or a string');
  }

  var oNewProto = oProto,
      oReturn = o2nd = oLast = oChain instanceof this ? oChain : new oChain.constructor(oChain);

  for (var o1st = this.getPrototypeOf(o2nd);
    o1st !== Object.prototype && o1st !== Function.prototype;
    o1st = this.getPrototypeOf(o2nd)
  ) {
    o2nd = o1st;
  }

  if (oProto.constructor === String) {
    oNewProto = Function.prototype;
    oReturn = Function.apply(null, Array.prototype.slice.call(arguments, 1));
    this.setPrototypeOf(oReturn, oLast);
  }

  this.setPrototypeOf(o2nd, oNewProto);
  return oReturn;
}

appendChain = appendChain.bind(Object)
Object.appendChain = appendChain

function passInVals(str, valsDict) {
  const keys = Object.keys(valsDict)
  let varsStr = ''
  keys.forEach((key) => {
    varsStr += `var ${key} = ${JSON.stringify(valsDict[key])};`
  })
  return varsStr + str
}


class EnumBase {
  constructor(keys) {
    this.keys = keys
    this.toArray = this.toArray.bind(this)
    this.has = this.has.bind(this)
  }
  toArray() {
    const result = []
    for (let i = 0; i < this.keys.length; i++) {
      result.push(this[this.keys[i]])
    }
    return result
  }
  has(key) {
    return this.hasOwnProperty(key)
  }
}

function getUserIntClassStr(name) {
  return `
    ${name}.${name} = class ${name} extends Number {
      constructor(key, val) {
        if (!values.hasOwnProperty(val)) {
          throw new Error('ValueError: ', val, ' is not a valid ', name)
        }
        super(val)
        this.val = val
        this.key = key
      }
      get value() {
        return this.val
      }
      toString() {
        return '${name}.' + this.key + ': ' + this.val
      }
    };
  `
}

function getUserClassStr(name) {
  return `
    ${name}.${name} = class ${name} {
      constructor(key, val) {
        if (!values.hasOwnProperty(val)) {
          throw new Error('ValueError: ', val, ' is not a valid ', name)
        }
        this.val = val
        this.key = key
      }
      get value() {
        return this.val
      }
      toString() {
        return '${name}.' + this.key + ': ' + this.val
      }
    };
  `
}
var globalRef = {}

function getDict({ dict, keys, start = 1, seperator }) {
  const usedDict = {}
  const values = {}
  let test
  // STRING
  if (typeof(dict) === 'string') {
    if (seperator) {
      test = dict.split(seperator)
    }
    if (!seperator) {
      test = dict.split(',')
    }
    if (test.length === 1 && !seperator) {
      test = dict.split(' ')
    }
    test.forEach((key, index) => {
      const usedKey = key.trim()
      if (!usedKey) {
        return
      }
      values[index + start] = usedKey
      usedDict[usedKey] = index + start
    })
    return { dict: usedDict, values }
  }
  const usedKeys = keys || Object.keys(dict)
  // ARRAY
  if (Array.isArray(dict)) {
    usedKeys.forEach((key, index) => {
      usedDict[dict[key]] = index + start
      values[index + start] = dict[key]
    })
    return { dict: usedDict, values }
  }
  // OBJECT
  usedKeys.forEach((key) => {
    const val = dict[key]
    usedDict[key] = val
    values[val] = key
  })
  return  { dict: usedDict, values }
}
// getDict({ dict: 'hey, how, are, you,', seperator: ', ' })
// getDict({ dict: { a: 1, b: 2, c: 3 }})
// getDict({ dict: ['a', 'b', 'c'] })

function getUserEnum(name, userDict, templateFunc, start, seperator, globalRef) {
  keys = Object.keys(userDict)
  const { dict, values } = getDict({ dict: userDict, keys })
  keys = Object.keys(dict)
  globalRef.dict = dict
  globalRef.keys = keys
  globalRef.values = values
  let str = `
  var globalRef = ${JSON.stringify(globalRef)};
  var dict = globalRef.dict;
  var keys = globalRef.keys;
  var values = globalRef.values;
  var ${name} = new EnumBase(keys);
  `
  str += templateFunc(name)
  str += `var val = dict[keys[${0}]]
  ${name}[keys[${0}]] = new ${name}.${name}(keys[${0}], val);
  ${name}[val] = ${name}[keys[${0}]]
  Object.appendChain(${name}[keys[${0}]], ${name});
  `
  for (let i = 1; i < keys.length; i++) {
    str += `
    val = dict[keys[${i}]]
    ${name}[keys[${i}]] = new ${name}.${name}(keys[${i}], val);
    ${name}[val] = ${name}[keys[${i}]]
    `
  }
  str += `
  result = function (val) {
    if (!values.hasOwnProperty(val)) {
      throw new Error('ValueError: ', val, ' is not a valid ', name)
    }
    return ${name}[values[val]];
  }
  Object.appendChain(result, ${name})
  return result
  `
  const result = new Function(`${str}`)();
  return Object.freeze(result)
}

function IntEnum(name, dict, options = { seperator: null, start: 1 }) {
  const globalRef = { test: true}
  const { start, seperator } = options
  return getUserEnum(name, dict, getUserIntClassStr, start, seperator, globalRef)
}
function Enum(name, dict,  options = { seperator: null, start: 1 }) {
  const globalRef = { test: true }
  const { start, seperator } = options
  return getUserEnum(name, dict, getUserClassStr, start, seperator, globalRef)
}

// var test = IntEnum('test', { boo: 1, foo: 2 })

var package = Enum
package.Enum = Enum
package.IntEnum = IntEnum

if (typeof define === 'function' && define.amd) {
    define(function () {
        return package
    })
}
else if (typeof module === 'object' && module.exports) {
    module.exports = package
    module.default = package
}
else {
    this.Enum = package;
}

Animal = Enum('Animal', 'ANT BEE CAT DOG')
IntAnimal = Enum.IntEnum('IntAnimal','ANT BEE CAT DOG')