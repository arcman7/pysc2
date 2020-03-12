
from operator import itemgetter as _itemgetter, eq as _eq

class ArgumentType(tuple):
        #'ArgumentType(id, name, sizes, fn, values, count)'

        __slots__ = ()

        _fields = ('id', 'name', 'sizes', 'fn', 'values', 'count')

        def __new__(_cls, id, name, sizes, fn, values, count):
            #'Create new instance of ArgumentType(id, name, sizes, fn, values, count)'
            return tuple.__new__(_cls, (id, name, sizes, fn, values, count))

        @classmethod
        def _make(cls, iterable, new=tuple.__new__, len=len):
            #'Make a new ArgumentType object from a sequence or iterable'
            result = new(cls, iterable)
            if len(result) != 6:
                raise TypeError('Expected 6 arguments, got %d' % len(result))
            return result

        def __repr__(self):
            #'Return a nicely formatted representation string'
            return 'ArgumentType(id=%r, name=%r, sizes=%r, fn=%r, values=%r, count=%r)' % self

        def _asdict(self):
            #'Return a new OrderedDict which maps field names to their values'
            return OrderedDict(zip(self._fields, self))

        def _replace(_self, **kwds):
            #'Return a new ArgumentType object replacing specified fields with new values'
            result = _self._make(map(kwds.pop, ('id', 'name', 'sizes', 'fn', 'values', 'count'), _self))
            if kwds:
                raise ValueError('Got unexpected field names: %r' % kwds.keys())
            return result

        def __getnewargs__(self):
            #'Return self as a plain tuple.  Used by copy and pickle.'
            return tuple(self)

        id = property(_itemgetter(0), doc='Alias for field number 0')
        name = property(_itemgetter(1), doc='Alias for field number 1')
        sizes = property(_itemgetter(2), doc='Alias for field number 2')
        fn = property(_itemgetter(3), doc='Alias for field number 3')
        values = property(_itemgetter(4), doc='Alias for field number 4')
        count = property(_itemgetter(5), doc='Alias for field number 5')

class Arguments(tuple):
        #'Arguments(screen, minimap, screen2, queued, control_group_act, control_group_id, select_point_act, select_add, select_unit_act, select_unit_id, select_worker, build_queue_id, unload_id)'

        __slots__ = ()

        _fields = ('screen', 'minimap', 'screen2', 'queued', 'control_group_act', 'control_group_id', 'select_point_act', 'select_add', 'select_unit_act', 'select_unit_id', 'select_worker', 'build_queue_id', 'unload_id')

        def __new__(_cls, screen, minimap, screen2, queued, control_group_act, control_group_id, select_point_act, select_add, select_unit_act, select_unit_id, select_worker, build_queue_id, unload_id):
            #'Create new instance of Arguments(screen, minimap, screen2, queued, control_group_act, control_group_id, select_point_act, select_add, select_unit_act, select_unit_id, select_worker, build_queue_id, unload_id)'
            return tuple.__new__(_cls, (screen, minimap, screen2, queued, control_group_act, control_group_id, select_point_act, select_add, select_unit_act, select_unit_id, select_worker, build_queue_id, unload_id))

        @classmethod
        def _make(cls, iterable, new=tuple.__new__, len=len):
            #'Make a new Arguments object from a sequence or iterable'
            result = new(cls, iterable)
            if len(result) != 13:
                raise TypeError('Expected 13 arguments, got %d' % len(result))
            return result

        def __repr__(self):
            #'Return a nicely formatted representation string'
            return 'Arguments(screen=%r, minimap=%r, screen2=%r, queued=%r, control_group_act=%r, control_group_id=%r, select_point_act=%r, select_add=%r, select_unit_act=%r, select_unit_id=%r, select_worker=%r, build_queue_id=%r, unload_id=%r)' % self

        def _asdict(self):
            #'Return a new OrderedDict which maps field names to their values'
            return OrderedDict(zip(self._fields, self))

        def _replace(_self, **kwds):
            #'Return a new Arguments object replacing specified fields with new values'
            result = _self._make(map(kwds.pop, ('screen', 'minimap', 'screen2', 'queued', 'control_group_act', 'control_group_id', 'select_point_act', 'select_add', 'select_unit_act', 'select_unit_id', 'select_worker', 'build_queue_id', 'unload_id'), _self))
            if kwds:
                raise ValueError('Got unexpected field names: %r' % kwds.keys())
            return result

        def __getnewargs__(self):
            #'Return self as a plain tuple.  Used by copy and pickle.'
            return tuple(self)

        screen = property(_itemgetter(0), doc='Alias for field number 0')
        minimap = property(_itemgetter(1), doc='Alias for field number 1')
        screen2 = property(_itemgetter(2), doc='Alias for field number 2')
        queued = property(_itemgetter(3), doc='Alias for field number 3')
        control_group_act = property(_itemgetter(4), doc='Alias for field number 4')
        control_group_id = property(_itemgetter(5), doc='Alias for field number 5')
        select_point_act = property(_itemgetter(6), doc='Alias for field number 6')
        select_add = property(_itemgetter(7), doc='Alias for field number 7')
        select_unit_act = property(_itemgetter(8), doc='Alias for field number 8')
        select_unit_id = property(_itemgetter(9), doc='Alias for field number 9')
        select_worker = property(_itemgetter(10), doc='Alias for field number 10')
        build_queue_id = property(_itemgetter(11), doc='Alias for field number 11')
        unload_id = property(_itemgetter(12), doc='Alias for field number 12')

