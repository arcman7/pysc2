//Named numpy arrays for easier access to the observation data.

/*
https://docs.scipy.org/doc/numpy/user/basics.rec.html are not enough since they
actually change the type and don't interoperate well with tensorflow.
*/

// import re
const path = require('path')
const Enum = require('python-enum')
const np = require(path.resolve(__dirname, './numpy.js'))
const pythonUtils = require(path.resolve(__dirname, './pythonUtils.js'))

const { isinstance } = pythonUtils
class NamedDict {
  //A dict where you can use `d["element"]` or `d.element`.//
  constructor(kwargs) {
    if (!kwargs) {
      return
    }
    Object.keys(kwargs).forEach((key) => {
      this[key] = kwargs[key]
    })
  }
}

class NamedNumpyArray {// extends np.ndarray:
  /*A subclass of ndarray that lets you give names to indices.

  This is a normal ndarray in the sense that you can always index by numbers and
  slices, though elipses don't work. Also, all elements have the same type,
  unlike a record array.

  Names should be a list of names per dimension in the ndarray shape. The names
  should be a list or tuple of strings, a namedtuple class (with names taken
  from _fields), or an IntEnum. Alternatively if you don't want to give a name
  to a particular dimension, use None. If your array only has one dimension, the
  second level of list can be skipped.

  Example usage:
    a = named_array.NamedNumpyArray([1, 3, 6], ["a", "b", "c"])
    a.a, a[1], a["c"] => 1, 3, 6
    b = named_array.NamedNumpyArray([[1, 3], [6, 8]], [["a", "b"], None])
    b.a, b[1], b["a", 1] => [1, 3], [6, 8], 3
    c = named_array.NamedNumpyArray([[1, 3], [6, 8]], [None, ["a", "b"]])
    c[0].a, b[1, 0], b[1, "b"] => 1, 6, 8
  Look at the tests for more examples including using enums and named tuples.

  Details of how to subclass an ndarray are at:
  https://docs.scipy.org/doc/numpy-1.13.0/user/basics.subclassing.html
  */
  constructor(values, names) {
    const obj = np.tensor(values)
    if (obj.shape.length === 0) {
      throw new Error('ValueError: Scalar arrays are unsupported')
    }
    if (obj.shape.length === 1) {
      if (obj.shape[0] === 0 && names && names[0] === undefined) {
        // Support arrays of length 0.
        names = [undefined]
      } else {
        // Allow just a single dimension if the array is also single dimension.
        try {
          if (names.length > 1) {
            names = [names]
          }
        } catch (err) { // len of a namedtuple is a TypeError
          names = [names]
        }
      }
    }

    // Validate names!
    if (!isinstance(names, Array) || names.length !== obj.shape.length) {
      throw new Error(`ValueError: Names must be a list of length equal to the array shape: ${names.length} != ${obj.shape.length}.`)
    }
    const index_names = []
    let only_none = obj.shape[0] > 0
    Object.keys(names).forEach((o, i) => {
      if (o === undefined) {
        index_names.push(o)
      } else {
        only_none = false
        if (isinstance(o, Enum.EnumMeta)) {
          Object.keys(o).forEach((n, j) => {
            if (j !== o[n]) {
              throw new Error('ValueError: Enum has holes or doesn\'t start from 0.')
            }
          })
          o = o._member_names_
        } else if (o._fields) {
          o = o._fields
        } else if (isinstance(o, Array)) {
          o.forEach((n) => {
            if (typeof (n) !== 'string') {
              throw new Error(`ValueError: Bad name, must be a list of strings not: ${JSON.stringify(o)}`)
            }
          })
        } else {
          throw new Error('Bad names. Must be None, a list of strings, a namedtuple, or Intenum.')
        }
        if (obj.shape[i] !== o.length) {
          throw new Error(`ValueError: Wrong number of names in dimension ${i}. Got ${o.length}, expected ${obj.shape[i]}.`)
        }
        Object.keys(o).forEach((n, j) => {
          const thing = {}
          thing[n] = j
          index_names.push(thing)
        })
      }
    })

    if (only_none) {
      throw new Error('No names given. Use a normal numpy.ndarray instead.')
    }

    // Finally convert to a NamedNumpyArray.
    obj = obj.view(cls)
    obj._index_names = index_names  // [{name: index}, ...], dict per dimension.
    return obj
  }
}


module.exports = {
  NamedDict,
  NamedNumpyArray,
}
