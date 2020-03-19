// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"__target__/org.transcrypt.__runtime__.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__nest__ = __nest__;
exports.__init__ = __init__;
exports.__get__ = __get__;
exports.__getcm__ = __getcm__;
exports.__getsm__ = __getsm__;
exports.__class__ = __class__;
exports.__pragma__ = __pragma__;
exports.__call__ = __call__;
exports.__kwargtrans__ = __kwargtrans__;
exports.__super__ = __super__;
exports.property = property;
exports.__setproperty__ = __setproperty__;
exports.assert = assert;
exports.__mergekwargtrans__ = __mergekwargtrans__;
exports.__mergefields__ = __mergefields__;
exports.__withblock__ = __withblock__;
exports.dir = dir;
exports.setattr = setattr;
exports.getattr = getattr;
exports.hasattr = hasattr;
exports.delattr = delattr;
exports.__in__ = __in__;
exports.__specialattrib__ = __specialattrib__;
exports.len = len;
exports.__i__ = __i__;
exports.__k__ = __k__;
exports.__t__ = __t__;
exports.float = float;
exports.int = int;
exports.bool = bool;
exports.py_typeof = py_typeof;
exports.issubclass = issubclass;
exports.isinstance = isinstance;
exports.callable = callable;
exports.repr = repr;
exports.chr = chr;
exports.ord = ord;
exports.max = max;
exports.min = min;
exports.round = round;
exports.__jsUsePyNext__ = __jsUsePyNext__;
exports.__pyUseJsNext__ = __pyUseJsNext__;
exports.py_iter = py_iter;
exports.py_next = py_next;
exports.__PyIterator__ = __PyIterator__;
exports.__JsIterator__ = __JsIterator__;
exports.py_reversed = py_reversed;
exports.zip = zip;
exports.range = range;
exports.any = any;
exports.all = all;
exports.sum = sum;
exports.enumerate = enumerate;
exports.copy = copy;
exports.deepcopy = deepcopy;
exports.list = list;
exports.tuple = tuple;
exports.set = set;
exports.bytearray = bytearray;
exports.str = str;
exports.dict = dict;
exports.__jsmod__ = __jsmod__;
exports.__mod__ = __mod__;
exports.__pow__ = __pow__;
exports.__neg__ = __neg__;
exports.__matmul__ = __matmul__;
exports.__mul__ = __mul__;
exports.__truediv__ = __truediv__;
exports.__floordiv__ = __floordiv__;
exports.__add__ = __add__;
exports.__sub__ = __sub__;
exports.__lshift__ = __lshift__;
exports.__rshift__ = __rshift__;
exports.__or__ = __or__;
exports.__xor__ = __xor__;
exports.__and__ = __and__;
exports.__eq__ = __eq__;
exports.__ne__ = __ne__;
exports.__lt__ = __lt__;
exports.__le__ = __le__;
exports.__gt__ = __gt__;
exports.__ge__ = __ge__;
exports.__imatmul__ = __imatmul__;
exports.__ipow__ = __ipow__;
exports.__ijsmod__ = __ijsmod__;
exports.__imod__ = __imod__;
exports.__imul__ = __imul__;
exports.__idiv__ = __idiv__;
exports.__iadd__ = __iadd__;
exports.__isub__ = __isub__;
exports.__ilshift__ = __ilshift__;
exports.__irshift__ = __irshift__;
exports.__ior__ = __ior__;
exports.__ixor__ = __ixor__;
exports.__iand__ = __iand__;
exports.__getitem__ = __getitem__;
exports.__setitem__ = __setitem__;
exports.__getslice__ = __getslice__;
exports.__setslice__ = __setslice__;
exports.input = exports.print = exports.__terminal__ = exports.__Terminal__ = exports.divmod = exports.filter = exports.map = exports.sorted = exports.__sort__ = exports.RuntimeWarning = exports.DeprecationWarning = exports.UserWarning = exports.Warning = exports.py_TypeError = exports.AttributeError = exports.IndexError = exports.NotImplementedError = exports.AssertionError = exports.KeyError = exports.ValueError = exports.StopIteration = exports.IterableError = exports.Exception = exports.BaseException = exports.pow = exports.bytes = exports.abs = exports.object = exports.py_metatype = exports.__proxy__ = exports.__envir__ = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// Transcrypt'ed from Python, 2019-01-21 16:14:54
var __name__ = 'org.transcrypt.__runtime__';
var __envir__ = {};
exports.__envir__ = __envir__;
__envir__.interpreter_name = 'python';
__envir__.transpiler_name = 'transcrypt';
__envir__.executor_name = __envir__.transpiler_name;
__envir__.transpiler_version = '3.7.14';

