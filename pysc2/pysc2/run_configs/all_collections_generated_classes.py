

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

class Version(tuple):
        'Version(game_version, build_version, data_version, binary)'

        __slots__ = ()

        _fields = ('game_version', 'build_version', 'data_version', 'binary')

        def __new__(_cls, game_version, build_version, data_version, binary):
            'Create new instance of Version(game_version, build_version, data_version, binary)'
            return tuple.__new__(_cls, (game_version, build_version, data_version, binary))

        @classmethod
        def _make(cls, iterable, new=tuple.__new__, len=len):
            'Make a new Version object from a sequence or iterable'
            result = new(cls, iterable)
            if len(result) != 4:
                raise TypeError('Expected 4 arguments, got %d' % len(result))
            return result

        def __repr__(self):
            'Return a nicely formatted representation string'
            return 'Version(game_version=%r, build_version=%r, data_version=%r, binary=%r)' % self

        def _asdict(self):
            'Return a new OrderedDict which maps field names to their values'
            return OrderedDict(zip(self._fields, self))

        def _replace(_self, **kwds):
            'Return a new Version object replacing specified fields with new values'
            result = _self._make(map(kwds.pop, ('game_version', 'build_version', 'data_version', 'binary'), _self))
            if kwds:
                raise ValueError('Got unexpected field names: %r' % kwds.keys())
            return result

        def __getnewargs__(self):
            'Return self as a plain tuple.  Used by copy and pickle.'
            return tuple(self)

        game_version = property(_itemgetter(0), doc='Alias for field number 0')
        build_version = property(_itemgetter(1), doc='Alias for field number 1')
        data_version = property(_itemgetter(2), doc='Alias for field number 2')
        binary = property(_itemgetter(3), doc='Alias for field number 3')