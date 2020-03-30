//Named numpy arrays for easier access to the observation data.

/*
https://docs.scipy.org/doc/numpy/user/basics.rec.html are not enough since they
actually change the type and don't interoperate well with tensorflow.
*/

// import re
const path = require('path')
const Enum = require('python-enum')
const np = require(path.resolve(__dirname, './numpy.js'))

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

// class NamedNumpyArray {// extends np.ndarray:
//   /*A subclass of ndarray that lets you give names to indices.

//   This is a normal ndarray in the sense that you can always index by numbers and
//   slices, though elipses don't work. Also, all elements have the same type,
//   unlike a record array.

//   Names should be a list of names per dimension in the ndarray shape. The names
//   should be a list or tuple of strings, a namedtuple class (with names taken
//   from _fields), or an IntEnum. Alternatively if you don't want to give a name
//   to a particular dimension, use None. If your array only has one dimension, the
//   second level of list can be skipped.

//   Example usage:
//     a = named_array.NamedNumpyArray([1, 3, 6], ["a", "b", "c"])
//     a.a, a[1], a["c"] => 1, 3, 6
//     b = named_array.NamedNumpyArray([[1, 3], [6, 8]], [["a", "b"], None])
//     b.a, b[1], b["a", 1] => [1, 3], [6, 8], 3
//     c = named_array.NamedNumpyArray([[1, 3], [6, 8]], [None, ["a", "b"]])
//     c[0].a, b[1, 0], b[1, "b"] => 1, 6, 8
//   Look at the tests for more examples including using enums and named tuples.
  
//   Details of how to subclass an ndarray are at:
//   https://docs.scipy.org/doc/numpy-1.13.0/user/basics.subclassing.html
//   */
//   constructor(values, names) {
//     // obj = np.array(values, args, kwargs)
//     const obj = np.tensor(values)
//     Object.keys(names).forEach((name) => {

//     })

//     if len(obj.shape) == 0:
//       raise ValueError("Scalar arrays are unsupported.")

//     if len(obj.shape) == 1:
//       if obj.shape[0] == 0 and names and names[0] is None:
//         // Support arrays of length 0.
//         names = [None]
//       else:
//         // Allow just a single dimension if the array is also single dimension.
//         try:
//           if len(names) > 1:
//             names = [names]
//         except TypeError:  // len of a namedtuple is a TypeError
//           names = [names]

//     // Validate names!
//     if not isinstance(names, (list, tuple)) or len(names) != len(obj.shape) {
//       raise ValueError(
//           "Names must be a list of length equal to the array shape: %s != %s." %
//           (len(names), len(obj.shape)))
//     index_names = []
//     only_none = obj.shape[0] > 0
//     for i, o in enumerate(names) {
//       if o is None:
//         index_names.append(o)
//       else:
//         only_none = False
//         if isinstance(o, Enum.EnumMeta) {
//           for j, n in enumerate(o._member_names_) {
//             if j != o[n]:
//               raise ValueError("Enum has holes or doesn't start from 0.")
//           o = o._member_names_
//         elif isinstance(o, type) {  // Assume namedtuple
//           try:
//             o = o._fields
//           except AttributeError:
//             raise ValueError("Bad names. Must be None, a list of strings, "
//                              "a namedtuple, or Intenum.")
//         elif isinstance(o, (list, tuple)) {
//           for n in o:
//             if not isinstance(n, str) {
//               raise ValueError(
//                   "Bad name, must be a list of strings, not %s" % type(n))
//         else:
//           raise ValueError("Bad names. Must be None, a list of strings, "
//                            "a namedtuple, or Intenum.")
//         if obj.shape[i] != len(o) {
//           raise ValueError(
//               "Wrong number of names in dimension %s. Got %s, expected %s." % (
//                   i, len(o), obj.shape[i]))
//         index_names.append({n: j for j, n in enumerate(o)})
//     if only_none:
//       raise ValueError("No names given. Use a normal numpy.ndarray instead.")

//     // Finally convert to a NamedNumpyArray.
//     obj = obj.view(cls)
//     obj._index_names = index_names  // [{name: index}, ...], dict per dimension.
//     return obj
//   }

// }


module.exports = {
  NamedDict,
  // NamedNumpyArray,
}
