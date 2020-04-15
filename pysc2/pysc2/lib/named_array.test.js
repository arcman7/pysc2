const path = require('path')
// import pickle
const Enum = require('python-enum')


const np = require(path.resolve(__dirname, './numpy.js'))
const named_array = require(path.resolve(__dirname, './named_array.js'))
const pythonUtils = require(path.resolve(__dirname, './pythonUtils.js'))
const { ValueError } = pythonUtils

function arrayEqual(a, b) {
  a.forEach((ele, i) => {
    console.log(ele, i)
    expect(ele).toEqual(b[i])
  })
}
//Tests for lib.named_array.//

// class NamedDictTest(absltest.TestCase):
describe('named_array:', () => {
  test('  test_named_dict', () => {
    const a = new named_array.NamedDict({ a: 2, b: [1, 2] })
    expect(a['a']).toBe(a.a)
    expect(a['b']).toBe(a.b)
    expect(a['a']).not.toBe(a.b)
    a.c = 3
    expect(a['c']).toBe(3)
  })
  const TestEnum = Enum.IntEnum('TestEnum', {
    a: 0,
    b: 1,
    c: 2,
  })
  const BadEnum = Enum.IntEnum('BadEnum', {
    a: 1,
    b: 2,
    c: 3,
  })
  const TestNamedTuple = { a: undefined, b: undefined, c: undefined, _fields: ['a', 'b', 'c'] }

  test('  test_bad_names', () => {
    const BadNamedTuple = { a: undefined, b: undefined, _fields: ['a', 'b'] }
    const values = [1, 3, 6]
    const badNames = [
      null,
      [null],
      ['a'],
      ['a', 'b', 'c', 'd'],
      [[1, 'b', 3]],
      [BadEnum],
      [BadNamedTuple],
      [{ 'a': 0, 'b': 1, 'c': 2 }],
    ]
    badNames.forEach((badName) => {
      expect(() => new named_array.NamedNumpyArray(values, badName)).toThrow(Error)
    })
  })
  test('  test_single_dimension:', () => {
    const values = [1, 3, 6]
    const singleNames = [
      ["list", ["a", "b", "c"]],
      ["tuple", ["a", "b", "c"]],
      ["list2", [["a", "b", "c"]]],
      ["tuple2", [["a", "b", "c"]]],
      ["list_tuple", [["a", "b", "c"]]],
      ["named_tuple", TestNamedTuple], //7
      ["named_tuple2", [TestNamedTuple]], // 8
      ["int_enum", TestEnum], // 9
      ["int_enum2", [TestEnum]], // 10
    ]
    singleNames.forEach((pair) => {
      const [_, names] = pair
      const a = new named_array.NamedNumpyArray(values, names)
      expect(a[0]).toBe(1)
      expect(a[1]).toBe(3)
      expect(a[2]).toBe(6)
      expect(a[2]).toBe(6)
      expect(a.a).toBe(1)
      // console.log('a.a: ', a.a, ' a.b: ', a.b, ' a.c:', a.c)
      expect(a.b).toBe(3)
      expect(a.c).toBe(6) // 7
      expect(a.d).toBe(undefined)
      expect(a["a"]).toBe(1)
      expect(a["b"]).toBe(3)
      expect(a["c"]).toBe(6)
      expect(a["d"]).toBe(undefined)
      // New axis = None
      // expect(a).toEqual([1, 3, 6])
      arrayEqual([1, 3, 6], a)
      // expect(a[np.newaxis], [[1, 3, 6]])
      // expect(a[null]).toEqual([[1, 3, 6]])
      // arrayEqual([values], a[null])
      // expect(a[:, null], [[1], [3], [6]])
      // expect(a[null, :, null], [[[1], [3], [6]]])
      // expect(a[null, a % 3 == 0, null], [[[3], [6]]])
      // expect(a[null][null]).toEqual([[[1, 3, 6]]])
      arrayEqual([[values]], a[null][null])
      expect(a[null][0]).toEqual([1, 3, 6])
      // expect(a[null, 0], 1)
      // expect(a[null, "a"], 1)
      expect(a[null][0].a).toBe(1)
      // expect(a[null][0, "b"], 3)

      // range slicing
      expect(a.slice(0, 2)).toEqual([1, 3])
      expect(a.slice(1, 3)).toEqual([3, 6])
      /* what do these mean? */
      // expect(a[0:2:], [1, 3])
      // expect(a[0:2:1], [1, 3])
      // expect(a[::2], [1, 6])
      // expect(a[::-1], [6, 3, 1])
      expect(a.slice(1, 3)[0]).toBe(3)
      expect(a.slice(1, 3).b).toBe(3)
      expect(a.slice(1, 3).c).toBe(6)

      // list slicing
      expect(a[[0, 0]]).toEqual([1, 1])
      expect(a[[0, 1]]).toEqual([1, 3])
      expect(a[[1, 0]]).toEqual([3, 1])
      expect(a[[1, 2]]).toEqual([3, 6])
      // expect(a[np.array([0, 2])]).toEqual([1, 6])
      const inds = new named_array.NamedNumpyArray([0, 2], ['a', 'b'])
      expect(a[inds]).toEqual([1, 6])
      expect(a[[1, 2]].b).toBe(3)
      expect(a[[2, 0]].c).toBe(6)
      // with self.assertRaises(TypeError):
      //   // Duplicates lead to unnamed dimensions.
      //   a[[0, 0]].a  // pylint: disable=pointless-statement

      // a[1] = 4
      // expect(a[1], 4)
      // expect(a.b, 4)
      // expect(a["b"], 4)

      // a[1:2] = 2
      // expect(a[1], 2)
      // expect(a.b, 2)
      // expect(a["b"], 2)

      // a[[1]] = 3
      // expect(a[1], 3)
      // expect(a.b, 3)
      // expect(a["b"], 3)

      // a.b = 5
      // expect(a[1], 5)
      // expect(a.b, 5)
      // expect(a["b"], 5)
    })
  })
})

