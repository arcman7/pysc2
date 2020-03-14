
from _weakrefset import WeakSet
# from abc import ABCMeta, abstractmethod

def _eq(a, b):
    "Same as a == b."
    return a == b

class _itemgetter:
    """
    Return a callable object that fetches the given item(s) from its operand.
    After f = itemgetter(2), the call f(r) returns r[2].
    After g = itemgetter(2, 5, 3), the call g(r) returns (r[2], r[5], r[3])
    """
    __slots__ = ('_items', '_call')

    def __init__(self, item, *items):
        if not items:
            self._items = (item,)
            def func(obj):
                return obj[item]
            self._call = func
        else:
            self._items = items = (item,) + items
            def func(obj):
                return tuple(obj[i] for i in items)
            self._call = func

    def __call__(self, obj):
        return self._call(obj)

    def __repr__(self):
        return '%s.%s(%s)' % (self.__class__.__module__,
                              self.__class__.__name__,
                              ', '.join(map(repr, self._items)))

    def __reduce__(self):
        return self.__class__, self._items

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


class Sized:
    __metaclass__ = ABCMeta

    @abstractmethod
    def __len__(self):
        return 0

    @classmethod
    def __subclasshook__(cls, C):
        if cls is Sized:
            if _hasattr(C, "__len__"):
                return True
        return NotImplemented


class Iterable(metaclass=ABCMeta):

    __slots__ = ()

    @abstractmethod
    def __iter__(self):
        while False:
            yield None

    @classmethod
    def __subclasshook__(cls, C):
        if cls is Iterable:
            return _check_methods(C, "__iter__")
        return NotImplemented


class Iterator(Iterable):

    __slots__ = ()

    @abstractmethod
    def __next__(self):
        'Return the next item from the iterator. When exhausted, raise StopIteration'
        raise StopIteration

    def __iter__(self):
        return self

    @classmethod
    def __subclasshook__(cls, C):
        if cls is Iterator:
            return _check_methods(C, '__iter__', '__next__')
        return NotImplemented


### SEQUENCES ###
class Reversible(Iterable):

    __slots__ = ()

    @abstractmethod
    def __reversed__(self):
        while False:
            yield None

    @classmethod
    def __subclasshook__(cls, C):
        if cls is Reversible:
            return _check_methods(C, "__reversed__", "__iter__")
        return NotImplemented

class Sized(metaclass=ABCMeta):

    __slots__ = ()

    @abstractmethod
    def __len__(self):
        return 0

    @classmethod
    def __subclasshook__(cls, C):
        if cls is Sized:
            return _check_methods(C, "__len__")
        return NotImplemented


class Container(object):
    def __init__(self):
        self.values = {}

    def __getitem__(self, name):
        return self.values[name]

    def __setitem__(self, name, value):
        self.values[name] = value

    def __delitem__(self, name):
        del self.values[name]

    def __iter__(self):
        return iter(self.values)


class Collection(Sized, Iterable, Container):

    __slots__ = ()

    @classmethod
    def __subclasshook__(cls, C):
        if cls is Collection:
            return _check_methods(C,  "__len__", "__iter__", "__contains__")
        return NotImplemented


class Sequence(Reversible, Collection):

    """All the operations on a read-only sequence.
    Concrete subclasses must override __new__ or __init__,
    __getitem__, and __len__.
    """

    __slots__ = ()

    @abstractmethod
    def __getitem__(self, index):
        raise IndexError

    def __iter__(self):
        i = 0
        try:
            while True:
                v = self[i]
                yield v
                i += 1
        except IndexError:
            return

    def __contains__(self, value):
        for v in self:
            if v is value or v == value:
                return True
        return False

    def __reversed__(self):
        for i in reversed(range(len(self))):
            yield self[i]

    def index(self, value, start=0, stop=None):
        '''S.index(value, [start, [stop]]) -> integer -- return first index of value.
           Raises ValueError if the value is not present.
           Supporting start and stop arguments is optional, but
           recommended.
        '''
        if start is not None and start < 0:
            start = max(len(self) + start, 0)
        if stop is not None and stop < 0:
            stop += len(self)

        i = start
        while stop is None or i < stop:
            try:
                v = self[i]
                if v is value or v == value:
                    return i
            except IndexError:
                break
            i += 1
        raise ValueError

    def count(self, value):
        'S.count(value) -> integer -- return number of occurrences of value'
        return sum(1 for v in self if v is value or v == value)

