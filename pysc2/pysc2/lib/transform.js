const path = require('path')
const point = require(path.resolve(__dirname, './point.js'))
const pythonUtils = require(path.resolve(__dirname, './pythonUtils.js'))

const { assert, isinstance, NotImplementedError } = pythonUtils.NotImplementedError

class Transform {
  fwd_dist() {//eslint-disable-line
    throw NotImplementedError()
  }

  fwd_pt() {//eslint-disable-line
    throw NotImplementedError()
  }

  back_dist() {//eslint-disable-line
    throw NotImplementedError()
  }

  back_pt() {//eslint-disable-line
    throw NotImplementedError()
  }
}

class Linear extends Transform {
  constructor(scale = null, offset = null) {
    super(scale, offset)
    if (scale == null) {
      this.scale = new point.Point(1, 1)
    } else if (isinstance(scale, Number)) {
      this.scale = new point.Point(scale, scale)
    } else {
      this.scale = scale
    }
    assert(this.scale.x !== 0 && this.scale.y !== 0)
    this.offset = offset || new point.Point(0, 0)
  }

  fwd_dist(dist) {
    return dist * this.scale.x
  }

  fwd_pt(pt) {
    return this.scale.mul(pt).add(this.offset)
  }

  back_dist(dist) {
    return dist / this.scale.x
  }

  back_pt(pt) {
    return pt.sub(this.offset).div(this.scale)
  }

  toString() {
    return `Linear(scale = ${this.scale}, offset = ${this.offset})`
  }
}

class Chain extends Transform {
  constructor() {
    super(arguments) //eslint-disable-line
    this.transforms = arguments //eslint-disable-line
  }

  fwd_dist(dist) {
    Object.keys(this.transforms).forEach((key) => {
      const transform = this.transforms[key]
      dist = transform.fwd_dist(dist)
    })
    return dist
  }

  fwd_pt(pt) {
    Object.keys(this.transforms).forEach((key) => {
      const transform = this.transforms[key]
      pt = transform.fwd_pt(pt)
    })
    return pt
  }

  back_dist(dist) {
    Object.keys(this.transforms).forEach((key) => {
      const transform = this.transforms[key]
      dist = transform.back_dist(dist)
    })
    return dist
  }

  back_pt(pt) {
    Object.keys(this.transforms).forEach((key) => {
      const transform = this.transforms[key]
      pt = transform.back_pt(pt)
    })
    return pt
  }

  toString() {
    return `Chain(${this.transforms})`
  }
}

class PixelToCoord extends Transform {
  fwd_dist(dist) { //eslint-disable-line
    return dist
  }

  fwd_pt(pt) { //eslint-disable-line
    return pt.floor
  }

  back_dist(dist) { //eslint-disable-line
    return dist
  }

  back_pit(pt) { //eslint-disable-line
    return pt.floor.add(0.5)
  }

  toString() { //eslint-disable-line
    return 'PixelToCoord()'
  }
}

module.exports = {
  Chain,
  Linear,
  PixelToCoord,
  Transform,
}