//   def test_empty_array(self):
//     named_array.NamedNumpyArray([], [None, ["a", "b"]])
//     with self.assertRaises(ValueError):
//       // Must be the right length.
//       named_array.NamedNumpyArray([], [["a", "b"]])
//     with self.assertRaises(ValueError):
//       // Returning an empty slice is not supported, and it's not clear how or
//       // even if it should be supported.
//       named_array.NamedNumpyArray([], [["a", "b"], None])
//     with self.assertRaises(ValueError):
//       // Scalar arrays are unsupported.
//       named_array.NamedNumpyArray(1, [])

//   def test_named_array_multi_first(self):
//     a = named_array.NamedNumpyArray([[1, 3], [6, 8]], [["a", "b"], None])
//     self.assertArrayEqual(a.a, [1, 3])
//     self.assertArrayEqual(a[1], [6, 8])
//     self.assertArrayEqual(a["b"], [6, 8])
//     self.assertArrayEqual(a[::-1], [[6, 8], [1, 3]])
//     self.assertArrayEqual(a[::-1][::-1], [[1, 3], [6, 8]])
//     self.assertArrayEqual(a[::-1, ::-1], [[8, 6], [3, 1]])
//     self.assertArrayEqual(a[::-1][0], [6, 8])
//     self.assertArrayEqual(a[::-1, 0], [6, 1])
//     self.assertArrayEqual(a[::-1, 1], [8, 3])
//     self.assertArrayEqual(a[::-1].a, [1, 3])
//     self.assertArrayEqual(a[::-1].a[0], 1)
//     self.assertArrayEqual(a[::-1].b, [6, 8])
//     self.assertArrayEqual(a[[0, 0]], [[1, 3], [1, 3]])
//     with self.assertRaises(TypeError):
//       a[[0, 0]].a  // pylint: disable=pointless-statement
//     self.assertEqual(a[0, 1], 3)
//     self.assertEqual(a[(0, 1)], 3)
//     self.assertEqual(a["a", 0], 1)
//     self.assertEqual(a["b", 0], 6)
//     self.assertEqual(a["b", 1], 8)
//     self.assertEqual(a.a[0], 1)
//     self.assertArrayEqual(a[a > 2], [3, 6, 8])
//     self.assertArrayEqual(a[a % 3 == 0], [3, 6])
//     with self.assertRaises(TypeError):
//       a[0].a  // pylint: disable=pointless-statement

//     // New axis = None
//     self.assertArrayEqual(a, [[1, 3], [6, 8]])
//     self.assertArrayEqual(a[np.newaxis], [[[1, 3], [6, 8]]])
//     self.assertArrayEqual(a[None], [[[1, 3], [6, 8]]])
//     self.assertArrayEqual(a[None, :], [[[1, 3], [6, 8]]])
//     self.assertArrayEqual(a[None, "a"], [[1, 3]])
//     self.assertArrayEqual(a[:, None], [[[1, 3]], [[6, 8]]])
//     self.assertArrayEqual(a[None, :, None], [[[[1, 3]], [[6, 8]]]])
//     self.assertArrayEqual(a[None, 0, None], [[[1, 3]]])
//     self.assertArrayEqual(a[None, "a", None], [[[1, 3]]])
//     self.assertArrayEqual(a[None][None], [[[[1, 3], [6, 8]]]])
//     self.assertArrayEqual(a[None][0], [[1, 3], [6, 8]])
//     self.assertArrayEqual(a[None][0].a, [1, 3])
//     self.assertEqual(a[None][0].a[0], 1)
//     self.assertEqual(a[None][0, "b", 1], 8)