Sequence.register(tuple)
Sequence.register(str)
Sequence.register(range)
Sequence.register(memoryview)

########################################################################
###  Counter
########################################################################

class Counter(dict):
    '''Dict subclass for counting hashable items.  Sometimes called a bag
    or multiset.  Elements are stored as dictionary keys and their counts
    are stored as dictionary values.
    >>> c = Counter('abcdeabcdabcaba')  # count elements from a string
    >>> c.most_common(3)                # three most common elements
    [('a', 5), ('b', 4), ('c', 3)]
    >>> sorted(c)                       # list all unique elements
    ['a', 'b', 'c', 'd', 'e']
    >>> ''.join(sorted(c.elements()))   # list elements with repetitions
    'aaaaabbbbcccdde'
    >>> sum(c.values())                 # total of all counts
    15
    >>> c['a']                          # count of letter 'a'
    5
    >>> for elem in 'shazam':           # update counts from an iterable
    ...     c[elem] += 1                # by adding 1 to each element's count
    >>> c['a']                          # now there are seven 'a'
    7
    >>> del c['b']                      # remove all 'b'
    >>> c['b']                          # now there are zero 'b'
    0
    >>> d = Counter('simsalabim')       # make another counter
    >>> c.update(d)                     # add in the second counter
    >>> c['a']                          # now there are nine 'a'
    9
    >>> c.clear()                       # empty the counter
    >>> c
    Counter()
    Note:  If a count is set to zero or reduced to zero, it will remain
    in the counter until the entry is deleted or the counter is cleared:
    >>> c = Counter('aaabbc')
    >>> c['b'] -= 2                     # reduce the count of 'b' by two
    >>> c.most_common()                 # 'b' is still in, but its count is zero
    [('a', 3), ('c', 1), ('b', 0)]
    '''
    # References:
    #   http://en.wikipedia.org/wiki/Multiset
    #   http://www.gnu.org/software/smalltalk/manual-base/html_node/Bag.html
    #   http://www.demo2s.com/Tutorial/Cpp/0380__set-multiset/Catalog0380__set-multiset.htm
    #   http://code.activestate.com/recipes/259174/
    #   Knuth, TAOCP Vol. II section 4.6.3

    def __init__(*args, **kwds):
        '''Create a new, empty Counter object.  And if given, count elements
        from an input iterable.  Or, initialize the count from another mapping
        of elements to their counts.
        >>> c = Counter()                           # a new, empty counter
        >>> c = Counter('gallahad')                 # a new counter from an iterable
        >>> c = Counter({'a': 4, 'b': 2})           # a new counter from a mapping
        >>> c = Counter(a=4, b=2)                   # a new counter from keyword args
        '''
        if not args:
            raise TypeError("descriptor '__init__' of 'Counter' object "
                            "needs an argument")
        self = args[0]
        args = args[1:]
        if len(args) > 1:
            raise TypeError('expected at most 1 arguments, got %d' % len(args))
        super(Counter, self).__init__()
        self.update(*args, **kwds)

    def __missing__(self, key):
        'The count of elements not in the Counter is zero.'
        # Needed so that self[missing_item] does not raise KeyError
        return 0

    def most_common(self, n=None):
        '''List the n most common elements and their counts from the most
        common to the least.  If n is None, then list all element counts.
        >>> Counter('abcdeabcdabcaba').most_common(3)
        [('a', 5), ('b', 4), ('c', 3)]
        '''
        # Emulate Bag.sortedByCount from Smalltalk
        if n is None:
            return sorted(self.iteritems(), key=_itemgetter(1), reverse=True)
        return _heapq.nlargest(n, self.iteritems(), key=_itemgetter(1))

    def elements(self):
        '''Iterator over elements repeating each as many times as its count.
        >>> c = Counter('ABCABC')
        >>> sorted(c.elements())
        ['A', 'A', 'B', 'B', 'C', 'C']
        # Knuth's example for prime factors of 1836:  2**2 * 3**3 * 17**1
        >>> prime_factors = Counter({2: 2, 3: 3, 17: 1})
        >>> product = 1
        >>> for factor in prime_factors.elements():     # loop over factors
        ...     product *= factor                       # and multiply them
        >>> product
        1836
        Note, if an element's count has been set to zero or is a negative
        number, elements() will ignore it.
        '''
        # Emulate Bag.do from Smalltalk and Multiset.begin from C++.
        return _chain.from_iterable(_starmap(_repeat, self.iteritems()))

    # Override dict methods where necessary

    @classmethod
    def fromkeys(cls, iterable, v=None):
        # There is no equivalent method for counters because setting v=1
        # means that no element can have a count greater than one.
        raise NotImplementedError(
            'Counter.fromkeys() is undefined.  Use Counter(iterable) instead.')

    def update(*args, **kwds):
        '''Like dict.update() but add counts instead of replacing them.
        Source can be an iterable, a dictionary, or another Counter instance.
        >>> c = Counter('which')
        >>> c.update('witch')           # add elements from another iterable
        >>> d = Counter('watch')
        >>> c.update(d)                 # add elements from another counter
        >>> c['h']                      # four 'h' in which, witch, and watch
        4
        '''
        # The regular dict.update() operation makes no sense here because the
        # replace behavior results in the some of original untouched counts
        # being mixed-in with all of the other counts for a mismash that
        # doesn't have a straight-forward interpretation in most counting
        # contexts.  Instead, we implement straight-addition.  Both the inputs
        # and outputs are allowed to contain zero and negative counts.

        if not args:
            raise TypeError("descriptor 'update' of 'Counter' object "
                            "needs an argument")
        self = args[0]
        args = args[1:]
        if len(args) > 1:
            raise TypeError('expected at most 1 arguments, got %d' % len(args))
        iterable = args[0] if args else None
        if iterable is not None:
            if isinstance(iterable, Mapping):
                if self:
                    self_get = self.get
                    for elem, count in iterable.iteritems():
                        self[elem] = self_get(elem, 0) + count
                else:
                    super(Counter, self).update(iterable) # fast path when counter is empty
            else:
                self_get = self.get
                for elem in iterable:
                    self[elem] = self_get(elem, 0) + 1
        if kwds:
            self.update(kwds)

    def subtract(*args, **kwds):
        '''Like dict.update() but subtracts counts instead of replacing them.
        Counts can be reduced below zero.  Both the inputs and outputs are
        allowed to contain zero and negative counts.
        Source can be an iterable, a dictionary, or another Counter instance.
        >>> c = Counter('which')
        >>> c.subtract('witch')             # subtract elements from another iterable
        >>> c.subtract(Counter('watch'))    # subtract elements from another counter
        >>> c['h']                          # 2 in which, minus 1 in witch, minus 1 in watch
        0
        >>> c['w']                          # 1 in which, minus 1 in witch, minus 1 in watch
        -1
        '''
        if not args:
            raise TypeError("descriptor 'subtract' of 'Counter' object "
                            "needs an argument")
        self = args[0]
        args = args[1:]
        if len(args) > 1:
            raise TypeError('expected at most 1 arguments, got %d' % len(args))
        iterable = args[0] if args else None
        if iterable is not None:
            self_get = self.get
            if isinstance(iterable, Mapping):
                for elem, count in iterable.items():
                    self[elem] = self_get(elem, 0) - count
            else:
                for elem in iterable:
                    self[elem] = self_get(elem, 0) - 1
        if kwds:
            self.subtract(kwds)

    def copy(self):
        'Return a shallow copy.'
        return self.__class__(self)

    def __reduce__(self):
        return self.__class__, (dict(self),)

    def __delitem__(self, elem):
        'Like dict.__delitem__() but does not raise KeyError for missing values.'
        if elem in self:
            super(Counter, self).__delitem__(elem)

    def __repr__(self):
        if not self:
            return '%s()' % self.__class__.__name__
        items = ', '.join(map('%r: %r'.__mod__, self.most_common()))
        return '%s({%s})' % (self.__class__.__name__, items)

    # Multiset-style mathematical operations discussed in:
    #       Knuth TAOCP Volume II section 4.6.3 exercise 19
    #       and at http://en.wikipedia.org/wiki/Multiset
    #
    # Outputs guaranteed to only include positive counts.
    #
    # To strip negative and zero counts, add-in an empty counter:
    #       c += Counter()

    def __add__(self, other):
        '''Add counts from two counters.
        >>> Counter('abbb') + Counter('bcc')
        Counter({'b': 4, 'c': 2, 'a': 1})
        '''
        if not isinstance(other, Counter):
            return NotImplemented
        result = Counter()
        for elem, count in self.items():
            newcount = count + other[elem]
            if newcount > 0:
                result[elem] = newcount
        for elem, count in other.items():
            if elem not in self and count > 0:
                result[elem] = count
        return result

    def __sub__(self, other):
        ''' Subtract count, but keep only results with positive counts.
        >>> Counter('abbbc') - Counter('bccd')
        Counter({'b': 2, 'a': 1})
        '''
        if not isinstance(other, Counter):
            return NotImplemented
        result = Counter()
        for elem, count in self.items():
            newcount = count - other[elem]
            if newcount > 0:
                result[elem] = newcount
        for elem, count in other.items():
            if elem not in self and count < 0:
                result[elem] = 0 - count
        return result

    def __or__(self, other):
        '''Union is the maximum of value in either of the input counters.
        >>> Counter('abbb') | Counter('bcc')
        Counter({'b': 3, 'c': 2, 'a': 1})
        '''
        if not isinstance(other, Counter):
            return NotImplemented
        result = Counter()
        for elem, count in self.items():
            other_count = other[elem]
            newcount = other_count if count < other_count else count
            if newcount > 0:
                result[elem] = newcount
        for elem, count in other.items():
            if elem not in self and count > 0:
                result[elem] = count
        return result

    def __and__(self, other):
        ''' Intersection is the minimum of corresponding counts.
        >>> Counter('abbb') & Counter('bcc')
        Counter({'b': 1})
        '''
        if not isinstance(other, Counter):
            return NotImplemented
        result = Counter()
        for elem, count in self.items():
            other_count = other[elem]
            newcount = count if count < other_count else other_count
            if newcount > 0:
                result[elem] = newcount
        return result


