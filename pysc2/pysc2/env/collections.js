function namedtuple(name, fields) { //eslint-disable-line
  let consLogic = '';
  let consArgs = '';
  fields.forEach((field, i) => {
    consArgs += i < fields.length - 1 ? `${field}, ` : `${field}`;
    consLogic += i < fields.length - 1 ? `this.${field} = ${field};\n    ` : `this.${field} = ${field};`;
  });
  const classStr = `const _fields = ${JSON.stringify(fields)}; return class ${name} extends Array {
  static get classname() { return '${name}' }

  static get _fields() { return ${JSON.stringify(fields)} }

  constructor(${consArgs}) {
    if (typeof arguments[0] === 'object' && arguments.length === 1 && _fields.length > 1) {
      const args = []
      const kwargs = arguments[0]
      _fields.forEach((field, index) => {
        args[index] = kwargs[field]
      })
      super(...args)
      _fields.forEach((field, index) => {
        args[index] = kwargs[field]
        this[field] = kwargs[field]
      })
      return
    }
    super(...arguments)
    ${consLogic}
  }

  static _make(kwargs) {
    return new this.prototype.constructor(kwargs);
  }

  _replace(kwargs) {
    this.constructor._fields.forEach((field) => {
        kwargs[field] = kwargs[field] || this[field];
    });
    return this.constructor._make(kwargs);
  }

  __reduce__() {
    return [this.constructor, this.constructor._fields.map((field) => this[field])];
  }

${fields.map((field, index) => { //eslint-disable-line
    return `  get ${field}() {\n    return this[${index}]\n  }\n  set ${field}(val) {\n    this[${index}] = val; return val\n  }`
  }).join('\n')}
}`;
  return Function(classStr)() //eslint-disable-line
}
// var TimeStep = namedtuple('TimeStep', ['step_type', 'reward', 'discount', 'observation'])
// var TimeStep = namedtuple('TimeStep', ['a', 'b', 'c'])
// var a = new TimeStep(1,2,3)
// var b = new TimeStep({a: 1, b: 2, c: 3 })
// function _eq(a, b) {
//   return a == b
// }

// class _itemgetter {}


/*def abstractmethod(funcobj):
    """A decorator indicating abstract methods.
    Requires that the metaclass is ABCMeta or derived from it.  A
    class that has a metaclass derived from ABCMeta cannot be
    instantiated unless all of its abstract methods are overridden.
    The abstract methods can be called using any of the normal
    'super' call mechanisms.  abstractmethod() may be used to declare
    abstract methods for properties and descriptors.
    Usage:
        class C(metaclass=ABCMeta):
            @abstractmethod
            def my_abstract_method(self, ...):
                ...
    """
    funcobj.__isabstractmethod__ = True
    return funcobj*/
// function abstractmethod(funcobj) {
//   funcobj.__isabstractmethod__ = True
//   return funcobj
// }

/*def get_cache_token():
    """Returns the current ABC cache token.
    The token is an opaque object (supporting equality testing) identifying the
    current version of the ABC cache for virtual subclasses. The token changes
    with every call to ``register()`` on any ABC.
    """
    return ABCMeta._abc_invalidation_counter*/
// function get_cache_token() {
//   return ABCMeta._abc_invalidation_counter
// }

module.exports = {
  namedtuple
}