class RawArguments(tuple):
        #'RawArguments(world, queued, unit_tags, target_unit_tag)'

        __slots__ = ()

        _fields = ('world', 'queued', 'unit_tags', 'target_unit_tag')

        def __new__(_cls, world, queued, unit_tags, target_unit_tag):
            #'Create new instance of RawArguments(world, queued, unit_tags, target_unit_tag)'
            return tuple.__new__(_cls, (world, queued, unit_tags, target_unit_tag))

        @classmethod
        def _make(cls, iterable, new=tuple.__new__, len=len):
            #'Make a new RawArguments object from a sequence or iterable'
            result = new(cls, iterable)
            if len(result) != 4:
                raise TypeError('Expected 4 arguments, got %d' % len(result))
            return result

        def __repr__(self):
            #'Return a nicely formatted representation string'
            return 'RawArguments(world=%r, queued=%r, unit_tags=%r, target_unit_tag=%r)' % self

        def _asdict(self):
            #'Return a new OrderedDict which maps field names to their values'
            return OrderedDict(zip(self._fields, self))

        def _replace(_self, **kwds):
            #'Return a new RawArguments object replacing specified fields with new values'
            result = _self._make(map(kwds.pop, ('world', 'queued', 'unit_tags', 'target_unit_tag'), _self))
            if kwds:
                raise ValueError('Got unexpected field names: %r' % kwds.keys())
            return result

        def __getnewargs__(self):
            #'Return self as a plain tuple.  Used by copy and pickle.'
            return tuple(self)

        world = property(_itemgetter(0), doc='Alias for field number 0')
        queued = property(_itemgetter(1), doc='Alias for field number 1')
        unit_tags = property(_itemgetter(2), doc='Alias for field number 2')
        target_unit_tag = property(_itemgetter(3), doc='Alias for field number 3')