### MAPPINGS ###
mappingproxy = type(type.__dict__)

class Mapping(Sized, Iterable, Container):

    __slots__ = ()

    """A Mapping is a generic container for associating key/value
    pairs.
    This class provides concrete generic implementations of all
    methods except for __getitem__, __iter__, and __len__.
    """

    @abstractmethod
    def __getitem__(self, key):
        raise KeyError

    def get(self, key, default=None):
        'D.get(k[,d]) -> D[k] if k in D, else d.  d defaults to None.'
        try:
            return self[key]
        except KeyError:
            return default

    def __contains__(self, key):
        try:
            self[key]
        except KeyError:
            return False
        else:
            return True

    def keys(self):
        "D.keys() -> a set-like object providing a view on D's keys"
        return KeysView(self)

    def items(self):
        "D.items() -> a set-like object providing a view on D's items"
        return ItemsView(self)

    def values(self):
        "D.values() -> an object providing a view on D's values"
        return ValuesView(self)

    def __eq__(self, other):
        if not isinstance(other, Mapping):
            return NotImplemented
        return dict(self.items()) == dict(other.items())

Mapping.register(mappingproxy)


class TimeStep(tuple):
    'TimeStep(step_type, reward, discount, observation)'

    __slots__ = ()

    _fields = ('step_type', 'reward', 'discount', 'observation')

    def __new__(_cls, step_type, reward, discount, observation):
        'Create new instance of TimeStep(step_type, reward, discount, observation)'
        return tuple.__new__(_cls, (step_type, reward, discount, observation))

    @classmethod
    def _make(cls, iterable, new=tuple.__new__, len=len):
        'Make a new TimeStep object from a sequence or iterable'
        result = new(cls, iterable)
        if len(result) != 4:
            raise TypeError('Expected 4 arguments, got %d' % len(result))
        return result

    def __repr__(self):
        'Return a nicely formatted representation string'
        return 'TimeStep(step_type=%r, reward=%r, discount=%r, observation=%r)' % self

    def _asdict(self):
        'Return a new OrderedDict which maps field names to their values'
        return OrderedDict(zip(self._fields, self))

    def _replace(_self, **kwds):
        'Return a new TimeStep object replacing specified fields with new values'
        result = _self._make(map(kwds.pop, ('step_type', 'reward', 'discount', 'observation'), _self))
        if kwds:
            raise ValueError('Got unexpected field names: %r' % kwds.keys())
        return result

    def __getnewargs__(self):
        'Return self as a plain tuple.  Used by copy and pickle.'
        return tuple(self)

    step_type = property(_itemgetter(0), doc='Alias for field number 0')
    reward = property(_itemgetter(1), doc='Alias for field number 1')
    discount = property(_itemgetter(2), doc='Alias for field number 2')
    observation = property(_itemgetter(3), doc='Alias for field number 3')