//   def test_named_array_multi_second(self):
//     a = named_array.NamedNumpyArray([[1, 3], [6, 8]], [None, ["a", "b"]])
//     self.assertArrayEqual(a[0], [1, 3])
//     self.assertEqual(a[0, 1], 3)
//     self.assertEqual(a[0, "a"], 1)
//     self.assertEqual(a[0, "b"], 3)
//     self.assertEqual(a[1, "b"], 8)
//     self.assertEqual(a[0].a, 1)
//     self.assertArrayEqual(a[a > 2], [3, 6, 8])
//     self.assertArrayEqual(a[a % 3 == 0], [3, 6])
//     with self.assertRaises(TypeError):
//       a.a  // pylint: disable=pointless-statement
//     self.assertArrayEqual(a[None, :, "a"], [[1, 6]])

//   def test_masking(self):
//     a = named_array.NamedNumpyArray([[1, 2, 3, 4], [5, 6, 7, 8]],
//                                     [None, list("abcd")])
//     self.assertArrayEqual(a[a > 2], [3, 4, 5, 6, 7, 8])
//     self.assertArrayEqual(a[a < 4], [1, 2, 3])
//     self.assertArrayEqual(a[a % 2 == 0], [2, 4, 6, 8])
//     self.assertArrayEqual(a[a % 3 == 0], [3, 6])

//   def test_slicing(self):
//     a = named_array.NamedNumpyArray([1, 2, 3, 4, 5], list("abcde"))
//     self.assertArrayEqual(a[:], [1, 2, 3, 4, 5])
//     self.assertArrayEqual(a[::], [1, 2, 3, 4, 5])
//     self.assertArrayEqual(a[::2], [1, 3, 5])
//     self.assertArrayEqual(a[::-1], [5, 4, 3, 2, 1])
//     self.assertEqual(a[:].a, 1)
//     self.assertEqual(a[::].b, 2)
//     self.assertEqual(a[::2].c, 3)
//     with self.assertRaises(AttributeError):
//       a[::2].d  // pylint: disable=pointless-statement
//     self.assertEqual(a[::-1].e, 5)
//     self.assertArrayEqual(a[a % 2 == 0], [2, 4])
//     self.assertEqual(a[a % 2 == 0].b, 2)

//     a = named_array.NamedNumpyArray([[1, 2, 3, 4], [5, 6, 7, 8]],
//                                     [None, list("abcd")])
//     self.assertArrayEqual(a[:], [[1, 2, 3, 4], [5, 6, 7, 8]])
//     self.assertArrayEqual(a[::], [[1, 2, 3, 4], [5, 6, 7, 8]])
//     self.assertArrayEqual(a[:, :], [[1, 2, 3, 4], [5, 6, 7, 8]])
//     self.assertArrayEqual(a[:, ...], [[1, 2, 3, 4], [5, 6, 7, 8]])
//     self.assertArrayEqual(a[..., ::], [[1, 2, 3, 4], [5, 6, 7, 8]])
//     self.assertArrayEqual(a[:, ::2], [[1, 3], [5, 7]])

//     self.assertArrayEqual(a[::-1], [[5, 6, 7, 8], [1, 2, 3, 4]])
//     self.assertArrayEqual(a[..., ::-1], [[4, 3, 2, 1], [8, 7, 6, 5]])
//     self.assertArrayEqual(a[:, ::-1], [[4, 3, 2, 1], [8, 7, 6, 5]])
//     self.assertArrayEqual(a[:, ::-2], [[4, 2], [8, 6]])
//     self.assertArrayEqual(a[:, -2::-2], [[3, 1], [7, 5]])
//     self.assertArrayEqual(a[::-1, -2::-2], [[7, 5], [3, 1]])
//     self.assertArrayEqual(a[..., 0, 0], 1)  // weird scalar arrays...