class Function(tuple):
        #'Function(id, name, ability_id, general_id, function_type, args, avail_fn, raw)'

        __slots__ = ()

        _fields = ('id', 'name', 'ability_id', 'general_id', 'function_type', 'args', 'avail_fn', 'raw')

        def __new__(_cls, id, name, ability_id, general_id, function_type, args, avail_fn, raw):
            #'Create new instance of Function(id, name, ability_id, general_id, function_type, args, avail_fn, raw)'
            return tuple.__new__(_cls, (id, name, ability_id, general_id, function_type, args, avail_fn, raw))

        @classmethod
        def _make(cls, iterable, new=tuple.__new__, len=len):
            #'Make a new Function object from a sequence or iterable'
            result = new(cls, iterable)
            if len(result) != 8:
                raise TypeError('Expected 8 arguments, got %d' % len(result))
            return result

        def __repr__(self):
            #'Return a nicely formatted representation string'
            return 'Function(id=%r, name=%r, ability_id=%r, general_id=%r, function_type=%r, args=%r, avail_fn=%r, raw=%r)' % self

        def _asdict(self):
            #'Return a new OrderedDict which maps field names to their values'
            return OrderedDict(zip(self._fields, self))

        def _replace(_self, **kwds):
            #'Return a new Function object replacing specified fields with new values'
            result = _self._make(map(kwds.pop, ('id', 'name', 'ability_id', 'general_id', 'function_type', 'args', 'avail_fn', 'raw'), _self))
            if kwds:
                raise ValueError('Got unexpected field names: %r' % kwds.keys())
            return result

        def __getnewargs__(self):
            #'Return self as a plain tuple.  Used by copy and pickle.'
            return tuple(self)

        id = property(_itemgetter(0), doc='Alias for field number 0')
        name = property(_itemgetter(1), doc='Alias for field number 1')
        ability_id = property(_itemgetter(2), doc='Alias for field number 2')
        general_id = property(_itemgetter(3), doc='Alias for field number 3')
        function_type = property(_itemgetter(4), doc='Alias for field number 4')
        args = property(_itemgetter(5), doc='Alias for field number 5')
        avail_fn = property(_itemgetter(6), doc='Alias for field number 6')
        raw = property(_itemgetter(7), doc='Alias for field number 7')

class FunctionCall(tuple):
        #'FunctionCall(function, arguments)'

        __slots__ = ()

        _fields = ('function', 'arguments')

        def __new__(_cls, function, arguments):
            #'Create new instance of FunctionCall(function, arguments)'
            return tuple.__new__(_cls, (function, arguments))

        @classmethod
        def _make(cls, iterable, new=tuple.__new__, len=len):
            #'Make a new FunctionCall object from a sequence or iterable'
            result = new(cls, iterable)
            if len(result) != 2:
                raise TypeError('Expected 2 arguments, got %d' % len(result))
            return result

        def __repr__(self):
            #'Return a nicely formatted representation string'
            return 'FunctionCall(function=%r, arguments=%r)' % self

        def _asdict(self):
            #'Return a new OrderedDict which maps field names to their values'
            return OrderedDict(zip(self._fields, self))

        def _replace(_self, **kwds):
            #'Return a new FunctionCall object replacing specified fields with new values'
            result = _self._make(map(kwds.pop, ('function', 'arguments'), _self))
            if kwds:
                raise ValueError('Got unexpected field names: %r' % kwds.keys())
            return result

        def __getnewargs__(self):
            #'Return self as a plain tuple.  Used by copy and pickle.'
            return tuple(self)

        function = property(_itemgetter(0), doc='Alias for field number 0')
        arguments = property(_itemgetter(1), doc='Alias for field number 1')

class ValidActions(tuple):
        #'ValidActions(types, functions)'

        __slots__ = ()

        _fields = ('types', 'functions')

        def __new__(_cls, types, functions):
            #'Create new instance of ValidActions(types, functions)'
            return tuple.__new__(_cls, (types, functions))

        @classmethod
        def _make(cls, iterable, new=tuple.__new__, len=len):
            #'Make a new ValidActions object from a sequence or iterable'
            result = new(cls, iterable)
            if len(result) != 2:
                raise TypeError('Expected 2 arguments, got %d' % len(result))
            return result

        def __repr__(self):
            #'Return a nicely formatted representation string'
            return 'ValidActions(types=%r, functions=%r)' % self

        def _asdict(self):
            #'Return a new OrderedDict which maps field names to their values'
            return OrderedDict(zip(self._fields, self))

        def _replace(_self, **kwds):
            #'Return a new ValidActions object replacing specified fields with new values'
            result = _self._make(map(kwds.pop, ('types', 'functions'), _self))
            if kwds:
                raise ValueError('Got unexpected field names: %r' % kwds.keys())
            return result

        def __getnewargs__(self):
            #'Return self as a plain tuple.  Used by copy and pickle.'
            return tuple(self)

        types = property(_itemgetter(0), doc='Alias for field number 0')
        functions = property(_itemgetter(1), doc='Alias for field number 1')

