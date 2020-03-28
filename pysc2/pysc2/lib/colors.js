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

function getMask(s) {
  const v = tf.range(0, s).mul()
  const ones = tf.ones([s])
  const zeros = tf.zeros([s])
  v.print()
  return v.greater(zeros).logicalAnd(v.less(ones))
}

function smooth_hue_palette(scale) {
  //Takes an array of ints and returns a corresponding colored rgb array.//
  // http://en.wikipedia.org/wiki/HSL_and_HSV//From_HSL
  // Based on http://stackoverflow.com/a/17382854 , with simplifications and
  // optimizations. Assumes S=1, L=0.5, meaning C=1 and m=0.
  // 0 stays black, everything else moves into a hue.

  // Some initial values and scaling. Check wikipedia for variable meanings.
  const array = np.arange(scale)
  const hScale = 1 / scale
  const sScale = hScale * 6 // 1 / 6

  const h = array.mul(sScale) // range of [0,6)
  //x = 255 * (1 - np.absolute(np.mod(h, 2) - 1))
  const x = ((np.abs(np.mod(h, 2).add(-1))).add(-1)).mul(255)
  const c = 255

  // Initialize outputs to zero/black
  // const out = np.zeros(h.shape.concat(3), 'float32')
  // const r = np.getCol(out, 0)
  // const g = np.getCol(out, 1)
  // const b = np.getCol(out, 2)
  // let r = out[..., 0]
  // let g = out[..., 1]
  // let b = out[..., 2]
  // let mask = (0 < h) & (h < 1)
  let mask = np.ceil(h).add(-1)
  mask = np.abs(mask)
  mask = mask.mul(hScale)
  mask = np.ceil(mask)
  mask = mask.add(-1)
  mask = np.abs(mask)
  // return mask
  r[mask] = c
  g[mask] = x[mask]

  mask = (1 <= h) & (h < 2)
  r[mask] = x[mask]
  g[mask] = c

  mask = (2 <= h) & (h < 3)
  g[mask] = c
  b[mask] = x[mask]

  mask = (3 <= h) & (h < 4)
  g[mask] = x[mask]
  b[mask] = c

  mask = (4 <= h) & (h < 5)
  r[mask] = x[mask]
  b[mask] = c

  mask = 5 <= h
  r[mask] = c
  b[mask] = x[mask]

  return out
}

module.exports = {
  Color,
}