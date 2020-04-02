
const path = require('path')
const point = require(path.resolve(__dirname, './point.js'))
const pythonUtils = require(path.resolve(__dirname, './pythonUtils.js'))

const NotImplementedError = pythonUtils.NotImplementedError

class Transform extends object {
	fwd_dist(dist){
		throw NotImplementedError()
	}
	fwd_pt(pt){
		throw NotImplementedError()
	}
	back_dist(dist){
    	throw NotImplementedError()
	}
  	back_pt(pt){
    	throw NotImplementedError()
  	}
}

class Linear extends Transform {
	
	constructor(scale = null, offset = null){
		if (scale == null){
			this.scale = point.Point(1,1)
		}
		else if (scale instanceof numbes.Number){
			this.scale = point.Point(scale, scale)
		}
		else {
			this.scale = scale
		}
		np.util.assert(this.scale.x !== 0 && this.scale.y !== 0)
		this.offset = offset || point.Point(0,0)
	}

	fwd_dist(dist){
		return dist * this.scale.x
	}

	fwd_pt(pt){
		return this.scale.mul(pt).add(offset)
	}

	back_dist(dist){
		return dist / this.scale.x
	}

	back_pt(pt){
		return pt.neg(this.offset).div(this.scale)
	}

	toString() {
    	return `Linear(scale = ${this.scale}, offset = ${this.offset})`
  	}

}

class Chain extends Transform {

	constructor(){
		this.transforms = arguments

	}

	fwd_dist(dist){
		Object.keys(transforms).forEach((key) => {
			const transform = transforms[key]
			dist = transform.fwd_dist(dist)
		})
		return dist
	}

	fwd_pt(pt){
		Object.keys(transforms).forEach((key) => {
			const transform = transforms[key]
			pt = transform.fwd_pt(pt)
		})
		return pt
	}

	back_dist(dist){
		Object.keys(transforms).forEach((key) => {
			const transform = transforms[key]
			dist = transform.back_dist(dist)
		})
		return dist
	}

	back_pt(pt){
		Object.keys(transforms).forEach((key) => {
			const transform = transforms[key]
			pt = transform.back_pt(pt)
		})
		return pt
	}

	toString(){
		return `Chain(${this.transforms})`
	}
}

class PixelToCoord extends Transform {
	
	fwd_dist(dist){
		return dist
	}
	fwd_pt(pt){
		return pt.floor
	}
	back_dist(dist){
		return dist
	}
	back_pit(pt){
		return pt.floor.add(0.5)
	}
	toString(){
		return 'PixelToCoord()'
	}
}