function __nest__(headObject, tailNames, value) {
  var current = headObject;

  if (tailNames != '') {
    var tailChain = tailNames.split('.');
    var firstNewIndex = tailChain.length;

    for (var index = 0; index < tailChain.length; index++) {
      if (!current.hasOwnProperty(tailChain[index])) {
        firstNewIndex = index;
        break;
      }

      current = current[tailChain[index]];
    }

    for (var index = firstNewIndex; index < tailChain.length; index++) {
      current[tailChain[index]] = {};
      current = current[tailChain[index]];
    }
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var attrib = _step.value;
      Object.defineProperty(current, attrib, {
        get: function get() {
          return value[attrib];
        },
        enumerable: true,
        configurable: true
      });
    };

    for (var _iterator = Object.getOwnPropertyNames(value)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

;

function __init__(module) {
  if (!module.__inited__) {
    module.__all__.__init__(module.__all__);

    module.__inited__ = true;
  }

  return module.__all__;
}

;
var __proxy__ = false;
exports.__proxy__ = __proxy__;

function __get__(self, func, quotedFuncName) {
  if (self) {
    if (self.hasOwnProperty('__class__') || typeof self == 'string' || self instanceof String) {
      if (quotedFuncName) {
        Object.defineProperty(self, quotedFuncName, {
          value: function value() {
            var args = [].slice.apply(arguments);
            return func.apply(null, [self].concat(args));
          },
          writable: true,
          enumerable: true,
          configurable: true
        });
      }

      return function () {
        var args = [].slice.apply(arguments);
        return func.apply(null, [self].concat(args));
      };
    } else {
      return func;
    }
  } else {
    return func;
  }
}

;

function __getcm__(self, func, quotedFuncName) {
  if (self.hasOwnProperty('__class__')) {
    return function () {
      var args = [].slice.apply(arguments);
      return func.apply(null, [self.__class__].concat(args));
    };
  } else {
    return function () {
      var args = [].slice.apply(arguments);
      return func.apply(null, [self].concat(args));
    };
  }
}

;

function __getsm__(self, func, quotedFuncName) {
  return func;
}

;
var py_metatype = {
  __name__: 'type',
  __bases__: [],
  __new__: function __new__(meta, name, bases, attribs) {
    var cls = function cls() {
      var args = [].slice.apply(arguments);
      return cls.__new__(args);
    };

    for (var index = bases.length - 1; index >= 0; index--) {
      var base = bases[index];

      for (var attrib in base) {
        var descrip = Object.getOwnPropertyDescriptor(base, attrib);
        Object.defineProperty(cls, attrib, descrip);
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.getOwnPropertySymbols(base)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var symbol = _step2.value;

          var _descrip = Object.getOwnPropertyDescriptor(base, symbol);

          Object.defineProperty(cls, symbol, _descrip);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    cls.__metaclass__ = meta;
    cls.__name__ = name.startsWith('py_') ? name.slice(3) : name;
    cls.__bases__ = bases;

    for (var attrib in attribs) {
      var descrip = Object.getOwnPropertyDescriptor(attribs, attrib);
      Object.defineProperty(cls, attrib, descrip);
    }

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = Object.getOwnPropertySymbols(attribs)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _symbol = _step3.value;

        var _descrip2 = Object.getOwnPropertyDescriptor(attribs, _symbol);

        Object.defineProperty(cls, _symbol, _descrip2);
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    return cls;
  }
};
exports.py_metatype = py_metatype;
py_metatype.__metaclass__ = py_metatype;
var object = {
  __init__: function __init__(self) {},
  __metaclass__: py_metatype,
  __name__: 'object',
  __bases__: [],
  __new__: function __new__(args) {
    var instance = Object.create(this, {
      __class__: {
        value: this,
        enumerable: true
      }
    });

    if ('__getattr__' in this || '__setattr__' in this) {
      instance = new Proxy(instance, {
        get: function get(target, name) {
          var result = target[name];

          if (result == undefined) {
            return target.__getattr__(name);
          } else {
            return result;
          }
        },
        set: function set(target, name, value) {
          try {
            target.__setattr__(name, value);
          } catch (exception) {
            target[name] = value;
          }

          return true;
        }
      });
    }

    this.__init__.apply(null, [instance].concat(args));

    return instance;
  }
};
exports.object = object;

function __class__(name, bases, attribs, meta) {
  if (meta === undefined) {
    meta = bases[0].__metaclass__;
  }

  return meta.__new__(meta, name, bases, attribs);
}

;

function __pragma__() {}

;

function __call__()
/* <callee>, <this>, <params>* */
{
  var args = [].slice.apply(arguments);

  if (_typeof(args[0]) == 'object' && '__call__' in args[0]) {
    return args[0].__call__.apply(args[1], args.slice(2));
  } else {
    return args[0].apply(args[1], args.slice(2));
  }
}

;
__envir__.executor_name = __envir__.transpiler_name;
var __main__ = {
  __file__: ''
};
var __except__ = null;

function __kwargtrans__(anObject) {
  anObject.__kwargtrans__ = null;
  anObject.constructor = Object;
  return anObject;
}

function __super__(aClass, methodName) {
  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = aClass.__bases__[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var base = _step4.value;

      if (methodName in base) {
        return base[methodName];
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
        _iterator4.return();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  throw new Exception('Superclass method not found');
}

function property(getter, setter) {
  if (!setter) {
    setter = function setter() {};
  }

  return {
    get: function get() {
      return getter(this);
    },
    set: function set(value) {
      setter(this, value);
    },
    enumerable: true
  };
}

function __setproperty__(anObject, name, descriptor) {
  if (!anObject.hasOwnProperty(name)) {
    Object.defineProperty(anObject, name, descriptor);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw AssertionError(message, new Error());
  }
}

function __mergekwargtrans__(object0, object1) {
  var result = {};

  for (var attrib in object0) {
    result[attrib] = object0[attrib];
  }

  for (var attrib in object1) {
    result[attrib] = object1[attrib];
  }

  return result;
}

;

function __mergefields__(targetClass, sourceClass) {
  var fieldNames = ['__reprfields__', '__comparefields__', '__initfields__'];

  if (sourceClass[fieldNames[0]]) {
    if (targetClass[fieldNames[0]]) {
      for (var _i = 0; _i < fieldNames.length; _i++) {
        var fieldName = fieldNames[_i];
        targetClass[fieldName] = new Set([].concat(_toConsumableArray(targetClass[fieldName]), _toConsumableArray(sourceClass[fieldName])));
      }
    } else {
      for (var _i2 = 0; _i2 < fieldNames.length; _i2++) {
        var _fieldName = fieldNames[_i2];
        targetClass[_fieldName] = new Set(sourceClass[_fieldName]);
      }
    }
  }
}

function __withblock__(manager, statements) {
  if (hasattr(manager, '__enter__')) {
    try {
      manager.__enter__();

      statements();

      manager.__exit__();
    } catch (exception) {
      if (!manager.__exit__(exception.name, exception, exception.stack)) {
        throw exception;
      }
    }
  } else {
    statements();
    manager.close();
  }
}

;

function dir(obj) {
  var aList = [];

  for (var aKey in obj) {
    aList.push(aKey.startsWith('py_') ? aKey.slice(3) : aKey);
  }

  aList.sort();
  return aList;
}

;

function setattr(obj, name, value) {
  obj[name] = value;
}

;

function getattr(obj, name) {
  return name in obj ? obj[name] : obj['py_' + name];
}

;

function hasattr(obj, name) {
  try {
    return name in obj || 'py_' + name in obj;
  } catch (exception) {
    return false;
  }
}

;

function delattr(obj, name) {
  if (name in obj) {
    delete obj[name];
  } else {
    delete obj['py_' + name];
  }
}

;

function __in__(element, container) {
  if (container === undefined || container === null) {
    return false;
  }

  if (container.__contains__ instanceof Function) {
    return container.__contains__(element);
  } else {
    return container.indexOf ? container.indexOf(element) > -1 : container.hasOwnProperty(element);
  }
}

;

function __specialattrib__(attrib) {
  return attrib.startswith('__') && attrib.endswith('__') || attrib == 'constructor' || attrib.startswith('py_');
}

;

function len(anObject) {
  if (anObject === undefined || anObject === null) {
    return 0;
  }

  if (anObject.__len__ instanceof Function) {
    return anObject.__len__();
  }

  if (anObject.length !== undefined) {
    return anObject.length;
  }

  var length = 0;

  for (var attr in anObject) {
    if (!__specialattrib__(attr)) {
      length++;
    }
  }

  return length;
}

;

function __i__(any) {
  return py_typeof(any) == dict ? any.py_keys() : any;
}

function __k__(keyed, key) {
  var result = keyed[key];

  if (typeof result == 'undefined') {
    if (keyed instanceof Array) {
      if (key == +key && key >= 0 && keyed.length > key) return result;else throw IndexError(key, new Error());
    } else throw KeyError(key, new Error());
  }

  return result;
}

function __t__(target) {
  return target === undefined || target === null ? false : ['boolean', 'number'].indexOf(_typeof(target)) >= 0 ? target : target.__bool__ instanceof Function ? target.__bool__() ? target : false : target.__len__ instanceof Function ? target.__len__() !== 0 ? target : false : target instanceof Function ? target : len(target) !== 0 ? target : false;
}

function float(any) {
  if (any == 'inf') {
    return Infinity;
  } else if (any == '-inf') {
    return -Infinity;
  } else if (any == 'nan') {
    return NaN;
  } else if (isNaN(parseFloat(any))) {
    if (any === false) {
      return 0;
    } else if (any === true) {
      return 1;
    } else {
      throw ValueError("could not convert string to float: '" + str(any) + "'", new Error());
    }
  } else {
    return +any;
  }
}

;
float.__name__ = 'float';
float.__bases__ = [object];

function int(any) {
  return float(any) | 0;
}

;
int.__name__ = 'int';
int.__bases__ = [object];

function bool(any) {
  return !!__t__(any);
}

;
bool.__name__ = 'bool';
bool.__bases__ = [int];

function py_typeof(anObject) {
  var aType = _typeof(anObject);

  if (aType == 'object') {
    try {
      return '__class__' in anObject ? anObject.__class__ : object;
    } catch (exception) {
      return aType;
    }
  } else {
    return aType == 'boolean' ? bool : aType == 'string' ? str : aType == 'number' ? anObject % 1 == 0 ? int : float : null;
  }
}

;

function issubclass(aClass, classinfo) {
  if (classinfo instanceof Array) {
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = classinfo[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var _aClass = _step5.value;

        if (issubclass(aClass, _aClass)) {
          return true;
        }
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
          _iterator5.return();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    return false;
  }

  try {
    var aClass2 = aClass;

    if (aClass2 == classinfo) {
      return true;
    } else {
      var bases = [].slice.call(aClass2.__bases__);

      while (bases.length) {
        aClass2 = bases.shift();

        if (aClass2 == classinfo) {
          return true;
        }

        if (aClass2.__bases__.length) {
          bases = [].slice.call(aClass2.__bases__).concat(bases);
        }
      }

      return false;
    }
  } catch (exception) {
    return aClass == classinfo || classinfo == object;
  }
}

;

function isinstance(anObject, classinfo) {
  try {
    return '__class__' in anObject ? issubclass(anObject.__class__, classinfo) : issubclass(py_typeof(anObject), classinfo);
  } catch (exception) {
    return issubclass(py_typeof(anObject), classinfo);
  }
}

;

function callable(anObject) {
  return anObject && _typeof(anObject) == 'object' && '__call__' in anObject ? true : typeof anObject === 'function';
}

;

function repr(anObject) {
  try {
    return anObject.__repr__();
  } catch (exception) {
    try {
      return anObject.__str__();
    } catch (exception) {
      try {
        if (anObject == null) {
          return 'None';
        } else if (anObject.constructor == Object) {
          var result = '{';
          var comma = false;

          for (var attrib in anObject) {
            if (!__specialattrib__(attrib)) {
              if (attrib.isnumeric()) {
                var attribRepr = attrib;
              } else {
                var attribRepr = '\'' + attrib + '\'';
              }

              if (comma) {
                result += ', ';
              } else {
                comma = true;
              }

              result += attribRepr + ': ' + repr(anObject[attrib]);
            }
          }

          result += '}';
          return result;
        } else {
          return typeof anObject == 'boolean' ? anObject.toString().capitalize() : anObject.toString();
        }
      } catch (exception) {
        return '<object of type: ' + _typeof(anObject) + '>';
      }
    }
  }
}

;

function chr(charCode) {
  return String.fromCharCode(charCode);
}

;

function ord(aChar) {
  return aChar.charCodeAt(0);
}

;

function max(nrOrSeq) {
  return arguments.length == 1 ? Math.max.apply(Math, _toConsumableArray(nrOrSeq)) : Math.max.apply(Math, arguments);
}

;

function min(nrOrSeq) {
  return arguments.length == 1 ? Math.min.apply(Math, _toConsumableArray(nrOrSeq)) : Math.min.apply(Math, arguments);
}

;
var abs = Math.abs;
exports.abs = abs;

function round(number, ndigits) {
  if (ndigits) {
    var scale = Math.pow(10, ndigits);
    number *= scale;
  }

  var rounded = Math.round(number);

  if (rounded - number == 0.5 && rounded % 2) {
    rounded -= 1;
  }

  if (ndigits) {
    rounded /= scale;
  }

  return rounded;
}

;

function __jsUsePyNext__() {
  try {
    var result = this.__next__();

    return {
      value: result,
      done: false
    };
  } catch (exception) {
    return {
      value: undefined,
      done: true
    };
  }
}

function __pyUseJsNext__() {
  var result = this.next();

  if (result.done) {
    throw StopIteration(new Error());
  } else {
    return result.value;
  }
}

function py_iter(iterable) {
  if (typeof iterable == 'string' || '__iter__' in iterable) {
    var result = iterable.__iter__();

    result.next = __jsUsePyNext__;
  } else if ('selector' in iterable) {
    var result = list(iterable).__iter__();

    result.next = __jsUsePyNext__;
  } else if ('next' in iterable) {
    var result = iterable;

    if (!('__next__' in result)) {
      result.__next__ = __pyUseJsNext__;
    }
  } else if (Symbol.iterator in iterable) {
    var result = iterable[Symbol.iterator]();
    result.__next__ = __pyUseJsNext__;
  } else {
    throw IterableError(new Error());
  }

  result[Symbol.iterator] = function () {
    return result;
  };

  return result;
}

function py_next(iterator) {
  try {
    var result = iterator.__next__();
  } catch (exception) {
    var result = iterator.next();

    if (result.done) {
      throw StopIteration(new Error());
    } else {
      return result.value;
    }
  }

  if (result == undefined) {
    throw StopIteration(new Error());
  } else {
    return result;
  }
}

function __PyIterator__(iterable) {
  this.iterable = iterable;
  this.index = 0;
}

__PyIterator__.prototype.__next__ = function () {
  if (this.index < this.iterable.length) {
    return this.iterable[this.index++];
  } else {
    throw StopIteration(new Error());
  }
};

function __JsIterator__(iterable) {
  this.iterable = iterable;
  this.index = 0;
}

__JsIterator__.prototype.next = function () {
  if (this.index < this.iterable.py_keys.length) {
    return {
      value: this.index++,
      done: false
    };
  } else {
    return {
      value: undefined,
      done: true
    };
  }
};

function py_reversed(iterable) {
  iterable = iterable.slice();
  iterable.reverse();
  return iterable;
}

;

function zip() {
  var args = [].slice.call(arguments);

  for (var i = 0; i < args.length; i++) {
    if (typeof args[i] == 'string') {
      args[i] = args[i].split('');
    } else if (!Array.isArray(args[i])) {
      args[i] = Array.from(args[i]);
    }
  }

  var shortest = args.length == 0 ? [] : args.reduce(function (array0, array1) {
    return array0.length < array1.length ? array0 : array1;
  });
  return shortest.map(function (current, index) {
    return args.map(function (current) {
      return current[index];
    });
  });
}

;

function range(start, stop, step) {
  if (stop == undefined) {
    stop = start;
    start = 0;
  }

  if (step == undefined) {
    step = 1;
  }

  if (step > 0 && start >= stop || step < 0 && start <= stop) {
    return [];
  }

  var result = [];

  for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i);
  }

  return result;
}

;

function any(iterable) {
  var _iteratorNormalCompletion6 = true;
  var _didIteratorError6 = false;
  var _iteratorError6 = undefined;

  try {
    for (var _iterator6 = iterable[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
      var item = _step6.value;

      if (bool(item)) {
        return true;
      }
    }
  } catch (err) {
    _didIteratorError6 = true;
    _iteratorError6 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
        _iterator6.return();
      }
    } finally {
      if (_didIteratorError6) {
        throw _iteratorError6;
      }
    }
  }

  return false;
}

function all(iterable) {
  var _iteratorNormalCompletion7 = true;
  var _didIteratorError7 = false;
  var _iteratorError7 = undefined;

  try {
    for (var _iterator7 = iterable[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
      var item = _step7.value;

      if (!bool(item)) {
        return false;
      }
    }
  } catch (err) {
    _didIteratorError7 = true;
    _iteratorError7 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
        _iterator7.return();
      }
    } finally {
      if (_didIteratorError7) {
        throw _iteratorError7;
      }
    }
  }

  return true;
}

function sum(iterable) {
  var result = 0;
  var _iteratorNormalCompletion8 = true;
  var _didIteratorError8 = false;
  var _iteratorError8 = undefined;

  try {
    for (var _iterator8 = iterable[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
      var item = _step8.value;
      result += item;
    }
  } catch (err) {
    _didIteratorError8 = true;
    _iteratorError8 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
        _iterator8.return();
      }
    } finally {
      if (_didIteratorError8) {
        throw _iteratorError8;
      }
    }
  }

  return result;
}

function enumerate(iterable) {
  return zip(range(len(iterable)), iterable);
}

function copy(anObject) {
  if (anObject == null || _typeof(anObject) == "object") {
    return anObject;
  } else {
    var result = {};

    for (var attrib in obj) {
      if (anObject.hasOwnProperty(attrib)) {
        result[attrib] = anObject[attrib];
      }
    }

    return result;
  }
}

function deepcopy(anObject) {
  if (anObject == null || _typeof(anObject) == "object") {
    return anObject;
  } else {
    var result = {};

    for (var attrib in obj) {
      if (anObject.hasOwnProperty(attrib)) {
        result[attrib] = deepcopy(anObject[attrib]);
      }
    }

    return result;
  }
}

function list(iterable) {
  var instance = iterable ? Array.from(iterable) : [];
  return instance;
}

Array.prototype.__class__ = list;
list.__name__ = 'list';
list.__bases__ = [object];

Array.prototype.__iter__ = function () {
  return new __PyIterator__(this);
};

Array.prototype.__getslice__ = function (start, stop, step) {
  if (start < 0) {
    start = this.length + start;
  }

  if (stop == null) {
    stop = this.length;
  } else if (stop < 0) {
    stop = this.length + stop;
  } else if (stop > this.length) {
    stop = this.length;
  }

  if (step == 1) {
    return Array.prototype.slice.call(this, start, stop);
  }

  var result = list([]);

  for (var index = start; index < stop; index += step) {
    result.push(this[index]);
  }

  return result;
};

Array.prototype.__setslice__ = function (start, stop, step, source) {
  if (start < 0) {
    start = this.length + start;
  }

  if (stop == null) {
    stop = this.length;
  } else if (stop < 0) {
    stop = this.length + stop;
  }

  if (step == null) {
    Array.prototype.splice.apply(this, [start, stop - start].concat(source));
  } else {
    var sourceIndex = 0;

    for (var targetIndex = start; targetIndex < stop; targetIndex += step) {
      this[targetIndex] = source[sourceIndex++];
    }
  }
};

Array.prototype.__repr__ = function () {
  if (this.__class__ == set && !this.length) {
    return 'set()';
  }

  var result = !this.__class__ || this.__class__ == list ? '[' : this.__class__ == tuple ? '(' : '{';

  for (var index = 0; index < this.length; index++) {
    if (index) {
      result += ', ';
    }

    result += repr(this[index]);
  }

  if (this.__class__ == tuple && this.length == 1) {
    result += ',';
  }

  result += !this.__class__ || this.__class__ == list ? ']' : this.__class__ == tuple ? ')' : '}';
  ;
  return result;
};

Array.prototype.__str__ = Array.prototype.__repr__;

Array.prototype.append = function (element) {
  this.push(element);
};

Array.prototype.py_clear = function () {
  this.length = 0;
};

Array.prototype.extend = function (aList) {
  this.push.apply(this, aList);
};

Array.prototype.insert = function (index, element) {
  this.splice(index, 0, element);
};

Array.prototype.remove = function (element) {
  var index = this.indexOf(element);

  if (index == -1) {
    throw ValueError("list.remove(x): x not in list", new Error());
  }

  this.splice(index, 1);
};

Array.prototype.index = function (element) {
  return this.indexOf(element);
};

Array.prototype.py_pop = function (index) {
  if (index == undefined) {
    return this.pop();
  } else {
    return this.splice(index, 1)[0];
  }
};

Array.prototype.py_sort = function () {
  __sort__.apply(null, [this].concat([].slice.apply(arguments)));
};

Array.prototype.__add__ = function (aList) {
  return list(this.concat(aList));
};

Array.prototype.__mul__ = function (scalar) {
  var result = this;

  for (var i = 1; i < scalar; i++) {
    result = result.concat(this);
  }

  return result;
};

Array.prototype.__rmul__ = Array.prototype.__mul__;

function tuple(iterable) {
  var instance = iterable ? [].slice.apply(iterable) : [];
  instance.__class__ = tuple;
  return instance;
}

tuple.__name__ = 'tuple';
tuple.__bases__ = [object];

function set(iterable) {
  var instance = [];

  if (iterable) {
    for (var index = 0; index < iterable.length; index++) {
      instance.add(iterable[index]);
    }
  }

  instance.__class__ = set;
  return instance;
}

set.__name__ = 'set';
set.__bases__ = [object];

Array.prototype.__bindexOf__ = function (element) {
  element += '';
  var mindex = 0;
  var maxdex = this.length - 1;

  while (mindex <= maxdex) {
    var index = (mindex + maxdex) / 2 | 0;
    var middle = this[index] + '';

    if (middle < element) {
      mindex = index + 1;
    } else if (middle > element) {
      maxdex = index - 1;
    } else {
      return index;
    }
  }

  return -1;
};

Array.prototype.add = function (element) {
  if (this.indexOf(element) == -1) {
    this.push(element);
  }
};

Array.prototype.discard = function (element) {
  var index = this.indexOf(element);

  if (index != -1) {
    this.splice(index, 1);
  }
};

Array.prototype.isdisjoint = function (other) {
  this.sort();

  for (var i = 0; i < other.length; i++) {
    if (this.__bindexOf__(other[i]) != -1) {
      return false;
    }
  }

  return true;
};

Array.prototype.issuperset = function (other) {
  this.sort();

  for (var i = 0; i < other.length; i++) {
    if (this.__bindexOf__(other[i]) == -1) {
      return false;
    }
  }

  return true;
};

Array.prototype.issubset = function (other) {
  return set(other.slice()).issuperset(this);
};

Array.prototype.union = function (other) {
  var result = set(this.slice().sort());

  for (var i = 0; i < other.length; i++) {
    if (result.__bindexOf__(other[i]) == -1) {
      result.push(other[i]);
    }
  }

  return result;
};

Array.prototype.intersection = function (other) {
  this.sort();
  var result = set();

  for (var i = 0; i < other.length; i++) {
    if (this.__bindexOf__(other[i]) != -1) {
      result.push(other[i]);
    }
  }

  return result;
};

Array.prototype.difference = function (other) {
  var sother = set(other.slice().sort());
  var result = set();

  for (var i = 0; i < this.length; i++) {
    if (sother.__bindexOf__(this[i]) == -1) {
      result.push(this[i]);
    }
  }

  return result;
};

Array.prototype.symmetric_difference = function (other) {
  return this.union(other).difference(this.intersection(other));
};

Array.prototype.py_update = function () {
  var updated = [].concat.apply(this.slice(), arguments).sort();
  this.py_clear();

  for (var i = 0; i < updated.length; i++) {
    if (updated[i] != updated[i - 1]) {
      this.push(updated[i]);
    }
  }
};

Array.prototype.__eq__ = function (other) {
  if (this.length != other.length) {
    return false;
  }

  if (this.__class__ == set) {
    this.sort();
    other.sort();
  }

  for (var i = 0; i < this.length; i++) {
    if (this[i] != other[i]) {
      return false;
    }
  }

  return true;
};

Array.prototype.__ne__ = function (other) {
  return !this.__eq__(other);
};

Array.prototype.__le__ = function (other) {
  if (this.__class__ == set) {
    return this.issubset(other);
  } else {
    for (var i = 0; i < this.length; i++) {
      if (this[i] > other[i]) {
        return false;
      } else if (this[i] < other[i]) {
        return true;
      }
    }

    return true;
  }
};

Array.prototype.__ge__ = function (other) {
  if (this.__class__ == set) {
    return this.issuperset(other);
  } else {
    for (var i = 0; i < this.length; i++) {
      if (this[i] < other[i]) {
        return false;
      } else if (this[i] > other[i]) {
        return true;
      }
    }

    return true;
  }
};

Array.prototype.__lt__ = function (other) {
  return this.__class__ == set ? this.issubset(other) && !this.issuperset(other) : !this.__ge__(other);
};

Array.prototype.__gt__ = function (other) {
  return this.__class__ == set ? this.issuperset(other) && !this.issubset(other) : !this.__le__(other);
};

function bytearray(bytable, encoding) {
  if (bytable == undefined) {
    return new Uint8Array(0);
  } else {
    var aType = py_typeof(bytable);

    if (aType == int) {
      return new Uint8Array(bytable);
    } else if (aType == str) {
      var aBytes = new Uint8Array(len(bytable));

      for (var i = 0; i < len(bytable); i++) {
        aBytes[i] = bytable.charCodeAt(i);
      }

      return aBytes;
    } else if (aType == list || aType == tuple) {
      return new Uint8Array(bytable);
    } else {
      throw py_TypeError;
    }
  }
}

var bytes = bytearray;
exports.bytes = bytes;

Uint8Array.prototype.__add__ = function (aBytes) {
  var result = new Uint8Array(this.length + aBytes.length);
  result.set(this);
  result.set(aBytes, this.length);
  return result;
};

Uint8Array.prototype.__mul__ = function (scalar) {
  var result = new Uint8Array(scalar * this.length);

  for (var i = 0; i < scalar; i++) {
    result.set(this, i * this.length);
  }

  return result;
};

Uint8Array.prototype.__rmul__ = Uint8Array.prototype.__mul__;

function str(stringable) {
  if (typeof stringable === 'number') return stringable.toString();else {
    try {
      return stringable.__str__();
    } catch (exception) {
      try {
        return repr(stringable);
      } catch (exception) {
        return String(stringable);
      }
    }
  }
}

;
String.prototype.__class__ = str;
str.__name__ = 'str';
str.__bases__ = [object];

String.prototype.__iter__ = function () {
  new __PyIterator__(this);
};

String.prototype.__repr__ = function () {
  return (this.indexOf('\'') == -1 ? '\'' + this + '\'' : '"' + this + '"').py_replace('\t', '\\t').py_replace('\n', '\\n');
};

String.prototype.__str__ = function () {
  return this;
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.endswith = function (suffix) {
  if (suffix instanceof Array) {
    for (var i = 0; i < suffix.length; i++) {
      if (this.slice(-suffix[i].length) == suffix[i]) return true;
    }
  } else return suffix == '' || this.slice(-suffix.length) == suffix;

  return false;
};

String.prototype.find = function (sub, start) {
  return this.indexOf(sub, start);
};

String.prototype.__getslice__ = function (start, stop, step) {
  if (start < 0) {
    start = this.length + start;
  }

  if (stop == null) {
    stop = this.length;
  } else if (stop < 0) {
    stop = this.length + stop;
  }

  var result = '';

  if (step == 1) {
    result = this.substring(start, stop);
  } else {
    for (var index = start; index < stop; index += step) {
      result = result.concat(this.charAt(index));
    }
  }

  return result;
};

__setproperty__(String.prototype, 'format', {
  get: function get() {
    return __get__(this, function (self) {
      var args = tuple([].slice.apply(arguments).slice(1));
      var autoIndex = 0;
      return self.replace(/\{(\w*)\}/g, function (match, key) {
        if (key == '') {
          key = autoIndex++;
        }

        if (key == +key) {
          return args[key] === undefined ? match : str(args[key]);
        } else {
          for (var index = 0; index < args.length; index++) {
            if (_typeof(args[index]) == 'object' && args[index][key] !== undefined) {
              return str(args[index][key]);
            }
          }

          return match;
        }
      });
    });
  },
  enumerable: true
});

String.prototype.isalnum = function () {
  return /^[0-9a-zA-Z]{1,}$/.test(this);
};

String.prototype.isalpha = function () {
  return /^[a-zA-Z]{1,}$/.test(this);
};

String.prototype.isdecimal = function () {
  return /^[0-9]{1,}$/.test(this);
};

String.prototype.isdigit = function () {
  return this.isdecimal();
};

String.prototype.islower = function () {
  return /^[a-z]{1,}$/.test(this);
};

String.prototype.isupper = function () {
  return /^[A-Z]{1,}$/.test(this);
};

String.prototype.isspace = function () {
  return /^[\s]{1,}$/.test(this);
};

String.prototype.isnumeric = function () {
  return !isNaN(parseFloat(this)) && isFinite(this);
};

String.prototype.join = function (strings) {
  strings = Array.from(strings);
  return strings.join(this);
};

String.prototype.lower = function () {
  return this.toLowerCase();
};

String.prototype.py_replace = function (old, aNew, maxreplace) {
  return this.split(old, maxreplace).join(aNew);
};

String.prototype.lstrip = function () {
  return this.replace(/^\s*/g, '');
};

String.prototype.rfind = function (sub, start) {
  return this.lastIndexOf(sub, start);
};

String.prototype.rsplit = function (sep, maxsplit) {
  if (sep == undefined || sep == null) {
    sep = /\s+/;
    var stripped = this.strip();
  } else {
    var stripped = this;
  }

  if (maxsplit == undefined || maxsplit == -1) {
    return stripped.split(sep);
  } else {
    var result = stripped.split(sep);

    if (maxsplit < result.length) {
      var maxrsplit = result.length - maxsplit;
      return [result.slice(0, maxrsplit).join(sep)].concat(result.slice(maxrsplit));
    } else {
      return result;
    }
  }
};

String.prototype.rstrip = function () {
  return this.replace(/\s*$/g, '');
};

String.prototype.py_split = function (sep, maxsplit) {
  if (sep == undefined || sep == null) {
    sep = /\s+/;
    var stripped = this.strip();
  } else {
    var stripped = this;
  }

  if (maxsplit == undefined || maxsplit == -1) {
    return stripped.split(sep);
  } else {
    var result = stripped.split(sep);

    if (maxsplit < result.length) {
      return result.slice(0, maxsplit).concat([result.slice(maxsplit).join(sep)]);
    } else {
      return result;
    }
  }
};

String.prototype.startswith = function (prefix) {
  if (prefix instanceof Array) {
    for (var i = 0; i < prefix.length; i++) {
      if (this.indexOf(prefix[i]) == 0) return true;
    }
  } else return this.indexOf(prefix) == 0;

  return false;
};

String.prototype.strip = function () {
  return this.trim();
};

String.prototype.upper = function () {
  return this.toUpperCase();
};

String.prototype.__mul__ = function (scalar) {
  var result = '';

  for (var i = 0; i < scalar; i++) {
    result = result + this;
  }

  return result;
};

String.prototype.__rmul__ = String.prototype.__mul__;

function __contains__(element) {
  return this.hasOwnProperty(element);
}

function __keys__() {
  var keys = [];

  for (var attrib in this) {
    if (!__specialattrib__(attrib)) {
      keys.push(attrib);
    }
  }

  return keys;
}

function __items__() {
  var items = [];

  for (var attrib in this) {
    if (!__specialattrib__(attrib)) {
      items.push([attrib, this[attrib]]);
    }
  }

  return items;
}

function __del__(key) {
  delete this[key];
}

function __clear__() {
  for (var attrib in this) {
    delete this[attrib];
  }
}

function __getdefault__(aKey, aDefault) {
  var result = this[aKey];

  if (result == undefined) {
    result = this['py_' + aKey];
  }

  return result == undefined ? aDefault == undefined ? null : aDefault : result;
}

function __setdefault__(aKey, aDefault) {
  var result = this[aKey];

  if (result != undefined) {
    return result;
  }

  var val = aDefault == undefined ? null : aDefault;
  this[aKey] = val;
  return val;
}

function __pop__(aKey, aDefault) {
  var result = this[aKey];

  if (result != undefined) {
    delete this[aKey];
    return result;
  } else {
    if (aDefault === undefined) {
      throw KeyError(aKey, new Error());
    }
  }

  return aDefault;
}

function __popitem__() {
  var aKey = Object.keys(this)[0];

  if (aKey == null) {
    throw KeyError("popitem(): dictionary is empty", new Error());
  }

  var result = tuple([aKey, this[aKey]]);
  delete this[aKey];
  return result;
}

function __update__(aDict) {
  for (var aKey in aDict) {
    this[aKey] = aDict[aKey];
  }
}

function __values__() {
  var values = [];

  for (var attrib in this) {
    if (!__specialattrib__(attrib)) {
      values.push(this[attrib]);
    }
  }

  return values;
}

function __dgetitem__(aKey) {
  return this[aKey];
}

function __dsetitem__(aKey, aValue) {
  this[aKey] = aValue;
}

function dict(objectOrPairs) {
  var instance = {};

  if (!objectOrPairs || objectOrPairs instanceof Array) {
    if (objectOrPairs) {
      for (var index = 0; index < objectOrPairs.length; index++) {
        var pair = objectOrPairs[index];

        if (!(pair instanceof Array) || pair.length != 2) {
          throw ValueError("dict update sequence element #" + index + " has length " + pair.length + "; 2 is required", new Error());
        }

        var key = pair[0];
        var val = pair[1];

        if (!(objectOrPairs instanceof Array) && objectOrPairs instanceof Object) {
          if (!isinstance(objectOrPairs, dict)) {
            val = dict(val);
          }
        }

        instance[key] = val;
      }
    }
  } else {
    if (isinstance(objectOrPairs, dict)) {
      var aKeys = objectOrPairs.py_keys();

      for (var index = 0; index < aKeys.length; index++) {
        var key = aKeys[index];
        instance[key] = objectOrPairs[key];
      }
    } else if (objectOrPairs instanceof Object) {
      instance = objectOrPairs;
    } else {
      throw ValueError("Invalid type of object for dict creation", new Error());
    }
  }

  __setproperty__(instance, '__class__', {
    value: dict,
    enumerable: false,
    writable: true
  });

  __setproperty__(instance, '__contains__', {
    value: __contains__,
    enumerable: false
  });

  __setproperty__(instance, 'py_keys', {
    value: __keys__,
    enumerable: false
  });

  __setproperty__(instance, '__iter__', {
    value: function value() {
      new __PyIterator__(this.py_keys());
    },
    enumerable: false
  });

  __setproperty__(instance, Symbol.iterator, {
    value: function value() {
      new __JsIterator__(this.py_keys());
    },
    enumerable: false
  });

  __setproperty__(instance, 'py_items', {
    value: __items__,
    enumerable: false
  });

  __setproperty__(instance, 'py_del', {
    value: __del__,
    enumerable: false
  });

  __setproperty__(instance, 'py_clear', {
    value: __clear__,
    enumerable: false
  });

  __setproperty__(instance, 'py_get', {
    value: __getdefault__,
    enumerable: false
  });

  __setproperty__(instance, 'py_setdefault', {
    value: __setdefault__,
    enumerable: false
  });

  __setproperty__(instance, 'py_pop', {
    value: __pop__,
    enumerable: false
  });

  __setproperty__(instance, 'py_popitem', {
    value: __popitem__,
    enumerable: false
  });

  __setproperty__(instance, 'py_update', {
    value: __update__,
    enumerable: false
  });

  __setproperty__(instance, 'py_values', {
    value: __values__,
    enumerable: false
  });

  __setproperty__(instance, '__getitem__', {
    value: __dgetitem__,
    enumerable: false
  });

  __setproperty__(instance, '__setitem__', {
    value: __dsetitem__,
    enumerable: false
  });

  return instance;
}

dict.__name__ = 'dict';
dict.__bases__ = [object];

function __setdoc__(docString) {
  this.__doc__ = docString;
  return this;
}

__setproperty__(Function.prototype, '__setdoc__', {
  value: __setdoc__,
  enumerable: false
});

function __jsmod__(a, b) {
  if (_typeof(a) == 'object' && '__mod__' in a) {
    return a.__mod__(b);
  } else if (_typeof(b) == 'object' && '__rmod__' in b) {
    return b.__rmod__(a);
  } else {
    return a % b;
  }
}

;

function __mod__(a, b) {
  if (_typeof(a) == 'object' && '__mod__' in a) {
    return a.__mod__(b);
  } else if (_typeof(b) == 'object' && '__rmod__' in b) {
    return b.__rmod__(a);
  } else {
    return (a % b + b) % b;
  }
}

;

function __pow__(a, b) {
  if (_typeof(a) == 'object' && '__pow__' in a) {
    return a.__pow__(b);
  } else if (_typeof(b) == 'object' && '__rpow__' in b) {
    return b.__rpow__(a);
  } else {
    return Math.pow(a, b);
  }
}

;
var pow = __pow__;
exports.pow = pow;

function __neg__(a) {
  if (_typeof(a) == 'object' && '__neg__' in a) {
    return a.__neg__();
  } else {
    return -a;
  }
}

;

function __matmul__(a, b) {
  return a.__matmul__(b);
}

;

function __mul__(a, b) {
  if (_typeof(a) == 'object' && '__mul__' in a) {
    return a.__mul__(b);
  } else if (_typeof(b) == 'object' && '__rmul__' in b) {
    return b.__rmul__(a);
  } else if (typeof a == 'string') {
    return a.__mul__(b);
  } else if (typeof b == 'string') {
    return b.__rmul__(a);
  } else {
    return a * b;
  }
}

;

function __truediv__(a, b) {
  if (_typeof(a) == 'object' && '__truediv__' in a) {
    return a.__truediv__(b);
  } else if (_typeof(b) == 'object' && '__rtruediv__' in b) {
    return b.__rtruediv__(a);
  } else if (_typeof(a) == 'object' && '__div__' in a) {
    return a.__div__(b);
  } else if (_typeof(b) == 'object' && '__rdiv__' in b) {
    return b.__rdiv__(a);
  } else {
    return a / b;
  }
}

;

function __floordiv__(a, b) {
  if (_typeof(a) == 'object' && '__floordiv__' in a) {
    return a.__floordiv__(b);
  } else if (_typeof(b) == 'object' && '__rfloordiv__' in b) {
    return b.__rfloordiv__(a);
  } else if (_typeof(a) == 'object' && '__div__' in a) {
    return a.__div__(b);
  } else if (_typeof(b) == 'object' && '__rdiv__' in b) {
    return b.__rdiv__(a);
  } else {
    return Math.floor(a / b);
  }
}

;

function __add__(a, b) {
  if (_typeof(a) == 'object' && '__add__' in a) {
    return a.__add__(b);
  } else if (_typeof(b) == 'object' && '__radd__' in b) {
    return b.__radd__(a);
  } else {
    return a + b;
  }
}

;

function __sub__(a, b) {
  if (_typeof(a) == 'object' && '__sub__' in a) {
    return a.__sub__(b);
  } else if (_typeof(b) == 'object' && '__rsub__' in b) {
    return b.__rsub__(a);
  } else {
    return a - b;
  }
}

;

function __lshift__(a, b) {
  if (_typeof(a) == 'object' && '__lshift__' in a) {
    return a.__lshift__(b);
  } else if (_typeof(b) == 'object' && '__rlshift__' in b) {
    return b.__rlshift__(a);
  } else {
    return a << b;
  }
}

;

function __rshift__(a, b) {
  if (_typeof(a) == 'object' && '__rshift__' in a) {
    return a.__rshift__(b);
  } else if (_typeof(b) == 'object' && '__rrshift__' in b) {
    return b.__rrshift__(a);
  } else {
    return a >> b;
  }
}

;

function __or__(a, b) {
  if (_typeof(a) == 'object' && '__or__' in a) {
    return a.__or__(b);
  } else if (_typeof(b) == 'object' && '__ror__' in b) {
    return b.__ror__(a);
  } else {
    return a | b;
  }
}

;

function __xor__(a, b) {
  if (_typeof(a) == 'object' && '__xor__' in a) {
    return a.__xor__(b);
  } else if (_typeof(b) == 'object' && '__rxor__' in b) {
    return b.__rxor__(a);
  } else {
    return a ^ b;
  }
}

;

function __and__(a, b) {
  if (_typeof(a) == 'object' && '__and__' in a) {
    return a.__and__(b);
  } else if (_typeof(b) == 'object' && '__rand__' in b) {
    return b.__rand__(a);
  } else {
    return a & b;
  }
}

;

function __eq__(a, b) {
  if (_typeof(a) == 'object' && '__eq__' in a) {
    return a.__eq__(b);
  } else {
    return a == b;
  }
}

;

function __ne__(a, b) {
  if (_typeof(a) == 'object' && '__ne__' in a) {
    return a.__ne__(b);
  } else {
    return a != b;
  }
}

;

function __lt__(a, b) {
  if (_typeof(a) == 'object' && '__lt__' in a) {
    return a.__lt__(b);
  } else {
    return a < b;
  }
}

;

function __le__(a, b) {
  if (_typeof(a) == 'object' && '__le__' in a) {
    return a.__le__(b);
  } else {
    return a <= b;
  }
}

;

function __gt__(a, b) {
  if (_typeof(a) == 'object' && '__gt__' in a) {
    return a.__gt__(b);
  } else {
    return a > b;
  }
}

;

function __ge__(a, b) {
  if (_typeof(a) == 'object' && '__ge__' in a) {
    return a.__ge__(b);
  } else {
    return a >= b;
  }
}

;

function __imatmul__(a, b) {
  if ('__imatmul__' in a) {
    return a.__imatmul__(b);
  } else {
    return a.__matmul__(b);
  }
}

;

function __ipow__(a, b) {
  if (_typeof(a) == 'object' && '__pow__' in a) {
    return a.__ipow__(b);
  } else if (_typeof(a) == 'object' && '__ipow__' in a) {
    return a.__pow__(b);
  } else if (_typeof(b) == 'object' && '__rpow__' in b) {
    return b.__rpow__(a);
  } else {
    return Math.pow(a, b);
  }
}

;

function __ijsmod__(a, b) {
  if (_typeof(a) == 'object' && '__imod__' in a) {
    return a.__ismod__(b);
  } else if (_typeof(a) == 'object' && '__mod__' in a) {
    return a.__mod__(b);
  } else if (_typeof(b) == 'object' && '__rpow__' in b) {
    return b.__rmod__(a);
  } else {
    return a % b;
  }
}

;

function __imod__(a, b) {
  if (_typeof(a) == 'object' && '__imod__' in a) {
    return a.__imod__(b);
  } else if (_typeof(a) == 'object' && '__mod__' in a) {
    return a.__mod__(b);
  } else if (_typeof(b) == 'object' && '__rmod__' in b) {
    return b.__rmod__(a);
  } else {
    return (a % b + b) % b;
  }
}

;

function __imul__(a, b) {
  if (_typeof(a) == 'object' && '__imul__' in a) {
    return a.__imul__(b);
  } else if (_typeof(a) == 'object' && '__mul__' in a) {
    return a = a.__mul__(b);
  } else if (_typeof(b) == 'object' && '__rmul__' in b) {
    return a = b.__rmul__(a);
  } else if (typeof a == 'string') {
    return a = a.__mul__(b);
  } else if (typeof b == 'string') {
    return a = b.__rmul__(a);
  } else {
    return a *= b;
  }
}

;

function __idiv__(a, b) {
  if (_typeof(a) == 'object' && '__idiv__' in a) {
    return a.__idiv__(b);
  } else if (_typeof(a) == 'object' && '__div__' in a) {
    return a = a.__div__(b);
  } else if (_typeof(b) == 'object' && '__rdiv__' in b) {
    return a = b.__rdiv__(a);
  } else {
    return a /= b;
  }
}

;

function __iadd__(a, b) {
  if (_typeof(a) == 'object' && '__iadd__' in a) {
    return a.__iadd__(b);
  } else if (_typeof(a) == 'object' && '__add__' in a) {
    return a = a.__add__(b);
  } else if (_typeof(b) == 'object' && '__radd__' in b) {
    return a = b.__radd__(a);
  } else {
    return a += b;
  }
}

;

function __isub__(a, b) {
  if (_typeof(a) == 'object' && '__isub__' in a) {
    return a.__isub__(b);
  } else if (_typeof(a) == 'object' && '__sub__' in a) {
    return a = a.__sub__(b);
  } else if (_typeof(b) == 'object' && '__rsub__' in b) {
    return a = b.__rsub__(a);
  } else {
    return a -= b;
  }
}

;

function __ilshift__(a, b) {
  if (_typeof(a) == 'object' && '__ilshift__' in a) {
    return a.__ilshift__(b);
  } else if (_typeof(a) == 'object' && '__lshift__' in a) {
    return a = a.__lshift__(b);
  } else if (_typeof(b) == 'object' && '__rlshift__' in b) {
    return a = b.__rlshift__(a);
  } else {
    return a <<= b;
  }
}

;

function __irshift__(a, b) {
  if (_typeof(a) == 'object' && '__irshift__' in a) {
    return a.__irshift__(b);
  } else if (_typeof(a) == 'object' && '__rshift__' in a) {
    return a = a.__rshift__(b);
  } else if (_typeof(b) == 'object' && '__rrshift__' in b) {
    return a = b.__rrshift__(a);
  } else {
    return a >>= b;
  }
}

;

function __ior__(a, b) {
  if (_typeof(a) == 'object' && '__ior__' in a) {
    return a.__ior__(b);
  } else if (_typeof(a) == 'object' && '__or__' in a) {
    return a = a.__or__(b);
  } else if (_typeof(b) == 'object' && '__ror__' in b) {
    return a = b.__ror__(a);
  } else {
    return a |= b;
  }
}

;

function __ixor__(a, b) {
  if (_typeof(a) == 'object' && '__ixor__' in a) {
    return a.__ixor__(b);
  } else if (_typeof(a) == 'object' && '__xor__' in a) {
    return a = a.__xor__(b);
  } else if (_typeof(b) == 'object' && '__rxor__' in b) {
    return a = b.__rxor__(a);
  } else {
    return a ^= b;
  }
}

;

function __iand__(a, b) {
  if (_typeof(a) == 'object' && '__iand__' in a) {
    return a.__iand__(b);
  } else if (_typeof(a) == 'object' && '__and__' in a) {
    return a = a.__and__(b);
  } else if (_typeof(b) == 'object' && '__rand__' in b) {
    return a = b.__rand__(a);
  } else {
    return a &= b;
  }
}

;

function __getitem__(container, key) {
  if (_typeof(container) == 'object' && '__getitem__' in container) {
    return container.__getitem__(key);
  } else if ((typeof container == 'string' || container instanceof Array) && key < 0) {
    return container[container.length + key];
  } else {
    return container[key];
  }
}

;

function __setitem__(container, key, value) {
  if (_typeof(container) == 'object' && '__setitem__' in container) {
    container.__setitem__(key, value);
  } else if ((typeof container == 'string' || container instanceof Array) && key < 0) {
    container[container.length + key] = value;
  } else {
    container[key] = value;
  }
}

;

function __getslice__(container, lower, upper, step) {
  if (_typeof(container) == 'object' && '__getitem__' in container) {
    return container.__getitem__([lower, upper, step]);
  } else {
    return container.__getslice__(lower, upper, step);
  }
}

;

function __setslice__(container, lower, upper, step, value) {
  if (_typeof(container) == 'object' && '__setitem__' in container) {
    container.__setitem__([lower, upper, step], value);
  } else {
    container.__setslice__(lower, upper, step, value);
  }
}

;

var BaseException = __class__('BaseException', [object], {
  __module__: __name__
});

exports.BaseException = BaseException;

var Exception = __class__('Exception', [BaseException], {
  __module__: __name__,

  get __init__() {
    return __get__(this, function (self) {
      var kwargs = dict();

      if (arguments.length) {
        var __ilastarg0__ = arguments.length - 1;

        if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
          var __allkwargs0__ = arguments[__ilastarg0__--];

          for (var __attrib0__ in __allkwargs0__) {
            switch (__attrib0__) {
              case 'self':
                var self = __allkwargs0__[__attrib0__];
                break;

              default:
                kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
            }
          }

          delete kwargs.__kwargtrans__;
        }

        var args = tuple([].slice.apply(arguments).slice(1, __ilastarg0__ + 1));
      } else {
        var args = tuple();
      }

      self.__args__ = args;

      try {
        self.stack = kwargs.error.stack;
      } catch (__except0__) {
        self.stack = 'No stack trace available';
      }
    });
  },

  get __repr__() {
    return __get__(this, function (self) {
      if (len(self.__args__) > 1) {
        return '{}{}'.format(self.__class__.__name__, repr(tuple(self.__args__)));
      } else if (len(self.__args__)) {
        return '{}({})'.format(self.__class__.__name__, repr(self.__args__[0]));
      } else {
        return '{}()'.format(self.__class__.__name__);
      }
    });
  },

  get __str__() {
    return __get__(this, function (self) {
      if (len(self.__args__) > 1) {
        return str(tuple(self.__args__));
      } else if (len(self.__args__)) {
        return str(self.__args__[0]);
      } else {
        return '';
      }
    });
  }

});

exports.Exception = Exception;

var IterableError = __class__('IterableError', [Exception], {
  __module__: __name__,

  get __init__() {
    return __get__(this, function (self, error) {
      Exception.__init__(self, "Can't iterate over non-iterable", __kwargtrans__({
        error: error
      }));
    });
  }

});

exports.IterableError = IterableError;

var StopIteration = __class__('StopIteration', [Exception], {
  __module__: __name__,

  get __init__() {
    return __get__(this, function (self, error) {
      Exception.__init__(self, 'Iterator exhausted', __kwargtrans__({
        error: error
      }));
    });
  }

});

exports.StopIteration = StopIteration;

var ValueError = __class__('ValueError', [Exception], {
  __module__: __name__,

  get __init__() {
    return __get__(this, function (self, message, error) {
      Exception.__init__(self, message, __kwargtrans__({
        error: error
      }));
    });
  }

});

exports.ValueError = ValueError;

var KeyError = __class__('KeyError', [Exception], {
  __module__: __name__,

  get __init__() {
    return __get__(this, function (self, message, error) {
      Exception.__init__(self, message, __kwargtrans__({
        error: error
      }));
    });
  }

});

exports.KeyError = KeyError;

var AssertionError = __class__('AssertionError', [Exception], {
  __module__: __name__,

  get __init__() {
    return __get__(this, function (self, message, error) {
      if (message) {
        Exception.__init__(self, message, __kwargtrans__({
          error: error
        }));
      } else {
        Exception.__init__(self, __kwargtrans__({
          error: error
        }));
      }
    });
  }

});

exports.AssertionError = AssertionError;

var NotImplementedError = __class__('NotImplementedError', [Exception], {
  __module__: __name__,

  get __init__() {
    return __get__(this, function (self, message, error) {
      Exception.__init__(self, message, __kwargtrans__({
        error: error
      }));
    });
  }

});

exports.NotImplementedError = NotImplementedError;

var IndexError = __class__('IndexError', [Exception], {
  __module__: __name__,

  get __init__() {
    return __get__(this, function (self, message, error) {
      Exception.__init__(self, message, __kwargtrans__({
        error: error
      }));
    });
  }

});

exports.IndexError = IndexError;

var AttributeError = __class__('AttributeError', [Exception], {
  __module__: __name__,

  get __init__() {
    return __get__(this, function (self, message, error) {
      Exception.__init__(self, message, __kwargtrans__({
        error: error
      }));
    });
  }

});

exports.AttributeError = AttributeError;

var py_TypeError = __class__('py_TypeError', [Exception], {
  __module__: __name__,

  get __init__() {
    return __get__(this, function (self, message, error) {
      Exception.__init__(self, message, __kwargtrans__({
        error: error
      }));
    });
  }

});

exports.py_TypeError = py_TypeError;

var Warning = __class__('Warning', [Exception], {
  __module__: __name__
});

exports.Warning = Warning;

var UserWarning = __class__('UserWarning', [Warning], {
  __module__: __name__
});

exports.UserWarning = UserWarning;

var DeprecationWarning = __class__('DeprecationWarning', [Warning], {
  __module__: __name__
});

exports.DeprecationWarning = DeprecationWarning;

var RuntimeWarning = __class__('RuntimeWarning', [Warning], {
  __module__: __name__
});

exports.RuntimeWarning = RuntimeWarning;

var __sort__ = function __sort__(iterable, key, reverse) {
  if (typeof key == 'undefined' || key != null && key.hasOwnProperty("__kwargtrans__")) {
    ;
    var key = null;
  }

  ;

  if (typeof reverse == 'undefined' || reverse != null && reverse.hasOwnProperty("__kwargtrans__")) {
    ;
    var reverse = false;
  }

  ;

  if (arguments.length) {
    var __ilastarg0__ = arguments.length - 1;

    if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
      var __allkwargs0__ = arguments[__ilastarg0__--];

      for (var __attrib0__ in __allkwargs0__) {
        switch (__attrib0__) {
          case 'iterable':
            var iterable = __allkwargs0__[__attrib0__];
            break;

          case 'key':
            var key = __allkwargs0__[__attrib0__];
            break;

          case 'reverse':
            var reverse = __allkwargs0__[__attrib0__];
            break;
        }
      }
    }
  } else {}

  if (key) {
    iterable.sort(function __lambda__(a, b) {
      if (arguments.length) {
        var __ilastarg0__ = arguments.length - 1;

        if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
          var __allkwargs0__ = arguments[__ilastarg0__--];

          for (var __attrib0__ in __allkwargs0__) {
            switch (__attrib0__) {
              case 'a':
                var a = __allkwargs0__[__attrib0__];
                break;

              case 'b':
                var b = __allkwargs0__[__attrib0__];
                break;
            }
          }
        }
      } else {}

      return key(a) > key(b) ? 1 : -1;
    });
  } else {
    iterable.sort();
  }

  if (reverse) {
    iterable.reverse();
  }
};

