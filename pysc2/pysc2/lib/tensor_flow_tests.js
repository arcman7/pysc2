let tf = require('@tensorflow/tfjs') //eslint-disable-line
tf = require('@tensorflow/tfjs-node') //eslint-disable-line

const features = require('./features.js') //eslint-disable-line
const colors = require('./colors.js') //eslint-disable-line

function sw(cb) {
  return function time_callback() {
    const start = sw.performance.now()
    let end
    let tempResult = cb(...arguments) //eslint-disable-line
    if (tempResult instanceof Promise) {
      return tempResult.then((results) => {
        end = sw.performance.now()
        console.log(`sw: ${cb.name} - ${end - start} ms`)
        return results
      })
    }
    end = sw.performance.now()
    console.log(`sw: ${cb.name} - ${end - start} ms`)
    return tempResult
  }
}

if (typeof window === 'undefined') {
  const { performance } = require('perf_hooks') //eslint-disable-line
  sw.performance = performance
} else {
  sw.performance = window.performance
}

let draw_base_map_tf = function(data) {
  //Draw the base map.//
  const hmap_feature = features.SCREEN_FEATURES.height_map
  let hmap = data//hmap_feature.unpack(this._obs.getObservation())
  if (!tf.any(tf.cast(hmap, 'bool'))) {
    hmap = hmap.add(100)
  }
  const hmap_color = hmap_feature.color(hmap, true)
  let out = hmap_color.mul(0.6)

  const creep_feature = features.SCREEN_FEATURES.creep
  const creep = data //creep_feature.unpack(this._obs.getObservation())
  const creep_mask = creep.greater(0)
  const creep_color = creep_feature.color(creep, true)
  let temp1 = out.where(creep_mask, out.mul(0.4))
  let temp2 = creep_color.where(creep_mask, creep_color.mul(0.6))
  out = out.where(creep_mask, temp1.add(temp2))

  const power_feature = features.SCREEN_FEATURES.power_feature
  const power = data //power_feature.unpack(this._obs.getObservation())
  const power_mask = power.greater(0)
  const power_color = power_feature.color(power, true)
  temp1 = out.where(power_mask, out.mul(0.7))
  temp2 = power_color.where(power_mask, power_color.mul(0.3))
  out = out.where(power_mask, temp1.add(temp2))

  if (true) {
    const player_rel_feature = features.SCREEN_FEATURES.player_relative
    const player_rel = data //player_rel_feature.unpack(this._obs.getObservation())
    const player_rel_mask = player_rel.greater(0)
    const player_rel_color = player_rel_feature.color(player_rel, true)
    out = out.where(player_rel_mask, player_rel_color)
  }

  const visibility = data //features.SCREEN_FEATURES.visibility_map.unpack(this._obs.getObservation())
  const visibility_fade = tf.tensor([[0.5, 0.5, 0.5], [0.75, 0.75, 0.75], [1, 1, 1]])
  out = out.where(visibility, out.mul(visibility_fade))
  return out
}

draw_base_map_tf = sw(draw_base_map_tf)

function getTestData(size = 2, Type = Uint8Array) {
  const arr = new Type(size)
  for (let i = 0; i < size; i++) {
    arr[i] = Math.floor(255 * Math.random())
  }
  return tf.tensor(arr)//, undefined, 'float32')
}

let testData

// 2 ^ 1
testData = getTestData(2 ** 1)
draw_base_map_tf(testData)

// 2 ^ 2
testData = getTestData(2 ** 2)
draw_base_map_tf(testData)

// 2 ^ 3
testData = getTestData(2 ** 3)
draw_base_map_tf(testData)

// 2 ^ 4
testData = getTestData(2 ** 4)
draw_base_map_tf(testData)

// 2 ^ 5
testData = getTestData(2 ** 5)
draw_base_map_tf(testData)

// 2 ^ 6
testData = getTestData(2 ** 6)
draw_base_map_tf(testData)

// 2 ^ 7
testData = getTestData(2 ** 7)
draw_base_map_tf(testData)

// 2 ^ 8
testData = getTestData(2 ** 8)
draw_base_map_tf(testData)

// 2 ^ 9
testData = getTestData(2 ** 9)
draw_base_map_tf(testData)

// 2 ^ 10
testData = getTestData(2 ** 10)
draw_base_map_tf(testData)

// 2 ^ 11
testData = getTestData(2 ** 11)
draw_base_map_tf(testData)

// 2 ^ 12
testData = getTestData(2 ** 12)
draw_base_map_tf(testData)

// 2 ^ 13
testData = getTestData(2 ** 13)
draw_base_map_tf(testData)

// 2 ^ 14
testData = getTestData(2 ** 14)
draw_base_map_tf(testData)

// 2 ^ 15
testData = getTestData(2 ** 15)
draw_base_map_tf(testData)

// 2 ^ 16
testData = getTestData(2 ** 16)
draw_base_map_tf(testData)
