const path = require('path');
const np = require(path.resolve(__dirname, './np.js'))
const all_collections_generated_classes = require(path.resolve(__dirname, './all_collections_generated_classes.js'))
const pythonUtils = require(path.resolve(__dirname, './pythonUtils.js'))
const { int } = pythonUtils

class Color extends all_collections_generated_classes.Color {
  set(r = this.r, g = this.g, b = this.b) {
    return this.constructor._make({ r, g, b })
  }

  round() {
    return this.set(Math.round(this.r), Math.round(this.g), Math.round(this.b))
  }

  floor() {
    return this.set(int(this.r), int(this.g), int(this.b))
  }

  ceil() {
    return this.set(Math.ceil(this.r), Math.ceil(this.g), Math.ceil(this.b))
  }

  __str__() {
    return `${this.r},${this.g},${this.b}`
  }

  __add__(o) {
    return Color(this.r + o.r, this.g + o.g, this.b + o.b)
  }

  __sub__(o) {
    return Color(this.r - o.r, this.g - o.g, this.b - o.b)
  }

  __mul__(val) {
    return Color(this.r * val, this.g * val, this.b * val)
  }

  __truediv__(val) {
    return Color(this.r / val, this.g / val, this.b / val)
  }

  __floordiv__(val) {
    return Color(this.r / val, this.g / val, this.b / val)
  }

  __div__(val) {
    return this.__truediv__(val)
  }
}

const black = new Color(0, 0, 0)
const white = new Color(255, 255, 255)
const red = new Color(255, 0, 0)
const green = new Color(0, 255, 0)
const blue = new Color(0, 0, 255)
const cyan = new Color(0, 255, 255)
const yellow = new Color(255, 255, 0)
const purple = new Color(255, 0, 255)

function getMaskFirst(s) {
  const v = np.range(0, s).mul(6 / s) // range of [0,6)
  const ones = np.ones([s])
  const zeros = np.zeros([s])
  // (0 < v) & (v < 1)
  return v.greater(zeros).logicalAnd(v.less(ones))
}
function getMaskN(s, n = 2) {
  const v = np.range(0, s).mul(6 / s) // range of [0,6)
  const ones = np.ones([s])
  const lower = ones.mul(n - 1)
  const upper = ones.mul(n)
  // n = 2: (1 <= h) & (h < 2)
  return v.greaterEqual(lower).logicalAnd(v.less(upper))
}

function getMaskLast(s) {
  const v = np.range(0, s).mul(6 / s) // range of [0,6)
  const ones = np.ones([s])
  const fives = ones.mul(5)
  // (5 <= h
  return v.greaterEqual(fives)
}
function smooth_hue_palette(scale) {
  //Takes an array of ints and returns a corresponding colored rgb array.//
  // http://en.wikipedia.org/wiki/HSL_and_HSV//From_HSL
  // Based on http://stackoverflow.com/a/17382854 , with simplifications and
  // optimizations. Assumes S=1, L=0.5, meaning C=1 and m=0.
  // 0 stays black, everything else moves into a hue.
  // Some initial values and scaling. Check wikipedia for variable meanings.
  const h = np.range(0, scale).mul(1 / scale)
  //x = 255 * (1 - np.absolute(np.mod(h, 2) - 1))
  const x = ((np.abs(np.mod(h, 2).add(-1))).add(-1)).mul(255)
  // Initialize outputs to zero/black
  // const out = np.zeros(mask.shape.concat(3), 'float32')
  let r = np.zeros([scale])
  let g = np.zeros([scale])
  let b = np.zeros([scale])

  // mask = (0 < h) & (h < 1)
  let mask = getMaskFirst(scale)
  // const c = 255
  const c = np.ones([scale]).mul(255)
  // r[mask] = c
  r = c.where(mask, r)
  // g[mask] = x[mask]
  g = x.where(mask, g)

  // mask = (1 <= h) & (h < 2)
  mask = getMaskN(scale, 2)
  // r[mask] = x[mask]
  r = x.where(mask, r)
  // g[mask] = c
  g = c.where(mask, g)

  //mask = (2 <= h) & (h < 3)
  mask = getMaskN(scale, 3)
  // g[mask] = c
  g = c.where(mask, g)
  // b[mask] = x[mask]
  b = x.where(mask, b)

  // mask = (3 <= h) & (h < 4)
  mask = getMaskN(scale, 4)
  // g[mask] = x[mask]
  g = x.where(mask, g)
  // b[mask] = c
  b = c.where(mask, b)

  // mask = (4 <= h) & (h < 5)
  mask = getMaskN(scale, 5)
  // r[mask] = x[mask]
  r = x.where(mask, r)
  // b[mask] = c
  b = c.where(mask, b)

  // mask = 5 <= h
  mask = getMaskLast()
  // r[mask] = c
  r = c.where(mask, r)
  // b[mask] = x[mask]
  b = x.where(mask, b)

  return np.stack([r, g, b])
}

module.exports = {
  Color,
}