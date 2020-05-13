const path = require('path')
const s2clientprotocol = require('s2clientprotocol') //eslint-disable-line
const { common_pb, spatial_pb } = s2clientprotocol
const all_collections_generated_classes = require(path.resolve(__dirname, './all_collections_generated_classes.js'))
const pythonUtils = require(path.resolve(__dirname, './pythonUtils.js'))
const { isinstance, len, randomUniform } = pythonUtils

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
}
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
}

class Point extends all_collections_generated_classes.Point {
  //A basic Point class.//
  constructor(x, y) {
    super({})
    // if x is a proto point class
    if (isinstance(x.x, [common_pb.Point, spatial_pb.PointI, common_pb.Point2D])) {
      this.x = x.x.getX() || 0.0
      this.y = x.x.getY() || 0.0
    } else if (x && x.x && x.y) {
      this.x = x.x //x is an object { x, y }
      this.y = x.y
    } else {
      this.x = x
      this.y = y
    }

    this[0] = this.x
    this[1] = this.y
    this.length = 2
  }

  get map() {
    return [this.x, this.y].map
  }

  get forEach() {
    return [this.x, this.y].forEach
  }

  static build(x, y) {
    //Build a Point from an object that has properties `x` and `y`.//
    return this._make({ x, y })
  }

  static unit_rand() {
    //Return a Point with x, y chosen randomly with 0 <= x < 1, 0 <= y < 1.//
    return this._make({ x: Math.random(), y: Math.random() })
  }

  assign_to(obj) {
    //Assign `x` and `y` to an object that has properties `x` and `y`.//
    obj.x = this.x
    obj.y = this.y
  }

  dist(other) {
    //Distance to some other point.//
    const dx = this.x - other.x
    const dy = this.y - other.y
    return Math.sqrt((dx ** 2) + (dy ** 2))
  }

  dist_sq(other) {
    //Distance squared to some other point.//
    const dx = this.x - other.x
    const dy = this.y - other.y
    return (dx ** 2) + (dy ** 2)
  }

  round() {
    //Round `x` and `y` to integers.//
    return this.constructor.build(Math.round(this.x), Math.round(this.y))
  }

  floor() {
    //Round `x` and `y` down to integers.//
    return this.constructor.build(Math.floor(this.x), Math.floor(this.y))
  }

  ceil() {
    //Round `x` and `y` up to integers.//
    return this.constructor.build(Math.ceil(this.x), Math.ceil(this.y))
  }

  abs() {
    //Take the absolute value of `x` and `y`.//
    return this.constructor.build(Math.abs(this.x), Math.abs(this.y))
  }

  len() {
    //Length of the vector to this point.//
    return Math.sqrt((this.x ** 2) + (this.y ** 2))
  }

  scale(target_len) {
    //Scale the vector to have the target length.//
    return this.mul(target_len / this.len())
  }

  scale_max_size(max_size) {
    //Scale this value, keeping aspect ratio, but fitting inside `max_size`.//
    return this.mul((max_size / this).min_dim())
  }

  scale_min_size(min_size) {
    //Scale this value, keeping aspect ratio, but fitting around `min_size`.//
    return this.mul((min_size / this).max_dim())
  }

  min_dim() {
    return Math.min(this.x, this.y)
  }

  max_dim() {
    return Math.max(this.x, this.y)
  }

  transpose() {
    //Flip x and y.//
    return this.constructor._make({ x: this.y, y: this.x })
  }

  rotate_deg(angle) {
    return this.rotate_rad(Math.radians(angle))
  }

  rotate_rad(angle) {
    return this.constructor._make(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.x * Math.sin(angle) + this.y * Math.cos(angle)
    )
  }

  rotate_rand(angle = 180) {
    return this.rotate_deg(randomUniform(-angle, angle))
  }

  contained_circle(pt, radius) {
    //Is this point inside the circle defined by (`pt`, `radius`)?//
    return this.dist(pt) < radius
  }

  bound(p1, p2 = null) {
    //Bound this point within the rect defined by (`p1`, `p2`).//
    const r = new Rect(p1, p2)
    return this.constructor._make({
      x: Math.min(Math.max(this.x, r.l), r.r),
      y: Math.min(Math.max(this.y, r.t), r.b),
    })
  }

  toString() {
    return `${this.x},${this.y}`
  }

  neg() {
    return this.constructor.build(-this.x, -this.y)
  }

  add(pt_or_val) {
    if (isinstance(pt_or_val, this.constructor)) {
      return this.constructor.build(this.x + pt_or_val.x, this.y + pt_or_val.y)
    }
    return this.constructor.build(this.x + pt_or_val, this.y + pt_or_val)
  }

