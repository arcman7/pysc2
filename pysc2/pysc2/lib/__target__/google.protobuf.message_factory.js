// Transcrypt'ed from Python, 2020-03-09 12:11:03
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import {python_message as message_impl} from './google.protobuf.internal.js';
import * as message_impl from './google.protobuf.pyext.cpp_message.js';
import * as message from './google.protobuf.message.js';
import {descriptor_pool} from './google.protobuf.js';
import {api_implementation} from './google.protobuf.internal.js';
var __name__ = 'google.protobuf.message_factory';
export var __author__ = 'matthewtoia@google.com (Matt Toia)';
if (api_implementation.Type () == 'cpp') {
}
else {
}
export var _GENERATED_PROTOCOL_MESSAGE_TYPE = message_impl.GeneratedProtocolMessageType;
export var MessageFactory =  __class__ ('MessageFactory', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self, pool) {
		if (typeof pool == 'undefined' || (pool != null && pool.hasOwnProperty ("__kwargtrans__"))) {;
			var pool = null;
		};
		self.pool = pool || descriptor_pool.DescriptorPool ();
		self._classes = dict ({});
	});},
	get GetPrototype () {return __get__ (this, function (self, descriptor) {
		if (!__in__ (descriptor, self._classes)) {
			var descriptor_name = descriptor.py_name;
			if (str === bytes) {
				var descriptor_name = descriptor.py_name.encode ('ascii', 'ignore');
			}
			var result_class = _GENERATED_PROTOCOL_MESSAGE_TYPE (descriptor_name, tuple ([message.Message]), dict ({'DESCRIPTOR': descriptor, '__module__': null}));
			self._classes [descriptor] = result_class;
			for (var field of descriptor.fields) {
				if (field.message_type) {
					self.GetPrototype (field.message_type);
				}
			}
			for (var extension of result_class.DESCRIPTOR.extensions) {
				if (!__in__ (extension.containing_type, self._classes)) {
					self.GetPrototype (extension.containing_type);
				}
				var extended_class = self._classes [extension.containing_type];
				extended_class.RegisterExtension (extension);
			}
		}
		return self._classes [descriptor];
	});},
	get GetMessages () {return __get__ (this, function (self, files) {
		var result = dict ({});
		for (var file_name of files) {
			var file_desc = self.pool.FindFileByName (file_name);
			for (var desc of file_desc.message_types_by_name.py_values ()) {
				result [desc.full_name] = self.GetPrototype (desc);
			}
			for (var extension of file_desc.extensions_by_name.py_values ()) {
				if (!__in__ (extension.containing_type, self._classes)) {
					self.GetPrototype (extension.containing_type);
				}
				var extended_class = self._classes [extension.containing_type];
				extended_class.RegisterExtension (extension);
			}
		}
		return result;
	});}
});
export var _FACTORY = MessageFactory ();
export var GetMessages = function (file_protos) {
	var file_by_name = (function () {
		var __accu0__ = [];
		for (var file_proto of file_protos) {
			__accu0__.append ([file_proto.py_name, file_proto]);
		}
		return dict (__accu0__);
	}) ();
	var _AddFile = function (file_proto) {
		for (var dependency of file_proto.dependency) {
			if (__in__ (dependency, file_by_name)) {
				_AddFile (file_by_name.py_pop (dependency));
			}
		}
		_FACTORY.pool.Add (file_proto);
	};
	while (file_by_name) {
		_AddFile (file_by_name.py_popitem () [1]);
	}
	return _FACTORY.GetMessages ((function () {
		var __accu0__ = [];
		for (var file_proto of file_protos) {
			__accu0__.append (file_proto.py_name);
		}
		return __accu0__;
	}) ());
};

//# sourceMappingURL=google.protobuf.message_factory.map