class Color(tuple):
        #'Color(r, g, b)'

        __slots__ = ()

        _fields = ('r', 'g', 'b')

        def __new__(_cls, r, g, b):
            #'Create new instance of Color(r, g, b)'
            return tuple.__new__(_cls, (r, g, b))

        @classmethod
        def _make(cls, iterable, new=tuple.__new__, len=len):
            #'Make a new Color object from a sequence or iterable'
            result = new(cls, iterable)
            if len(result) != 3:
                raise TypeError('Expected 3 arguments, got %d' % len(result))
            return result

        def __repr__(self):
            #'Return a nicely formatted representation string'
            return 'Color(r=%r, g=%r, b=%r)' % self

        def _asdict(self):
            #'Return a new OrderedDict which maps field names to their values'
            return OrderedDict(zip(self._fields, self))

        def _replace(_self, **kwds):
            #'Return a new Color object replacing specified fields with new values'
            result = _self._make(map(kwds.pop, ('r', 'g', 'b'), _self))
            if kwds:
                raise ValueError('Got unexpected field names: %r' % kwds.keys())
            return result

        def __getnewargs__(self):
            #'Return self as a plain tuple.  Used by copy and pickle.'
            return tuple(self)

        r = property(_itemgetter(0), doc='Alias for field number 0')
        g = property(_itemgetter(1), doc='Alias for field number 1')
        b = property(_itemgetter(2), doc='Alias for field number 2')

class Point(tuple):
        #'Point(x, y)'

        __slots__ = ()

        _fields = ('x', 'y')

        def __new__(_cls, x, y):
            #'Create new instance of Point(x, y)'
            return tuple.__new__(_cls, (float(x), float(y)))

        @classmethod
        def _make(cls, iterable, new=tuple.__new__, len=len):
            #'Make a new Point object from a sequence or iterable'
            result = new(cls, iterable)
            if len(result) != 2:
                raise TypeError('Expected 2 arguments, got %d' % len(result))
            return result

        def __repr__(self):
            #'Return a nicely formatted representation string'
            return 'Point(x=%r, y=%r)' % self

        def _asdict(self):
            #'Return a new OrderedDict which maps field names to their values'
            return OrderedDict(zip(self._fields, self))

        def _replace(_self, **kwds):
            #'Return a new Point object replacing specified fields with new values'
            result = _self._make(map(kwds.pop, ('x', 'y'), _self))
            if kwds:
                raise ValueError('Got unexpected field names: %r' % kwds.keys())
            return result

        def __getnewargs__(self):
            #'Return self as a plain tuple.  Used by copy and pickle.'
            return tuple(self)

        x = property(_itemgetter(0), doc='Alias for field number 0')
        y = property(_itemgetter(1), doc='Alias for field number 1')

class Rect(tuple):
        #'Rect(t, l, b, r)'

        __slots__ = ()

        _fields = ('t', 'l', 'b', 'r')

        def __new__(_cls, t, l, b, r):
            #'Create new instance of Rect(t, l, b, r)'
            return tuple.__new__(_cls, (float(t), float(l), float(b), float(r)))

        @classmethod
        def _make(cls, iterable, new=tuple.__new__, len=len):
            #'Make a new Rect object from a sequence or iterable'
            result = new(cls, iterable)
            if len(result) != 4:
                raise TypeError('Expected 4 arguments, got %d' % len(result))
            return result

        def __repr__(self):
            #'Return a nicely formatted representation string'
            return 'Rect(t=%r, l=%r, b=%r, r=%r)' % self

        def _asdict(self):
            #'Return a new OrderedDict which maps field names to their values'
            return OrderedDict(zip(self._fields, self))

        def _replace(_self, **kwds):
            #'Return a new Rect object replacing specified fields with new values'
            result = _self._make(map(kwds.pop, ('t', 'l', 'b', 'r'), _self))
            if kwds:
                raise ValueError('Got unexpected field names: %r' % kwds.keys())
            return result

        def __getnewargs__(self):
            #'Return self as a plain tuple.  Used by copy and pickle.'
            return tuple(self)

        t = property(_itemgetter(0), doc='Alias for field number 0')
        l = property(_itemgetter(1), doc='Alias for field number 1')
        b = property(_itemgetter(2), doc='Alias for field number 2')
        r = property(_itemgetter(3), doc='Alias for field number 3')