exports.__sort__ = __sort__;

var sorted = function sorted(iterable, key, reverse) {
  if (typeof key == 'undefined' || key != null && key.hasOwnProperty("__kwargtrans__")) {
    ;
    var key = null;
  }

  ;

  if (typeof reverse == 'undefined' || reverse != null && reverse.hasOwnProperty("__kwargtrans__")) {
    ;
    var reverse = false;
  }

  ;

  if (arguments.length) {
    var __ilastarg0__ = arguments.length - 1;

    if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
      var __allkwargs0__ = arguments[__ilastarg0__--];

      for (var __attrib0__ in __allkwargs0__) {
        switch (__attrib0__) {
          case 'iterable':
            var iterable = __allkwargs0__[__attrib0__];
            break;

          case 'key':
            var key = __allkwargs0__[__attrib0__];
            break;

          case 'reverse':
            var reverse = __allkwargs0__[__attrib0__];
            break;
        }
      }
    }
  } else {}

  if (py_typeof(iterable) == dict) {
    var result = copy(iterable.py_keys());
  } else {
    var result = copy(iterable);
  }

  __sort__(result, key, reverse);

  return result;
};

exports.sorted = sorted;

var map = function map(func, iterable) {
  return function () {
    var __accu0__ = [];
    var _iteratorNormalCompletion9 = true;
    var _didIteratorError9 = false;
    var _iteratorError9 = undefined;

    try {
      for (var _iterator9 = iterable[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
        var item = _step9.value;

        __accu0__.append(func(item));
      }
    } catch (err) {
      _didIteratorError9 = true;
      _iteratorError9 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
          _iterator9.return();
        }
      } finally {
        if (_didIteratorError9) {
          throw _iteratorError9;
        }
      }
    }

    return __accu0__;
  }();
};

