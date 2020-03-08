// Transcrypt'ed from Python, 2020-03-07 14:37:38
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {python_message as message_impl} from './google.protobuf.internal.js';
import * as message_impl from './google.protobuf.pyext.cpp_message.js';
import * as message from './google.protobuf.message.js';
import {api_implementation} from './google.protobuf.internal.js';
var __name__ = 'google.protobuf.reflection';
export var __author__ = 'robinson@google.com (Will Robinson)';
if (api_implementation.Type () == 'cpp') {
}
else {
}
export var GeneratedProtocolMessageType = message_impl.GeneratedProtocolMessageType;
export var MESSAGE_CLASS_CACHE = dict ({});
export var ParseMessage = function (descriptor, byte_str) {
	var result_class = MakeClass (descriptor);
	var new_msg = result_class ();
	new_msg.ParseFromString (byte_str);
	return new_msg;
};
export var MakeClass = function (descriptor) {
	if (__in__ (descriptor, MESSAGE_CLASS_CACHE)) {
		return MESSAGE_CLASS_CACHE [descriptor];
	}
	var attributes = dict ({});
	for (var [py_name, nested_type] of list (descriptor.nested_types_by_name.py_items ())) {
		attributes [py_name] = MakeClass (nested_type);
	}
	attributes [GeneratedProtocolMessageType._DESCRIPTOR_KEY] = descriptor;
	var result = GeneratedProtocolMessageType (str (descriptor.py_name), tuple ([message.Message]), attributes);
	MESSAGE_CLASS_CACHE [descriptor] = result;
	return result;
};

//# sourceMappingURL=google.protobuf.reflection.map