class Feature(tuple):
        #'Feature(index, name, layer_set, full_name, scale, type, palette, clip)'

        __slots__ = ()

        _fields = ('index', 'name', 'layer_set', 'full_name', 'scale', 'type', 'palette', 'clip')

        def __new__(_cls, index, name, layer_set, full_name, scale, type, palette, clip):
            #'Create new instance of Feature(index, name, layer_set, full_name, scale, type, palette, clip)'
            return tuple.__new__(_cls, (index, name, layer_set, full_name, scale, type, palette, clip))

        @classmethod
        def _make(cls, iterable, new=tuple.__new__, len=len):
            #'Make a new Feature object from a sequence or iterable'
            result = new(cls, iterable)
            if len(result) != 8:
                raise TypeError('Expected 8 arguments, got %d' % len(result))
            return result

        def __repr__(self):
            #'Return a nicely formatted representation string'
            return 'Feature(index=%r, name=%r, layer_set=%r, full_name=%r, scale=%r, type=%r, palette=%r, clip=%r)' % self

        def _asdict(self):
            #'Return a new OrderedDict which maps field names to their values'
            return OrderedDict(zip(self._fields, self))

        def _replace(_self, **kwds):
            #'Return a new Feature object replacing specified fields with new values'
            result = _self._make(map(kwds.pop, ('index', 'name', 'layer_set', 'full_name', 'scale', 'type', 'palette', 'clip'), _self))
            if kwds:
                raise ValueError('Got unexpected field names: %r' % kwds.keys())
            return result

        def __getnewargs__(self):
            #'Return self as a plain tuple.  Used by copy and pickle.'
            return tuple(self)

        index = property(_itemgetter(0), doc='Alias for field number 0')
        name = property(_itemgetter(1), doc='Alias for field number 1')
        layer_set = property(_itemgetter(2), doc='Alias for field number 2')
        full_name = property(_itemgetter(3), doc='Alias for field number 3')
        scale = property(_itemgetter(4), doc='Alias for field number 4')
        type = property(_itemgetter(5), doc='Alias for field number 5')
        palette = property(_itemgetter(6), doc='Alias for field number 6')
        clip = property(_itemgetter(7), doc='Alias for field number 7')

