# from p_collections import namedtuple

def abstractmethod(funcobj):
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
    return funcobj

def get_cache_token():
    """Returns the current ABC cache token.
    The token is an opaque object (supporting equality testing) identifying the
    current version of the ABC cache for virtual subclasses. The token changes
    with every call to ``register()`` on any ABC.
    """
    return ABCMeta._abc_invalidation_counter

class ABCMeta(type):
    """Metaclass for defining Abstract Base Classes (ABCs).
    Use this metaclass to create an ABC.  An ABC can be subclassed
    directly, and then acts as a mix-in class.  You can also register
    unrelated concrete classes (even built-in classes) and unrelated
    ABCs as 'virtual subclasses' -- these and their descendants will
    be considered subclasses of the registering ABC by the built-in
    issubclass() function, but the registering ABC won't show up in
    their MRO (Method Resolution Order) nor will method
    implementations defined by the registering ABC be callable (not
    even via super()).
    """

    # A global counter that is incremented each time a class is
    # registered as a virtual subclass of anything.  It forces the
    # negative cache to be cleared before its next use.
    # Note: this counter is private. Use `abc.get_cache_token()` for
    #       external code.
    _abc_invalidation_counter = 0

    def __new__(mcls, name, bases, namespace, **kwargs):
        cls = super().__new__(mcls, name, bases, namespace, **kwargs)
        # Compute set of abstract method names
        abstracts = {name
                     for name, value in namespace.items()
                     if getattr(value, "__isabstractmethod__", False)}
        for base in bases:
            for name in getattr(base, "__abstractmethods__", set()):
                value = getattr(cls, name, None)
                if getattr(value, "__isabstractmethod__", False):
                    abstracts.add(name)
        cls.__abstractmethods__ = frozenset(abstracts)
        # Set up inheritance registry
        cls._abc_registry = WeakSet()
        cls._abc_cache = WeakSet()
        cls._abc_negative_cache = WeakSet()
        cls._abc_negative_cache_version = ABCMeta._abc_invalidation_counter
        return cls

    def register(cls, subclass):
        """Register a virtual subclass of an ABC.
        Returns the subclass, to allow usage as a class decorator.
        """
        if not isinstance(subclass, type):
            raise TypeError("Can only register classes")
        if issubclass(subclass, cls):
            return subclass  # Already a subclass
        # Subtle: test for cycles *after* testing for "already a subclass";
        # this means we allow X.register(X) and interpret it as a no-op.
        if issubclass(cls, subclass):
            # This would create a cycle, which is bad for the algorithm below
            raise RuntimeError("Refusing to create an inheritance cycle")
        cls._abc_registry.add(subclass)
        ABCMeta._abc_invalidation_counter += 1  # Invalidate negative cache
        return subclass

    def _dump_registry(cls, file=None):
        """Debug helper to print the ABC registry."""
        print(f"Class: {cls.__module__}.{cls.__qualname__}", file=file)
        print(f"Inv. counter: {get_cache_token()}", file=file)
        for name in cls.__dict__:
            if name.startswith("_abc_"):
                value = getattr(cls, name)
                if isinstance(value, WeakSet):
                    value = set(value)
                print(f"{name}: {value!r}", file=file)

    def _abc_registry_clear(cls):
        """Clear the registry (for debugging or testing)."""
        cls._abc_registry.clear()

    def _abc_caches_clear(cls):
        """Clear the caches (for debugging or testing)."""
        cls._abc_cache.clear()
        cls._abc_negative_cache.clear()

    def __instancecheck__(cls, instance):
        """Override for isinstance(instance, cls)."""
        # Inline the cache checking
        subclass = instance.__class__
        if subclass in cls._abc_cache:
            return True
        subtype = type(instance)
        if subtype is subclass:
            if (cls._abc_negative_cache_version ==
                ABCMeta._abc_invalidation_counter and
                subclass in cls._abc_negative_cache):
                return False
            # Fall back to the subclass check.
            return cls.__subclasscheck__(subclass)
        return any(cls.__subclasscheck__(c) for c in (subclass, subtype))

    def __subclasscheck__(cls, subclass):
        """Override for issubclass(subclass, cls)."""
        if not isinstance(subclass, type):
            raise TypeError('issubclass() arg 1 must be a class')
        # Check cache
        if subclass in cls._abc_cache:
            return True
        # Check negative cache; may have to invalidate
        if cls._abc_negative_cache_version < ABCMeta._abc_invalidation_counter:
            # Invalidate the negative cache
            cls._abc_negative_cache = WeakSet()
            cls._abc_negative_cache_version = ABCMeta._abc_invalidation_counter
        elif subclass in cls._abc_negative_cache:
            return False
        # Check the subclass hook
        ok = cls.__subclasshook__(subclass)
        if ok is not NotImplemented:
            assert isinstance(ok, bool)
            if ok:
                cls._abc_cache.add(subclass)
            else:
                cls._abc_negative_cache.add(subclass)
            return ok
        # Check if it's a direct subclass
        if cls in getattr(subclass, '__mro__', ()):
            cls._abc_cache.add(subclass)
            return True
        # Check if it's a subclass of a registered class (recursive)
        for rcls in cls._abc_registry:
            if issubclass(subclass, rcls):
                cls._abc_cache.add(subclass)
                return True
        # Check if it's a subclass of a subclass (recursive)
        for scls in cls.__subclasses__():
            if issubclass(subclass, scls):
                cls._abc_cache.add(subclass)
                return True
        # No dice; update negative cache
        cls._abc_negative_cache.add(subclass)
        return False

