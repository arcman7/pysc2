// Transcrypt'ed from Python, 2020-03-07 14:37:40
var warnings = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as __module_warnings__ from './warnings.js';
__nest__ (warnings, '', __module_warnings__);
var __name__ = 'google.protobuf.descriptor_database';
export var __author__ = 'matthewtoia@google.com (Matt Toia)';
export var Error =  __class__ ('Error', [Exception], {
	__module__: __name__,
});
export var DescriptorDatabaseConflictingDefinitionError =  __class__ ('DescriptorDatabaseConflictingDefinitionError', [Error], {
	__module__: __name__,
});
export var DescriptorDatabase =  __class__ ('DescriptorDatabase', [object], {
	__module__: __name__,
	get __init__ () {return __get__ (this, function (self) {
		self._file_desc_protos_by_file = dict ({});
		self._file_desc_protos_by_symbol = dict ({});
	});},
	get Add () {return __get__ (this, function (self, file_desc_proto) {
		var proto_name = file_desc_proto.py_name;
		if (!__in__ (proto_name, self._file_desc_protos_by_file)) {
			self._file_desc_protos_by_file [proto_name] = file_desc_proto;
		}
		else if (self._file_desc_protos_by_file [proto_name] != file_desc_proto) {
			var __except0__ = DescriptorDatabaseConflictingDefinitionError (__mod__ ('%s already added, but with different descriptor.', proto_name));
			__except0__.__cause__ = null;
			throw __except0__;
		}
		else {
			return ;
		}
		var package = file_desc_proto.package;
		for (var message of file_desc_proto.message_type) {
			for (var py_name of _ExtractSymbols (message, package)) {
				self._AddSymbol (py_name, file_desc_proto);
			}
		}
		for (var enum of file_desc_proto.enum_type) {
			self._AddSymbol ('.'.join (tuple ([package, enum.py_name])), file_desc_proto);
		}
		for (var extension of file_desc_proto.extension) {
			self._AddSymbol ('.'.join (tuple ([package, extension.py_name])), file_desc_proto);
		}
		for (var service of file_desc_proto.service) {
			self._AddSymbol ('.'.join (tuple ([package, service.py_name])), file_desc_proto);
		}
	});},
	get FindFileByName () {return __get__ (this, function (self, py_name) {
		return self._file_desc_protos_by_file [py_name];
	});},
	get FindFileContainingSymbol () {return __get__ (this, function (self, symbol) {
		try {
			return self._file_desc_protos_by_symbol [symbol];
		}
		catch (__except0__) {
			if (isinstance (__except0__, KeyError)) {
				var __left0__ = symbol.rpartition ('.');
				var top_level = __left0__ [0];
				var _ = __left0__ [1];
				var _ = __left0__ [2];
				return self._file_desc_protos_by_symbol [top_level];
			}
			else {
				throw __except0__;
			}
		}
	});},
	get _AddSymbol () {return __get__ (this, function (self, py_name, file_desc_proto) {
		if (__in__ (py_name, self._file_desc_protos_by_symbol)) {
			var warn_msg = ((((('Conflict register for file "' + file_desc_proto.py_name) + '": ') + py_name) + ' is already defined in file "') + self._file_desc_protos_by_symbol [py_name].py_name) + '"';
			warnings.warn (warn_msg, RuntimeWarning);
		}
		self._file_desc_protos_by_symbol [py_name] = file_desc_proto;
	});}
});
export var _ExtractSymbols = function* (desc_proto, package) {
	var message_name = (package ? (package + '.') + desc_proto.py_name : desc_proto.py_name);
	yield message_name;
	for (var nested_type of desc_proto.nested_type) {
		for (var symbol of _ExtractSymbols (nested_type, message_name)) {
			yield symbol;
		}
	}
	for (var enum_type of desc_proto.enum_type) {
		yield '.'.join (tuple ([message_name, enum_type.py_name]));
	}
	};

//# sourceMappingURL=google.protobuf.descriptor_database.map