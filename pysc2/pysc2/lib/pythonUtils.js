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
    return container.__iter__
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

function zip() { //eslint-diable-next-line
  var args = [].slice.call(arguments);
  var shortest = args.length === 0 ? [] : args.reduce(function(a, b) {
    return a.length < b.length ? a : b
  });

  return shortest.map(function(_, i) {
    return args.map(function(array) { return array[i] })
  });
}

class DefaultDict {
  constructor(defaultInit) {
    return new Proxy({}, {
      get: (target, name) => name in target ?
        target[name] :
        (target[name] = typeof defaultInit === 'function' ?
          new defaultInit().valueOf() :
          defaultInit)
    })
  }
}

export default {
  DefaultDict, eq, iter, isinstance, isObject, len, zip
}