class ScreenFeatures(tuple):
        #'ScreenFeatures(height_map, visibility_map, creep, power, player_id, player_relative, unit_type, selected, unit_hit_points, unit_hit_points_ratio, unit_energy, unit_energy_ratio, unit_shields, unit_shields_ratio, unit_density, unit_density_aa, effects, hallucinations, cloaked, blip, buffs, buff_duration, active, build_progress, pathable, buildable, placeholder)'

        __slots__ = ()

        _fields = ('height_map', 'visibility_map', 'creep', 'power', 'player_id', 'player_relative', 'unit_type', 'selected', 'unit_hit_points', 'unit_hit_points_ratio', 'unit_energy', 'unit_energy_ratio', 'unit_shields', 'unit_shields_ratio', 'unit_density', 'unit_density_aa', 'effects', 'hallucinations', 'cloaked', 'blip', 'buffs', 'buff_duration', 'active', 'build_progress', 'pathable', 'buildable', 'placeholder')

        def __new__(_cls, height_map, visibility_map, creep, power, player_id, player_relative, unit_type, selected, unit_hit_points, unit_hit_points_ratio, unit_energy, unit_energy_ratio, unit_shields, unit_shields_ratio, unit_density, unit_density_aa, effects, hallucinations, cloaked, blip, buffs, buff_duration, active, build_progress, pathable, buildable, placeholder):
            #'Create new instance of ScreenFeatures(height_map, visibility_map, creep, power, player_id, player_relative, unit_type, selected, unit_hit_points, unit_hit_points_ratio, unit_energy, unit_energy_ratio, unit_shields, unit_shields_ratio, unit_density, unit_density_aa, effects, hallucinations, cloaked, blip, buffs, buff_duration, active, build_progress, pathable, buildable, placeholder)'
            return tuple.__new__(_cls, (height_map, visibility_map, creep, power, player_id, player_relative, unit_type, selected, unit_hit_points, unit_hit_points_ratio, unit_energy, unit_energy_ratio, unit_shields, unit_shields_ratio, unit_density, unit_density_aa, effects, hallucinations, cloaked, blip, buffs, buff_duration, active, build_progress, pathable, buildable, placeholder))

        @classmethod
        def _make(cls, iterable, new=tuple.__new__, len=len):
            #'Make a new ScreenFeatures object from a sequence or iterable'
            result = new(cls, iterable)
            if len(result) != 27:
                raise TypeError('Expected 27 arguments, got %d' % len(result))
            return result

        def __repr__(self):
            #'Return a nicely formatted representation string'
            return 'ScreenFeatures(height_map=%r, visibility_map=%r, creep=%r, power=%r, player_id=%r, player_relative=%r, unit_type=%r, selected=%r, unit_hit_points=%r, unit_hit_points_ratio=%r, unit_energy=%r, unit_energy_ratio=%r, unit_shields=%r, unit_shields_ratio=%r, unit_density=%r, unit_density_aa=%r, effects=%r, hallucinations=%r, cloaked=%r, blip=%r, buffs=%r, buff_duration=%r, active=%r, build_progress=%r, pathable=%r, buildable=%r, placeholder=%r)' % self

        def _asdict(self):
            #'Return a new OrderedDict which maps field names to their values'
            return OrderedDict(zip(self._fields, self))

        def _replace(_self, **kwds):
            #'Return a new ScreenFeatures object replacing specified fields with new values'
            result = _self._make(map(kwds.pop, ('height_map', 'visibility_map', 'creep', 'power', 'player_id', 'player_relative', 'unit_type', 'selected', 'unit_hit_points', 'unit_hit_points_ratio', 'unit_energy', 'unit_energy_ratio', 'unit_shields', 'unit_shields_ratio', 'unit_density', 'unit_density_aa', 'effects', 'hallucinations', 'cloaked', 'blip', 'buffs', 'buff_duration', 'active', 'build_progress', 'pathable', 'buildable', 'placeholder'), _self))
            if kwds:
                raise ValueError('Got unexpected field names: %r' % kwds.keys())
            return result

        def __getnewargs__(self):
            #'Return self as a plain tuple.  Used by copy and pickle.'
            return tuple(self)

        height_map = property(_itemgetter(0), doc='Alias for field number 0')
        visibility_map = property(_itemgetter(1), doc='Alias for field number 1')
        creep = property(_itemgetter(2), doc='Alias for field number 2')
        power = property(_itemgetter(3), doc='Alias for field number 3')
        player_id = property(_itemgetter(4), doc='Alias for field number 4')
        player_relative = property(_itemgetter(5), doc='Alias for field number 5')
        unit_type = property(_itemgetter(6), doc='Alias for field number 6')
        selected = property(_itemgetter(7), doc='Alias for field number 7')
        unit_hit_points = property(_itemgetter(8), doc='Alias for field number 8')
        unit_hit_points_ratio = property(_itemgetter(9), doc='Alias for field number 9')
        unit_energy = property(_itemgetter(10), doc='Alias for field number 10')
        unit_energy_ratio = property(_itemgetter(11), doc='Alias for field number 11')
        unit_shields = property(_itemgetter(12), doc='Alias for field number 12')
        unit_shields_ratio = property(_itemgetter(13), doc='Alias for field number 13')
        unit_density = property(_itemgetter(14), doc='Alias for field number 14')
        unit_density_aa = property(_itemgetter(15), doc='Alias for field number 15')
        effects = property(_itemgetter(16), doc='Alias for field number 16')
        hallucinations = property(_itemgetter(17), doc='Alias for field number 17')
        cloaked = property(_itemgetter(18), doc='Alias for field number 18')
        blip = property(_itemgetter(19), doc='Alias for field number 19')
        buffs = property(_itemgetter(20), doc='Alias for field number 20')
        buff_duration = property(_itemgetter(21), doc='Alias for field number 21')
        active = property(_itemgetter(22), doc='Alias for field number 22')
        build_progress = property(_itemgetter(23), doc='Alias for field number 23')
        pathable = property(_itemgetter(24), doc='Alias for field number 24')
        buildable = property(_itemgetter(25), doc='Alias for field number 25')
        placeholder = property(_itemgetter(26), doc='Alias for field number 26')