class Timestep(tuple):
        'Timestep(episode, time, cpu, memory, name)'

        __slots__ = ()

        _fields = ('episode', 'time', 'cpu', 'memory', 'name')

        def __new__(_cls, episode, time, cpu, memory, name):
            'Create new instance of Timestep(episode, time, cpu, memory, name)'
            return tuple.__new__(_cls, (episode, time, cpu, memory, name))

        @classmethod
        def _make(cls, iterable, new=tuple.__new__, len=len):
            'Make a new Timestep object from a sequence or iterable'
            result = new(cls, iterable)
            if len(result) != 5:
                raise TypeError('Expected 5 arguments, got %d' % len(result))
            return result

        def __repr__(self):
            'Return a nicely formatted representation string'
            return 'Timestep(episode=%r, time=%r, cpu=%r, memory=%r, name=%r)' % self

        def _asdict(self):
            'Return a new OrderedDict which maps field names to their values'
            return OrderedDict(zip(self._fields, self))

        def _replace(_self, **kwds):
            'Return a new Timestep object replacing specified fields with new values'
            result = _self._make(map(kwds.pop, ('episode', 'time', 'cpu', 'memory', 'name'), _self))
            if kwds:
                raise ValueError('Got unexpected field names: %r' % kwds.keys())
            return result

        def __getnewargs__(self):
            'Return self as a plain tuple.  Used by copy and pickle.'
            return tuple(self)

        episode = property(_itemgetter(0), doc='Alias for field number 0')
        time = property(_itemgetter(1), doc='Alias for field number 1')
        cpu = property(_itemgetter(2), doc='Alias for field number 2')
        memory = property(_itemgetter(3), doc='Alias for field number 3')
        name = property(_itemgetter(4), doc='Alias for field number 4')