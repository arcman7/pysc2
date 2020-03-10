// Transcrypt'ed from Python, 2020-03-09 12:11:02
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as common_pb2 from './s2clientprotocol.common_pb2.js';
import {proto_diff} from './pysc2.lib.js';
import {np_util} from './pysc2.lib.js';
import {features} from './pysc2.lib.js';
import {print_function} from './__future__.js';
import {division} from './__future__.js';
import {absolute_import} from './__future__.js';
var __name__ = '__main__';
export var image_differencer = function (path, proto_a, proto_b) {
	if (path [-(1)] == 'data' && len (path) >= 2) {
		var image_data_path = proto_diff.ProtoPath (path.__getslice__ (0, -(1), 1));
		var image_data_a = image_data_path.get_field (proto_a);
		if (isinstance (image_data_a, common_pb2.ImageData)) {
			var image_data_b = image_data_path.get_field (proto_b);
			var image_a = features.Feature.unpack_layer (image_data_a);
			var image_b = features.Feature.unpack_layer (image_data_b);
			return np_util.summarize_array_diffs (image_a, image_b);
		}
	}
	return null;
};

//# sourceMappingURL=image_differencer.map