  sub(pt_or_val) {
    if (isinstance(pt_or_val, this.constructor)) {
      return this.constructor.build(this.x - (pt_or_val.x), this.y - (pt_or_val.y))
    }
    return this.constructor.build(this.x - pt_or_val, this.y - pt_or_val)
  }

  mul(pt_or_val) {
    if (isinstance(pt_or_val, this.constructor)) {
      return this.constructor.build(this.x * pt_or_val.x, this.y * pt_or_val.y)
    }
    return this.constructor.build(this.x * pt_or_val, this.y * pt_or_val)
  }

  truediv(pt_or_val) {
    if (isinstance(pt_or_val, this.constructor)) {
      return this.constructor.build(this.x / pt_or_val.x, this.y / pt_or_val.y)
    }
    return this.constructor.build(this.x / pt_or_val, this.y / pt_or_val)
  }

  floordiv(pt_or_val) {
    if (isinstance(pt_or_val, this.constructor.build)) {
      return this.constructor.build(
        Math.floor(this.x / pt_or_val.x),
        Math.floor(this.y / pt_or_val.y)
      )
    }
    return this.constructor.build(
      Math.floor(this.x / pt_or_val),
      Math.floor(this.y / pt_or_val)
    )
  }

  div() {
    return this.truediv()
  }
}

const origin = new Point(0.0, 0.0)

class Rect extends all_collections_generated_classes.Rect {
  //A basic Rect class. Assumes tl <= br.//

  constructor() {
    let arg = arguments //eslint-disable-line
    if (len(arg) === 1 || (len(arg) === 2 && arg[1] === null)) {
      arg = [origin, arg[0]]
    }
    if (len(arg) === 2) {
      const [p1, p2] = arg
      if ((!isinstance(p1, Point) || !(isinstance(p2, Point)))) {
        throw new Error(`TypeError: Rect expected Points`)
      }
      super({
        t: Math.min(p1.y, p2.y),
        l: Math.min(p1.x, p2.x),
        b: Math.max(p1.y, p2.y),
        r: Math.max(p1.x, p2.x),
      })
      return
    }
    if (len(arg) === 4) {
      if (arg[0] > arg[2] || arg[1] > arg[3]) {
        throw new Error(`TypeError:"Rect requires: t <= b and l <= r`)
      }
      super({
        t: arg[0],
        l: arg[1],
        b: arg[2],
        r: arg[3],
      })
    }
    throw new Error(`TypeError:
        "Unexpected arguments to Rect. Takes 1 or 2 Points, or 4 coords.`)
  }

  str() {
    return `${this.l},${this.r},${this.t},${this.b},`
  }

  toString() {
    return this.str()
  }

  get center() {
    return this.constructor._make(this).mul(0.5)
  }

  get top() {
    return this.t
  }

  get left() {
    return this.l
  }

  get bottom() {
    return this.b
  }

  get right() {
    return this.r
  }

  get width() {
    return this.r - this.l
  }

  get height() {
    return this.b - this.t
  }

  get tl() {
    return this.constructor.build(this.l, this.t)
  }

  get br() {
    return this.constructor.build(this.r, this.b)
  }

  get tr() {
    return this.constructor.build(this.r, this.t)
  }

  get bl() {
    return this.constructor.build(this.l, this.b)
  }

  get diagonal() {
    return this.constructor.build(this.width, this.height)
  }

  get size() {
    return this.br.sub(this.tl)
  }

  get area() {
    const size = this.size
    return size.x * size.y
  }

  round() {
    return this.constructor.build(this.tl.round(), this.br.round())
  }

  floor() {
    return this.constructor.build(this.tl.floor(), this.br.floor())
  }

  ceil() {
    return this.constructor.build(this.tl.ceil(), this.br.ceil())
  }

  contains_point(pt) {
    //Is the point inside this rect?//
    return (this.l < pt.x && this.r > pt.x &&
            this.t < pt.y && this.b > pt.y)
  }

  contains_circle(pt, radius) {
    //Is the circle completely inside this rect?//
    return (this.l < pt.x - radius && this.r > pt.x + radius &&
            this.t < pt.y - radius && this.b > pt.y + radius)
  }

  intersects_circle(pt, radius) {
    //Does the circle intersect with this rect?//
    // How this works: http://stackoverflow.com/a/402010
    const rect_corner = this.size / 2 // relative to the rect center
    const circle_center = (pt - this.center).abs() // relative to the rect center

    // Is the circle far from the rect?
    if (circle_center.x > rect_corner.x + radius ||
        circle_center.y > rect_corner.y || rect_corner.y + radius) {
      return false
    }
    // Is the circle center inside the rect or near one of the edges?
    if (circle_center.x <= rect_corner.x ||
        circle_center.y <= rect_corner.y) {
      return true
    }
    // Does the circle contain the corner of the rect?
    return circle_center.dist_sq(rect_corner) <= (radius ** 2)
  }
}

module.exports = {
  Point,
}
