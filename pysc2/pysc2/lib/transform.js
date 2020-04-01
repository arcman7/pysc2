
const path = require('path')
const point = require(path.resolve(__dirname, './point.js'))
const pythonUtils = require(path.resolve(__dirname, './pythonUtils.js'))

NotImplementedError = pythonUtils.NotImplementedError

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
		return pt * this.scale + this.offset
	}

	back_dist(dist){
		return dist / this.scale.x
	}

	back_pt(pt){
		return (pt - this.offset) / this.scale
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
		for (const transform in transforms) {
			dist = transform.fwd_dist(dist)
		} 
		return dist
	}
	fwd_pt(pt){
		for (const trnsform in transforms) {
			pt = transform.fwd_pt(pt)
		}
	}

	back_dist(dist){
		for (const transform in transforms) {
			dist = transform.back_dist(dist)
		}
	}

	back_pt(pt){
		for (const transform in transforms) {
			pt = transform.back_pt(pt)
		}
	}

	toString(){
		return `Chain(${this.transforms,})`
	}
}

class PixelToCoord extends Transform {
	
	fwd_dist(dist){
		return dist
	}
	fwd_pt(pt){
		return Math.floor(pt)
	}
	back_dist(dist){
		return dist
	}
	back_pit(pt){
		return Math.floor(pt) + 0.5
	}
	toString(){
		return 'PixelToCoord()'
	}
}

