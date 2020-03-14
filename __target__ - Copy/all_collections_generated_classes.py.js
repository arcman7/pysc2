// Transcrypt'ed from Python, 2020-03-13 19:41:20
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
var __name__ = '__main__';
export var eq = function (a, b) {
	return a == b;
};
export var itemgetter =  __class__ ('itemgetter', [object], {
	__module__: __name__,
	__slots__: tuple (['_items', '_call']),
	get __init__ () {return __get__ (this, function (self, item) {
		var py_items = tuple ([].slice.apply (arguments).slice (2));
		if (!(py_items)) {
			self._items = tuple ([item]);
			var func = function (obj) {
				return obj [item];
			};
			self._call = func;
		}
		else {
			var __left0__ = tuple ([item]) + py_items;
			self._items = __left0__;
			var py_items = __left0__;
			var func = function (obj) {
				return tuple ((function () {
					var __accu0__ = [];
					for (var i of py_items) {
						__accu0__.append (obj [i]);
					}
					return py_iter (__accu0__);
				}) ());
			};
			self._call = func;
		}
	});},
	get __call__ () {return __get__ (this, function (self, obj) {
		return self._call (obj);
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return __mod__ ('%s.%s(%s)', tuple ([self.__class__.__module__, self.__class__.__name__, ', '.join (map (repr, self._items))]));
	});},
	get __reduce__ () {return __get__ (this, function (self) {
		return tuple ([self.__class__, self._items]);
	});}
});
export var ArgumentType =  __class__ ('ArgumentType', [tuple], {
	__module__: __name__,
	__slots__: tuple ([]),
	_fields: tuple (['id', 'name', 'sizes', 'fn', 'values', 'count']),
	get __new__ () {return __get__ (this, function (_cls, id, py_name, sizes, fn, py_values, count) {
		return tuple.__new__ (_cls, tuple ([id, py_name, sizes, fn, py_values, count]));
	});},
	get _make () {return __getcm__ (this, function (cls, iterable, py_new, len) {
		if (typeof py_new == 'undefined' || (py_new != null && py_new.hasOwnProperty ("__kwargtrans__"))) {;
			var py_new = tuple.__new__;
		};
		if (typeof len == 'undefined' || (len != null && len.hasOwnProperty ("__kwargtrans__"))) {;
			var len = len;
		};
		var result = py_new (cls, iterable);
		if (len (result) != 6) {
			var __except0__ = py_TypeError (__mod__ ('Expected 6 arguments, got %d', len (result)));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return __mod__ ('ArgumentType(id=%r, name=%r, sizes=%r, fn=%r, values=%r, count=%r)', self);
	});},
	get _asdict () {return __get__ (this, function (self) {
		return OrderedDict (zip (self._fields, self));
	});},
	get _replace () {return __get__ (this, function (_self) {
		var result = _self._make (map (kwds.py_pop, tuple (['id', 'name', 'sizes', 'fn', 'values', 'count']), _self));
		if (kwds) {
			var __except0__ = ValueError (__mod__ ('Got unexpected field names: %r', kwds.py_keys ()));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __getnewargs__ () {return __get__ (this, function (self) {
		return tuple (self);
	});}
});
export var Arguments =  __class__ ('Arguments', [tuple], {
	__module__: __name__,
	__slots__: tuple ([]),
	_fields: tuple (['screen', 'minimap', 'screen2', 'queued', 'control_group_act', 'control_group_id', 'select_point_act', 'select_add', 'select_unit_act', 'select_unit_id', 'select_worker', 'build_queue_id', 'unload_id']),
	get __new__ () {return __get__ (this, function (_cls, screen, minimap, screen2, queued, control_group_act, control_group_id, select_point_act, select_add, select_unit_act, select_unit_id, select_worker, build_queue_id, unload_id) {
		return tuple.__new__ (_cls, tuple ([screen, minimap, screen2, queued, control_group_act, control_group_id, select_point_act, select_add, select_unit_act, select_unit_id, select_worker, build_queue_id, unload_id]));
	});},
	get _make () {return __getcm__ (this, function (cls, iterable, py_new, len) {
		if (typeof py_new == 'undefined' || (py_new != null && py_new.hasOwnProperty ("__kwargtrans__"))) {;
			var py_new = tuple.__new__;
		};
		if (typeof len == 'undefined' || (len != null && len.hasOwnProperty ("__kwargtrans__"))) {;
			var len = len;
		};
		var result = py_new (cls, iterable);
		if (len (result) != 13) {
			var __except0__ = py_TypeError (__mod__ ('Expected 13 arguments, got %d', len (result)));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return __mod__ ('Arguments(screen=%r, minimap=%r, screen2=%r, queued=%r, control_group_act=%r, control_group_id=%r, select_point_act=%r, select_add=%r, select_unit_act=%r, select_unit_id=%r, select_worker=%r, build_queue_id=%r, unload_id=%r)', self);
	});},
	get _asdict () {return __get__ (this, function (self) {
		return OrderedDict (zip (self._fields, self));
	});},
	get _replace () {return __get__ (this, function (_self) {
		var result = _self._make (map (kwds.py_pop, tuple (['screen', 'minimap', 'screen2', 'queued', 'control_group_act', 'control_group_id', 'select_point_act', 'select_add', 'select_unit_act', 'select_unit_id', 'select_worker', 'build_queue_id', 'unload_id']), _self));
		if (kwds) {
			var __except0__ = ValueError (__mod__ ('Got unexpected field names: %r', kwds.py_keys ()));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __getnewargs__ () {return __get__ (this, function (self) {
		return tuple (self);
	});}
});
export var RawArguments =  __class__ ('RawArguments', [tuple], {
	__module__: __name__,
	__slots__: tuple ([]),
	_fields: tuple (['world', 'queued', 'unit_tags', 'target_unit_tag']),
	get __new__ () {return __get__ (this, function (_cls, world, queued, unit_tags, target_unit_tag) {
		return tuple.__new__ (_cls, tuple ([world, queued, unit_tags, target_unit_tag]));
	});},
	get _make () {return __getcm__ (this, function (cls, iterable, py_new, len) {
		if (typeof py_new == 'undefined' || (py_new != null && py_new.hasOwnProperty ("__kwargtrans__"))) {;
			var py_new = tuple.__new__;
		};
		if (typeof len == 'undefined' || (len != null && len.hasOwnProperty ("__kwargtrans__"))) {;
			var len = len;
		};
		var result = py_new (cls, iterable);
		if (len (result) != 4) {
			var __except0__ = py_TypeError (__mod__ ('Expected 4 arguments, got %d', len (result)));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return __mod__ ('RawArguments(world=%r, queued=%r, unit_tags=%r, target_unit_tag=%r)', self);
	});},
	get _asdict () {return __get__ (this, function (self) {
		return OrderedDict (zip (self._fields, self));
	});},
	get _replace () {return __get__ (this, function (_self) {
		var result = _self._make (map (kwds.py_pop, tuple (['world', 'queued', 'unit_tags', 'target_unit_tag']), _self));
		if (kwds) {
			var __except0__ = ValueError (__mod__ ('Got unexpected field names: %r', kwds.py_keys ()));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __getnewargs__ () {return __get__ (this, function (self) {
		return tuple (self);
	});}
});
export var Function =  __class__ ('Function', [tuple], {
	__module__: __name__,
	__slots__: tuple ([]),
	_fields: tuple (['id', 'name', 'ability_id', 'general_id', 'function_type', 'args', 'avail_fn', 'raw']),
	get __new__ () {return __get__ (this, function (_cls, id, py_name, ability_id, general_id, function_type, args, avail_fn, raw) {
		return tuple.__new__ (_cls, tuple ([id, py_name, ability_id, general_id, function_type, args, avail_fn, raw]));
	});},
	get _make () {return __getcm__ (this, function (cls, iterable, py_new, len) {
		if (typeof py_new == 'undefined' || (py_new != null && py_new.hasOwnProperty ("__kwargtrans__"))) {;
			var py_new = tuple.__new__;
		};
		if (typeof len == 'undefined' || (len != null && len.hasOwnProperty ("__kwargtrans__"))) {;
			var len = len;
		};
		var result = py_new (cls, iterable);
		if (len (result) != 8) {
			var __except0__ = py_TypeError (__mod__ ('Expected 8 arguments, got %d', len (result)));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return __mod__ ('Function(id=%r, name=%r, ability_id=%r, general_id=%r, function_type=%r, args=%r, avail_fn=%r, raw=%r)', self);
	});},
	get _asdict () {return __get__ (this, function (self) {
		return OrderedDict (zip (self._fields, self));
	});},
	get _replace () {return __get__ (this, function (_self) {
		var result = _self._make (map (kwds.py_pop, tuple (['id', 'name', 'ability_id', 'general_id', 'function_type', 'args', 'avail_fn', 'raw']), _self));
		if (kwds) {
			var __except0__ = ValueError (__mod__ ('Got unexpected field names: %r', kwds.py_keys ()));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __getnewargs__ () {return __get__ (this, function (self) {
		return tuple (self);
	});}
});
export var FunctionCall =  __class__ ('FunctionCall', [tuple], {
	__module__: __name__,
	__slots__: tuple ([]),
	_fields: tuple (['function', 'arguments']),
	get __new__ () {return __get__ (this, function (_cls, function, py_arguments) {
		return tuple.__new__ (_cls, tuple ([function, py_arguments]));
	});},
	get _make () {return __getcm__ (this, function (cls, iterable, py_new, len) {
		if (typeof py_new == 'undefined' || (py_new != null && py_new.hasOwnProperty ("__kwargtrans__"))) {;
			var py_new = tuple.__new__;
		};
		if (typeof len == 'undefined' || (len != null && len.hasOwnProperty ("__kwargtrans__"))) {;
			var len = len;
		};
		var result = py_new (cls, iterable);
		if (len (result) != 2) {
			var __except0__ = py_TypeError (__mod__ ('Expected 2 arguments, got %d', len (result)));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return __mod__ ('FunctionCall(function=%r, arguments=%r)', self);
	});},
	get _asdict () {return __get__ (this, function (self) {
		return OrderedDict (zip (self._fields, self));
	});},
	get _replace () {return __get__ (this, function (_self) {
		var result = _self._make (map (kwds.py_pop, tuple (['function', 'arguments']), _self));
		if (kwds) {
			var __except0__ = ValueError (__mod__ ('Got unexpected field names: %r', kwds.py_keys ()));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __getnewargs__ () {return __get__ (this, function (self) {
		return tuple (self);
	});}
});
export var ValidActions =  __class__ ('ValidActions', [tuple], {
	__module__: __name__,
	__slots__: tuple ([]),
	_fields: tuple (['types', 'functions']),
	get __new__ () {return __get__ (this, function (_cls, types, functions) {
		return tuple.__new__ (_cls, tuple ([types, functions]));
	});},
	get _make () {return __getcm__ (this, function (cls, iterable, py_new, len) {
		if (typeof py_new == 'undefined' || (py_new != null && py_new.hasOwnProperty ("__kwargtrans__"))) {;
			var py_new = tuple.__new__;
		};
		if (typeof len == 'undefined' || (len != null && len.hasOwnProperty ("__kwargtrans__"))) {;
			var len = len;
		};
		var result = py_new (cls, iterable);
		if (len (result) != 2) {
			var __except0__ = py_TypeError (__mod__ ('Expected 2 arguments, got %d', len (result)));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return __mod__ ('ValidActions(types=%r, functions=%r)', self);
	});},
	get _asdict () {return __get__ (this, function (self) {
		return OrderedDict (zip (self._fields, self));
	});},
	get _replace () {return __get__ (this, function (_self) {
		var result = _self._make (map (kwds.py_pop, tuple (['types', 'functions']), _self));
		if (kwds) {
			var __except0__ = ValueError (__mod__ ('Got unexpected field names: %r', kwds.py_keys ()));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __getnewargs__ () {return __get__ (this, function (self) {
		return tuple (self);
	});}
});
export var Color =  __class__ ('Color', [tuple], {
	__module__: __name__,
	__slots__: tuple ([]),
	_fields: tuple (['r', 'g', 'b']),
	get __new__ () {return __get__ (this, function (_cls, r, g, b) {
		return tuple.__new__ (_cls, tuple ([r, g, b]));
	});},
	get _make () {return __getcm__ (this, function (cls, iterable, py_new, len) {
		if (typeof py_new == 'undefined' || (py_new != null && py_new.hasOwnProperty ("__kwargtrans__"))) {;
			var py_new = tuple.__new__;
		};
		if (typeof len == 'undefined' || (len != null && len.hasOwnProperty ("__kwargtrans__"))) {;
			var len = len;
		};
		var result = py_new (cls, iterable);
		if (len (result) != 3) {
			var __except0__ = py_TypeError (__mod__ ('Expected 3 arguments, got %d', len (result)));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return __mod__ ('Color(r=%r, g=%r, b=%r)', self);
	});},
	get _asdict () {return __get__ (this, function (self) {
		return OrderedDict (zip (self._fields, self));
	});},
	get _replace () {return __get__ (this, function (_self) {
		var result = _self._make (map (kwds.py_pop, tuple (['r', 'g', 'b']), _self));
		if (kwds) {
			var __except0__ = ValueError (__mod__ ('Got unexpected field names: %r', kwds.py_keys ()));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __getnewargs__ () {return __get__ (this, function (self) {
		return tuple (self);
	});}
});
export var Point =  __class__ ('Point', [tuple], {
	__module__: __name__,
	__slots__: tuple ([]),
	_fields: tuple (['x', 'y']),
	get __new__ () {return __get__ (this, function (_cls, x, y) {
		return tuple.__new__ (_cls, tuple ([x, y]));
	});},
	get _make () {return __getcm__ (this, function (cls, iterable, py_new, len) {
		if (typeof py_new == 'undefined' || (py_new != null && py_new.hasOwnProperty ("__kwargtrans__"))) {;
			var py_new = tuple.__new__;
		};
		if (typeof len == 'undefined' || (len != null && len.hasOwnProperty ("__kwargtrans__"))) {;
			var len = len;
		};
		var result = py_new (cls, iterable);
		if (len (result) != 2) {
			var __except0__ = py_TypeError (__mod__ ('Expected 2 arguments, got %d', len (result)));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return __mod__ ('Point(x=%r, y=%r)', self);
	});},
	get _asdict () {return __get__ (this, function (self) {
		return OrderedDict (zip (self._fields, self));
	});},
	get _replace () {return __get__ (this, function (_self) {
		var result = _self._make (map (kwds.py_pop, tuple (['x', 'y']), _self));
		if (kwds) {
			var __except0__ = ValueError (__mod__ ('Got unexpected field names: %r', kwds.py_keys ()));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __getnewargs__ () {return __get__ (this, function (self) {
		return tuple (self);
	});}
});
export var Rect =  __class__ ('Rect', [tuple], {
	__module__: __name__,
	__slots__: tuple ([]),
	_fields: tuple (['t', 'l', 'b', 'r']),
	get __new__ () {return __get__ (this, function (_cls, t, l, b, r) {
		return tuple.__new__ (_cls, tuple ([float (t), float (l), float (b), float (r)]));
	});},
	get _make () {return __getcm__ (this, function (cls, iterable, py_new, len) {
		if (typeof py_new == 'undefined' || (py_new != null && py_new.hasOwnProperty ("__kwargtrans__"))) {;
			var py_new = tuple.__new__;
		};
		if (typeof len == 'undefined' || (len != null && len.hasOwnProperty ("__kwargtrans__"))) {;
			var len = len;
		};
		var result = py_new (cls, iterable);
		if (len (result) != 4) {
			var __except0__ = py_TypeError (__mod__ ('Expected 4 arguments, got %d', len (result)));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return __mod__ ('Rect(t=%r, l=%r, b=%r, r=%r)', self);
	});},
	get _asdict () {return __get__ (this, function (self) {
		return OrderedDict (zip (self._fields, self));
	});},
	get _replace () {return __get__ (this, function (_self) {
		var result = _self._make (map (kwds.py_pop, tuple (['t', 'l', 'b', 'r']), _self));
		if (kwds) {
			var __except0__ = ValueError (__mod__ ('Got unexpected field names: %r', kwds.py_keys ()));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __getnewargs__ () {return __get__ (this, function (self) {
		return tuple (self);
	});}
});
export var Feature =  __class__ ('Feature', [tuple], {
	__module__: __name__,
	__slots__: tuple ([]),
	_fields: tuple (['index', 'name', 'layer_set', 'full_name', 'scale', 'type', 'palette', 'clip']),
	get __new__ () {return __get__ (this, function (_cls, index, py_name, layer_set, full_name, scale, py_metatype, palette, clip) {
		return tuple.__new__ (_cls, tuple ([index, py_name, layer_set, full_name, scale, py_metatype, palette, clip]));
	});},
	get _make () {return __getcm__ (this, function (cls, iterable, py_new, len) {
		if (typeof py_new == 'undefined' || (py_new != null && py_new.hasOwnProperty ("__kwargtrans__"))) {;
			var py_new = tuple.__new__;
		};
		if (typeof len == 'undefined' || (len != null && len.hasOwnProperty ("__kwargtrans__"))) {;
			var len = len;
		};
		var result = py_new (cls, iterable);
		if (len (result) != 8) {
			var __except0__ = py_TypeError (__mod__ ('Expected 8 arguments, got %d', len (result)));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return __mod__ ('Feature(index=%r, name=%r, layer_set=%r, full_name=%r, scale=%r, type=%r, palette=%r, clip=%r)', self);
	});},
	get _asdict () {return __get__ (this, function (self) {
		return OrderedDict (zip (self._fields, self));
	});},
	get _replace () {return __get__ (this, function (_self) {
		var result = _self._make (map (kwds.py_pop, tuple (['index', 'name', 'layer_set', 'full_name', 'scale', 'type', 'palette', 'clip']), _self));
		if (kwds) {
			var __except0__ = ValueError (__mod__ ('Got unexpected field names: %r', kwds.py_keys ()));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __getnewargs__ () {return __get__ (this, function (self) {
		return tuple (self);
	});}
});
export var ScreenFeatures =  __class__ ('ScreenFeatures', [tuple], {
	__module__: __name__,
	__slots__: tuple ([]),
	_fields: tuple (['height_map', 'visibility_map', 'creep', 'power', 'player_id', 'player_relative', 'unit_type', 'selected', 'unit_hit_points', 'unit_hit_points_ratio', 'unit_energy', 'unit_energy_ratio', 'unit_shields', 'unit_shields_ratio', 'unit_density', 'unit_density_aa', 'effects', 'hallucinations', 'cloaked', 'blip', 'buffs', 'buff_duration', 'active', 'build_progress', 'pathable', 'buildable', 'placeholder']),
	get __new__ () {return __get__ (this, function (_cls, height_map, visibility_map, creep, power, player_id, player_relative, unit_type, selected, unit_hit_points, unit_hit_points_ratio, unit_energy, unit_energy_ratio, unit_shields, unit_shields_ratio, unit_density, unit_density_aa, effects, hallucinations, cloaked, blip, buffs, buff_duration, active, build_progress, pathable, buildable, placeholder) {
		return tuple.__new__ (_cls, tuple ([height_map, visibility_map, creep, power, player_id, player_relative, unit_type, selected, unit_hit_points, unit_hit_points_ratio, unit_energy, unit_energy_ratio, unit_shields, unit_shields_ratio, unit_density, unit_density_aa, effects, hallucinations, cloaked, blip, buffs, buff_duration, active, build_progress, pathable, buildable, placeholder]));
	});},
	get _make () {return __getcm__ (this, function (cls, iterable, py_new, len) {
		if (typeof py_new == 'undefined' || (py_new != null && py_new.hasOwnProperty ("__kwargtrans__"))) {;
			var py_new = tuple.__new__;
		};
		if (typeof len == 'undefined' || (len != null && len.hasOwnProperty ("__kwargtrans__"))) {;
			var len = len;
		};
		var result = py_new (cls, iterable);
		if (len (result) != 27) {
			var __except0__ = py_TypeError (__mod__ ('Expected 27 arguments, got %d', len (result)));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return __mod__ ('ScreenFeatures(height_map=%r, visibility_map=%r, creep=%r, power=%r, player_id=%r, player_relative=%r, unit_type=%r, selected=%r, unit_hit_points=%r, unit_hit_points_ratio=%r, unit_energy=%r, unit_energy_ratio=%r, unit_shields=%r, unit_shields_ratio=%r, unit_density=%r, unit_density_aa=%r, effects=%r, hallucinations=%r, cloaked=%r, blip=%r, buffs=%r, buff_duration=%r, active=%r, build_progress=%r, pathable=%r, buildable=%r, placeholder=%r)', self);
	});},
	get _asdict () {return __get__ (this, function (self) {
		return OrderedDict (zip (self._fields, self));
	});},
	get _replace () {return __get__ (this, function (_self) {
		var result = _self._make (map (kwds.py_pop, tuple (['height_map', 'visibility_map', 'creep', 'power', 'player_id', 'player_relative', 'unit_type', 'selected', 'unit_hit_points', 'unit_hit_points_ratio', 'unit_energy', 'unit_energy_ratio', 'unit_shields', 'unit_shields_ratio', 'unit_density', 'unit_density_aa', 'effects', 'hallucinations', 'cloaked', 'blip', 'buffs', 'buff_duration', 'active', 'build_progress', 'pathable', 'buildable', 'placeholder']), _self));
		if (kwds) {
			var __except0__ = ValueError (__mod__ ('Got unexpected field names: %r', kwds.py_keys ()));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __getnewargs__ () {return __get__ (this, function (self) {
		return tuple (self);
	});}
});
export var MinimapFeatures =  __class__ ('MinimapFeatures', [tuple], {
	__module__: __name__,
	__slots__: tuple ([]),
	_fields: tuple (['height_map', 'visibility_map', 'creep', 'camera', 'player_id', 'player_relative', 'selected', 'unit_type', 'alerts', 'pathable', 'buildable']),
	get __new__ () {return __get__ (this, function (_cls, height_map, visibility_map, creep, camera, player_id, player_relative, selected, unit_type, alerts, pathable, buildable) {
		return tuple.__new__ (_cls, tuple ([height_map, visibility_map, creep, camera, player_id, player_relative, selected, unit_type, alerts, pathable, buildable]));
	});},
	get _make () {return __getcm__ (this, function (cls, iterable, py_new, len) {
		if (typeof py_new == 'undefined' || (py_new != null && py_new.hasOwnProperty ("__kwargtrans__"))) {;
			var py_new = tuple.__new__;
		};
		if (typeof len == 'undefined' || (len != null && len.hasOwnProperty ("__kwargtrans__"))) {;
			var len = len;
		};
		var result = py_new (cls, iterable);
		if (len (result) != 11) {
			var __except0__ = py_TypeError (__mod__ ('Expected 11 arguments, got %d', len (result)));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __repr__ () {return __get__ (this, function (self) {
		return __mod__ ('MinimapFeatures(height_map=%r, visibility_map=%r, creep=%r, camera=%r, player_id=%r, player_relative=%r, selected=%r, unit_type=%r, alerts=%r, pathable=%r, buildable=%r)', self);
	});},
	get _asdict () {return __get__ (this, function (self) {
		return OrderedDict (zip (self._fields, self));
	});},
	get _replace () {return __get__ (this, function (_self) {
		var result = _self._make (map (kwds.py_pop, tuple (['height_map', 'visibility_map', 'creep', 'camera', 'player_id', 'player_relative', 'selected', 'unit_type', 'alerts', 'pathable', 'buildable']), _self));
		if (kwds) {
			var __except0__ = ValueError (__mod__ ('Got unexpected field names: %r', kwds.py_keys ()));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		return result;
	});},
	get __getnewargs__ () {return __get__ (this, function (self) {
		return tuple (self);
	});}
});

//# sourceMappingURL=stuff.map