exports.map = map;

var filter = function filter(func, iterable) {
  if (func == null) {
    var func = bool;
  }

  return function () {
    var __accu0__ = [];
    var _iteratorNormalCompletion10 = true;
    var _didIteratorError10 = false;
    var _iteratorError10 = undefined;

    try {
      for (var _iterator10 = iterable[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
        var item = _step10.value;

        if (func(item)) {
          __accu0__.append(item);
        }
      }
    } catch (err) {
      _didIteratorError10 = true;
      _iteratorError10 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
          _iterator10.return();
        }
      } finally {
        if (_didIteratorError10) {
          throw _iteratorError10;
        }
      }
    }

    return __accu0__;
  }();
};

exports.filter = filter;

var divmod = function divmod(n, d) {
  return tuple([Math.floor(n / d), __mod__(n, d)]);
};

exports.divmod = divmod;

var __Terminal__ = __class__('__Terminal__', [object], {
  __module__: __name__,

  get __init__() {
    return __get__(this, function (self) {
      self.buffer = '';

      try {
        self.element = document.getElementById('__terminal__');
      } catch (__except0__) {
        self.element = null;
      }

      if (self.element) {
        self.element.style.overflowX = 'auto';
        self.element.style.boxSizing = 'border-box';
        self.element.style.padding = '5px';
        self.element.innerHTML = '_';
      }
    });
  },

  get print() {
    return __get__(this, function (self) {
      var sep = ' ';
      var end = '\n';

      if (arguments.length) {
        var __ilastarg0__ = arguments.length - 1;

        if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
          var __allkwargs0__ = arguments[__ilastarg0__--];

          for (var __attrib0__ in __allkwargs0__) {
            switch (__attrib0__) {
              case 'self':
                var self = __allkwargs0__[__attrib0__];
                break;

              case 'sep':
                var sep = __allkwargs0__[__attrib0__];
                break;

              case 'end':
                var end = __allkwargs0__[__attrib0__];
                break;
            }
          }
        }

        var args = tuple([].slice.apply(arguments).slice(1, __ilastarg0__ + 1));
      } else {
        var args = tuple();
      }

      self.buffer = '{}{}{}'.format(self.buffer, sep.join(function () {
        var __accu0__ = [];
        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
          for (var _iterator11 = args[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            var arg = _step11.value;

            __accu0__.append(str(arg));
          }
        } catch (err) {
          _didIteratorError11 = true;
          _iteratorError11 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion11 && _iterator11.return != null) {
              _iterator11.return();
            }
          } finally {
            if (_didIteratorError11) {
              throw _iteratorError11;
            }
          }
        }

        return __accu0__;
      }()), end).__getslice__(-4096, null, 1);

      if (self.element) {
        self.element.innerHTML = self.buffer.py_replace('\n', '<br>').py_replace(' ', '&nbsp');
        self.element.scrollTop = self.element.scrollHeight;
      } else {
        console.log(sep.join(function () {
          var __accu0__ = [];
          var _iteratorNormalCompletion12 = true;
          var _didIteratorError12 = false;
          var _iteratorError12 = undefined;

          try {
            for (var _iterator12 = args[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
              var arg = _step12.value;

              __accu0__.append(str(arg));
            }
          } catch (err) {
            _didIteratorError12 = true;
            _iteratorError12 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion12 && _iterator12.return != null) {
                _iterator12.return();
              }
            } finally {
              if (_didIteratorError12) {
                throw _iteratorError12;
              }
            }
          }

          return __accu0__;
        }()));
      }
    });
  },

  get input() {
    return __get__(this, function (self, question) {
      if (arguments.length) {
        var __ilastarg0__ = arguments.length - 1;

        if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
          var __allkwargs0__ = arguments[__ilastarg0__--];

          for (var __attrib0__ in __allkwargs0__) {
            switch (__attrib0__) {
              case 'self':
                var self = __allkwargs0__[__attrib0__];
                break;

              case 'question':
                var question = __allkwargs0__[__attrib0__];
                break;
            }
          }
        }
      } else {}

      self.print('{}'.format(question), __kwargtrans__({
        end: ''
      }));
      var answer = window.prompt('\n'.join(self.buffer.py_split('\n').__getslice__(-8, null, 1)));
      self.print(answer);
      return answer;
    });
  }

});

