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
  return a instanceof compare;
}
function isObject(a) {
  return a === Object(a)
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
      get: (target, name) => name in target ?
        target[name] :
        (target[name] = typeof defaultInit === 'function' ?
          new DefaultInit().valueOf() :
          DefaultInit)
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

export default {
  DefaultDict, eq, iter, isinstance, isObject, len, withPython, zip, Array, String,
}
