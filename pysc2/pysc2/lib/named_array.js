//Named numpy arrays for easier access to the observation data.

/*
https://docs.scipy.org/doc/numpy/user/basics.rec.html are not enough since they
actually change the type and don't interoperate well with tensorflow.
*/

const path = require('path')
const Enum = require('python-enum')
const np = require(path.resolve(__dirname, './numpy.js'))
const pythonUtils = require(path.resolve(__dirname, './pythonUtils.js'))
function assign(values, name, keyPathArray) {
  let value = values
  let parent
  while (keyPathArray.length) {
    if (keyPathArray.length === 1) {
      parent = value
    }
    value = value[keyPathArray.shift()]
  }
  parent[name] = value
}
function unpack(values, names, nameIndex = 0, keyPathArray = []) {
  //sanitize input
  if (isinstance(names, Enum.EnumMeta)) {
    names = names.member_names_
  } else if (names.contructor && names.constructor._fields) {
    names = names.constructor._fields
  } else if (!Array.isArray(names)) {
    names = Object.keys(names)
  }
  const nameList = names[nameIndex]
  if (nameList === null || nameList === undefined) {
    return
  }
  nameList.forEach((name, index) => {
    assign(values, name, keyPathArray.concat(index))
    unpack(values, names, nameIndex + 1, keyPathArray.concat(index))
  })
}

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


    Jihan & Ryan - Documentation notes:

     var foo = named_array.NamedNumpyArray([1, 3, 6], ["a", "b", "c"])
                col   
    dimension    0     
       a         1        
       b         3
       c         6

    usage: foo.a => 1, foo.b => 3, foo.c => 6

      bar = named_array.NamedNumpyArray([[1, 3], [6, 8]], [["a", "b"], None])
                col   col
    dimension    0     1
       a (0)     1     3 
       b (1)     6     8

    usage: bar.a => [1,3], bar.a[0] => 1, bar.a[1] => 3
    usage: bar.b => [6,8], bar.b[0] => 6, bar.b[1] => 8
      
     baz = named_array.NamedNumpyArray([[1, 3], [6, 8]], [None, ["a", "b"]])
    
                col           col       
    dimension    a             b
    None (0)     1             3
    None (1)     6             8

    usage: bar[0] => [1,3], bar[0].a => 1, bar[0].a => 3
    usage: bar[1] => [6,8], bar[0].b => 6, bar[1].b => 8

  Look at the tests for more examples including using enums and named tuples.
  */
  constructor(values, names) {
    const obj = values
    obj.tensor = np.tensor(values)
    obj.shape = obj.tensor.shape
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
    Object.keys(names).forEach((key, i) => {
      let o = names[key]
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
    obj._index_names = index_names // [{name: index}, ...], dict per dimension.
    unpack(values, names)
    // function getArrayProxy(arr) {
    //   return new Proxy(arr, {
    //     get: (target, name) => {
    //       if ()
    //     },
    //   })
    // }
    function getProxy(thing) {
      return new Proxy(thing, {
        get: (target, name) => {
          console.log('name: ', name)
          if (name === 'values') {
            console.log('A0')
            return values
          }
          let val
          if (typeof name === 'string' && Number.isInteger(Number(name))) {
            // console.log('A')
            // console.log(obj)
            // console.log(Object.keys(obj))
            name = Number(name)
            if (name >= 0) {
              val = target[name]
              // console.log('here1')
            } else {
              val = target[target.length + name]
              // console.log('here2')
            }
            // gather
          } else if (name === 'undefined' || name === 'null') {
            // console.log('C')
            val = [target]
            // return val
          } else {
            // console.log('E')
            val = target[name]
          }
          if (Array.isArray(val)) {
            return getProxy(val)
          }
          return val
        },
      })
    }
    return getProxy(obj)
  }
}


module.exports = {
  NamedDict,
  NamedNumpyArray,
}