//     a = named_array.NamedNumpyArray(
//         [[[[0, 1], [2, 3]], [[4, 5], [6, 7]]],
//          [[[8, 9], [10, 11]], [[12, 13], [14, 15]]]],
//         [["a", "b"], ["c", "d"], ["e", "f"], ["g", "h"]])
//     self.assertEqual(a.a.c.e.g, 0)
//     self.assertEqual(a.b.c.f.g, 10)
//     self.assertEqual(a.b.d.f.h, 15)
//     self.assertArrayEqual(a[0, ..., 0], [[0, 2], [4, 6]])
//     self.assertArrayEqual(a[0, ..., 1], [[1, 3], [5, 7]])
//     self.assertArrayEqual(a[0, 0, ..., 1], [1, 3])
//     self.assertArrayEqual(a[0, ..., 1, 1], [3, 7])
//     self.assertArrayEqual(a[..., 1, 1], [[3, 7], [11, 15]])
//     self.assertArrayEqual(a[1, 0, ...], [[8, 9], [10, 11]])

//     self.assertArrayEqual(a["a", ..., "g"], [[0, 2], [4, 6]])
//     self.assertArrayEqual(a["a", ...], [[[0, 1], [2, 3]], [[4, 5], [6, 7]]])
//     self.assertArrayEqual(a[..., "g"], [[[0, 2], [4, 6]], [[8, 10], [12, 14]]])
//     self.assertArrayEqual(a["a", "c"], [[0, 1], [2, 3]])
//     self.assertArrayEqual(a["a", ...].c, [[0, 1], [2, 3]])
//     self.assertArrayEqual(a["a", ..., "g"].c, [0, 2])

//     with self.assertRaises(TypeError):
//       a[np.array([[0, 1], [0, 1]])]  // pylint: disable=pointless-statement, expression-not-assigned

//     with self.assertRaises(IndexError):
//       a[..., 0, ...]  // pylint: disable=pointless-statement

//   def test_string(self):
//     a = named_array.NamedNumpyArray([1, 3, 6], ["a", "b", "c"], dtype=np.int32)
//     self.assertEqual(str(a), "[1 3 6]")
//     self.assertEqual(repr(a), ("NamedNumpyArray([1, 3, 6], ['a', 'b', 'c'], "
//                                "dtype=int32)"))

//     a = named_array.NamedNumpyArray([[1, 3], [6, 8]], [None, ["a", "b"]])
//     self.assertEqual(str(a), "[[1 3]\n [6 8]]")
//     self.assertEqual(repr(a), ("NamedNumpyArray([[1, 3],\n"
//                                "                 [6, 8]], [None, ['a', 'b']])"))

//     a = named_array.NamedNumpyArray([[1, 3], [6, 8]], [["a", "b"], None])
//     self.assertEqual(str(a), "[[1 3]\n [6 8]]")
//     self.assertEqual(repr(a), ("NamedNumpyArray([[1, 3],\n"
//                                "                 [6, 8]], [['a', 'b'], None])"))

//     a = named_array.NamedNumpyArray([0, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//                                     [str(i) for i in range(13)], dtype=np.int32)
//     numpy_repr = np.array_repr(a)
//     if "\n" in numpy_repr:  # ie numpy > 1.14
//       self.assertEqual(repr(a), """
// NamedNumpyArray([ 0,  0,  0, 50,  0,  0,  0,  0,  0,  0,  0,  0,  0],
//                 ['0', '1', '2', '3', '4', '...', '8', '9', '10', '11', '12'],
//                 dtype=int32)""".strip())  # Keep the middle newlines.
//     else:
//       self.assertEqual(repr(a), (
//           "NamedNumpyArray("
//           "[ 0,  0,  0, 50,  0,  0,  0,  0,  0,  0,  0,  0,  0], "
//           "['0', '1', '2', '3', '4', '...', '8', '9', '10', '11', '12'], "
//           "dtype=int32)"))  # Note the lack of newlines.

//     a = named_array.NamedNumpyArray([list(range(50))] * 50,
//                                     [None, ["a%s" % i for i in range(50)]])
//     self.assertIn("49", str(a))
//     self.assertIn("49", repr(a))
//     self.assertIn("a4", repr(a))
//     self.assertIn("a49", repr(a))

//     a = named_array.NamedNumpyArray([list(range(50))] * 50,
//                                     [["a%s" % i for i in range(50)], None])
//     self.assertIn("49", str(a))
//     self.assertIn("49", repr(a))
//     self.assertIn("a4", repr(a))
//     self.assertIn("a49", repr(a))

//   def test_pickle(self):
//     arr = named_array.NamedNumpyArray([1, 3, 6], ["a", "b", "c"])
//     pickled = pickle.loads(pickle.dumps(arr))
//     self.assertTrue(np.all(arr == pickled))
//     self.assertEqual(repr(pickled),
//                      "NamedNumpyArray([1, 3, 6], ['a', 'b', 'c'])")

// if __name__ == "__main__":
//   absltest.main()