exports.__Terminal__ = __Terminal__;

var __terminal__ = __Terminal__();

exports.__terminal__ = __terminal__;
var print = __terminal__.print;
exports.print = print;
var input = __terminal__.input;
exports.input = input;
},{}],"__target__/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ONE_HUNDRED = void 0;

var _orgTranscrypt__runtime__ = require("./org.transcrypt.__runtime__.js");

// Transcrypt'ed from Python, 2019-01-21 16:14:54
var __name__ = 'constants';
var ONE_HUNDRED = 100;
exports.ONE_HUNDRED = ONE_HUNDRED;
},{"./org.transcrypt.__runtime__.js":"__target__/org.transcrypt.__runtime__.js"}],"__target__/mymod.grandchildmod.grandchild.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.grandchild_func = void 0;

var _orgTranscrypt__runtime__ = require("./org.transcrypt.__runtime__.js");

var _constants = require("./constants.js");

// Transcrypt'ed from Python, 2019-01-21 16:14:54
var __name__ = 'mymod.grandchildmod.grandchild';

var grandchild_func = function grandchild_func(val) {
  return val + _constants.ONE_HUNDRED;
};

exports.grandchild_func = grandchild_func;
},{"./org.transcrypt.__runtime__.js":"__target__/org.transcrypt.__runtime__.js","./constants.js":"__target__/constants.js"}],"__target__/mymod.grandchildmod.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ONE_HUNDRED", {
  enumerable: true,
  get: function () {
    return _constants.ONE_HUNDRED;
  }
});
exports.grandchildmod_func = void 0;

