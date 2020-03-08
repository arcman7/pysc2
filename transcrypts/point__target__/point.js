// Transcrypt'ed from Python, 2020-03-07 14:50:38
var math = {};
var random = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as __module_random__ from './random.js';
__nest__ (random, '', __module_random__);
import * as __module_math__ from './math.js';
__nest__ (math, '', __module_math__);
import {print_function} from './__future__.js';
import {division} from './__future__.js';
import {absolute_import} from './__future__.js';
var __name__ = '__main__';
export var Point =  __class__ ('Point', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, x, y) {
		self.x = x;
		self.y = y;
	});},
	__slots__: tuple ([]),
	get build () {return __getcm__ (this, function (cls, obj) {
		return cls (obj.x, obj.y);
	});},
	get unit_rand () {return __getcm__ (this, function (cls) {
		return cls (random.random (), random.random ());
	});},
	get assign_to () {return __get__ (this, function (self, obj) {
		obj.x = self.x;
		obj.y = self.y;
	});},
	get dist () {return __get__ (this, function (self, other) {
		var dx = self.x - other.x;
		var dy = self.y - other.y;
		return math.sqrt (Math.pow (dx, 2) + Math.pow (dy, 2));
	});},
	get dist_sq () {return __get__ (this, function (self, other) {
		var dx = self.x - other.x;
		var dy = self.y - other.y;
		return Math.pow (dx, 2) + Math.pow (dy, 2);
	});},
	get round () {return __get__ (this, function (self) {
		return Point (int (round (self.x)), int (round (self.y)));
	});},
	get floor () {return __get__ (this, function (self) {
		return Point (int (math.floor (self.x)), int (math.floor (self.y)));
	});},
	get ceil () {return __get__ (this, function (self) {
		return Point (int (math.ceil (self.x)), int (math.ceil (self.y)));
	});},
	get abs () {return __get__ (this, function (self) {
		return Point (abs (self.x), abs (self.y));
	});},
	get len () {return __get__ (this, function (self) {
		return math.sqrt (Math.pow (self.x, 2) + Math.pow (self.y, 2));
	});},
	get scale () {return __get__ (this, function (self, target_len) {
		return self * (target_len / self.len ());
	});},
	get scale_max_size () {return __get__ (this, function (self, max_size) {
		return self * (max_size / self).min_dim ();
	});},
	get scale_min_size () {return __get__ (this, function (self, min_size) {
		return self * (min_size / self).max_dim ();
	});},
	get min_dim () {return __get__ (this, function (self) {
		return min (self.x, self.y);
	});},
	get max_dim () {return __get__ (this, function (self) {
		return max (self.x, self.y);
	});},
	get transpose () {return __get__ (this, function (self) {
		return Point (self.y, self.x);
	});},
	get rotate_deg () {return __get__ (this, function (self, angle) {
		return self.rotate_rad (math.radians (angle));
	});},
	get rotate_rad () {return __get__ (this, function (self, angle) {
		return Point (self.x * math.cos (angle) - self.y * math.sin (angle), self.x * math.sin (angle) + self.y * math.cos (angle));
	});},
	get rotate_rand () {return __get__ (this, function (self, angle) {
		if (typeof angle == 'undefined' || (angle != null && angle.hasOwnProperty ("__kwargtrans__"))) {;
			var angle = 180;
		};
		return self.rotate_deg (random.uniform (-(angle), angle));
	});},
	get contained_circle () {return __get__ (this, function (self, pt, radius) {
		return self.dist (pt) < radius;
	});},
	get bound () {return __get__ (this, function (self, p1, p2) {
		if (typeof p2 == 'undefined' || (p2 != null && p2.hasOwnProperty ("__kwargtrans__"))) {;
			var p2 = null;
		};
		var r = Rect (p1, p2);
		return Point (min (max (self.x, r.l), r.r), min (max (self.y, r.t), r.b));
	});},
	get __str__ () {return __get__ (this, function (self) {
		if (all ((function () {
			var __accu0__ = [];
			for (var v of self) {
				__accu0__.append (isinstance (v, int));
			}
			return py_iter (__accu0__);
		}) ())) {
			return __mod__ ('%d,%d', self);
		}
		else {
			return __mod__ ('%.6f,%.6f', self);
		}
	});},
	get __neg__ () {return __get__ (this, function (self) {
		return Point (-(self.x), -(self.y));
	});},
	get __add__ () {return __get__ (this, function (self, pt_or_val) {
		if (isinstance (pt_or_val, Point)) {
			return Point (self.x + pt_or_val.x, self.y + pt_or_val.y);
		}
		else {
			return Point (self.x + pt_or_val, self.y + pt_or_val);
		}
	});},
	get __sub__ () {return __get__ (this, function (self, pt_or_val) {
		if (isinstance (pt_or_val, Point)) {
			return Point (self.x - pt_or_val.x, self.y - pt_or_val.y);
		}
		else {
			return Point (self.x - pt_or_val, self.y - pt_or_val);
		}
	});},
	get __mul__ () {return __get__ (this, function (self, pt_or_val) {
		if (isinstance (pt_or_val, Point)) {
			return Point (self.x * pt_or_val.x, self.y * pt_or_val.y);
		}
		else {
			return Point (self.x * pt_or_val, self.y * pt_or_val);
		}
	});},
	get __truediv__ () {return __get__ (this, function (self, pt_or_val) {
		if (isinstance (pt_or_val, Point)) {
			return Point (self.x / pt_or_val.x, self.y / pt_or_val.y);
		}
		else {
			return Point (self.x / pt_or_val, self.y / pt_or_val);
		}
	});},
	get __floordiv__ () {return __get__ (this, function (self, pt_or_val) {
		if (isinstance (pt_or_val, Point)) {
			return Point (int (Math.floor (self.x / pt_or_val.x)), int (Math.floor (self.y / pt_or_val.y)));
		}
		else {
			return Point (int (Math.floor (self.x / pt_or_val)), int (Math.floor (self.y / pt_or_val)));
		}
	});},
	__div__: __truediv__
});
export var origin = Point (0, 0);
export var Rect =  __class__ ('Rect', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, t, l, b, r) {
		self.t = t;
		self.l = l;
		self.b = b;
		self.r = r;
	});},
	__slots__: tuple ([]),
	get __new__ () {return __get__ (this, function (cls) {
		var args = tuple ([].slice.apply (arguments).slice (1));
		if (len (args) == 1 || len (args) == 2 && args [1] === null) {
			var args = tuple ([origin, args [0]]);
		}
		if (len (args) == 2) {
			var __left0__ = args;
			var p1 = __left0__ [0];
			var p2 = __left0__ [1];
			if (!(isinstance (p1, Point)) || !(isinstance (p2, Point))) {
				var __except0__ = py_TypeError ('Rect expected Points');
				__except0__.__cause__ = null;
				throw __except0__;
			}
			return Rect.__init__ (cls, min (p1.y, p2.y), min (p1.x, p2.x), max (p1.y, p2.y), max (p1.x, p2.x));
		}
		if (len (args) == 4) {
			if (args [0] > args [2] || args [1] > args [3]) {
				var __except0__ = py_TypeError ('Rect requires: t <= b and l <= r');
				__except0__.__cause__ = null;
				throw __except0__;
			}
			return Rect.__init__ (cls, ...args);
		}
		var __except0__ = py_TypeError ('Unexpected arguments to Rect. Takes 1 or 2 Points, or 4 coords.');
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get __str__ () {return __get__ (this, function (self) {
		if (all ((function () {
			var __accu0__ = [];
			for (var v of self) {
				__accu0__.append (isinstance (v, int));
			}
			return py_iter (__accu0__);
		}) ())) {
			return __mod__ ('%d,%d,%d,%d', self);
		}
		else {
			return __mod__ ('%.6f,%.6f,%.6f,%.6f', self);
		}
	});},
	get _get_center () {return __get__ (this, function (self) {
		return Point (self.l + self.r, self.t + self.b) / 2;
	});},
	get _get_top () {return __get__ (this, function (self) {
		return self.t;
	});},
	get _get_left () {return __get__ (this, function (self) {
		return self.l;
	});},
	get _get_bottom () {return __get__ (this, function (self) {
		return self.b;
	});},
	get _get_right () {return __get__ (this, function (self) {
		return self.r;
	});},
	get _get_width () {return __get__ (this, function (self) {
		return self.r - self.l;
	});},
	get _get_height () {return __get__ (this, function (self) {
		return self.b - self.t;
	});},
	get _get_tl () {return __get__ (this, function (self) {
		return Point (self.l, self.t);
	});},
	get _get_br () {return __get__ (this, function (self) {
		return Point (self.r, self.b);
	});},
	get _get_tr () {return __get__ (this, function (self) {
		return Point (self.r, self.t);
	});},
	get _get_bl () {return __get__ (this, function (self) {
		return Point (self.l, self.b);
	});},
	get _get_diagonal () {return __get__ (this, function (self) {
		return Point (self.width, self.height);
	});},
	get _get_size () {return __get__ (this, function (self) {
		return self.br - self.tl;
	});},
	get _get_area () {return __get__ (this, function (self) {
		var size = self.size;
		return size.x * size.y;
	});},
	get round () {return __get__ (this, function (self) {
		return Rect (self.tl.round (), self.br.round ());
	});},
	get floor () {return __get__ (this, function (self) {
		return Rect (self.tl.floor (), self.br.floor ());
	});},
	get ceil () {return __get__ (this, function (self) {
		return Rect (self.tl.ceil (), self.br.ceil ());
	});},
	get contains_point () {return __get__ (this, function (self, pt) {
		return self.l < pt.x && self.r > pt.x && self.t < pt.y && self.b > pt.y;
	});},
	get contains_circle () {return __get__ (this, function (self, pt, radius) {
		return self.l < pt.x - radius && self.r > pt.x + radius && self.t < pt.y - radius && self.b > pt.y + radius;
	});},
	get intersects_circle () {return __get__ (this, function (self, pt, radius) {
		var rect_corner = self.size / 2;
		var circle_center = (pt - self.center).abs ();
		if (circle_center.x > rect_corner.x + radius || circle_center.y > rect_corner.y + radius) {
			return false;
		}
		if (circle_center.x <= rect_corner.x || circle_center.y <= rect_corner.y) {
			return true;
		}
		return circle_center.dist_sq (rect_corner) <= Math.pow (radius, 2);
	});}
});
Object.defineProperty (Rect, 'area', property.call (Rect, Rect._get_area));
Object.defineProperty (Rect, 'size', property.call (Rect, Rect._get_size));
Object.defineProperty (Rect, 'diagonal', property.call (Rect, Rect._get_diagonal));
Object.defineProperty (Rect, 'bl', property.call (Rect, Rect._get_bl));
Object.defineProperty (Rect, 'tr', property.call (Rect, Rect._get_tr));
Object.defineProperty (Rect, 'br', property.call (Rect, Rect._get_br));
Object.defineProperty (Rect, 'tl', property.call (Rect, Rect._get_tl));
Object.defineProperty (Rect, 'height', property.call (Rect, Rect._get_height));
Object.defineProperty (Rect, 'width', property.call (Rect, Rect._get_width));
Object.defineProperty (Rect, 'right', property.call (Rect, Rect._get_right));
Object.defineProperty (Rect, 'bottom', property.call (Rect, Rect._get_bottom));
Object.defineProperty (Rect, 'left', property.call (Rect, Rect._get_left));
Object.defineProperty (Rect, 'top', property.call (Rect, Rect._get_top));
Object.defineProperty (Rect, 'center', property.call (Rect, Rect._get_center));;

//# sourceMappingURL=point.map