const features = require('./features.js')
const colors = require('./colors.js')

function sw(cb) {
  return function time_callback() {
    const start = sw.performance.now()
    let end
    let tempResult = cb(...arguments)
    if (tempResult instanceof Promise) Promise {
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

function draw_base_map(data) {
  //Draw the base map.//
  data = tf.tensor(data)
  const hmap_feature = features.SCREEN_FEATURES.height_map
  let hmap = data//hmap_feature.unpack(this._obs.getObservation())
  if (!np.any(hmap)) {
    hmap = hmap.add(100)
  }
  const hmap_color = hmap_feature.color(hmap, true)
  let out = hmap_color.mul(0.6)

  const creep_feature = features.SCREEN_FEATURES.creep
  const creep = data//creep_feature.unpack(this._obs.getObservation())
  const creep_mask = creep.greater(0)
  const creep_color = creep_feature.color(creep, true)
  const creep_color = creep_feature
  let temp1 = out.where(creep_mask, out.mul(0.4))
  let temp2 = creep_color.where(creep_mask, creep_color.mul(0.6))
  out = out.where(creep_mask, temp1.add(temp2))
  
  const power_feature = features.SCREEN_FEATURES.power_feature
  const power = data//power_feature.unpack(this._obs.getObservation())
  const power_mask = power.greater(0)
  const power_color = power_feature.color(power, true)
  temp1 = out.where(power_mask, out.mul(0.7))
  temp2 = power_color.where(power_mask, power_color.mul(0.3))
  out = out.where(power_mask, temp1.add(temp2))

  if (this._render_player_relative) {
    const player_rel_feature = features.SCREEN_FEATURES.player_relative
    const player_rel = data//player_rel_feature.unpack(this._obs.getObservation())
    const player_rel_mask = player_rel.greater(0)
    const player_rel_color = player_rel_feature.color(player_rel, true)
    out = out.where(player_rel_mask, player_rel_color)
  }

  const visibility = data//features.SCREEN_FEATURES.visibility_map.unpack(this._obs.getObservation())
  const visibility_fade = np.tensor([[0.5, 0.5, 0.5], [0.75, 0.75, 0.75], [1, 1, 1]])
  out = out.where(visibility, out.mul(visibility_fade))
  return out
}

function getTestData(size, type) {
  if (type === 'Uint8')
}

let testData

// 2 ^ 1
testData = new Uint8Array(2**1)

