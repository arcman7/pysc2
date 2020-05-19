const path = require('path') //eslint-disable-line
const point = require(path.resolve(__dirname, './point.js'))

class FakePoint {
  constructor() {
    this.x = 5
    this.y = 8
  }
}
describe('point.js:', () => {
  describe('  PointTest', () => {
    test('testBuild', () => {
      expect(new point.Point(5, 8))
        .toMatchObject(point.Point.build(new FakePoint()))
    })
    test('testAssignTo', () => {
      const f = new FakePoint()
      expect(f.x).toBe(5)
      expect(f.y).toBe(8)
      new point.Point(1, 2).assign_to(f)
      expect(f.x).toBe(1)
      expect(f.y).toBe(2)
    })
    test('testDist', () => {
      const a = new point.Point(1, 1)
      const b = new point.Point(4, 5)
      expect(a.dist(b)).toBe(5)
    })
    test('testDistSq', () => {
      const a = new point.Point(1, 1)
      const b = new point.Point(4, 5)
      expect(a.dist_sq(b)).toBe(25)
    })
    test('testLen', () => {
      const p = new point.Point(3, 4)
      expect(p.len()).toBe(5)
    })
    test('testScale', () => {
      const p = new point.Point(3, 4)
      expect(p.scale(2).len()).toBe(2)
    })
    test('testScaleMaxSize', () => {
      const p = new point.Point(3, 4)
      expect(p.scale_max_size(p)).toMatchObject(p)
      expect(new point.Point(6, 8))
        .toMatchObject(p.scale_max_size(new point.Point(8, 8)))
      expect(new point.Point(6, 8))
        .toMatchObject(p.scale_max_size(new point.Point(100, 8)))
      expect(new point.Point(6, 8))
        .toMatchObject(p.scale_max_size(new point.Point(6, 100)))
    })
    test('testScaleMinSize', () => {
      const p = new point.Point(3, 4)
      expect(p.scale_min_size(p)).toMatchObject(p)
      expect(new point.Point(6, 8))
        .toMatchObject(p.scale_min_size(new point.Point(6, 6)))
      expect(new point.Point(6, 8))
        .toMatchObject(p.scale_min_size(new point.Point(2, 8)))
      expect(new point.Point(6, 8))
        .toMatchObject(p.scale_min_size(new point.Point(6, 2)))
    })
    test('testMinDim', () => {
      expect(new point.Point(5, 10).min_dim()).toBe(5)
    })
    test('testMaxDim', () => {
      expect(new point.Point(5, 10).max_dim()).toBe(10)
    })
    test('testTranspose', () => {
      expect(new point.Point(4, 3)).toMatchObject(new point.Point(3, 4).transpose())
    })
    test('testRound', () => {
      const p = new point.Point(1.3, 2.6).round()
      expect(p).toMatchObject(new point.Point(1, 3))
      expect(Number.isInteger(p.x)).toBe(true)
      expect(Number.isInteger(p.y)).toBe(true)
    })
    test('testCeil', () => {
      const p = new point.Point(1.3, 2.6).ceil()
      expect(p).toMatchObject(new point.Point(2, 3))
      expect(Number.isInteger(p.x)).toBe(true)
      expect(Number.isInteger(p.y)).toBe(true)
    })
    test('testFloor', () => {
      const p = new point.Point(1.3, 2.6).floor()
      expect(p).toMatchObject(new point.Point(1, 2))
      expect(Number.isInteger(p.x)).toBe(true)
      expect(Number.isInteger(p.y)).toBe(true)
    })
    test('testRotate', () => {
      const p = new point.Point(0, 100)
      expect(new point.Point(-100, 0)).toMatchObject(p.rotate_deg(90).round())
      expect(new point.Point(100, 0)).toMatchObject(p.rotate_deg(-90).round())
      expect(new point.Point(-0, -100)).toMatchObject(p.rotate_deg(180).round())
    })
    test('testContainedCircle', () => {
      expect(new point.Point(2, 2).contained_circle(new point.Point(1, 1), 2))
        .toBe(true)
      expect(new point.Point(2, 2).contained_circle(new point.Point(1, 1), 0.5))
        .toBe(false)
    })
    test('testBound', () => {
      const tl = new point.Point(1, 2)
      const br = new point.Point(3, 4)
      expect(tl).toMatchObject(new point.Point(0, 0).bound(tl, br))
      expect(br).toMatchObject(new point.Point(10, 10).bound(tl, br))
      expect(new point.Point(1.5, 2))
        .toMatchObject(new point.Point(1.5, 0).bound(tl, br))
    })
  })
  describe('RectTest', () => {
    test('testInit', () => {
      const r = new point.Rect(1, 2, 3, 4)
      expect(r.t).toBe(1)
      expect(r.l).toBe(2)
      expect(r.b).toBe(3)
      expect(r.r).toBe(4)
      expect(r.tl).toMatchObject(new point.Point(2, 1))
      expect(r.tr).toMatchObject(new point.Point(4, 1))
      expect(r.bl).toMatchObject(new point.Point(2, 3))
      expect(r.br).toMatchObject(new point.Point(4, 3))
    })
    test('testInitBad', () => {
      expect(() => new point.Rect(4, 3, 2, 1)).toThrow(Error)
      expect(() => new point.Rect(1)).toThrow(Error)
      expect(() => new point.Rect(1, 2, 3)).toThrow(Error)
      expect(() => new point.Rect()).toThrow(Error)
    })
    test('testInitOnePoint', () => {
      const r = new point.Rect(new point.Point(1, 2))
      expect(r.t).toBe(0)
      expect(r.l).toBe(0)
      expect(r.b).toBe(2)
      expect(r.r).toBe(1)
      expect(r.tl).toMatchObject(new point.Point(0, 0))
      expect(r.tr).toMatchObject(new point.Point(1, 0))
      expect(r.bl).toMatchObject(new point.Point(0, 2))
      expect(r.br).toMatchObject(new point.Point(1, 2))
      expect(r.size).toMatchObject(new point.Point(1, 2))
      expect(r.center).toMatchObject(new point.Point(1, 2).div(2))
      expect(r.area).toBe(2)
    })
    test('testInitTwoPoints', () => {
      const r = new point.Rect(new point.Point(1, 2), new point.Point(3, 4))
      expect(r.t).toBe(2)
      expect(r.l).toBe(1)
      expect(r.b).toBe(4)
      expect(r.r).toBe(3)
      expect(r.tl).toMatchObject(new point.Point(1, 2))
      expect(r.tr).toMatchObject(new point.Point(3, 2))
      expect(r.bl).toMatchObject(new point.Point(1, 4))
      expect(r.br).toMatchObject(new point.Point(3, 4))
      expect(r.size).toMatchObject(new point.Point(2, 2))
      expect(r.center).toMatchObject(new point.Point(2, 3))
      expect(r.area).toBe(4)
    })
  })
})
