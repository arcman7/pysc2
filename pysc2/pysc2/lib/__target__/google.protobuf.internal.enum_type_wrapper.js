// Transcrypt'ed from Python, 2020-03-09 12:11:04
var six = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as __module_six__ from './six.js';
__nest__ (six, '', __module_six__);
var __name__ = 'google.protobuf.internal.enum_type_wrapper';
export var __author__ = 'rabsatt@google.com (Kevin Rabsatt)';
export var EnumTypeWrapper =  __class__ ('EnumTypeWrapper', [object], {
	__module__: __name__,
	DESCRIPTOR: null,
	get __init__ () {return __get__ (this, function (self, enum_type) {
		self._enum_type = enum_type;
		self.DESCRIPTOR = enum_type;
	});},
	get Name () {return __get__ (this, function (self, number) {
		if (__in__ (number, self._enum_type.values_by_number)) {
			return self._enum_type.values_by_number [number].py_name;
		}
		if (!(isinstance (number, six.integer_types))) {
			var __except0__ = py_TypeError (__mod__ ('Enum value for %s must be an int, but got %r.', tuple ([self._enum_type.py_name, number])));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		else {
			var __except0__ = ValueError (__mod__ ('Enum %s has no name defined for value %r', tuple ([self._enum_type.py_name, number])));
			__except0__.__cause__ = null;
			throw __except0__;
		}
	});},
	get Value () {return __get__ (this, function (self, py_name) {
		if (__in__ (py_name, self._enum_type.values_by_name)) {
			return self._enum_type.values_by_name [py_name].number;
		}
		var __except0__ = ValueError (__mod__ ('Enum %s has no value defined for name %s', tuple ([self._enum_type.py_name, py_name])));
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get py_keys () {return __get__ (this, function (self) {
		return (function () {
			var __accu0__ = [];
			for (var value_descriptor of self._enum_type.py_values) {
				__accu0__.append (value_descriptor.py_name);
			}
			return __accu0__;
		}) ();
	});},
	get py_values () {return __get__ (this, function (self) {
		return (function () {
			var __accu0__ = [];
			for (var value_descriptor of self._enum_type.py_values) {
				__accu0__.append (value_descriptor.number);
			}
			return __accu0__;
		}) ();
	});},
	get py_items () {return __get__ (this, function (self) {
		return (function () {
			var __accu0__ = [];
			for (var value_descriptor of self._enum_type.py_values) {
				__accu0__.append (tuple ([value_descriptor.py_name, value_descriptor.number]));
			}
			return __accu0__;
		}) ();
	});},
	get __getattr__ () {return __get__ (this, function (self, py_name) {
		if (__in__ (py_name, self._enum_type.values_by_name)) {
			return self._enum_type.values_by_name [py_name].number;
		}
		var __except0__ = AttributeError;
		__except0__.__cause__ = null;
		throw __except0__;
	});}
});

//# sourceMappingURL=google.protobuf.internal.enum_type_wrapper.map