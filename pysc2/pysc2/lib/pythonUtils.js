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
  if (b.__eq__) {
    return b.__eq__(a)
  }
  return a === b
}

function iter(container) {
  if (container.__iter__) {
    return container.__iter__()
  }
  if (len(container)) {
    return Object.keys(container).map(key => container[key])
  }
  throw new Error('ValueError: Cannont iterate over non-iterable')
}

//eslint-disable-next-line
Array.prototype.extend = function(array) {
  for (let i = 0; i < array.length; i++) {
    this.push(array[i])
  }
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
  if (keys.length) {
    for (let i = 0; i < keys.length; i++) {
      if (a instanceof compare[keys[i]]) {
        return true;
      }
    }
    return false
  }
  if (compare === Number) {
    return Number(a) === a
  }
  return a instanceof compare;
}
function isObject(a) {
  return a === Object(a)
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
function sum(collection) {
  let total = 0
  Object.keys(collection).forEach((key) => {
    total += collection[key]
  })
  return total
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

function withPython(withInterface, callback) {
  if (!withInterface.__enter__ || !withInterface.__exit__) {
    throw new Error('ValueError: withInterface must define a __enter__ and __exit__ method')
  }
  const tempResult = withInterface.__enter__()
  callback(tempResult)
  withInterface.__exit__()
}

function int(numOrStr) {
  return Math.floor(numOrStr)
}

module.exports = {
  Array,
  DefaultDict,
  eq,
  len,
  int,
  iter,
  isinstance,
  isObject,
  map,
  randomUniform,
  String,
  sum,
  withPython,
  zip,
}