var _orgTranscrypt__runtime__ = require("./org.transcrypt.__runtime__.js");

var _constants = require("./constants.js");

// Transcrypt'ed from Python, 2019-01-21 16:14:54
var __name__ = 'mymod.grandchildmod';

var grandchildmod_func = function grandchildmod_func(val) {
  return val + _constants.ONE_HUNDRED;
};

exports.grandchildmod_func = grandchildmod_func;
},{"./org.transcrypt.__runtime__.js":"__target__/org.transcrypt.__runtime__.js","./constants.js":"__target__/constants.js"}],"__target__/mymod.child.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.child_func = void 0;

var _orgTranscrypt__runtime__ = require("./org.transcrypt.__runtime__.js");

var _constants = require("./constants.js");

// Transcrypt'ed from Python, 2019-01-21 16:14:54
var __name__ = 'mymod.child';

var child_func = function child_func(val) {
  return val + _constants.ONE_HUNDRED;
};

exports.child_func = child_func;
},{"./org.transcrypt.__runtime__.js":"__target__/org.transcrypt.__runtime__.js","./constants.js":"__target__/constants.js"}],"__target__/mymod.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ONE_HUNDRED", {
  enumerable: true,
  get: function () {
    return _constants.ONE_HUNDRED;
  }
});
exports.mymod_func = void 0;

