// Transcrypt'ed from Python, 2020-03-07 14:37:39
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
var __name__ = 'google.protobuf.message';
export var __author__ = 'robinson@google.com (Will Robinson)';
export var Error =  __class__ ('Error', [Exception], {
	__module__: __name__,
});
export var DecodeError =  __class__ ('DecodeError', [Error], {
	__module__: __name__,
});
export var EncodeError =  __class__ ('EncodeError', [Error], {
	__module__: __name__,
});
export var Message =  __class__ ('Message', [object], {
	__module__: __name__,
	__slots__: [],
	DESCRIPTOR: null,
	get __deepcopy__ () {return __get__ (this, function (self, memo) {
		if (typeof memo == 'undefined' || (memo != null && memo.hasOwnProperty ("__kwargtrans__"))) {;
			var memo = null;
		};
		var clone = py_typeof (self) ();
		clone.MergeFrom (self);
		return clone;
	});},
	get __eq__ () {return __get__ (this, function (self, other_msg) {
		var __except0__ = NotImplementedError;
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get __ne__ () {return __get__ (this, function (self, other_msg) {
		return !(self == other_msg);
	});},
	get __hash__ () {return __get__ (this, function (self) {
		var __except0__ = py_TypeError ('unhashable object');
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get __str__ () {return __get__ (this, function (self) {
		var __except0__ = NotImplementedError;
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get __unicode__ () {return __get__ (this, function (self) {
		var __except0__ = NotImplementedError;
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get MergeFrom () {return __get__ (this, function (self, other_msg) {
		var __except0__ = NotImplementedError;
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get CopyFrom () {return __get__ (this, function (self, other_msg) {
		if (self === other_msg) {
			return ;
		}
		self.Clear ();
		self.MergeFrom (other_msg);
	});},
	get Clear () {return __get__ (this, function (self) {
		var __except0__ = NotImplementedError;
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get SetInParent () {return __get__ (this, function (self) {
		var __except0__ = NotImplementedError;
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get IsInitialized () {return __get__ (this, function (self) {
		var __except0__ = NotImplementedError;
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get MergeFromString () {return __get__ (this, function (self, serialized) {
		var __except0__ = NotImplementedError;
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get ParseFromString () {return __get__ (this, function (self, serialized) {
		self.Clear ();
		self.MergeFromString (serialized);
	});},
	get SerializeToString () {return __get__ (this, function (self) {
		var __except0__ = NotImplementedError;
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get SerializePartialToString () {return __get__ (this, function (self) {
		var __except0__ = NotImplementedError;
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get ListFields () {return __get__ (this, function (self) {
		var __except0__ = NotImplementedError;
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get HasField () {return __get__ (this, function (self, field_name) {
		var __except0__ = NotImplementedError;
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get ClearField () {return __get__ (this, function (self, field_name) {
		var __except0__ = NotImplementedError;
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get WhichOneof () {return __get__ (this, function (self, oneof_group) {
		var __except0__ = NotImplementedError;
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get HasExtension () {return __get__ (this, function (self, extension_handle) {
		var __except0__ = NotImplementedError;
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get ClearExtension () {return __get__ (this, function (self, extension_handle) {
		var __except0__ = NotImplementedError;
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get DiscardUnknownFields () {return __get__ (this, function (self) {
		var __except0__ = NotImplementedError;
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get ByteSize () {return __get__ (this, function (self) {
		var __except0__ = NotImplementedError;
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get _SetListener () {return __get__ (this, function (self, message_listener) {
		var __except0__ = NotImplementedError;
		__except0__.__cause__ = null;
		throw __except0__;
	});},
	get __getstate__ () {return __get__ (this, function (self) {
		return dict (__kwargtrans__ ({serialized: self.SerializePartialToString ()}));
	});},
	get __setstate__ () {return __get__ (this, function (self, state) {
		self.__init__ ();
		self.ParseFromString (state ['serialized']);
	});}
});

//# sourceMappingURL=google.protobuf.message.map