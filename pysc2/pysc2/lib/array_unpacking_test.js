/*eslint-disable*/
/*
[1, 2, 3] "foo"
[1, 2, 3] ["foo", "bar", "baz"]
[[1], [2], [3]], ["foo", "bar", "baz"]
*/

function traverse(arr, previousIndexs, cb) {
  if (!Array.isArray(arr)) {
    cb(arr, previousIndexs)
    return
  }
  arr.forEach((ele, index) => {
    if (Array.isArray(ele)) {
      traverse(ele, previousIndexs.concat(index), cb)
    } else {
      cb(ele, previousIndexs.concat(index))
    }
  })
}


function test(values, names) {
  const obj = {}
  function assign(name, keyPathArray)  {
    let cur = values
    while (keyPathArray.length) {
      cur = values[keyPathArray.pop()]
    }
    obj[name] = cur
  }
  traverse(names, [], assign)
  console.log(obj)
  return obj
}

test([1,2,3], 'foo')
test([1,2,3], ['foo', 'bar', 'baz'])
test([[1],[2],[3]], ['foo', 'bar', 'baz'])