var _orgTranscrypt__runtime__ = require("./org.transcrypt.__runtime__.js");

var _constants = require("./constants.js");

// Transcrypt'ed from Python, 2019-01-21 16:14:54
var __name__ = 'mymod';

var mymod_func = function mymod_func(val) {
  return val + _constants.ONE_HUNDRED;
};

exports.mymod_func = mymod_func;
},{"./org.transcrypt.__runtime__.js":"__target__/org.transcrypt.__runtime__.js","./constants.js":"__target__/constants.js"}],"__target__/siblingjs.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.siblingjs_func = siblingjs_func;

var _constants = require("./constants.js");

// imported JS function from a sibling file
function siblingjs_func(val) {
  return val + _constants.ONE_HUNDRED;
}
},{"./constants.js":"__target__/constants.js"}],"__target__/sibling2.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sibling2_func = void 0;

var _orgTranscrypt__runtime__ = require("./org.transcrypt.__runtime__.js");

var _constants = require("./constants.js");

// Transcrypt'ed from Python, 2019-01-21 16:14:54
var __name__ = 'sibling2';

var sibling2_func = function sibling2_func(val) {
  return val + _constants.ONE_HUNDRED;
};

exports.sibling2_func = sibling2_func;
},{"./org.transcrypt.__runtime__.js":"__target__/org.transcrypt.__runtime__.js","./constants.js":"__target__/constants.js"}],"__target__/sibling.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sibling_func = void 0;

var _orgTranscrypt__runtime__ = require("./org.transcrypt.__runtime__.js");

var _constants = require("./constants.js");

// Transcrypt'ed from Python, 2019-01-21 16:14:54
var __name__ = 'sibling';

var sibling_func = function sibling_func(val) {
  return val + _constants.ONE_HUNDRED;
};

exports.sibling_func = sibling_func;
},{"./org.transcrypt.__runtime__.js":"__target__/org.transcrypt.__runtime__.js","./constants.js":"__target__/constants.js"}],"__target__/math.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modf = exports.nan = exports.inf = exports.isnan = exports.trunc = exports.ceil = exports.floor = exports.atanh = exports.acosh = exports.asinh = exports.tanh = exports.cosh = exports.sinh = exports.radians = exports.degrees = exports.hypot = exports.atan2 = exports.atan = exports.acos = exports.asin = exports.tan = exports.cos = exports.sin = exports.sqrt = exports.pow = exports.log10 = exports.log2 = exports.log1p = exports.log = exports.expm1 = exports.exp = exports.e = exports.pi = void 0;

var _orgTranscrypt__runtime__ = require("./org.transcrypt.__runtime__.js");

// Transcrypt'ed from Python, 2019-01-21 16:14:54
var __name__ = 'math';
var pi = Math.PI;
exports.pi = pi;
var e = Math.E;
exports.e = e;
var exp = Math.exp;
exports.exp = exp;

var expm1 = function expm1(x) {
  return Math.exp(x) - 1;
};

exports.expm1 = expm1;

var log = function log(x, base) {
  return base === undefined ? Math.log(x) : Math.log(x) / Math.log(base);
};

exports.log = log;

var log1p = function log1p(x) {
  return Math.log(x + 1);
};

exports.log1p = log1p;

var log2 = function log2(x) {
  return Math.log(x) / Math.LN2;
};

exports.log2 = log2;

var log10 = function log10(x) {
  return Math.log(x) / Math.LN10;
};

exports.log10 = log10;
var pow = Math.pow;
exports.pow = pow;
var sqrt = Math.sqrt;
exports.sqrt = sqrt;
var sin = Math.sin;
exports.sin = sin;
var cos = Math.cos;
exports.cos = cos;
var tan = Math.tan;
exports.tan = tan;
var asin = Math.asin;
exports.asin = asin;
var acos = Math.acos;
exports.acos = acos;
var atan = Math.atan;
exports.atan = atan;
var atan2 = Math.atan2;
exports.atan2 = atan2;
var hypot = Math.hypot;
exports.hypot = hypot;

var degrees = function degrees(x) {
  return x * 180 / Math.PI;
};

exports.degrees = degrees;

var radians = function radians(x) {
  return x * Math.PI / 180;
};

exports.radians = radians;
var sinh = Math.sinh;
exports.sinh = sinh;
var cosh = Math.cosh;
exports.cosh = cosh;
var tanh = Math.tanh;
exports.tanh = tanh;
var asinh = Math.asinh;
exports.asinh = asinh;
var acosh = Math.acosh;
exports.acosh = acosh;
var atanh = Math.atanh;
exports.atanh = atanh;
var floor = Math.floor;
exports.floor = floor;
var ceil = Math.ceil;
exports.ceil = ceil;
var trunc = Math.trunc;
exports.trunc = trunc;
var isnan = isNaN;
exports.isnan = isnan;
var inf = Infinity;
exports.inf = inf;
var nan = NaN;
exports.nan = nan;

var modf = function modf(n) {
  var sign = n >= 0 ? 1 : -1;

  var __left0__ = (0, _orgTranscrypt__runtime__.divmod)((0, _orgTranscrypt__runtime__.abs)(n), 1);

  var f = __left0__[0];
  var mod = __left0__[1];
  return (0, _orgTranscrypt__runtime__.tuple)([mod * sign, f * sign]);
};

exports.modf = modf;
},{"./org.transcrypt.__runtime__.js":"__target__/org.transcrypt.__runtime__.js"}],"__target__/random.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shuffle = exports.random = exports.choice = exports.randint = exports.seed = exports._random_integer = exports._fill_array = exports._bitmask3 = exports._bitmask2 = exports._bitmask1 = exports._index = exports._array = void 0;