def recursive_repr(fillvalue='...'):
    'Decorator to make a repr function return fillvalue for a recursive call'

    def decorating_function(user_function):
        repr_running = set()

        def wrapper(self):
            key = id(self), get_ident()
            if key in repr_running:
                return fillvalue
            repr_running.add(key)
            try:
                result = user_function(self)
            finally:
                repr_running.discard(key)
            return result

        # Can't use functools.wraps() here because of bootstrap issues
        wrapper.__module__ = getattr(user_function, '__module__')
        wrapper.__doc__ = getattr(user_function, '__doc__')
        wrapper.__name__ = getattr(user_function, '__name__')
        wrapper.__annotations__ = getattr(user_function, '__annotations__', {})
        return wrapper

    return decorating_function
    
"""functools.py - Tools for working with functions and callable objects
"""
# Python module wrapper for _functools C module
# to allow utilities written in Python to be added
# to the functools module.
# Written by Nick Coghlan <ncoghlan at gmail.com>,
# Raymond Hettinger <python at rcn.com>,
# and Łukasz Langa <lukasz at langa.pl>.
#   Copyright (C) 2006-2013 Python Software Foundation.
# See C source code for _functools credits/copyright



################################################################################
### partial() argument application
################################################################################

# Purely functional, no descriptor behaviour
class partial:
    """New function with partial application of the given arguments
    and keywords.
    """

    __slots__ = "func", "args", "keywords", "__dict__", "__weakref__"

    def __new__(cls, func, *args, **keywords):
        if not callable(func):
            raise TypeError("the first argument must be callable")

        if hasattr(func, "func"):
            args = func.args + args
            keywords = {**func.keywords, **keywords}
            func = func.func

        # self = super(partial, cls).__new__(cls)
        self = super().__new__(cls)

        self.func = func
        self.args = args
        self.keywords = keywords
        return self

    def __call__(self, *args, **keywords):
        keywords = {**self.keywords, **keywords}
        return self.func(*self.args, *args, **keywords)

    @recursive_repr()
    def __repr__(self):
        qualname = type(self).__qualname__
        args = [repr(self.func)]
        args.extend(repr(x) for x in self.args)
        args.extend(f"{k}={v!r}" for (k, v) in self.keywords.items())
        if type(self).__module__ == "functools":
            return f"functools.{qualname}({', '.join(args)})"
        return f"{qualname}({', '.join(args)})"

    def __reduce__(self):
        return type(self), (self.func,), (self.func, self.args,
               self.keywords or None, self.__dict__ or None)

    def __setstate__(self, state):
        if not isinstance(state, tuple):
            raise TypeError("argument to __setstate__ must be a tuple")
        if len(state) != 4:
            raise TypeError(f"expected 4 items in state, got {len(state)}")
        func, args, kwds, namespace = state
        if (not callable(func) or not isinstance(args, tuple) or
           (kwds is not None and not isinstance(kwds, dict)) or
           (namespace is not None and not isinstance(namespace, dict))):
            raise TypeError("invalid partial state")

        args = tuple(args) # just in case it's a subclass
        if kwds is None:
            kwds = {}
        elif type(kwds) is not dict: # XXX does it need to be *exactly* dict?
            kwds = dict(kwds)
        if namespace is None:
            namespace = {}

        self.__dict__ = namespace
        self.func = func
        self.args = args
        self.keywords = kwds


# import types, weakref  # Deferred to single_dispatch()

################################################################################
### update_wrapper() and wraps() decorator
################################################################################

# update_wrapper() and wraps() are tools to help write
# wrapper functions that can handle naive introspection

WRAPPER_ASSIGNMENTS = ('__module__', '__name__', '__qualname__', '__doc__',
                       '__annotations__')
WRAPPER_UPDATES = ('__dict__',)
def update_wrapper(wrapper,
                   wrapped,
                   assigned = WRAPPER_ASSIGNMENTS,
                   updated = WRAPPER_UPDATES):
    """Update a wrapper function to look like the wrapped function
       wrapper is the function to be updated
       wrapped is the original function
       assigned is a tuple naming the attributes assigned directly
       from the wrapped function to the wrapper function (defaults to
       functools.WRAPPER_ASSIGNMENTS)
       updated is a tuple naming the attributes of the wrapper that
       are updated with the corresponding attribute from the wrapped
       function (defaults to functools.WRAPPER_UPDATES)
    """
    for attr in assigned:
        try:
            value = getattr(wrapped, attr)
        except AttributeError:
            pass
        else:
            setattr(wrapper, attr, value)
    for attr in updated:
        getattr(wrapper, attr).update(getattr(wrapped, attr, {}))
    # Issue #17482: set __wrapped__ last so we don't inadvertently copy it
    # from the wrapped function when updating __dict__
    wrapper.__wrapped__ = wrapped
    # Return the wrapper so this can be used as a decorator via partial()
    return wrapper

def wraps(wrapped,
          assigned = WRAPPER_ASSIGNMENTS,
          updated = WRAPPER_UPDATES):
    """Decorator factory to apply update_wrapper() to a wrapper function
       Returns a decorator that invokes update_wrapper() with the decorated
       function as the wrapper argument and the arguments to wraps() as the
       remaining arguments. Default arguments are as for update_wrapper().
       This is a convenience function to simplify applying partial() to
       update_wrapper().
    """
    return partial(update_wrapper, wrapped=wrapped,
                   assigned=assigned, updated=updated)