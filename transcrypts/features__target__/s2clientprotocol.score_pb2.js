// Transcrypt'ed from Python, 2020-03-07 14:37:41
var sys = {};
import {AssertionError, AttributeError, BaseException, DeprecationWarning, Exception, IndexError, IterableError, KeyError, NotImplementedError, RuntimeWarning, StopIteration, UserWarning, ValueError, Warning, __JsIterator__, __PyIterator__, __Terminal__, __add__, __and__, __call__, __class__, __envir__, __eq__, __floordiv__, __ge__, __get__, __getcm__, __getitem__, __getslice__, __getsm__, __gt__, __i__, __iadd__, __iand__, __idiv__, __ijsmod__, __ilshift__, __imatmul__, __imod__, __imul__, __in__, __init__, __ior__, __ipow__, __irshift__, __isub__, __ixor__, __jsUsePyNext__, __jsmod__, __k__, __kwargtrans__, __le__, __lshift__, __lt__, __matmul__, __mergefields__, __mergekwargtrans__, __mod__, __mul__, __ne__, __neg__, __nest__, __or__, __pow__, __pragma__, __proxy__, __pyUseJsNext__, __rshift__, __setitem__, __setproperty__, __setslice__, __sort__, __specialattrib__, __sub__, __super__, __t__, __terminal__, __truediv__, __withblock__, __xor__, abs, all, any, assert, bool, bytearray, bytes, callable, chr, copy, deepcopy, delattr, dict, dir, divmod, enumerate, filter, float, getattr, hasattr, input, int, isinstance, issubclass, len, list, map, max, min, object, ord, pow, print, property, py_TypeError, py_iter, py_metatype, py_next, py_reversed, py_typeof, range, repr, round, set, setattr, sorted, str, sum, tuple, zip} from './org.transcrypt.__runtime__.js';
import * as descriptor_pb2 from './google.protobuf.descriptor_pb2.js';
import * as _symbol_database from './google.protobuf.symbol_database.js';
import * as _reflection from './google.protobuf.reflection.js';
import * as _message from './google.protobuf.message.js';
import * as _descriptor from './google.protobuf.descriptor.js';
import * as __module_sys__ from './sys.js';
__nest__ (sys, '', __module_sys__);
var __name__ = 's2clientprotocol.score_pb2';
export var _b = sys.version_info [0] < 3 && (function __lambda__ (x) {
	return x;
}) || (function __lambda__ (x) {
	return x.encode ('latin1');
});
export var _sym_db = _symbol_database.Default ();
export var DESCRIPTOR = _descriptor.FileDescriptor (__kwargtrans__ ({py_name: 's2clientprotocol/score.proto', package: 'SC2APIProtocol', syntax: 'proto2', serialized_pb: _b ('\n\x1cs2clientprotocol/score.proto\x12\x0eSC2APIProtocol"¨\x01\n\x05Score\x123\n\nscore_type\x18\x06 \x01(\x0e2\x1f.SC2APIProtocol.Score.ScoreType\x12\r\n\x05score\x18\x07 \x01(\x05\x123\n\rscore_details\x18\x08 \x01(\x0b2\x1c.SC2APIProtocol.ScoreDetails"&\n\tScoreType\x12\x0e\n\nCurriculum\x10\x01\x12\t\n\x05Melee\x10\x02"h\n\x14CategoryScoreDetails\x12\x0c\n\x04none\x18\x01 \x01(\x02\x12\x0c\n\x04army\x18\x02 \x01(\x02\x12\x0f\n\x07economy\x18\x03 \x01(\x02\x12\x12\n\ntechnology\x18\x04 \x01(\x02\x12\x0f\n\x07upgrade\x18\x05 \x01(\x02"B\n\x11VitalScoreDetails\x12\x0c\n\x04life\x18\x01 \x01(\x02\x12\x0f\n\x07shields\x18\x02 \x01(\x02\x12\x0e\n\x06energy\x18\x03 \x01(\x02"\x8a\n\n\x0cScoreDetails\x12\x1c\n\x14idle_production_time\x18\x01 \x01(\x02\x12\x18\n\x10idle_worker_time\x18\x02 \x01(\x02\x12\x19\n\x11total_value_units\x18\x03 \x01(\x02\x12\x1e\n\x16total_value_structures\x18\x04 \x01(\x02\x12\x1a\n\x12killed_value_units\x18\x05 \x01(\x02\x12\x1f\n\x17killed_value_structures\x18\x06 \x01(\x02\x12\x1a\n\x12collected_minerals\x18\x07 \x01(\x02\x12\x19\n\x11collected_vespene\x18\x08 \x01(\x02\x12 \n\x18collection_rate_minerals\x18\t \x01(\x02\x12\x1f\n\x17collection_rate_vespene\x18\n \x01(\x02\x12\x16\n\x0espent_minerals\x18\x0b \x01(\x02\x12\x15\n\rspent_vespene\x18\x0c \x01(\x02\x127\n\tfood_used\x18\r \x01(\x0b2$.SC2APIProtocol.CategoryScoreDetails\x12=\n\x0fkilled_minerals\x18\x0e \x01(\x0b2$.SC2APIProtocol.CategoryScoreDetails\x12<\n\x0ekilled_vespene\x18\x0f \x01(\x0b2$.SC2APIProtocol.CategoryScoreDetails\x12;\n\rlost_minerals\x18\x10 \x01(\x0b2$.SC2APIProtocol.CategoryScoreDetails\x12:\n\x0clost_vespene\x18\x11 \x01(\x0b2$.SC2APIProtocol.CategoryScoreDetails\x12D\n\x16friendly_fire_minerals\x18\x12 \x01(\x0b2$.SC2APIProtocol.CategoryScoreDetails\x12C\n\x15friendly_fire_vespene\x18\x13 \x01(\x0b2$.SC2APIProtocol.CategoryScoreDetails\x12;\n\rused_minerals\x18\x14 \x01(\x0b2$.SC2APIProtocol.CategoryScoreDetails\x12:\n\x0cused_vespene\x18\x15 \x01(\x0b2$.SC2APIProtocol.CategoryScoreDetails\x12A\n\x13total_used_minerals\x18\x16 \x01(\x0b2$.SC2APIProtocol.CategoryScoreDetails\x12@\n\x12total_used_vespene\x18\x17 \x01(\x0b2$.SC2APIProtocol.CategoryScoreDetails\x12=\n\x12total_damage_dealt\x18\x18 \x01(\x0b2!.SC2APIProtocol.VitalScoreDetails\x12=\n\x12total_damage_taken\x18\x19 \x01(\x0b2!.SC2APIProtocol.VitalScoreDetails\x127\n\x0ctotal_healed\x18\x1a \x01(\x0b2!.SC2APIProtocol.VitalScoreDetails\x12\x13\n\x0bcurrent_apm\x18\x1b \x01(\x02\x12\x1d\n\x15current_effective_apm\x18\x1c \x01(\x02')}));
export var _SCORE_SCORETYPE = _descriptor.EnumDescriptor (__kwargtrans__ ({py_name: 'ScoreType', full_name: 'SC2APIProtocol.Score.ScoreType', filename: null, file: DESCRIPTOR, py_values: [_descriptor.EnumValueDescriptor (__kwargtrans__ ({py_name: 'Curriculum', index: 0, number: 1, options: null, py_metatype: null})), _descriptor.EnumValueDescriptor (__kwargtrans__ ({py_name: 'Melee', index: 1, number: 2, options: null, py_metatype: null}))], containing_type: null, options: null, serialized_start: 179, serialized_end: 217}));
_sym_db.RegisterEnumDescriptor (_SCORE_SCORETYPE);
export var _SCORE = _descriptor.Descriptor (__kwargtrans__ ({py_name: 'Score', full_name: 'SC2APIProtocol.Score', filename: null, file: DESCRIPTOR, containing_type: null, fields: [_descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'score_type', full_name: 'SC2APIProtocol.Score.score_type', index: 0, number: 6, py_metatype: 14, cpp_type: 8, label: 1, has_default_value: false, default_value: 1, message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'score', full_name: 'SC2APIProtocol.Score.score', index: 1, number: 7, py_metatype: 5, cpp_type: 1, label: 1, has_default_value: false, default_value: 0, message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'score_details', full_name: 'SC2APIProtocol.Score.score_details', index: 2, number: 8, py_metatype: 11, cpp_type: 10, label: 1, has_default_value: false, default_value: null, message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null}))], extensions: [], nested_types: [], enum_types: [_SCORE_SCORETYPE], options: null, is_extendable: false, syntax: 'proto2', extension_ranges: [], oneofs: [], serialized_start: 49, serialized_end: 217}));
export var _CATEGORYSCOREDETAILS = _descriptor.Descriptor (__kwargtrans__ ({py_name: 'CategoryScoreDetails', full_name: 'SC2APIProtocol.CategoryScoreDetails', filename: null, file: DESCRIPTOR, containing_type: null, fields: [_descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'none', full_name: 'SC2APIProtocol.CategoryScoreDetails.none', index: 0, number: 1, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'army', full_name: 'SC2APIProtocol.CategoryScoreDetails.army', index: 1, number: 2, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'economy', full_name: 'SC2APIProtocol.CategoryScoreDetails.economy', index: 2, number: 3, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'technology', full_name: 'SC2APIProtocol.CategoryScoreDetails.technology', index: 3, number: 4, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'upgrade', full_name: 'SC2APIProtocol.CategoryScoreDetails.upgrade', index: 4, number: 5, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null}))], extensions: [], nested_types: [], enum_types: [], options: null, is_extendable: false, syntax: 'proto2', extension_ranges: [], oneofs: [], serialized_start: 219, serialized_end: 323}));
export var _VITALSCOREDETAILS = _descriptor.Descriptor (__kwargtrans__ ({py_name: 'VitalScoreDetails', full_name: 'SC2APIProtocol.VitalScoreDetails', filename: null, file: DESCRIPTOR, containing_type: null, fields: [_descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'life', full_name: 'SC2APIProtocol.VitalScoreDetails.life', index: 0, number: 1, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'shields', full_name: 'SC2APIProtocol.VitalScoreDetails.shields', index: 1, number: 2, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'energy', full_name: 'SC2APIProtocol.VitalScoreDetails.energy', index: 2, number: 3, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null}))], extensions: [], nested_types: [], enum_types: [], options: null, is_extendable: false, syntax: 'proto2', extension_ranges: [], oneofs: [], serialized_start: 325, serialized_end: 391}));
export var _SCOREDETAILS = _descriptor.Descriptor (__kwargtrans__ ({py_name: 'ScoreDetails', full_name: 'SC2APIProtocol.ScoreDetails', filename: null, file: DESCRIPTOR, containing_type: null, fields: [_descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'idle_production_time', full_name: 'SC2APIProtocol.ScoreDetails.idle_production_time', index: 0, number: 1, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'idle_worker_time', full_name: 'SC2APIProtocol.ScoreDetails.idle_worker_time', index: 1, number: 2, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'total_value_units', full_name: 'SC2APIProtocol.ScoreDetails.total_value_units', index: 2, number: 3, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'total_value_structures', full_name: 'SC2APIProtocol.ScoreDetails.total_value_structures', index: 3, number: 4, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'killed_value_units', full_name: 'SC2APIProtocol.ScoreDetails.killed_value_units', index: 4, number: 5, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'killed_value_structures', full_name: 'SC2APIProtocol.ScoreDetails.killed_value_structures', index: 5, number: 6, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'collected_minerals', full_name: 'SC2APIProtocol.ScoreDetails.collected_minerals', index: 6, number: 7, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'collected_vespene', full_name: 'SC2APIProtocol.ScoreDetails.collected_vespene', index: 7, number: 8, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'collection_rate_minerals', full_name: 'SC2APIProtocol.ScoreDetails.collection_rate_minerals', index: 8, number: 9, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'collection_rate_vespene', full_name: 'SC2APIProtocol.ScoreDetails.collection_rate_vespene', index: 9, number: 10, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'spent_minerals', full_name: 'SC2APIProtocol.ScoreDetails.spent_minerals', index: 10, number: 11, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'spent_vespene', full_name: 'SC2APIProtocol.ScoreDetails.spent_vespene', index: 11, number: 12, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'food_used', full_name: 'SC2APIProtocol.ScoreDetails.food_used', index: 12, number: 13, py_metatype: 11, cpp_type: 10, label: 1, has_default_value: false, default_value: null, message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'killed_minerals', full_name: 'SC2APIProtocol.ScoreDetails.killed_minerals', index: 13, number: 14, py_metatype: 11, cpp_type: 10, label: 1, has_default_value: false, default_value: null, message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'killed_vespene', full_name: 'SC2APIProtocol.ScoreDetails.killed_vespene', index: 14, number: 15, py_metatype: 11, cpp_type: 10, label: 1, has_default_value: false, default_value: null, message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'lost_minerals', full_name: 'SC2APIProtocol.ScoreDetails.lost_minerals', index: 15, number: 16, py_metatype: 11, cpp_type: 10, label: 1, has_default_value: false, default_value: null, message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'lost_vespene', full_name: 'SC2APIProtocol.ScoreDetails.lost_vespene', index: 16, number: 17, py_metatype: 11, cpp_type: 10, label: 1, has_default_value: false, default_value: null, message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'friendly_fire_minerals', full_name: 'SC2APIProtocol.ScoreDetails.friendly_fire_minerals', index: 17, number: 18, py_metatype: 11, cpp_type: 10, label: 1, has_default_value: false, default_value: null, message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'friendly_fire_vespene', full_name: 'SC2APIProtocol.ScoreDetails.friendly_fire_vespene', index: 18, number: 19, py_metatype: 11, cpp_type: 10, label: 1, has_default_value: false, default_value: null, message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'used_minerals', full_name: 'SC2APIProtocol.ScoreDetails.used_minerals', index: 19, number: 20, py_metatype: 11, cpp_type: 10, label: 1, has_default_value: false, default_value: null, message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'used_vespene', full_name: 'SC2APIProtocol.ScoreDetails.used_vespene', index: 20, number: 21, py_metatype: 11, cpp_type: 10, label: 1, has_default_value: false, default_value: null, message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'total_used_minerals', full_name: 'SC2APIProtocol.ScoreDetails.total_used_minerals', index: 21, number: 22, py_metatype: 11, cpp_type: 10, label: 1, has_default_value: false, default_value: null, message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'total_used_vespene', full_name: 'SC2APIProtocol.ScoreDetails.total_used_vespene', index: 22, number: 23, py_metatype: 11, cpp_type: 10, label: 1, has_default_value: false, default_value: null, message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'total_damage_dealt', full_name: 'SC2APIProtocol.ScoreDetails.total_damage_dealt', index: 23, number: 24, py_metatype: 11, cpp_type: 10, label: 1, has_default_value: false, default_value: null, message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'total_damage_taken', full_name: 'SC2APIProtocol.ScoreDetails.total_damage_taken', index: 24, number: 25, py_metatype: 11, cpp_type: 10, label: 1, has_default_value: false, default_value: null, message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'total_healed', full_name: 'SC2APIProtocol.ScoreDetails.total_healed', index: 25, number: 26, py_metatype: 11, cpp_type: 10, label: 1, has_default_value: false, default_value: null, message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'current_apm', full_name: 'SC2APIProtocol.ScoreDetails.current_apm', index: 26, number: 27, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null})), _descriptor.FieldDescriptor (__kwargtrans__ ({py_name: 'current_effective_apm', full_name: 'SC2APIProtocol.ScoreDetails.current_effective_apm', index: 27, number: 28, py_metatype: 2, cpp_type: 6, label: 1, has_default_value: false, default_value: float (0), message_type: null, enum_type: null, containing_type: null, is_extension: false, extension_scope: null, options: null}))], extensions: [], nested_types: [], enum_types: [], options: null, is_extendable: false, syntax: 'proto2', extension_ranges: [], oneofs: [], serialized_start: 394, serialized_end: 1684}));
_SCORE.fields_by_name ['score_type'].enum_type = _SCORE_SCORETYPE;
_SCORE.fields_by_name ['score_details'].message_type = _SCOREDETAILS;
_SCORE_SCORETYPE.containing_type = _SCORE;
_SCOREDETAILS.fields_by_name ['food_used'].message_type = _CATEGORYSCOREDETAILS;
_SCOREDETAILS.fields_by_name ['killed_minerals'].message_type = _CATEGORYSCOREDETAILS;
_SCOREDETAILS.fields_by_name ['killed_vespene'].message_type = _CATEGORYSCOREDETAILS;
_SCOREDETAILS.fields_by_name ['lost_minerals'].message_type = _CATEGORYSCOREDETAILS;
_SCOREDETAILS.fields_by_name ['lost_vespene'].message_type = _CATEGORYSCOREDETAILS;
_SCOREDETAILS.fields_by_name ['friendly_fire_minerals'].message_type = _CATEGORYSCOREDETAILS;
_SCOREDETAILS.fields_by_name ['friendly_fire_vespene'].message_type = _CATEGORYSCOREDETAILS;
_SCOREDETAILS.fields_by_name ['used_minerals'].message_type = _CATEGORYSCOREDETAILS;
_SCOREDETAILS.fields_by_name ['used_vespene'].message_type = _CATEGORYSCOREDETAILS;
_SCOREDETAILS.fields_by_name ['total_used_minerals'].message_type = _CATEGORYSCOREDETAILS;
_SCOREDETAILS.fields_by_name ['total_used_vespene'].message_type = _CATEGORYSCOREDETAILS;
_SCOREDETAILS.fields_by_name ['total_damage_dealt'].message_type = _VITALSCOREDETAILS;
_SCOREDETAILS.fields_by_name ['total_damage_taken'].message_type = _VITALSCOREDETAILS;
_SCOREDETAILS.fields_by_name ['total_healed'].message_type = _VITALSCOREDETAILS;
DESCRIPTOR.message_types_by_name ['Score'] = _SCORE;
DESCRIPTOR.message_types_by_name ['CategoryScoreDetails'] = _CATEGORYSCOREDETAILS;
DESCRIPTOR.message_types_by_name ['VitalScoreDetails'] = _VITALSCOREDETAILS;
DESCRIPTOR.message_types_by_name ['ScoreDetails'] = _SCOREDETAILS;
_sym_db.RegisterFileDescriptor (DESCRIPTOR);
export var Score = _reflection.GeneratedProtocolMessageType ('Score', tuple ([_message.Message]), dict (__kwargtrans__ ({DESCRIPTOR: _SCORE, __module__: 's2clientprotocol.score_pb2'})));
_sym_db.RegisterMessage (Score);
export var CategoryScoreDetails = _reflection.GeneratedProtocolMessageType ('CategoryScoreDetails', tuple ([_message.Message]), dict (__kwargtrans__ ({DESCRIPTOR: _CATEGORYSCOREDETAILS, __module__: 's2clientprotocol.score_pb2'})));
_sym_db.RegisterMessage (CategoryScoreDetails);
export var VitalScoreDetails = _reflection.GeneratedProtocolMessageType ('VitalScoreDetails', tuple ([_message.Message]), dict (__kwargtrans__ ({DESCRIPTOR: _VITALSCOREDETAILS, __module__: 's2clientprotocol.score_pb2'})));
_sym_db.RegisterMessage (VitalScoreDetails);
export var ScoreDetails = _reflection.GeneratedProtocolMessageType ('ScoreDetails', tuple ([_message.Message]), dict (__kwargtrans__ ({DESCRIPTOR: _SCOREDETAILS, __module__: 's2clientprotocol.score_pb2'})));
_sym_db.RegisterMessage (ScoreDetails);

//# sourceMappingURL=s2clientprotocol.score_pb2.map