var _orgTranscrypt__runtime__ = require("./org.transcrypt.__runtime__.js");

var __module_math__ = _interopRequireWildcard(require("./math.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// Transcrypt'ed from Python, 2019-01-21 16:14:54
var math = {};
(0, _orgTranscrypt__runtime__.__nest__)(math, '', __module_math__);
var __name__ = 'random';

var _array = function () {
  var __accu0__ = [];

  for (var i = 0; i < 624; i++) {
    __accu0__.append(0);
  }

  return __accu0__;
}();

exports._array = _array;
var _index = 0;
exports._index = _index;

var _bitmask1 = Math.pow(2, 32) - 1;

exports._bitmask1 = _bitmask1;

var _bitmask2 = Math.pow(2, 31);

exports._bitmask2 = _bitmask2;

var _bitmask3 = Math.pow(2, 31) - 1;

exports._bitmask3 = _bitmask3;

var _fill_array = function _fill_array() {
  for (var i = 0; i < 624; i++) {
    var y = (_array[i] & _bitmask2) + (_array[(0, _orgTranscrypt__runtime__.__mod__)(i + 1, 624)] & _bitmask3);

    _array[i] = _array[(0, _orgTranscrypt__runtime__.__mod__)(i + 397, 624)] ^ y >> 1;

    if ((0, _orgTranscrypt__runtime__.__mod__)(y, 2) != 0) {
      _array[i] ^= 2567483615;
    }
  }
};

exports._fill_array = _fill_array;

var _random_integer = function _random_integer() {
  if (_index == 0) {
    _fill_array();
  }

  var y = _array[_index];
  y ^= y >> 11;
  y ^= y << 7 & 2636928640;
  y ^= y << 15 & 4022730752;
  y ^= y >> 18;
  exports._index = _index = (0, _orgTranscrypt__runtime__.__mod__)(_index + 1, 624);
  return y;
};

exports._random_integer = _random_integer;

var seed = function seed(x) {
  if (typeof x == 'undefined' || x != null && x.hasOwnProperty("__kwargtrans__")) {
    ;
    var x = (0, _orgTranscrypt__runtime__.int)(_bitmask3 * Math.random());
  }

  ;
  _array[0] = x;

  for (var i = 1; i < 624; i++) {
    _array[i] = (1812433253 * _array[i - 1] ^ (_array[i - 1] >> 30) + i) & _bitmask1;
  }
};

exports.seed = seed;

var randint = function randint(a, b) {
  return a + (0, _orgTranscrypt__runtime__.__mod__)(_random_integer(), b - a + 1);
};

exports.randint = randint;

var choice = function choice(seq) {
  return seq[randint(0, (0, _orgTranscrypt__runtime__.len)(seq) - 1)];
};

exports.choice = choice;

var random = function random() {
  return _random_integer() / _bitmask3;
};

exports.random = random;

var shuffle = function shuffle(x) {
  for (var i = (0, _orgTranscrypt__runtime__.len)(x) - 1; i > 0; i--) {
    var j = math.floor(random() * (i + 1));
    var temp = x[i];
    x[i] = x[j];
    x[j] = temp;
  }
};

exports.shuffle = shuffle;
seed();
},{"./org.transcrypt.__runtime__.js":"__target__/org.transcrypt.__runtime__.js","./math.js":"__target__/math.js"}],"__target__/testcontext.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Test = void 0;

var _orgTranscrypt__runtime__ = require("./org.transcrypt.__runtime__.js");

var _constants = require("./constants.js");

var __module_random__ = _interopRequireWildcard(require("./random.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// Transcrypt'ed from Python, 2019-01-21 16:14:54
var random = {};
(0, _orgTranscrypt__runtime__.__nest__)(random, '', __module_random__);
var __name__ = 'testcontext';
var Test = (0, _orgTranscrypt__runtime__.__class__)('Test', [_orgTranscrypt__runtime__.object], {
  __module__: __name__,

  get __init__() {
    return (0, _orgTranscrypt__runtime__.__get__)(this, function (self, title) {
      self.title = title;
      self.random_num = random.randint(1, 100);
      self.result = 0;
    });
  },

  get __enter__() {
    return (0, _orgTranscrypt__runtime__.__get__)(this, function (self) {
      return self;
    });
  },

  get __exit__() {
    return (0, _orgTranscrypt__runtime__.__get__)(this, function (self, exc_type, exc_value, exc_tb) {
      if (exc_value) {
        console.warn('Fail: {}  { exception raised }'.format(self.title));
        return null;
      }

      var expected_value = self.random_num + _constants.ONE_HUNDRED;

      if (expected_value == self.result) {
        console.log('Pass: {}  { {} == {} }'.format(self.title, expected_value, self.result));
      } else {
        console.warn('Fail: {}  { {} == {} }'.format(self.title, expected_value, self.result));
        console.error('Function did not return correct value. Expected {}, but got {}'.format(expected_value, self.result));
      }
    });
  }

});
exports.Test = Test;
},{"./org.transcrypt.__runtime__.js":"__target__/org.transcrypt.__runtime__.js","./constants.js":"__target__/constants.js","./random.js":"__target__/random.js"}],"__target__/main.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main = void 0;

var _orgTranscrypt__runtime__ = require("./org.transcrypt.__runtime__.js");

var _mymodGrandchildmodGrandchild = require("./mymod.grandchildmod.grandchild.js");

var alias_grandchildmod = _interopRequireWildcard(require("./mymod.grandchildmod.js"));

var __module_mymod_grandchildmod__ = alias_grandchildmod;

var alias_child = _interopRequireWildcard(require("./mymod.child.js"));

var __module_mymod_child__ = alias_child;

var alias_mymod = _interopRequireWildcard(require("./mymod.js"));

var __module_mymod__ = alias_mymod;

var alias_siblingjs = _interopRequireWildcard(require("./siblingjs.js"));

var __module_siblingjs__ = alias_siblingjs;

var _sibling = require("./sibling2.js");

var alias_sibling = _interopRequireWildcard(require("./sibling.js"));

var __module_sibling__ = alias_sibling;

var _testcontext = require("./testcontext.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// Transcrypt'ed from Python, 2019-01-21 18:56:41
var mymod = {};
var sibling = {};
var siblingjs = {};
(0, _orgTranscrypt__runtime__.__nest__)(mymod, 'grandchildmod', __module_mymod_grandchildmod__);
(0, _orgTranscrypt__runtime__.__nest__)(mymod, 'child', __module_mymod_child__);
(0, _orgTranscrypt__runtime__.__nest__)(mymod, '', __module_mymod__);
(0, _orgTranscrypt__runtime__.__nest__)(siblingjs, '', __module_siblingjs__);
(0, _orgTranscrypt__runtime__.__nest__)(sibling, '', __module_sibling__);
var __name__ = '__main__';

var main = function main() {
  var test = (0, _testcontext.Test)('import sibling');

  try {
    test.__enter__();

    test.result = sibling.sibling_func(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('import sibling as alias_sibling');

  try {
    test.__enter__();

    test.result = alias_sibling.sibling_func(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('from sibling import sibling_func');

  try {
    test.__enter__();

    test.result = (0, alias_sibling.sibling_func)(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('from sibling import sibling_func as alias_sibling_func');

  try {
    test.__enter__();

    test.result = (0, alias_sibling.sibling_func)(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('from sibling2 import *');

  try {
    test.__enter__();

    test.result = (0, _sibling.sibling2_func)(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('import siblingjs');

  try {
    test.__enter__();

    test.result = siblingjs.siblingjs_func(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('import siblingjs as alias_siblingjs');

  try {
    test.__enter__();

    test.result = alias_siblingjs.siblingjs_func(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('from siblingjs import siblingjs_func');

  try {
    test.__enter__();

    test.result = (0, alias_siblingjs.siblingjs_func)(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('from siblingjs import siblingjs_func as alias_siblingjs_func');

  try {
    test.__enter__();

    test.result = (0, alias_siblingjs.siblingjs_func)(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('import mymod');

  try {
    test.__enter__();

    test.result = mymod.mymod_func(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('import mymod as alias_mymod');

  try {
    test.__enter__();

    test.result = alias_mymod.mymod_func(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('from mymod import mymod_func');

  try {
    test.__enter__();

    test.result = (0, alias_mymod.mymod_func)(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('from mymod import mymod_func as alias_mymod_func');

  try {
    test.__enter__();

    test.result = (0, alias_mymod.mymod_func)(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('import mymod.child');

  try {
    test.__enter__();

    test.result = mymod.child.child_func(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('alias_child.child_func');

  try {
    test.__enter__();

    test.result = alias_child.child_func(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('from mymod.child import child_func');

  try {
    test.__enter__();

    test.result = (0, alias_child.child_func)(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('from mymod.child import child_func as alias_child_func');

  try {
    test.__enter__();

    test.result = (0, alias_child.child_func)(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('import mymod.grandchildmod');

  try {
    test.__enter__();

    test.result = mymod.grandchildmod.grandchildmod_func(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('import mymod.grandchildmod as alias_grandchildmod');

  try {
    test.__enter__();

    test.result = alias_grandchildmod.grandchildmod_func(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('from mymod.grandchildmod.grandchild import grandchild_func');

  try {
    test.__enter__();

    test.result = (0, _mymodGrandchildmodGrandchild.grandchild_func)(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }

  var test = (0, _testcontext.Test)('from mymod.grandchildmod.grandchild import grandchild_func as alias_grandchild_func');

  try {
    test.__enter__();

    test.result = (0, _mymodGrandchildmodGrandchild.grandchild_func)(test.random_num);

    test.__exit__();
  } catch (__except0__) {
    if (!test.__exit__(__except0__.name, __except0__, __except0__.stack)) {
      throw __except0__;
    }
  }
};

exports.main = main;
},{"./org.transcrypt.__runtime__.js":"__target__/org.transcrypt.__runtime__.js","./mymod.grandchildmod.grandchild.js":"__target__/mymod.grandchildmod.grandchild.js","./mymod.grandchildmod.js":"__target__/mymod.grandchildmod.js","./mymod.child.js":"__target__/mymod.child.js","./mymod.js":"__target__/mymod.js","./siblingjs.js":"__target__/siblingjs.js","./sibling2.js":"__target__/sibling2.js","./sibling.js":"__target__/sibling.js","./testcontext.js":"__target__/testcontext.js"}],"main.py":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _main = require("./__target__/main.js");

Object.keys(_main).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _main[key];
    }
  });
});
},{"./__target__/main.js":"__target__/main.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _main = require("./main.py");

(0, _main.main)();
},{"./main.py":"main.py"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51594" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/example.e31bb0bc.map