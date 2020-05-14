function _eq(a, b) {
  return a == b
}

class _itemgetter


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
function abstractmethod(funcobj) {
  funcobj.__isabstractmethod__ = True
  return funcobj
}

/*def get_cache_token():
    """Returns the current ABC cache token.
    The token is an opaque object (supporting equality testing) identifying the
    current version of the ABC cache for virtual subclasses. The token changes
    with every call to ``register()`` on any ABC.
    """
    return ABCMeta._abc_invalidation_counter*/
function get_cache_token() {
  return ABCMeta._abc_invalidation_counter
}

class ABCMeta  type {

}