class MinimapFeatures(tuple):
        #'MinimapFeatures(height_map, visibility_map, creep, camera, player_id, player_relative, selected, unit_type, alerts, pathable, buildable)'

        __slots__ = ()

        _fields = ('height_map', 'visibility_map', 'creep', 'camera', 'player_id', 'player_relative', 'selected', 'unit_type', 'alerts', 'pathable', 'buildable')

        def __new__(_cls, height_map, visibility_map, creep, camera, player_id, player_relative, selected, unit_type, alerts, pathable, buildable):
            #'Create new instance of MinimapFeatures(height_map, visibility_map, creep, camera, player_id, player_relative, selected, unit_type, alerts, pathable, buildable)'
            return tuple.__new__(_cls, (height_map, visibility_map, creep, camera, player_id, player_relative, selected, unit_type, alerts, pathable, buildable))

        @classmethod
        def _make(cls, iterable, new=tuple.__new__, len=len):
            #'Make a new MinimapFeatures object from a sequence or iterable'
            result = new(cls, iterable)
            if len(result) != 11:
                raise TypeError('Expected 11 arguments, got %d' % len(result))
            return result

        def __repr__(self):
            #'Return a nicely formatted representation string'
            return 'MinimapFeatures(height_map=%r, visibility_map=%r, creep=%r, camera=%r, player_id=%r, player_relative=%r, selected=%r, unit_type=%r, alerts=%r, pathable=%r, buildable=%r)' % self

        def _asdict(self):
            #'Return a new OrderedDict which maps field names to their values'
            return OrderedDict(zip(self._fields, self))

        def _replace(_self, **kwds):
            #'Return a new MinimapFeatures object replacing specified fields with new values'
            result = _self._make(map(kwds.pop, ('height_map', 'visibility_map', 'creep', 'camera', 'player_id', 'player_relative', 'selected', 'unit_type', 'alerts', 'pathable', 'buildable'), _self))
            if kwds:
                raise ValueError('Got unexpected field names: %r' % kwds.keys())
            return result

        def __getnewargs__(self):
            #'Return self as a plain tuple.  Used by copy and pickle.'
            return tuple(self)

        height_map = property(_itemgetter(0), doc='Alias for field number 0')
        visibility_map = property(_itemgetter(1), doc='Alias for field number 1')
        creep = property(_itemgetter(2), doc='Alias for field number 2')
        camera = property(_itemgetter(3), doc='Alias for field number 3')
        player_id = property(_itemgetter(4), doc='Alias for field number 4')
        player_relative = property(_itemgetter(5), doc='Alias for field number 5')
        selected = property(_itemgetter(6), doc='Alias for field number 6')
        unit_type = property(_itemgetter(7), doc='Alias for field number 7')
        alerts = property(_itemgetter(8), doc='Alias for field number 8')
        pathable = property(_itemgetter(9), doc='Alias for field number 9')
        buildable = property(_itemgetter(10), doc='Alias for field number 10')