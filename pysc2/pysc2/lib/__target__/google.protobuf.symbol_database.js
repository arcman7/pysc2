// Transcrypt'ed from Python, 2020-03-09 12:11:03
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as message_factory from './google.protobuf.message_factory.js';
import * as descriptor_pool from './google.protobuf.descriptor_pool.js';
import * as api_implementation from './google.protobuf.internal.api_implementation.js';
var __name__ = 'google.protobuf.symbol_database';
export var SymbolDatabase =  __class__ ('SymbolDatabase', [message_factory.MessageFactory], {
	__module__: __name__,
	get RegisterMessage () {return __get__ (this, function (self, message) {
		var desc = message.DESCRIPTOR;
		self._classes [desc] = message;
		self.RegisterMessageDescriptor (desc);
		return message;
	});},
	get RegisterMessageDescriptor () {return __get__ (this, function (self, message_descriptor) {
		if (api_implementation.Type () == 'python') {
			self.pool._AddDescriptor (message_descriptor);
		}
	});},
	get RegisterEnumDescriptor () {return __get__ (this, function (self, enum_descriptor) {
		if (api_implementation.Type () == 'python') {
			self.pool._AddEnumDescriptor (enum_descriptor);
		}
		return enum_descriptor;
	});},
	get RegisterServiceDescriptor () {return __get__ (this, function (self, service_descriptor) {
		if (api_implementation.Type () == 'python') {
			self.pool._AddServiceDescriptor (service_descriptor);
		}
	});},
	get RegisterFileDescriptor () {return __get__ (this, function (self, file_descriptor) {
		if (api_implementation.Type () == 'python') {
			self.pool._InternalAddFileDescriptor (file_descriptor);
		}
	});},
	get GetSymbol () {return __get__ (this, function (self, symbol) {
		return self._classes [self.pool.FindMessageTypeByName (symbol)];
	});},
	get GetMessages () {return __get__ (this, function (self, files) {
		var _GetAllMessages = function* (desc) {
			yield desc;
			for (var msg_desc of desc.nested_types) {
				for (var nested_desc of _GetAllMessages (msg_desc)) {
					yield nested_desc;
				}
			}
			};
		var result = dict ({});
		for (var file_name of files) {
			var file_desc = self.pool.FindFileByName (file_name);
			for (var msg_desc of file_desc.message_types_by_name.py_values ()) {
				for (var desc of _GetAllMessages (msg_desc)) {
					try {
						result [desc.full_name] = self._classes [desc];
					}
					catch (__except0__) {
						if (isinstance (__except0__, KeyError)) {
							// pass;
						}
						else {
							throw __except0__;
						}
					}
				}
			}
		}
		return result;
	});}
});
export var _DEFAULT = SymbolDatabase (__kwargtrans__ ({pool: descriptor_pool.Default ()}));
export var Default = function () {
	return _DEFAULT;
};

//# sourceMappingURL=google.protobuf.symbol_database.map